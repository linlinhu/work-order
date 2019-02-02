var app = getApp();
Page({
    /** 
     * 页面的初始数据 
     */
    data: {
        select: {},
        keyword: '',
        users: [{
                "realName": "Danica",
                "flock": "维修负责人",
                "mobile": "18508220186",
                "id": 110
            },
            {
                "realName": "Danica6",
                "flock": "维修人员",
                "mobile": "18508220187",
                "id": 116
            }
        ]
    },
    onReady: function() {
        this.getAssignMembers();
    },
    getAssignMembers: function (e) {
        var that = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var keyword = '';
        if (e) {
            keyword = e.detail.value;
        }
        var url = app.api.userHost +  '/api-smart-mall-cloud/api/workOrder/teamGroup/getUserMate';
        app.api.request({
            url: url,
            data: {
                userId: app.store.getItem('userId'),
                systemCode: 'vedio',
                keyWord: keyword
            },
            success: function (users) {
                var assignUsers = [];
                var userId = parseInt(app.store.getItem('userId'));
                users.forEach(function (user) {
                    if (user.id != userId) {
                        assignUsers.push(user);
                    }
                });
                var cp = that.selectComponent('#select_members');
                cp.setData({
                    listMain: app.dataParse.parseAsList(assignUsers)
                })
            }
        })

    },
    memberChosen: function(e) {
        this.setData({
            select: e.detail.select
        })
    },
    btnClick: function(e) {
        if (this.data.select.id) {
           wx.navigateTo({
               url: '/pages/assign/handler/handler',
           }) 
        } else {
            wx.showToast({
                title: '请选择要指派的人员！',
                icon: 'none'
            })
            setTimeout(function() {
                wx.hideToast();
            }, 5000);
        }
    }
})