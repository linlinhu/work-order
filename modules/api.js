const TAG = '[modules/api.js]'; 
var store = require('../base/modules/storage/store.js');
var network = require('../base/modules/network/network.js');
var keyConf = require('keyConf.js');

/**
 * 服务器地址配置
 */
const HOST = {
    wechatHostDev: 'http://192.168.10.40:8881',  // 微信服务
    userHostDev: 'http://192.168.10.202:28881',  // 业务服务本地环境
    melHostDev: 'http://192.168.10.202:8215',    // MEL服务本地环境

    userHostBeta: 'http://182.254.208.38:28881', // 业务服务云上测试环境
    melHostBeta: 'http://182.254.208.38:8225',  // MEL服务云上测试环境

    userHostRelease: '',
    melHostRelease: ''
}

// 接口Header校验
const USER_API_AUTH = 'emin.smart.mall.super.token';

// 当前服务器环境
var userHost = HOST.userHostBeta;
var melHost = HOST.melHostBeta;
var wechatHost = HOST.wechatHostDev;
const appVersion = '1.0.0';

/** 
 * MEL模板配置
 */
const MEL_CONF = {
    serviceId: 'emin_work_order',
    serviceCode: {
        deviceDetailList: 'device_detail_list',
        deviceDetail: 'device_detail',
        taskHandle: 'task_handle',
        transferOrder: 'transfer_order'
    }
}

/**
 * 业务/MEL服务接口地址
 */
const URL = {
    login: userHost + '/api-smart-mall-cloud/user/login',
    memberTeam: userHost + '/api-smart-mall-cloud/api/workOrder/teamGroup/getMemberTeam',
    teamMemberList: userHost + '/api-smart-mall-cloud/api/workOrder/teamGroup/getTeamMemberList',
    teamMemberDetail: userHost + '/api-smart-mall-cloud/api/workOrder/teamGroup/getUseInfo',

    getAllStatusTaskCount: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/getMyTaskTotal',//一次性获取获取多种状态的工单数量
    getMyTaskCount: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/getMyTaskCount',//获取不同状态的工单数量
    getBackTaskCount: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/getBackTaskCount',//获取被退回的工单数量
    getUnableSystem: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/getUnableSystem',//获取维修的子系统
    getEventTypeCode: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/getEventTypeCode',//获取工单类型
    getEventCircle: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/getEventCircle',//获取流转状态
    taskToBeFinish: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/taskToBeFinish',//我的任务列表查询
    toBeConfirmed: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/toBeConfirmed',//领单中心列表查询
    pageMyDesignate: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderQuery/pageMyDesignate',//我的指派列表查询
    getProcessDetailByEventSourceId: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderDeal/getProcessDetailByEventSourceId',//工单追踪
    detailNoStatusFloor: userHost + '/api-smart-mall-cloud/workOrder/location/api/detailNoStatusFloor',//获取商场、区域信息
    changeReadStatus: userHost + '/api-smart-mall-cloud/api/workOrder/workOrderDeal/changeReadStatus',//修改已读未读的状态
    
    deviceInfo: userHost + '/api-smart-mall-cloud/workOrder/location/api/device/detail',
    deviceDetailListTpl: melHost + '/dataModel/' + MEL_CONF.serviceId + '/' + MEL_CONF.serviceCode.deviceDetailList + '?sourceType=MOBILE',
    taskHandleTpl: melHost + '/dataModel/' + MEL_CONF.serviceId + '/' + MEL_CONF.serviceCode.taskHandle + '?sourceType=MOBILE',
    transferOrderTpl: melHost + '/dataModel/' + MEL_CONF.serviceId + '/' + MEL_CONF.serviceCode.transferOrder + '?sourceType=MOBILE',

    wxAppInfo: wechatHost + '/api-wx-platform-subject/subject/appId',  // 查询主体(这里是小程序)的secret
    wxCode2Session: wechatHost + '/api-proxy/oauth/sns/code2Session',  // 通过微信登录api获取的凭证查询openid,unionid等信息
    getFansBinding: wechatHost + '/api-wx-platform-fans/fans-binds/binds/view/openId', // 获取粉丝绑定信息
    fansBinding: wechatHost + '/api-wx-platform-fans/fans-binds/binds/mobile',   // 粉丝信息绑定
}

/**
 * 本模块对外暴露接口
 */
module.exports = {
    request: request,
    userLogin: userLogin,
    getDeviceInfo: getDeviceInfo,
    getDeviceDetailListTpl: getDeviceDetailListTpl,
    getTaskHandleTpl: getTaskHandleTpl, // 任务处理(工单)模板
    getTransferOrderTpl: getTransferOrderTpl,
    transferOrder: transferOrder,
    validateTpl: validateTpl
}
/**
 * 本模块对外暴露数据
 */
module.exports.userHost = userHost;
module.exports.melHost = melHost;
module.exports.wechatHost = wechatHost;
module.exports.appVersion = appVersion;
module.exports.URL = URL;

// - - - - - - - - - - 具体实现 - - - - - - - - - - -

function request(options) {
    // header 默认统一传值
    options.header = options.header || {};
    options.header['Authorization'] = USER_API_AUTH; //store.getItem(keyConf.STORE_KEY.userToken);
    options.header['ecmId'] = store.getItem(keyConf.STORE_KEY.ecmId);
    network.request(options);
}

/**
 * 用户登录
 */
function userLogin(options) {
    if (!options) options = {};
    options['header'] = {
        Authorization: USER_API_AUTH
    };
    options.url = URL.login;
    network.request(options);
}

/**
 * 获取任务处理模板(工单模板)
 */
function getTaskHandleTpl(options) {
    if (!options) options = {};
    options.url = URL.taskHandleTpl;
    request(options);
}

/**
 * 获取任务指派模板(工单模板)
 */
function getTransferOrderTpl(options) {
    if (!options) options = {};
    options.url = URL.transferOrderTpl;
    request(options);
}

/**
 * 获取设备详情
 */
function getDeviceInfo(options) {
    if (!options) options = {};
    options.url = URL.deviceInfo;
    request(options);
}

/**
 * 获取设备详情列表模板
 */
function getDeviceDetailListTpl(options) {
    if (!options) options = {};
    options.url = URL.deviceDetailListTpl;
    request(options);
}


function transferOrder(p, callback) {
    var userId = store.getItem('userId');
    var userName = store.getItem('userName');
    var userPhone = store.getItem('userPhone');
    var submitObj = {
        abnormalId: p.abnormalId,
        operation: p.code,
        userIdFrom: userId,
        userIdTo: p.to ? p.to.id : userId,
        userNameFrom: userName,
        userNameTo: p.to ? p.to.name : userName,
        userPhoneFrom: userPhone,
        userPhoneTo: p.to ? p.to.mobile : userPhone,
        memo: p.memo
    };
    var melSubmitObj = {};
    getTransferOrderTpl({
        success: function (res) {
            var submitItems = res.groups[0].items;
            submitItems.forEach(function (item) {
                if (submitObj[item.dataKey]) {
                    melSubmitObj[item.itemToken] = submitObj[item.dataKey];
                }
            });
            validateTpl(res, melSubmitObj, function() {
                // 如果是指派和退回，memo不能为空
                var operation = melSubmitObj[submitItems[1].itemToken];
                var cantEmptyMemo = operation == '20' || operation == '30';
                var memo = melSubmitObj[submitItems[5].itemToken];
                if (cantEmptyMemo && !memo) {
                    wx.showToast({
                        title: '请填写' + (operation == '20' ? '备注' : '退回原因'),
                        icon: 'none'
                    });
                    return false;
                }
                var url = melHost + '/logdata/' + res.id + '/submit';
                request({
                    url: url,
                    method: 'POST',
                    header: {
                        'authToken': res.authToken,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        data: JSON.stringify(melSubmitObj),
                        submitter: userPhone,
                        sync: true
                    },
                    success: function (res) {
                        var result = res ? JSON.parse(res) : {};
                        if (result.success) {
                            callback(res);
                        } else {
                            wx.showToast({
                                title: result.message ? result.message : '网络异常',
                                icon: 'none'
                            })
                        }
                    }
                });
            })
        }
    })
}

/**
 * 验证模板数据提交
 */
function validateTpl(tpl, formData, success) {
    var tplGroups = tpl.groups;
    for (var i in tplGroups) {
        var group = tplGroups[i];
        for (var j in group.items) {
            var item = group.items[j];
            var content = formData[item.itemToken];
            // 判断表单输入必填项
            if (item.required && !content) {
                wx.showToast({
                    title: item.title + '是必填项！',
                    icon: 'none'
                });
                return false;
            }
            // 判断表单提交输入是否合法
            if (content && item.regEx) {
                var regex = new RegExp(item.regEx);
                if (!regex.test(content)) {
                    wx.showToast({
                        title: item.title + '的输入不合法',
                        icon: 'none'
                    });
                    return false;
                }
            }
        }
    }
    success();
}