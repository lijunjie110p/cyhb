<template>
	<view class="main">
		<view class="card-panel">
			<view class="card">
				<view class="head">
					<view class="u-flex u-col-center">
						<view class="icon">
							<u-image width="80rpx" height="80rpx" mode="aspectFit" :src="card.bank_icon"></u-image>
						</view>
						<view class="u-margin-left-35 u-flex-1">
							<view>
								<text class="u-font-36">{{card.bank_name}}</text>
							</view>
							<view>
								<text class="u-font-26" style="color: #D2D2D2;">信用卡</text>
							</view>
						</view>
					</view>
					<view class="u-margin-top-10 number u-margin-bottom-30">
						<text class="font-blod u-font-28">{{card.card_no}}</text>
					</view>
				</view>
				<view class="fotter u-flex u-row-between u-col-center">
					<view class="u-flex-1 u-text-center">
						<view><text class="u-font-24 u-content-color">账单日</text></view>
						<view @click="selectDate(1)"><text class="u-main-color font-blod u-font-32">{{card.statement_date||'未设置'}}</text></view>
					</view>
					<view class="line"></view>
					<view class="u-flex-1 u-text-center">
						<view><text class="u-font-24 u-content-color">还款日</text></view>
						<view @click="selectDate(2)"><text class="u-main-color font-blod u-font-32">{{card.repayment_date||'未设置'}}</text></view>
					</view>
				</view>
			</view>
		</view>
		<view>
			<view class="white-bg">
				<view class="u-padding-left-30 u-padding-top-30"><text>账单金额</text></view>
				<view class="price">
					<u-input type="number" :custom-style="{fontSize:'36px',color:'#FF763A',fontWeight:'bold'}" v-model="formData.price"
					 placeholder="0.00"></u-input>
				</view>
			</view>
			<u-cell-group :border="false">
				<u-cell-item :value-style="valueStyle" :border-top="true" title="每月账单日" :value="formData.zdDay" @click="selectDate(1)"></u-cell-item>
				<u-cell-item :value-style="valueStyle" :border-bottom="false" title="每月还款日" :value="formData.hkDay" @click="selectDate(2)"></u-cell-item>
			</u-cell-group>
			<u-picker v-model="showDate" title="选择日期" mode="selector" :default-selector="[0]" :range="range"
			 :safe-area-inset-bottom="true" @confirm="dateChange"></u-picker>
			<u-gap height="20" bg-color="#F2F2F2"></u-gap>
			<u-cell-group :border="false">
				<u-cell-item :value-style="valueStyle" title="消费城市" :value="formData.city" @click="showRegion=true"></u-cell-item>
				<u-cell-item v-if="showPoint == 1" title="是否去除小数点" :arrow="false">
					<u-switch slot="right-icon" v-model="is_point" @change="changePoint"></u-switch>
				</u-cell-item>
			</u-cell-group>
			<u-gap height="20" bg-color="#F2F2F2"></u-gap>
			<u-cell-group :border="false">
				<u-cell-item :value-style="valueStyle" title="选择通道" :value="formData.channel.channel_name" @click="selectChannel"></u-cell-item>
			</u-cell-group>
			<view class="sub-btn">
				<u-button type="primary" shape="circle" @click="plan">下一步</u-button>
			</view>
			<u-gap height="30" bg-color="#F2F2F2"></u-gap>
			<u-picker confirm-color="#0077FF" :safe-area-inset-bottom="true" @confirm="selectedRegion" mode='region'
			 :default-region="area" v-model="showRegion"></u-picker>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				card_id: '', //信用卡id
				model_id: '', // 还款模式id
				is_need_sub:'',	//是否需要辅助通道	1需要 0不需要
				showDate: false,
				dateType: '',
				formData: {
					zdDay: '',
					hkDay: '',
					price: '',
					city: '',
					is_point: '2',
					channel: {
						channel_name: '',
						channel_id: ''
					}
				},
				subChannel:{},	//辅助通道
				range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
					30, 31
				],
				card: {},
				area: [],
				showRegion: false,
				is_point: false,
				showPoint:'',
				valueStyle: {
					fontSize: '28rpx',
					color: '#333'
				},
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
		},
		onLoad(parms) {
			this.card_id = parms.card_id;
			this.model_id = parms.model_id;
			this.is_need_sub = parms.is_need_sub;
			this.showPoint = parms.is_point;
			this.initData()
		},
		onReady() {
			let _self = this;
			uni.getLocation({
				geocode: true,
				type: 'gcj02',
				success(res) { 
					_self.formData.city = res.address.province + '-' + res.address.city + '-' + res.address.district;
				},
				fail(res) {
					console.log(res)
				}
			})
		},
		onPullDownRefresh() {
			this.initData()
		},
		methods: {
			async initData() {
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/PayBank/bank_info',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_id
					}
				})
				if (res.data.status == 1) {
					this.card = res.data.body.card_info
					this.formData.zdDay = this.card.statement_date ? `每月${this.card.statement_date}日` : '未设置';
					this.formData.hkDay = this.card.repayment_date ? `每月${this.card.repayment_date}日` : '未设置';
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.stopPullDownRefresh();
				uni.hideLoading()
			},
			selectDate(type) { //选择日期
				this.showDate = true;
				this.dateType = type;
			},
			dateChange(date) { //改变日期
				if (this.dateType == 1) {
					this.formData.zdDay = '每月' + this.range[date] + '日'
					this.card.statement_date = this.range[date]
				} else {
					this.formData.hkDay = '每月' + this.range[date] + '日'
					this.card.repayment_date = this.range[date]
				}
				this.editDate();
			},
			async editDate() { //修改还款日账单日
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/PayBank/update_card',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_id,
						statement_date: this.card.statement_date,
						repayment_date: this.card.repayment_date
					}
				})
				uni.hideLoading()
				if (res.data.status == 1) {
					this.$u.toast('修改成功')
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			selectedRegion(e) { //选择城市
				this.formData.city = `${e.province.label}-${e.city.label}-${e.area.label}`
				this.area = [e.province.label, e.city.label, e.area.label]
			},
			changePoint(e) { //去除小数点
				if (e) {
					this.formData.is_point = '1'
				} else {
					this.formData.is_point = '2'
				}
			},
			selectChannel() { //选择通道
				uni.navigateTo({
					url: '../gathering/channel?source=repayment&card_id=' + this.card_id+'&channel_model='+this.model_id+'&is_need_sub='+this.is_need_sub
				})
			},
			async plan() { //下一步
				let _self = this;
				uni.showLoading({
					mask: true,
					title: ''
				})
				if (this.formData.price == '') {
					this.$u.toast('请输入账单金额')
					return
				}
				if (this.formData.city == '') {
					this.$u.toast('请选择消费城市')
					return
				}
				if (this.formData.channel.channel_id == '') {
					this.$u.toast('请选择通道')
					return
				}
				if(this.is_need_sub == 1){
					this.formData.channel.channel_id = this.formData.channel.channel_id+','+this.subChannel.channel_id;
				}
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Repayment/stroke_count',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_id,
						channel_id: this.formData.channel.channel_id,
						channel_model: this.model_id,
						amount: this.formData.price
					}
				})
				uni.hideLoading()
				if (res.data.status == 1) {
					if(res.data.body.stroke_count == 0){
						this.$u.toast('本期账单已还清或已过还款日')
						return;
					}
					uni.setStorage({
						key: 'repayData',
						data: {
							card_id: _self.card_id,
							city: _self.formData.city,
							channel_id: _self.formData.channel.channel_id,
							channel_model: _self.model_id,
							is_point: _self.formData.is_point,
							stroke_count: res.data.body.stroke_count,
							stroke_counts: res.data.body.stroke_counts,
							ramounts: _self.formData.price
						},
						success() {
							uni.navigateTo({
								url: 'selectNum'
							})
						}
					})

				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2;
	}

	.card-panel {
		background: #F2F2F2;
		padding: 30rpx;

		.card {
			box-shadow: 0px -3px 12px 0px rgba(88, 91, 120, 0.24), 0px 7px 16px 0px rgba(88, 91, 120, 0.38);
			border-radius: 10rpx;
			overflow: hidden;

			.head {
				height: 120rpx;
				background: url('../../static/image/repayment_card_bg.png');
				background-size: 100%;
				background-repeat: no-repeat;
				padding: 40rpx;
				color: #FFF;

				.icon {
					border-radius: 50rpx;
					padding: 5rpx;
					background: #FFF;
					text-align: center;
				}
			}

			.number {
				margin-left: 125rpx;
				letter-spacing: 2px;
			}

			.fotter {
				padding: 10rpx 0;
				background: #FFF;

				.line {
					width: 1px;
					background: #D9D9D9;
					height: 50rpx;
				}
			}
		}
	}

	.price {
		padding: 20rpx 0 20rpx 30rpx;
	}

	.sub-btn {
		margin: 60rpx 30rpx;
	}
</style>
