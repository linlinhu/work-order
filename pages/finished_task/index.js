var store = require('../../base/modules/storage/store.js');
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
        eventStatus: 150, //工单状态 150：已完成
        selectedTypes: [], //查询类别
        selectedDate:{} //查询日期
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setTypeString();
        this.search();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    timePicker: function(e) {
        this.setData({
            selectedDate:e.detail
        })
        this.search();
    },
    /**
     * 获取已完成工单列表
     */
    getFinishedOrderList: function (p) {
        p = p ? p : {};
        var orders = [],
            userId = wx.getStorageSync("userId"),
            that = this,
            params = p.params ? p.params : {},
            selectedTypes = that.data.selectedTypes,
            selectedDate = that.data.selectedDate;

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
            for (var i = 0; i < len; i++) {
                var type = selectedTypes[i];
                params[type.typeCode] = type.code;
            }
        }
        if (selectedDate.beginTime) {
            params.startDate = selectedDate.beginTime;
            params.endDate = selectedDate.endTime;
        }
        app.api.request({
            url: app.api.URL.taskToBeFinish,
            data: params,
            loading: true,
            success: function (res) {
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
    getOrderDetials: function (e) {
        let that = this,
            dataset = e.currentTarget.dataset,
            url = '/pages/order_details/order_details?id=' + dataset.id + '&eventStatus=' + that.data.eventStatus + '&deviceId=' + dataset.deviceid + '&workOrderNumber=' + dataset.workordernumber;
        console.log('that.data.eventStatus', that.data.eventStatus)
        wx.navigateTo({
            url: url,
        })
    },
    /**
     * selectedTypes转换为typeString
     */
    setTypeString: function (p) {
        var selectedTypes = p ? p : this.data.selectedTypes,
            typeString = reorganizeSearchData.setTypeString(selectedTypes);

        this.setData({
            'params.typeString': typeString
        })
    },
    changeInputVal: function (e) {
        this.setData({
            'params.keyword': e.detail.value
        })
    },
    // 键盘的回车事件
    onKeyboardDone: function (e) {
        this.search();
    },
    //搜索事件
    search: function () {
        var that = this;
        that.setData({
            totalPageNum: 0,
            currentPage: 1
        })
        that.getFinishedOrderList({orders:[]});
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.search();
        wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
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
            that.getFinishedOrderList();
        }
    }
})