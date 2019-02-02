var common = require("../utils/pinyin.js"); 
module.exports = {
    parseAsList: parseAsList
}
/**
 * 将人员数据集合转换成字母排序列表
 * alpha_sorting 组件数据构造
 */
function parseAsList(users) {
    var aphas = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var indexId = 1;
    var members = [];
    for (var i in aphas) {
        var item = {
            id: indexId
        };
        var items = []
        var apha = aphas[i];
        users.forEach(function (user) {
            var cc = common.pinyin.getCamelChars(user.realName).substring(0, 1).toUpperCase();
            if (cc == apha) {
                items.push({
                    id: user.id,
                    name: user.realName,
                    mobile: user.mobile,
                    flock: user.flock
                })
            }
        });
        if (items.length > 0) {
            item.alpha = apha;
            item.items = items;
            members.push(item);
            indexId++;
        }
    }
    var otherItems = [];
    users.forEach(function (user) {
        var cc = common.pinyin.getCamelChars(user.realName).substring(0, 1).toUpperCase();
        var isApha = false;
        for (var i in aphas) {
            var apha = aphas[i];
            if (cc == apha) {
                isApha = true;
            }
        }
        if (!isApha) {
            otherItems.push({
                id: user.id,
                name: user.realName,
                mobile: user.mobile,
                flock: user.flock
            })
        }
    });
    if (otherItems.length > 0) {
        var otherItem = {
            id: indexId,
            alpha: '#',
            items: otherItems
        };

        members.push(otherItem);
    }
    return members;

}
