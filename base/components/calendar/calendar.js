var store = require('../../modules/storage/store.js');
/**
 * 还差组件返回事件绑定，以及组件调用方式
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        start: String,
        end: String,
        systime: String
    },
    /**
     * 组件的初始数据
     */
    data: {
        today: null,
        ynow: 0,
        mnow: 0,
        dnow: 0,
        months_days: [],
        slideTop: 0,
        start_date: '',
        start_time: 0,
        end_date: '',
        end_time: 0,
        nowDayOfWeek: new Date(store.getItem('systemTime')).getDay(),
        nowDay: new Date(store.getItem('systemTime')).getDate(),
        nowMonth: new Date(store.getItem('systemTime')).getMonth(),
        nowYear: new Date(store.getItem('systemTime')).getFullYear(),

    },
    ready: function() {
        if (this.properties.start && this.properties.end) {
            var startDay = new Date(parseInt(this.properties.start));
            var endDay = new Date(parseInt(this.properties.end));
            this.setData({
                today: startDay,
                ynow: startDay.getFullYear(),
                mnow: startDay.getMonth(),
                dnow: startDay.getDate(),
                start_date: startDay.getFullYear() + '-' + (startDay.getMonth() + 1) + '-' + startDay.getDate(),
                start_time: this.getTime(startDay.getFullYear(), startDay.getMonth(), startDay.getDate()),
                end_date: endDay.getFullYear() + '-' + (endDay.getMonth() + 1) + '-' + endDay.getDate(),
                end_time: this.getTime(endDay.getFullYear(), endDay.getMonth(), endDay.getDate())
            })
            this.renderCalendar();
        } else {
            var today = new Date();
            this.setData({
                today: today,
                ynow: today.getFullYear(),
                mnow: today.getMonth(),
                dnow: today.getDate()
            })
            this.renderCalendar();
            this.clearCalendar();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getTime: function(y, m, d) {
            var date = new Date(y + '-' + (m + 1) + '-' + d);
            return date.getTime();
        },
        is_leap: function(year) {
            //判断是否为闰年
            return (year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : (year % 4 == 0 ? 1 : 0));
        },
        monDetail: function() { // 返回年月标题
            return this.data.ynow + "年" + (this.data.mnow + 1) + "月";
        },
        calendar: function(today, ynow, mnow, dnow) { // 返回日历表格数据
            var today = this.data.today;
            var ynow = this.data.ynow;
            var mnow = this.data.mnow;
            var dnow = this.data.dnow;

            var nlstr = new Date(ynow, mnow, 1); //当月第一天
            var firstday = nlstr.getDay(); //第一天星期几

            var m_days = new Array(31, 28 + this.is_leap(ynow), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31); //每个月的天数

            var tr_str = Math.ceil((m_days[mnow] + firstday) / 7); //当前月天数+第一天是星期几的数值   获得 表格行数
            var i, k, idx, dayText;
            var days = [];
            for (i = 0; i < tr_str; i++) { //表格的行
                for (k = 0; k < 7; k++) { //表格每行的单元格
                    idx = i * 7 + k; //单元格自然序列号
                    dayText = idx - firstday + 1; //计算日期
                    (dayText <= 0 || dayText > m_days[mnow]) ? dayText = "": dayText = idx - firstday + 1; //过滤无效日期（小于等于零的、大于月总天数的）      
                    var dayDate = dayText != '' ? (ynow + '-' + (mnow + 1) + '-' + dayText) : '';
                    var dayTime = dayDate != '' ? new Date(dayDate).getTime() : 0;
                    days.push({
                        text: dayText,
                        date: dayDate,
                        time: dayTime
                    });
                }
            }
            return days;
        },
        nextMonth: function() { // 设置邻近下一个月的全局变量并返回日历数据
            var ynow = this.data.ynow;
            var mnow = this.data.mnow;
            if (mnow >= 11) {
                mnow = 0;
                ynow = ynow + 1;
            } else {
                mnow++;
            }
            this.setData({
                ynow: ynow,
                mnow: mnow
            });
            return {
                title: this.monDetail(), // 当月年月标题
                days: this.calendar() // 当月日历表格
            }
        },
        renderCalendar: function() {
            var months_days = [];
            months_days.push({
                title: this.monDetail(), // 当月年月标题
                days: this.calendar() // 当月日历表格
            });
            months_days.push(this.nextMonth()); // 加载邻近下月的日历数据
            // 重新渲染
            this.setData({
                months_days: months_days
            })
        },
        preMonths: function() {
            var ynow = this.data.ynow;
            var mnow = this.data.mnow;
            if (mnow <= 0) {
                mnow = 10;
                ynow = ynow - 1;
            } else {
                mnow -= 2; // 最新的月份 和 当前显示的开始月份的邻近上一月份 的 恒差 是 2
                if (mnow <= 0) {
                    ynow = ynow - 1;
                    mnow = 11;
                }
            }
            this.setData({
                ynow: ynow,
                mnow: mnow
            });
            this.renderCalendar();
        },
        tapStart: function(e) { //日历区域开始滑动
            this.setData({
                slideTop: e.changedTouches[0].pageY
            });
        },
        tapEnd: function(e) { // 日历区域结束滑动
            var slide = e.changedTouches[0].pageY - this.data.slideTop;
            if (slide > 150) { // 上滑加载邻近上一个月份
                this.preMonths();
            }
            if (slide < -150) { // 下滑加载邻近下一个月份
                this.renderCalendar();
            }
        },
        clearCalendar: function() {
            this.setData({
                start_date: '',
                start_time: 0,
                end_date: '',
                end_time: 0
            });
        },
        tapDay: function(e) {
            var startTime = this.data.start_time;
            var endTime = this.data.end_time;
            var data = e.target.dataset;
            if (data.time > 0) { // 一切的前提是选择的时间是有效时间
                if (startTime > 0) { // 存在开始时间的选择
                    if (endTime > 0) { // 存在结束时间的选择
                        if (data.time >= startTime) { // 如果当前选择的时间在开始时间之后
                            this.clearCalendar(); // 重置日历选择保存数据
                        }
                        // 将当前选择让时间设置为开始时间
                        this.setData({
                            start_date: data.date,
                            start_time: data.time
                        })
                    } else { // 未选择结束时间
                        if (data.time >= startTime) { // 当前选择的时间必须大于开始时间，才能将之设置为结束时间
                            this.setData({
                                end_date: data.date,
                                end_time: data.time
                            })
                        } else { // 否则视为重新选择开始时间
                            this.setData({
                                start_date: data.date,
                                start_time: data.time
                            })
                        }
                    }
                } else { // 不存在开始时间和结束时间的选择，则设置为选择开始时间
                    this.setData({
                        start_date: data.date,
                        start_time: data.time
                    })
                }
            }
        },
        //获得某月的天数 
        getMonthDays: function(myMonth){
            var monthStartDate = new Date(this.data.nowYear, myMonth, 1);
            var monthEndDate = new Date(this.data.nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        },
        //格局化日期：yyyy-MM-dd 
        formatDate: function(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth() + 1;
            var myweekday = date.getDate();

            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            return (myyear + "-" + mymonth + "-" + myweekday);
        },
        getWeekStartDate: function() {
            var weekStartDate = new Date(this.data.nowYear, this.data.nowMonth, this.data.nowDay - this.data.nowDayOfWeek + 1);
            return this.formatDate(weekStartDate);
        },
        getWeekEndDate: function() {
            var weekEndDate = new Date(this.data.nowYear, this.data.nowMonth, this.data.nowDay + (7 - this.data.nowDayOfWeek));
            return this.formatDate(weekEndDate);
        },
        getMonthStartDate: function(){
            var monthStartDate = new Date(this.data.nowYear, this.data.nowMonth, 1);
            return this.formatDate(monthStartDate);
        },
        getMonthEndDate: function(){
            var monthEndDate = new Date(this.data.nowYear, this.data.nowMonth, this.getMonthDays(this.data.nowMonth));
            return this.formatDate(monthEndDate);
        },
        getRangeDate: function(e) {
            var that = this;
            var rangeType = e.target.dataset.type;
            var beginTime = 0;
            var endTime = 0;
            var systime = store.getItem('systemTime');

            if (rangeType == 'today') {
                var todayStr = this.data.nowYear + '-' + (this.data.nowMonth + 1) + '-' + this.data.nowDay;
                beginTime = new Date(todayStr + ' 00:00:00').getTime();
                endTime = new Date(todayStr + ' 23:59:59').getTime();
            }
            if (rangeType == 'week') {
                beginTime = new Date(this.getWeekStartDate() + ' 00:00:00').getTime();
                endTime = new Date(this.getWeekEndDate() + ' 23:59:59').getTime();
            }
            if (rangeType == 'month') {
                beginTime = new Date(this.getMonthStartDate() + ' 00:00:00').getTime();
                endTime = new Date(this.getMonthEndDate() + ' 23:59:59').getTime();
            }
            if (rangeType == 'select') {
                beginTime = that.data.start_time;
                endTime = that.data.end_time;
            }
            this.triggerEvent('myevent', {
                rangeType: rangeType,
                beginTime: beginTime,
                endTime: endTime
            }, {})
        }
    }
})