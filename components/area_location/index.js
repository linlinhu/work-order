var imageUtil = require("../../utils/imageUtils.js");
var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mallId: String,
        areaId: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        mallId: 1,
        areaId: 40,
        mallPic: '',
        mallImageWidth: 0,
        mallImageHeight: 0,
        mallImageScale: 1,
        areas: []
    },
    ready: function() {
        this.setData({
            mallId: this.properties.mallId,
            areaId: this.properties.areaId,
            mallPic: app.api.userHost + '/api-smart-mall-cloud/workOrder/location/anomaly?mallId=' + this.properties.mallId,
        })
        this.getConfigedAreas();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getConfigedAreas: function() {
            var that = this;
            app.api.request({
                url: app.api.userHost + '/api-smart-mall-cloud/workOrder/location/api/queryAreaRatio',
                success: function(res) {
                    var areas = [];
                    res.forEach(function(area) {
                        area.areaPic = app.api.userHost + '/api-smart-mall-cloud/workOrder/location/anomaly?mallId=' + that.data.mallId + '&areaId=' + area.areaId;
                        areas.push(area);
                    });
                    that.setData({
                        areas: areas
                    });
                }
            })
        },
        imageLoad: function(e) {
            var that = this;
            var imageSize = imageUtil.imageUtil(e)
            that.setData({
                mallImageWidth: imageSize.imageWidth,
                mallImageHeight: imageSize.imageHeight,
                mallImageScale: imageSize.scale
            })
        },
        imageLoadError: function(e) {
            this.setData({
                mallPic: 'storefloor.png'
            })
        },
        areaPicLoad: function(e) {
            var that = this;
            var areas = this.data.areas;
            var datas = e.target.dataset;
            areas[datas.index].left = datas.x * that.data.mallImageScale;
            areas[datas.index].top = datas.y * that.data.mallImageScale;
            var imageSize = imageUtil.imageUtil(e);
            areas[datas.index].width = imageSize.originalWidth * datas.ratio * that.data.mallImageScale;
            areas[datas.index].height = imageSize.originalHeight * datas.ratio * that.data.mallImageScale;
            that.setData({
                areas: areas
            })
        },
        areaPicError: function(index) {
            this.data.areas[index] = 'no-pic.png';
            this.setData({
                areas: areas
            })
        }
        
    }
})