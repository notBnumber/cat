import * as echarts from '../../../lib/ec-canvas/echarts';
const { getHospitalList, getGoodsList, getData } = require('../../../api/api');

let chart = null;

const option = {
	color: ['#37a2da', '#32c5e9', '#67e0e3'],
	// tooltip: {
	// 	trigger: 'axis',
	// 	axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	// 		type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	// 	},
	// 	confine: true
	// },
	grid: {
		left: 20,
		right: 20,
		bottom: 15,
		top: 40,
		containLabel: true
	},
	yAxis: [
		{
			type: 'value',
			axisLine: {
				lineStyle: {
					color: '#999'
				}
			},
			axisLabel: {
				color: '#666'
			}
		}
	],
	xAxis: [
		{
			type: 'category',
			axisTick: { show: false },
			data: [],
			axisLine: {
				lineStyle: {
					color: '#999'
				}
			},
			axisLabel: {
				color: '#666'
			}
		}
	],
	series: [
		{
			name: '销售量',
			type: 'bar',
			label: {
				normal: {
					show: true,
					position: 'inside'
				}
			},
			data: [],
			itemStyle: {
				normal: {
					//color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}

					color: function(params) {
						var colorList = ['#FFF100','#FFA92F','#FFBA00','#FE8417','#E9C053', '#E55100'];
						return colorList[params.dataIndex]
					}
				},
			},
		}
	]
};

function initChart(canvas, width, height) {
	chart = echarts.init(canvas, null, {
		width: width,
		height: height
	});
	canvas.setChart(chart);

	chart.setOption(option);
	return chart;
}

Page({
	data: {
		ec: {
			onInit: initChart
		},
    hospitalIndex: 0,
    productIndex: 0,
    timeIndex: 0,
		timeList: [],
		goods: [],
		tableList: []
	},

	onLoad () {
		this.initTimeList();
		this.initHospitalList().then(res => {
			const id = this.data.hospitalList[0].id
			this.initGoods(id).then(data => {
				this.initData();
			});
		});
	},

	onReady() {
		setTimeout(function () {
			// 获取 chart 实例的方式
			console.log(chart)
		}, 2000);
	},

	initGoods (id) {
		return getGoodsList(id).then(res => {
			this.setData({
				goods: res.data
			})
		})
	},

	initHospitalList () {
		return getHospitalList().then(res => {
			this.setData({
				hospitalList: res.data.list
			})
		})
	},

	initTimeList () {
		const now = new Date();
		const month = now.getMonth();
		const year = now.getFullYear();
		const timeList = [];
		for (let i = 0; i < 4; i++) {
			if (i === 0) {
				timeList.push({
					year,
					month_type: month > 5 ? 2 : 1
				})
			} else {
				const lastData = timeList[i - 1];
				timeList.push({
					year: lastData.month_type === 2 ? lastData.year : lastData.year - 1,
					month_type: lastData.month_type === 2 ? 1 : 2
				})
			}
			timeList[i].name = `${timeList[i].year}${timeList[i].month_type === 2 ? '下' : '上'}半年`;
		}
		this.setData({
			timeList
		});
	},

	initData () {
		const month = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		const store = this.data.hospitalList[this.data.hospitalIndex];
		const good = this.data.goods[this.data.productIndex];
		const year = this.data.timeList[this.data.timeIndex];
		if (!store || !good || !year) {
			this.setData({
				tableList: []
			});
			chart.setOption({
				xAxis: {
					data: year.month_type === 1 ? month.slice(0, 6) : month.slice(6)
				},
				series: [
					{
						data: []
					}
				]
			});
			return;
		}
		const options = {
			store_id: store.id,
			goods_id: good.id,
			year: year.year,
			month_type: year.month_type,
			role_type: '1'
		};

		Promise.all([
			getData(options).then(res => {
				console.log(res);
				const tableList = res.data.dataList;
				tableList.forEach(item => {
					item.time = item.created_at.substr(0, 10)
				});
				this.setData({
					tableList,
					monthData: res.data.monthData
				})
			}),
			getData({ ...options, role_type: '2'}).then(res => {
				const tableList = res.data.dataList;
				tableList.forEach(item => {
					item.time = item.created_at.substr(0, 10)
				});
				this.setData({
					table2List: tableList,
					monthData2: res.data.monthData
				})
			})
		]).then(res => {
			const monthData = this.data.monthData;
			const monthData2 = this.data.monthData2;
			const dataArr = [];
			for (let i = 1; i < 7; i++) {
				dataArr.push(monthData[`month_${i}_buy`] + monthData[`month_${i}_song`] + monthData2[`month_${i}_buy`] + monthData2[`month_${i}_song`]);
			}
			chart.setOption({
				xAxis: {
					data: this.data.timeList[this.data.timeIndex].month_type === 1 ? month.slice(0, 6) : month.slice(6)
				},
				series: [
					{
						data: dataArr
					}
				]
			});
		})
	},

  hospitalChange (e) {
		const index = typeof e === 'number' ? e : e.detail.value;
		const item = this.data.hospitalList[index];
		this.setData({
			hospitalIndex: index
		})
		if (!item.goods) {
			getGoodsList(item.id).then(res => {
				item.goods = res.data || [];
				this.setData({
					goods: item.goods,
					productIndex: 0
				})
				this.initData();
			})
			return;
		}
		this.setData({
			goods: item.goods,
			productIndex: 0
		})
		this.initData();
  },

	productChange (e) {
		this.setData({
			productIndex: e.detail.value
		})
		this.initData();
	},

	timeChange (e) {
		this.setData({
			timeIndex: e.detail.value
		})
		this.initData();
	}
});
