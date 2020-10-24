<template>
	<view class="main">
		<u-navbar back-text="返回" back-icon-color="#FFF" :back-text-style="{color:'#FFF'}" title="推广二维码" title-color="#FFF"
		 :background="{background:'transparent'}" :border-bottom="false"></u-navbar>
		<view class="qrcode-boder">
			<view class="head">
				<u-avatar size="210" :src="data.avatar"></u-avatar>
				<view class="u-text-center ">
					<text class="u-margin-left-20 u-font-30 main-color font-blod">{{data.realname}}</text>
				</view>
				<view class="u-text-center">
					<text class="u-margin-left-20 u-font-24 main-color font-blod">邀请码：{{data.invite_code}}</text>
				</view>
			</view>
			<view class="btn">
				<u-button @click="showShare=true" :hair-line="false" type="primary" shape="circle">分享好友</u-button>
			</view>
			<view class="code">
				<canvas @longtap="onLongpress" style="width: 320rpx;height: 320rpx;z-index: 9;" canvas-id="canvas"></canvas>
			</view>
			<u-gap height="50" ></u-gap>
		</view>

		<u-popup mode="bottom" border-radius="15" v-model="showShare" :closeable="true">
			<view class="u-font-36 u-content-color u-padding-top-30 u-text-center">
				<text>分享至</text></view>
			<view class="u-padding-30 white-bg u-flex u-row-between u-text-center u-col-center">
				<view class="u-flex-1">
					<u-icon name='weixin-circle-fill' @click="share(1)" size="90" color="#2b9939"></u-icon>
					<view><text class="u-font-30 u-margin-top-15">微信好友</text></view>
				</view>
				<view class="u-flex-1">
					<u-icon name='moments-circel-fill' @click="share(2)" size="90" color="#2b9939"></u-icon>
					<view><text class="u-font-30 u-margin-top-15">微信朋友圈</text></view>
				</view>
			</view>
			<view class="u-padding-30 u-text-center u-border-top" @click="showShare=false"><text class="u-font-36">取消</text></view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				data: {},
				showShare: false,
				shareCofig: {}
			};
		},
		onLoad() {
			this.initData()
		},
		computed: { ...mapState(['userInfo'])
		},
		onPullDownRefresh() {
			this.initData();
		},
		methods: {
			async initData() {

				let res = await this.http.request({
					api_source: 'app',
					uri: '/Member/mycode',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid
					}
				})
				if (res.data.status == 1) {
					this.data = res.data.body
					this.data.content = this.data.content.replace(/\\n/g, '\n')
					this.drawCanvas();
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

				uni.stopPullDownRefresh()
			},
			drawCanvas() {
				let _self = this;
				uni.getImageInfo({
					src: _self.data.codeimg,
					success(e) {
						// 将图片src放到cancas内，宽高为图片大小
						let ctx = uni.createCanvasContext('canvas'); /** 创建画布 */
						ctx.drawImage(e.path, 0, 0, 160, 160)
						ctx.draw(false, () => {
							uni.canvasToTempFilePath({
								canvasId: 'canvas',
								success: (res1) => {
									_self.codeimg = res1.tempFilePath;
								},
								fail: (res1) => {}
							});
						});
					}
				})
			},
			onLongpress() {
				let _self = this;
				uni.showActionSheet({
					itemList: ['下载二维码', '复制链接'],
					success: function(res) {
						if (res.tapIndex == 0) {
							uni.getImageInfo({
								src: _self.data.codeimg,
								success(e) {
									uni.saveImageToPhotosAlbum({
										filePath: e.path,
										success(r) {
											uni.showToast({
												title: '已保存到相册',
												position: 'center',
												icon: 'none'
											})
										},
										fail(f) {
											uni.showToast({
												title: '保存失败',
												position: 'center',
												icon: 'none'
											})
										}
									})
								}
							})
						} else if (res.tapIndex == 1) {
							uni.setClipboardData({
								data: _self.data.url,
								success(e) {

								}
							});
						}
					},
				})
			},
			share(type) {
				let scene = type == 1 ? "WXSceneSession" : "WXSenceTimeline",
					title = type == 1 ? this.data.title_name : this.data.content

				if (type == 2) {
					uni.setClipboardData({
						data: this.data.title,
						success(e) {
							uni.showToast({
								title: '分享内容已粘贴'
							})
						}
					});
				}

				uni.share({
					provider: 'weixin',
					title: title,
					imageUrl: this.data.logo,
					scene: scene,
					type: 0,
					href: this.data.url,
					summary: this.data.content,
					success(e) {
						uni.showToast({
							title: '分享成功',
							position: 'center',
							icon: 'none'
						})
					},
					fail(err) {
						uni.showToast({
							title: JSON.stringify(err),
							position: 'center',
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7F6;
		background-image: url('../../static/image/mine/qcode_bg.png');
		background-position: top;
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.qrcode-boder {
		border-radius: 10rpx;
		box-shadow: 0px 7px 16px 0px rgba(88, 91, 120, 0.38);
		margin: 180rpx 45rpx;
		background: rgba($color: #ffffff, $alpha: 0.77);
		position: relative;
		padding-top: 250rpx;

		.head {
			position: absolute;
			top: -100rpx;
			left: 225rpx;
		}
		.code {
			width: 320rpx;
			margin: 60rpx auto;
			border: 2px solid #0077FF;
			position: relative;
			padding: 20rpx;
		}
		.code:before{
			content: '';
			left: 30rpx;
			width: 300rpx;
			top: -10rpx;
			bottom: -10rpx;
			z-index: 1;
			background: #FFF;
			position: absolute;
		}
		.code:after{
			content: '';
			left: -10rpx;
			right: -10rpx;
			height: 300rpx;
			top: 30rpx;
			z-index: 1;
			background: #FFF;
			position: absolute;
		}
	}

	.btn {
		width: 350rpx;
		margin: 0 auto;
	}

	button {
		border: none !important;
	}
</style>
