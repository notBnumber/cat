/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
 <view>你自己需要展示的内容</view>
 </modal>

 属性说明：
 show： 控制modal显示与隐藏
 height：modal的高度
 bindcancel：点击取消按钮的回调函数
 bindconfirm：点击确定按钮的回调函数

 */

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        const duration = this.data.duration;
        if (newVal && duration) {
          setTimeout(() => {
            this.setData({
              show: false
            });
          }, duration);
        }
      }
    },
    //modal的高度
    height: {
      type: String,
      value: '292rpx'
    },
		width: {
			type: String,
			value: '558rpx'
		},
    duration: {
      type: Number,
      value: 0
    },
    closeByClickModal: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      if (this.data.closeByClickModal) {
        this.setData({show: false})
      }
    },

    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    confirm() {
      this.setData({ show: false })
      this.triggerEvent('confirm')
    },
    
    stop () {
    
    }
  }
})
