/**
 * 追踪器，上报
 */
let host = 'cn-beijing.log.aliyuncs.com';//主机名
let projectName = 'chenqi-monitor';//项目名
let logstore = 'chenqimonitor-store';//存储名
//把浏览器的UserAgent变成一个对象
let userAgent = require('user-agent')
//获取额外数据
function getExtraData () {
    return {
        title: document.title, //标题
        url: location.href,//url地址
        timestamp: Date.now(),//时间戳
        userAgent: userAgent.parse(navigator.userAgent).name //用户版本
    }
}

//gif图片做上传 图片速度快 没有跨域问题
class SendTracker {
	constructor() {
        this.url = `http://${projectName}.${host}/logstores/${logstore}/track`;//上报的路径
		this.xhr = new XMLHttpRequest//ajax对象
    }
    
    send (data = {}) {
        let extraData = getExtraData()
        let log = { ...extraData, ...data }
        console.log(log,'log')
        //对象的值不能上数字
        for (let key in log) {
            if (typeof log[key] === 'number') {
                log[key] = `${log[key]}`
            }
        }
        let body =JSON.stringify({__logs__:[log]})
        this.xhr.open('POST', this.url, true)
        this.xhr.setRequestHeader('Content-Type', 'application/json')//请求体类型
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0')//请求体版本号
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length) //请求体大小    
        this.xhr.onload = function () {
            // console.log(this.xhr.response)
        }
        this.xhr.onerror = function (error) {
            // console.log(error)
        }
        this.xhr.send(body)
    }
}

 export default new SendTracker()
