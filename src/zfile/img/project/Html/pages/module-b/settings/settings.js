const {
  quit, getAppConfig
} = require('../../../api/api');

const {
  toUrl
} = require('../../../utils/util');

// 获取应用实例
Page({
  data: {
    _title: '设置',
    position: 1,
    showModal: false,
    modalText: '',
    showPop: false
  },
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: this.data._title,
    })
  },
  setThemeInfo() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let position = clerkStore.position;
    this.setData({
      position: position
    });
  },
  quit() {
    let _this = this;
    let token = this.data.token;
    wx.showModal({
      title: '确定退出当前账号？',
      content: '',
      confirmColor: "#000",
      success(res) {
        if (res.confirm) {
          quit(token).then(res => {
            if (+res.code === 0) {
              wx.clearStorageSync();
              _this.setData({
                showModal: true,
                modalText: '退出成功！'
              });
							wx.reLaunch({
								url: '/pages/module-a/login/login'
							})
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  ifShowPop(){
    this.setData({
      showPop: !this.data.showPop
    })
  },
  touchShowShare() {
    getAppConfig(this.data.token).then(res => {
      this.setData({
        showPop: !this.data.showPop,
        xcxImg: res.data.xcx_img
      })
    });

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
  },
  touchToUrl(e) {
    let token = this.data.token;
    let url = '';
    if (!token) {
      url = '/pages/module-a/login/login';
    } else {
      url = e.currentTarget.dataset.url;
    }

    toUrl(url);
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo');
    console.log(!userInfo || !userInfo.token)
    if (!userInfo || !userInfo.token) {
      toUrl('/pages/module-a/login/login')
    } else {
      this.setData({
        token: userInfo.token
      })
    }
    this.setPageTitle();
    this.setThemeInfo();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
