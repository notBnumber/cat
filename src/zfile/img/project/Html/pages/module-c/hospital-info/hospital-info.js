const { openAddress } = require('../../../utils/util');
const { getHospitalInfo } = require('../../../api/api');

// pages/module-c/hospital-info/hospital-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: {},
    doctorList: [],
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

  onShow () {
    const id = this.data.options.id;
    this.setData({
      id
    });
    this.initInfo(id);
  },

  initInfo (id) {
    getHospitalInfo(id).then(res => {
      res.data.store_info.ts_name = res.data.store_info.ts_name.replace(/_/g, ' ');
      this.setData({
        info: res.data.store_info,
        doctorList: res.data.store_clerk_list
      })
      wx.setStorageSync('hospitalInfo', res.data)
    })
  },

  openMap () {
    const info = this.data.info;
    openAddress({
      latitude: +info.lat,
      longitude: +info.lon,
      name: info.store_name,
      address: info.address_detail
    })
  }
})