const { getMyInfo, logOut, getConf, getAppConfig } = require('../../../api/api')

// pages/module-c/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showShare: false,
    info: {},
    img: '',
		xcxImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getMyInfo().then(res => {
      const info = res.data;
      info.percent = +info.percent;
      this.setData({
        info
      })
    })

    getConf().then(res => {
      if (+res.code === 0) {
        this.setData({
          img: res.data.xcx_img
        })
      }
    })

		getAppConfig().then(res => {
			this.setData({
				xcxImg: res.data.xcx_img
			})
		});
  },

  openShare () {
    this.setData({
      showShare: true
    });
  },

  logOut () {
    wx.showModal({
      title: '确定退出当前账号？',
      content: '',
      confirmColor: "#000",
      success(res) {
        if (res.confirm) {
          logOut().then(res => {
            wx.clearStorageSync();
            // wx.navigateTo({
            //   url: '/pages/module-a/login/login'
            // })
						wx.reLaunch({
							url: '/pages/module-a/login/login'
						})
          })
        }
      }
    })
  },

  save () {
    wx.saveImageToPhotosAlbum({
      filePath: '/imgs/code-img.jpg',
      success(res) {
        wx.showToast({
          title: '图片已保存至相册',
          icon: 'none'
        })
      },
      complete (e) {
        console.log(e)
      }
    })
  }
})
