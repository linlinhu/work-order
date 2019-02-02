var imageUtil = require("../../utils/imageUtils.js");
var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        deviceId: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgUrl: app.api.userHost + "/api-smart-mall-cloud/workOrder/location/anomaly?floorId=66",
        imagewidth: 0,
        imageheight: 0,
        pointX: 0,
        pointY: 0,
        device: {},
        floor: {},
        scale: 1

    },
    ready: function() {
        this.getDeviceInfo();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getDeviceInfo: function() {
            var that = this;
            app.api.request({
                url: app.api.userHost + '/api-smart-mall-cloud/workOrder/location/api/device/detail',
                data: {
                    id: that.properties.deviceId
                },
                success: function(res) {
                    that.setData({
                        device: res,
                        imgUrl: app.api.userHost + "/api-smart-mall-cloud/workOrder/location/anomaly?floorId=" + res.floorId
                    })
                }
            })
        },
        imageLoad: function(e) {
            var that = this;
            var imageSize = imageUtil.imageUtil(e)
            that.setData({
                imagewidth: imageSize.imageWidth,
                imageheight: imageSize.imageHeight
            })
            // 如果设备详情接口加载正常，楼层图片加载正常，则正常计算设备点位
            var pointX,pointY;
            if (that.data.device && that.data.device.x && that.data.device.y && that.data.imgUrl != 'no-pic.png') {
                pointX = imageSize.scale * that.data.device.x
                pointY = imageSize.scale * that.data.device.y
            } else {
                pointX = -50;
                pointY = -50;
            }
            that.setData({
                pointX: pointX,
                pointY: pointY
            })
        },
        scaleFloor: function(e) {
            this.setData({
                scale: e.detail.scale
            })
        },
        floorImageLoadError: function(e) {
            this.setData({
                imgUrl: 'no-pic.png'
            })
        }
    }
})