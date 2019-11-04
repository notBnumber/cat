const { getNoticeList, settleOrder } = require('../../../api/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.initList();
  },

  initList () {
		getNoticeList().then(res => {
			const list = res.data.list;
			this.setData({
				list
			});
		})
  },

  handle (e) {
    const index = e.currentTarget.dataset.index;
    settleOrder(this.data.list[index].id).then(res => {
      this.initList();
    })
  }
})
