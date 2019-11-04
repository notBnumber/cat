const { cEditDoctor, cDelDoctor } = require('../../../api/api')
// 获取应用实例
Page({
	data: {
		isEdit: false,
		showValidateModal: false,
		ValidateModalText: '',
		info: {}
	},
	formSubmit: function (event) {
		let formData = event.detail.value;
		let errMsg = this.validateFormData(formData);
		if (errMsg) {
			this.setData({
				showValidateModal: true,
				ValidateModalText: errMsg
			});
		} else {
			formData.position = formData.position || 2;
			formData.store_id = wx.getStorageSync('hospitalInfo').store_info.id;
			if (this.data.isEdit) {
				formData.clerk_id = this.data.info.id;
				wx.showModal({
					title: '确定保存修改？',
					content: '',
					confirmColor: "#000",
					success(res) {
						if (res.confirm) {
							cEditDoctor(formData).then(res => {
								if (+res.code === 0) {
									wx.navigateBack();
									wx.showToast({
										title: '已修改',
										icon: 'none'
									})
								}
							})
						}
					}
				})
				return
			}
			cEditDoctor(formData).then(res => {
				if (+res.code === 0) {
					wx.navigateBack();
					wx.showToast({
						title: '新增成功',
						icon: 'none'
					})
				}
			})
		}
	},
	formDelete: function (event) {
		wx.showModal({
			title: '确定删除？',
			content: '',
			confirmColor: "#000",
			success: (res) => {
				if (res.confirm) {
					cDelDoctor(this.data.info.id).then(data => {
						if (+data.code === 0) {
							wx.navigateBack();
							wx.showToast({
								title: '已删除',
								icon: 'none'
							})
						}
					})
				}
			}
		})
	},
	validateFormData (formData) {
		if (!formData.name) {
			return '请填写姓名';
		} else if (!(/^[1]([3-9])[0-9]{9}$/.test(formData.phone))) {
			return '请填写正确的手机号'
		} else if (!formData.position && +this.data.info.position !== 2) {
			return '请选择职位'
		}
	},
	onLoad: function(options) {
		const index = options.index;
		const isEdit  = !(typeof index === 'undefined');
		if (isEdit) {
			this.setData({
				info: wx.getStorageSync('hospitalInfo').store_clerk_list[index]
			})
			console.log(this.data.info)
		}
		this.setData({
			isEdit
		})
		wx.setNavigationBarTitle({
			title: isEdit ? '编辑' : '新增'
		})
	},
})
