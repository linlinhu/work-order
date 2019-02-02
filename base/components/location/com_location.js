// components/location/com_location.js
var location = require('../../modules/location/location.js');

Component({
    behaviors: ['wx://form-field'],
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

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLocationChanged: function() {
            var self = this;
            location.getLocation({
                success: function (res) {
                    var poi = JSON.stringify(res);
                    self.setData({
                        poiInfo: poi,
                        value: poi
                    });

                    const latitude = res.latitude
                    const longitude = res.longitude
                    wx.openLocation({
                        latitude,
                        longitude,
                        scale: 28
                    });
                }
            });
        }
    }
})