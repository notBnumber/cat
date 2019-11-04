const {
  toUrl
} = require('../../../utils/util');

const {
  getProductInfo,
  placeOrder
} = require('../../../api/api')

const WxParse = require('../../../wxParse/wxParse.js')

// 获取应用实例
Page({
  data: {
    _title: '产品详情',
    currentIndex: 0,
    position: 1,
    productInfo: {},
    showModal: false,
    modalText: ''
  },
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: this.data._title
    })
  },
  setThemeInfo() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let position = clerkStore.position;
    this.setData({
      position: position,
      themeColor: position === 2 ? 'orange' : 'purple',
    })
  },
  touchToChangeNums(e) {
    let action = e.currentTarget.dataset.act;
    let numSite = "productInfo.num";
    if (action === 'down') {
      this.setData({
        [numSite]: this.data.productInfo.num > 0 ? this.data.productInfo.num - 1 : 0
      })
    } else if (action === 'up') {
      this.setData({
        [numSite]: this.data.productInfo.num + 1
      })
    }
  },
  placeOrder(e) {
    let productId = e.currentTarget.dataset.productid;
    let nums = e.currentTarget.dataset.nums;
    let clerkStore = wx.getStorageSync('clerkStore');
    let storeId = clerkStore.id;
    placeOrder({
      product_id: productId,
      store_id: storeId,
      number: nums
    }).then(res => {
      if (+res.code === 0) {
        this.setData({
          showModal: true,
          modalText: '已下单，请等待联系'
        });
      }
    })
  },
  onLoad(options) {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo && !userInfo.token) {
      toUrl('/pages/module-a/login/login');
    } else {
      let token = userInfo.token
      let productId = options.product_id;

      getProductInfo({
        token,
        product_id: productId
      }).then(res => {
        let productInfo = res.data;
        productInfo.num = 1;
        this.setData({
          productInfo: productInfo,
        })
        WxParse.wxParse('article', 'html', res.data.desc, this, 5);
        this.setPageTitle();
        this.setThemeInfo();
      });
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