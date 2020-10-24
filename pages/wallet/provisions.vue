<!-- 备付金 -->
<template>
	<view class="main">
		<view class="white-bg u-padding-30">
			<view class="card">
				<view class="u-flex u-row-between u-col-center">
					<view class="white-color u-flex-1"><text class="u-margin-right-20">总金额(元)</text>
						<u-icon @click="showPrice=!showPrice" :name="showPrice?'eye':'eye-off'" color="#FFF" size="30"></u-icon>
					</view>
				</view>
				<view><text class="total-price">{{showPrice?data.money||0.00:'***'}}</text></view>
				<view class="u-flex u-row-between white-color u-col-center">
					<view class="u-flex-1 u-text-left">
						<view><text class="u-font-28 u-margin-right-20">已授信金额(元)</text></view>
						<view><text class="total-price">{{data.y_nbspexess||0.00}}</text></view>
						
					</view>
					<view class="u-flex-1 u-text-left">
						<view>
							<text class="u-font-28 u-margin-right-20">已冻结金额(元)</text>
						</view>
						<view>
							<text class="total-price">{{data.freeze_nbspexess||0.00}}</text>
						</view>
						
					</view>
				</view>
			</view>
			<view class="u-padding-top-30 u-flex u-row-between u-col-center">
				<view class="u-flex-1 u-text-left">
					<view class="u-font-28"><text>可用余额(元)</text></view>
					<view class="u-font-28"><text class="u-font-36 font-blod">{{data.nbspexess||0.00}}</text></view>
				</view>
				<view class="u-flex-1 u-text-right">
					<view class="u-font-28">
						<text class="cz-btn" @click="jump('recharge?source=bfj')">充值</text>
						<text class="bfj-btn" @click="jump('../card/card')">备付金管理</text>
					</view>
				</view>
			</view>
		</view>
		<view class="subbtn">
			<u-button shape="circle" @click="jump('withdraw?source=bfj')" :hair-line="false" :custom-style="btnStyle">提现</u-button>
		</view>
		<view class="tips">
			<view><text>温馨提示：</text></view>
			<view><text>1.备付金用于精养卡模式（需充值500元以上才能使用 ）</text></view>
			<view><text>2.备付金可替多卡进行全额管理</text></view>
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
				showPrice: true,
				data:{},
				btnStyle: {
					background: '#FF763A',
					height: '90rpx',
					color: '#FFF',
					border: 'none',
					fontSize: '36rpx'
				},
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			this.initData();
		},
		methods:{
			async initData(){
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Member/mybalance',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						type:3
					}
				})
				if (res.data.status == 1) {
					this.data = res.data.body
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			jump(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F2F2F2;
	}
	.card {
		
		padding: 50rpx;
		height: 220rpx;
		border-radius: 15rpx;
		background: linear-gradient(90deg, #FF7802 0%, #FF9702 100%);
		.total-price {
			font-size: 48rpx;
			font-weight: bold;
			color: #FFF;
		}
	}
	.cz-btn{
		border-radius: 10rpx;
		border: 1px solid #FF763A;
		color: #FF763A;
		font-size: 30rpx;
		padding: 0 10rpx;
		margin-right: 20rpx;
	}
	.bfj-btn{
		border-radius: 10rpx;
		border: 1px solid #FF763A;
		background: #FF763A;
		font-size: 30rpx;
		color: #FFF;
		padding: 0 10rpx;
	}
	.subbtn {
		margin: 100rpx 30rpx;
	}
	.tips{
		color: #9A9A9A;
		font-size: 22rpx;
		padding: 0 30rpx;
	}
</style>
