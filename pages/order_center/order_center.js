// pages/order_center/order_center.js
//搜索时间段转换、搜索类型转换
var reorganizeSearchData = require("../../modules/reorganizeSearchData.js");
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        params: {
            typeString: '全部', //查询类别的显示内容
            keyword: '',
        },
        orders: [], //工单列表
        eventStatus: 0, //工单状态 0：待领单，-1：我的指派
        selectedTypes: [] //查询类别
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this,
            eventStatus = options.eventStatus ? options.eventStatus : 0,
            type = 2,
            params = {},
            url = '';

        that.setData({
            eventStatus: eventStatus
        });

        if (eventStatus == 0) {
            wx.setNavigationBarTitle({
                title: '领单'
            })
            url = app.api.URL.toBeConfirmed;
        } else if (eventStatus == -1) {

            wx.setNavigationBarTitle({
                title: '我的指派'
            })
            url = app.api.URL.pageMyDesignate;
        }
        that.setData({
            url: url
        })
        this.setTypeString();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(e) {
        this.setTypeString();
        this.search();
    },
    /**
     * 获取领单或者指派列表
     */
    getOrderCenterOrMyAssignList: function(p) {
        p = p ? p : {};
        var orders = [],
            userId = wx.getStorageSync("userId"),
            that = this,
            url = that.data.url,
            params = p.params ? p.params : {},
            selectedTypes = that.data.selectedTypes;

        params.eventType = app.globalData.eventType;
        params.userId = userId;
        params.keyword = that.data.params.keyword;
        params.eventStatus = that.data.eventStatus;
        params.page = that.data.currentPage ? that.data.currentPage : 1;
        params.limit = 10;
        params.sort = 'lastModifyTime';
        params.order = 'desc';
        that.loading = true;
        orders = p.orders ? p.orders : that.data.orders;
        if (selectedTypes != []) {
            var len = selectedTypes.length;
            if (that.data.eventStatus == 0) {
                let keyMapParam = {};
                for (var i = 0; i < len; i++) {
                    var type = selectedTypes[i];
                    keyMapParam[type.typeCode] = type.code;
                }
                params.keyMapParam = JSON.stringify(keyMapParam);
            } else {
                for (var i = 0; i < len; i++) {
                    var type = selectedTypes[i];
                    params[type.typeCode] = type.code;
                }
            }
            
        }
        app.api.request({
            url: url,
            data: params,
            loading : true,
            success: function(res) {
                var resultList = res.resultList,
                    len = resultList.length;
                that.loading = false;
                for (var i = 0; i < len; i++) {
                    orders.push(resultList[i])
                }
                that.setData({
                    orders: orders,
                    totalPageNum: res.totalPageNum,
                    currentPage: res.currentPage
                })
            }
        })
    },
    /**
     * 跳转去详情界面
     */
    getOrderDetials: function(e) {
        let that = this,
            dataset = e.currentTarget.dataset,
            url = '/pages/order_details/order_details?id=' + dataset.id + '&eventStatus=' + that.data.eventStatus + '&deviceId=' + dataset.deviceid + '&workOrderNumber=' + dataset.workordernumber + '&readStatus=' + dataset.readstatus;
        wx.navigateTo({
            url: url,
        })
    },
    /**
     * selectedTypes转换为typeString
     */
    setTypeString: function(p) {
        var selectedTypes = p ? p : this.data.selectedTypes,
            typeString = reorganizeSearchData.setTypeString(selectedTypes);

        this.setData({
            'params.typeString': typeString
        })
    },
    changeInputVal: function(e) {
        this.setData({
            'params.keyword': e.detail.value
        })
    },
    // 键盘的回车事件
    onKeyboardDone: function(e) {
        this.search();
    },
    //搜索事件
    search: function() {
        var that = this;
        that.setData({
            totalPageNum: 0,
            currentPage: 1
        })
        that.getOrderCenterOrMyAssignList({orders:[]});
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.search();
        wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this,
            page = that.data.currentPage,
            totalPageNum = that.data.totalPageNum;
        // 下拉触底，先判断是否有请求正在进行中
        // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
        if (!that.loading && page < totalPageNum) {
            page += 1;
            that.setData({
                currentPage: page
            })
            that.getOrderCenterOrMyAssignList();
        }
    },

});