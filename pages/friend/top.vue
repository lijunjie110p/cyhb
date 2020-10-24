<template>
	<view class="main">
		<view class="bg">
			<u-image src="/static/image/friend/phb_bg.png" mode="widthFix"></u-image>
		</view>
		<view class="top">
			<view class="content">
				<u-tabs :is-scroll="false" ref="uTabs" bar-width="100" inactive-color="#999" bar-height="6" bg-color="#FFF" height="100"
				 name="title" duration="0.3" active-color="#FFBA00" :list="tablist" :current="tabsIndex" @change="changeNavbar"></u-tabs>
			</view>
			<view class="list">
				<view @click="details(item.uid)" :class="index==0?'item top1':index==1?'item top2':index==2?'item top3':'item'"
				 v-for="(item,index) in list" :key="index">
					<view class="u-rela">
						<u-avatar :src="item.avatar" size="70"></u-avatar>
						<view :class="index==0?'num top1-num':index==1?'num top2-num':index==2?'num top3-num':'num'">NO.{{index+1}}</view>
					</view>
					<view class="u-flex-1 ">
						<text class="u-margin-left-40 u-font-32">{{item.realname}}</text>
					</view>
					<view>
						<text class="u-font-26" v-if="mode==1">{{item.invite_count}}名用户</text>
						<text class="u-font-26" v-if="mode==2">{{item.team_count}}元</text>

					</view>
				</view>
			</view>
		</view>
		<u-loadmore font-size="30" margin-top="20" :load-text="{loadmore:'点击或上拉加载更多',loading: '努力加载中',nomore:'没有更多了'}"
		 :status="status" @loadmore="onreachBottom" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				mode: 1,
				page: 1,
				tabsIndex: 0,
				tablist: [{
						title: '按用户数',
						icon: '',
					},
					{
						title: '按交易量',
						icon: ''
					}
				],
				list: [],
				noimg: [
					'https://lanmao-res.oss-cn-qingdao.aliyuncs.com/static/style/2020-08-05/5f2a6a52c49e0.png',
					'https://lanmao-res.oss-cn-qingdao.aliyuncs.com/static/style/2020-08-05/5f2a6a7d25e42.png',
					'https://lanmao-res.oss-cn-qingdao.aliyuncs.com/static/style/2020-08-05/5f2a6a8a550a5.png'
				],
				status: 'loadmore'
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
				this.mode = index + 1;
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
					uri: '/User/friend_rank',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						page: this.page,
						sort: this.mode,
					}
				})
				if (res.data.status == 1) {
					this.list = this.list.concat(res.data.body.friend_list);
					if (res.data.body.friend_list.length == 0) {
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
				if (this.userInfo.uid == sid) {
					this.$u.toast('不能选择自己')
					return;
				}
				uni.navigateTo({
					url: 'details?sonid=' + sid
				})
			}
		}
	}
</script>

<style lang="scss">
	.main {
		.bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: -1;
		}

		.top {
			padding-top: 480rpx;

			.content {
				border-radius: 40rpx 40rpx 0 0;
				background: #FFFFFF;
				overflow: hidden;
			}

			.list {
				.item {
					height: 110rpx;
					margin: 30rpx;
					padding: 0 75rpx;
					border-radius: 50rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background: #F2F2F2;
					color: #8A4F14;
				}
				.top1 {
					background: linear-gradient(90deg, #EEB554, #F5CE81);
				}
				.top2 {
					background: linear-gradient(90deg, #94A2A9, #94A2A9, #C6D3D9);
				}
				.top3 {
					background: linear-gradient(90deg, #BC7143, #F4C0A1);
				}
				.num {
					width: 70rpx;
					font-size: 20rpx;
					color: #333;
					text-align: center;
					position: absolute;
					bottom: -10rpx;
					left: 0;
					background: #CCCCCC;
					border-radius: 5rpx;
				}
				.top1-num {
					background: #FFE65C;
				}
				.top2-num {
					background: #C5D1D8;
				}
				.top3-num {
					background: #F3BFA0;
				}
				
			}
		}

	}
</style>
