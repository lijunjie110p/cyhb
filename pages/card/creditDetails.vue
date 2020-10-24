<template>
	<view class="main">
		<view class="card">
			<view class="u-flex u-col-center">
				<view>
					<u-image width="80rpx" height="80rpx" mode="aspectFit" :src="card.bank_icon"></u-image>
				</view>
				<view class="u-margin-left-35 u-flex-1">
					<view class="u-flex u-row-between u-col-center">
						<text class="u-font-36">{{card.bank_name}}</text>
						<text class="u-font-28 u-text-right" v-if="card.card_status == 1" style="color: #FF763A;" @click.stop="queryPlan(card.repayment_plan_id,card.card_status)">查看计划</text>
						<text class="u-font-28 u-text-right" v-else style="color: #FF763A;" @click.stop="getMoel(card.card_id)">一键管理</text>
					</view>
					<view class="u-flex u-row-between u-col-center">
						<text class="u-font-26 u-type-info">信用卡</text>
						<text class="u-font-26 u-type-primary">{{card.card_status_show}}</text>
					</view>
				</view>
			</view>
			<view class="u-margin-top-10 number u-margin-bottom-30">
				<text class="font-blod u-font-28">{{card.card_no}}</text>
			</view>
			<view class="line"></view>
			<view class="u-flex bottom-row u-row-between u-col-center">
				<view style="width: 220rpx;">
					<u-line-progress height="20" v-if="card.card_status == 1" active-color="#FF763A" :striped="true" :striped-active="true"
					 :percent="numscale"></u-line-progress>
				</view>
				<view v-if="card.card_status == 1" class="u-font-22 u-type-info">剩余{{card.plan_total_num-card.plan_complete_num}}笔</view>
				<view class="u-font-22 u-type-info">{{repayDay}}到期</view>
			</view>
		</view>
		<view class="title"><text>账单明细</text></view>
		<view class="collapse-panel">
			<u-collapse>
				<u-collapse-item :rigthText="'￥'+item.all_amount" :title="item.year+'年'+item.month+'月'" v-for="(item, index) in bank_bill_list"
				 :key="index">
					<view>
						<view @click="queryPlan(itemList.id,itemList.plan_state)" class="item" v-for="(itemList,i) in item.bill_list" :key="i">
							<view class="top">
								<view class="u-flex-1 u-text-center">
									<view class="u-font-24 u-type-info"><text>还款金额</text></view>
									<view class="u-font-36 u-main-color font-blod"><text>{{itemList.total_amount}}</text></view>
								</view>
								<view class="u-flex-1 u-text-center">
									<view class="u-font-24 u-type-info"><text>还款费率</text></view>
									<view class="u-font-36 u-main-color font-blod"><text>{{itemList.poundage}}</text></view>
								</view>
							</view>
							<u-line length="100%" color="#D9D9D9"></u-line>
							<view class="bottom u-flex u-row-between u-col-center">
								<view class="u-flex-1">
									<view>开始时间 {{itemList.create_time}}</view>
									<view class="u-margin-top-10">结束时间 {{itemList.final_date}}</view>
								</view>
								<view class="u-flex-1 u-text-right">
									<view>{{itemList.plan_state_show}}</view>
								</view>
							</view>
						</view>
					</view>

				</u-collapse-item>
			</u-collapse>
		</view>
		<view class="title"><text>银行服务</text></view>
		<view class="u-flex u-row-between padding-width-base">
			<view class="bottom-btn">
				<u-button shape="circle" @click="queryService" :plain="true" :custom-style="{color:'#0077FF',background:'#FFF'}">查询服务</u-button>
			</view>
			<view class="bottom-btn">
				<u-button shape="circle" @click="telphone" :plain="true" :custom-style="{color:'#0077FF',background:'#FFF'}">联系银行</u-button>
			</view>
		</view>
		<u-modal :show-cancel-button="true" v-model="unbindModel" @confirm="unbind" content="是否解除绑定"></u-modal>
		<u-popup v-model="showType" mode="bottom" :closeable="true">
			<view class="white-bg u-text-center popup-title"><text>智能还款方式</text></view>
			<view class="model-type">
				<view class="u-margin-20 white-bg type-item" v-for="(item,index) in model" :key="index" @click="selectModel(index)">
					<view>
						<u-image :src="item.icon" width="80rpx" mode="widthFix"></u-image>
					</view>
					<view class="u-flex-1 u-text-left u-margin-left-20">
						<view><text class="u-font-28">{{item.title}}</text></view>
						<view><text class="u-font-24 u-line-2">{{item.introduce}}</text></view>
					</view>
					<view>
						<u-icon :color="modelIndex==index?'#0078FF':'#D6D6D6'" name="checkmark-circle" size="50"></u-icon>
					</view>
				</view>
			</view>
			<view class="type-btn">
				<u-button type="primary" @click="toRepayment">继续还款</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				data:'',
				card_id: '',
				card: {},
				unbindModel: false,
				showType: false,
				model: {},
				modelIndex: 0,
				bank_bill_list: [],
				numscale: 0,
				repayDay: '',
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(parms) {
			this.card_id = parms.card_id;
		},
		onShow() {
			this.initData()
		},
		onPullDownRefresh() {
			this.initData()
		},
		onNavigationBarButtonTap() {
			this.unbindModel = true;
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
					this.data = res.data.body
					this.card = res.data.body.card_info
					let today = new Date().getDate();
					let year = new Date().getFullYear();
					let month = new Date().getMonth() + 1
					if (today > this.card.repayment_date) {
						month++
					}
					if (month > 12) {
						year++
						month = 1;
					}
					this.repayDay = year + '-' + month + '-' + this.card.repayment_date
					if (this.card.card_status == 1) {
						this.numscale = (this.card.plan_complete_num / this.card.plan_total_num).toFixed(2) * 100
					} else {
						this.numscale = 0
					}
					this.bank_bill_list = res.data.body.bank_bill_list
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.stopPullDownRefresh();
				uni.hideLoading()
			},
			async unbind() {
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/PayBank/unbind_card',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_id
					}
				})
				uni.hideLoading()
				if (res.data.status == 1) {
					this.$u.toast('解绑成功')
					uni.navigateBack();
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			},
			async getMoel(id) {
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Repayment/get_channel_type',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: id
					}
				})
				uni.hideLoading()
				if (res.data.status == 1) {
					this.card_id = id;
					this.model = res.data.body.type_list
					this.showType = true;
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			toRepayment() {
				this.showType = false;
				uni.navigateTo({
					url: `../repayment/repayment?card_id=${this.card_id}&model_id=${this.model[this.modelIndex].id}&is_need_sub=${this.model[this.modelIndex].is_need_sub}&is_point=${this.model[this.modelIndex].is_point}`
				})
			},
			selectModel(index) {
				if (this.model[index].is_support == '1' && this.model[index].tag != '暂未开放' && this.model[index].tag != '暂不支持') {
					this.modelIndex = index;
				} else {
					this.$u.toast('该卡不支持' + this.model[index].title)
				}

			},
			queryPlan(id, planState) {
				if (planState == 1) {
					uni.navigateTo({
						url: '../repayment/planList?source=executing&card_id=' + this.card_id + '&repayment_plan_id=' + id
					})
				}else{
					uni.navigateTo({
						url: '../repayment/planList?source=end&card_id=' + this.card_id + '&repayment_plan_id=' + id
					})
				}
			},
			queryService(){
				uni.navigateTo({
					url:'queryService?card_id='+this.card_id
				})
			},
			telphone() {
				uni.makePhoneCall({
					phoneNumber: this.data.bank_help_info.world_hotline
				})
			},
		}
	}
</script>

<style lang="scss">
	.card {
		position: relative;
		margin: 30rpx;
		padding: 40rpx 50rpx 0 50rpx;
		box-shadow: 8px 2px 12px 0px rgba(189, 189, 189, 0.35), -8px 2px 12px 0px rgba(189, 189, 189, 0.35);
		border-radius: 20rpx;

		.number {
			margin-left: 115rpx;
			letter-spacing: 2px;
		}

		.line {
			position: absolute;
			height: 1rpx;
			background-color: #d9d9d9;
			left: 0;
			right: 0;
			bottom: 70rpx;
		}

		.bottom-row {
			height: 70rpx;
			line-height: 70rpx;
		}
	}

	.title {
		margin: 40rpx 30rpx;
		font-size: 34rpx;
		color: #333;
		font-weight: 500;
	}

	.collapse-panel {
		margin: 0 30rpx;

		.item {
			background: #FFF;
			margin: 40rpx 20rpx;
			border-radius: 10rpx;
			box-shadow: 0px -3px 10px 0px rgba(88, 91, 120, 0.24), 0px 7px 10px 0px rgba(88, 91, 120, 0.38);

			.top {
				padding: 40rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.bottom {
				padding: 20rpx 40rpx;
				font-size: 22rpx;
				color: #343434;
			}
		}
	}

	.bottom-btn {
		width: 310rpx;
	}

	.model-type {
		background: #F2F2F2;
		padding: 20rpx 0;

		.type-item {
			background: #FFF;
			padding: 30rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.popup-title {
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 32rpx;
		z-index: 9999;
	}

	.type-btn {

		padding: 20rpx 30rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #FFF;
	}
</style>
