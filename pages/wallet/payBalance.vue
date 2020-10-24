<template>
	<view class="main">
		<view class="title">
			<u-icon color="#FFCB00" size="100" name="rmb-circle-fill"></u-icon>
			<view class="u-margin-top-30"><text class="u-font-40 font-blod ">{{money}}</text></view>
		</view>
		<view class="tips">
			<rich-text :nodes="tips"></rich-text>
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
				cid:'',
				bid:'',
				money:'',
				tips:''
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(parms) {
			this.cid = parms.id
			this.bid = parms.bid
			this.initData();
		},
		methods: {
			async initData() {
				let wtype = ''
				if(this.cid == 1){
					wtype = 1;
				}
				let res = await this.http.request({
					api_source: 'app',
					uri: '/Channel/query_balance',
					method: 'POST',
					device: 'web',
					data: {
						uid: this.userInfo.uid,
						channel_id:this.cid,
						card_id:this.bid,
						wallet_type:wtype
					}
				})
				
				if (res.data.status == 1) {
					
					this.money = res.data.body.info.balance || 0;
					if(res.data.body.tips !=""){
						this.tips = res.data.body.tips.replace(/\\n/g, '<br>')
					}
				} else {
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
	page{
		background: #F2F2F2;
	}
	.title{
		background: #FFF;
		height: 300rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.tips{
		padding: 30rpx;
	}
</style>
