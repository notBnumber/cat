const {
  scanToPlaceOrder
} = require('../../../api/api');

const {
  numToCn,
  formatTime,
  decodeAddress,
  failLocation
} = require('../../../utils/util')

// 获取应用实例
Page({
  data: {
    _title: '扫描结果',
    position: 1,
    showNoRes: true,
    showContain: false,
    scanResult: {},
    couponList: [],
    scanInfo: {},
    showPop: true,
    amount: 0,
  },
  setPageTitle() {
    wx.setNavigationBarTitle({
      title: this.data._title,
    })
  },
  setThemeInfo() {
    let clerkStore = wx.getStorageSync('clerkStore');
    let userInfo = wx.getStorageSync('userInfo');
    let token = userInfo.token;
    this.setData({
      clerkStore: clerkStore,
      position: clerkStore.position,
      token: token
    });
  },
  closePop() {
    this.setData({
      showPop: false
    })
  },
  getAmount() {
    let amount = 0;
    let productList = this.data.productList;
    if (productList) {
      // if (productList.length > 1) {
        productList.forEach(item => {
          amount += (item.scan_status === 1) ? item.sale : 0;
        })
      // }
      // else if (productList.length === 1) {
      //   amount = productList[0].amount;
      // }

      console.log(amount, 123)
    }

    this.setData({
      amount
    })
  },
  scanCode() {
    let that = this;
    that.setData({
      productList: wx.getStorageSync('productList') ? wx.getStorageSync('productList') : [],
      couponList: wx.getStorageSync('couponList') ? wx.getStorageSync('couponList') : []
    })
    wx.scanCode({
      success(scanRes) {
        console.log('扫码结果', scanRes);
        let serial = scanRes.result.split('，')[0];
        if (!serial) {
          wx.showToast({
            icon: 'none',
            title: '无相关数据，请重新扫码'
          })
          return;
        }

        wx.getLocation({
          fail(e) {
            console.log(e)
            failLocation();
          },
          success(res) {
            console.log(res)
            decodeAddress(res.longitude, res.latitude).then((data) => {
              that.setData({
                time: formatTime(new Date),
                address: data.result.address,
                serial: serial
              })
              let currProduct = that.data.productList.find(item => item.serial === serial);
              if (that.data.productList && currProduct) {
                that.setData({
                  showContain: true,
                  showNoRes: false,
                  currProduct: currProduct
                });
                return;
              }
              that.scanToPlaceOrder();
            });
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: '扫描失败！',
          icon: 'none'
        })
      }
    });
  },
  scanToPlaceOrder() {
    let token = this.data.token;
    let store_id = this.data.clerkStore.id;
    let goods_serial = this.data.serial;
    let address = this.data.address;
    scanToPlaceOrder({
      token,
      goods_serial,
      address,
      store_id,
      scan_id: this.data.id
    }).then(res => {
      console.log(res)
      if (+res.code === 0) {
        let currProduct = {
          serial: goods_serial,
          goods_name: res.data.goods_name,
          amount: res.data.total,
          sale: res.data.sale_num,
          img_url: res.data.img_url,
          scan_status: res.data.scan_status
        }
        let productList = [...this.data.productList, currProduct];

        let list = res.data.coupon_list;
        list.forEach(item => {
          item.end_time = item.end_time.substr(0, 10);
        })
        // let couponList = [...this.data.couponList, ...list];
        let couponList = this.data.couponList.concat(list) ? this.data.couponList.concat(list) : [];
        if (couponList.length > 0) {
          couponList.forEach((item, key) => {
            couponList[key].start_time = item.start_time.split(' ')[0];
            couponList[key].end_time = item.end_time.split(' ')[0];
            couponList[key].x = !isNaN(item.x) ? numToCn(item.x) : item.x;
            couponList[key].y = !isNaN(item.y) ? numToCn(item.y) : item.y;
          });
        }
        couponList = this.uniqueSum(couponList);
        this.setData({
          productList: productList,
          currProduct: currProduct,
          couponList: couponList,
          showContain: true,
          showNoRes: false,
        })
        wx.setStorageSync('productList', productList);
        wx.setStorageSync('couponList', couponList);
        this.getAmount();
      } else {
        this.setData({
          showNoRes: true
        })
      }
    })
  },
  // 去重并合并优惠券总数
  uniqueSum(arr) {
    let resArr = [];
    for (let i = 0; i < arr.length; i++) {
      let flag = true;
      for (let j = 0; j < resArr.length; j++) {
        if (arr[i].x == resArr[j].x && arr[i].y == resArr[j].y) {
          resArr[j].matchNum = arr[i].matchNum + resArr[j].matchNum;
          flag = false;
        };
      };
      if (flag) {
        resArr.push(arr[i]);
      };
    };
    return resArr;
  },
  onLoad() {
    this.setData({
      id: `${100000000 + Math.floor(Math.random() * 100000000)}${Date.now()}`
    })
    this.setPageTitle();
    this.setThemeInfo();
    wx.removeStorageSync('productList');
    wx.removeStorageSync('couponList')

    this.getAmount();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.scanCode();
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
