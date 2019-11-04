const { uploadImage, decodeAddress } = require('../../../utils/util');
const { getTsList, editHospital, delHospital } = require('../../../api/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    needSetting: false,
    showModal: false,
    info: {},
    isEdit: false,
    tsList: [],
    imgList: [],
    address: {},
    addressDetail: '',
    longitude: 0,
    latitude: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initTsList();
    let imgList = [];
    if (options.edit) {
      const info = wx.getStorageSync('hospitalInfo')
      this.setData({
        info,
        addressDetail: info.store_info.address_detail,
        longitude: info.store_info.lon,
        latitude: info.store_info.lat,
        address: {
          province: info.store_info.province,
          city: info.store_info.city,
          area: info.store_info.area
        }
      })
      imgList = info.store_info.store_imgs;
    }
    for (let i = 0; i < 3; i++) {
      if (!imgList[i]) {
        imgList[i] = {
          id: '',
          url: ''
        }
      }
    }
    this.setData({
      isEdit: !!options.edit,
      imgList
    })
    wx.setNavigationBarTitle({
      title: options.edit ? '编辑医院' : '新增医院'
    })
  },

  initTsList () {
    getTsList().then(res => {
      let list = res.data.list;
      if (this.data.isEdit) {
        const selected = this.data.info.store_info.ts.split('_');
        list = list.map(item => {
          return {
            ...item,
            checked: !!selected.includes('' + item.id)
          }
        })
      }
      this.setData({
        tsList: list
      });
    })
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

  submit (e) {
    console.log(e)
    const ids = this.getImgIds();
    const data = e.detail.value;
    if (!this.testBlank(data.name)) {
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
    } else if (!data.ts.length) {
      this.setData({
        showModal: true,
        modalText: '请选择医院特色'
      })
      return
    } else if (!ids.length) {
      this.setData({
        showModal: true,
        modalText: '请上传图片'
      })
      return
    } else if (!this.testBlank(data.clerk_name)) {
      this.setData({
        showModal: true,
        modalText: '请填写店长姓名'
      })
      return
    } else if (!this.validTel(data.clerk_phone)) {
      this.setData({
        showModal: true,
        modalText: '请填写正确的店长手机号码'
      })
      return
    }

    data.ts = data.ts.join('_');

    const isEdit = this.data.isEdit;

    const obj = {
      ...data,
      ...this.data.address,
      lon: this.data.longitude,
      lat: this.data.latitude,
      store_imgs: ids.join(',')
    };

    if (isEdit) {
      obj.store_id = this.data.info.store_info.id,
      obj.clerk_id = this.data.info.super_clerk_info.id

      wx.showModal({
        title: '确定保存修改？',
        content: '',
        confirmColor: "#000",
        success(result) {
          if (result.confirm) {
            editHospital(obj).then((res) => {
              if (+res.code === 0) {
                wx.navigateBack();
                wx.showToast({
                  title: '已修改',
                  icon: 'none'
                });
              }
            })
          }
        }
      })
      return;
    }

    editHospital(obj).then((res) => {
      if (+res.code === 0) {
        wx.navigateBack();
        wx.showToast({
          title: '新增成功',
          icon: 'none'
        });
      }
    })
  },

  uploadImage (e) {
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

  checkChange (e) {
    console.log(e)
  },

  openMap () {
    const that = this;
    wx.chooseLocation({
			fail () {
				wx.showToast({
					title: '取消选择地址',
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
            addressDetail: res.address,
            longitude: res.longitude,
            latitude: res.latitude,
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
  },

  del () {
    wx.showModal({
      title: '确定删除？',
      content: '',
      confirmColor: "#000",
      success: (result) => {
        if (result.confirm) {
          delHospital(this.data.info.store_info.id).then(res => {
            if (+res.code === 0) {
							wx.navigateBack({
								delta: 2
							});
              wx.showToast({
                title: '已删除',
                icon: 'none'
              });
            }
          })
        }
      }
    })
  }
})
