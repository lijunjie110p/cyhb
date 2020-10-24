<template>
	<view class="main">
		<view class="head">
			<view class="grid u-flex u-row-between u-col-center">
				<view class="u-text-center u-flex-1">
					<view><text class="white-color u-font-28">已邀请好友</text></view>
					<view><text class="font-blod num">{{data.direct||0}}</text></view>

				</view>
				<view class="line"></view>
				<view class="u-text-center u-flex-1">
					<view><text class="white-color u-font-28">已认证好友</text></view>
					<view><text class="font-blod num">{{data.indirect||0}}</text></view>
				</view>
			</view>
		</view>
		<view class="tabs">
			<u-tabs :is-scroll="false" ref="uTabs" :bar-style="barStyle" :active-item-style="{fontSize:'32rpx'}" bar-width="20"
			 inactive-color="rgba(255, 255, 255, 0.77)" bar-height="6" bg-color="#0077FF" height="130" name="group_name"
			 duration="0.3" active-color="#FFF" :list="tablist" :current="tabsIndex" @change="changeNavbar"></u-tabs>
		</view>
		<view class="list">
			<u-cell-group :border="false">
				<u-cell-item @click="details(item.uid)" :center="true" :key="index" :arrow="false" :title-style="{marginLeft:'20rpx',fontSize:'32rpx'}"
				 :title="item.realname" :label="item.group_name" v-for="(item,index) in list">
					<u-avatar :src="item.avatar" size="120" slot="icon"></u-avatar>
					<view slot="right-icon"><text class="u-font-32">已邀请{{item.sort_count||0}}人</text></view>
				</u-cell-item>
			</u-cell-group>
			<u-loadmore font-size="30" margin-top="20" :load-text="{loadmore:'点击或上拉加载更多',loading: '努力加载中',nomore:'没有更多了'}"
			 :status="status" @loadmore="onreachBottom" />
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
				status: 'loadmore',
				page: 1,
				tabsIndex: 0,
				tablist: [{
					group_id: '1'
				}],
				list: [],
				data: '',
				barStyle: {
					width: 0,
					height: 0,
					border: '20rpx solid',
					borderColor: '#0077FF #0077FF white',
					bottom:'-42rpx',
				}
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			this.initData()
		},
		onPullDownRefresh() {
			this.list = [];
			this.page = 1;
			this.initData()
		},
		onReachBottom() {
			if (this.status == 'loadmore') {
				this.onreachBottom()
			}
		},
		methods: {
			changeNavbar(index) {
				this.tabsIndex = index;
				this.page = 1;
				this.list = [];
				this.initData();
			},
			onreachBottom() {
				this.page++
				this.initData();
			},
			async initData() {
				this.status = 'loading'
				
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Activity/partner_invite',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						page: this.page,
						group_id: this.tablist[this.tabsIndex].group_id
					}
				})
				if (res.data.status == 1) {
					this.data = res.data.body;
					this.list = this.list.concat(res.data.body.list) || [];
					this.tablist = res.data.body.group_list;
					if (res.data.body.list.length == 0) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.stopPullDownRefresh()
			},
			details(sid) {
				uni.navigateTo({
					url: 'details?sonid=' + sid
				})
			}
		}
	}
</script>

<style lang="scss">
	.head {
		background: #3285FF;
		height: 200rpx;
		position: relative;

		.grid {
			border-radius: 20rpx;
			overflow: hidden;
			height: 150rpx;
			color: #FFF;

			.num {
				font-size: 56rpx;
			}

			.line {
				height: 80rpx;
				width: 1rpx;
				background: #F2F2F2;
			}
		}
	}

	.tabs {
		background: $ez-theme-bg;
		padding: 0 30rpx;
	}

	.list {
		padding: 0 30rpx;
	}
</style>
