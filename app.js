var store = require('base/modules/storage/store.js');
var dialog = require('base/modules/dialog/dialog.js');
var api = require('modules/api.js');
var dataParse = require('modules/dataParse.js');
var keyConf = require('modules/keyConf.js');  // key的配置,如storage中的key

App({
    onLaunch: function() {
    },
    onShow: function() {
    },
    onHide: function() {
    },
    globalData: {
        appId: 'wxbe5ee1877e6a0b22', // 小程序appid
        appOriginId: 'gh_000bd8b66b26', // 小程序原始appid(消息推送用)
        woaOriginId: 'gh_123456789',
        hasLogin: false
    },
    api: api, // 项目服务接口api
    store: store, // 存储
    dialog: dialog, // 对话框交互
    keyConf: keyConf,
    dataParse: dataParse
});