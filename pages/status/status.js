// pages/status/status.js

//工单列表
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var reorganizeSearchData = require("../../modules/reorganizeSearchData.js");
const TAG = '[pages/status/status.js]';
const app = getApp();
Page({
    data: {
        tabs: [{
                name: '待确认',
                eventStatus: '50'
            },
            {
                name: '待完成',
                eventStatus: '100'
            },
            {
                name: '已完成',
                eventStatus: '150'
            },
        ],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        inputShowed: false,
        inputVal: "",
        params: {
            rangeTime: ['12-09', '12-03'],
            typeString: '全部系统',
            keyword: ''
        },
        selectedTypes: [],
        eventStatus: 50,
        type: 2,
        orders: []
    },
    onLoad: function(options) { //options是路由传递的参数
        var that = this,
            eventStatus = options.eventStatus ? options.eventStatus : 50,
            activeIndex = 0,
            windowWidth = 0,
            type = 2,
            abnormalFlock = wx.getStorageSync('abnormalFlock');
        wx.getSystemInfo({
            success: function(res) {
                windowWidth = res.windowWidth;
            }
        });
        if (eventStatus == 100) {
            activeIndex = 1
        } else if (eventStatus == 150) {
            activeIndex = 2
        } else if (eventStatus == 'tuihui') {
            activeIndex = 1;
            that.setData({
                selectedTypes: [{
                    code: "",
                    value: "所有系统",
                    isSelected: true,
                    typeCode: "systemCode"
                }, {
                    code: 100,
                    value: "退回",
                    isSelected: true,
                    typeCode: "circleStatus"
                }]
            })
            eventStatus = 100;
        }
        if (abnormalFlock == "维修负责人") {
            type = 3;
        }
        that.setData({
            sliderLeft: (windowWidth / that.data.tabs.length - sliderWidth) / 2,
            activeIndex: activeIndex,
            sliderOffset: windowWidth / that.data.tabs.length * activeIndex,
            type: type,
            eventStatus: eventStatus
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(e) {
        this.setTypeString();
        this.search();
    },
    tabClick: function(e) {
        let dataset = e.currentTarget.dataset;

        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: dataset.id,
            eventStatus: dataset.eventstatus
        });
        this.searchParamsInit();
        this.getMyOrderList();
    },
    /**
     * 获取任务列表
     */
    getMyOrderList: function(p) {
        p = p ? p : {};
        var orders = [],
            userId = wx.getStorageSync("userId"),
            that = this,
            selectedTypes = that.data.selectedTypes,
            params = p.params ? p.params : {};

        params = params ? params : {};
        params.eventType = app.globalData.eventType;
        params.userId = userId;
        params.keyword = that.data.params.keyword;
        params.page = that.data.currentPage ? that.data.currentPage : 1;
        params.limit = 10;
        params.eventStatus = that.data.eventStatus;
        params.sort = 'lastModifyTime';
        params.order = 'desc';
        orders = p.orders ? p.orders: that.data.orders;
        that.loading = true;
        if (selectedTypes != []) {
            var len = selectedTypes.length;
            for (var i = 0; i < len; i++) {
                var type = selectedTypes[i];
                params[type.typeCode] = type.code;
            }
        }

        app.api.request({
            url: app.api.URL.taskToBeFinish,
            data: params,
            loading: true,
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
            url = '/pages/order_details/order_details?id=' + dataset.id + '&eventStatus=' + that.data.eventStatus + '&deviceId=' + dataset.deviceid + '&workOrderNumber=' + dataset.workordernumber + '&abnormalCode=' + dataset.abnormalcode;
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
    searchParamsInit: function() {
        this.setData({
            selectedTypes: [],
            orders: [],
            totalPageNum: 0,
            currentPage: 1,
            'params.keyword': ''
        })
        this.setTypeString();
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
        that.getMyOrderList({orders:[]});
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
            that.getMyOrderList();
        }
    },
    loadMore: function() {
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
            setTimeout(function() {
                that.getMyOrderList();
            }, 100)

        }
    }

});