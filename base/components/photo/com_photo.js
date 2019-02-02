// components/photo/com_photo.js
const TAG = '[components/photo/com_photo.js]';
var media = require('../../modules/media/media.js');
var debug = false;
Component({
    /**
     * 是否开放了全局样式类,组件外样式类能够完全影响组件内部
     */
    options: {
        addGlobalClass: true
    },
    /**
     * 表单控件的行为
     */
    behaviors: ['wx://form-field'],
    /**
     * 组件的属性列表
     */
    properties: {
        template: Object,
        disabled: Boolean, // 是否禁用,默认为false
        showTitle: Boolean, // 是否显示标题
        images: Array, // 图片数组(有初始化图片的情况)
        uploadUrl: String, // 可独立配置的上传url(不配置,就取模板配置的上传地址)
        count: {
            type: Number,
            value: 9
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        value: '', // 对外暴露的表单值的固有字段
        files: [], // 选择的图片数组
        uploadResult: [] // 异步上传的图片数组结果
    },
    ready: function() {
        if (debug) {
            this.setData({
                images: ['/assets/empty.jpg', '/assets/food-3.jpg', '/assets/index/home_bg.png']
            });
        }

        // 图片的初始化
        var initImages = this.data.images;
        if (initImages && initImages.length > 0) {
            this.setData({
                files: initImages
            });
        }

        // 图片上传的服务器地址
        var typeExtend = this.data.template.typeExtend;
        var url = typeExtend.url;
        if (!this.data.uploadUrl && url) {
            this.setData({
                uploadUrl: url
            });
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 微信选择/拍照图片
        onChooseImage: function() {
            var self = this;
            media.chooseImage({
                count: this.data.count,
                success: function(res) {
                    const tempFilePaths = res.tempFilePaths;
                    self.setData({
                        files: self.data.files.concat(tempFilePaths),
                        value: tempFilePaths[0]
                    });
                    var url = self.data.uploadUrl;
                    if (!url) {
                        return;
                    }
                    for (var i = 0; i < tempFilePaths.length; i++) {
                        var path = tempFilePaths[i];
                        self.uploadImage(url, path);
                    }
                }
            });
        },
        // 上传图片
        uploadImage: function(url, filePath) {
            if (!url) return;
            var self = this;
            wx.uploadFile({
                url: url,
                filePath: filePath,
                name: 'file',
                formData: {},
                success(res) {
                    const data = res.data;
                    var result = JSON.parse(data).result;
                    // 合并上传结果(上传的结果数组对象)
                    self.setData({
                        uploadResult: self.data.uploadResult.concat(result)
                    });
                    // 更新暴露给表单的值,原value是字符串类型,重置成数组
                    self.setData({
                        value: self.data.uploadResult
                    });
                    self.triggerEvent('chooseImageSuccess', self.data.uploadResult);
                }
            });
        },
        // 图片预览
        previewImage: function(e) {
            wx.previewImage({
                current: e.currentTarget.id, // 当前显示图片的http链接
                urls: this.data.files // 需要预览的图片http链接列表
            })
        },
        /**
         * 删除图片
         * 刷新界面同时更新上传结果以及表单的值
         */
        deleteImage: function(e) {
            var imgs = this.data.files;
            var uploadRel = this.data.uploadResult;
            var val = this.data.value;
            var index = e.currentTarget.dataset.index;
            imgs.splice(index, 1);
            uploadRel.splice(index, 1);
            val.splice(index, 1);
            // 刷新界面以及更新上传结果
            this.setData({
                files: imgs,
                uploadResult: uploadRel,
                value: val
            });
        }
    }
})