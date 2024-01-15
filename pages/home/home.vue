<template>
	<image src="/static/home_bg.png" style="width: 100%;height: 600rpx"></image>
	<view class="container">
		<view class="box">
			<view v-for="(item,i) in dataVal.tableList" :key="i" class="d-flex space-between mb-2">
				<view class="d-flex align-items-center">
					<view class="index">{{ item.index }}</view>
					<image src="/static/head.png" style="height: 80rpx;width: 80rpx;margin: 0 20rpx"></image>
					<view>{{ item.name }}</view>
				</view>
				<view>{{ item.score }}</view>
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
	tableList: [
		{
			index: 1,
			name: '雷子',
			score: 232
		},
		{
			index: 1,
			name: '雷子2',
			score: 220
		},
		{
			index: 1,
			name: '雷子2',
			score: 199
		},
		{
			index: 1,
			name: '雷子2',
			score: 8
		},
		{
			index: 1,
			name: '雷子2',
			score: 0
		}
	]
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
	min-height: 90vh;
	padding: 0 20rpx;

	.box {
		position: relative;
		z-index: 66;
		margin-top: -30rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background: linear-gradient(180deg, #FFD5BE 0%, rgba(255, 255, 255, 0) 100%);

		.index {
			width: 38rpx;
			height: 38rpx;
			background: #FFFFFF;
			border-radius: 50%;
			text-align: center;
			font-size: 26rpx;
			line-height: 38rpx;
		}
	}
}
</style>
