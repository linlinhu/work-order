
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
    uploadFile: uploadFile
};