const amapFile = require('../lib/qqmap-wx-jssdk.min');
const amap = new amapFile({
  key: 'MO4BZ-PUCCQ-OQF5C-GGXOV-MAQ4T-XZBHH'
});
const {
  getHospitalList,
  getClerkStoreList
} = require('../api/api');

const decodeAddress = (longitude, latitude) => {
  return new Promise((resolve) => {
    amap.reverseGeocoder({
      location: {
        latitude,
        longitude
      },
      success(data) {
        resolve(data);
      }
    });
  })
};

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

const getAddress = () => {
  return new Promise((resolve) => {
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        decodeAddress(res.longitude, res.latitude).then((data) => {
          console.log(data);
          resolve(data);
        });
      },
      fail(res) {
        console.log(123)
      }
    });
  });
};

const uploadImage = () => {
  return new Promise((resolve) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success(res) {
        wx.uploadFile({
          name: 'file',
          url: 'https://jbzy.yuege8888.cn/openapi/common/upload',
          filePath: res.tempFilePaths[0],
          success(data) {
            resolve(data);
          }
        })
      }
    })
  });
};

// 跳转到指定地址
const toUrl = function (url) {
  wx.navigateTo({
    url: url,
    success: function (res) {
      return;
    },
    fail: function () {
      return '跳转失败！';
    },
    complete: function () {
      return;
    }
  })

}

// 阿拉伯数字转换成中文
const numToCn = function (num) {
  let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  let chnUnitChar = ["", "十", "百", "千"];
  let strIns = '',chnStr = '';
  let unitPos = 0;
  let zero = true;
  let originNum = num;
  while (num > 0) {
    let v = num % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    num = Math.floor(num / 10);
  }
  if (originNum > 9 && originNum < 20) {
    chnStr = chnStr.substr(1);
  }
  return chnStr;
}

const failLocation = () => {
  // 定位权限
  wx.getSetting({
    success(getSres) {
      if (!getSres.authSetting['scope.userLocation']) {
        wx.showModal({
          title: '提示',
          content: '"沛生医药"需要获取您的定位授权',
          confirmText: '设置',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(openSRes) {
                  console.log(openSRes)
                  if (openSRes.authSetting['scope.userLocation']) {
                    toUrl('/pages/module-b/index/index')
                  }
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '获取定位失败，请前往设置中心打开GPS定位',
          showCancel: false
        })
      }
    }
  })

}

const resetStoreList = () => {
  return new Promise(resolve => {
    getClerkStoreList().then(res => {
      let list = res.data;
      if (list instanceof Object && Object.keys(list).length < 1) {
        resolve(list);
        return;
      }
      const addressList = list.map(item => {
        return {
          latitude: item.lat,
          longitude: item.lon
        }
      });
      getDistance(addressList).then(data => {
        if (data.status !== 0) {
          resolve(list);
          return;
        }
        list = list.map((item, index) => {
          let i = {};
          const distance = data.result.elements[index].distance;
          i.distance = distance;
          switch (true) {
            case distance <= 500:
              i.distanceText = '<=500 m';
              break;
            case distance < 1000:
              i.distanceText = '>500 m';
              break;
            default:
              const km = Math.floor(distance / 1000);
              if (distance % 1000 < 500) {
                i.distanceText = `${km} km`;
              } else {
                i.distanceText = `${km}.5 km`
              }
          }
          return {
            ...i,
            ...item
          }
        })
        list.sort((a, b) => {
          return a.distance > b.distance
        })
        resolve(list);
      })
    })
  })
}

const openAddress = (opts) => {
  wx.openLocation({
    ...opts
  })
}

const getDistance = (list) => {
  return new Promise((resolve) => {
    amap.calculateDistance({
      mode: 'straight',
      to: list,
      success(res) {
        resolve(res);
      },
      fail(res) {
        resolve(res)
      }
    })
  })
}

const refreshHospitalList = (searchStr) => {
  return new Promise(resolve => {
    getHospitalList(searchStr).then(res => {
      let list = res.data.list;
      const addressList = list.map(item => {
        return {
          latitude: item.lat,
          longitude: item.lon
        }
      });
      getDistance(addressList).then(data => {
        if (data.status !== 0) {
          resolve(list);
          return;
        }
        list = list.map((item, index) => {
          let i = {};
          const distance = data.result.elements[index].distance;
          i.distance = distance;
          switch (true) {
            case distance <= 500:
              i.distanceText = '<=500m';
              break;
            case distance < 1000:
              i.distanceText = '>500m';
              break;
            default:
              const km = Math.floor(distance / 1000);
              if (distance % 1000 < 500) {
                i.distanceText = `${km}km`;
              } else {
                i.distanceText = `${km}.5km`
              }
          }
          return {
            ...i,
            ...item
          }
        })
        list.sort((a, b) => a.distance - b.distance)
        resolve(list);
      })
    })
  })
}

module.exports = {
  toUrl,
  numToCn,
  formatTime,
  getAddress,
  uploadImage,
  openAddress,
  decodeAddress,
  refreshHospitalList,
  resetStoreList,
  failLocation
};
