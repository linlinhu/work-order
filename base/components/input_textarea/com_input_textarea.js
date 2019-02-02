// components/input_textarea/com_input_textarea.js
Component({
    /**
     * 是否开放了全局样式类,组件外样式类能够完全影响组件内部
     */
    options: {
        addGlobalClass: true
    },
    /**
     * 外部传入样式
     */
    externalClasses: ['custom-style'],
    /**
     * 表单控件的行为
     */
    behaviors: ['wx://form-field'],
    /**
     * 组件的属性列表
     */
    properties: {
        // 模板
        template: Object,
        // 是否禁用
        disabled: {
            type: Boolean,
            value: false
        },
        // 最大输入
        maxSize: {
            type: Number,
            value: 50
        },
        // 最终输入的值,以及表单提交的值
        value: String,
        showTitle:Boolean
    },
    ready: function() {
        var initVal = this.data.value;
        if (initVal) {
            this.setData({ inputSize: initVal.length });
        }

        // 是否必填
        var tpl = this.data.template;
        if (!tpl) return;
        this.setData({
            required: tpl.required
        });
    },

    /**
     * 组件的初始数据
     */
    data: {
        inputSize: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onInputChanged: function(e) {
            var oldVal = this.data.value;
            var newVal = e.detail.value;
            var size = newVal.length;
            if (size > this.data.maxSize) {
                getApp().dialog.showToast('输入超过最大值');
                this.setData({ value: oldVal });
                return;
            }
            this.setData({
                value: newVal,
                inputSize: size
            });
        }
    }
})