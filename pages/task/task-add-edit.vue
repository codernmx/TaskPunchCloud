<template>
	<view class="container">

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
}
</style>
