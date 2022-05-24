import getlastEvent from '../utils/getLastEvent' //最后操作的事件
import getSelector from '../utils/getSelector' //获取选择器
import tracker from '../utils/tracker' //追踪器
export function injectJSError() {
	//监控全局未捕获的错误
    window.addEventListener('error', function (event) {
		let lastEvent = getlastEvent() //最后一个交互事件
		//脚本加载错误
		console.log(event.target.src,event.target.href, 'event.target')

        if (event.target && (event.target.src || event.target.href)) {
            tracker.send({
				kind: 'stability', //监控指标的大类
				type: 'error', //小类型 这是一个错误
				errorType: 'resourceError', //js或者css资源加载错误
				// url: '',//访问那个路径报错了
				filename: event.target.src || event.target.href, //报错文件
				tagName: event.target.tagName, //报错行列
				// stack: getLines(event.error.stack), //堆栈信息 字符串
				//body div#container div.content input
				selector: getSelector(event.path), //代表最后一个操作的元素
			})
		} else {
			tracker.send({
				kind: 'stability', //监控指标的大类
				type: 'error', //小类型 这是一个错误
				errorType: 'jsError', //js执行错误
				// url: '',//访问那个路径报错了
				message: event.message, //保存信息
				filename: event.filename, //报错文件
				position: `${event.lineno}:${event.colno}`, //报错行列
				stack: getLines(event.error.stack), //堆栈信息 字符串
				//body div#container div.content input
				selector: lastEvent ? getSelector(lastEvent.path) : '', //代表最后一个操作的元素
			})
		}
	},true) //错误事件对象
	
	window.addEventListener('unhandledrejection',  (event)=> {
		let lastEvent = getlastEvent() //最后一个交互事件
		let message
		let filename
		let line = 0
		let column = 0
		let stack = ''
		let reason = event.reason
		if (typeof reason === 'string') {
			message = reason
		} else if (typeof reason === 'object') {
			//说明是一个错误对象
			message = reason.message
			if (reason.stack) {
				let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/) //s+捕获任意长度的空格
				filename = matchResult[1]
				line = matchResult[2]
				column = matchResult[3]
			}
			stack = getLines(reason.stack)
		}
		tracker.send(
			{
				kind: 'stability', //监控指标的大类
				type: 'error', //小类型 这是一个错误
				errorType: 'promiseError', //js执行错误
				// url: '',//访问那个路径报错了
				message, //保存信息
				filename, //报错文件
				position: `${line}:${column}`, //报错行列
				stack, //堆栈信息 字符串
				//body div#container div.content input
				selector: lastEvent ? getSelector(lastEvent.path) : '', //代表最后一个操作的元素
			},

		)
	},true)
	function getLines(stack) {
		//字符串替换
		//1.split通过空格分割字符串
		//2.删除第一项
		//3.遍历剩下的匹配空格+at单词
		//4.用^替换空格
		return stack.split('\n').slice(1).map((item) => item.replace(/^\s+at\s+/g, '')).join('^')
	}
}
