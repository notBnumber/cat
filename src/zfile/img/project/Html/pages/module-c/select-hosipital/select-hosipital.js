const { openAddress } = require('../../../utils/util');
const { refreshHospitalList } = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isSearch: false,
    backupList: [],
    searchStr: '',
  },

  onLoad: function () {
    this.getList();
  },

  getList(searchStr=null){
    refreshHospitalList(searchStr).then(list => {
      // console.log('list:', list)
      this.setData({
        list: list.slice(0, 5)
      });
    });
  },

  doSearch(e){
    this.setData({
      isSearch: true,
      backupList: this.data.list,
      list: [],
    });
    wx.setNavigationBarTitle({
      title: '搜索医院',
    })
  },
  cancelSearch(e){
    this.setData({
      isSearch: false,
      list: this.data.backupList,
      backupList: [],
      searchStr: '',
    });
    wx.setNavigationBarTitle({
      title: '选择医院',
    })
  },
  onInput(e){
    console.log('value:', e.detail.value)
    if (e.detail.value != this.data.searchStr){
      this.getList(e.detail.value);
    }
    this.setData({
      searchStr: e.detail.value,
    })
  },

  select (e) {
		const item = this.data.list[e.currentTarget.dataset.index];
		wx.setStorageSync('cHospitalMsg', item);
		wx.navigateBack();
  },

  showMap (e) {
    const item = this.data.list[e.currentTarget.dataset.index];
    openAddress({
      latitude: +item.lat,
      longitude: +item.lon,
      name: item.store_name,
      address: item.address_detail
    });
  }
})
