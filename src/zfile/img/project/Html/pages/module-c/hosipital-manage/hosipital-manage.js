const { openAddress } = require('../../../utils/util');
const { getHospitalList } = require('../../../api/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: 1,
    longitude: 0,
    latitude: 0,
		markers: [],
    list: [],
    detail: null,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options
    })
  },

  onShow() {
    this.getList().then(res => {
      this.initMap();
    });
  },

  getList () {
    return getHospitalList().then(res => {
      const list = res.data.list || [];
      this.setData({
        list,
        markers: list.map((item, index) => {
          return {
            iconPath: '../../../imgs/module-c/map-icon.png',
            id: index,
            latitude: +item.lat,
            longitude: +item.lon,
            width: 21,
            height: 26
          }
        })
      });
    })
  },

  initMap () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },

  changeType (e) {
    this.setData({
      showType: e.currentTarget.dataset.index
    })
  },

  showMap (e) {
    const item = this.data.list[+e.currentTarget.dataset.index];
    openAddress({
      latitude: +item.lat,
      longitude: +item.lon,
      name: item.store_name,
      address: item.address_detail
    })
  },

  updateDetail (e) {
    const index = e.markerId;
    this.setData({
      detail: this.data.list[index]
    })
  }
})
