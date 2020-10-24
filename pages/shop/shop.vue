<template>
	<view class="main">
		<!-- 顶部按钮 -->
		<view class="head">
			<!-- 轮播图 -->
			<view class="banner">
				<u-swiper name="icon" height="250" :autoplay="autoplay" :list="home_data.advs" @click="bannerClick"></u-swiper>
			</view>
			<view style="height: 180rpx;">
				<u-grid :col="5" :border="false">
					<u-grid-item v-for="(item,i) in home_data.top_active" :key="i" @click="openUrl(item.value)">
						<u-image shape="circle" width="70rpx" height="70rpx" @click="openUrl(item.value)" :src="item.icon"></u-image>
						<text class="u-font-13 u-margin-top-15">{{item.title}}</text>
					</u-grid-item>
				</u-grid>
			</view>
			<view class="tabs">
				<view style="width: 650rpx;">
					<u-tabs ref="uTabs" bar-width="100" :show-bar="false" inactive-color="#030400" bar-height="6" bg-color="#FFF"
					 height="60" name="title" duration="0.3" active-color="#FF3E77" :list="tablist" :current="tabsIndex" @change="changeNavbar"></u-tabs>
				</view>
				<view style="width: 100rpx;text-align: center;" class="u-flex-col u-col-center u-row-center">
					<u-icon @click="openTabasAlert" :name="opentbasIcon?'arrow-up':'arrow-down'" color="#030400" size="30"></u-icon>
				</view>
			</view>

		</view>

		<!-- tabs弹出层 -->
		<view class="u-abso tabas-panel-alert" :style="{top:alertTop+'px',maxHeight:scrollerHeight+'px'}" v-if="opentbasIcon">
			<view style="background: #FFFFFF;overflow: hidden;" :animation="alertAnimation">
				<u-grid :col="5" :border="false">
					<u-grid-item v-for="(item,i) in tablist" :key="i" @click="changeNavbar(i)" v-if="i!=0">
						<u-image shape="circle" width="80rpx" height="80rpx" @click="changeNavbar(i)" :src="item.icon"></u-image>
						<text class="u-font-12">{{item.title}}</text>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :height="scrollerHeight" :down="downOption" @down="downCallback"
		 :up="upOption" @up="upCallback">

			<view class="content">
				<view class="u-rela homeshop" v-if="tabsIndex==0">
					<view class="u-padding-20">
						<u-image @click="jump('../mine/qrCode')" src="/static/image/shop/shop_banner.png" width="100%" mode="widthFix"></u-image>
					</view>

					<!-- 活动 -->
					<view class="active">
						<u-grid :col="2">
							<u-grid-item v-for="(item,i) in home_data.index_two_active" :key="i" @click="openUrl(item.value)">
								<u-image border-radius="10" width="100%" mode="widthFix" @click="openUrl(item.value)" :src="item.icon"></u-image>
							</u-grid-item>
						</u-grid>
					</view>

					<!-- 抢购 -->
					<view class="tqg u-margin-top-20">
						<view class="list-title u-flex u-row-between u-col-center">
							<text>淘抢购</text>
							<view class="u-font-26 "><text class="u-margin-right-20 u-type-info">距结束</text> <u-count-down :show-days="false" bg-color="#757575" color="#FFF" :timestamp="home_data.j_end_time"></u-count-down></view>
						</view>
						<u-line length="100%" color="#D9D9D9"></u-line>
						<u-grid :col="5" :border="false" hover-class="none">
							<u-grid-item @click="tqgClick(i,item.q_time_all,item.q_time)" v-for="(item,i) in home_data.tqg_time_data" :key="i">
								<view class="item">
									<view>
										<text :style="tqgIndex==i?{color:'#FF3E77'}:{color:'#333'}" class="u-font-36"><b>{{item.q_time}}</b></text>
									</view>
									<view>
										<text :style="tqgIndex==i?{color:'#FF3E77'}:{color:'#333'}" class="u-font-24">{{item.state_text}}</text>
									</view>
								</view>
							</u-grid-item>
						</u-grid>
					</view>
					<u-gap height="20" bg-color="#F2F2F2"></u-gap>
					<view class="tqg-list">
						<view class="tqg-list-item" v-for="(item,i) in tqgdata" :key="i" @click="tqgJump(item.num_iid,item.click_url)">
							<view>
								<u-image width="190rpx" height="190rpx" :src="item.pic_url"></u-image>
							</view>
							<view class="tqg-list-item-info">
								<view>
									<text class="u-line-2 u-font-28"><b>{{item.title}}</b></text>
								</view>
								<view>
									<text class="price">{{item.zk_final_price}}</text>
								</view>
								<view class="bottom-row">
									<view>
										<text class="s-price">{{item.reserve_price}}</text>
									</view>
									<view>
										<u-button @click="tqgJump(item.num_iid,item.click_url)" :custom-style="tqgBtnStyle" :ripple="true">{{tqgBtnText}}</u-button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<u-gap height="30" bg-color="#F2F2F2"></u-gap>
					<!-- 精选 -->
					<view class="tqg">
						<view class="list-title"><text>精选商品</text></view>
					</view>
					<view class="goodsList">
						<view class="goodsitem" v-for="(item,i) in choiceness" :key="i" @click="lookDetails(item)">
							<view class="pic">
								<u-lazy-load threshold="-100" :image="item.pict_url" :index="i"></u-lazy-load>
							</view>
							<view class="info">
								<view>
									<text class="u-line-2 u-font-28"><b>{{item.title}}</b></text>
								</view>
								<view class="u-flex u-row-between">
									<view>
										<text class="price">￥{{item.coupon_price}}</text>
									</view>
									<view>
										<u-tag shape="circle" bg-color="#FF3E77" color="#FFF" border-color="#FF3E77" size="mini" :text="item.coupon_amount+'元券'" />
									</view>
								</view>
								<view><text class="s-price">￥{{item.zk_final_price}}</text></view>

							</view>
						</view>
					</view>
				</view>
				<view class="panel" v-else>
					<view class="subClass">
						<u-grid :col="5" :border="false" hover-class="none">
							<u-grid-item @click="screenGoods(subTabsIndex,item.value,true,i)" bg-color="#FFF" v-for="(item,i) in tablist[tabsIndex].children"
							 :key="i">
								<u-image @click="screenGoods(subTabsIndex,item.value,true,i)" shape="circle" width="80rpx" height="80rpx" :src="item.icon"></u-image>
								<text class="u-font-12" :style="gridItemIndex==i?{color:'#FF3E77'}:{color:'#333'}">{{item.title}}</text>
							</u-grid-item>
						</u-grid>
					</view>
					<view class="subTabs">
						<u-tabs :is-scroll="false" gutter="570" bar-width="60" inactive-color="#333" bar-height="4" bg-color="#FFF"
						 height="70" name="title" duration="0.3" active-color="#FF3E77" :list="subTabs" :current="subTabsIndex" @change="screenGoods($event,goodsClassId,true)"></u-tabs>
					</view>
					<view class="goodsList">
						<view @click="lookDetails(item)" class="goodsitem" v-for="(item, i) in goodsDetailsData" :key="i">
							<view class="pic">
								<u-lazy-load threshold="-100" :image="item.pict_url" :index="i"></u-lazy-load>
							</view>
							<view class="info">
								<view>
									<text class="u-line-2 u-font-13 u-main-color">{{item.title}}</text>
								</view>
								<view class="u-flex u-row-between">
									<text class=" u-font-32 price">{{item.coupon_price}}</text>
									<text class="u-font-12 u-content-color">销量:{{item.volume}}</text>
								</view>
								<view>
									<text class="u-font-13 u-tips-color lineText">￥{{item.zk_final_price}}</text>
								</view>
								<view>
									<u-tag shape="circle" bg-color="#FF3E77" color="#FFF" border-color="#FF3E77" size="mini" :text="item.coupon_amount+'元券'" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<helang-compress ref="helangCompress"></helang-compress>
		<u-popup v-model="showNotice" mode="center" border-radius="10" :closeable="true">
			<u-image :src="noticeData.img" width="100%" mode="widthFix"></u-image>
		</u-popup>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	const plug = uni.requireNativePlugin('UZK-Alibcsdk');
	const PPFace = uni.requireNativePlugin('PP-BaiduFace');
	// #endif
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import helangCompress from '@/components/helang-compress/helang-compress';		//图片压缩
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import face from "@/util/js/face.js"
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			helangCompress
		},
		data() {
			return {
				user: {},
				tablist: [{
					title: '精选',
					icon: ''
				}],
				subTabs: [{
						title: '综合',
						sort: ''
					},
					{
						title: '销量',
						sort: 'total_sales_des'
					},
					{
						title: '价格',
						sort: 'price_des'
					}
				],
				tabsIndex: 0,
				subTabsIndex: 0,
				gridItemIndex: 0,
				opentbasIcon: false, //tabs弹窗
				page: 1,
				home_data: {
					list: []
				},
				choiceness: [],
				tqgIndex: 2,
				tqgdata: {}, //抢购数据
				tqgBtnText: '立即抢购',
				tqgBtnStyle: {
					background: '#FF3E77',
					color: '#FFF',
					fontSize: '28rpx',
					padding: '0 30rpx',
					border: 'none'
				},
				scrollerHeight: '400px',
				alertAnimation: {},
				alertTop: '', //弹窗距离顶部高度 
				status: 'loadmore', //加载更多
				firstLoad: true, //是否第一次加载
				goodsDetailsData: [],
				adCondition: '', //升序降序
				goodsClassId: '', //商品分类id
				autoplay: true,
				isloading: false,
				triggered: false,
				appkey: '', //百川appid
				alimm_client_id: '', //ali联盟id
				upOption: {
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					page: {
						size: 20 // 每页数据的数量
					},
					empty: {
						tip: '~ 搜索无数据 ~'
					},
					textNoMore: '没有更多了',
					auto: false,
				},
				downOption: {
					auto: false,
				},
				versionData: {},
				isSound: true, //默认是否开启语音提示（仅Android有效）默认值：false
				AutoClip: true, //自动裁剪用户脸部区域 默认：false
				backCamera: false, //启用后置摄像头
				logoSrcs: [],
				showFaceModel: false,
				showIdCardModel: false,
				apk_url: '',
				showNotice: false, //显示公告
				noticeData: {}
			}
		},
		onLoad() {
			this.initData()
			// #ifdef APP-PLUS
			plug.init(result => { 
				console.log(result)
			});
			// #endif
			this.height = uni.getSystemInfoSync().windowHeight + 'px'
			this.getNotice();
		},
		computed: { ...mapState(['forcedLogin', 'hasLogin', 'userInfo', 'isBindTaobao'])
		},
		onNavigationBarSearchInputClicked(e) {
			if (!this.hasLogin) {
				this.isLogin();
				return;
			}
			if (!this.isBindTaobao) {
				this.loginTaobao();
				return;
			}
			this.jump('search?appkey='+this.appkey);
		},
		onNavigationBarButtonTap(e) {
			this.jump('../mine/service');
		},
		onShow() {
			
			// 初始化一个动画
			this.animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'linear',
			})
			let user = uni.getStorageSync('userInfo') || '';
			if (user.uid) {
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.bindTaobao(res.data);
					}
				})
			}
		},
		onReady() {
			let that = this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					let height = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
					let titleH = uni.createSelectorQuery().select(".head"); //想要获取高度的元素名（class/id）
					titleH.boundingClientRect(data => {
						that.scrollerHeight = height - data.height + 'px' //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
						that.alertTop = data.height;
					}).exec()

				}
			})
		},
		methods: {
			...mapMutations(['login']),
			async bindTaobao(provider) { //绑定淘宝账号
				let e = await this.http.request({
					api_source: 'shop',
					uri: '/api/auth/shop_login',
					method: 'POST',
					device: 'web',
					data: {
						uid: provider.uid,
						plat_flag: this.http.plat_flag
					}
				})
				
				if (e.data.status == 1) {
					if (e.data.body.tk_special_id) {
						provider.tk_special_id = e.data.body.tk_special_id;
					}
					this.user = provider;
					this.login(provider)
				} else {
					uni.showToast({
						title: e.data.info,
						icon: "none"
					})
				}
			},
			async getNotice() { //获取公告
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Manage/hs_start_advert',
					method: 'POST',
					device: 'web',
					data: {}
				})
				if (res.data.status == 1) {
					this.noticeData = res.data.body;
					if (this.noticeData.url) {
						this.showNotice = true;
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
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
			async initData() { //初始化数据

				let res = await this.http.request({
					api_source: 'shop',
					uri: '/api/common/dictionaries_test',
					method: 'POST',
					device: 'web',
					data: {
						plat_flag: this.http.plat_flag
					}
				})
				if (res.data.status == 1) {
					this.tablist = this.tablist.concat(res.data.body.goods_cate_data)
					this.appkey = res.data.body.alibaichuan.appKey;
					this.alimm_client_id = res.data.body.alimm_client_id;
					this.getHomeData();
					
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			},
			async getHomeData() { //获取首页数据

				let e = await this.http.request({
					api_source: 'shop',
					uri: '/api/shop_home/index',
					method: 'POST',
					device: 'web',
					data: {
						page: this.page,
						page_size: 20,
						plat_flag: this.http.plat_flag
					}
				}).catch(() => {
					this.mescroll.endErr();
				})
				if (e.data.status == 1) {
					this.mescroll.endSuccess(e.data.body.list.length);
					if (this.page == 1) {
						this.home_data = e.data.body;
						var hour = this.home_data.j_end_time.split(':')[0];
						var min = this.home_data.j_end_time.split(':')[1];
						var sec = this.home_data.j_end_time.split(':')[2];
						this.home_data.j_end_time =  Number(hour * 3600) + Number(min * 60) + Number(sec);
						this.choiceness = [];
						for (var i in this.home_data.tqg_time_data) {
							if (this.home_data.tqg_time_data[i].state == 2) {
								this.startTime = this.home_data.tqg_time_data[i].q_time_all;
							}
						}
						this.getTqgData(this.startTime)
					}
					this.choiceness = this.choiceness.concat(e.data.body.list)
				} else {
					uni.showToast({
						title: e.data.info,
						icon: "none"
					})
				}
			},
			// 筛选商品
			async screenGoods(index, id, isFirst, gridItemIndex) {
				this.subTabsIndex = index;
				this.firstLoad = isFirst;
				this.gridItemIndex = gridItemIndex;
				if (isFirst) {
					this.goodsDetailsData = [];
				}

				let e = await this.http.request({
					api_source: 'shop',
					uri: '/api/shop_home/items',
					method: 'POST',
					device: 'web',
					data: {
						sort: this.subTabs[index].sort,
						page: this.page,
						page_size: 20,
						cat: id,
						plat_flag: this.http.plat_flag
					}
				})
				if (e.data.status == 1) {
					this.mescroll.endSuccess(e.data.body.list.length);
					if (this.page == 1) {
						this.goodsDetailsData = [];
					}
					this.goodsDetailsData = this.goodsDetailsData.concat(e.data.body.list)
				} else {
					uni.showToast({
						title: e.data.info,
						icon: "none"
					})
				}
			},
			async getTqgData(startTime) { //获取抢购数据

				let tqgdata = await this.http.request({
					api_source: 'shop',
					uri: '/api/shop_home/tqg',
					method: 'POST',
					device: 'web',
					data: {
						start_time: startTime,
						plat_flag: this.http.plat_flag
					}
				})
				if (tqgdata.data.status == 1) {
					this.tqgdata = tqgdata.data.body;
					this.mescroll.endSuccess(this.choiceness.length);
				} else {
					uni.showToast({
						title: tqgdata.data.info,
						icon: "none"
					})
				}
			},
			openTabasAlert() { //打开分类下拉弹窗
				this.opentbasIcon = !this.opentbasIcon
				if (this.opentbasIcon) {
					this.animation.height("auto").step()
				} else {
					this.animation.height(0).step()
				}
				this.alertAnimation = this.animation.export()
			},
			//切换分类
			changeNavbar(index) {
				this.tabsIndex = index;
				this.opentbasIcon = false;
				if (this.tabsIndex > 0) {
					this.goodsClassId = this.tablist[this.tabsIndex].children[0].value
				}
				this.mescroll.resetUpScroll();
				this.mescroll.scrollTo(0)
			},
			bannerClick(index) { //banner点击
				let url = this.home_data.advs[index].url
				this.openUrl(url);
			},
			//授权登录
			async loginTaobao() {
				let that = this;
				
				await plug.login(async result => {
					
					if (result.status) {
						await plug.qdByhide({
							url: `https://oauth.m.taobao.com/authorize?response_type=code&client_id=${this.alimm_client_id}&view=wap&custom=123&state=${this.userInfo.uid}_cyhb&redirect_uri=http://otshop.sspuzi.com/test/tb_login_callback`,
						}, async res => {
							
							let tbsq = await that.http.request({
								api_source: 'shop',
								uri: '/test/tb_login_callback_test',
								method: 'POST',
								device: 'web',
								data: {
									code: res.data.code,
									state: res.data.state
								}
							})
							console.log(tbsq)
							if (tbsq.data.status == 1) {
								that.bindTaobao(that.user);
							} else {
								uni.showToast({
									title: tbsq.data.info,
									icon: "none"
								})
							}
						})
					}else{
						that.$u.toast(result.msg)
					}
				});
			},
			//查看商品详情
			lookDetails(item) {
				if (!this.hasLogin) {
					this.isLogin();
					return;
				}
				if (!this.isBindTaobao) {
					this.loginTaobao();
					return;
				}
				if (item.coupon_amount == 0) {
					this.openUrl(item.url)
				} else {
					uni.setStorageSync('item', JSON.stringify(item))
					uni.navigateTo({
						url: 'shopDetails?tqg=0&id=' + item.item_id + '&nick=' + item.nick + '&appkey=' + this.appkey
					})
				}
			},
			//打开外部链接
			openUrl(url) {
				if (!this.hasLogin) {
					this.isLogin();
					return;
				}
				
				if (!this.isBindTaobao) {
					this.loginTaobao();
					return;
				}
				url = 'https:' + url;
				plug.openurl({
					url,
					linkkey: 'taobao',
					appkey: this.appkey,
					nativeFailedMode: 'download'
				}, result => {})
			},
			/*下拉刷新的回调 */
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				this.page = page.num;
				if (this.tabsIndex == 0) {
					this.getHomeData();
				} else {
					this.screenGoods(this.subTabsIndex, this.goodsClassId, false);
				}
			},

			tqgJump(id, url) { //抢购跳转
				if (!this.hasLogin) {
					this.isLogin();
					return;
				}
				if (!this.isBindTaobao) {
					this.loginTaobao();
					return;
				}
				if (this.tqgIndex == 2) {
					uni.navigateTo({
						url: 'shopDetails?tqg=1&id=' + id + '&url=' + encodeURIComponent(url) + '&appkey=' + this.appkey
					})
				} else if (this.tqgIndex < 2) {
					uni.showToast({
						title: '已过抢购时间',
						position: 'center',
						icon: 'none'
					})
				} else if (this.tqgIndex > 2) {
					uni.showToast({
						title: '未到抢购时间',
						position: 'center',
						icon: 'none'
					})
				}
			},
			tqgClick(index, startTime) { //抢购标题切换
				this.tqgIndex = index;
				if (this.tqgIndex < 2) {
					this.tqgBtnText = "已抢光"
					this.tqgBtnStyle.background = '#999'
				} else if (this.tqgIndex == 2) {
					this.tqgBtnText = "立即抢购"
					this.tqgBtnStyle.background = '#FF3E77'
				} else if (this.tqgIndex > 2) {
					this.tqgBtnText = this.home_data.tqg_time_data[index].q_time + "开抢"
					this.tqgBtnStyle.background = '#FF0000'
				}
				this.getTqgData(startTime)
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
				uni.navigateTo({
					url: url
				})
			},


		}
	}
</script>

<style lang="scss">
	uni-swiper,
	swiper {
		height: 100%;
		width: 750rpx;
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.tabs {
		background: #FFF;
		display: flex;
		justify-content: space-between;
		padding-bottom: 10rpx;
		height: 80rpx;
	}

	swiper-item {
		overflow: visible !important;
	}

	.tabs .u-tabs .u-tab-item,
	.tabs .u-tabs {
		height: 80rpx;
		line-height: 80rpx;
	}

	.tabas-panel-alert {
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba($color: #000000, $alpha: 0.5);
		z-index: 999;
		overflow: scroll;
		-webkit-overflow-scrolling: auto;
	}

	.topbtn {
		background: linear-gradient(to right, #FFCF00, #FFBA00);

		.u-image {
			background-color: transparent;
		}

		.u-grid-item {
			background-color: transparent;
		}
	}

	.content {
		width: 750rpx;
	}

	.banner {
		padding: 30rpx 20rpx 0 20rpx;
		position: relative;
	}

	.banner:before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		border-radius: 0 0 20% 20%;
		background: #ED0442;
		height: 180rpx;
		top: 0;
		z-index: -2;
	}



	.active {
		margin: 20rpx 30rpx 0 20rpx;
		overflow: hidden;
		background: #D9D9D9;
	}

	.tqg {
		background: #FFF;

		.item {
			width: 100%;
			border-radius: 10px;
			text-align: center;
		}
	}

	.list-title {
		font-size: 36rpx;
		font-weight: bold;
		padding: 20rpx;
	}

	.tqg-list {
		padding: $padding-base;
		background: #FFF;
	}

	.tqg-list-item {
		display: flex;
		align-items: center;
		border-radius: 5rpx;
		padding: 25rpx;
		background: #FFFFFF;

		.tqg-list-item-info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			height: 260rpx;
			margin-left: 20rpx;
			flex: 1;

			.price {
				font-size: 42rpx;
				color: #FF3E77;
				font-weight: bold;
			}

			.price::before {
				content: "￥";
				font-size: 28rpx;
				color: #FF3E77;
			}

			.price:after {
				content: '折后';
				font-size: 24rpx;
				color: #FF3E77;
			}

			.s-price {
				color: #999;
				font-size: 28rpx;
				text-decoration: line-through;
			}

			.s-price:before {
				content: "原价￥";
				color: #999;
				font-size: 28rpx;
			}

			.bottom-row {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				width: 100%;

				button:after {
					border: none;
				}
			}
		}
	}

	.tqg-list-item:not(:first-child) {
		border-top: 1px solid #F2F2F2;
	}

	.subClass {
		width: 100%;
		background: #FFFFFF;

	}

	.subTabs {
		margin-top: 20rpx;
		background: #FFFFFF;
		position: sticky;
		z-index: 99;
		top: 0;
	}

	.panel {
		background: #F2F2F2;
	}

	.goodsList {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		background: #F2F2F2;

		.goodsitem {
			background: #FFF;
			margin: 20rpx;
			border-radius: 5px;
			overflow: hidden;
			width: 335rpx;

			.pic {
				height: 335rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: auto;
					will-change: transform;
				}
			}


			.info {
				padding: 20rpx;

				.price {
					font-size: 28rpx;
					font-weight: 500;
					color: #FF3E77;
				}

				.price:after {
					content: '券后';
					font-size: 24rpx;
					color: #FF3E77;
					margin-left: 2px;
				}

				.s-price {
					color: #999;
					font-size: 24rpx;
					text-decoration: line-through;
				}

				.lineText {
					text-decoration: line-through;
				}
			}
		}
	}
</style>
