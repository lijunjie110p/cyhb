<template>
	<view class="main">
		<view class="data-panel">
			<view class="panel-top">
				<view><text class="title">总资产</text></view>
				<view class="u-margin-top-20 u-margin-bottom-20 tips-color u-flex u-col-center">
					<text class="price-icon">￥</text>
					<text class="price">{{data.all_income}}</text>
				</view>
				<view class="u-flex u-row-between u-col-center">
					<view class="u-flex-1 u-text-left">
						<text class="u-font-28 u-type-info">昨日收益</text>
						<text class="u-font-32 font-blod u-main-color u-margin-left-20">{{data.before_income}}</text>
					</view>
					<view class="u-flex-1 u-text-left">
						<text class="u-font-28 u-type-info">今日收益</text>
						<text class="u-font-32 font-blod u-main-color u-margin-left-20">{{data.today_income}}</text>
					</view>
				</view>
			</view>
			<u-gap v-if="data.all_income>0" height="20" bg-color="#F2F2F2"></u-gap>
			<view class="panel-bottom" v-if="data.all_income>0">
				<canvas canvas-id="canvas" id="canvas" class="charts" @touchstart="touchPie"></canvas>
			</view>
		</view>
		<view @click="jump(item.param_id)" class="u-padding-30 item" v-for="(item,index) in data.project">
			<view class="u-flex u-row-left u-col-center">
				<view>
					<u-image :src="item.param_img" shape="circle" width="55rpx" mode="widthFix"></u-image>
				</view>
				<text class="u-font-30 u-main-color u-margin-left-30">{{item.param_name}}</text>
			</view>
			<view class="u-flex u-row-right u-col-center">
				<text class="u-font-32 font-blod u-margin-right-20">￥{{item.total_amount}}</text>
				<u-icon name="arrow-right" size="30" color="#999999"></u-icon>
			</view>
		</view>
		<u-gap height="20"></u-gap>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import {
		mapState
	} from 'vuex';
	var _self;
	var canvaPie = null;
	export default {

		data() {
			return {
				data: {
					cWidth: '',
					cHeight: '',
					pixelRatio: 1,
					serverData: '',
				}
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			_self = this;
			this.initData()
		},
		onPullDownRefresh() {
			this.initData()
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '../wallet/bill?source=profit'
			})
		},
		methods: {
			async initData() {
				uni.showLoading({
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Manage/supervise',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid
					}
				})
				uni.hideLoading();
				uni.stopPullDownRefresh()
				if (res.data.status == 1) {
					this.data = res.data.body
					let pieData = {series:[]};
					for (var i in this.data.project) {
						pieData.series.push({
							name:this.data.project[i].param_name,
							data: parseFloat(this.data.project[i].total_amount)
						})
					}
					this.showPie('canvas', pieData)
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			jump(id) {
				uni.navigateTo({
					url: '../gathering/performance?source=' + id
				})
			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					legend: {
						show: true,
						position: 'right',
						float: 'center',
						itemGap: 10,
						padding: 5,
						lineHeight: 26,
						margin: 5,
						borderWidth: 1
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: 345,
					height: 150,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					},
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: linear-gradient(to bottom, #0078FF 0%, #0078FF 20%, #F5F7F6 20.00001%, #F5F7F6 200%);
	}

	.charts {
		width: 690rpx;
		height: 300rpx;
		background-color: #FFF;
	}

	.data-panel {
		border-radius: 10rpx;
		box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.07);
		background: #FFF;
		margin: 30rpx;
		overflow: hidden;
		.panel-top {
			padding: 50rpx 30rpx;

			.title {
				font-size: 48rpx;
				color: #333;
				font-weight: bold;
			}

			.price {
				font-size: 60rpx;
				font-weight: bold;
			}

			.price-icon {
				color: #FFF;
				background: #FF763A;
				padding: 0 5rpx;
				margin-right: 20rpx;
				border-radius: 10rpx;
				font-size: 26rpx;
			}
		}

		.panel-bottom {
		}
	}

	.item {
		margin: 30rpx;
		background: #FFF;
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.07);
	}
</style>
