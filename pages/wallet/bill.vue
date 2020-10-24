<!-- 分润 账单 -->
<template>
	<view class="main">
		<u-popup  v-model="showScreen" mode="top" :safe-area-inset-bottom="true" >
			<view class="">
				<view class="datefomart">
					<view class="u-padding-30 u-flex u-row-between">
						<text class="u-font-30">日期</text>
						<view class="date" @click="showDate=true">
							<text class="u-type-info u-font-24">{{startTime}}</text>
							<u-icon name="calendar" size="35"></u-icon>
						</view>
						<text>-</text>
						<view class="date" @click="showDate=true">
							<text class="u-type-info u-font-24">{{endTime}}</text>
							<u-icon name="calendar" size="35"></u-icon>
						</view>
					</view>
				</view>
				<u-line length="100%" color="#e8e8e8"></u-line>
				<view class="u-padding-30">
					<view ><text class="u-font-30">类型</text></view>
					<view class="u-margin-top-30 u-flex u-row-between u-flex-wrap u-col-center">
						<u-tag class="u-margin-bottom-20 u-margin-right-20" :bg-color="typeIndex==index?'#0078FF':'#E6E6E6'"
						 :border-color="typeIndex==index?'#0078FF':'#E6E6E6'" :color="typeIndex==index?'#FFF':'#666666'"
						  @click="selectType(item,index)" shape="circle" :text="item.vtitle" v-for="(item,index) in typeData" :key="index"></u-tag>
					</view>
				</view>
			</view>
			<view class="poput-footer u-flex u-row-between u-col-center white-color u-text-center">
				<view class="u-flex-1 " style="background: #A0A0A0;" @click="showScreen=false"><text>取消</text></view>
				<view class="u-flex-1 " style="background: #0078FF;" @click="screen"><text>确认</text></view>
			</view>
		</u-popup>
		<u-calendar toolTip="请选择开始日期和结束日期" range-bg-color="rgba(190, 236, 255, 0.1)" range-color="#0078FF"
		 active-bg-color="#0078FF" :safe-area-inset-bottom="true" v-model="showDate" max-date="2050-01-01" mode="range"
		 @change="dateChange"></u-calendar>
		
			<view class="list" v-for="(item,index) in dataList" :key="index">
				<view class="group-title">
					<view class="u-main-color u-font-36"><text>{{item.date}}</text></view>
					<view class="u-type-info u-font-28 u-margin-top-10"><text>收入￥{{item.add_all}}</text><text v-if="source=='bill'"
						 class="u-margin-left-20">支出￥{{item.dec_all}}</text></view>
				</view>
				<view class="u-flex u-col-center item" v-for="(list,i) in item.list" >
					<u-image  width="90rpx" height="90rpx" shape="circle" :src="list.icon"></u-image>
					<view @click="jump(list)" class="u-margin-left-30 u-flex-1">
						<view  class="u-flex u-row-between u-col-center">
							<view class="u-line-1 u-main-color">
								<text class="u-font-28" v-if="source=='bill'">{{list.info.info}}</text>
								<text class="u-font-28" v-if="source=='profit'">{{list.name}}</text></view>
								<view class="main-color u-font-36 font-blod"><text v-if="list.act_type=='out'">-</text><text v-else>+</text>{{list.amount}}</view>
						
						</view>
						<view  class="u-flex u-row-between u-col-center">
							<view class="u-font-24 u-type-info">
								<text>{{list.create_time_date}}</text>
								<text class="u-margin-left-10" v-if="source=='bill'">{{list.info.state}}</text>
								<text class="u-margin-left-10" v-if="source=='profit'">{{list.benfit_info}}</text>
							</view>
							<view class="u-main-color u-font-24" v-if="source=='bill'">余额:{{list.balance}}</view>
							<view class="u-main-color u-font-24 u-line-1" v-if="source=='profit'">{{list.order_amount}}</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore font-size="30" margin-top="20" :load-text="{loadmore:'点击或上拉加载更多',loading: '努力加载中',nomore:'已经到底了~'}"
			 :status="status" @loadmore="onreachBottom" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				type: {
					id: '',
					name: '所有类型'
				},
				source: '', //来源页面
				typeData: '',
				typeIndex:0,
				scrollerHeight: '',
				startTime: '',
				showDate: false,
				endTime: '',
				page: 1,
				dataList: [],
				isTop: true,
				showPopup: false,
				showScreen:false,
				firsLoad: true,
				status: 'loadmore', //加载更多
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onNavigationBarButtonTap() {
			this.showScreen = !this.showScreen;
		},
		onReady() {
			let that = this;
			uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
				success(res) { //成功回调函数
					let height = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
					that.scrollerHeight = height + 'px' //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
				}
			})
			switch (this.source) {
				case 'bill':
					uni.setNavigationBarTitle({
						title: '账单记录'
					});
					break;
				case 'profit':
					uni.setNavigationBarTitle({
						title: '分润记录'
					});
					break;
				default:
					break;
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.firsLoad = true;
			this.initData();
		},
		onReachBottom() {
			this.onreachBottom()
		},
		onLoad(parms) {
			this.source = parms.source
			

			let date = new Date(),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours(),
				mint = date.getMinutes(),
				secounds = date.getSeconds();
			this.startTime = `${year}-${month}-1`;
			this.endTime = `${year}-${month}-${day}`;
			this.getType();
			this.initData();
		},
		methods: {
			async getType() {
				let url = ''
				switch (this.source) {
					case 'bill':
						url = '/Member/bill_type'
						break;
					case 'profit':
						url = '/Benefit/benfit_type'
						break;
					default:
						break;
				}
				let res = await this.http.request({
					api_source: 'app',
					uri: url,
					method: 'POST',
					device: 'web',
					data: {}
				})
				if (res.data.status == 1) {
					this.typeData = res.data.body;
					this.type.id = this.typeData[0].vid;
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			screen(){
				this.dataList = [];
				this.page = 1;
				this.initData();
			},
			async initData() {
				let url = ''
				if (this.source == 'bill') {
					url = '/Member/bill'
				} else if (this.source == 'profit') {
					url = '/Benefit/benfit_records'
				}
				uni.showLoading({
					title: ''
				})
				let data = {
						uid: this.userInfo.uid,
						page: this.page,
						app_id: this.type.id,
						create_time_begin: this.startTime,
						create_time_end: this.endTime
					}
					this.status = 'loading'
				let res = await this.http.request({
					api_source: 'app',
					uri: url,
					method: 'POST',
					device: 'web',
					data
				})
				uni.hideLoading()
				uni.stopPullDownRefresh()
				this.showScreen = false;
				if (res.data.status == 1) {
					let currlen = 0;
					for (var i in res.data.body) {
						for (var j in res.data.body[i].list) {
							currlen++
						}
					}
					if (currlen < 10) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
					if (this.page == 1) this.dataList = [];
					let hasTT = false;
					for(var i in this.dataList){
						for(var j in res.data.body){
							if(this.page>1 && res.data.body[j].date == this.dataList[i].date){
								this.dataList[i].list = this.dataList[i].list.concat(res.data.body[j].list)
								hasTT = true;
							}
						}
					}
					if(hasTT == false){
						this.dataList = this.dataList.concat(res.data.body)
					}
					
				} else {
					uni.showToast({
						title: res.data.info,
						icon: "none"
					})
				}
			},
			dateChange(e) {
				this.startTime = e.startDate
				this.endTime = e.endDate
			},
			onreachBottom() {
				if (this.status == 'loadmore') {
					this.page++
					this.firsLoad = false;
					this.initData()
				}
			},
			selectType(item,index) {
				this.type.id = item.vid;
				this.type.name = item.vtitle;
				this.typeIndex = index;
			},
			jump(item) {
				if (this.source == 'bill') {
					uni.navigateTo({
						url: 'billDetails?source=bill&record_id=' + item.record_id
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.head {
		z-index: 990;
		position: sticky;
		top: 0;
		background-color: #fff;
	}

	.type-select {
		height: 90rpx;
		line-height: 90rpx;
		border-bottom: 1px solid #F2F2F2;
	}

	.datefomart {
		.date {
			border-radius: 10rpx;
			border: 1px solid #CCCCCC;
			display: flex;
			padding: 0 20rpx;
			height: 55rpx;
			justify-content: space-between;
			align-items: center;
			width: 200rpx;
		}
	}

	.list {
		.group-title {
			background: #F6F6F6;
			padding: 20rpx 30rpx;
		}
		.item{
			border-bottom: 1px solid #F2F2F2;
			padding: 20rpx 30rpx;
		}
	}

	.popup-title {
		position: sticky;
		top: 0;
		z-index: 999;
		background: #FFF;
	}
	.poput-footer{
		height: 100rpx;
		line-height: 100rpx;
	}
</style>
