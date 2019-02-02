// components/sheetModal/sheet.js
const TAG = '[components/sheetModal/sheet]';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        checkItems: {
            type: Array,
            value: [
                { name: '选项1', value: '1'},
                { name: '选项2', value: '2' }
            ]
        },
        title: String,
        index: {
            type: Number,
            value: 0
        },
        value: String,
        mode: String
    },
    data: {
        
    },
    lifetimes: {
        created: function () {
        },
        attached: function () {
        },
        ready: function () {
            var checkItems = this.data.checkItems;
            if (checkItems) {
                // 初始第一个选项设置为选中状态
                checkItems[0].checked = true;
                this.setData({
                    checkItems: checkItems
                });
            }
        }
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {
        },
        hide: function () {
        }
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
        checkItemChange: function (e) {
            var checkItems = this.data.checkItems;
            var values = e.detail.value;
            var lastValue = values[values.length - 1];
            var index = 0 ;
            for (var i = 0; i < checkItems.length; i++) {
                
                // 单选
                checkItems[i].checked = false;
                if (checkItems[i].value == lastValue) {
                    checkItems[i].checked = true;
                    index = i;
                }
            }
            this.setData({
                checkItems: checkItems,
                index: index
            });
        },
        onConfirm: function () {
            var select = this.data.checkItems[this.data.index];
            this.triggerEvent('valueChanged', select);
        }
    }
})