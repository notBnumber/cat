const {
  toUrl, formatTime
} = require('../../../utils/util');

const {
  getCouponList
} = require('../../../api/api')

// 获取应用实例
Page({
  data: {
    _title: '优惠券',
    currentIndex: 0,
    position: 1,
    couponList: [],
    token: '',
    showPage: false
  },
  //swiper切换时会调用
  pagechange(e) {
    console.log(e.detail.source)
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex,
      })
      this.getCouponList();
    }
  },
  //用户点击tab时调用
  titleClick(e) {
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx
    });
    this.getCouponList();
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
      position: position,
      themeColor: position === 2 ? 'orange' : 'purple',
    })
  },
  getCouponList() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let token = this.data.token;
    let store_id = clerkStore.id;
    let status = +this.data.currentIndex;
    this.setData({
      showPage: false
    })

    getCouponList({
      token,
      store_id,
      status
    }).then(res => {
      console.log(res);
      let couponList = res.data;
      let filterTime = new Date(new Date().getTime() - 3*24*60*60*1000);
      filterTime = formatTime(filterTime).split(' ')[0];
      if (couponList.length > 0) {
        couponList = couponList.filter(item => item.end_time > filterTime);// 过滤掉已过期超过三天的优惠券
        couponList = couponList.splice(0, 99);// 优惠券数量过多时，截取数组前100
        couponList.forEach((item, key) => {
          couponList[key].start_time = item.start_time.split(' ')[0];
          couponList[key].end_time = item.end_time.split(' ')[0];
        });
        // 未使用过滤掉已过期
        if (status === 1) {
          couponList = couponList.filter(item => +item.dateValid === 0);
        }
      }

      if (status === 0 && couponList instanceof Array) {
				couponList = [
					...couponList.filter(item => item.status === '未使用' && item.dateValid !== 1),
					...couponList.filter(item => item.status === '已使用'),
					...couponList.filter(item => item.dateValid === 1 && item.status === '未使用')
				]
      }

      this.setData({
        couponList: couponList,
        showPage: true
      });

      this.setPageTitle();
      this.setThemeInfo();
    })
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
    this.getCouponList();
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
