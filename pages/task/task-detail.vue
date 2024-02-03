<template>
	<view class="container">
		<view class="position-relative">
			<image src="../../static/detail.png" style="width: 100%; height: 250rpx" mode=""></image>
			<image src="../../static/cloud.png" mode="" class="position-absolute" style="z-index: 3; top: 30rpx; right: 50rpx; width: 150rpx; height: 150rpx"></image>

			<view class="position-absolute white" style="bottom: 160rpx;left: 30rpx;">{{ dataVal.info.typeName }}</view>
			<view class="position-absolute white" style="bottom: 120rpx;left: 30rpx;">打卡时间：{{ dataVal.info.completeTime }}</view>
		</view>
		<view class="main position-relative">
			<view class="d-flex space-between ydk">
				<view class="d-flex align-items-center">
					<image :src="dataVal.user.avatarUrl" style="width: 120rpx; height: 120rpx; border-radius: 50%" mode=""></image>
					<view class="pl-2">
						<view>{{dataVal.user.realName}}</view>
						<view>{{dataVal.user.teamName}}</view>
					</view>
				</view>
				<image src="../../static/ydk.png" style="width: 156rpx; height: 122rpx" mode=""></image>
			</view>

			<view class="intro">
				<view class="text-bold">先锋值</view>
				<view class="mt-1" style="color: #F12F2F">{{dataVal.info.score + dataVal.info.diffScore}}</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">参与者</view>
				<view class="mt-1">{{dataVal.user.realName}}</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">任务照片</view>
				<view>
					<image v-for="item in dataVal.info.imgArr" :src="item" mode="aspectFill" style="width: 120rpx; height: 120rpx; margin: 10rpx 10rpx 10rpx 0" @click="previewImg(item)"></image>
				</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">定位地址</view>
				<view>{{ dataVal.info.location }}</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">任务详情</view>
				<view>{{ dataVal.info.detail }}</view>
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
	userInfo: {},
	info: {
		score:0,
		diffScore:0,
	},
	user: {},
});

const toAddEdit = () => {
	uni.navigateTo({
		url: '/pages/task/task-add-edit'
	});
};

const previewImg  =(item)=>{
	uni.previewImage({
		urls:[item]
	})
}
const getInfo = async (taskId) => {
	try {
		const res = await uni.$u.http.post('/api/user/task_detail', { taskId });
		dataVal.info = {
			...res.data.info,
			imgArr: JSON.parse(res.data.info.img)
		};
		dataVal.user = res.data.user
	} catch (err) {
		console.log(err);
	}
};
// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {});
onLoad((options) => {
	getInfo(Number(options.clockId));
});
</script>

<style lang="less" scoped>
.container {
	background: #f5f5f5;
	height: 100vh;
	.main {
		padding: 0 20rpx;
		.ydk {
			background: #ffffff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: -60rpx;
		}
		.intro {
			margin-top: 20rpx;
			background: #ffffff;
			border-radius: 20rpx;
			padding: 20rpx;
		}
	}
}
</style>
