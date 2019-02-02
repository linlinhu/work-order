// pages/my_group/my_group.js
const TAG = '[pages/my_group/my_group.js]';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        groups: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getMemberTeam();
    },
    /**
     * 获取我的班组
     */
    getMemberTeam: function() {
        var self = this;
        app.api.request({
            url: app.api.URL.memberTeam,
            loading: true,
            data: {
                userId: app.store.getItem('userId')
            },
            success: function(res) {
                wx.hideLoading();
                // self.onMemberTeamDone(res);
               
                self.setData({
                    groups: res
                })
            },
            fail: function(e) {
                console.log(TAG, 'getMemberTeam fail', e);
                var msg = e.message || '网络不给力';
                app.dialog.showToast(msg);
            }
        });
    },
    /**
     * 获取班组成功
     * 拼接各个系统成一行(废弃,服务端直接返回)
     */
    onMemberTeamDone: function(teams) {
        if (!teams || teams.length == 0) return;
        for (var i = 0; i < teams.length; i++) {
            var team = teams[i];
            var desc = [];
            for (var j = 0; j < team.teamDevice.length; j++) {
                desc.push(team.teamDevice[j].name);
                desc.push('、');
            }
            desc.splice(desc.length - 1, 1);
            team.desc = desc.join('');
        }
        this.setData({
            groups: teams
        })
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

    },
    groupClick: function(e) {
        var dataset = e.currentTarget.dataset
        var teamId = dataset.id;
        var teamName = dataset.name;
        var teamLeader = dataset.leader;
        wx.navigateTo({
            url: '/pages/my_group/member_list/member_list?teamId=' + teamId + '&teamName=' + teamName + '&teamLeader=' + teamLeader
        })
    }
})