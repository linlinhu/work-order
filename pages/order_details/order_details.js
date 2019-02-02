// pages/order_details/order_details.js
const TAG = '[pages/order_details/order_details.js]';
var app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

    /**
     * 页面的初始数据
     */
    data: {
        locationType: 1,
        tabs: ["设备详情", "异常定位", "追踪"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        eventStatus: 1, //表示工单的状态，开发阶段 50：待确认； 100:待完成； 150：已完成; 0: 待认领
        btns: [''],
        deviceDetail: null, // 设备详情数据
        deviceDetailListTpl: null, // 设备详情列表MEL模板
        cues: [], //工单的足迹
        abnormal: {}, //异常信息
        btnOper: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this,
            btns = [];

        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                    wiindowH: res.windowHeight
                });
            }
        });

        if (options.eventStatus) {
            that.setData({
                eventStatus: options.eventStatus,
                id: options.id,
                deviceId: options.deviceId,
                workOrderNumber: options.workOrderNumber,
                readStatus: options.readStatus ? options.readStatus : ''
            })
        }
        let eventStatus = that.data.eventStatus;

        if (eventStatus == 100) {
            var abnormalFlock = wx.getStorageSync("abnormalFlock");

            if (abnormalFlock == "维修负责人") {
                if (options.abnormalCode == 60) {
                    btns = [{
                        name: '处理',
                        oper: 'handler'
                    }]
                } else {
                    btns = [{
                            name: '处理',
                            oper: 'handler'
                        },
                        {
                            name: '指派',
                            oper: 'assign'
                        }
                    ]
                }

            } else {
                btns = [{
                    name: '处理',
                    oper: 'handler'
                }]
            }

        } else if (eventStatus == 50) {
            btns = [{
                    name: '接收',
                    oper: 'receive'
                },
                {
                    name: '退回',
                    oper: 'refuse'
                }
            ]
        } else if (eventStatus == 0) {
            btns = [{
                name: '认领',
                oper: 'claim'
            }]
        } else {
            btns = []
        }
        that.setData({
            btns: btns
        })

        // 获取设备详情数据
        this.getDeviceInfo();

        // 获取设备详情MEL模板
        this.getDeviceDetailListTpl();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function(options) {
        var that = this;
        //获取最终数据
        that.getDealHistory(function() {
            if (that.data.readStatus == 0) {
                that.changeReadStatus();
            }
        });


    },
    clickEvent: function(e) {
        let dataset = e.target.dataset,
            url = '';
        this.setData({
            btnOper: dataset.oper
        });
        if (dataset.oper == 'handler') {
            url = '/pages/handler/handler';
        } else if (dataset.oper == 'assign') {
            url = '/pages/assign/select_member/select_member';
        } else if (dataset.oper == 'receive') {
            this.transferOrder('40')
        } else if (dataset.oper == 'claim') {
            this.transferOrder('10')
        }
        if (url) {
            wx.navigateTo({
                url: url
            })
        }
    },
    transferOrder: function(code, memo) {
        var that = this;
        // code 10认领 30回退 40接受
        app.api.transferOrder({
            abnormalId: this.data.id,
            memo: memo,
            code: code
        }, function(res) {
            // if (code == 10) {
            //     wx.navigateBack({
            //         delta: 1
            //     })
            // } else {
            //     wx.navigateTo({
            //         url: '/pages/status/status?eventStatus=' + that.data.eventStatus,
            //     })
            // }
            wx.navigateBack({
                delta: 1
            })

        })
    },
    onRejectSubmit: function(e) {
        this.transferOrder('30', e.detail.value.memo);
    },
    onRejectReset: function(e) {
        this.setData({
            btnOper: ''
        })
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        // if (e.currentTarget.id == 0) {

        // } else if (e.currentTarget.id == 1) {

        // } else if (e.currentTarget.id == 2) {

        // }
    },
    changeLocationType: function() {
        this.setData({
            locationType: this.data.locationType == 1 ? 2 : 1
        })
    },
    // 获取设备信息
    getDeviceInfo: function(params) {
        var that = this;
        app.api.getDeviceInfo({
            data: {
                id: that.data.deviceId
            },
            success: function(res) {
                that.setData({
                    deviceDetail: res ? res : {}
                });

                // 获取mallIdAndAreaId
                that.geMallIdAndAreaId();
            }
        });
    },
    // 获取设备详情MEL列表模板
    getDeviceDetailListTpl: function() {
        var self = this;
        var listTpl = app.store.getItem(app.keyConf.STORE_KEY.deviceDetailListTpl);
        if (listTpl) {
            this.setData({
                deviceDetailListTpl: listTpl
            });
            return;
        }
        app.api.getDeviceDetailListTpl({
            success: function(res) {
                self.setData({
                    deviceDetailListTpl: res
                });
            },
        });
    },
    //获取追踪信息
    getDealHistory: function(callback) {
        var that = this;
        app.api.request({
            url: app.api.URL.getProcessDetailByEventSourceId,
            data: {
                eventId: that.data.id
            },
            success: function(res) {
                res.eventSource.workOrderNumber = that.data.workOrderNumber;
                that.setData({
                    abnormal: res.eventSource,
                    cues: res.appoints ? res.appoints : []
                });
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        })

    },
    //获取areaId与mallId
    geMallIdAndAreaId: function() {
        var that = this,
            deviceDetail = that.data.deviceDetail ? that.data.deviceDetail : {},
            floorId = deviceDetail.floorId;
        if (floorId) {
            app.api.request({
                url: app.api.URL.detailNoStatusFloor,
                data: {
                    floorId: floorId
                },
                success: function(res) {
                    that.setData({
                        mallId: res.mallId,
                        areaId: res.areaId
                    })
                }
            })
        }
    },
    //改变工单的状态
    changeReadStatus: function(readStatus) {
        var that = this;
        readStatus = readStatus ? readStatus : 200;

        app.api.request({
            url: app.api.URL.changeReadStatus,
            data: {
                ids: that.data.id,
                readStatus: readStatus
            },
            success: function(res) {

            }
        })
    },
    //图片预览
    previewImage: function(e) {
        var that = this,
            dataset = e.currentTarget.dataset,
            pictures = this.data.cues[dataset.pindex].dealResult.dealPicture;

        wx.previewImage({
            current: pictures[dataset.index],
            urls: pictures
        })
    }
})