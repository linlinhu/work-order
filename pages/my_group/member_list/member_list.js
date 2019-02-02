// pages/my_group/member_list/member_list.js
const TAG = '[pages/my_group/member_list/member_list.js]';
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        teamId: null,
        teamName: '',
        teamLeader: '',
        members: [],
        query: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var teamId = options.teamId;
        var teamName = options.teamName;
        var teamLeader = options.teamLeader;
        this.setData({
            teamId: teamId,
            teamName: teamName,
            teamLeader: teamLeader,
            'query.teamId': teamId
        });
        this.getTeamMemberList(teamId);
    },
    /**
     * 获取班组成员
     */
    getTeamMemberList: function() {
        this.searchMember();
    },
    /**
     * 转换成项目通讯录的数据结构
     * 备注:目前班组的组长在本地解析
     */
    parseMemberList: function(list) {
        // 班组组长解析:part=10
        /*
        var leader = '';
        for (var i = 0; i < list.length; i++) {
            var member = list[i];
            if (member.part == 10) {
                this.setData({
                    teamLeader: member.realName
                });
                break;
            }
        }*/

        // 通讯录显示数据结构解析
        var members = app.dataParse.parseAsList(list);
        var comContact = this.selectComponent('#memberList');
        comContact.setData({
            listMain: members
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
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    // 搜索栏的取消按钮事件,将结果重置成初始进入的列表数据
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false,
            'query.keyWord': ''
        });
        this.searchMember();
    },
    // 输入框最后边的清空事件
    clearInput: function() {
        this.setData({
            inputVal: "",
            'query.keyWord': ''
        });
        this.searchMember();
    },
    // 输入关键字进行搜索
    inputTyping: function(e) {
        var keyWord = e.detail.value;
        this.setData({
            inputVal: keyWord,
            'query.keyWord': keyWord
        });
        var self = this;
        // var query = this.data.query;
        // query.keyWord = keyWord
        setTimeout(function() {
            self.searchMember(self.data.query);
        }, 1000);
    },
    // 点击查看成员详情
    onMemberSelect: function(e) {
        var memberId = e.detail.id;
        wx.navigateTo({
            url: '/pages/my_group/member_details/member_details?memberId=' + memberId,
        })
    },
    /**
     * 搜索班组的成员列表
     * 关键字keyWord(服务端接口参数)支持姓名和手机号模糊匹配
     */
    searchMember: function(query) {
        query = !query ? this.data.query : query;
        var self = this;
        var url = app.api.URL.teamMemberList;
        wx.showLoading();
        app.api.request({
            url: url,
            data: query,
            success: function(res) {
                wx.hideLoading();
                self.parseMemberList(res.resultList);
            },
            fail: function(e) {
                app.dialog.showToast('网络不给力');
            }
        });
    }
})