<template>
	<view>
		<image v-if="dataVal.active === 1" src="/static/home_bg.png" style="width: 100%; height: 600rpx"></image>
		<image v-else src="/static/td.png" style="width: 100%; height: 600rpx"></image>
		<view class="team-choose">
			<view v-for="(item, i) in dataVal.team" :key="i" :class="{ active: dataVal.active === item.index, item: true }" @click="tamChange(item)">
				{{ item.name }}
			</view>
		</view>
	</view>
	<view class="container">
		<view class="box">
			<view v-for="(item, i) in dataVal.tableList" :key="i" class="d-flex space-between mb-2">
				<view class="d-flex align-items-center" @click="toDetail(item)">
					<view class="index">{{ i + 1 }}</view>
					<image :src="dataVal.active === 1 ? item.avatarUrl : item.imgUrl" style="height: 80rpx; width: 80rpx; margin: 0 20rpx;border-radius: 50%;"></image>
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
		dataVal.tableList = res.data.list;
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
		uni.$u.toast('团队暂不支持');
	}
};
const more = () => {
	uni.navigateTo({
		url: '/pages/home/more'
	});
};
const getTeamList = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/task_group_rank', {});
		dataVal.tableList = res.data.list;
	} catch (err) {
		console.log(err);
	}
};

const tamChange = (item) => {
	dataVal.active = item.index;
	console.log(dataVal.active, 'dataVal.active');
	if (dataVal.active === 2) {
		getTeamList();
	}else{
		getList();
	}
};
// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {});
onLoad((option) => {
	getList();
});
</script>

<style lang="less" scoped>
.team-choose {
	width: calc(100% - 92px);
	border-radius: 79px;
	height: 36px;
	margin: -150px 46px 115px 46px;
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
		margin-top: -30rpx;
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
