var store = require('../storage/store.js');
const TAG = '[base/modules/network.js]';
/**
 * 对微信网络请求的封装,提供默认值
 * 备注:
 * 1.POST 方式传递数据(param形式) header:"Content-Type": "application/x-www-form-urlencoded"
 * 2.POST 方式传递数据(body形式) header:"Content-Type": "application/json"
 */
function request(options) {
    options.header = options.header || {'Content-type': 'application/json'};
    if (options.loading) {
        wx.showLoading();
    }
    wx.request({
        url: options.url,
        data: options.data,
        header: options.header,
        method: options.method || 'GET',
        dataType: options.dataType || 'JSON',
        success: function (res) {
            var data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            if (data.success) {
                if (typeof options.success === 'function') options.success(data.result);
            } else {
                var e = {
                    code: data.code ? data.code : null
                    //message: data.message ? data.message : null
                } 
                if (typeof options.fail === 'function') options.fail(e);
            }
            store.setItem('systemTime', new Date(res.header.Date).getTime())
        },
        fail: function (xhr, type, status) {
            var err = {
                message: '网络不给力'
            }
            if (typeof options.fail === 'function') options.fail(err);
        },
        complete: function () {
            if (options.loading) {
                wx.hideLoading();
            }
            if (typeof options.complete === 'function') options.complete();
        }
    })
}

/**
 * 文件上传
 */
function uploadFile(options) {
    wx.uploadFile({
        url: options.url,
        filePath: options.filePath,
        name: options.name,
        formData: options.data,
        success(res) {
            const data = res.data;
            if (typeof options.success === 'function') options.success(data);
        }
    });
}

function download() {

}

module.exports = {
    request: request,
    uploadFile: uploadFile
};
