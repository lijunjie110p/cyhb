<template>
	<view class="main">
		<view class="head" :style="{backgroundImage:'url('+home_data.adv_top.param_img+')'}">
			<view class="user">
				<view  class="u-flex u-col-center">
					<u-avatar @click="jump('mine')"  size="62" :src="userInfo.avatar||'/static/image/index/nologin.png'"></u-avatar>
					<text class="u-margin-left-20 u-font-28 white-color">{{userInfo.uid?userInfo.is_auditing=='2'?userInfo.realname:'未认证':'未登录'}}</text>
				</view>
				<view @click="jump('../mine/service')">
					<u-image @click="jump('../mine/service')" src="/static/image/index/service.png" width="36rpx" mode="widthFix"></u-image>
				</view>
			</view>
			<view class="notice" v-if="noticeList.length>0">
				<u-notice-bar :no-list-hidden="true" color="#FD900b" @click="jump('../public/webView?url='+noticeListData[0].url)" type="none" :list="noticeList"></u-notice-bar>
			</view>
		</view> 
		<view :class="noticeList.length==0?'':'u-margin-top-60'">
			<u-grid :col="4" :border="false">
				<u-grid-item v-for="(item,i) in home_data.model_list_first" :key="i" @click="jump(item.param_url)">
					<u-image shape="circle" width="70rpx" height="70rpx" @click="jump(item.param_url)" :src="item.param_img"></u-image>
					<text class="u-font-13 u-margin-top-15">{{item.param_name}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="u-margin-left-30 u-margin-right-30">
			<u-image @click="jump('../business/applyCard')" :src="home_data.adv_middle.param_img" width="100%" mode="widthFix"></u-image>
		</view>
		<view class="title"><text>分润统计</text></view>
		<view class="total u-flex u-row-between u-col-center" @click="jump('../wallet/wallet')">
			<view class="u-flex-1">
				<view class="u-font-40 font-blod">{{home_data.all_income}}</view>
				<view class="u-font-24 u-type-info u-margin-top-10">总收益</view>
			</view>
			<view class="u-flex-1">
				<view class="u-font-40 font-blod">{{home_data.before_income}}</view>
				<view class="u-font-24 u-type-info u-margin-top-10">昨日收益</view>
			</view>
			<view class="u-flex-1">
				<view class="u-font-40 font-blod">{{home_data.today_income}}</view>
				<view class="u-font-24 u-type-info u-margin-top-10">今日收益</view>
			</view>
		</view>
		<view class="title"><text>精彩生活</text></view>
		<view class="u-flex u-row-between u-margin-left-30 u-margin-right-30 u-flex-wrap">
			<view class="u-flex-1 u-margin-bottom-20" v-for="(item,index) in home_data.model_list_two" :key="index">
				<u-image  @click="jump(item.param_id=='56'?'guide':'../mine/qrCode')" :src="item.param_img" width="335rpx" height="155rpx"></u-image>
			</view>
		</view>
		<view class="title u-flex u-col-bottom u-row-between" >
			<text >商学院</text>
			<text class="u-type-info u-font-28" @click="jump('school')">更多</text>
		</view>
		<view class="u-margin-left-30 u-margin-right-30">
			<u-image @click="jump('school')" :src="home_data.adv_bottom.param_img" width="100%" mode="widthFix"></u-image>
		</view>
		<u-divider margin-top="30" color="#E2E6ED">投资有风险 入市需谨慎</u-divider>
		<u-gap height="20"></u-gap>
		<u-popup border-radius="20" v-model="showNotice" mode="center" close-icon-color="#FFF"  :closeable="true">
			<view>
				<u-image :src="noticeData.param_img" @click="lookNotice" width="560rpx" height="730rpx" ></u-image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				noticeList: [],
				noticeListData:{},
				home_data: {
					adv_top: {
						param_img: ''
					},
					adv_middle: {
						param_img: ''
					},
					adv_bottom: {
						param_img: ''
					}
				},
				showNotice:false,	//显示公告
				noticeData:{}
			}
		},
		computed: { ...mapState(['forcedLogin', 'hasLogin', 'userInfo', 'isBindTaobao'])
		},
		onLoad() {
			this.getNotice();
			this.initData();
		},
		onShow(){
			this.initData();
		},
		onPullDownRefresh() {
			this.initData();
		},
		methods: {
			async getNotice(){	//获取公告
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Manage/update_app',
					method: 'POST',
					device: 'web',
					data: {
						type_app: 2
					}
				})
				if (res.data.status == 1) {
					this.noticeData = res.data.body.activity;
					if(this.noticeData.param_state == '1'){
						this.showNotice = true;
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			lookNotice(){
				uni.navigateTo({
					url:'../public/webView?url='+encodeURIComponent(this.noticeData.param_url)
				})
			},
			async getNoticeMarqueen(){	//获取公告
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Home/notice',
					method: 'POST',
					device: 'web',
					data: {}
				})
				if (res.data.status == 1) {
					
					this.noticeListData = res.data.body.notice_list;
					if(this.noticeListData){
						this.noticeList = [res.data.body.notice_list[0].etitle]
					}
					console.log(this.noticeList)
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			async initData() { //初始化数据

				let res = await this.http.request({
					api_source: 'app',
					uri: '/Home/cyhb_index',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid
					}
				}) 
				uni.stopPullDownRefresh()
				if (res.data.status == 1) {
					this.home_data = res.data.body
					for(let i in this.home_data.model_list_first){
						if(this.home_data.model_list_first[i].param_id == '22'){
							this.home_data.model_list_first[i].param_url = '../card/card'
						}else if(this.home_data.model_list_first[i].param_id == '60'){
							this.home_data.model_list_first[i].param_url = '../card/cardList?card_type=CC&source=gathering'
						}else if(this.home_data.model_list_first[i].param_id == '96'){
							this.home_data.model_list_first[i].param_url = '../gathering/gathering?source=huabei'
						}else if(this.home_data.model_list_first[i].param_id == '29'){
							this.home_data.model_list_first[i].param_url = '../public/webView?url='+encodeURIComponent(this.home_data.model_list_first[i].param_url)
						}else if(this.home_data.model_list_first[i].param_id == '80'){
							this.home_data.model_list_first[i].param_url = '../public/webView?url='+encodeURIComponent(this.home_data.model_list_first[i].param_url)
						}
					}
					// #ifdef APP-PLUS
					this.update();
					// #endif
					this.getNoticeMarqueen();
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			},
			async update() { //更新版本
				let that = this;
				await plus.runtime.getProperty(plus.runtime.appid, async function(inf) {
					var ver = inf.version,
						type = '';
					if (uni.getSystemInfoSync().platform == 'ios') {
						type = 1;
					} else {
						type = 2
					}
					let res = await that.http.request({
						api_source: 'app',
						uri: '/Manage/update_app',
						method: 'POST',
						device: 'web',
						data: {
							type_app: type
						}
					})
					if (res.data.status == 1) {
						that.versionData = res.data.body
						if (ver != that.versionData.version) {
							uni.navigateTo({
								url: '../public/fullScreen'
							})
						}
					} else {
						uni.showToast({
							title: res.data.info,
							icon: "none"
						})
					}
				})
			},
			isLogin() { //是否登录
				if (!this.hasLogin) {
					uni.showModal({
						title: '未登录',
						content: '您未登录，需要登录后才能继续',
						/**
						 * 如果需要强制登录，不显示取消按钮
						 */
						showCancel: true,
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '../public/login'
								});
							}
						}
					});
				}
			},
			jump(url) { //路由跳转
				let _self = this;
				if (!this.hasLogin) {
					this.isLogin();
					return;
				}
				if (this.userInfo.is_auditing != '2') {
					uni.navigateTo({
						url: '../public/security'
					});
					return;
				}
				switch (url) {
					case 'mine':
						uni.switchTab({
							url: '../mine/mine'
						})
						break;
					default:
						uni.navigateTo({
							url: url
						})
						break;
				}
			},
		}
	}
</script>

<style lang="scss">
	.head {
		background-size: 100%;
		background-repeat: no-repeat;
		background-color: #F6003c;
		height: 490rpx;
		position: relative;
	}

	.user {
		padding: 70rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.notice {
		border-radius: 50rpx;
		box-shadow: 0px 2px 14px 0px rgba(51, 125, 247, 0.17);
		position: absolute;
		bottom: -35rpx;
		height: 70rpx;
		left: 30rpx;
		right: 30rpx;
		background: #FFF;
	}

	.title {
		margin: 40rpx 30rpx 30rpx 30rpx;
		color: #333;
		font-size: 36rpx;
		font-weight: bold;
	}

	.total {
		margin: 0 30rpx;
		border-radius: 10rpx;
		border: 1px solid #D9D9D9;
		height: 150rpx;
		text-align: center;
	}
</style>
