/* 缓存模块 */

module.exports = {
    setItem: set,
    getItem: get,
    removeItem: remove,
    clear: clear
};

/**
 * 设置缓存key-value
 * success,fail,complete可选
 */
function set(key, value, success, fail, complete) {
    if(!key || !value) return;
    wx.setStorage({
        key: key,
        data: value,
        success:function() {
            if (typeof success === 'function') success();
        },
        fail:function() {
            if (typeof fail === 'function') fail();
        },
        complete: function() {
            if (typeof complete === 'function') complete();
        }
    });
}

/**
 * 获取缓存key的值
 */
function get(key) {
    if (!key) return;
    return wx.getStorageSync(key);
}

/**
 * 移除缓存key-value
 * success,fail,complete可选
 */
function remove(key, success, fail, complete) {
    if (!key) return;
    wx.removeStorage({
        key: key,
        success: function () {
            if (typeof success === 'function') success();
        },
        fail: function () {
            if (typeof fail === 'function') fail();
        },
        complete: function () {
            if (typeof complete === 'function') complete();
        }
    });
}

/**
 * 清理缓存
 * success,fail,complete可选
 */
function clear(success, fail, complete) {
    wx.clearStorage({
        success: function () {
            if (typeof success === 'function') success();
        },
        fail: function () {
            if (typeof fail === 'function') fail();
        },
        complete: function () {
            if (typeof complete === 'function') complete();
        }
    });
}