<template>
	<view class="container pt-2">
		<view class="main">
			<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="9"></u-upload>
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
	userInfo: {}
});
const fileList = ref([]);

// 删除图片
const deletePic = (event) => {
	fileList.value.splice(event.index, 1);
};

// 新增图片
const afterRead = async (event) => {
	// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
	let lists = [].concat(event.file);
	let fileListLen = fileList.value.length;
	lists.map((item) => {
		fileList.value.push({
			...item,
			status: 'uploading',
			message: '上传中'
		});
	});
	for (let i = 0; i < lists.length; i++) {
		const result = await uploadFilePromise(lists[i].url);
		let item = fileList.value[fileListLen];
		fileList.value.splice(fileListLen, 1, {
			...item,
			status: 'success',
			message: '',
			url: result
		});
		fileListLen++;
	}
};

const uploadFilePromise = (url) => {
	return new Promise((resolve, reject) => {
		let a = uni.uploadFile({
			url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
			filePath: url,
			name: 'file',
			formData: {
				user: 'test'
			},
			success: (res) => {
				setTimeout(() => {
					resolve(res.data.data);
				}, 1000);
			}
		});
	});
};

const getStatistics = async () => {
	try {
		const res = await uni.$u.http.post('/api/activity/statistics/my', {
			userId: uni.getStorageSync('userInfo').userId
		});
		dataVal.total = res.data;
	} catch (err) {
		console.log(err);
	}
};

// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {});
onLoad((option) => {});
</script>

<style lang="less" scoped>
.container {
	background: #f6f6f6;
	height: 100vh;
	padding: 0 20rpx;
	.main {
		background: #ffffff;
		min-height: 80%;
		border-radius: 20rpx;
		padding: 20rpx;
	}
}
</style>
