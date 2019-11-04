const {
  toUrl,
  resetStoreList
} = require('../../../utils/util');
const {
  getAdList,
  getStoreRank,
  getStandardSort
} = require('../../../api/api');

// 获取应用实例
Page({
  data: {
    //控制progress
    showPage: false,
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器
    clerkStore: {},
    adList: [],
    token: '',
    showModal: false,
    modalText: '',
    storeNum: 0,
    theme: {
      imgList: {
        icoUrl: {
          sweep: '/imgs/module-b/sweep_ico.png',
          coupon: '/imgs/module-b/coupon_ico.png',
          order: '/imgs/module-b/order_ico.png',
          service: '/imgs/module-b/phone_ico.png',
          settings: '/imgs/module-b/settings_ico.png',
          statistics: '/imgs/module-b/data_ico.png'
        },
        bgUrl: {
          project: '/imgs/module-b/index_purple_bg.png',
          spe: '/imgs/module-b/index_purple_bg_spe.png',
        }
      }
    },
    rankInfo: {},
    position: 1,

  },
  touchToUrl(e) {
    let token = this.data.token;
    let url = '';
    if (!token) {
      url = '/pages/module-a/login/login';
    } else {
      url = e.currentTarget.dataset.url;
    }

    toUrl(url);
  },
  /**
   * 开始progress
   */
  startProgress() {
    this.drawCircle(12 / (30 / 2))
  },
  getAdList() {
    getAdList().then(res => {
      const adList = res.data.adList || [];
      adList.forEach(item => {
        item.redirect_url = encodeURIComponent(item.redirect_url);
      })
      this.setData({
        adList
      });
    })
  },
  setThemeInfo() {
    let token = this.data.token;
    if (token) {
      this.initStoreInfo().then(res => {
        // 设置data数据
        let clerkStore = this.data.clerkStore;
        let position = clerkStore.position;
        let circleColor = 'theme.circleColor';
        let indicatorColor = 'theme.indicatorColor';
        let bgUrl = 'theme.imgList.bgUrl'

        this.setData({
          [circleColor]: position === 2 ? '#f16c00' : '#652e81',
          [indicatorColor]: {
            origin: position === 2 ? '#ffb147' : '#906ba1',
            active: position === 2 ? '#f16c00' : '#652e81'
          },
          [bgUrl]: {
            project: position === 2 ? '/imgs/module-b/index_orange_bg.png' : '/imgs/module-b/index_purple_bg.png',
            spe: '/imgs/module-b/index_purple_bg_spe.png',
          }
        });
        this.getStoreRank();
        this.setData({
          showPage: res
        })
      })
    } else {
      toUrl('/pages/module-a/login/login');
    }
  },
  initStoreInfo() {
    return resetStoreList().then(list => {
      if (list instanceof Object && Object.keys(list).length < 1) {
        wx.showModal({
          title: '提示',
          content: '该账号下无医院数据',
          showCancel: false,
          success(res) {
            toUrl('/pages/module-a/login/login');
          }
        })
        return false;
      }
      let clerkStores = list;
      let clerkStore = wx.getStorageSync('clerkStore');

      // 判断是否缓存医院信息，设置选中的医院信息
      if (!clerkStore && !clerkStore.id) {
        wx.setStorageSync('clerkStore', clerkStores[0])
        clerkStore = clerkStores[0];
      }
      const id = clerkStore.id;
      const store = clerkStores.find(item => item.id === id);
      if (store) {
        clerkStore = store;
        wx.setStorageSync('clerkStore', store);
      } else {
        wx.setStorageSync('clerkStore', clerkStores[0])
        clerkStore = clerkStores[0];
      }

      this.setData({
        clerkStore: clerkStore,
        storeNum: clerkStores.length,
        position: clerkStore.position,
      });
      return true;
    })
  },
  sweep() {
    this.initStoreInfo().then(res => {
      if (this.data.clerkStore.distance > 500) {
        wx.navigateTo({
          url: '/pages/module-c/scan-out/scan-out'
        });
        return;
      }
      toUrl('/pages/module-b/sweep/sweep');
    });

  },
  getStoreRank() {
    let store_id = this.data.clerkStore.id;
    let token = this.data.token;

    // 获取医院排名
    getStoreRank({
      token,
      store_id
    }).then(rankRes => {
      if (+rankRes.code === 0) {
        let rankInfo = rankRes.data;
        let top, mid, bom = '名';
        let cnSort, prSort, ciSort;

        getStandardSort(token).then(standardRes => {

          // 设置排名显示标准
          if (+standardRes.code === 0) {
            cnSort = standardRes.data.a_sort;
            prSort = standardRes.data.b_sort;
            ciSort = standardRes.data.c_sort;
          } else {
            cnSort = 100;
            prSort = 50;
            ciSort = 20;
          }
          // 根据排名情况进行显示
          if (rankInfo.cn_rank <= cnSort) {
            top = '全国第';
            mid = rankInfo.cn_rank;
          } else if (rankInfo.pr_rank <= prSort) {
            top = rankInfo.province_name + '第';
            mid = rankInfo.pr_rank;
          } else if (rankInfo.ci_rank <= ciSort) {
            top = rankInfo.city_name;
            mid = rankInfo.ci_rank;
          } else {
            top = '超过' + rankInfo.city_name;
            mid = parseInt(rankInfo.ci_percent, 10) + '%';
            bom = '的医院';
          }

          rankInfo.circleText = bom === '名' ? {
            top: '',
            mid: top + mid + bom,
            bom: ''
          } : {
            top: top,
            mid: mid,
            bom: bom,
          }
          this.setData({
            rankInfo: rankInfo
          });
        });
      }

      // 获取广告列表
      this.getAdList();
      //绘制背景
      this.drawProgressbg();
      //开始progress
      this.startProgress();
    });
  },
  onShow() {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo && !userInfo.token) {
      toUrl('/pages/module-a/login/login')
    } else {
      this.setData({
        token: userInfo.token
      })
    }
    this.setThemeInfo();
  },
  // 画progress进度
  drawCircle(step) {
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('canvasProgress');
    // 设置圆环的宽度
    context.setLineWidth(2);
    // 设置圆环的颜色
    context.setStrokeStyle(this.data.theme.circleColor);
    // 设置圆环端点的形状
    context.setLineCap('round')
    //开始一个新的路径
    context.beginPath();
    //参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(42, 42, 40, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    //对当前路径进行描边
    context.stroke();
    //开始绘制
    context.draw()
  },
  // 画progress底部背景
  drawProgressbg() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    // 设置圆环的宽度
    ctx.setLineWidth(2);
    // 设置圆环的颜色
    ctx.setStrokeStyle("#eceff2");
    // 设置圆环端点的形状
    ctx.setLineCap('round')
    //开始一个新的路径
    ctx.beginPath();
    //设置一个原点(40,40)，半径为130的圆的路径到当前路径
    ctx.arc(42, 42, 40, 0, 2 * Math.PI, false);
    //对当前路径进行描边
    ctx.stroke();
    //开始绘制
    ctx.draw();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
