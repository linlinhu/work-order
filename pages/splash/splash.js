// pages/splash/splash.js
const TAG = '[pages/splash/splash.js]';
var app = getApp();
var updater = require('../../base/modules/updater/updater.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        logo: '/assets/logo.jpg',
        appName: '智慧商城-一体化管理平台',
        appVersion: 'v1.0.0' // 默认值,以api中的配置为准
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (app.api.appVersion) {
            this.setData({
                appVersion: 'v' + app.api.appVersion
            });
        }
        this.check();
    },
    check: function() {
        // 检查app版本更新
        updater.addWxUpdater();

        // 免登陆检查
        var self = this;
        setTimeout(function() {
            // 远程校验(微信手机号绑定)
            self.checkLoginStatus();
        }, 2000);
    },
    /**
     * 检查用户绑定状态,如果已经绑定,无需再登录
     */
    checkLoginStatus: function() {

        // 如果本地已缓存微信用户信息(openId等),则无需网络获取,直接检查绑定状态
        var wxUser = wx.getStorageSync(app.keyConf.STORE_KEY.wxUser);
        if (wxUser && wxUser.openid) {
            console.log(TAG, 'storage found wxUser', wxUser.openid);
            this.getFansBinding(wxUser.openid);
            return;
        }

        // 如果本地已经缓存了app信息,则无需网络获取,直接请求openid信息
        var wxAppInfo = app.store.getItem(app.keyConf.STORE_KEY.wxAppInfo);
        if (wxAppInfo && wxAppInfo.appSecret) {
            this.getWxOpenId();
            return;
        }

        // 以上都不具备,启动整个流程
        this.getWxAppInfo(app.globalData.appId);
    },
    /**
     * 获取小程序的微信信息
     * 包括appSecret,原始id等
     */
    getWxAppInfo: function(appId) {
        var self = this;
        var url = app.api.URL.wxAppInfo + '/' + appId;
        app.api.request({
            url: url,
            success: function(res) {
                console.log(TAG, 'getWxAppInfo', res);
                app.store.setItem(app.keyConf.STORE_KEY.wxAppInfo, res);
                self.getWxOpenId();
            },
            fail: function(e) {
                console.log(TAG, 'getWxAppInfo fail', e);
                var msg = e.message || '网络不给力';
                app.dialog.showToast(msg);
                self.systemDenied();
            }
        });
    },
    /**
     * 获取微信用户openid
     */
    getWxOpenId: function() {
        var self = this;
        wx.login({
            success: function(res) {
                if (!res.code) {
                    self.systemDenied();
                    return;
                }
                // 通过res.code 到开发服务器获取 openid, session_key, unionid
                console.log(TAG, 'wx logig code', res.code);
                var wxAppInfo = app.store.getItem(app.keyConf.STORE_KEY.wxAppInfo);
                self.wxCode2Session({
                    code: res.code,
                    appId: app.globalData.appId,
                    appSecret: wxAppInfo.appSecret
                });
            },
            fail: function(e) {
                console.log(TAG, '获取wx login临时凭证code失败',e);
                var msg = e.message || '网络不给力';
                app.dialog.showToast(msg);
                self.systemDenied();
            }
        });
    },
    /**
     * 获取临时登录凭证,以后续获取openid/unionid
     * 参数对象结构:
     * options: {
     *    code:"微信登录凭证",
     *    appId: "小程序appId",
     *    appSecret: "小程序appSecret"
     * }
     */
    wxCode2Session: function(options) {
        var self = this;
        var url = app.api.URL.wxCode2Session + '/' + options.code;
        app.api.request({
            url: url,
            data: {
                appId: options.appId,
                secret: options.appSecret
            },
            success: function(res) {
                console.log(TAG, 'wxCode2Session res:', res);
                if (res.openid) {
                    wx.setStorageSync(app.keyConf.STORE_KEY.wxUser, res);
                    self.getFansBinding(res.openid);
                } else {
                    console.log(TAG, '获取openid失败', res.errmsg);
                    self.systemDenied();
                }
            },
            fail: function(e) {
                console.log(TAG, 'wxCode2Session 获取openid失败', e);
                var msg = e.message || '网络不给力';
                app.dialog.showToast(msg);
                self.systemDenied();
            }
        });
    },
    /**
     * 获取微信用户在小程序的绑定信息
     */
    getFansBinding: function(openId) {
        if (!openId) return;
        var self = this;
        var url = app.api.URL.getFansBinding;
        app.api.request({
            url: url,
            data: {
                openId: openId
            },
            success: function(res) {
                console.log(TAG, 'getFansBinding:', res);
                // 如果无绑定,服务端返回data中的result为null
                if (res) {
                    self.systemPassed();
                    // var mobile = res.mobile;
                    // app.store.setItem(app.keyConf.STORE_KEY.userPhone, mobile);
                } else {
                    self.systemDenied();
                }
            },
            fail: function(e) {
                console.log(TAG, 'getFansBinding fail', e);
                var msg = e.message || '网络不给力';
                app.dialog.showToast(msg);
                self.systemDenied();
            }
        });
    },
    /**
     * 系统免登陆验证通过,进入app主界面
     */
    systemPassed: function() {
        // 如果业务用户信息不存在
        var userId = app.store.getItem(app.keyConf.STORE_KEY.userId);
        if (!userId) {
            console.log(TAG, '本地缓存业务用户数据缺失,登录');
            this.systemDenied();
            return;
        }
        wx.reLaunch({
            url: '/pages/index'
        });
    },
    /**
     * 系统免登陆验证未通过,进入app登录界面
     */
    systemDenied: function() {
        wx.reLaunch({
            url: '/pages/login/login'
        });
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

    }
})