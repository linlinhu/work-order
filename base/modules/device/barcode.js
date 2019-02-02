/**
 * onlyFromCamera:
 *   扫码的源头可以从摄像头,也可以从相册扫码   
 * scanType:
 *  barCode : 一维码
 *  qrCode: 二维码
 *  datamatrix: Data Matrix 码
 *  pdf417 : PDF417 条码
 */
function scanCode(options) {
    wx.scanCode({
        onlyFromCamera: false,
        scanType: ['barCode', 'qrCode'],
        success: function(res) {
            if (typeof options.success === 'function') options.success(res);
        },
        fail: function(e) {
            if (typeof options.fail === 'function') options.fail(e);
        },
        complete: function() {
            if (typeof options.complete === 'function') options.complete();
        }
    })
}

module.exports = {
    scanCode: scanCode
};