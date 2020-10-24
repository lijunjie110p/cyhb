<template>
	<view class="main">
		<view>
			<u-image src="/static/image/index/guide.png" width="100%" mode="widthFix"></u-image>
		</view>
		<view class="list" v-for="(item,index) in videoList" :key="index">
			<view class="title"><text>{{item.ptitle}}</text></view>
			<view class="u-margin-top-30 u-rela video">
				<u-icon @click="jump(item.url)"  class="play" name="play-circle" color="white" size="100"></u-icon>
				<view @click="jump(item.url)"  class="mask"></view>
				<u-image  border-radius="10" :src="item.pimg" width="100%" height="315rpx" mode="widthFix"></u-image>
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
				videoList: {},
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			this.initData()
		},
		methods: {
			async initData() {
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Message/newhand_show',
					method: 'POST',
					device: 'web',
					data: {}
				})
				if (res.data.status == 1) {
					this.videoList = res.data.body.vlist
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			},
			jump(url){
				uni.navigateTo({
					url:'../public/webView?url='+encodeURIComponent(url)
				})
			}
		}
	}
</script>

<style lang="scss">
	.list {
		box-shadow: 0px 5px 26px 0px rgba(198, 198, 198, 0.35);
		margin: 30rpx;
		padding: 30rpx;
		border-radius: 10rpx;
		.title{
			font-size: 28rpx;
			color: #333;
		}
		.video{
			overflow: hidden;
			.mask{
				background: rgba($color: #000000, $alpha: 0.5);
				position: absolute;
				z-index: 98;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				border-radius: 10rpx;
			}
			.play{
				position: absolute;
				left: 265rpx;
				top: 40%;
				z-index: 99;
			}
		}
		
	}
</style>
