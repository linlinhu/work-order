// pages/index.js
const TAG = '[pages/index.js]';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        icons: [{
                name: '待确认',
                icon: 'icon_unsure.png',
                num: '0',
                eventStatus: '50'
            },
            {
                name: '待完成',
                icon: 'icon_unfinish.png',
                num: '0',
                eventStatus: '100'
            },
            {
                name: '被退回',
                icon: 'icon_refuse.png',
                num: '0',
                eventStatus: 'tuihui'
            }
        ],
        list: [{
                name: '我的任务',
                url: '/pages/status/status',
                icon: 'icon_task.png',
                nextModule: 'status',
            },
            {
                name: '去领单',
                url: '/pages/order_center/order_center?eventStatus=0',
                icon: 'icon_lingdan.png',
                nextModule: 'order_center',
            },
            {
                name: '我的指派',
                // url: '/pages/my_assigns/my_assigns',
                url: '/pages/order_center/order_center?eventStatus=-1',
                icon: 'assign.png',
                nextModule: 'order_center'
                
            },
            {
                name: '查询记录',
                url: '/pages/finished_task/index',
                icon: 'icon_history.png',
                nextModule: 'finished_task'
            },
            {
                name: '我的班组',
                url: '/pages/my_group/groups/groups',
                icon: 'icon_class.png',
                nextModule: 'my_group'
            }
        ],
        todayFinishNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let abnormalFlock = wx.getStorageSync('abnormalFlock'),
            that = this,
            icons = that.data.icons,
            list = that.data.list;
        app.globalData.eventType = 1;
        if (abnormalFlock == "维修人员") {
            icons[2] = {
                name: '已完成',
                icon: 'icon_finish.png',
                num: '0',
                eventStatus: '150'
            };
            list.splice(2, 1);
            that.setData({
                icons: icons,
                list: list
            })
        } else if (abnormalFlock != "维修负责人") {}
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.getBasicData();

        // 必要模板的获取
        this.getMelTemplate();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setMyTaskCountByeventStatus();
    },
    /**
     * 性能优化,解决频繁获取模板对性能的影响
     * 获取必要的MEL模板先缓存到本地
     */
    getMelTemplate: function() {
        // 设备详情的模板
        app.api.getDeviceDetailListTpl({
            success: function(res) {
                app.store.setItem(app.keyConf.STORE_KEY.deviceDetailListTpl, res);
            },
        });
    },

    //一次获取多种状态的工单数量
    getAllStatusTaskCount: function(callback) {
        var userId = wx.getStorageSync("userId"),
            params = {};
        params.eventType = app.globalData.eventType;
        params.userId = userId;
        app.api.request({
            url: app.api.URL.getAllStatusTaskCount,
            data: params,
            loading: true,
            success: function(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        })
    },
    //设置首页上的统计数据
    setMyTaskCountByeventStatus: function() {
        var that = this,
            icons = that.data.icons,
            len = icons.length,
            eventStatus;
        that.getAllStatusTaskCount(function(res) {

            for (let i = 0; i < len; i++) {
                eventStatus = icons[i].eventStatus;
                switch (eventStatus) {
                    case 'tuihui':
                        icons[i].num = res.back;
                        break;
                    case '50':
                        icons[i].num = res.waitCheck;
                        break;
                    case '100':
                        icons[i].num = res.doing;
                        break;
                    case '150':
                        icons[i].num = res.finish;
                        break;
                    default:
                        break;
                }
            }
            that.setData({
                icons: icons,
                todayFinishNum: res.toDayCount
            })
        })
    },

    //获取被退回的工单数量
    getBackTaskCount: function(params, callback) {
        var userId = wx.getStorageSync("userId");
        params = params ? params : {};
        params.eventType = app.globalData.eventType;
        params.userId = userId;
        params.eventStatus = 50;
        app.api.request({
            url: app.api.URL.getBackTaskCount,
            data: params,
            loading: true,
            success: function(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        })

    },
    /**
     * 获取维修的子系统
     */
    getSystemType: function(callback) {
        var userId = wx.getStorageSync("userId");
        app.api.request({
            url: app.api.URL.getUnableSystem,
            data: {
                userId: userId
            },
            success: function(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        })
    },
    /**
     * 获取工单类型
     */
    getOrderType: function(callback) {
        app.api.request({
            url: app.api.URL.getEventTypeCode,
            data: {},
            success: function(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        })
    },
    /**
     * 获取流转状态
     */
    getOrderStatus: function(callback) {
        app.api.request({
            url: app.api.URL.getEventCircle,
            data: {},
            success: function(res) {
                if (typeof callback == 'function') {
                    callback(res)
                }
            }
        })
    },
    //获取筛选界面的基础数据
    getBasicData: function() {
        var that = this;

        that.getSystemType(function(res) {
            var temp = res,
                type = {
                    name: '系统类型',
                    code: 'systemCode'
                };
            temp.unshift({
                code: '',
                value: '所有系统'
            })
            type.items = temp;
            app.store.setItem('filter-system', type);
        });

        that.getOrderStatus(function(res) {
            var temp = res,
                type = {
                    name: '流转状态',
                    code: 'circleStatus'
                };
            temp.unshift({
                code: '',
                value: '所有状态'
            });
            type.items = temp;
            app.store.setItem('filter-orderStatus', type)
        })

        that.getOrderType(function(res) {
            var temp = res,
                type = {
                    name: '工单类型',
                    code: 'eventType'
                };
            temp.unshift({
                code: '',
                value: '所有类型'
            });
            type.items = temp;
            app.store.setItem('filter-orderType', type)
        })

    },
    //图标菜单的点击事件
    iconItemClick: function(e) {
        let data = e.detail;
        wx.navigateTo({
            url: '/pages/status/status?eventStatus=' + data.eventstatus
        })
    },
    //行菜单的点击事件
    listItemClick: function(e) {
        let data = e.detail,
            that = this;
        if (data.nextmodule == 'my_group') {
            app.api.request({
                url: app.api.URL.memberTeam,
                loading: true,
                data: {
                    userId: app.store.getItem('userId')
                },
                success: function (res) {
                    if (res.length == 1) {
                        var team = res[0],
                            teamId = team.id,
                            teamName = team.name,
                            teamLeader = team.header;
                        wx.navigateTo({
                            url: '/pages/my_group/member_list/member_list?teamId=' + teamId + '&teamName=' + teamName + '&teamLeader=' + teamLeader
                        })
                    } else {
                        wx.navigateTo({
                            url: data.url
                        })
                    }
                }
            });
            
        } else {
            wx.navigateTo({
                url: data.url
            })
        }
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.setMyTaskCountByeventStatus();
        wx.stopPullDownRefresh();
    },
})