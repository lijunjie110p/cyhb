<template>
	<view class="main">
		<view class="bg">
			<view class="panel">
				<view class="u-text-center">
					<view><text class="u-content-color u-font-32">还款笔数</text></view>
					<view><text class="number">{{slider.shownum}}</text></view>
				</view>
				<view class="u-margin-top-30"><u-slider :step="slider.step" @moving="moving" @end="end" block-color="#0077FF" active-color="#0077FF" max="100" min="1" v-model="slider.num" height="8" block-width="50" :block-style="{background:'#85c6ff',border:'5px solid #0077FF'}"></u-slider></view>
				<view class="u-flex u-row-between u-col-center u-font-34 u-type-info u-margin-top-30 u-margin-bottom-30">
					<text>{{slider.minNum}}</text>
					<text>{{slider.maxNum}}</text>
				</view>
				<u-line length="100%" color="#E8E8E8"></u-line>
				<view class="u-margin-top-30">
					<view class="u-flex u-row-between u-col-center">
						<text class="u-font-30 u-content-color ">消费费率</text>
						<text class="u-font-28 u-type-info">{{numData.show_pay_rate||0.00}}</text>
					</view>
					<view class="u-flex u-row-between u-col-center u-margin-top-30">
						<text class="u-font-30 u-content-color ">还款费率</text>
						<text class="u-font-28 u-type-info">{{numData.show_service_rate||0.00}}</text>
					</view>
					<view class="u-flex u-row-between u-col-center u-margin-top-30">
						<text class="u-font-30 u-content-color ">合计金额</text>
						<text class="u-font-28 main-color">{{numData.all_service||0.00}}</text>
					</view>
				</view>
				<u-gap height="60"></u-gap>
				<view class="u-main-color font-blod u-text-center"><text class="u-font-28">本期账单预留本金￥</text><text class="u-font-30">{{numData.range_money||0.00}}</text></view>
				<u-gap height="60"></u-gap>
				<view>
					<u-button :hair-line="false" shape="circle" :custom-style="btnStyle" @click="sub">预览计划</u-button>
				</view>
			</view>
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
				slider:{
					shownum:0,
					num: 0,
					maxNum:100,
					minNum:1,
					step:1,
				},
				btnStyle: {
					background: '#0077FF',
					color: '#FFF',
					fontSize: '32rpx',
					height: '90rpx',
					height: '90rpx',
					boxShadow: '0px 7px 16px 0px rgba(88, 91, 120, 0.38)',
					border:'none'
				},
				numData:{},
				repayData:{}
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(parms) {
			this.card_id = parms.card_id;
			this.initData()
		},
		onReady() {
			// #ifdef APP-PLUS
			var page = this.$mp.page.$getAppWebview();
			page.setStyle({ popGesture: 'none' });
			// #endif

		},
		onPullDownRefresh() {
			this.initData()
		},
		methods: {
			async initData() {
				this.repayData = uni.getStorageSync('repayData') || '';
				
				this.slider.minNum = this.repayData.stroke_counts[0]
				this.slider.maxNum =  this.repayData.stroke_counts[this.repayData.stroke_counts.length-1];
				this.slider.shownum = this.slider.minNum
				if(this.repayData.stroke_counts.length == 1){
					this.slider.step = 100;
					this.slider.num = 100;
				}else{
					this.slider.step =  parseInt(100/(this.slider.maxNum-this.slider.minNum))
				}
				this.end();
			},
			async sub() {
				uni.setStorage({
					key:'planList',
					data:this.numData,
					success() {
						uni.navigateTo({
							url:'planList?source=preview'
						})
					}
				})
			},
			moving(){
				if(this.repayData.stroke_counts.length > 1){
					this.slider.shownum =this.slider.num/this.slider.step+this.slider.minNum
				}
				
			},
			async end(){
				if(this.repayData.stroke_counts.length > 1){
					this.slider.shownum =this.slider.num/this.slider.step+this.slider.minNum
				}
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Repayment/new_repayment_plan',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.repayData.card_id,
						channel_id: this.repayData.channel_id,
						channel_model: this.repayData.channel_model,
						is_point:this.repayData.is_point,
						ramounts:this.repayData.ramounts,
						hk_cs:this.slider.shownum
					}
				})
				uni.hideLoading()
				if (res.data.status == 1) {
					this.numData = res.data.body
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

	.bg {
		background: $ez-theme-bg;
		height: 350rpx;

		.panel {
			position: absolute;
			top: 30rpx;
			left: 30rpx;
			right: 30rpx;
			background: #FFF;
			border-radius: 20rpx;
			padding: 130rpx 30rpx 60rpx 30rpx;

			.number {
				color: #004FFF;
				font-size: 90rpx;
				font-weight: bold;
			}
		}
	}
</style>
