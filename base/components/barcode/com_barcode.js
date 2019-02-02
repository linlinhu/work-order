// components/barcode/com_barcode.js
var barcode = require('../../modules/device/barcode.js');
var network = require('../../modules/network/network.js');

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
        template: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        barcodeResult: '',
        validate: false,
        callbackResult: {}
    },
    ready: function() {
        // 是否远程校验
        var tpl = this.data.template;
        var validate = tpl.enableRemoteValidation;

        // 查询数据与关联模板
        var typeExtend = tpl.typeExtend;
        this.setData({
            validate: validate,
            typeExtend: typeExtend
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onScan: function(e) {
            var self = this;
            barcode.scanCode({
                success: function(res) {
                    var result = res.result;
                    self.didScanSuccess(result);
                }
            });
        },
        appendCallbackResult: function(o) {
            this.setData({
                callbackResult: o
            });
        },
        // 微信扫码结束后处理
        didScanSuccess: function(barcodeRel) {
            this.setData({
                barcodeResult: barcodeRel,
                value: barcodeRel
            });

            var tmp = this.data.callbackResult;
            tmp.code = barcodeRel;
            this.appendCallbackResult(tmp);
            if (this.data.validate) {
                this.toValidateCode(barcodeRel); // 远程校验处理
            } else {
                this.toGetDataWithCode(barcodeRel); // 获取远程扫码数据处理
            }
        },
        // 远程校验处理
        toValidateCode: function(code) {
            var config = this.data.template.remoteValidationConfig;
            var url = config.url;
            var paramKey = config.paramKey;
            var validateUrl = url + '?' + paramKey + '=' + code;
            var tmp = this.data.callbackResult;
            var self = this;
            network.request({
                url: validateUrl,
                success: function(data) {
                    tmp.isValid = true
                    self.appendCallbackResult(tmp);
                    self.toGetDataWithCode(code);
                },
                fail: function(e) {
                    tmp.isValid = false;
                    self.appendCallbackResult(tmp);
                }
            });
        },
        // 获取服务端接口数据
        toGetDataWithCode: function(code) {
            var typeExtend = this.data.typeExtend;
            if (typeExtend && typeExtend.enableGetData) {   
                var url =  typeExtend.url;
                var paramKey = typeExtend.paramKey;
                var getDataUrl = url + '?' + paramKey + '=' + code;
                //getDataUrl = escape(getDataUrl);
                var tmp = this.data.callbackResult;
                var self = this;
                network.request({
                    url: getDataUrl,
                    success: function(data) {
                        tmp.data = data;
                        self.appendCallbackResult(tmp);
                        self.toGetModel(code); // 获取关联的模板
                    },
                    fail: function(e) {
                        var msg = '获取远程扫码数据失败';
                        wx.showToast({
                            title: msg,
                            icon: 'none',
                            mask: false
                        })
                    }
                });
            }
        },
        // 获取关联模板
        toGetModel: function(code) {
            var typeExtend = this.data.typeExtend;
            if (typeExtend && typeExtend.enableGetModel) {
                var host = typeExtend.serverHost;
                var modelServiceId = typeExtend.modelServiceId;
                var modelUrl = host + '/' + modelServiceId + '/' + code + '?sourceType=MOBILE';
                var tmp = this.data.callbackResult;
                var self = this;
                network.request({
                    url: modelUrl,
                    success: function(data) {
                        tmp.model = data;
                        self.appendCallbackResult(tmp);
                        self.triggerEvent('scanSuccess', self.data.callbackResult);
                    },
                    fail: function(e) {
                    }
                });
            }
        }
    }
})