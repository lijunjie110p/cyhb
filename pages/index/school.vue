<template>
	<view class="main">
		<view class="head">
			<u-tabs :is-scroll="false" ref="uTabs" bar-width="80" inactive-color="#999" bar-height="6" bg-color="#FFF" height="90"
			 name="ftitle" duration="0.3" active-color="#0077FF" :list="typeList" :current="tabsIndex" @change="changeNavbar"></u-tabs>
		</view>
		<mescroll-body :height="scrollerHeight" ref="mescrollRef" @init="mescrollInit" :up="upOption" @down="downCallback"
		 :down="downOption" @up="upCallback">
			<view>
				<view @click="jump(item.url)" :class="index<3?'top':'item'" v-for="(item,index) in dataList" :key="index">
					<view class="top-icon" v-if="index<3">
						<u-image :src="index==0?'/static/image/index/top1.png':index==1?'/static/image/index/top2.png':index==2?'/static/image/index/top3.png':'/static/image/index/top1.png'" width="60rpx" mode="widthFix" ></u-image>
					</view>
					<view class="top-item">
						<view><text class="u-font-28 font-blod u-main-color u-line-2">{{item.etitle}}</text></view>
						<view><text class="u-font-22 u-margin-top-20 u-type-info">{{$u.timeFormat(item.etime,'mm月dd日 MM:ss')}}</text></view>
					</view>
					<view >
						<u-image  width="250rpx" :border-radius="index<3?'0 20rpx 20rpx 0':'0'" height="180rpx" :src="item.eimgurl"></u-image>
					</view>
				</view>
				
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				tabsIndex: 0,
				isTop: true,
				page: 1,
				dataList: [],
				typeList: [],
				scrollerHeight: '', //滚动高度
				upOption: {
					page: {
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 3, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '已经没有了'
					},
					textNoMore: '已经没有了',
					auto: false,
				},
				downOption: {
					auto: false
				},
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {

			this.initData()
		},
		onReady() {
			let that = this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					let height = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
					let titleH = uni.createSelectorQuery().select(".head"); //想要获取高度的元素名（class/id）
					titleH.boundingClientRect(data => {
						that.scrollerHeight = height - data.height + 'px' //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
					}).exec()
				}
			})
		},
		methods: {

			async initData() {
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Find/lay_college_list',
					method: 'POST',
					device: 'web',
					data: {}
				})

				if (res.data.status == 1) {
					this.typeList = res.data.body
					this.getData(0);
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			async getData(index) {
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Find/article_list',
					method: 'POST',
					device: 'web',
					data: {
						fid: this.typeList[index].fid,
						page: this.page
					}
				})
				if (res.data.status == 1) {
					this.dataList = res.data.body
					if (this.isTop) {
						this.mescroll.resetUpScroll();
					} else {
						this.mescroll.endSuccess(this.dataList.length, true);
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.hideLoading()
			},
			changeNavbar(index) {
				this.dataList = [],
					this.tabsIndex = index;
				this.getData(index)

			},
			//下拉刷新
			downCallback() {
				this.isTop = true;
				this.dataList = []
				this.getData(this.tabsIndex);

			},
			//上拉加载
			upCallback(page) {
				this.isTop = false;
				this.page = page.num;
				this.getData(this.tabsIndex);
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
	.head{
		position: sticky;
		top: 0;
		z-index: 999;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #FFF;
		border-radius: 20rpx;
		margin: 30rpx;
		box-shadow: 0px 5px 26px 0px rgba(198, 198, 198, 0.35);
		position: relative;
		.top-icon{
			position: absolute;
			width: 60rpx;
			left: 30rpx;
			top: -15rpx;
			
		}
		.top-item{
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			flex-direction: column;
			width:440rpx;
		}
		
	}
	.item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-top: 1px solid #e8e8e8;
	}
	.item:first-child{
		margin-top: 60rpx;
	}
	.item:last-child{
		border-bottom:  1px solid #e8e8e8;
	}
</style>
