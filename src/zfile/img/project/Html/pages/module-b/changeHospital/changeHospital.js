const {} = require('../../../api/api');

const {
  toUrl,
  resetStoreList
} = require('../../../utils/util')

// 获取应用实例
Page({
  data: {
    _title: '选择医院',
    clerkStores: [], // 医院列表
    clerkStore: {}, // 当前用户医院信息
    addrImg: '',
    token: '',
    showPage: false
  },
  touchToChangeHospital(e) {
    let clerkStore = e.currentTarget.dataset.item;
    wx.setStorageSync('clerkStore', clerkStore)
    wx.navigateBack()

  },
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: this.data._title
    })
  },
  setThemeInfo() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let position = clerkStore.position;
    resetStoreList().then(list => {
      let clerkStores = list;
      let clerkStore = wx.getStorageSync('clerkStore');

      this.setData({
        clerkStore: clerkStore,
        position: position,
        clerkStores: clerkStores,
        addrImg: position === 2 ? '/imgs/module-b/orange_addr.png' : '/imgs/module-b/purple_addr.png',
        showPage: true
      });
    });
  },

  onLoad() {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo && !userInfo.token) {
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
    this.setThemeInfo()
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
