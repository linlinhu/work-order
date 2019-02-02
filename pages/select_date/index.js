// pages/common_calendar/index.js
Page({
    data: {
        selectedDate: {}
    },
    onLoad: function() {
        var that = this,
            pages = getCurrentPages(), // 获取页面栈
            prevPage = pages[pages.length - 2], // 上一个页面;
            selectedDate = prevPage.data.selectedDate ? prevPage.data.selectedDate : {};
        if (selectedDate.rangeType && selectedDate.rangeType == 'select') {
            if (selectedDate.endTime == 0) {
                selectedDate.endTime = selectedDate.beginTime;
            }
        }
        that.setData({
            selectedDate: selectedDate
        })
    },
    onMyEvent: function(e) {
        var pages = getCurrentPages(), // 获取页面栈
            prevPage = pages[pages.length - 2]; // 上一个页面;
        prevPage.setData({
            selectedDate: e.detail
        })
        wx.navigateBack({
            delta: 1
        })
    }
})