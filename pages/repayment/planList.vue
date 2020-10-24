<template>
	<view class="main">
		<view class="head">
			<view class="u-font-28"><text>还款总额</text></view>
			<view class="price">{{planList.ramount||planList.total_amount}}</view>
			<view class="u-flex u-col-center u-row-between">
				<view class="u-flex-1">
					<view class="u-font-28 font-blod"><text>{{planList.show_pay_rate || planList.pay_rate}}</text></view>
					<view class="u-font-24 u-margin-top-10"><text>消费费率</text></view>
				</view>
				<view class="u-flex-1 middle-line">
					<view class="u-font-28 font-blod"><text>{{planList.show_service_rate|| planList.service_rate}}</text></view>
					<view class="u-font-24 u-margin-top-10"><text>还款费率</text></view>
				</view>
				<view class="u-flex-1">
					<view class="u-font-28 font-blod"><text>{{planList.zsum}}</text></view>
					<view class="u-font-24 u-margin-top-10"><text>还款笔数</text></view>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="u-flex u-col-center u-row-between list-title">
				<view class="u-flex-1">
					<view class="u-font-24 u-content-color"><text>还款笔数</text></view>
				</view>
				<view class="u-flex-1 middle-line">
					<view class="u-font-28 u-main-color"><text>还款金额</text></view>
					<view class="u-font-24 u-margin-top-10 u-content-color"><text>消费金额</text></view>
				</view>
				<view class="u-flex-1">
					<view class="u-font-28 u-main-color"><text>还款费率</text></view>
					<view class="u-font-24 u-margin-top-10 u-content-color"><text>消费费率</text></view>
				</view>
			</view>
			<view class="u-flex u-col-center u-row-left item u-margin-30" v-for="(item,index) in planList.list" :key="index">
				<view class="num u-text-center">
					<view><text class="u-content-color u-font-24">笔数</text></view>
					<view><text class="u-main-color u-font-36 u-margin-top-15">{{index+1}}</text></view>
				</view>
				<view class="u-flex-1">
					<view>
						<view class="u-flex u-row-between u-col-center">
							<view class="u-flex-1">
								<view><text class="u-content-color u-font-24">还款金额</text></view>
								<view><text class="u-main-color u-font-36 u-margin-top-15">{{item.hk_money}}</text></view>
							</view>
							<view class="u-flex-1 u-text-right">
								<view><text class="u-content-color u-font-24">还款费率</text></view>
								<view><text class="u-main-color u-font-36 u-margin-top-15">{{item.hk_poundage}}</text></view>
							</view>
							<view class="u-flex-1 u-text-center">
								<view>
									<text class="u-font-24" style="color: #FF773A;" v-if="item.hk_state==0">待还款</text>
									<text class="u-font-24 u-type-success" v-if="item.hk_state==1">已还款</text>
									<text class="u-font-24 u-type-error"  v-if="item.hk_state==2">还款失败</text>
									<text class="u-font-24" style="color: #FF773A;" v-if="item.hk_state==3">还款中</text>
								</view>
							</view>
						</view>
						<view class="u-padding-top-10 u-font-22 u-type-error"  v-if="item.hk_state==2"><text>失败原因：{{item.hk_task_result}}</text></view>
						<view class="u-padding-top-10 u-font-22 u-content-color  u-flex u-row-between u-col-center">
							<text>执行时间 {{$u.timeFormat(item.hk_time, 'mm月dd日 hh时MM分')}}</text>
							<text class="continue"  @click="showContinueModel(item.hk_task_id)" v-if="item.hk_state==2&&source=='executing'">继续执行</text>
						</view>
					</view>
					<u-line color="#E8E8E8" margin="20rpx 0"></u-line>
					<view>
						<view class="u-flex u-row-between u-col-center">
							<view class="u-flex-1">
								<view><text class="u-content-color u-font-24">消费金额</text></view>
								<view><text class="u-main-color u-font-36 u-margin-top-15">{{item.first_money}}</text></view>
							</view>
							<view class="u-flex-1 u-text-right">
								<view><text class="u-content-color u-font-24">消费费率</text></view>
								<view><text class="u-main-color u-font-36 u-margin-top-15">{{item.first_poundage}}</text></view>
							</view>
							<view class="u-flex-1 u-text-center">
								<view>
									<text class="u-font-24" style="color: #FF773A;" v-if="item.first_state==0">待消费</text>
									<text class="u-font-24 u-type-success" v-if="item.first_state==1">已消费</text>
									<text class="u-font-24 u-type-error"  v-if="item.first_state==2">消费失败</text>
									<text class="u-font-24" style="color: #FF773A;" v-if="item.first_state==3">消费中</text>
								</view>
							</view>
						</view>
						<view class="u-padding-top-10 u-font-22 u-type-error" v-if="item.first_state==2"><text>失败原因：{{item.first_task_result}}</text></view>
						<view class="u-padding-top-10 u-font-22 u-content-color  u-flex u-row-between u-col-center">
							<text>执行时间 {{$u.timeFormat(item.first_time, 'mm月dd日 hh时MM分')}}</text>
							<text class="continue" @click="showContinueModel(item.first_task_id)" v-if="item.first_state==2&&source=='executing'">继续执行</text>
						</view>
					</view>
					<view class="u-margin-top-30" v-if="item.second_money">
						<view class="u-flex u-row-between u-col-center">
							<view class="u-flex-1">
								<view><text class="u-main-color u-font-36 ">{{item.second_money}}</text></view>
							</view>
							<view class="u-flex-1 u-text-right">
								<view><text class="u-main-color u-font-36">{{item.second_poundage}}</text></view>
							</view>
							<view class="u-flex-1 u-text-center">
								<view>
									<text class="u-font-24" style="color: #FF773A;" v-if="item.second_state==0">待消费</text>
									<text class="u-font-24 u-type-success" v-if="item.second_state==1">已消费</text>
									<text class="u-font-24 u-type-error"  v-if="item.second_state==2">消费失败</text>
									<text class="u-font-24" style="color: #FF773A;" v-if="item.second_state==3">消费中</text>
								</view>
							</view>
						</view>
						<view class="u-padding-top-10 u-font-22 u-type-error" v-if="item.second_state==2"><text>失败原因：{{item.second_task_result}}</text></view>
						<view class="u-padding-top-10 u-font-22 u-content-color u-flex u-row-between u-col-center">
							<text>执行时间 {{$u.timeFormat(item.second_time, 'mm月dd日 hh时MM分')}}</text>
							<text class="continue" @click="showContinueModel(item.second_task_id)"  v-if="item.second_state==2&&source=='executing'">继续执行</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-gap height="30"></u-gap>
		<view v-if="source!='end'" class="footer">
			<u-button v-if="source=='preview'" shape="circle" :hair-line="false" :custom-style="btnStyle" @click="sub">立即执行</u-button>
			<u-button v-if="source=='executing'"  shape="circle" :hair-line="false" :custom-style="btnStyle" @click="endModel=true">终止计划</u-button>
		</view>
		<u-modal v-model="showModel">
			<view class="u-padding-20 u-font-28">{{planList.plan_skip}}</view>
		</u-modal>
		<u-modal v-model="endModel" :show-cancel-button="true" content="是否终止计划？" @confirm="endPlan">
		</u-modal>
		<u-modal v-model="continueModel" :show-cancel-button="true" content="是否继续执行计划？" @confirm="continuePlan">
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				source: '',
				btnStyle: {
					background: '#0077FF',
					color: '#FFF',
					fontSize: '32rpx',
					height: '90rpx',
					boxShadow: '0px 7px 16px 0px rgba(88, 91, 120, 0.38)',
					border: 'none'
				},
				planList: {},
				repayData: {},
				showModel: false,
				planId: '', //计划id
				card_id:'',
				endModel:false,
				continueModel:false,
				task_id:'',
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(parms) {
			this.source = parms.source;
			this.card_id = parms.card_id;
			this.planId = parms.repayment_plan_id;
			this.initData()
		},
		onPullDownRefresh() {
			this.initData()
		},
		methods: {
			async initData() {
				switch (this.source) {
					case 'preview':
						this.planList = uni.getStorageSync('planList') || {}
						this.repayData = uni.getStorageSync('repayData') || {};
						this.showModel = true;
						break;
					case 'executing':
						uni.setNavigationBarTitle({
							title:'计划进度'
						})
						this.getPlanList()
						break;
					case 'end':
						this.getPlanList()
						break;
					default:
						break;
				}
			},
			sub() {
				let _self = this;
				uni.showModal({
					content: this.planList.plan_skip,
					success(confirm) {
						if (confirm.confirm) {
							_self.makePlan()
						}
					}
				})
			},
			async getPlanList() {		//获取计划列表
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Repayment/plan_list',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_id,
						repayment_plan_id: this.planId,
					}
				})
				uni.hideLoading()
				uni.stopPullDownRefresh()
				if (res.data.status == 1) {
					this.planList = res.data.body;
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			},
			async makePlan() { //执行计划
				uni.showLoading({
					mask: true,
					title: ''
				})
				let data = {
						uid: this.userInfo.uid,
						card_id: this.repayData.card_id,
						channel_id: this.repayData.channel_id,
						channel_model: this.repayData.channel_model,
						plan_list: JSON.stringify(this.planList.list),
						order_number: this.planList.order_number,
						mode: 'channel',
						city: this.repayData.city,
						kk_rate_fee: this.planList.kk_rate_fee,
						total_amount: this.repayData.ramounts
					}
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Repayment/create_plan_order',
					method: 'POST',
					device: 'web',
					data
				})
				
				if (res.data.status == 1) {
					let _self = this;
					uni.showToast({
						title:'制定计划成功',
						icon:'success',
						success() {
							_self.planId = res.data.body.repayment_plan_id
							_self.source = 'executing';
							_self.initData();
						}
					})
					
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.hideLoading()
			},
			
			async endPlan(){		//终止计划
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Repayment/stop_plan',
					method: 'POST',
					device: 'web',
					data: {
						plan_id: this.planId,
					}
				})
				uni.hideLoading()
				if (res.data.status == 1) {
					uni.showToast({
						title:'计划已终止',
						success() {
							uni.navigateBack();
						}
					})
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},	//继续执行计划
			showContinueModel(task_id){
				this.task_id = task_id
				this.continueModel = true;
			},
			async continuePlan(){
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Repayment/contuine_plan',
					method: 'POST',
					device: 'web',
					data: {
						task_id:this.task_id,
					}
				})
				uni.hideLoading()
				if (res.data.status == 1) {
					this.initData()
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
		background: #F5F7F6;
	}

	.head {
		background: $ez-theme-bg;
		color: #FFF;
		padding: 30rpx 0 60rpx 0;
		text-align: center;

		.price {
			font-size: 78rpx;
			font-weight: bold;
			margin: 30rpx 0;
		}

		.middle-line {
			position: relative;
		}

		.middle-line:before {
			content: '';
			position: absolute;
			left: 0;
			height: 50%;
			top: 25%;
			width: 1rpx;
			background: #FFF;
		}

		.middle-line:after {
			content: '';
			position: absolute;
			right: 0;
			height: 50%;
			top: 25%;
			width: 1rpx;
			background: #FFF;
		}
	}

	.list {

		.list-title {
			text-align: center;
			background: #FFF;
			padding: 25rpx 0;

			.middle-line {
				position: relative;
			}

			.middle-line:before {
				content: '';
				position: absolute;
				left: 0;
				height: 50%;
				top: 25%;
				width: 1rpx;
				background: #E8E8E8;
			}

			.middle-line:after {
				content: '';
				position: absolute;
				right: 0;
				height: 50%;
				top: 25%;
				width: 1rpx;
				background: #E8E8E8;
			}
		}

		.item {
			background: #FFF;
			border-radius: 20rpx;
			padding: 40rpx 0;
			box-shadow: 1px 5px 26px 0px rgba(198, 198, 198, 0.35);
			.continue{
				color: #0077FF;
				font-size: 24rpx;
				border-radius: 10rpx;
				margin-right: 30rpx;
			}
			.num {
				padding: 0 60rpx;
			}
		}
	}

	.footer {
		position: sticky;
		background: #F5F7F6;
		bottom: 0;
		height: 90rpx;
		padding: 20rpx 45rpx 45rpx 45rpx;
		left: 0;
		right: 0;
	}
</style>
