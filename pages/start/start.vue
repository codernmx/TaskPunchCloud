<template>
	<view class="container">
		<image src="https://vote-dj.oss-cn-beijing.aliyuncs.com/%E4%BF%AE%E6%94%B9%E6%84%8F%E8%A7%81%E5%8F%8A%E6%89%80%E9%9C%80%E5%9B%BE%E7%89%870110/%E5%90%AF%E5%8A%A8%E9%A1%B5%EF%BC%88%E5%8E%8B%E7%BC%A9%EF%BC%89.jpg" mode="aspectFill" style="width: 100%; height: 100%"></image>
		<view @click="toHome" class="link-to">跳过{{ time }}</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';

const time = ref(3);
const timer = ref(null);
onShow(() => {});
onLoad((option) => {
	timer.value = setInterval(() => {
		time.value--;
		if (time.value <= 0) {
			clearInterval(timer.value)
			uni.switchTab({
				url: '/pages/home/home'
			});
		}
	}, 1000);
});
const toHome = () => {
	clearInterval(timer.value)
	uni.switchTab({
		url: '/pages/home/home'
	});
};
</script>

<style lang="less" scoped>
.container {
	height: 100vh;
	.link-to {
		position: absolute;
		top: 220rpx;
		right: 60rpx;
		background: #73aed5;
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		color: #ffffff;
	}
}
</style>
