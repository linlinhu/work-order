// components/com_input_text.js
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
        template: {
            type: Object, // String, Number, Boolean, Object, Array, null（表示任意类型）
            value: '',
            observer: function(newVal, oldVal) {
            }
        },
        showTitle: {
            type: Boolean,
            value: true // 默认显示标题
        },
        disabled: {
            type: Boolean,
            value: false
        },
        value: String
    },
    /**
     * 组件的初始数据
     */
    data: {
        required: false
    },
    lifetimes: {
        created: function() {},
        ready: function() {
            var tpl = this.data.template;
            if(!tpl) return;
            this.setData({
                required: tpl.required
            });
        },
        attached: function() {}
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function() {},
        hide: function() {}
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onInputChanged: function(e) {
            this.setData({
                value: e.detail.value
            });
        }
    }
});