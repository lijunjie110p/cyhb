<template>
	<view class="main">
		<u-swiper img-mode="widthFix" height="200" name="param_img" border-radius="0" :list="data.banner_list"></u-swiper>
		<view>
			<view class="u-padding-30">
				<view class="card white-bg u-flex u-col-top u-row-between">
					<u-avatar :src="data.avatar" size="large"></u-avatar>
					<view class="u-margin-left-10">
						<view><text class="u-font-30 u-main-color">{{data.djname}}</text></view>
						<view class="u-margin-top-10"><text class="u-font-24 u-line-2 u-type-info">我是您的推荐人，可以为您提供推广市场和功能使用等服务</text></view>
					</view>
					<view class="u-margin-left-10">
						<u-button @click="telPhone(data.parent_mobile)" shape="circle" size="mini" :custom-style="btnStyle">联系导师</u-button>
					</view>
				</view>
			</view>
			<view class="item" @click="jump(data.service_url)">
				<view class="u-flex u-row-center">
					<u-image src="/static/image/service/service_online.png" width="60rpx" mode="widthFix"></u-image>
				</view>
				<view class="info">
					<view class="u-text-left">
						<view class="u-font-28 u-main-color"><text>在线客服</text></view>
						<view class="u-font-24 u-type-info"><text>在线咨询客服为您解答问题</text></view>
					</view>
					<view class="u-text-right">
						<u-icon name="arrow-right" size="30"></u-icon>
					</view>
				</view>
			</view>
			<view class="item" @click="jump(data.wechat_url)">
				<view class="u-flex u-row-center">
					<u-image src="/static/image/service/service_wx.png" width="60rpx" mode="widthFix"></u-image>
				</view>
				<view class="info">
					<view class="u-text-left">
						<view class="u-font-28 u-main-color"><text>微信客服</text></view>
						<view class="u-font-24 u-type-info"><text>识别二维码，添加微信客服</text></view>
					</view>
					<view class="u-text-right">
						<u-icon name="arrow-right" size="30"></u-icon>
					</view>
				</view>
			</view>
			<view class="item"  @click="telPhone(data.phone)">
				<view class="u-flex u-row-center">
					<u-image src="/static/image/service/service_phone.png" width="60rpx" mode="widthFix"></u-image>
				</view>
				<view class="info">
					<view class="u-text-left">
						<view class="u-font-28 u-main-color"><text>全国服务热线</text></view>
						<view class="u-font-24 u-type-info"><text>{{data.phone}}</text></view>
					</view>
					<view class="u-text-right">
						<u-icon name="arrow-right" size="30"></u-icon>
					</view>
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
				data: {},
				btnStyle: {
					background: '#FF763A',
					height: '48rpx',
					color: '#FFF',
					border: 'none',
					fontSize: '26rpx'
				},
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			this.initData();
		},
		onPullDownRefresh() {
			this.initData();
		},
		methods: {
			async initData() {
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Message/problem_video',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
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
				uni.stopPullDownRefresh()
			},
			telPhone(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				})
			},
			jump(url) {
				if(url){
					uni.navigateTo({
						url: '../public/webView?url=' + encodeURIComponent(url + '?uid=' + this.userInfo.uid)
					})
				}else{
					this.$u.toast('暂未开放')
				}
				
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F2F2F2;
	}
	.card {
		padding: 40rpx 30rpx;
		height: 130rpx;
		box-shadow: 0px 10px 14px 10px rgba(204, 204, 204, 0.3);
		border-radius: 10rpx;
		.headpic {
			border: 1px solid #F2F2F2;
			border-radius: 50%;
			overflow: hidden;
		}
	}

	.item {
		padding:40rpx 30rpx;
		margin: 30rpx;
		border-radius: 20rpx;
		box-shadow: 0px 5px 26px 0px rgba(198, 198, 198, 0.35);
		background: #FFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.info{
			width: 500rpx;
			padding-left: 30rpx;
			border-left: 1px solid #D7D4D4;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
