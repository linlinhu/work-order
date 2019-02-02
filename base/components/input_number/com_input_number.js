// components/input_number/com_input_number.js
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
        disabled: {
            type: Boolean,
            value: false
        },
        value: Number
    },

    /**
     * 组件的初始数据
     */
    data: {

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
})