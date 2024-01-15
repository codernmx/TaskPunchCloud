<template>
	<view class="container position-relative">
		<image src="/static/task_bg.png" style="width: 100%;height: 100%" class="position-absolute"></image>
		<view class="position-absolute d-flex justify-content-center align-items-center direction-column"
			  style="z-index: 2;width: 100%;margin-top: 20%">
			<view class="d-flex align-items-center justify-content-center">
				<image src="/static/daka-bg.png" style="width: 532rpx;height: 514rpx"></image>
				<view class="d-flex direction-column align-items-center position-absolute">
					<image src="/static/head.png" style="height: 120rpx;width: 120rpx"></image>
					<view class="mt-1 mb-1">张三</view>
					<view>用户组1</view>
					<view class="number mt-3">
						本周已完成1个任务
					</view>
				</view>
			</view>
			<view class="d-flex align-items-center direction-column mt-60">
				<image src="/static/daka.png" style="width: 270rpx;height: 270rpx"></image>
				<view class="white" style="margin-top: -130rpx">开始打卡</view>
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
	userInfo: {},
});


const getStatistics = async () => {
	try {
		const res = await uni.$u.http.post ('/api/activity/statistics/my', {
			userId: uni.getStorageSync ('userInfo').userId
		});
		dataVal.total = res.data;
	} catch (err) {
		console.log (err);
	}
};

// 下拉刷新
onPullDownRefresh (() => {
});

onShow (() => {

});
onLoad ((option) => {
});
</script>

<style lang="less" scoped>

.container {
	background: #F5F5F5;
	height: 100vh;

	.number {
		width: 396rpx;
		height: 64rpx;
		background: #FFE8C2;
		border-radius: 68rpx 68rpx 68rpx 68rpx;
		text-align: center;
		line-height: 64rpx;
	}
}
</style>
