// components/regionList/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        check: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        isActive: null,
        listMain: [],
        toView: 'inToView0',
        oHeight: [],
        scroolHeight: 0
    },
    ready: function() {
        var that = this;
        that.setData({
            check: that.properties.check
        });
        that.getItems();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //点击右侧字母导航定位触发
        scrollToViewFn: function(e) {
            var that = this;
            var _id = e.target.dataset.id;
            for (var i = 0; i < that.data.listMain.length; ++i) {
                if (that.data.listMain[i].id === _id) {
                    that.setData({
                        isActive: _id,
                        toView: 'inToView' + _id
                    })
                    break
                }
            }
        },
        // 页面滑动时触发
        onPageScroll: function(e) {
            this.setData({
                scroolHeight: e.detail.scrollTop
            });
            for (let i in this.data.oHeight) {
                if (e.detail.scrollTop < this.data.oHeight[i].height) {
                    this.setData({
                        isActive: this.data.oHeight[i].key
                    });
                    return false;
                }
            }

        },
        // 处理数据格式，及获取分组高度
        getItems: function() {
            var that = this;
            if (that.data.listMain.length == 0) {
                return false;
            }
            //赋值给当前高亮的isActive
            that.setData({
                isActive: that.data.listMain[0].id
            });

            //计算分组高度,wx.createSelectotQuery()获取节点信息
            var number = 0;
            for (let i = 0; i < that.data.listMain.length; ++i) {
                number = 71 * that.data.listMain[i].items.length + 65 + number;
                var newArry = [{
                    'height': number,
                    'key': that.data.listMain[i].id,
                    "name": that.data.listMain[i].alpha
                }]
                that.setData({
                    oHeight: that.data.oHeight.concat(newArry)
                })
            };
        },
        emptySelect: function() {
            this.setData({
                select: {}
            })
        },
        valSelect: function(e) {
            var eventDetail = {
                select: e.target.dataset
            };
            this.setData(eventDetail)
            this.triggerEvent('myevent', eventDetail, {})
        },
        itemTapped: function(e) {
            // 配置传递dataset,使用者按需取值
            var ds = e.currentTarget.dataset;
            this.triggerEvent('itemSelect', ds);
        }
    }
})