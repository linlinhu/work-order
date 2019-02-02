// components/select/com_select.js
var network = require('../../modules/network/network.js');
Component({
    /**
     * 表单的支持
     */
    behaviors: ['wx://form-field'],
    /**
     * 组件的属性列表
     */
    properties: {
        template: Object,
        index: {
            type: Number,
            value: 0
        },
        disabled: {
            type: Boolean,
            value: false
        },
        value: {
            type: Number,
            value: '' // 提交的表单的值(可以内部或外部初始化)
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        datasource: []
    },
    ready: function() {
        var typeExtend = this.data.template.typeExtend;
        this.hanleDatasource(typeExtend);
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 处理模板中配置的数据源(1.远程;2:静态)
        hanleDatasource: function(options) {
            var sourceType = options.sourceType;
            if (sourceType == 'remote') {
                this.getRemoteData(options);
            } else if (sourceType == 'local') {
                this.getLocalData(options);
            }
        },
        // 在模板中配置的静态数据源
        getLocalData: function(options) {
            var data = options.data;
            this.configDisplayValue(data);
        },
        // 远程数据源,通过模板配置的url获取
        getRemoteData: function(options) {
            var remoteUrl = options.url;
            var self = this;
            network.request({
                url: remoteUrl,
                success: function(data) {
                    self.configDisplayValue(data);
                },
                fail: function(e) {
                }
            });
        },
        // 配置显示的值,默认显示第一个,如果有初始值,需要找出来
        configDisplayValue: function(objArray) {
            var displayIndex = 0;
            var displayVal = objArray[0].value; // 默认是第一个的值,规定值为value,text为呈现
            var initVal = this.data.value;
            if (initVal) {
                for (var i = 0; i < objArray.length; i++) {
                    if (objArray[i].value == initVal) {
                        displayIndex = i;
                        break;
                    }
                }
            }
            this.setData({
                datasource: objArray,
                index: displayIndex,
                value: displayVal
            });
        },
        // 约定数据源的object,具备两个key:1.text(显示), value(值,可能是id等)
        onSelectChanged: function(e) {
            var index = e.detail.value;
            var value = this.data.datasource[index].value;
            this.setData({
                index: index,
                value: value
            });
            this.broadcastValueChanged({
                index: index,
                value: value
            });
        },
        broadcastValueChanged: function(e) {
            this.triggerEvent('valueChanged', e);
        }
    }
})