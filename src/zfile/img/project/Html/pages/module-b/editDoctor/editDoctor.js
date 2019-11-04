const {
  editClerk,
  removeClerk
} = require('../../../api/api');

const {
  toUrl
} = require('../../../utils/util')

// 获取应用实例
Page({
  data: {
    _title: '',
    showValidateModal: false,
    ValidateModalText: '',
    position: 1,
    info: {}
  },
  formSubmit: function (event) {
    let token = this.data.token;
    let clerkStore = wx.getStorageSync('clerkStore');
    let store_id = clerkStore.id;
    let clerk_id = this.data.id;

    let formData = event.detail.value;
    let errMsg = this.validateFormData(formData);
    if (errMsg) {
      this.setData({
        showValidateModal: true,
        ValidateModalText: errMsg
      });
    } else {
      let that = this;
      wx.showModal({
        title: clerk_id ? '确定保存修改？' : '确定添加数据？',
        content: '',
        confirmColor: "#000",
        success(res) {
          if (res.confirm) {
            formData.token = token;
            formData.store_id = store_id;
            if (clerk_id) {
              formData.clerk_id = clerk_id;
            }

            editClerk(formData).then(submitRes => {
              if (+submitRes.code === 0) {
                that.setData({
                  showValidateModal: true,
                  ValidateModalText: '提交成功！'
                });
                wx.navigateBack()
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  removeClerk: function (event) {
    let _this = this;
    wx.showModal({
      title: '确定删除？',
      content: '',
      confirmColor: "#000",
      success(res) {
        if (res.confirm) {
          let clerk_id = _this.data.id;
          let token = _this.data.token;
          removeClerk({
            token,
            clerk_id
          });
          wx.navigateBack()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  validateFormData(formData) {
    if (!formData.name || !formData.phone || !formData.job) {
      return '请填写完整信息';
    } else if (!(/^[1]([3-9])[0-9]{9}$/.test(formData.phone))) {
      return '请填写正确的手机号'
    } else {
      return '';
    }
  },
  setPageTitle(title) {
    wx.setNavigationBarTitle({
      title: title,
    })
  },
  setThemeInfo() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let position = clerkStore.position;
    this.setData({
      position: position
    });
  },
  onLoad: function (options) {
    let id = parseInt(options.id);
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo && !userInfo.token) {
      toUrl('/pages/module-a/login/login')
    } else {
      this.setData({
        id: id,
        token: userInfo.token
      })
    }

    if (id) {
      this.setData({
        info: wx.getStorageSync('clerkList').find(item => item.id ===id)
      })
    }

    let title = id ? '编辑' : '新增';
    this.setPageTitle(title);
    this.setThemeInfo();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
