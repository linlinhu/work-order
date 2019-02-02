/**
 * 本地缓存中的key配置
 */
const STORE_KEY = {

    // 登录用户id
    userId: 'userId',

    // 登录用户姓名
    userName: 'userName',

    // 登录用户手机号码
    userPhone: 'userPhone',

    // 登录用户token
    userToken: 'userToken',

    // 登录用户权限(维修负责人/维修人员)
    abnormalFlock: 'abnormalFlock',

    // 主体id
    ecmId: 'ecmId',

    // 微信小程序基础信息(appId,appSecret,原始id等基础信息)
    wxAppInfo: 'wxAppInfo',

    // 微信用户信息
    wxUser: 'wxUser',

    // 设备详情的列表模板
    deviceDetailListTpl: 'deviceDetailListTpl'
};

// other key config ...

module.exports.STORE_KEY = STORE_KEY;
