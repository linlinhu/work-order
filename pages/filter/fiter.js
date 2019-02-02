// pages/filter/fiter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowH: 603,
        allType: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowH: res.windowHeight
                });
            }
        });
        that.init();
    },

    //状态初始化
    init: function() {
        var pages = getCurrentPages(), // 获取页面栈
            prevPage = pages[pages.length - 2], // 上一个页面;
            selectedTypes = prevPage.data.selectedTypes,
            type = prevPage.data.type ? prevPage.data.type : 2,
            that = this,
            allType =[],
            len = 0;
        allType.push(wx.getStorageSync("filter-system"))
        if(type == 3) {
            allType.push(wx.getStorageSync("filter-orderStatus"))
        }
        len = allType.length;
        if (selectedTypes.length == 0) {
            for (var i = 0; i < len; i++) {
                var items = allType[i].items ? allType[i].items : [],
                    subLen = items.length;
                for (var j = 0; j < subLen; j++) {
                    if (items[j].code === '') {
                        items[j].isSelected = true;
                    }
                }
            }
        } else {
            for (var i = 0; i < selectedTypes.length; i++) {
                var items = allType[i].items ? allType[i].items :[],
                    subLen = items.length;
                for (var j = 0; j < subLen; j++) {
                    if (items[j].code === selectedTypes[i].code) {
                        items[j].isSelected = true;
                    }
                }
            }
        }
        that.setData({
            allType: allType
        })
    },
    itemClick: function (e) {
        var dataset = e.target.dataset,
            that = this,
            type = that.data.allType[dataset.pindex];
        if (type.items[dataset.index].isSelected) {
            type.items[dataset.index].isSelected = false;
            return false;
        } else {
            for (var i = 0; i < type.items.length; i++) {
                type.items[i].isSelected = false;
            }
            type.items[dataset.index].isSelected = true;
            that.data.allType[dataset.pindex] = type;
            that.setData({
                allType: that.data.allType
            })
        }

    },
    getSearchParams: function (e) {
        var that = this,
            allType = that.data.allType,
            selectedData = [],
            len = allType.length;
        for (var i = 0; i < len; i++) {
            var items = allType[i].items,
                subLen = items.length;
            for (var j = 0; j < subLen; j++) {
                if (items[j].isSelected) {
                    let item = items[j];
                    item.typeCode = allType[i].code;
                    selectedData.push(item);
                }
            }
        }
        var pages = getCurrentPages(), // 获取页面栈
            prevPage = pages[pages.length - 2]; // 上一个页面
        prevPage.setData({
            selectedTypes: selectedData
        })
        wx.navigateBack({
            delta: 1
        })
    }
})