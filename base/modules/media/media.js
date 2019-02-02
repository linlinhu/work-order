
function chooseImage(options) {
    wx.chooseImage({
        count: options.count || 9,  // 默认当次最大选择9张
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
            const tempFilePaths = res.tempFilePaths;
            const tempFiles = res.tempFiles;
            if (typeof options.success === 'function') options.success(res);
        }
    });
}

function description() {
}

module.exports = {
    chooseImage: chooseImage,
    description: description
};