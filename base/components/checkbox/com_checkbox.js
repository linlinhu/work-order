// components/checkbox/com_checkbox.js
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
        template: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        checkboxItems: []
    },
    ready: function() {
        var prop = this.data.template;
        this.setData({
            checkboxItems: prop
        });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCheckboxChanged: function(e) {
            var checkboxItems = this.data.checkboxItems;
            var values = e.detail.value;
            for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
                checkboxItems[i].checked = false;

                for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                    if (checkboxItems[i].value == values[j]) {
                        checkboxItems[i].checked = true;
                        continue;
                    }
                }
            }

            this.setData({
                checkboxItems: checkboxItems
            });
        }
    }
})