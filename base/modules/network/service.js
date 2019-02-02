
/* 对外暴露的接口 */
module.exports = {
    request: request
};

/**
 * 对微信网络请求的封装,提供默认值
 */
function request(options) {
    wx.showLoading()
    wx.request({
        url: options.url,
        data: options.data,
        header: options.header || {"content-type": "application/json"},
        method: options.method || 'GET',
        dataType: options.dataType || 'JSON',
        success: function(res) {
            wx.hideLoading();
            var data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            if (data.success) {
                if (typeof options.success === 'function') options.success(data.result);
            } else {
                var code = data.code;
                var msg = '系统异常';
                if (typeof options.fail === 'function') options.fail(msg);
            }
        },
        fail: function(xhr, type, status) {
            wx.hideLoading();
            var msg = '网络不给力'
            if (typeof options.fail === 'function') options.fail(msg);
        },
        complete: function() {
            wx.hideLoading();
            if (typeof options.complete === 'function') options.complete();
        }
    })
}