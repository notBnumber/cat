const {
  toUrl,
  numToCn
} = require('../../../utils/util')

const {
  getStoreRank
} = require('../../../api/api')

// 获取应用实例
Page({
  data: {
    _title: '排名',
    position: 1,
    rankInfo: {},
    storeName: '',
    showPage: false
  },
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: this.data._title,
    })
  },
  setThemeInfo(clerkStore) {
    let position = clerkStore.position;
    this.setData({
      position: position
    });
  },

  onLoad() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let store_id = clerkStore.id;
    let userInfo = wx.getStorageSync('userInfo');
    let token = userInfo.token;
    if (!token) {
      toUrl('/pages/module-a/login/login')
    }
    
    this.setPageTitle();
    this.setThemeInfo(clerkStore);
    getStoreRank({token, store_id}).then(res => {
      let rankInfo = res.data;
      this.setData({
        storeName: clerkStore.store_name,
        rankInfo: {
          cn_rank: numToCn(rankInfo.cn_rank),
          pr_rank: numToCn(rankInfo.pr_rank),
          ci_rank: numToCn(rankInfo.ci_rank),
          province_name: rankInfo.province_name,
          city_name: rankInfo.city_name,
          ci_percent: rankInfo.ci_percent
        },
        showPage: true
      })
    })
  },

  onShareAppMessage (Object) {
    return {
    }
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