// pages/module-a/index/index.js
import { getOpenId } from '../../../api/api';

Page({
	data: {
		showModal: false
	},

	openSetting () {
		wx.openSetting();
	},

	onShow () {
		wx.getSetting({
			success: res => {
				const isOpenLocation = res.authSetting['scope.userLocation'];
				if (isOpenLocation || typeof isOpenLocation === 'undefined') {
					wx.getLocation({
						success: () => {
							this.init();
						},
						fail: () => {
							this.init();
							wx.showToast({
								icon: 'none',
								title: '为了您更好的体验，请打开手机定位'
							})
						}
					})
				} else {
					wx.showModal({
						content: '“沛生医药”需要获取你的地理位置',
						showCancel: false,
						success: () => {
							wx.openSetting()
						}
					})
				}
			}
		})
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  init () {
  	console.log('init')
    wx.showLoading();
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				const code = res.code;
				wx.setStorageSync('appCode', code);
				getOpenId(code).then((data) => {
					if (+data.code !== 0) {
						wx.redirectTo({
							url: '/pages/module-a/login/login'
						});
						return;
					}
					if (+data.data.is_login === 0) {
						wx.redirectTo({
							url: '/pages/module-a/login/login'
						});
					} else {
						wx.setStorageSync('userInfo', {
							role: data.data.role,
							token: data.data.token,
							openId: data.data.openid
						});
						wx.redirectTo({
							url: +data.data.role === 1 ? '/pages/module-c/home-page/home-page' : '/pages/module-b/index/index'
						});
					}
				}).catch((err) => {
					wx.redirectTo({
						url: '/pages/module-a/login/login'
					});
				})
			}
		})
  }
})
