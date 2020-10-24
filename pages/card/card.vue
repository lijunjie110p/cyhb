<template>
	<view class="main">
		<view class="tabs">
			<u-tabs :is-scroll="false" ref="uTabs" bar-width="80" inactive-color="#999" bar-height="6" bg-color="#FFF" height="90"
			 name="name" duration="0.3" active-color="#0077FF" :list="tablist" :current="tabsIndex" @change="changeNavbar"></u-tabs>
		</view>
		<view>
			<view class="nocard" v-if="card.length==0" @click="addCard()">
				<view class="u-flex u-row-center"><u-image src="/static/image/nodata.png" width="380rpx" mode="widthFix"></u-image></view>
				<view class="addbtn">
					<text class="u-font-32 u-margin-left-10">{{card_type=='CC'?'添加信用卡':'添加储蓄卡'}}</text>
				</view>
			</view>
			<view class="hascard" v-else>
				<view v-if="card_type=='CC'">
					<view @click="details(item.card_id)" class="card" v-for="(item,index) in card" :key="index">
						<view class="u-flex u-col-center">
							<view>
								<u-image width="80rpx" height="80rpx" mode="aspectFit" :src="item.bank_icon"></u-image>
							</view>
							<view class="u-margin-left-35 u-flex-1">
								<view class="u-flex u-row-between u-col-center">
									<text class="u-font-36">{{item.bank_name}}</text>
									<text class="u-font-28 u-text-right" v-if="item.card_status == 1" style="color: #FF763A;" @click.stop="queryPlan(item)">查看计划</text>
									<text class="u-font-28 u-text-right" v-else style="color: #FF763A;" @click.stop="getMoel(item.card_id)">一键管理</text>
								</view>
								<view class="u-flex u-row-between u-col-center">
									<text class="u-font-26 u-type-info">{{item.card_type=='CC'?'信用卡':'储蓄卡'}}</text>
									<text class="u-font-26 u-type-primary">{{item.card_status_show}}</text>
								</view>
							</view>
						</view>
						<view class="u-margin-top-10 number u-margin-bottom-30">
							<text class="font-blod u-font-28">{{item.card_no}}</text>
						</view>
						<view class="line"></view>
						<view class="u-flex bottom-row u-row-between u-col-center">
							<view style="width: 220rpx;">
								<u-line-progress v-if="item.card_status == 1" height="20" active-color="#FF763A" :striped="true" :striped-active="true" :percent="numscale[index]"></u-line-progress>
							</view>
							<view class="u-font-22 u-type-info" v-if="item.card_status == 1">剩余{{item.plan_total_num-item.plan_complete_num}}笔</view>
							<view class="u-font-22 u-type-info" >{{repayDay}}到期</view>
						</view>
					</view>
					<view class="botttom-addbtn" @click="addCard()">
						<u-icon name="plus-circle-fill" size="40" color="#0077FF"></u-icon>
						<text class="u-font-32 u-margin-left-10">{{card_type=='CC'?'添加信用卡':'添加储蓄卡'}}</text>
					</view>
				</view>
				<view v-if="card_type=='DC'">
					<view class="cash-card" @click="details(data.card_id)" :style="{background:data.bank_background_color}" v-for="(data,index) in card"
					 :key="index">
						<view class="u-flex u-col-center">
							<view class="icon">
								<u-image width="90rpx" height="90rpx" mode="aspectFit" :src="data.bank_icon"></u-image>
							</view>
							<view class="u-margin-left-35">
								<view><text class="u-font-36">{{data.bank_name}}</text></view>
								<view class="u-margin-top-20 u-flex u-row-right">
									<text class="font-blod u-font-28 " style="letter-spacing: 2px;">{{data.card_no}}</text>
								</view>
							</view>
						</view>
						
						<view class="bgimg">
							<u-image @click="details(data.card_id)" :lazy-load="false" width="150rpx" height="150rpx" mode="aspectFit" :src="data.bank_background_img"></u-image>
						</view>
					</view>
					<view class="dc-botttom-addbtn" @click="addCard()">
						<u-icon name="plus-circle-fill" size="40" color="#FFF"></u-icon>
						<text class="u-font-32 u-margin-left-10">{{card_type=='CC'?'添加信用卡':'添加储蓄卡'}}</text>
					</view>
				</view>

			</view>

		</view>
		<u-popup v-model="showType" mode="bottom" :closeable="true">
			<view class="white-bg u-text-center title"><text>智能还款方式</text></view>
			<view class="model-type">
				<view class="u-margin-20 white-bg type-item" v-for="(item,index) in model" :key="index" @click="selectModel(index)">
					<view><u-image :src="item.icon" width="80rpx" mode="widthFix"></u-image></view>
					<view class="u-flex-1 u-text-left u-margin-left-20">
						<view><text class="u-font-28">{{item.title}}</text></view>
						<view><text class="u-font-24 u-line-2">{{item.introduce}}</text></view>
					</view>
					<view>
						<u-icon :color="modelIndex==index?'#0078FF':'#D6D6D6'" name="checkmark-circle" size="50"></u-icon>
					</view>
				</view>
			</view>
			<view class="type-btn"><u-button  type="primary" @click="toRepayment">继续还款</u-button></view>
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
				card_type: 'CC',
				card_id:'',
				tabsIndex: 0,
				tablist: [{
						name: '信用卡'
					},
					{
						name: '储蓄卡'
					}
				],
				card: [],
				insurance: '',
				first: true,
				showType:false,
				model:{},
				modelIndex:0,
				repayDay:'',
				numscale:[]
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			
		},
		onShow() {
			this.initData()
			
		},
		onPullDownRefresh() {
			this.initData()
		},
		methods: {
			changeNavbar(index) {
				this.card = [],
					this.tabsIndex = index;
				switch (index) {
					case 0:
						this.card_type = 'CC'
						break;
					case 1:
						this.card_type = 'DC'
						break;
					default:
						break;
				}
				this.initData()
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
			async initData() {
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/PayBank/card_holder',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_type: this.card_type
					}
				})
				if (res.data.status == 1) {
					this.card = res.data.body.card
					
					for(let i in this.card){
						let today = new Date().getDate();
						let year = new Date().getFullYear();
						let month = new Date().getMonth()+1
						if(today > this.card[i].repayment_date){
							month++
						}
						if(month>12){
							year++
							month=1;
						}
						this.repayDay = year+'-'+month+'-'+this.card[i].repayment_date
						if(this.card[i].card_status == 1){
							let scale = (this.card[i].plan_complete_num/this.card[i].plan_total_num).toFixed(2)*100
							this.numscale.push(scale)
						}else{
							this.numscale.push(0)
						}
						
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.stopPullDownRefresh();
				uni.hideLoading()
			},
			addCard() {
				if (this.card_type == 'CC') {
					uni.navigateTo({
						url: 'applyCredit'
					})
				} else if (this.card_type == 'DC') {
					uni.navigateTo({
						url: 'applyCash'
					})
				}
			},
			details(id) {
				if(this.card_type == 'CC'){
					uni.navigateTo({
						url: 'creditDetails?card_id=' + id
					})
				}else{
					uni.navigateTo({
						url: 'details?card_id=' + id
					})
				}
			},
			toRepayment(){
				this.showType = false;
				uni.navigateTo({
					url: `../repayment/repayment?card_id=${this.card_id}&model_id=${this.model[this.modelIndex].id}&is_need_sub=${this.model[this.modelIndex].is_need_sub}&is_point=${this.model[this.modelIndex].is_point}`
				})
			},
			selectModel(index){
				if(this.model[index].is_support == '1' && this.model[index].tag !='暂未开放' && this.model[index].tag !='暂不支持'){
					this.modelIndex = index;
				}else{
					this.$u.toast('该卡不支持'+this.model[index].title)
				}
				
			},
			queryPlan(item){
				uni.navigateTo({
					url:'../repayment/planList?source=executing&card_id='+item.card_id+'&repayment_plan_id='+item.repayment_plan_id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFF;
	}

	.tabs {
		background: #FFF;
		padding: 0 30rpx;
	}

	.nocard {
		margin-top: 120rpx;
		text-align: center;
		.addbtn {
			margin: 80rpx auto;
			width: 280rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			border-radius: 50rpx;
			background: #2E7BFD;
			color: #FFF;
			border: 1px solid #0077FF;
			font-size: 36rpx;
		}
	}

	.hascard {
		padding: 0 30rpx 50rpx 30rpx;
		background: #FFF;

		.card {
			position: relative;
			margin: 30rpx 0;
			padding: 40rpx 50rpx 0 50rpx;
			box-shadow: 8px 2px 12px 0px rgba(189, 189, 189, 0.35), -8px 2px 12px 0px rgba(189, 189, 189, 0.35);
			border-radius: 20rpx;
			.number{
				margin-left: 115rpx;
				letter-spacing: 2px;
			}
			.line{
				position: absolute;
				height: 1rpx;
				background-color: #d9d9d9;
				left: 0;
				right: 0;
				bottom: 70rpx;
			}
			.bottom-row{
				height: 70rpx;
				line-height: 70rpx;
			}
		}
		
	}

	.botttom-addbtn {
		width: 600rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		border-radius: 50rpx;
		margin: 50rpx auto;
		background: #FFF;
		color: #0077FF;
		border: 1px solid #0077FF;
	}

	.dc-botttom-addbtn {
		width: 690rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		border-radius: 10rpx;
		margin: 50rpx auto;
		background: #0077FF;
		box-shadow: 0px 5px 20px 0px rgba(51, 125, 247, 0.4);
		color: #FFF;
	}

	.cash-card {
		margin: 30rpx 0;
		padding: 55rpx 40rpx;
		border-radius: 20rpx;
		color: #FFF;
		position: relative;

		.icon {
			background: #FFFFFF;
			border-radius: 50rpx;
			padding: 5rpx;
		}

		.bgimg {
			position: absolute;
			right: 50rpx;
			width: 150rpx;
			top: 30rpx;
			bottom: 30rpx;
			background: transparent;

			.u-image {
				background: transparent;
			}
		}
	}
	.model-type{
		background: #F2F2F2;
		padding: 20rpx 0;
		.type-item{
			background: #FFF;
			padding: 30rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
	.title{
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
	.type-btn{
		
		padding:20rpx 30rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #FFF;
	}
</style>
