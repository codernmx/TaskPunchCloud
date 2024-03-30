<template>
	<view class="container pt-2">
		<view class="main">
			<u--form labelPosition="left" labelWidth="200rpx" :model="form" :rules="rules" ref="form1">
				<u-form-item label="打卡任务类型" prop="userInfo.type" borderBottom @click="showSex = true" ref="item1">
					<!-- <u--input v-model="form.userInfo.type" disabled disabledColor="#ffffff" placeholder="" border="none"></u--input> -->
					<template #right>
						<view class="d-flex">
							<text>{{ form.userInfo.typeStr }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>

				<u-form-item label="" prop="userInfo.detail" borderBottom ref="item1">
					<view style="width: 100%; margin-bottom: 10px; font-size: 15px">任务介绍信息</view>
					<u--textarea v-model="form.userInfo.intro" placeholder="" disabled></u--textarea>
				</u-form-item>
				<u-form-item label="任务开始时间" prop="userInfo.startTime" borderBottom>
					<template #right>
						<view class="d-flex">
							<text>{{ form.userInfo.startTime }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>
				<u-form-item label="任务结束时间" prop="userInfo.endTime" borderBottom>
					<template #right>
						<view class="d-flex">
							<text>{{ form.userInfo.endTime }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>

				<u-form-item label="打卡用户" prop="userInfo.type" borderBottom @click="showBind = true" ref="item1" v-if="userStore.userInfo.isManager">
					<template #right>
						<view class="d-flex">
							<text>{{ form.userInfo.showBindStr }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item>

				<!-- <u-form-item label="共同参与者" prop="userInfo.participant" borderBottom @click="showGt = true" ref="item2">
					<template #right>
						<view class="d-flex">
							<text>{{ form.userInfo.participant }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</template>
				</u-form-item> -->
				<u-form-item label="" prop="userInfo.img" borderBottom ref="item1">
					<view style="width: 100%; margin-bottom: 10px; font-size: 15px">上传任务照片</view>
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="9"></u-upload>
				</u-form-item>
				<u-form-item label="" prop="userInfo.detail" borderBottom ref="item1">
					<view style="width: 100%; margin-bottom: 10px; font-size: 15px">编辑任务详情</view>
					<u--textarea v-model="form.userInfo.detail" height="150" maxlength="3000" placeholder="请输入内容"></u--textarea>
				</u-form-item>
				<u-form-item label="定位" prop="userInfo.address" borderBottom ref="item1">
					<view class="d-flex align-items-center">
						<view style="width: 100%; font-size: 28rpx" @click="chooseAddress">{{ form.userInfo.location }}</view>
						<view @click="showAddress = true" style="width: 120rpx">重选</view>
					</view>
				</u-form-item>
				<u-form-item>
					<up-button type="error" customStyle="border-radius:20rpx" text="打卡" @click="$u.debounce(submit, 700)"></up-button>
				</u-form-item>
			</u--form>
			<!-- showBind -->
			<u-picker :show="showBind" ref="showBindShow" keyName="str" :columns="showBindColumns" @confirm="confirmBind" @cancel="showBind = false"></u-picker>
			<u-action-sheet
				:show="showSex"
				:actions="actions"
				title="打卡任务类型"
				@select="
					(val) => {
						selectType(val, 'type', 'typeStr');
					}
				"
				@close="showSex = false"
			></u-action-sheet>

			<!-- 共同参与者 -->
			<u-action-sheet
				:show="showGt"
				:actions="actionsGtAc"
				title="共同参与者"
				@select="
					(val) => {
						selectType(val, 'participant', 'participantStr');
					}
				"
				@close="showGt = false"
			></u-action-sheet>

			<!-- 选择定位 -->

			<u-action-sheet
				:show="showAddress"
				:actions="addressActions"
				title="打卡任务类型"
				@select="
					(val) => {
						selectAddress(val);
					}
				"
				@close="showAddress = false"
			></u-action-sheet>
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

import QQMapWX from '@/util/libs/qqmap-wx-jssdk';
// var QQMapWX = require('@/util/libs/qqmap-wx-jssdk');
// 实例化API核心类
const qqmapsdk = new QQMapWX({
	key: 'PN3BZ-YPOKC-QYR22-A4MYM-BVUJZ-EPFQF' // 必填
});
const showSex = ref(false);
const showBind = ref(false);
const showGt = ref(false);
const showAddress = ref(false);
const form = reactive({
	userInfo: {
		location: '',
		detail: '', //任务详情
		participant: null, //多个逗号分割
		status: 1,
		completeTime: formatDate(new Date()), //完成时间
		type: null, //任务类别
		user_id: uni.getStorageSync('userId'),
		username: uni.getStorageSync('userInfo').realName,
		role: uni.getStorageSync('userInfo').role
	}
});

const actions = ref([]);
const actionsGtAc = ref([]);
const addressActions = ref([]);

const showBindColumns = reactive([[]]);
const bindUser = uni.getStorageSync('userInfo')['bindUser'];
if (bindUser && JSON.parse(bindUser).length > 0) {
	showBindColumns[0] = JSON.parse(uni.getStorageSync('userInfo')['bindUser']).map((item) => {
		return {
			...item,
			str: item.username + ' ' + item.realName
		};
	});
}

const confirmBind = (val) => {
	const value = val['value'][0];
	console.log(value);
	form.userInfo.user_id = value.userId;
	form.userInfo.username = value.str;
	form.userInfo.showBindStr = value.str;
	form.userInfo.role = value.role;
	showBind.value = false;
};
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
	userInfo: {},
	startAddress: {}
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
const selectAddress = (val) => {
	console.log(val);
	const { lat, lng } = val.location;
	const { title } = val;

	form.userInfo.location = title;
	dataVal.startAddress = {
		...dataVal.startAddress,
		latitude: lat,
		longitude: lng
	};
};
const selectType = (val, key, str) => {
	console.log(val);
	const { startTime, endTime, intro } = val;
	form.userInfo[key] = val.taskId;
	form.userInfo[str] = val.name;
	form.userInfo['typeName'] = val.name;
	form.userInfo.endTime = endTime;
	form.userInfo.startTime = startTime;
	form.userInfo.intro = intro;
};

const submit = async () => {
	const { type, participant, detail, location } = form.userInfo;
	if (!location || !detail || !type) {
		uni.$u.toast('请输入完整内容');
		return;
	}
	const imgList = fileList.value.map((item) => {
		return item.url;
	});
	if (imgList.length < 1) {
		uni.$u.toast('请上传文件');
		return;
	}
	const user_id = form.userInfo.user_id;
	const str = form.userInfo.participant + ',' + user_id;
	const res = await uni.$u.http.post('/api/user/add_task', {
		...form.userInfo,
		participant: form.userInfo.participant ? str : user_id,
		img: JSON.stringify(imgList),
		user_id,
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
	const { latitude, longitude } = dataVal.startAddress;
	uni.openLocation({
		latitude,
		longitude,
		name: form.userInfo.location,
		success: function () {
			console.log('success');
		}
	});
	return;
	uni.chooseLocation({
		success: function (res) {
			console.log('位置名称：' + res.name);
			console.log('详细地址：' + res.address);
			console.log('纬度：' + res.latitude);
			console.log('经度：' + res.longitude);

			// const distance = calcCoordsDistance(dataVal.startAddress, res);
			// console.log(dataVal.startAddress, res);
			// console.log(distance, 'distance');
			// if (distance.originVal > 300) {
			// 	uni.$u.toast('请选择300米内位置');
			// } else {
			form.userInfo.location = res.name;
			// }
		},
		fail: (err) => {
			console.log(err);
		}
	});
};
const init = async () => {
	try {
		const typeList = uni.$u.http.post('/api/user/type_list', {
			wx: true
		});
		// const joinList = uni.$u.http.post ('/api/user/user_list', {
		// 	teamId: uni.getStorageSync ('userInfo').userId,
		// 	page: 1,
		// 	pageSize: 100
		// });
		const [type] = await Promise.all([typeList]);
		actions.value = type.data.list.map((item) => {
			return {
				...item,
				name: item.taskName
			};
		});
	} catch (err) {
		console.log(err);
	}
};
// 下拉刷新
onPullDownRefresh(() => {});
init();
onShow(() => {});
onLoad((option) => {
	uni.getLocation({
		type: 'gcj02',
		success: (res) => {
			dataVal.startAddress = res;
			console.log(res);
			console.log('当前位置的经度：' + res.longitude);
			console.log('当前位置的纬度：' + res.latitude);
			//使用jdk的方法解析
			qqmapsdk.reverseGeocoder({
				location: [res.latitude, res.longitude].join(','),
				get_poi: '1',
				poi_options: 'radius=200',
				success: function (succ) {
					console.log(succ, '12121212');
					form.userInfo.location = succ.result.address;

					addressActions.value = succ.result.pois.map((item) => {
						return {
							...item,
							name: item.title
						};
					});
				}
			});
		},
		fail: (err) => {
			console.log(err, '定位报错');
			if (err.errMsg === 'getLocation:fail system permission denied') {
				uni.$u.toast('请检查定位是否打开');
			} else {
				uni.$u.toast(err.errMsg);
			}
		}
	});
});
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
