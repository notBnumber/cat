const {
  uploadImage, toUrl
} = require('../../../utils/util')

const {
  applyOffLine
} = require('../../../api/api')


// 获取应用实例
Page({
  data: {
    _title: '申请解绑代理',
    imgList: [{}, {}, {}],
    showModal: false,
    store_id: ''
  },
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: this.data._title,
    })
  },
  uploadImage (e) {
    const index = +e.currentTarget.dataset.index;
    uploadImage().then(res => {
      const data = JSON.parse(res.data);
      this.setData({
        [`imgList[${index}]`]: data.data
      });
    });
  },
  delImg (e) {
    const index = +e.target.dataset.index;
    this.setData({
      [`imgList[${index}]`]: {}
    });
  },
  getImgIds () {
    const ids = [];
    this.data.imgList.forEach((item) => {
      if (item.img_id) {
        ids.push(item.img_id);
      }
    })
    return ids;
  },
  formSubmit(e) {
    let imgIds = this.getImgIds();
    let token = this.data.token;
    let store_id = this.data.store_id;
    let desc = e.detail.value.desc;

    if (!desc) {
      this.setData({
        showModal: true,
        modalText: '请输入解绑原因'
      })
    } else if(imgIds.length <= 0) {
      this.setData({
        showModal: true,
        modalText: '请上传图片'
      })
    } else {
      imgIds = imgIds.join(',')
      applyOffLine({
        token,
        store_id,
        desc,
        imgIds
      }).then(res => {
        if (+res.code === 0) {
          this.setData({
            showModal: true,
            modalText: '提交成功，请等待审核'
          })
          wx.removeStorageSync('clerkStore');
          toUrl('/pages/module-b/index/index');
        }
      })
    }

  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo');
    let token = userInfo.token;
    if (token) {
      let clerkStore = wx.getStorageSync('clerkStore');
      this.setData({
        token: token,
        store_id: clerkStore.id
      })
    } else {
      toUrl('/pages/module-a/login/login')
    }
    this.setPageTitle();
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