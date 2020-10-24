<template>
	<view class="main white-bg">
		<view class="card-bg">
			<view class="card">
				<view class="icon">
					<u-image shape="circle" :src="card_info.bank_icon" width="90rpx" height="90rpx"></u-image>
				</view>
				<view class="u-margin-left-50">
					<view class="u-font-36">{{card_info.bank_name}}</view>
					<view class="u-font-26 u-margin-top-20 font-blod font-lettle">{{card_info.card_no}}</view>
				</view>
			</view>
			<view class="redbg"></view>
			<view class="bluebg"></view>
		</view>
		<view class="white-bg ">
			<view class="u-padding-bottom-10" v-if="source=='channel'">
				<u-tabs :is-scroll="false" gutter="570" bar-width="80" inactive-color="#666" bar-height="5" bg-color="#FFF" height="90"
				 name="title" duration="0.3" active-color="#0078FF" :list="tabs" :current="tabindex" @change="switchTabs"></u-tabs>
			</view>
			<view class="u-flex u-col-center u-row-between white-bg channel" v-for="(item,index) in channel"
			 @click="bind(item)">
				<u-image width="75rpx" mode="widthFix" src="https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/290.png"></u-image>
				<view class="info u-flex-1" style="border-bottom: 1px solid #E6E6E6;"> 
					<view class="u-flex u-row-between u-col-center">
						<text>{{item.channel_name}}</text>
						<text v-if="item.channel_recommend"  class="tips-color">【推荐】</text>
						<text v-if="item.is_bind==0 && source!='huabei'" class="tips-color">需绑卡验证</text>
						<text v-if="item.is_bind==2 && source!='huabei'" class="u-margin-left-10 tips-color" >进件中</text>
					</view>
					<view class="u-margin-top-10 u-line-1"><text class="u-font-24 u-type-info">{{item.rate_tip}}</text></view>
				</view>
			</view>
			<view class="u-padding-50 u-flex u-row-center" v-if="channel.length == 0">
				<u-image src="/static/image/nodata.png" width="400rpx" mode="widthFix"></u-image>
			</view>
		</view>
		<u-popup mode="center" border-radius="15" :closeable="true" v-model="subPopup">
			<view class="subChannel">
				<view class="title">配置辅助通道</view>
				<view class="body">
					<view  @click="bind(item)" class="u-flex u-col-center u-row-between white-bg item" v-for="(item,index) in subChannel" :key="index">
						<u-image width="75rpx" mode="widthFix" src="https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/290.png"></u-image>
						<view class="info u-flex-1" style="border-bottom: 1px solid #E6E6E6;"> 
							<view class="u-flex u-row-between u-col-center">
								<text>{{item.channel_name}}</text>
								<text v-if="item.channel_recommend"  class="tips-color">【推荐】</text>
								<text v-if="item.is_bind==0 && source!='huabei'" class="tips-color">需绑卡验证</text>
								<text v-if="item.is_bind==2 && source!='huabei'" class="u-margin-left-10 tips-color">进件中</text>
							</view>
							<view class="u-line-1"><text class="u-font-24 u-type-info">{{item.rate_tip}}</text></view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-action-sheet @click="stages" :tips="tips" :list="list" v-model="show"></u-action-sheet>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				card_info: {},
				tabindex:0,
				is_need_sub:'',
				tabs:[
					{title:'还款通道'},
					{title:'收款通道'},
				],
				channel: [],
				channel_item: {},
				channel_type:'HK',
				channel_model:'',
				source: '',
				tips: {
					text: "选择分期"
				},
				list: [
					{
						text: '花呗分期数 X 6期'
					},
					{
						text: '花呗分期数 X 12期'
					}
				],
				stagesNum: '',
				show: false,
				subPopup:false,
				subChannel:'',	//辅助通道
			};
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: '../public/webView?url=' + encodeURIComponent('https://h5.huitye.com/App/quotaTable.html?uid=' + this.userInfo
					.uid)
			})
		},
		onLoad(parms) {
			this.card_info.card_id = parms.card_id
			this.source = parms.source;
			this.is_need_sub = parms.is_need_sub;
			this.channel_model = parms.channel_model;
			if(this.source == 'repayment' || this.source == 'channel'){
				this.channel_type = 'HK'
			}else if (this.source == 'pos') {
				this.channel_type = 'FACE'
			}else{
				this.channel_type = 'SK'
			}
			
			this.initData()
			this.getbankinfo()
		},
		onShow() {
			this.channel = [];
			this.initData()
			this.getbankinfo()
		},
		onPullDownRefresh() {
			this.initData();
			this.getbankinfo()
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			async getbankinfo() {
				let res = await this.http.request({
					api_source: 'app',
					uri: '/PayBank/card_info',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_info.card_id,
					}
				})
				if (res.data.status == 1) {
					this.card_info = res.data.body.card_info;
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			switchTabs(e){
				this.tabindex = e;
				if(e == 0){
					this.channel_type = 'HK'
				}else{
					this.channel_type = 'SK'
				}
				this.initData();
			},
			async initData() {
				uni.showLoading({
					title: '',
					mask:true
				})
				let uri = '/PayBank/channel_list',
					data = {
						uid: this.userInfo.uid,
						card_id: this.card_info.card_id,
						channel_type: this.channel_type,
						channel_model:this.channel_model
					}
				
				if (this.source == 'huabei') {
					uri = '/PayBank/tokio_list'
					data = {
						uid: this.userInfo.uid,
						card_id: this.card_info.card_id
					}
				}
				let res = await this.http.request({
					api_source: 'app',
					uri,
					method: 'POST',
					device: 'web',
					data
				})
				if (res.data.status == 1) {
					this.channel = []
					switch (this.source) {
						case 'pos':
							for (var i in res.data.body) {
								if (res.data.body[i].is_face == 1) {
									this.channel.push(res.data.body[i])
								}
							}
							break;
						case 'huabei':
							this.channel = res.data.body.card.tokio_channel_list
							break;
						default:

							this.channel = res.data.body
							break;
					}

				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.hideLoading()
				uni.stopPullDownRefresh();
			},
			async bind(item) {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				if (item.is_bind == 0 && this.source != 'huabei') {
					uni.showLoading({
						title: '',
						mask:true
					})
					let res = await this.http.request({
						api_source: 'app',
						uri: '/Channel/channel_registe',
						method: 'POST',
						device: 'web',
						data: {
							uid: this.userInfo.uid,
							card_id: this.card_info.card_id,
							channel_id: item.channel_id
						}
					})
					if (res.data.status == 1) {
						console.log(res.data.body.info.bind_url)
						uni.navigateTo({
							url: '../public/webView?url=' + encodeURIComponent(res.data.body.info.bind_url)
						})
					} else {
						uni.showToast({
							title: res.data.info,
							icon: "none"
						})
					}
					uni.hideLoading()
					return;
				}
				if (item.is_bind == 2 && this.source != 'huabei') {
					this.$u.toast('进件中！')
					return;
				}
				if(this.is_need_sub == 1 && this.subPopup == false){
					prevPage.$vm.formData.channel = item;
					this.getSubChannel()
					return;
				}
				
				if(this.subPopup == true){
					prevPage.$vm.subChannel = item; //修改上一页面的 channel 参数值为 item
					this.subPopup = false
					this.$u.toast('配置辅助通道成功')
					setTimeout(function(){
						 uni.navigateBack()
					},1000)
					return;
				}
				if (this.source == 'gathering' || this.source == 'pos' || this.source == 'repayment') {
					prevPage.$vm.formData.channel = item; //修改上一页面的 channel 参数值为 item
					this.subPopup = false
					uni.navigateBack()
				}
				if (this.source == 'huabei') {
					if (item.is_tokio == 2) {
						this.channel_item = item;
						this.show = true
					} else {
						prevPage.$vm.formData.channel = item; //修改上一页面的 channel 参数值为 item
						uni.navigateBack()
					}
				}
			},
			async getSubChannel(){
				uni.showLoading({
					title: '',
					mask:true
				})
				let res = await this.http.request({
					api_source: 'app',
					uri: '/PayBank/channel_list',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						card_id: this.card_info.card_id,
						channel_type: this.channel_type,
						channel_model:5,
					}
				})
				if (res.data.status == 1) {
					this.subChannel = res.data.body;
					if(this.subChannel.length==0){
						this.$u.toast('该卡不支持此模式还款')
					}else{
						this.subPopup = true;
					}
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
				uni.hideLoading()
				
			},
			stages(index) {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				
				if (index == 0) {
					this.stagesNum = 6
				}
				if (index == 1) {
					this.stagesNum = 12
				}

				prevPage.$vm.formData.channel = this.channel_item; //修改上一页面的 channel 参数值为 item
				prevPage.$vm.stagesNum = this.stagesNum;
				uni.navigateBack()
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFF;
	}

	.card-bg {
		padding: 30rpx;
		background: #F2F2F2;
		height: 270rpx;

		.card {
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			top: 30rpx;
			display: flex;
			align-items: center;
			height: 205rpx;
			background: url('../../static/image/channel_yellow.png');
			background-size: 100%;
			background-repeat: no-repeat;
			border-radius: 10rpx;
			z-index: 10;
			color: white;
			padding: 0 60rpx;

			.icon {
				border-radius: 100rpx;
				background: #FFF;
				overflow: hidden;
				padding: 5rpx;
			}
		}

		.redbg {
			position: absolute;
			z-index: 9;
			top: 80rpx;
			left: 50rpx;
			right: 50rpx;
			height: 205rpx;
			background: url('../../static/image/channel_red.png');
			background-size: 100%;
			background-repeat: no-repeat;
		}

		.bluebg {
			position: absolute;
			z-index: 8;
			top: 120rpx;
			left: 70rpx;
			right: 70rpx;
			height: 205rpx;
			background: url('../../static/image/channel_blue.png');
			background-size: 100%;
			background-repeat: no-repeat;
		}
	}

	.channel {
		margin-left: 30rpx;
		.info{
			padding: 30rpx 30rpx 30rpx 0 ;
			margin-left:30rpx;
		}
	}
	.subChannel{
		.title{
			text-align: center;
			padding: 20rpx;
			font-size: 30rpx;
			font-weight: 500;
			border-bottom: 1px solid #F2F2F2;
		}
		.body{
			.item{
				margin-left: 30rpx;
				.info{
					padding: 30rpx 30rpx 30rpx 0 ;
					margin-left:30rpx;
				}
			}
		}
	}
</style>
