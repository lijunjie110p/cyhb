<template>
	<view class="main">
		<view class="tabs">
			<u-tabs :is-scroll="false" ref="uTabs" bar-width="80" inactive-color="#999" bar-height="6" bg-color="#FFF" height="90"
			 name="name" duration="0.3" active-color="#0077FF" :list="tablist" :current="tabsIndex" @change="changeNavbar"></u-tabs>
		</view>
		<view class="u-flex u-padding-30 msglist u-row-between u-col-center" @click="jump(item.url)" v-for="(item,index) in msgList" :key="index">
			<view>
				<u-image :src="item.wimg" width="90rpx" shape="circle" height="90rpx"></u-image>
			</view>
			<view class="u-flex-1">
				<view class="u-margin-left-30 u-flex u-row-between u-col-center">
					<view class="u-font-28 u-main-color"><text>{{item.mtitle}}</text></view>
					<view class="u-font-28 u-type-info u-text-right"><text>{{item.naddtime_text}}</text></view>

				</view>
				<view class="u-margin-left-30 u-flex u-row-between u-col-center">
					<view class="u-font-24 u-content-color u-margin-top-20 u-line-1" style="width: 400rpx;"><text>{{item.ncontent}}</text></view>
					<view class="u-margin-top-20 ">
						<text class="red-point" v-if="item.read==0"></text>
						<text v-else> </text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: { ...mapState(['forcedLogin', 'hasLogin', 'userInfo', 'isBindTaobao'])
		},
		data() {
			return {
				tablist: [{
						name: '系统公告'
					},
					{
						name: '消息'
					}
				],
				tabsIndex: 0,
				msgList: [],
				msgType: 1
			};
		},
		onLoad() {
			this.initData();
		},
		onNavigationBarButtonTap() {
			this.allready();
		},
		onPullDownRefresh() {
			this.initData();
		},
		methods: {
			async initData() {
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Message/message',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						type: this.msgType
					}
				})
				uni.hideLoading()
				uni.stopPullDownRefresh();
				if (res.data.status == 1) {
					this.msgList = res.data.body
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			changeNavbar(index) {
				this.msgList = [],
					this.tabsIndex = index;
				switch (index) {
					case 0:
						this.msgType = 1
						break;
					case 1:
						this.msgType = 2
						break;
					default:
						break;
				}
				this.initData()
			},
			async allready() {
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Message/all_read',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
					}
				})
				if (res.data.status == 1) {
					this.$u.toast('全部已读')
					this.initData()
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			},
			jump(url){
				uni.navigateTo({
					url:'webView?url='+encodeURIComponent(url)
				})
			}
		}
	}
</script>

<style lang="scss">
	.tabs {
		position: sticky;
		top: 0;
		z-index: 99;
	}

	.msglist {
		border-bottom: 1px solid #E8E8E8;
	}

	.red-point {
		border-radius: 50rpx;
		width: 15rpx;
		height: 15rpx;
		background: red;
		float: right;
	}
</style>
