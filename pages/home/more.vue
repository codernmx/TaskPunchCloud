<template>
	<view class="position-relative">
		<image src="/static/task_bg.png" style="width: 100%; height: 100vh;"></image>
		<view class="team-choose">
			<view v-for="(item, i) in dataVal.team" :key="i"
				  :class="{ active: dataVal.active === item.index, item: true }" @click="tamChange(item)">
				{{ item.name }}
			</view>
		</view>
	</view>
	<view class="container">
		<view class="d-flex space-between mb-4 box" v-if="userStore.userInfo.role == dataVal.role">
			<view class="d-flex align-items-center" @click="toDetail(item)">
				<view class="index">{{ dataVal.myInfo.rank }}</view>
				<image :src="dataVal.myInfo.avatarUrl"
					   style="height: 80rpx; width: 80rpx; margin: 0 20rpx;border-radius: 50%;"></image>
				<view>我的排名</view>
			</view>
			<view>
				<view class="size-24">先锋值
					<text class="size-28" style="color: #F12F2F">{{ dataVal.myInfo.value }}</text>
				</view>
				<view class="size-20" style="color: #9B9B9B;text-align: right">打卡数 {{ dataVal.myInfo.num }}</view>
			</view>
		</view>


		<view class="box" style="overflow: scroll;" :style="{height:userStore.userInfo.role == dataVal.role ? '65vh' : '78vh'}">
			<u-empty mode="data" v-if="dataVal.tableList.length == 0"></u-empty>
			<view v-for="(item, i) in dataVal.tableList" :key="i" class="d-flex space-between mb-2">
				<view class="d-flex align-items-center" @click="toDetail(item)">
					<view class="index">{{ item.rank }}</view>
					<image :src="item.avatarUrl"
						   style="height: 80rpx; width: 80rpx; margin: 0 20rpx;border-radius: 50%;"></image>
					<view class="size-26">{{ item.realName }}</view>
				</view>
				<view>
					<view class="size-24">先锋值
						<text class="size-28" style="color: #F12F2F">{{ item.value }}</text>
					</view>
					<view class="size-20" style="color: #9B9B9B;text-align: right">打卡数{{item.num}}
						<!--<text v-if="dataVal.active === 1">{{ item.dayNum }}</text>-->
						<!--<text v-if="dataVal.active === 2">{{ item.weekNum }}</text>-->
						<!--<text v-if="dataVal.active === 3">{{ item.taskNum }}</text>-->
					</view>
				</view>
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
	myInfo:{},
	role: '',
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
		if ( dataVal.active === 1 ) {
			type = 'day';
		} else if ( dataVal.active === 2 ) {
			type = 'week';
		} else {
			type = 'all';
		}
		const res = await uni.$u.http.post ('/api/user/task_user_rank', {
			type,
			role: Number (dataVal.role)
		});
		dataVal.tableList = res.data.list.map ((item, index) => {
			return {
				...item,
				rank: item.num ? index + 1 : '-'
			}
		});
		dataVal.myInfo = dataVal.tableList.filter (item => {
			return item.userId === uni.getStorageSync('userId')
		})[0] ||{}
		console.log (dataVal.myInfo)

	} catch (err) {
		console.log (err);
	}
};
const getTeamList = async () => {
	try {
		const res = await uni.$u.http.post ('/api/user/task_group_rank', {});
		dataVal.tableList = res.data.list;
	} catch (err) {
		console.log (err);
	}
};

const tamChange = (item) => {
	dataVal.active = item.index;
	getList ();
};
const toDetail = (item) => {
	if ( item.userId ) {
		uni.navigateTo ({
			url: '/pages/userList/userDetail?userId=' + item.userId
		});
	} else {
		uni.$u.toast ('团队暂不支持');
	}
};
// 下拉刷新
onPullDownRefresh (() => {
});

onShow (() => {
});
onLoad ((option) => {
	dataVal.role = option.role
	getList ();
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
			min-width: 38rpx;
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
