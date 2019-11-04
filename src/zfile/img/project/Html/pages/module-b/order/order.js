const {
  getProductList,
  placeOrder
} = require('../../../api/api')

const { toUrl } = require('../../../utils/util')

// 获取应用实例
Page({
  data: {
    _title: '下单',
    position: 1,
    productList: [],
    showModal: false,
    modalText: '',
    clerkStore: {},
    indicatorColor: {}
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
      clerkStore,
      position: position,
      indicatorColor: {
        origin: position === 2 ? '#ffb147' : '#906ba1',
        active: position === 2 ? '#f16c00' : '#652e81'
      },
    });
    console.log(this.data.indicatorColor)
  },
  getProductList() {
    let token = this.data.token;
    getProductList(token).then(res => {
      let productList = res.data;
      productList.forEach((val, key) => {
        val.num = 1;
      });
      this.setData({
        productList: productList
      })
    })
  },
  touchToChangeNums(e) {
    let action = e.currentTarget.dataset.act;
    let index = e.currentTarget.dataset.index;
    let numSite = "productList[" + index + "].num";
    if (action === 'down') {
      this.setData({
        [numSite]: this.data.productList[index].num > 0 ? this.data.productList[index].num - 1 : 0
      })
    } else if (action === 'up') {
      this.setData({
        [numSite]: this.data.productList[index].num + 1
      })
    }
  },
  placeOrder(e) {
    let clerkStore = wx.getStorageSync('clerkStore');
    let token = this.data.token;
    let store_id = clerkStore.id;
    let product_id = e.currentTarget.dataset.productid;
    let number = e.currentTarget.dataset.nums;

    placeOrder({
      token,
      product_id,
      store_id,
      number
    }).then(res => {
      if (+res.code === 0) {
        this.setData({
          showModal: true,
          modalText: '已下单，请等待联系'
        });
      }
    })
  },
  touchToUrl(e) {
    let productId = e.currentTarget.dataset.product_id;
    let userInfo = wx.getStorageSync('userInfo');
    let url = '';
    
    if (!userInfo && !userInfo.token) {
      url = '/pages/module-a/login/login';
    } else {
      url = e.currentTarget.dataset.url + '?product_id=' + productId;
    }

    toUrl(url);
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
    this.getProductList();
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