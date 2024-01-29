<template>
	<view class="position-relative">
		<image src="/static/task_bg.png" style="width: 100%; height: 100vh"></image>
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
					<image :src="item.imgUrl" style="height: 80rpx; width: 80rpx; margin: 0 20rpx;border-radius: 50%;"></image>
					<view>{{ item.teamName }}</view>
				</view>
				<view>
					<text v-if="dataVal.active === 1">{{ item.dayNum }}</text>
					<text v-if="dataVal.active === 2">{{ item.weekNum }}</text>
					<text v-if="dataVal.active === 3">{{ item.taskNum }}</text>
				</view>
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
			name: '日榜',
			score: 232
		},
		{
			index: 2,
			name: '周榜',
			score: 220
		},
		{
			index: 3,
			name: '总榜',
			score: 220
		}
	],
	active: 1
});

const getList = async () => {
	try {
		let type = null;
		if (dataVal.active === 1) {
			type = 'dayNum';
		} else if (dataVal.active === 2) {
			type = 'weekNum';
		} else {
			type = 'taskNum';
		}
		const res = await uni.$u.http.post('/api/user/task_group_rank', {
			// userId: uni.getStorageSync('userInfo').userId,
			type
		});
		dataVal.tableList = res.data.list;
	} catch (err) {
		console.log(err);
	}
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
	getList();
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
	margin: -97vh 46px 5vh 46px;
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
	// min-height: 90vh;
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
