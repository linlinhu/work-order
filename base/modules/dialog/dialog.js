module.exports = {
    showWaiting: showLoading,
    hideWaiting: hideLoading,
    showToast: showToast,
    hideToast: hideToast,
    alert: alert,
    confirm: confirm
}

var MASK_LOADING = false;
var MASK_TOAST = false;
var DURATION_TOAST = 3000;

function showLoading(options) {
    wx.showLoading({
        title: options.title || '',
        mask: options.mask || MASK_LOADING,
        success: function() {
            if (typeof options.success === 'function') options.success();
        },
        fail: function() {
            if (typeof options.fail === 'function') options.fail();
        },
        complete: function() {
            if (typeof options.complete === 'function') options.complete();
        }
    });
}

function hideLoading(options) {
    wx.hideLoading(options);
}

/**
 * 为了方便使用,支持单纯的字符串以及object类型的参数
 */
function showToast(options) {
    var title = typeof options == 'string' ? options : options.title;
    wx.showToast({
        title: title,
        icon: options.icon || 'none',
        image: options.image || '',
        duration: options.duration || DURATION_TOAST,
        mask: options.mask || MASK_TOAST,
        success: function() {
            if (typeof options.success === 'function') options.success();
        },
        fail: function() {
            if (typeof options.fail === 'function') options.fail();
        },
        complete: function() {
            if (typeof options.complete === 'function') options.complete();
        }
    })
}

function hideToast(options) {
    wx.hideToast(options);
}

function alert(title, content, cb) {
    wx.showModal({
        title: title || '提示',
        content: content || '',
        showCancel: false,
        success: function(res) {
            if (typeof cb === 'function') cb();
        }
    })
}

function confirm(title, content, btnArr, confirmCb, cancelCb) {
    wx.showModal({
        title: title || '提示',
        content: content || '',
        showCancel: true,
        cancelText: btnArr[0] || '取消',
        confirmText: btnArr[1] || '确定',
        success: function(res) {
            if (res.confirm) {
                if (typeof confirmCb === 'function') confirmCb();
            } else if (res.cancel) {
                if (typeof cancelCb === 'function') cancelCb();
            }
        }
    })
}