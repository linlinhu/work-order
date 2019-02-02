
function getLocation(options) {
    wx.getLocation({
        type: options.type || 'gcj02',         // wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        altitude: options.altitude || 'false', // 高精确度
        success: function (res) {
            if (typeof options.success === 'function') options.success(res);
        },
        fail: function (e) {
            if (typeof options.fail === 'function') options.fail(e);
        },
        complete: function () {
            if (typeof options.complete === 'function') options.complete();
        }
    });
}

function parseLocation() {

}

module.exports = {
    getLocation: getLocation
};