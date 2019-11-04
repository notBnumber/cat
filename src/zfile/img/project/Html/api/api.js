const http = require('./http.js');

module.exports = {
  // 登录
  login({
    phone,
    code,
    openid
  }) {
    return http.get('/clerk/login', {
      phone,
      code,
      openid
    });
  },

  getOpenId(code) {
    return http.get('/clerk/getOpenidByCode', {
      code
    });
  },

  signUp(opts) {
    return http.get('/store/register', {
      ...opts
    })
  },

  sendCode(tel) {
    return http.get('/common/sendSms', {
      phone: tel
    })
  },

  getConf() {
    return http.get('/common/getAppConfig')
  },

  /* MODULE-C */
  getHospitalList(searchStr=null) {
    let params={}
    if (searchStr) params.search = searchStr;
    return http.get('/agenter/getAgenterStoreList', params);
  },

  getNoticeList() {
    return http.get('/agenter/getNoticeList');
  },

  settleOrder(orderId) {
    return http.get('/agenter/FinishOrder', {
      order_id: orderId
    });
  },

  getHospitalInfo(id) {
    return http.get('/agenter/getStoreInfo', {
      store_id: id
    })
  },

  getTsList() {
    return http.get('/store/getTsList')
  },

  editHospital(data) {
    return http.get(data.store_id ? '/store/editStore' : '/store/createStore', {
      ...data
    })
  },

  delHospital(id) {
    return http.get('/store/deleteStore', {
      store_id: id
    })
  },

  cEditDoctor(data) {
    return http.get(data.clerk_id ? '/clerk/editClerk' : '/clerk/createClerk', {
      ...data
    })
  },

  cDelDoctor(id) {
    return http.get('/clerk/removeClerk', {
      clerk_id: id
    })
  },

  getMyInfo() {
    return http.get('/agenter/getAgenterInfo')
  },

  getGoodsList(id) {
    return http.get('/goods/getStoreGoodsList', {
      store_id: id
    })
  },

  getData(data) {
    return http.get('/agenter/getDataList', {
      ...data
    })
  },

  logOut() {
    return http.get('/clerk/unBindWxUser')
  },

  scanCode (data) {
    return http.get('/Goods/placeOrderWhenScanEnd2B', {
      ...data
    })
  },

  // 退出当前账号
  quit(token) {
    return http.get('clerk/unBindWxUser', {
      token
    })
  },
  /**
   * B 模块
   */
  getAdList() {
    return http.get('common/getAdList');
  },
  // 获取当前用户的医院列表
  getClerkStoreList(token) {
    return http.get('clerk/getClerkStoreList', {
      token: token
    })
  },

  // 获取客服电话
  getAppConfig(token){
    return http.get('common/getAppConfig', {
      token
    });
  },

  // 获取排名标准
  getStandardSort(token) {
    return http.get('common/getSort', {
      token
    });
  },

  // 获取医院排名
  getStoreRank({
    token,
    store_id
  }) {
    return http.get('store/getStoreRank', {
      token: token,
      store_id: store_id
    });
  },

  // 获取医院详情
  getStoreInfo({
    token,
    store_id
  }) {
    return http.get('/store/getStoreInfo', {
      token: token,
      store_id: store_id
    });
  },

  // 编辑/新增店员
  editClerk(formData) {
    let params = {
      token: formData.token,
      store_id: formData.store_id,
      name: formData.name,
      phone: formData.phone,
      position: formData.job,
      clerk_id: formData.clerk_id ? formData.clerk_id : 0
    }
    return http.get(formData.clerk_id ? 'clerk/editClerk' : 'clerk/createClerk', params)
  },

  // 删除店员
  removeClerk({
    token,
    clerk_id
  }) {
    return http.get('clerk/removeClerk', {
      token: token,
      clerk_id: clerk_id
    })
  },

  // 获取产品列表
  getProductList(token) {
    return http.get('product/getProductList', {
      token: token
    });
  },

  // 获取产品信息
  getProductInfo({
    token,
    product_id
  }) {
    return http.get('product/getProductInfo', {
      token: token,
      product_id: product_id
    });
  },
  // 获取商品列表（统计数据产品下拉）
  getStoreGoodsList({
    token,
    store_id
  }) {
    return http.get('goods/getStoreGoodsList', {
      token: token,
      store_id: store_id
    })
  },

  // 获取统计数据
  getDataList({
    token,
    store_id,
    goods_id,
    year,
    month_type,
    role_type
  }) {
    return http.get('agenter/getDataList', {
      token: token,
      store_id: store_id,
      goods_id: goods_id,
      year: year,
      month_type: month_type,
      role_type: role_type
    })
  },

  // 申请解绑
  applyOffLine({
    token,
    store_id,
    desc,
    imgIds
  }) {
    return http.get('clerk/applyOffLine', {
      token: token,
      store_id: store_id,
      no_use_desc: desc,
      no_use_imgs: imgIds
    })
  },

  // 优惠券列表
  getCouponList({
    token,
    store_id,
    status
  }) {
    return http.get('Goods/getCouponList', {
      token: token,
      store_id: store_id,
      status: status
    });
  },

  // 扫描产品进行下单
  scanToPlaceOrder({
    token,
    goods_serial,
    address,
    store_id,
    scan_id
  }) {
    return http.get('Goods/placeOrderWhenScanEnd2C', {
      token: token,
      goods_serial: goods_serial,
      address: address,
      store_id: store_id,
      scan_id
    });
  },

  // 下单
  placeOrder({
    store_id,
    product_id,
    number,
    token
  }) {
    let params = {
      token: token,
      product_id: product_id,
      store_id: store_id,
      number: number
    };
    return http.get('order/placeOrder', params);
  },
};
