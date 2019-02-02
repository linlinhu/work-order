var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tpl: {},
        baseInfo: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var detailPage = pages[pages.length - 3];
        self.setData({
            baseInfo: {
                abnormalId: detailPage.data.id,
                userTo: prevPage.data.select
            }
        });
    },
    selectMember: function(e) {
        wx.navigateBack()
    },
    onAssignSubmit: function(e) {
        var formData = e.detail.value;
        var that = this;
        var baseInfo = that.data.baseInfo;
        app.api.transferOrder({
            abnormalId: baseInfo.abnormalId,
            to: baseInfo.userTo,
            memo: formData.memo,
            code: '20'
        }, function(res) {
            wx.navigateBack({
                delta: 3
            })
        });
        
    }

})