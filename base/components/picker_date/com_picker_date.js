// components/picker_date/com_picker_date.js
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

    },
    created: function() {},
    ready: function() {},
    attached: function() {},
    /**
     * 组件的方法列表
     */
    methods: {
        onDateChanged: function(e) {
            var date = e.detail.value;
            this.setData({
                selectedDate: date,
                value: date
            });
        }
    }
})