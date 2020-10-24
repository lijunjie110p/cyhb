<template>
	<view class="main">
		<view>
			<u-gap height="20" bg-color="#F5F7F6"></u-gap>
			<view @click="sendMsg(serviceData.ed_instructions)" class="u-padding-30 white-bg u-flex u-row-between u-col-center">
				<view class="">
					<u-image src="/static/image/queryService/ed.png" width="80rpx" height="80rpx"></u-image>
				</view>
				<view class="">
					<view class="u-font-28 u-main-color">查询可用额度</view>
					<view class="u-font-20 u-type-info u-margin-top-10">{{serviceData.telecom_ed_show}}</view>
				</view>
				<view class=""><u-icon name="arrow-right" size="30" color="#ACADB2"></u-icon></view>
			</view>
		</view>
		<view>
			<u-gap height="20" bg-color="#F5F7F6"></u-gap>
			<view @click="sendMsg(serviceData.zd_instructions)" class="u-padding-30 white-bg u-flex u-row-between u-col-center">
				<view class="">
					<u-image src="/static/image/queryService/zd.png" width="80rpx" height="80rpx"></u-image>
				</view>
				<view class="">
					<view class="u-font-28 u-main-color">查询账单</view>
					<view class="u-font-20 u-type-info u-margin-top-10">{{serviceData.telecom_zd_show}}</view>
				</view>
				<view class=""><u-icon name="arrow-right" size="30" color="#ACADB2"></u-icon></view>
			</view>
		</view>
		<view>
			<u-gap height="20" bg-color="#F5F7F6"></u-gap>
			<view @click="sendMsg(serviceData.jf_instructions)" class="u-padding-30 white-bg u-flex u-row-between u-col-center">
				<view class="">
					<u-image src="/static/image/queryService/jf.png" width="80rpx" height="80rpx"></u-image>
				</view>
				<view class="">
					<view class="u-font-28 u-main-color">查询积分</view>
					<view class="u-font-20 u-type-info u-margin-top-10">{{serviceData.telecom_jf_show}}</view>
				</view>
				<view class=""><u-icon name="arrow-right" size="30" color="#ACADB2"></u-icon></view>
			</view>
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
				card_id: '',
				serviceData: ''
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(parms) {
			this.card_id = parms.card_id;
			this.initData()
		},
		methods: {
			async initData() {
				uni.showLoading({
					mask: true,
					title: ''
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/PayBank/bank_info',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_id
					}
				})
				if (res.data.status == 1) {
					this.serviceData = res.data.body.bank_help_info
					this.serviceData.telecom_jf_show = this.serviceData.telecom_jf_show.replace('\\n', ' ')
					this.serviceData.telecom_zd_show = this.serviceData.telecom_zd_show.replace('\\n', ' ')
					this.serviceData.telecom_ed_show = this.serviceData.telecom_ed_show.replace('\\n', ' ')
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.hideLoading()
			},
			sendMsg(message){
				let msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
				msg.to = [this.serviceData.hotline];
				msg.body = message;
				plus.messaging.sendMessage(msg, function() {
					
				}, function() {
				 
				});
			}
		}
	}
</script>

<style lang="scss">
	page {

		background: #F5F7F6;
	}
</style>
