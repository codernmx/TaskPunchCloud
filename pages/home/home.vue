<template>
	<view class="position-relative">
		<image v-if="dataVal.active === 2"
			   src="http://oss.nmxgzs.cn/cloud-task/%E7%BA%A2%E5%B2%A9%E4%B9%8B%E6%98%9F.png"
			   style="width: 100%; height: 750rpx"></image>
		<image v-else-if="dataVal.active === 3"
			   src="http://oss.nmxgzs.cn/cloud-task/%E7%BA%A2%E5%B2%A9%E6%94%AF%E9%83%A8.png"
			   style="width: 100%; height: 750rpx"></image>
		<image v-else-if="dataVal.active ===4" src="http://oss.nmxgzs.cn/cloud-task/%E7%BA%A2%E5%B2%A9%E5%85%88%E9%94%8B%E9%98%9F.png"
			   style="width: 100%; height: 750rpx"></image>
		<view class="team-choose position-absolute" style="z-index: 999">
			<view v-for="(item, i) in dataVal.team" :key="i"
				  :class="{ active: dataVal.active === item.index, item: true }" @click="tamChange(item)">
				{{ item.name }}
			</view>
		</view>


		<!--1-3-->
		<view class="d-flex space-between position-absolute"
			  style="padding: 0 7%;width: calc(100% - 14%);bottom:60rpx">
			<view style="width: 33%;" class="d-flex direction-column align-items-center white" @click="toDetail(dataVal.oneTwoThree[1])">
				<view class="position-relative">
					<image src="../../static/head/two.png" style="width: 115rpx; height: 135rpx; position: absolute"
						   mode=""></image>
					<image
						:src="dataVal.oneTwoThree[1].avatarUrl"
						style="height: 105rpx; width: 108rpx; margin: 28rpx 20rpx 0 5rpx; border-radius: 50%"
					></image>
				</view>
				<view class="mt-1 name">
					{{ dataVal.oneTwoThree[1].realName }}
				</view>
				<view class="size-20">先锋值{{ dataVal.oneTwoThree[1].value }}</view>
				<view class="size-20">打卡数{{ dataVal.oneTwoThree[1].num }}</view>
			</view>
			<view style="margin-top: -50rpx;width: 33%;"  class="d-flex direction-column align-items-center white"
				  @click="toDetail(dataVal.oneTwoThree[0])">
				<view class="position-relative">
					<image src="../../static/head/one.png" style="width: 120rpx; height: 160rpx; position: absolute;z-index: 2;"
						   mode=""></image>
					<image src="../../static/head/one-bg.png" mode="" class="position-absolute" style="width: 334rpx;height: 194rpx;top: -50rpx;z-index: 0;margin-left: -100rpx;"></image>
					<image
						:src="dataVal.oneTwoThree[0].avatarUrl"
						style="height: 110rpx; width: 114rpx; margin: 50rpx 20rpx 0 5rpx; border-radius: 50%;position: relative;"
					></image>
					
				</view>

				<view class="mt-1 name">
					{{ dataVal.oneTwoThree[0].realName }}
				</view>
				<view class="size-20">先锋值{{ dataVal.oneTwoThree[0].value }}</view>
				<view class="size-20">打卡数{{ dataVal.oneTwoThree[0].num }}</view>
			</view>

			<view style="width: 33%;" class="d-flex direction-column align-items-center white" @click="toDetail(dataVal.oneTwoThree[2])">
				<view class="position-relative">
					<image src="../../static/head/three.png"
						   style="width: 120rpx; height: 140rpx; margin-top: 20rpx; position: absolute" mode=""></image>
					<image
						:src="dataVal.oneTwoThree[2].avatarUrl"
						style="height: 110rpx; width: 110rpx; margin: 48rpx 20rpx 0 6rpx; border-radius: 50%"
					></image>
				</view>
				<view class="mt-1 name">
					{{ dataVal.oneTwoThree[2].realName }}
				</view>
				<view class="size-20">先锋值{{ dataVal.oneTwoThree[2].value }}</view>
				<view class="size-20">打卡数{{ dataVal.oneTwoThree[2].num }}</view>
			</view>
		</view>
	</view>
	<view class="container">
		<!--排名4-10-->
		<view class="box">
			<view v-for="(item, i) in dataVal.tableList" :key="i" class="d-flex space-between mb-2">
				<view class="d-flex align-items-center" @click="toDetail(item)">
					<view class="index">{{ i + 4 }}</view>
					<image :src="item.avatarUrl"
						   style="height: 80rpx; width: 80rpx; margin: 0 20rpx; border-radius: 50%"></image>
					<view class="size-26">{{ item.realName }}</view>
				</view>
				<view>
					<view class="size-24">先锋值
						<text class="size-28" style="color: #F12F2F">{{ item.value }}</text>
					</view>
					<view class="size-20" style="color: #9B9B9B;text-align: right">打卡数{{ item.num }}</view>
				</view>
			</view>
			<view class="d-flex space-between mt-2 size-24 pl-1" @click="more">
				<view style="color: #999999">查看更多</view>
				<u-icon name="arrow-right" size="18"></u-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index';

const userStore = useUserStore ();
import config from '@/common/config';

const baseUrl = config.baseUrl;

const dataVal = reactive ({
	tableList: [],
	oneTwoThree: [{}, {}, {}],
	team: [
		{
			index: 2,
			name: '红岩之星',
			score: 232
		},
		{
			index: 3,
			name: '红岩支部',
			score: 220
		},
		{
			index: 4,
			name: '红岩先锋队',
			score: 220
		}
	],
	active: 2
});

const getList = async () => {
	try {
		const res = await uni.$u.http.post ('/api/user/task_user_rank', {
			type: 'all',
			role: dataVal.active
		});
		res.data.list = res.data.list.filter (item => item.num)
		dataVal.oneTwoThree = res.data.list.slice (0, 3);
		if ( dataVal.oneTwoThree.length < 3 ) {
			for (let i = 0; i <= 4 - dataVal.oneTwoThree.length; i ++) {
				dataVal.oneTwoThree.push ({
					avatarUrl:'https://www.360dk.online/api/user/get_img?path=1706780813.9215033.png'
				});
			}
		}
		dataVal.tableList = res.data.list.slice (3, 10);
	} catch (err) {
		console.log (err);
	}
};

const toDetail = (item) => {
	if ( item.userId ) {
		uni.navigateTo ({
			url: '/pages/userList/userDetail?userId=' + item.userId + '&status=2'
		});
	} else {
		// uni.$u.toast('团队暂不支持');
		if ( !item.teamId ) {
			return
		}
		uni.navigateTo ({
			url: '/pages/userList/userList?teamId=' + item.teamId
		});
	}
};
const more = () => {
	uni.navigateTo ({
		url: '/pages/home/more?role=' + dataVal.active
	});
	// if ( dataVal.active === 1 ) {
	// 	uni.navigateTo ({
	// 		url: '/pages/home/more'
	// 	});
	// } else {
	// 	uni.navigateTo ({
	// 		url: '/pages/home/more-team'
	// 	});
	// }
};
const getTeamList = async () => {
	try {
		const res = await uni.$u.http.post ('/api/user/task_group_rank', {});
		// dataVal.tableList = res.data.list;

		res.data.list = res.data.list.filter (item => item.teamName)

		dataVal.oneTwoThree = res.data.list.slice (0, 3);
		if ( dataVal.oneTwoThree.length < 3 ) {
			for (let i = 0; i <= 3 - dataVal.oneTwoThree.length; i ++) {
				dataVal.oneTwoThree.push ({});
			}
		}
		dataVal.tableList = res.data.list.slice (3, 10);
	} catch (err) {
		console.log (err);
	}
};

const tamChange = (item) => {
	dataVal.active = item.index;
	getList ();
	// if ( dataVal.active === 2 ) {
	// 	getTeamList ();
	// } else {
	// 	getList ();
	// }
};
// 下拉刷新
onPullDownRefresh (() => {
});

onShow (() => {
	if ( uni.getStorageSync ('password') === '123456' ) {

		uni.showModal ({
			title: '温馨提示',
			content: '请修改初始密码',
			success: function (res) {
				if ( res.confirm ) {
					uni.navigateTo ({
						url: '/pages/me/seeting'
					})
				} else if ( res.cancel ) {
					console.log ('用户点击取消');
				}
			}
		});

	}
});
onLoad ((option) => {
	getList ();

	setTimeout (() => {
		// uni.setTabBarItem({
		// 	index: 1,
		// 	text: '审核',
		// 	fail:err=>{
		// 		console.log(err)
		// 	},
		// 	success:res=>{
		// 		console.log(res)
		// 	}
		// });
	});
});
</script>

<style lang="less" scoped>
	.name{
		font-size: 26rpx;
		text-align: center;
	}
.team-choose {

	width: calc(100% - 184rpx);
	border-radius: 158rpx;
	height: 72rpx;
	margin: 0 92rpx 0 92rpx;
	top: 300rpx;
	background: rgba(255, 227, 127, 0.35);
	display: flex;

	.active {
		color: #ff3e3e !important;
		background: linear-gradient(180deg, #FAD45E 0%, #F99C47 100%);
		font-weight: 600 !important;
	}

	.item {
		width: 50%;
		height: 100%;
		border-radius: 158rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		color: #ffffff;

	}
}

.container {
	background: #f5f5f5;
	min-height: 60vh;
	padding: 0 20rpx;
	


	.box {
		position: relative;
		z-index: 66;
		margin-top: -40rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background: linear-gradient(180deg, #ffd5be 0%, rgba(255, 255, 255, 0) 100%);

		.index {
			width: 38rpx;
			height: 38rpx;
			background: #ffffff;
			border-radius: 50%;
			text-align: center;
			font-size: 26rpx;
			line-height: 38rpx;
		}
	}
}
</style>
