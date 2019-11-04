const { refreshHospitalList, getAddress } = require('../../../utils/util');
const { getNoticeList, scanCode } = require('../../../api/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasNotice: false,
    hospitalList: [],
    selected: {},
		address: ''
  },

  scan () {
  	this.refreshHospital().then(() => {
			const info = wx.getStorageSync('cHospitalMsg');
			if (info.distance > 500) {
				wx.navigateTo({
					url: '/pages/module-c/scan-out/scan-out'
				});
				return;
			}
			wx.navigateTo({
				url: '/pages/module-c/scan-result/scan-result'
			})
		})
  },

  onLoad () {
  },

	refreshHospital () {
		return refreshHospitalList().then(list => {
			const selected = wx.getStorageSync('cHospitalMsg');
			const finded = list.find(item => item.id === selected.id);
			if (selected && finded) {
				this.setData({
					selected: finded
				});
				wx.setStorageSync('cHospitalMsg', finded)
			} else {
				this.setData({
					selected: list[0]
				})
				wx.setStorageSync('cHospitalMsg', list[0]);
			}
			this.setData({
				hospitalList: list
			});
		});
	},

	onShow () {
		this.refreshHospital();
		getAddress()
		const selected = wx.getStorageSync('cHospitalMsg');
		this.setData({
			selected
		})
		getNoticeList().then(res => {
			const list = res.data.list;
			this.setData({
				hasNotice: Boolean(list.find(item => item.finish === 0))
			});
		})
	},

})
