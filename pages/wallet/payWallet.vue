<template>
	<view class="main">
		<view class="u-flex u-row-between  u-col-center" style="flex-wrap: wrap;">
			<view class="item" v-if="item.show==1" @click="jump(item.channel_id,item.select_card_type)" v-for="(item,index) in data" :key="index">
				<view>
					<view class="u-flex u-row-center">
						<u-image @click="jump(item.channel_id)" src="https://lanmao-res.oss-cn-qingdao.aliyuncs.com/static/style/2020-10-09/5f80114a7bfb3.png"
						 width="100rpx" height="100rpx" shape="circle"></u-image>
					</view>
					<view class="u-font-28 u-margin-top-20"><text>{{item.channel_alias}}</text></view>
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
				data: [],
				card_info: {}
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			this.initData();
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
					uri: '/Member/channel_wallet',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
					}
				})
				uni.hideLoading()
				uni.stopPullDownRefresh();
				if (res.data.status == 1) {
					this.data = res.data.body
					for (var i in this.data) {
						this.data[i].channel_alias = this.data[i].channel_alias.substr(this.data[i].channel_alias.indexOf('（'), this.data[
							i].channel_alias.length)
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			jump(id, type) {
				if (type == 0) {
					uni.navigateTo({
						url: 'payBalance?id=' + id
					})
				} else {
					uni.navigateTo({
						url: '../card/cardList?card_type=CC&source=payWallet&channel_id='+id
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

	.item {
		margin: 30rpx;
		width: 310rpx;
		background: #FFF;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 310rpx;
		box-shadow: 1px 5px 26px 0px rgba(198, 198, 198, 0.35);
	}
</style>
