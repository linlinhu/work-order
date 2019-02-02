// pages/handle/handle.js
const TAG = '[pages/handle/handle.js]';
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        btns: [
            { name: '转新单', code: '15' },
            { name: '还未修好', code: '5' },
            { name: '维修完毕', code: '25' }
        ],
        checkItem: {
            text: '异常类型',
            value: '',
            desc: '请选择异常类型'
        },
        orderTemplate: {},
        // 异常类型
        checkItems: [{
                name: '设备调试',
                value: '1'
            },
            {
                name: '真实故障',
                value: '2'
            },
            {
                name: '误报',
                value: '3'
            },
            {
                name: '其他',
                value: '4'
            }
        ],
        showModal: false,
        showHcDetail: 0,
        dealPic: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取工单详情界面的工单对象，渲染工单详情数据
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        this.setData({
            abnormal: prevPage.data.abnormal
        })
        // 基本信息赋值 （针对页面中的隐藏域，需要提交到后台）
        this.setData({
            baseInfo: {
                dealUserId: app.store.getItem('userId'),
                dealUserName: app.store.getItem('userName'),
                dealUserPhone: app.store.getItem('userPhone'),
                abnormalId: this.data.abnormal.id
            }
        });
        // 工单异常类型加载
        this.getEventTypeCode();

        // 获取工单MEL模板
        this.getOrderTemplate();
    },
    getEventTypeCode: function () {
        var self = this;
        var url = app.api.userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/getAbnormalTypeCode';
        app.api.request({
            url: url,
            success: function (res) {
                var checkItems = [];
                res.forEach(function(item) {
                    checkItems.push({
                        name: item.value,
                        value: item.code
                    })
                });
                self.setData({
                    checkItems: checkItems
                })
                
            }
        });
    },
    // 获取工单模板
    getOrderTemplate: function() {
        var self = this;
        app.api.getTaskHandleTpl({
            success: function(res) {
                self.setData({
                    orderTemplate: res
                });
            }
        });
    },
    // 点击弹出异常类型选择模态框
    onExceptionTypeTap: function() {
        var show = !this.data.showModal;
        this.setData({
            showModal: show
        });
    },
    // 异常类型选择回调
    onExceptionTypeSelect: function(e) {
        var checkItem = this.data.checkItem;
        checkItem.desc = e.detail.name;
        var baseInfo = this.data.baseInfo;
        baseInfo.abnormalType = e.detail.value;
        baseInfo.abnormalTypeName = e.detail.name;
        this.setData({
            checkItem: checkItem,
            showModal: false,
            baseInfo: baseInfo
        });
    },
    // 有无耗材选择回调
    onMaterialChange: function (e) {
        var baseInfo = this.data.baseInfo;
        baseInfo.isMaterialConsumption = e.detail.value;
        this.setData({
            showHcDetail: e.detail.value,
            baseInfo: baseInfo
        })
    },
    onChoosedImage: function (e) {
        var baseInfo = this.data.baseInfo;
        baseInfo.dealPicture = e.detail;
    },
    validateTpl: function (formData, success) { // 不由模板控制的验证逻辑
        var tpl = this.data.orderTemplate;
        app.api.validateTpl(tpl, formData, function () {
            var tplGroups = tpl.groups;
            var isMaterialConsumption = formData[tplGroups[3].items[0].itemToken]; // 是否耗材
            var materialDetail = formData[tplGroups[3].items[1].itemToken]; // 耗材详情
            if (isMaterialConsumption == 1 && !materialDetail) { // 有耗材就必须填写耗材详情
                wx.showToast({
                    title: "请填写耗材详情！",
                    icon: 'none'
                });
                return false;
            }
            success()    
        })
        
    },
    onOrderSubmit: function (e) {
        var that = this;
        var baseInfo = that.data.baseInfo;
        var formData = e.detail.value;
        formData.yccltjlx = e.detail.target.dataset.code; // 异常处理类型赋值
        formData.sczp = JSON.stringify(baseInfo.dealPicture);
        that.validateTpl(formData, function() {
            var url = app.api.melHost + '/logdata/' + that.data.orderTemplate.id + '/submit';
            app.api.request({
                url: url,
                method: 'POST',
                header: {
                    'authToken': that.data.orderTemplate.authToken,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    data: JSON.stringify(formData),
                    submitter: app.store.getItem('userPhone'),
                    sync: true
                },
                success: function (res) {
                    var result = res ? JSON.parse(res) : {};
                    if (result.success) {
                        
                        // wx.navigateTo({
                        //     url: '/pages/status/status?eventStatus=150',
                        // })
                        wx.navigateBack({
                            delta: 2
                        })
                    } else {
                        wx.showToast({
                            title: result.message ? result.message : '网络异常',
                            icon: 'none'
                        })
                    }
                }
            });
        });
    }
})