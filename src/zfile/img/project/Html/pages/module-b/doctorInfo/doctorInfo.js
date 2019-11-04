const {
  getStoreInfo
} = require('../../../api/api');

const {
  toUrl,
  decodeAddress
} = require('../../../utils/util')

// 获取应用实例
Page({
  data: {
    _title: '医院资料',
    position: 1,
    clerkStore: {},
    addrImg: '',
    storeInfo: {},
    shopOwerInfo: {},
    clerkList: [],
    clerkInfo: {}
  },
  toEdit(event) {
    let id = event.currentTarget.dataset.id ? event.currentTarget.dataset.id : 0;
    let url = id ? "/pages/module-b/editDoctor/editDoctor?id=" + id : "/pages/module-b/editDoctor/editDoctor";
    toUrl(url);
  },
  setThemeInfo() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let position = clerkStore.position;

    let indicatorColor = {
      origin: position === 2 ? '#ffb147' : '#906ba1',
      active: position === 2 ? '#f16c00' : '#652e81'
    };
    this.setData({
      position: clerkStore.position,
      clerkStore: clerkStore,
      indicatorColor: indicatorColor,
      addrImg: position === 2 ? '/imgs/module-b/orange_addr.png' : '/imgs/module-b/purple_addr.png'
    })
  },
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: this.data._title
    })
  },
  getStoreInfo() {
    let store_id = this.data.clerkStore.id;
    let token = this.data.token;
    getStoreInfo({
      token,
      store_id
    }).then(res => {
      console.log(res)
      wx.setStorageSync('clerkList', res.data.store_clerk_list);
      let storeInfoAddress = wx.getStorageSync('storeInfoAddress');
      let storeInfo = res.data.store_info;
      let province = storeInfo.province_name ? storeInfo.province_name : '';
      let city = storeInfo.city_name ? storeInfo.city_name : '';
      let area = storeInfo.area_name ? storeInfo.area_name : '';
      let addressDetail = storeInfo.address_detail ? storeInfo.address_detail : '';

      storeInfo.address = storeInfoAddress ? storeInfoAddress : (province + city + area + addressDetail);

      this.setData({
        storeInfo: storeInfo,
        shopOwerInfo: res.data.shop_owner_info,
        clerkList: res.data.store_clerk_list,
        clerkInfo: res.data.clerk_info
      });
    })
  },
  openLocation() {
    let _this = this;
    let latitude = +this.data.storeInfo.lat;
    let longitude = +this.data.storeInfo.lon;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    //   success(res) {
    //     decodeAddress(res.longitude, res.latitude).then((data) => {
    //       let address = res.address;

    //       wx.setStorageSync('storeInfoAddress', address);
    //       // _this.setData({
    //       //   'storeInfo.address': address
    //       // })
    //     });
    //   },
    //   fail(e) {
    //     wx.showToast({
    //       title: '选择地址失败，请重新选择地址',
    //       icon: 'none'
    //     });
    //     // if (e.errMsg.indexOf('deny') > -1) {
    //     //   _this.setData({
    //     //     needSetting: true
    //     //   })
    //     // }
    //   }
    })
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo && !userInfo.token) {
      toUrl('/pages/module-a/login/login')
    } else {
      this.setData({
        token: userInfo.token,
      })
    }
    this.setPageTitle();
    this.setThemeInfo();
  },
  onShow() {
		this.getStoreInfo();
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

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
