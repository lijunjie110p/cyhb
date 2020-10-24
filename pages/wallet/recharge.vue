<template>
	<view class="main">
		<u-gap height="20" bg-color="#F2F2F2"></u-gap>
		
		<u-cell-group :border="false">
			<u-cell-item   @click="showPopup=true" :title-style="{fontSize:'30rpx',marginLeft:'30rpx'}" :center="true" :title="title">
				<u-icon v-if="mode!=''" :color="mode=='wx'?'#00C800':'#FF763A'" :name="mode=='wx'?'weixin-fill':'rmb-circle-fill'" slot="icon" size="90"></u-icon>
				<text v-else slot="icon" class="u-font-30">充值方式</text>
			</u-cell-item>
		</u-cell-group>
		<u-gap height="20" bg-color="#F2F2F2"></u-gap>
		<view class="u-padding-30 white-bg">
			<view class=" u-flex u-row-between u-row-center">
				<view style="width: 650rpx;"><u-input type="number" placeholder-style="fontWeight:400;" :custom-style="{fontSize:'30rpx',fontWeight:'bold'}" placeholder="请输入充值金额" v-model="money"></u-input></view>
				<text>元</text>
			</view>
		</view>
		<u-line length="100%" color="#E8E8E8"></u-line>
		<view class="u-padding-30 white-bg u-font-28"><text>可用余额：{{source=='bfj'?walletData.nbspexess||0.00:walletData.amount||0.00}}元</text></view>
		<view class="subbtn">
			<u-button shape="circle" @click="recharge" :hair-line="false" :custom-style="btnStyle">充值</u-button>
		</view>
		<u-popup length="50%" v-model="showPopup" mode="bottom" :safe-area-inset-bottom="true" :closeable="true">
			<view class="popup-title u-text-center u-padding-20"><text class="font-blod u-font-32">选择充值方式</text></view>
			<u-line length="100%" color="#E6E6E6"></u-line>
			<u-cell-group :border="false">
				<u-cell-item @click="selectType('wx')" :center="true" :arrow="false" title="微信充值">
					<u-icon class="u-margin-right-20" color="#00C800" name="weixin-fill" slot="icon" size="60"></u-icon>
				</u-cell-item>
				<u-cell-item v-if="source=='bfj'" @click="selectType('wallet')" :center="true" :arrow="false" title="余额充值">
					<u-icon class="u-margin-right-20" color="#FF763A" name="rmb-circle-fill" slot="icon" size="60"></u-icon>
				</u-cell-item>
			</u-cell-group>
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
				source:'',
				money: '',
				mode:'',
				title:'请选择充值方式',
				walletData:{},
				btnStyle: {
					background: '#FF763A',
					height: '90rpx',
					color: '#FFF',
					border: 'none',
					fontSize: '36rpx'
				},
				showPopup:false,
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(parms) {
			this.source = parms.source;
			this.initData();
		},
		methods: {
			async initData() {
				uni.showLoading({
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Member/wallet',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
					}
				})
				uni.hideLoading();
				if (res.data.status == 1) {
					this.walletData = res.data.body
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			async recharge() {
				let uView = this.$u;
				if (this.money == '') {
					this.$u.toast('请输入充值金额')
					return;
				}
				uni.showLoading({
					title: ''
				})
				let uri = this.source=='bfj'?'/Member/nbspexess_recharge':'/Member/recharge'
				
				let res = await this.http.request({
					api_source: 'app',
					uri,
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						amount: this.money,
						mode: this.mode
					}
				})
				uni.hideLoading();
				if (res.data.status == 1) {
					if(this.mode == 'wx'){
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo:res.data.body, 
							success: function(res) {
								console.log(res)
								uView.toast('充值成功')
							}, 
							fail: function(err) {
								console.log(err)
								uView.toast('支付失败')
							}
						}) 
					}
					
					
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			selectType(type){
				this.mode = type;
				if(this.mode == 'wx'){
					this.title = '微信充值'
				}else{
					this.title = '余额充值'
				}
				this.showPopup = false;
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F2F2F2;
	}
	.subbtn {
		margin: 50rpx 30rpx;
		padding-bottom: 50rpx;
	}
</style>
