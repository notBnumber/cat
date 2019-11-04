const { scanCode } = require('../../../api/api');
const { getAddress } = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: true,
    productList: [],
    couponList: [],
    amount: 0,
    address: '',
    time: '',
    currProduct: {},
		noResult: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		const productList = [];
		this.setData({
			productList,
			couponList: [],
			currProduct: {},
      id: `${100000000 + Math.floor(Math.random() * 100000000)}${Date.now()}`
		})
  },

	onReady () {
  	this.scan();
	},

  onShow () {
    getAddress().then((res) => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const time = `${now.getFullYear()}年${month >= 10 ? month : '0' + month}月${date >= 10 ? date : '0' + date}日 ${hour >= 10 ? hour : '0' + hour}:${minute >= 10 ? minute : '0' + minute}`;
      const address = res.result.address;
      this.setData({
        time,
        address
      })
    })
  },

  getAmount () {
    let amount = 0;
    this.data.productList.forEach(item => {
      amount += item.status === 1 ? item.sale : 0
    })

    this.setData({
      amount
    })
  },

  scan () {
    wx.scanCode({
      success: (res) => {
      	console.log('扫码结果：', res);
        const num = res.result.split('，')[0];
        if (!num) {
          wx.showToast({
            icon: 'none',
            title: '无相关数据，请重新扫码'
          })
					this.setData({
						noResult: true
					})
          return;
        }
				const currProduct = this.data.productList.find(item => item.num === num);
				if (currProduct) {
					this.setData({
            currProduct
          })
					return;
				}
        scanCode({
          goods_serial: num,
          store_id: wx.getStorageSync('cHospitalMsg').id,
          address: this.data.address,
          scan_id: this.data.id
        }).then((data) => {
          console.log(data)
          if (+data.code === 0) {
            const list = data.data.coupon_list;
            list.forEach(item => {
              item.end_time = item.end_time.substr(0, 10);
            })
            const couponList = [...this.data.couponList, ...list];
            const productList = [...this.data.productList, {
              num,
              name: data.data.goods_name,
              sale: data.data.sale_num,
							amount: data.data.total,
              imgUrl: data.data.img_url,
              status: data.data.scan_status
            }];
            this.setData({
              productList,
              couponList,
              currProduct: productList[productList.length - 1]
            });
            wx.setStorageSync('couponList', couponList);
            wx.setStorageSync('productList', productList);
            this.getAmount();
          }
        })
      },
			fail () {
      	wx.navigateBack();
			}
    })
  },

  closeModal () {
    this.setData({
      showModal: false
    })
  }
})
