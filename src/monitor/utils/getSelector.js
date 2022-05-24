function getSelectors (path) {
    //反转，过滤
   return path.reverse().filter(element => {
        return element !== document && element !== window;
    }).map(element => {
        let selector = "";
        if (element.id) {
            return `${element.nodeName.toLowerCase()}#${element.id}`
        } else if (element.className && typeof element.className === 'string') {
            return `${element.nodeName.toLowerCase()}.${element.className}`
        } else {
            selector = element.nodeName.toLowerCase()
        }
        return selector
    }).join(' ')
}

export default function (pathOrTarget) {
    //判断是数组
    if (Array.isArray(pathOrTarget)) {//可能是一个数组
        return getSelectors(pathOrTarget)
    } else {//也有可能是对象
        let path = []
        while (pathOrTarget) {
            path.push(pathOrTarget)
            pathOrTarget= pathOrTarget.parentNode
        }
        return getSelectors(path)
    }
}