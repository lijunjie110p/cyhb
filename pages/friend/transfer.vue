<template>
	<view class="main">
		<view class="tabs">
			<u-tabs :is-scroll="false" ref="uTabs" bar-width="100" inactive-color="#999" bar-height="6" bg-color="#FFF"
			  height="100" name="name" duration="0.3" active-color="#0077FF" :list="tablist"
			 :current="tabsIndex" @change="changeNavbar"></u-tabs>
		</view>
		<u-gap height="20" bg-color="#F2F2F2"></u-gap>
		<view class="form">
			<u-cell-group :border="false" v-if="type==''">
				<u-cell-item :center="true" @click="jump">
					<u-image class="u-margin-right-20" width="85rpx" height="85rpx" shape="circle" :src="son_info.avatar" slot="icon"></u-image>
					<u-input :disabled="true" @click="jump" slot="title" placeholder="请选择好友" v-model="son_info.realname"></u-input>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group :border="false" v-else>
				<u-cell-item :center="true" :arrow="false">
					<u-input type="text" slot="title" placeholder="请输入对方姓名" v-model="son_info.realname"></u-input>
				</u-cell-item>
				<u-cell-item :center="true" :arrow="false">
					<u-input type="number" slot="title" placeholder="请输入对方电话" v-model="son_info.mobile"></u-input>
				</u-cell-item>
			</u-cell-group>
			<view class="u-margin-top-30">
				<view class="u-font-30">转账金额</view>
				<view class="u-margin-top-20 u-flex "><text class="u-font-32 u-margin-right-10 tips-color">￥</text>
					<u-input type="number" :custom-style="{fontSize:'80rpx',fontWeight:'bold',color:'#FF763A'}" placeholder="0.00" v-model="money"></u-input>
				</view>
			</view>
			<u-line length="100%" color="#E8E8E8"></u-line>
			<view class="u-margin-top-20"><text class="u-type-info">可转账金额￥{{amount}}</text></view>
		</view>
		<u-gap height="20" bg-color="#F2F2F2"></u-gap>
		<u-cell-group :border="false">
			<u-cell-item :center="true" :arrow="false">
				<u-input type="number" maxlength="6" v-model="code" placeholder="请输入验证码"> </u-input>
				<u-button :hair-line="false" :custom-style="{background:'#FFF',color:'#FF763A',fontSize:'24rpx',height:'60rpx',lineHeight:'60rpx',border:'none'}"
				 slot="right-icon" @click="getCode">{{getText}}</u-button>
				<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange"></u-verification-code>
			</u-cell-item>
		</u-cell-group>
		<view class="subbtn">
			<u-button @click="transfer" shape="circle" :hair-line="false" :custom-style="btnStyle">转账</u-button>
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
				tabsIndex: 0,
				seconds: 60,
				tablist: [{
						name: '转给好友'
					},
					{
						name: '转给其他人'
					}
				],
				type: "",
				ruid: '',
				son_info: {},
				money: '', //转账金额
				code: '',
				amount: '', //余额
				getText: '获取验证码',
				btnStyle: {
					background: '#0078FF',
					height: '90rpx',
					color: '#FFF',
					border: 'none',
					boxShadow: '1px 7px 16px 0px rgba(89, 92, 120, 0.38)',
					fontSize:'32rpx'
				},
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'sonInfo'])
		},
		onLoad(parms) {
			this.ruid = parms.ruid
			this.initData();
		},
		methods: {
			jump() {
				uni.navigateTo({
					url: 'search'
				})
			},
			changeNavbar(index) {
				this.tabsIndex = index;
				this.code = '';
				this.son_info = {};
				switch (index) {
					case 0:
						this.type = ''
						break;
					case 1:
						this.type = '1'
						break;
					default:
						break;
				}
			},
			async initData() {
				if (this.ruid) {
					this.son_info = this.sonInfo;
					if (!this.son_info.realname) {
						this.son_info.realname = " "
					}
				}

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
					this.amount = res.data.body.amount
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			codeChange(text) {
				this.getText = text;
			},
			async getCode() {
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码'
					})
					let res = await this.http.request({
						api_source: 'app',
						uri: '/Basic/verification',
						method: 'POST',
						device: 'web',
						data: {
							mobile: this.userInfo.mobile,
							module: 'transfer'
						}
					})
					console.log(res.data.body)
					uni.hideLoading();
					if (res.data.status == 1) {
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
			async transfer() {
				if (!this.ruid  && this.tabsIndex == 0) {
					this.$u.toast('请选择好友')
					return
				}else if(this.tabsIndex == 1 ){
					if(!this.son_info.realname){
						this.$u.toast('请输入对方姓名')
						return
					}else if(!this.son_info.mobile){
						this.$u.toast('请输入对方电话')
						return
					}
				}
				if(this.money == ''){
					this.$u.toast('请输入转账金额')
					return
				}
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Member/transfer',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						ruid: this.ruid,
						money: this.money,
						username: this.son_info.realname,
						mobile: this.son_info.mobile,
						type: this.type,
						verify: this.code
					}
				})
				if (res.data.status == 1) {
					this.$u.toast('转账成功')
					this.initData();
				}else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	.tabs {
		background: #FFF;
		padding: 0 30rpx;
	}

	.form {
		background: #FFF;
		padding: 30rpx;

		.u-cell_title {
			width: 100% !important;
		}

		.u-cell {
			padding: 20rpx 0;
		}
	}

	.subbtn {
		margin: 50rpx 30rpx;
		padding-bottom: 50rpx;
	}
</style>
