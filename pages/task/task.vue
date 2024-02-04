<!--
 * @Date: 2024-01-30 09:57:23
 * @LastEditTime: 2024-02-04 12:26:59
-->
<template>
	<view class="container position-relative">
		<image src="/static/bg.jpg" style="width: 100%; height: 100%; opacity: 0.6" mode="scaleToFill" class="position-absolute"></image>
		<!-- 管理端 -->
		<!-- <blockquote v-if="userStore.userInfo.role === 1"></blockquote> -->
		<!-- 普通用户 -->
		<blockquote>
			<view class="position-absolute d-flex justify-content-center align-items-center direction-column" style="z-index: 2; width: 100%; margin-top: 20%">
				<view class="d-flex align-items-center justify-content-center">
					<image src="/static/daka-bg.png" style="width: 532rpx; height: 514rpx"></image>
					<view class="d-flex direction-column align-items-center position-absolute">
						<image :src="userStore.userInfo.avatarUrl" style="height: 120rpx; width: 120rpx; border-radius: 50%"></image>
						<view class="mt-1 mb-1">{{ userStore.userInfo.realName }}</view>
						<view>{{ userStore.userInfo.teamName || '暂未设置' }}</view>
						<view class="number mt-3">本周已完成{{ dataVal.total || 0 }}个任务</view>
					</view>
				</view>
				<view class="d-flex align-items-center direction-column mt-60" @click="toAddEdit">
					<image src="/static/daka.png" style="width: 270rpx; height: 270rpx"></image>
					<view class="white" style="margin-top: -130rpx">开始打卡</view>
				</view>
			</view>
		</blockquote>
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
	user:{},
	total:0
});

const toAddEdit = () => {
	uni.navigateTo({
		url: '/pages/task/task-add-edit'
	});
};
const getUserInfo = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/task_num', {
			userId: uni.getStorageSync ('userId').toString(),
		});
		console.log(res,'res')
		dataVal.total = res.data.total
	} catch (err) {
		console.log(err);
	}
};

// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {
	getUserInfo()
});
onLoad((option) => {
	
	// 如果是管理端
});
</script>

<style lang="less" scoped>
.container {
	background: #f5f5f5;
	height: 100vh;

	.number {
		width: 396rpx;
		height: 64rpx;
		background: #ffe8c2;
		border-radius: 68rpx 68rpx 68rpx 68rpx;
		text-align: center;
		line-height: 64rpx;
	}
}
</style>
