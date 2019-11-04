const { uploadImage, decodeAddress } = require('../../../utils/util');
const { signUp } = require('../../../api/api');


// pages/module-a/sign-up/sign-up.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
		modalMsg: '',
    imgList: [{}, {}, {}],
    needSetting: false,
		address: {},
		longitude: '',
		latitude: '',
		addressDetail: ''
  },

	validTel (tel) {
		const res = /^[1]([3-9])[0-9]{9}$/.test(tel);
		if (!res) {
			this.setData({
				modalText: '请填写正确的手机号码',
				showModal: true
			});
			return false;
		}
		return res;
	},

	testBlank (text) {
  	return Boolean(text.replace(/\s/gm, ''));
	},

	getImgIds () {
  	const ids = [];
  	this.data.imgList.forEach((item) => {
  		if (item.id) {
  			ids.push(item.id);
			}
		})
		return ids;
	},

  submit (e) {
  	const ids = this.getImgIds();
		const data = e.detail.value;
		if (!this.testBlank(data.contact_name)) {
			this.setData({
				showModal: true,
				modalText: '请输入姓名'
			})
			return
		} else if (!this.validTel(data.contact_phone)) {
			return
		} else if (!this.testBlank(data.store_name)) {
			this.setData({
				showModal: true,
				modalText: '请输入医院名称'
			})
			return
		} else if (!this.testBlank(data.address_detail)) {
			this.setData({
				showModal: true,
				modalText: '请选择医院地址'
			})
			return
		} else if (!ids.length) {
			this.setData({
				showModal: true,
				modalText: '请上传图片'
			})
			return
		}

		signUp({
			...data,
			store_img_ids: ids.join(','),
			...this.data.address,
			lon: this.data.longitude,
			lat: this.data.latitude
		}).then(res => {
			if (+res.code === 0) {
				wx.showToast({
					title: '注册成功，请等候审核',
					icon: 'none'
				})
				wx.reLaunch({
					url: '/pages/module-a/login/login'
				})
			}
		})
  },

  upload (e) {
  	const index = +e.currentTarget.dataset.index;
    uploadImage().then(res => {
    	const data = JSON.parse(res.data);
			this.setData({
				[`imgList[${index}]`]: {
					url: data.data.img_url,
					id: data.data.img_id
				}
			});
    });
  },

	delImg (e) {
  	const index = +e.target.dataset.index;
  	this.setData({
			[`imgList[${index}]`]: {}
		});
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  openMap () {
    const that = this;
    wx.chooseLocation({
      fail (e) {
        wx.showToast({
          title: '选择地址失败，请重新选择地址',
          icon: 'none'
        });
        if (e.errMsg.indexOf('deny') > -1) {
					that.setData({
						needSetting: true
					})
				}
      },
			success (res) {
				decodeAddress(res.longitude, res.latitude).then((data) => {
					that.setData({
						longitude: res.longitude,
						latitude: res.latitude,
						addressDetail: res.address,
						address: {
							province: data.result.address_component.province,
							city: data.result.address_component.city,
							area: data.result.address_component.district
						}
					});
				})
			}
    });
  },

  openSetting () {
    const that = this;
    wx.openSetting({
      success (res) {
        if (res.authSetting['scope.userLocation']) {
          that.setData({
            needSetting: false
          })
        }
      }
    })
  }
})
