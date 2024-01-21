<template>
	<view class="container pt-2">
		<view class="main">
			<u--form labelPosition="left" labelWidth="200rpx" :model="form" :rules="rules" ref="form1">
				<u-form-item label="打卡任务类型" prop="userInfo.type" borderBottom @click="showSex = true" ref="item1">
					<!-- <u--input v-model="form.userInfo.type" disabled disabledColor="#ffffff" placeholder="" border="none"></u--input> -->
					<template #right>
						<view class="d-flex">
							<text>{{ form.userInfo.type }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>
				<u-form-item label="共同参与者" prop="userInfo.participant" borderBottom @click="showGt = true" ref="item2">
					<!-- <u--input v-model="form.userInfo.participant" disabled disabledColor="#ffffff" placeholder="" border="none"></u--input> -->
					<template #right>
						<view class="d-flex">
							<text>{{ form.userInfo.participant }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>
				<u-form-item label="" prop="userInfo.img" borderBottom ref="item1">
					<view style="width: 100%; margin-bottom: 10px; font-size: 15px">编辑任务详情</view>
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="9"></u-upload>
				</u-form-item>
				<u-form-item label="" prop="userInfo.detail" borderBottom ref="item1">
					<view style="width: 100%; margin-bottom: 10px; font-size: 15px">编辑任务详情</view>
					<u--textarea v-model="form.userInfo.detail" placeholder="请输入内容"></u--textarea>
				</u-form-item>
				<u-form-item label="定位" prop="userInfo.address" borderBottom ref="item1" @click="chooseAddress">
					<view style="width: 100%; margin-bottom: 10px; font-size: 15px">{{ form.userInfo.location }}</view>
				</u-form-item>
				<u-form-item>
					<up-button type="error" text="打卡" @click="$u.debounce(submit, 700)"></up-button>
				</u-form-item>
			</u--form>
			<u-action-sheet :show="showSex" :actions="actions" title="打卡任务类型" @close="showSex = false"></u-action-sheet>

			<!-- 共同参与者 -->
			<u-action-sheet :show="showGt" :actions="actionsGtAc" title="共同参与者" @close="showGt = false"></u-action-sheet>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index';
import { formatDate } from '@/util/util';
const userStore = useUserStore();
import config from '@/common/config';

const baseUrl = config.baseUrl;
const showSex = ref(false);
const showGt = ref(false);
const form = reactive({
	userInfo: {
		location: '重庆市渝中区戴家巷渝中区',
		detail: '任务详情12',
		participant: uni.getStorageSync('userInfo').userId, //多个逗号分割
		status: 1,
		completeTime: formatDate(new Date()), //完成时间
		type: 1 //任务类别
	}
});

const actions = [
	{
		name: '任务一'
	},
	{
		name: '任务二'
	},
	{
		name: '任务三'
	}
];
const actionsGtAc = [
	{
		name: '共同参与者1'
	},
	{
		name: '共同参与者2'
	},
	{
		name: '共同参与者3'
	}
];

const rules = {
	'userInfo.name': {
		type: 'string',
		required: true,
		message: '请填写姓名',
		trigger: ['blur', 'change']
	},
	'userInfo.sex': {
		type: 'string',
		max: 1,
		required: true,
		message: '请选择男或女',
		trigger: ['blur', 'change']
	}
};
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
			url: baseUrl + '/api/user/upload_img', // 仅为示例，非真实的接口地址
			filePath: url,
			name: 'file',
			formData: {
				user: 'test'
			},
			success: (res) => {
				setTimeout(() => {
					console.log(JSON.parse(res.data).data.url);
					resolve(baseUrl + '/api/user/get_img' + JSON.parse(res.data).data.url);
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
const submit = async () => {
	console.log(fileList.value);
	const imgList = fileList.value.map((item) => {
		return item.url;
	});
	const res = await uni.$u.http.post('/api/user/add_task', {
		...form.userInfo,
		img: JSON.stringify(imgList)
	});
	if (res.code === 200) {
		uni.$u.toast('打卡成功');
		setTimeout(() => {
			uni.switchTab({
				url: '/pages/task/task'
			});
		}, 1500);
	}
};
const chooseAddress = () => {
	uni.chooseLocation({
		success: function (res) {
			console.log('位置名称：' + res.name);
			console.log('详细地址：' + res.address);
			console.log('纬度：' + res.latitude);
			console.log('经度：' + res.longitude);
		},
		fail: (err) => {
			console.log(err);
		}
	});
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
