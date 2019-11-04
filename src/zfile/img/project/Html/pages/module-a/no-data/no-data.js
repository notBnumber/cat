// pages/module-a/no-data/no-data.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showModal: true
    })
  },
  
  toSignUp () {
    wx.navigateTo({
      url: '/pages/module-a/sign-up/sign-up'
    })
  }
})