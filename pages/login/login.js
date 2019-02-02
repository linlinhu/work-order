// pages/login/login.js
const TAG = '[pages/login/login.js]';
const MD5 = require('../../utils/MD5.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        icons: {
            banner: '/assets/login/login_banner.jpg',
            account: '/assets/login/icon_phone.png',
            password: '/assets/login/icon_password.png'
        },
        inputAccount: '',
        inputPassword: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var historyInput = app.store.getItem(app.keyConf.STORE_KEY.userPhone);
        if (historyInput) {
            this.setData({
                inputAccount: historyInput
            });
        }
    },
    // 账号输入监听
    onAccountInput: function(e) {
        this.setData({
            inputAccount: e.detail.value
        });
    },
    // 密码输入监听
    onPasswordInput: function(e) {
        this.setData({
            inputPassword: e.detail.value
        });
    },
    // 输入账号校验
    validateAccount: function(text) {
        if (!text) {
            app.dialog.showToast('请输入账号');
            return false;
        }
        return true;
    },
    // 输入密码校验
    validatePassword: function(pwd) {
        if (!pwd) {
            app.dialog.showToast('请输入密码');
            return false;
        }
        return true;
    },
    // 登录
    login: function() {
        var inputAccount = this.data.inputAccount;
        var inputPassword = this.data.inputPassword;
        if (!this.validateAccount(inputAccount) ||
            !this.validatePassword(inputPassword)) {
            return;
        }
        inputPassword = MD5.hexMD5(inputPassword); // 输入的密码MD5加密
        var self = this;
        wx.showLoading();
        app.api.userLogin({
            data: {
                loginName: inputAccount,
                password: inputPassword
            },
            success: function(res) {
                var token = res.token;
                if (!token) {
                    app.dialog.showToast('您无权限,请联系管理员');
                    return;
                }
                self.onLoginSuccess(res);
            },
            fail: function(e) {
                console.log(TAG, 'login failed', e);
                // 状态500 ZuulException 等异常不会有code
                var msg = e.code ? '用户名或密码错误' : '网络不给力';
                app.dialog.showToast(msg);
            }
        });
    },
    // 登录成功后处理
    onLoginSuccess: function(options) {
        wx.reLaunch({
            url: '../index'
        });

        // 必要业务数据的缓存
        app.store.setItem(app.keyConf.STORE_KEY.userId, options.userId);
        app.store.setItem(app.keyConf.STORE_KEY.userName, options.realName);
        app.store.setItem(app.keyConf.STORE_KEY.userPhone, options.mobile);
        app.store.setItem(app.keyConf.STORE_KEY.userToken, options.token);
        app.store.setItem(app.keyConf.STORE_KEY.abnormalFlock, options.abnormalFlock);
        app.store.setItem(app.keyConf.STORE_KEY.ecmId, options.ecmId);

        // 粉丝手机号绑定
        var wxUser = wx.getStorageSync(app.keyConf.STORE_KEY.wxUser);
        if (!wxUser) return;
        this.fansBinding({
            appId: app.globalData.appId,
            mobile: this.data.inputAccount,
            openId: wxUser.openid,
            originalId: app.globalData.appOriginId,
            unionId: wxUser.unionid
        });
    },
    /**
     * 绑定微信用户手机号
     * 服务接口的返回结构体无共通result,需要另写request
     */
    fansBinding: function(options) {
        var url = app.api.URL.fansBinding;
        app.api.request({
            url: url,
            data: {
                "appId": options.appId,
                "mobile": options.mobile,
                "openId": options.openId,
                "originalId": options.originalId,
                "unionId": options.unionId
            },
            method: 'POST',
            success: function(res) {
                console.log(TAG, '保存粉丝手机号成功', res);
            },
            fail: function(e) {
                console.log(TAG, '保存粉丝手机号失败', e);
            }
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})