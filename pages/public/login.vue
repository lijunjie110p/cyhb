<template>
	<view class="container">
		<view class="title">
			<u-image src="/static/image/logo.png"  width="140rpx" mode="widthFix"></u-image>
		</view>
		<view class="u-padding-10">
			<u-form :error-type="['toast']" :model="loginInfo" ref="uForm">
				<u-form-item label-width="0" prop="mobile">
					<u-input :custom-style="{fontSize:'30rpx'}" type="number" v-model="loginInfo.mobile" placeholder="输入手机号">
					</u-input>
				</u-form-item>
				<u-form-item label-width="0" prop="code">
					<u-input :custom-style="{fontSize:'30rpx'}" type="number" maxlength="6" v-model="loginInfo.code" placeholder="输入验证码">
					</u-input>
					<u-button :hair-line="false" shape="circle" :plain="true"  slot="right" @click="getCode" :custom-style="{background:'#0077FF',
					color:'#FFF',borderColor:'#0077FF',fontSize:'24rpx',height:'60rpx',lineHeight:'60rpx'}" >{{getText}}</u-button>
					<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange"></u-verification-code>
				</u-form-item>
				<u-form-item v-if="type==1" label-width="0" prop="invite_code">
					<u-input :custom-style="{fontSize:'30rpx'}" type="number" v-model="loginInfo.invite_code" placeholder="请输入邀请码">
					</u-input>
				</u-form-item>
			</u-form>
		</view>
		<view class="u-text-right u-margin-top-20 u-margin-bottom-60 u-margin-right-20">
			<text v-if="type==0" class="tips-color u-font-26" @click="changeType(1)">立即注册</text>
			<text v-if="type==1" class="tips-color u-font-26" @click="changeType(0)">已有账号？立即登录</text>
		</view>
		<view class="u-margin-30">
			<u-button shape="circle" :hair-line="false" :custom-style="btnStyle" @click="submit"><text v-if="type==0">登陆</text><text v-else>注册</text></u-button>
		</view>
		<view v-if="type==1" @click="check=!check" class="u-flex u-row-center u-font-24">
			<u-icon v-if="!check" name="checkmark-circle" size="40" color="#CCC"></u-icon>
			<u-icon v-else name="checkmark-circle-fill" size="40" color="#0077FF"></u-icon>
			<text class="u-margin-left-10">注册账号即表示您同意并遵守创亿伙伴</text><text style="color: #0077FF;" @click.stop="lookXy">《用户协议》</text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				type: 0,
				loginInfo: {
					mobile: '',
					code: '',
					invite_code: ''
				},
				codeTips: '',
				seconds: '60',
				getText: '获取验证码',
				module: 'login',
				area: ['', ''],
				rules: {
					mobile: [{
							type: 'number',
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确'
						}
					],
					code: [{
						type: 'number',
						min: 6,
						required: true,
						message: '验证码长度为6位',
						trigger: 'blur'
					}],
					invite_code: [{
						required: true,
						message: '请输入邀请码',
					}]
				},
				btnStyle: {
					background: '#0077FF',
					height: '90rpx',
					color: '#FFF',
					border: 'none',
					fontSize: '36rpx'
				},
				check: false,
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			let _self = this;
			uni.getLocation({
				success(res) {
					_self.area[0] = res.latitude
					_self.area[1] = res.longitude;
				}
			});

		},
		methods: {
			...mapMutations(['login', 'pushUser']),
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.toLogin()
					} else {
						return;
					}
				});
			},
			changeType(type) {
				this.type = type;
				this.loginInfo.mobile = '';
				this.loginInfo.code = '';
				this.loginInfo.invite_code = '';
				this.check = false
				switch (type){
					case 0:
						uni.setNavigationBarTitle({
							title:'登录'
						})
						break;
					case 1:
						uni.setNavigationBarTitle({
							title:'注册'
						})
						break;
					default:
						break;
				}
			},
			async toLogin() {
				uni.showLoading({
					mask: true,
					title: ''
				})

				if (this.type == 0) {
					let res = await this.http.request({
						api_source: 'app',
						uri: '/Registe/login',
						method: 'POST',
						device: 'web',
						data: {
							mobile: this.loginInfo.mobile,
							code: this.loginInfo.code,
							type: 2,
							create_area_location: this.area,
						}
					})
					if (res.data.status == 1) {
						this.toHome(res.data.body)
					} else {
						uni.showToast({
							title: res.data.info,
							icon: "none"
						})
					}
				} else {

					if (!this.check) {
						this.$u.toast('请同意勾选《用户协议》')
						return;
					}
					let res = await this.http.request({
						api_source: 'app',
						uri: '/Registe/registe',
						method: 'POST',
						device: 'web',
						data: {
							mobile: this.loginInfo.mobile,
							verify: this.loginInfo.code,
							invite_code: this.loginInfo.invite_code,
							create_area_location: this.area,
						}
					})

					if (res.data.status == 1) {
						this.$u.toast('注册成功');
						this.toHome(res.data.body)
					} else {
						uni.showToast({
							title: res.data.info,
							icon: "none"
						})
					}
				}

				uni.hideLoading();
			},
			async bindTaobao(provider) {
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
					this.login(provider)
				} else {
					uni.showToast({
						title: e.data.info,
						icon: "none"
					})
				}
			},
			toHome(provider) {
				this.bindTaobao(provider)
				this.pushUser(provider)
				uni.switchTab({
					url: "../index/index"
				})
			},
			codeChange(text) {
				this.getText = text;
			},
			async getCode() {
				if (this.$refs.uCode.canGetCode) {
					if (!this.$u.test.mobile(this.loginInfo.mobile)) {
						this.$u.toast('请输入正确的手机号');
						return;
					}
					uni.showLoading({
						title: '正在获取验证码'
					})
					if (this.type == 0) {
						this.module = 'login'
					} else if (this.type == 1) {
						this.module = 'registe'
					}

					let res = await this.http.request({
						api_source: 'app',
						uri: '/Basic/verification',
						method: 'POST',
						device: 'web',
						data: {
							mobile: this.loginInfo.mobile,
							module: this.module
						}
					})
					if (res.data.status == 1) {
						uni.hideLoading();
						this.$u.toast('验证码已发送');
						this.$refs.uCode.start();
					} else {
						uni.showToast({
							title: res.data.info,
							icon: "none"
						})
					}
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			lookXy() {
				uni.navigateTo({
					url: 'webView?url=' + encodeURIComponent('https://api.ngayet.com/Other/hs_redirect_url')
				})
			}
		}
	}
</script>

<style lang="scss">
	.title {
		padding: 50rpx 0;
		vertical-align: bottom;
		display: flex;
		justify-content: center;
	}

	.u-form-item {
		padding: 20rpx 0 10rpx 0 !important;

		line-height: 1 !important;
	}
</style>
