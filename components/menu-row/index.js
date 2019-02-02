// components/menu-column/index.js
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        list: {
            type: Array,
            value: []
        }
    },
     /**
     * 组件的方法列表
     */
    methods: {
        //点击每一个条目的触发事件
        itemClick: function (e) {
            var dataset = e.currentTarget.dataset;
            this.triggerEvent('myevent', dataset, {})
        },
    }
})