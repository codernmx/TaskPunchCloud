<template>
	<view class="container">
		<u-collapse @change="change" @close="close" @open="open">
			<u-collapse-item title="初始密码是啥？" name="Variety">
				<text class="u-collapse-content">默认登录密码123456</text>
			</u-collapse-item>
			<u-collapse-item title="排行榜计算依据？" name="Variety">
				<text class="u-collapse-content">审核者对打卡任务评分</text>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index';

const userStore = useUserStore();
import config from '@/common/config';

const baseUrl = config.baseUrl;

const dataVal = reactive({});

// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {});
onLoad((option) => {});
</script>

<style lang="less" scoped>
.container {
	// background: #f5f5f5;
	height: 100vh;
	padding: 0 30rpx;
}
</style>
