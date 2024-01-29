<template>
	<view class="container position-relative">
		56
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



const toAddEdit = () => {
	uni.navigateTo ({
		url: '/pages/task/task-add-edit'
	})
}
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
