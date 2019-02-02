// base/components/select/down/com_down_select.js
const TAG = '[base/components/select/down/com_down_select.js]';
Component({
    /**
     * 是否开放了全局样式类,组件外样式类能够完全影响组件内部
     */
    options: {
        addGlobalClass: true
    },
    /**
     * 表单的支持
     */
    behaviors: ['wx://form-field'],
    /**
     * 组件的属性列表
     */
    properties: {
        datasource: Array,
        disabled: {
            type: Boolean,
            value: false
        },
        value: {
            type: Number,
            value: '' // 提交的表单的值(可以内部或外部初始化)
        },
        text: {
            type: String,
            value: '请选择分类' //初始内容
        },
        textKey: String,
        valueKey:String
    },

    /**
     * 组件的初始数据
     */
    data: {
        selectShow: false, //初始option不显示
        animationData: {} //右边箭头的动画
    },
    ready: function () {
    },
    /**
     * 组件的方法列表
     */
    methods: {
        selectToggle: function () {
            var nowShow = this.data.selectShow; // 获取当前option显示的状态
            //创建动画
            var animation = wx.createAnimation({
                timingFunction: "ease"
            })
            this.animation = animation;
            if (nowShow) {
                animation.rotate(0).step();
                this.setData({
                    animationData: animation.export()
                })
            } else {
                animation.rotate(180).step();
                this.setData({
                    animationData: animation.export()
                })
            }
            this.setData({
                selectShow: !nowShow
            })
        },

        setText: function (e) {
            var nowIdx = e.target.dataset.index; //当前点击的索引
            var nowText = this.data.datasource[nowIdx][this.data.textKey]; //当前点击的text
            var nowValue = this.data.datasource[nowIdx][this.data.valueKey]; //当前点击的value
            //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
            this.animation.rotate(0).step();

            this.setData({
                selectShow: false,
                text: nowText,
                value: nowValue
            });
            this.broadcastValueChanged(nowIdx);
        },
        broadcastValueChanged: function (index) {
            var item = this.data.datasource[index];
            var e = {
                index: index,
                childrenKey: this.data.childrenKey,
                textKey: this.data.textKey,
                valueKey: this.data.valueKey,
                item: item
            }
            this.triggerEvent('valueChanged', e);
        }
    }
})
