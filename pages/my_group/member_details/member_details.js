// pages/member_details/member_details.js
const TAG = '[pages/member_details/member_details.js]';
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getTeamMemberDetail(options.memberId);
    },
    // 获取用户的详情
    getTeamMemberDetail: function(id) {
        var self = this;
        wx.showLoading();
        app.api.request({
            url: app.api.URL.teamMemberDetail,
            data: {
                userId: id
            },
            success: function(res) {
                wx.hideLoading();
                res.lastName = res.realName[0];
                self.setData({
                    memberInfo: res
                });
            },
            fail: function(e) {
                app.dialog.showToast('网络不给力');
            }
        });
    }
})