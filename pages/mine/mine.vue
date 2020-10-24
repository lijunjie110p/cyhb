<template>
	<view class="main">
		<view class="head">
			<view class="user">
				<u-avatar @click="updateAvatar" :src="user.avatar" size="72"></u-avatar>
				<view class="u-flex-1 u-margin-left-30" @click="toLogin">
					<view class="u-flex u-row-between">
						<view class="name"><text  v-if="hasLogin" class="status">{{status}}</text></view>
						<view class="u-flex u-row-between">
							<u-image  @click="jump('qrCode')" width="35rpx" height="35rpx" src="/static/image/mine/code.png"></u-image>
							<u-image @click="jump('../public/message')" class="u-margin-left-45" width="35rpx" height="35rpx" src="/static/image/mine/info.png"></u-image>
						</view>
					</view>
				</view>
			</view>
			<view class="u-margin-top-40">
				<view class="u-flex u-row-between u-col-center" >
					<view class="white-color u-flex-1"><text class="u-margin-right-20">总资产(元)</text>
						<u-icon @click="showPrice=!showPrice" :name="showPrice?'eye':'eye-off'" color="#FFF" size="30"></u-icon>
					</view>
					<view class="u-flex-1 u-text-right" @click="jump('../wallet/wallet')">
						<u-icon name="arrow-right" color="#FFF" size="30"></u-icon>
					</view>
				</view>
				<view><text class="total-price">{{showPrice?data.all_income||0.00:'***'}}</text></view>
				<view class="u-flex u-row-between white-color u-col-center">
					<view class="u-flex-1 u-text-left">
						<text class="u-font-22 u-margin-right-20">昨日收入(元)</text>
						<text class="u-font-38 font-blod">{{data.before_income||0.00}}</text>
					</view>
					<view class="u-flex-1 u-text-left">
						<text class="u-font-22 u-margin-right-20">今日收入(元)</text>
						<text class="u-font-38 font-blod">{{data.today_income||0.00}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="group">
			<view class="money u-padding-30 white-bg u-flex u-row-between u-col-center">
				<view>
					<view class="u-font-28 u-type-info">可用余额(元)</view>
					<view class="u-margin-left-20 font-blod u-font-32">￥{{walletData.amount||0.00}}</view>
				</view>
				<view>
					<u-button @click="jump('../wallet/withdraw')" :custom-style="{fontSize:'28rpx',padding:'0 30rpx',color:'#FF763A'}" size="mini">提现</u-button>
					<u-button @click="jump('../wallet/recharge')" :hair-line="false" :custom-style="czStyle" size="mini">充值</u-button>
				</view>
			</view>
			<view class="card">
				<u-grid :col="4" :border="false">
					<u-grid-item @click="jump(item.jumpurl)" v-for="(item,i) in service_model" :key="i">
						<u-image @click="jump(item.jumpurl)"  width="60rpx"  mode="widthFix" :src="item.param_img"></u-image>
						<text class="u-font-28 u-margin-top-15">{{item.param_name}}</text>
					</u-grid-item>
				</u-grid>
			</view>
			<view>
				<u-cell-group>
					<u-cell-item :title-style="{fontSize:'30rpx',color:'#333'}" @click="jump(item.jumpurl)" v-for="(item,i) in list_model"
					 :key="i" :title="item.param_name"></u-cell-item>
				</u-cell-group>
			</view>
			<view class="servier-mobile" @click="tel">
				<u-icon name="kefu-ermai" color="#999" size="24"></u-icon><text class="u-margin-left-10">客服电话热线 {{data.service_phone}}</text>
			</view>
			<view class="u-font-20 u-text-center u-type-info"><text>{{data.service_time}}</text></view>
			<u-gap height="20" ></u-gap>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import face from "@/util/js/face.js"
	export default {
		data() {
			return {
				data: '',
				user: {
					avatar: '/static/image/index/nologin.png'
				},
				list_model: {},
				noticeList: [],
				status: "未实名认证",
				message: [],
				service_model: {},
				interval: '',
				maxtime: 300, //倒计时300秒
				needRz: true,
				showPrice: true,
				walletData: {},
				czStyle: {
					padding: '0 30rpx',
					border: 'none',
					color: '#FFF',
					marginLeft: '40rpx',
					fontSize: '28rpx',
					background: '#FF763A'
				},
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'checkedSecurity', 'pushCid'])
		},
		onLoad() {
			this.message.date = this.$u.timeFormat(new Date(), 'mm-dd');
			this.needRz = this.checkedSecurity;
			this.initData();
			if (this.hasLogin) {
				this.bind_alias();
			}

		},
		onShow() {
			this.needRz = this.checkedSecurity;
			this.initData();
		},
		onPullDownRefresh() {
			this.initData();
		},
		
		methods: {
			...mapMutations(['login']),
			async bind_alias() {
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Member/unipush_bind_alias',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						cliend_id: this.pushCid
					}
				})
				if (res.data.status == 1) {
					console.log('绑定别名')
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			noticeClick(index) {
				uni.navigateTo({
					url: '../public/webView?url=' + encodeURIComponent(this.message[index].url)
				})
				if (plus.os.name.toLowerCase() == 'ios') {
					//导入ios UIApplication  
					var UIApplication = plus.ios.import("UIApplication");
					var app = UIApplication.sharedApplication();
					//获取应用图标的数量  
					// var oldNum = app.applicationIconBadgeNumber();  
					// var newNum = oldNum - 1;  
					//设置应用图标的数量  
					plus.runtime.setBadgeNumber(0);
					//导入个推原生类  
					var GeTuiSdk = plus.ios.importClass('GeTuiSdk');
					GeTuiSdk.setBadge(0);
				}
			},
			async getWallet() {
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Member/wallet',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid
					}
				})
				if (res.data.status == 1) {
					this.walletData = res.data.body
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			async initData() {

				let res = await this.http.request({
					api_source: 'app',
					uri: '/Member/myinfo',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
					}
				})
				if (res.data.status == 1) {
					this.data = res.data.body;
					this.user = res.data.body.userinfo || {}
					if(this.user.uid){
						this.login(this.user)
					}else{
						this.user.avatar='/static/image/index/nologin.png'
					}
					if (res.data.body.userinfo) {
						if (this.user.is_auditing == "2") {
							this.status = "已实名认证"
						} else {
							this.status = '未实名认证'
						}
					}
					this.list_model = res.data.body.list_model
					this.service_model = res.data.body.service_model
					for (let i in this.list_model) {
						if (this.list_model[i].param_id == 89) {
							this.list_model[i].jumpurl = '../public/webView?url=' + encodeURIComponent(this.list_model[i].param_url) +
								'&source=' + '../mine/mine';
						} else if (this.list_model[i].param_id == 90) {
							this.list_model[i].jumpurl = '../card/cardList?card_type=CC&source=channel'
						} else if (this.list_model[i].param_id == 91) {
							this.list_model[i].jumpurl = '../wallet/wallet'
						} else if (this.list_model[i].param_id == 92) {
							this.list_model[i].jumpurl = "../wallet/bill?source=profit"
						} else if (this.list_model[i].param_id == 93) {
							this.list_model[i].jumpurl = '../friend/friend'
						} else if (this.list_model[i].param_id == 99) {
							this.list_model[i].jumpurl = '../mine/service'
						} else if (this.list_model[i].param_id == 100) {
							this.list_model[i].jumpurl = '../setting/setting'
						} else if (this.list_model[i].param_id == 101) {
							this.list_model[i].jumpurl = '../setting/account'
						} else if (this.list_model[i].param_id == 115) {
							this.list_model[i].jumpurl = 'videoList'
						} else if (this.list_model[i].param_id == 117) {
							this.list_model[i].jumpurl = '../card/card'
						} else if (this.list_model[i].param_id == 118) {
							this.list_model[i].jumpurl = '../business/applyCard'
						} else if (this.list_model[i].param_id == 119) {
							this.list_model[i].jumpurl = '../gathering/record'
						}else if (this.list_model[i].param_id == 81) {
							this.list_model[i].jumpurl = 'service'
						}else if (this.list_model[i].param_id == 82) {
							this.list_model[i].jumpurl = '../setting/setting'
						}else if (this.list_model[i].param_id == 123) {
							this.list_model[i].jumpurl = '../business/business'
						}
					}
					
					for (let i in this.service_model) {
						if (this.service_model[i].param_id == 89) {
							this.service_model[i].jumpurl = '../public/webView?url=' + encodeURIComponent(this.service_model[i].param_url) +
								'&source=' + '../mine/mine';
						} else if (this.service_model[i].param_id == 90) {
							this.service_model[i].jumpurl = '../card/cardList?card_type=CC&source=channel'
						} else if (this.service_model[i].param_id == 91) {
							this.service_model[i].jumpurl = '../wallet/wallet'
						} else if (this.service_model[i].param_id == 92) {
							this.service_model[i].jumpurl = "../wallet/bill?source=profit"
						} else if (this.service_model[i].param_id == 93) {
							this.service_model[i].jumpurl = '../friend/friend'
						} else if (this.service_model[i].param_id == 99) {
							this.service_model[i].jumpurl = '../mine/service'
						} else if (this.service_model[i].param_id == 100) {
							this.service_model[i].jumpurl = '../setting/setting'
						} else if (this.service_model[i].param_id == 101) {
							this.service_model[i].jumpurl = '../setting/account'
						} else if (this.service_model[i].param_id == 115) {
							this.service_model[i].jumpurl = 'videoList'
						} else if (this.service_model[i].param_id == 117) {
							this.service_model[i].jumpurl = '../card/card'
						} else if (this.service_model[i].param_id == 118) {
							this.service_model[i].jumpurl = '../business/applyCard'
						} else if (this.service_model[i].param_id == 119) {
							this.service_model[i].jumpurl = '../gathering/record'
						}
					}
					
					if(this.hasLogin){
						this.getWallet();
					}else{
						this.noticeList = [];
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.stopPullDownRefresh();
			},
			toLogin() {

				if (!this.hasLogin) {
					uni.navigateTo({
						url: '../public/login'
					});
					return false;
				} else if (this.user.is_auditing != '2') {
					uni.navigateTo({
						url: '../public/security'
					});
					return false;
				} else {
					return true
				}
			},
			// 上传头像
			updateAvatar() {
				if (!this.toLogin()) {
					return;
				}

				let _self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					async success(e) {
						uni.showLoading({
							mask: true,
							title: ''
						})
						let res = await _self.http.uploadFile({
							api_source: 'app',
							uri: '/Uploads/image',
							method: 'POST',
							device: 'web',
							data: {
								image: e.tempFilePaths[0],
							}
						})

						if (res.data.status == 1) {
							let editres = await _self.http.request({
								api_source: 'app',
								uri: '/Basic/edit_avatar',
								method: 'POST',
								device: 'web',
								data: {
									uid: _self.user.uid,
									avatar: res.data.body.pathurl
								}
							})
							uni.hideLoading()
							if (editres.data.status == 1) {
								_self.user.avatar = editres.data.body.avatar;
								_self.$u.toast('上传头像成功');
							} else {
								uni.showToast({
									title: res.data.info,
									icon: "none"
								})
							}
						}
					},
					fail(e) {
						console.log(e)
					}
				})
			},
			jump(url) {
				let _self = this;
				if (url.indexOf('setting') != -1) {
					uni.navigateTo({
						url
					})
				} else if (url.indexOf('wallet/wallet') != -1 && this.toLogin()) {
					
					if (this.needRz) {
						face.contrastSuccess = function() {
							_self.toWallet(url);
						}
						face.inter(1)
					} else {
						uni.navigateTo({
							url
						})
					}
				} else if (this.toLogin()) {
					uni.navigateTo({
						url
					})
				}
			},

			toWallet(url) {
				this.maxtime = 300; //解锁成功后5分钟内不用再解锁
				this.interval = setInterval(() => {
					if (this.maxtime >= 0) {
						this.maxtime--
						this.needRz = false;
					} else {
						this.maxtime = 300
						this.needRz = true;
						clearInterval(this.interval)
					}
				}, 1000)
				uni.navigateTo({
					url: url
				})
			},
			tel(){
				uni.makePhoneCall({
					phoneNumber: this.data.service_phone
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFF;
	}

	.head {
		background-image: url('../../static/image/mine/mine_bg.png');
		height: 496rpx;
		padding: 70rpx 30rpx;
		background-repeat: no-repeat;
		background-size: 100%;

		.total-price {
			font-size: 52rpx;
			font-weight: bold;
			color: #FFF;
		}

		.user {

			display: flex;
			justify-content: space-between;

			.u-image {
				background-color: transparent;
			}

			.name {
				font-size: 40rpx;
				font-weight: bold;
				color: #FFF;

				.status {
					border-radius: 50rpx;
					padding: 0 10rpx;
					color: #FFF;
					font-size: 24rpx;
					margin-left: 10rpx;
					border: 1px solid #FFF;
				}
			}

			.code {
				height: 50rpx;
				margin-top: 20rpx;
				background: linear-gradient(-90deg, rgba(255, 163, 32, 1), rgba(255, 184, 83, 1));
				border-radius: 50rpx;
				font-size: 28rpx;
				color: #FFF;
				padding: 0 20rpx;
				width: 280rpx;
			}

		}
	}


	.group {
		position: absolute;
		top: 430rpx;
		left: 0;
		right: 0;
		padding: 0 30rpx;

		pad .u-cell-box {
			border-radius: 10px;
			overflow: hidden;
		}
		.u-cell{
			padding: 20rpx 0;
		}
		.money {
			border-radius: 10px;

			box-shadow: -1px 4px 16px 0px rgba(158, 158, 158, 0.24);
		}

		.card {
			background: #FFFFFF;
			overflow: hidden;
			margin: 30rpx 0 20rpx 0;

			.title {
				font-size: 36rpx;
				font-weight: bold;
				padding: 25rpx;
			}
		}
	}

	.lock-tips {
		height: 100rpx;
		margin: 0 !important;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		justify-content: center;
	}

	.big-tips {
		font-size: 32rpx;
		color: #333333;
		text-align: center;
		font-weight: 500;
	}

	.small-tips {
		font-size: 24rpx;
		color: #999999;
		text-align: center;
		font-weight: 500;
		margin-top: 20rpx;
	}

	.container-lock {
		background-color: #FCFCFC;
	}

	.container-confirm {
		display: flex;
		width: 100%;
		height: 16%;
		position: absolute;
		bottom: 0;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		text-align: center;

		view {
			color: #666666;
			font-size: 28rpx;
			font-weight: 500;
			text-align: center;
			flex: 1;
			width: 80%;
			margin: 0 5%;
			height: 100rpx;
			line-height: 100rpx;
			border: 1px solid #F0F0F0;
			border-radius: 50rpx;
		}

		.disable-confirm {
			color: #A0A0A0;
			background-color: #F5F5F5;
		}
	}

	.servier-mobile {
		margin: 50rpx auto 20rpx auto;
		font-size: 24rpx;
		color: #999;
		border-radius: 50rpx;
		border: 1px solid #9D9D9D;
		padding: 10rpx;
		width: 410rpx;
		text-align: center;
	}
</style>
