// base/components/select/cascade/com_select_cascade.js
var network = require('../../../modules/network/network.js');
const TAG = '[base/components/select/cascade/com_select_cascade]';
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
        template: Object,
        index: {
            type: Number,
            value: 0
        },
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
            value: '请选择不符合项'  //初始内容
        },
        showTitle: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        datasource: [],
        textKey: '',
        valueKey: '',
        childrenKey: '',

        selectShow: false, //初始option不显示
        animationData: {} //右边箭头的动画

    },
    ready: function() {
        var typeExtend = this.data.template.typeExtend;
        this.setData({
            textKey: typeExtend.textKey,
            valueKey: typeExtend.valueKey,
            childrenKey: typeExtend.childrenKey
        });

        // 由于数据过大,缓存处理,待优化,存储由业务处理
        var datasourceLocal = wx.getStorageSync('select_datasource');
        if (datasourceLocal) {
            this.configDisplayValue(datasourceLocal);
        } else {
            this.getRemoteData(typeExtend);
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 远程数据源,通过模板配置的url获取
        getRemoteData: function(options) {
            var remoteUrl = options.url;
            var self = this;
            network.request({
                url: remoteUrl,
                success: function(data) {
                    self.configDisplayValue(data);
                },
                fail: function(e) {
                    app.showToat('网络超时');
                }
            });
        },
        // 配置显示的值,默认显示第一个,如果有初始值,需要找出来
        configDisplayValue: function(objArray) {
            wx.setStorage({
                key: 'select_datasource',
                data: objArray,
            });

            var displayIndex = 0;
            var textKey = this.data.textKey;
            var valueKey = this.data.valueKey;
            var childrenKey = this.data.childrenKey;

            var displayText = objArray[0][textKey];
            var displayVal = objArray[0][valueKey];
            var initVal = this.data.value;
            if (initVal) {
                var target = this.searchValue(objArray, initVal);
                if (target) {
                    displayText = target[textKey];
                    displayVal = initVal;
                }
            }
            this.setData({
                datasource: objArray,
                text: displayText,
                value: displayVal
            });
            this.broadcastValueChanged(displayIndex);
        },
        // 递归搜索目标值
        searchValue: function(objArray, targetVal) {
            var targetObj = null;
            for (var i = 0; i < objArray.length; i++) {
                var tmpObj = objArray[i];
                if (tmpObj[this.data.valueKey] != targetVal) {
                    if (tmpObj.leaf) continue;
                    var children = tmpObj[this.data.childrenKey];
                    targetObj = this.searchValue(children, targetVal);
                    if (targetObj) break;
                } else {
                    targetObj = tmpObj;
                    break;
                }
            }
            return targetObj;
        },
        // 约定数据源的object,具备两个key:1.text(显示), value(值,可能是id等)
        onSelectChanged: function(e) {
            var index = e.detail.value;
            this.broadcastValueChanged(index);
        },
        broadcastValueChanged: function(index) {
            var item = this.data.datasource[index];
            var e = {
                index: index,
                childrenKey: this.data.childrenKey,
                textKey: this.data.textKey,
                valueKey: this.data.valueKey,
                item: item
            }
            this.triggerEvent('valueChanged', e);
        },

        selectToggle: function() {
            var nowShow = this.data.selectShow; //获取当前option显示的状态
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

        setText: function(e) {
            var nowIdx = e.target.dataset.index; //当前点击的索引
            var nowText = this.data.datasource[nowIdx].value; //当前点击的内容
            //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
            this.animation.rotate(0).step();

            this.setData({
                selectShow: false,
                text: nowText
            })
            this.broadcastValueChanged(nowIdx);
        }

    }
})