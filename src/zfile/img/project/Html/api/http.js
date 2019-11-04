const Fly = require('../lib/fly.min.js');

const http = new Fly();
// http.config.baseURL = 'https://jbzy.yuege8888.cn/openapi';
http.config.baseURL = 'http://20.0.0.200/hos/petsun/public/index.php/openapi/';
http.interceptors.request.use((request)=>{
	const userInfo = wx.getStorageSync('userInfo') || {};
	const appCode = wx.getStorageSync('appCode');
	request.body = request.body || {};
	request.body.token = userInfo.token;
	request.body.appCode = appCode;
	return request;
});

http.interceptors.response.use(
	(response) => {
		//只将请求结果的data字段返回
		if (+response.data.code !== 0) {
			wx.showToast({
				icon: 'none',
				title: response.data.msg
			});
			if (+response.data.code === 10003) {
				wx.redirectTo({
					url: '/pages/module-a/login/login'
				})
				return;
			}
		}
		return response.data;
	},
	(err) => {
		wx.showToast({
			title: '网络错误'
		});
	}
);

module.exports = http;
