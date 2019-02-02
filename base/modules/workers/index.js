/** 多线程Worker主入口 */
worker.onMessage(function(res) {
    var msg = res.msg;
    switch (msg) {
        case 'getFloorList':
            worker.postMessage({
                msg: 'getFloorList Done'
            });
            break;
        default:
            break;
    }
});