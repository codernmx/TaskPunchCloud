<template>
	<view>
		<image v-if="dataVal.active === 1" src="/static/home_bg.png" style="width: 100%; height: 750rpx"></image>
		<image v-else src="/static/td.png" style="width: 100%; height: 750rpx"></image>
		<view class="team-choose">
			<view v-for="(item, i) in dataVal.team" :key="i" :class="{ active: dataVal.active === item.index, item: true }" @click="tamChange(item)">
				{{ item.name }}
			</view>
		</view>
	</view>
	<view class="container">
		<view class="d-flex space-between" style="margin-bottom: 180rpx; padding: 0 13%" :style="{ marginTop: dataVal.active === 1 ? '-190rpx' : '-190rpx' }">
			<view class="d-flex direction-column align-items-center white" @click="toDetail(dataVal.oneTwoThree[1])">
				<view class="position-relative">
					<image src="../../static/head/two.png" style="width: 115rpx; height: 135rpx; position: absolute" mode=""></image>
					<image
						:src="dataVal.active === 1 ? dataVal.oneTwoThree[1].avatarUrl : dataVal.oneTwoThree[1].imgUrl"
						style="height: 105rpx; width: 108rpx; margin: 27rpx 20rpx 0 5rpx; border-radius: 50%"
					></image>
				</view>
				<view class="mt-1">{{ dataVal.active === 1 ? dataVal.oneTwoThree[1].realName : dataVal.oneTwoThree[1].teamName }}</view>
				<view>{{ dataVal.active === 1 ? dataVal.oneTwoThree[1].taskNum : dataVal.oneTwoThree[1].total }}</view>
			</view>
			<view style="margin-top: -50rpx" class="d-flex direction-column align-items-center white" @click="toDetail(dataVal.oneTwoThree[0])">
				<view class="position-relative">
					<image src="../../static/head/one.png" style="width: 120rpx; height: 160rpx; position: absolute" mode=""></image>
					<image
						:src="dataVal.active === 1 ? dataVal.oneTwoThree[0].avatarUrl : dataVal.oneTwoThree[0].imgUrl"
						style="height: 110rpx; width: 110rpx; margin: 50rpx 20rpx 0 5rpx; border-radius: 50%"
					></image>
				</view>

				<view class="mt-1">{{ dataVal.active === 1 ? dataVal.oneTwoThree[0].realName : dataVal.oneTwoThree[0].teamName }}</view>
				<view>{{ dataVal.active === 1 ? dataVal.oneTwoThree[0].taskNum : dataVal.oneTwoThree[0].total }}</view>
			</view>

			<view class="d-flex direction-column align-items-center white" @click="toDetail(dataVal.oneTwoThree[2])">
				<view class="position-relative">
					<image src="../../static/head/three.png" style="width: 120rpx; height: 140rpx; margin-top: 20rpx; position: absolute" mode=""></image>
					<image
						:src="dataVal.active === 1 ? dataVal.oneTwoThree[2].avatarUrl : dataVal.oneTwoThree[2].imgUrl"
						style="height: 110rpx; width: 108rpx; margin: 48rpx 20rpx 0 6rpx; border-radius: 50%"
					></image>
				</view>
				<view class="mt-1">{{ dataVal.active === 1 ? dataVal.oneTwoThree[2].realName : dataVal.oneTwoThree[2].teamName }}</view>
				<view>{{ dataVal.active === 1 ? dataVal.oneTwoThree[2].taskNum : dataVal.oneTwoThree[2].total }}</view>
			</view>
		</view>
		<view class="box">
			<view v-for="(item, i) in dataVal.tableList" :key="i" class="d-flex space-between mb-2">
				<view class="d-flex align-items-center" @click="toDetail(item)">
					<view class="index">{{ i + 4 }}</view>
					<image :src="dataVal.active === 1 ? item.avatarUrl : item.imgUrl" style="height: 80rpx; width: 80rpx; margin: 0 20rpx; border-radius: 50%"></image>
					<view>{{ dataVal.active === 1 ? item.realName : item.teamName }}</view>
				</view>
				<view>{{ dataVal.active === 1 ? item.taskNum : item.total }}</view>
			</view>
			<view class="d-flex space-between mt-2 size-24 pl-1" @click="more">
				查看更多
				<u-icon name="arrow-right" size="18"></u-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index';

const userStore = useUserStore();
import config from '@/common/config';

const baseUrl = config.baseUrl;

const dataVal = reactive({
	tableList: [],
	oneTwoThree: [{}, {}, {}],
	team: [
		{
			index: 1,
			name: '个人榜',
			score: 232
		},
		{
			index: 2,
			name: '团队榜',
			score: 220
		}
	],
	active: 1
});

const getList = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/task_user_rank', {
			// userId: uni.getStorageSync('userInfo').userId,
			type: 'taskNum'
		});
		dataVal.oneTwoThree = res.data.list.slice(0, 3);
		if (dataVal.oneTwoThree.length < 3) {
			for (let i = 0; i <= 3 - dataVal.oneTwoThree.length; i++) {
				dataVal.oneTwoThree.push({});
			}
		}
		console.log(dataVal.oneTwoThree, '5656');
		dataVal.tableList = res.data.list.slice(3,10);
	} catch (err) {
		console.log(err);
	}
};

const toDetail = (item) => {
	if (item.userId) {
		uni.navigateTo({
			url: '/pages/userList/userDetail?userId=' + item.userId
		});
	} else {
		// uni.$u.toast('团队暂不支持');
		if(!item.teamId){
			return
		}
		uni.navigateTo({
			url: '/pages/userList/userList?teamId=' + item.teamId
		});
	}
};
const more = () => {
	if (dataVal.active === 1) {
		uni.navigateTo({
			url: '/pages/home/more'
		});
	} else {
		uni.navigateTo({
			url: '/pages/home/more-team'
		});
	}
};
const getTeamList = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/task_group_rank', {});
		// dataVal.tableList = res.data.list;
		
		res.data.list = res.data.list.filter(item=>item.teamName)

		dataVal.oneTwoThree = res.data.list.slice(0, 3);
		if (dataVal.oneTwoThree.length < 3) {
			for (let i = 0; i <= 3 - dataVal.oneTwoThree.length; i++) {
				dataVal.oneTwoThree.push({});
			}
		}
		dataVal.tableList = res.data.list.slice(3,10);
	} catch (err) {
		console.log(err);
	}
};

const tamChange = (item) => {
	dataVal.active = item.index;
	if (dataVal.active === 2) {
		getTeamList();
	} else {
		getList();
	}
};
// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {
	if(uni.getStorageSync('password') ==='123456'){
		
		uni.showModal({
			title: '温馨提示',
			content: '请修改初始密码',
			success: function (res) {
				if (res.confirm) {
					uni.navigateTo({
						url:'/pages/me/seeting'
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
		
	}
});
onLoad((option) => {
	getList();

	setTimeout(() => {
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
.team-choose {
	width: calc(100% - 92px);
	border-radius: 158rpx;
	height: 72rpx;
	margin: -448rpx 92rpx 230rpx 92rpx;
	//margin: 0 46px;
	//background: rgba(255, 30, 30, 0.35);
	background: black;
	display: flex;

	.active {
		color: #ff3e3e !important;
		background: #ffffff;
		font-weight: 600 !important;
	}

	.item {
		width: 50%;
		height: 100%;
		border-radius: 79px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-family: PingFang SC, PingFang SC;
		font-weight: 400;
		color: #ffffff;
	}
}

.container {
	background: #f5f5f5;
	min-height: 90vh;
	padding: 0 20rpx;

	.box {
		position: relative;
		z-index: 66;
		margin-top: -120rpx;
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
