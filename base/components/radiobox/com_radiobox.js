// base/components/radiobox/com_radiobox.js
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
        template: Object,
        radioItems: Array,
        value: String, // 最终选择的值,以及表单提交的值
    },

    /**
     * 组件的初始数据
     */
    data: {

    },
    ready: function() {
        // 如果组件已经手动配置了数据源,则以该数据源为准
        if (this.data.radioItems && this.data.radioItems.length > 0) {
            var radios = this.data.radioItems;
            this.configRadioData(radios);
        } else {
            var typeExtend = this.data.template.typeExtend;
            var sourceType = typeExtend.sourceType;
            if (sourceType == 'local') {
                var data = typeExtend.data;
                this.configRadioData(data);
            } else if (sourceType == 'remote') {
                this.getRemoteData(typeExtend);
            }
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 以MEL模板配置的远程数据源获取数据
        getRemoteData: function(options) {
            var url = options.url;
            var self = this;
            network.request({
                url: url,
                success: function (data) {
                    self.configRadioData(data);
                },
                fail: function (e) {
                    
                }
            });
        },
        // 初始配置数据源,默认第一个选中
        configRadioData: function(data) {
            if(!data || data.length == 0) return;
            for (var i = 0; i < data.length; i++) {
                data[i].checked = false;
            }
            data[0].checked = true;
            this.setData({
                radioItems: data,
                value: data[0].value
            });
            this.triggerEvent('radioChange', data[0]);
        },
        // 界面radio选择事件
        radioChange: function(e) {
            var radioItems = this.data.radioItems;
            var item = radioItems[0];
            for (var i = 0; i < radioItems.length; i++) {
                var radioItem = radioItems[i];
                radioItem.checked = false;
                if (radioItem.value == e.detail.value) {
                    item = radioItem;
                    radioItem.checked = true;
                }
            }
            this.setData({
                radioItems: radioItems,
                value: item.value
            });
            this.triggerEvent('radioChange', item);
        }
    }
})