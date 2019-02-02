// components/menu-row/menu-row.js
Component({
    options: {
        addGlobalClass: true,
        externalClasses: ['status-statistics']
    },
    properties: {
        icons:{
            type: Array,
            value: []
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //点击每一个条目的触发事件
        iconClick: function (e) {
            var dataset = e.currentTarget.dataset;
            this.triggerEvent('myevent', dataset, {})
        },
    }
})