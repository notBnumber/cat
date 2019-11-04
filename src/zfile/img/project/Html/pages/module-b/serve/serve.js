const {getAppConfig} = require('../../../api/api');
const {toUrl} = require('../../../utils/util');
// 获取应用实例
Page({
  data: {
    _title: '联系客服',
    position: 1,
    phone: '',
    showPage: false
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
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function(res) {
        console.log(res)
      }
    })
  },
  getAppConfig() {
    let userInfo = wx.getStorageSync('userInfo');
    let token = userInfo.token;
    if (!token) {
      toUrl('/pages/module-a/login/login');
    }

    getAppConfig(token).then(res => {
      this.setData({
        phone: res.data.service_phone,
        showPage: true
      })
    })
  },
  onLoad() {
    this.setPageTitle();
    this.setThemeInfo();
    this.getAppConfig();
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