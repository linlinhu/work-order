module.exports = {
    setRangeTime: setRangeTime,
    setTypeString: setTypeString
}

/**
 * 将搜索的日期转换成字符串显示
 * selectedDate 选中的日期
 */
function setRangeTime(selectedDate){
    var  rangeTime = [];
    selectedDate = selectedDate ? selectedDate : {};
    if (!selectedDate || selectedDate == {}) {
        rangeTime.push('全部时间');
    } else {
        if (selectedDate.rangeType == 'select') {
            if (selectedDate.endTime == 0) {
                selectedDate.endTime = selectedDate.beginTime;
            }
            rangeTime.push(formatDate(selectedDate.beginTime))
            rangeTime.push(formatDate(selectedDate.endTime))
        } else {
            let temp = '';
            switch (selectedDate.rangeType) {
                case 'all':
                    temp = '全部时间';
                    break;
                case 'today':
                    temp = '今日';
                    break;
                case 'week':
                    temp = '本周';
                    break;
                case 'month':
                    temp = '本月';
                    break;
                default:
                    temp = '全部时间';

            }
            rangeTime.push(temp);
        }
    }
    return rangeTime;
}

/**
 * 将搜索的类型转换成指定字符串显示
 * selectedDate 选中的日期
 */
function setTypeString(p){
    var selectedTypes = p ? p : [],
        nameList = [],
        len = selectedTypes.length,
        typeString = '';
    for (var i = 0; i < len; i++) {
        if (selectedTypes[i].code !== '') {
            let name = selectedTypes[i].name ? selectedTypes[i].name : selectedTypes[i].value;
            nameList.push(name)
        }
    }
    if (nameList.length == 0) {
        typeString = '全部';
    } else {
        typeString = nameList.join(',');
    }
    return typeString;
}
/**
 * 将时间戳转换为月日
 * timestamp 时间戳
 */
function formatDate(timestamp) {
    var date = new Date(timestamp);
    var month = date.getMonth() + 1;
    var day = date.getDate();

    function formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    return [month, day].map(formatNumber).join('-');
}
