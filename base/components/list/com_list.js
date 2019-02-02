// base/components/list/com_list.js
const TAG = '[base/components/list/com_list.js]';
var network = require('../../modules/network/network.js');
Component({
    /**
     * 是否开放了全局样式类,组件外样式类能够完全影响组件内部
     */
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        template: Object,
        defaultValue: String,
        datasource: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        relatedTemplate: null
    },
    lifetimes: {
        created: function() {
        },
        attached: function () {
        },
        ready: function() {
            this.getRelatedTemplate();
        }
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function() {
        },
        hide: function() {
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 列表组件的关联模板,即呈现的模板(配置要呈现的字段条目)
         */
        getRelatedTemplate: function() {
            var inputTpl = this.data.template;
            var typeExtend = inputTpl.typeExtend;
            var serverHost = typeExtend.serverHost;  // 服务器
            var serviceId = typeExtend.modelInfo.serviceId; // MEL模板serviceId
            var bizCode = typeExtend.modelInfo.code; // MEL模板code
            var url = serverHost + '/dataModel/' + serviceId + '/' + bizCode;
            var self = this;
            network.request({
                url: url,
                success: function(res) {
                    self.targetTemplateReady(res);
                },
                fail: function(e) {
                    wx.showToast({
                        title: '网络超时',
                        icon: 'none'
                    });
                }
            });
        },
        targetTemplateReady: function(tpl) {
            this.setData({
                relatedTemplate: tpl
            });
            this.setData({
                datasource: this.data.datasource
            });
            this.triggerEvent('onListReady', tpl);
        }
    }
})