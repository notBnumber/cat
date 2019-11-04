// pages/module-a/login/login.js
import {getOpenId} from "../../../api/api";

const { login, sendCode } = require('../../../api/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '',
    sendCodeMsg: '获取验证码',
    modalText: '',
    showModal: false,
    timer: null
  },

  onLoad () {
    wx.clearStorageSync();
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const code = res.code;
        wx.setStorageSync('appCode', code);
        getOpenId(code).then((data) => {
          wx.setStorageSync('userInfo', {
            openId: data.data.openid
          });
        })
      }
    })
  },

  onUnload () {
    clearInterval(this.data.timer);
  },

  enterTel (e) {
    this.setData({
      tel: e.detail.value
    });
  },

  sendCode () {
    if (this.validTel(this.data.tel) && !this.data.timer) {
      this.startCount();
      sendCode(this.data.tel).then(res => {
        wx.showToast({
          title: '验证码已发送',
          icon: 'none'
        });
      })
    }
  },

   startCount () {
    let num = 60;
    const timer = setInterval(() => {
      if (num === 0) {
        this.setData({
          sendCodeMsg: '获取验证码',
          timer: null
        });
        clearInterval(timer);
        return
      }
      this.setData({
        sendCodeMsg: --num
      });
    }, 1000);
    this.setData({
      timer
    });
   },

	validTel (tel) {
		const res = /^[1]([3-9])[0-9]{9}$/.test(tel);
		if (!res) {
			this.setData({
				modalText: '请填写正确的手机号码',
				showModal: true
			});
			return false;
		}
		return res;
	},

  submit (e) {
    if (this.validTel(e.detail.value.phone)) {
      const code = e.detail.value.code;
      if (!code || typeof +code !== 'number') {
        this.setData({
          modalText: '请输入验证码',
          showModal: true
        });
        return;
      }
      e.detail.value.openid = wx.getStorageSync('userInfo').openId
      login(e.detail.value).then(res => {
        if (+res.code === 0) {
          const urlObj = {
            0: '/pages/module-a/no-data/no-data',
            '1': '/pages/module-c/home-page/home-page',
            '2': '/pages/module-b/index/index'
          };
          const data = res.data;
          const url = data ? urlObj[data.role] : urlObj[0];
          if (data) {
            wx.setStorageSync('userInfo', {
              ...data
            });
          }
          wx.redirectTo({
            url
          });
        } else if (+res.code === 10001) {
          wx.navigateTo({
            url: '/pages/module-a/no-data/no-data'
          });
        }
      });
    }
  }
});
