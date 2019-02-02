var store = require('../../modules/storage/store.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        startTime: String,
        endTime: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        isFold: false,
        minDate: '',
        maxDate: '',
        minDate1: '',
        startDate: '',
        endDate: '',
        today: null,
        pickerDetail: '',
        upStartDate: false,
        upEndDate: false,
        dealRanges: [{
                type: 1,
                name: '本周',
                class: ''
            }, {
                type: 2,
                name: '本月',
                class: ''
            }, {
                type: 3,
                name: '最近3个月',
                class: ''
            }]
    },
    ready: function() {
      
        this.setData({
            isFold: true,
        })
        this.initDateRange();
        this.initDealRanges();
        this.initCalendar();
       

    },
    /**
     * 组件的方法列表
     */
    methods: {
        initDateRange: function() {
            var today = new Date(store.getItem('systemTime'));
            var minYear = today.getFullYear();
            var minMonth = today.getMonth() - 3;
            var minDate = today.getDate();
            if (minMonth < 0) {
                minYear = minYear - 1;
                minMonth = minMonth + 12;
            }
            var monthDate = this.getMonthDays(minYear, minMonth);
            if (minDate > monthDate) {
                minDate = monthDate;
            }
            var minDate = this.formatDate(new Date(minYear, minMonth, minDate));
            var maxDate = this.formatDate(today);
            this.setData({
                today: today,
                minDate: minDate,
                maxDate: maxDate
            });
        },
        initCalendar: function() {
            var that = this;
            // 获取传入的起始时间， 字符串的话转义不会成功，得到NAN
            var startTime = parseInt(that.properties.startTime);
            var endTime = parseInt(that.properties.endTime);

            // 初始化起始时间及时间段详情
            var startDate = '',
                endDate = '',
                pickerDetail = '';

            var minDate = new Date(that.data.minDate + ' 23:59');
            var maxDate = new Date(that.data.maxDate + ' 23:59');

            // 传入起始时间有效才对初始化的参数进行赋值
            if (startTime && endTime) {
                if (endTime < startTime) { // 开始时间一定比结束时间小，传反了智能反转
                    var temp = endTime;
                    endTime = startTime;
                    startTime = temp;
                }
                // 传入的时间区间必须在本日历选择选择的时间范围内（目前是写死的三个月内）
                if (minDate.getTime() <= startTime && maxDate.getTime() >= endTime) {
                    startDate = that.formatDate(new Date(startTime));
                    endDate = that.formatDate(new Date(endTime));
                    var dealRanges = that.data.dealRanges;
                    for (var i in dealRanges) {
                        var item = dealRanges[i];
                        item.class = '';
                        if (item.startDate == startDate && item.endDate == endDate) {
                            item.class = 'checked-range';
                            pickerDetail = item.name;
                        };
                    }
                    if (!pickerDetail) {
                        pickerDetail = startDate != endDate ? (startDate + '至' + endDate) : startDate;
                    } else {
                        that.setData({
                            dealRanges: dealRanges
                        })
                    }
                } else {
                    wx.showToast({
                        title: '传入时间区间不得大于近3个月',
                        icon: 'none'
                    });
                }
            }
            that.setData({
                startDate: startDate.replace(/\//g, ''),
                endDate: endDate.replace(/\//g, ''),
                pickerDetail: pickerDetail
            });
            // 传入的起始时间无效或者未传入，默认选中本周的区间
            if (!startDate && !endDate) {
                that.setPicker(0);
            }
        },
        //获得某月的天数 
        getMonthDays: function (myYear, myMonth) {
            var monthStartDate = new Date(myYear, myMonth, 1);
            var monthEndDate = new Date(myYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        },
        //格局化日期：yyyy-MM-dd 
        formatDate: function (date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();

            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "/" + mymonth + "/" + myweekday);
        },
        initDealRanges: function () {
            var that = this;
            var today = that.data.today;
            var dayOfWeek = today.getDay();
            var day = today.getDate();
            var month = today.getMonth();
            var year = today.getFullYear();
            for (var i in that.data.dealRanges) {
                var item = that.data.dealRanges[i];
                var type = item.type;
                var startDate, endDate;
                if (type == 1) {
                    startDate = new Date(year, month, day - dayOfWeek + 1);
                    endDate = new Date(year, month, day + (7 - dayOfWeek));
                }
                if (type == 2) {
                    startDate = new Date(year, month, 1);
                    endDate = new Date(year, month, that.getMonthDays(year, month));
                }
                if (type == 3) {
                    startDate = new Date(that.data.minDate + ' 23:59');
                    endDate = new Date(that.data.maxDate + ' 23:59');
                }

                if (endDate.getTime() > today.getTime()) {
                    endDate = today;
                }

                item.startDate = this.formatDate(startDate);
                item.endDate = this.formatDate(endDate);

            }
            this.setData({
                dealRanges: that.data.dealRanges
            });
        },
        tapPicker: function (e) {
            var index = e.target.dataset.index;
            this.setPicker(index);
        },
        emptyClass: function() {
            for (var i in this.data.dealRanges) {
                this.data.dealRanges[i].class = '';
            }
        },
        setPicker: function (index) {
            this.emptyClass();
            var dealRange = this.data.dealRanges[index];
            dealRange.class = 'checked-range'
            this.setData({
                startDate: dealRange.startDate.replace(/\//g, ''),
                endDate: dealRange.endDate.replace(/\//g, ''),
                pickerDetail: dealRange.name,
                dealRanges: this.data.dealRanges
            });
        },
        changeStartDate: function (e) {
            var startDate = e.detail.value;
            var endDate = this.data.endDate;
            if (!endDate || new Date(endDate).getTime() >= new Date(startDate).getTime()) {
                var pikerDetail = this.data.pickerDetail;
                startDate = startDate.replace(/\//g, '');
                endDate = endDate.replace(/\//g, '');
                this.setData({
                    startDate: startDate,
                    minDate1: startDate,
                    maxDate1: '',
                    pickerDetail: startDate && endDate ? (startDate != endDate ? (startDate + '至' + endDate) : startDate) : pikerDetail,
                    upStartDate: false
                });
                this.emptyClass();

            } else {
                wx.showToast({
                    title: '开始时间不能比结束时间晚',
                    icon: 'none'
                })
            }
        },
        changeEndDate: function (e) {
            var startDate = this.data.startDate;
            var endDate = e.detail.value;
            if (!startDate || new Date(endDate).getTime() >= new Date(startDate).getTime()) {
                var pikerDetail = this.data.pickerDetail;
                startDate = startDate.replace(/\//g, '');
                endDate = endDate.replace(/\//g, '');
                this.setData({
                    endDate: endDate,
                    maxDate1: endDate,
                    minDate1: '',
                    pickerDetail: startDate && endDate ? (startDate != endDate ? (startDate + '至' + endDate) : startDate) : pikerDetail,
                    upEndDate: false
                });
                this.emptyClass();
            } else {
                wx.showToast({
                    title: '结束时间不能比开始时间早',
                    icon: 'none'
                })
            } 
        },
        upStartDate: function() {
            this.setData({
                upStartDate: true,
                upEndDate: false
            })
        },
        upEndDate: function () {
            this.setData({
                upStartDate: false,
                upEndDate: true
            })
        },
        confirmPicker: function () {
            var startDate = this.data.startDate;
            var endDate = this.data.endDate;
            if (startDate && endDate) {
                this.foldPicker();
                startDate = startDate.replace(/\//g, '');
                endDate = endDate.replace(/\//g, '');
                this.triggerEvent('picker', {
                    beginDate: startDate,
                    endDate: endDate,
                    beginTime: new Date(startDate + ' 23:59').getTime(),
                    endTime: new Date(endDate + ' 23:59').getTime()
                }, {})
            }
        },
        foldPicker: function () {
            this.setData({
                isFold: !this.data.isFold
            })
        },
        tapFold: function(e) {
            if (e.target.dataset.fold == 1) {
                this.foldPicker();
            }
        }
    }
})