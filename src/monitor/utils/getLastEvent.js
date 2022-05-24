/**
 * 获取最后一个操作事件
 */
let lastEvent
['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(eventType => {
    //监听事件
    //值
    document.addEventListener(eventType, (event) => {
        lastEvent=event
    }, {
        capture: true, //捕获阶段执行
        passive: true, //默认不阻止默认事件
    })
})

export default function () {
    return lastEvent
}