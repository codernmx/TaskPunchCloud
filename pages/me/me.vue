<template>
	<view style="height: 330rpx" class="position-relative d-flex align-items-center">
		<image src="/static/me_bg.png" style="width: 100%; height: 330rpx" class="position-absolute"></image>

		<view class="head white align-items-center pl-3">
			<button
				class="avatar-button"
				open-type="chooseAvatar"
				@chooseavatar="onChooseAvatar"
				style="background: pink; border: none; width: 120rpx; height: 120rpx; border-radius: 50%; padding: 0"
			>
				<image style="width: 120rpx; height: 120rpx; border-radius: 50%" :src="userStore.userInfo.avatarUrl"></image>
			</button>
			<!-- <image src="/static/head.png" style="width: 120rpx; height: 120rpx; border-radius: 50%" @click="changeHead"></image> -->
			<view class="ml-4">
				<view class="size-40">{{ userStore.userInfo.realName || '暂未设置' }}</view>
				<view class="mt-1">{{ userStore.userInfo.phone || '暂未设置' }}</view>
			</view>
		</view>
	</view>
	<view class="container">
		<view class="task d-flex space-between" style="position: relative; z-index: 6; margin-top: -60rpx">
			<view class="d-flex direction-column align-items-center" @click="toTask(1)">
				<image src="/static/me.png" style="width: 68rpx; height: 68rpx"></image>
				我的任务
			</view>
			<view class="d-flex direction-column align-items-center" @click="toTask(2)">
				<image src="/static/not-pass.png" style="width: 68rpx; height: 68rpx"></image>
				未通过任务
			</view>
		</view>

		<view class="more mt-3 p-2">
			<view class="text-bold">更多功能</view>

			<MeLink name="团队成员" icon="/static/team.png" @click="toTeam" />
			<MeLink name="帮助中心" icon="/static/bz.png" @click="toPage('/pages/me/help')"/>
			<MeLink name="反馈建议" icon="/static/bzhu.png" @click="toPage('/pages/me/feedback')"/>
		</view>

		<view class="other mt-3 p-2">
			<view class="text-bold">其他</view>
			<MeLink name="设置" icon="/static/seeting.png" @click="toSeeting" />
			<MeLink name="退出登录" icon="/static/out.png" @click="loginOut" />
		</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import MeLink from '@/components/MeLink.vue';

import { useUserStore } from '@/store/index';

const userStore = useUserStore();
import config from '@/common/config';

const baseUrl = config.baseUrl;

const toTask = (type) => {
	let url = '/pages/userList/userDetail?from=me';
	if (type === 2) {
		url = '/pages/userList/userDetail?status=3&from=me';
	}
	uni.navigateTo({
		url
	});
};
const toTeam = () => {
	uni.navigateTo({
		url: '/pages/userList/userList?teamId='+uni.getStorageSync('userInfo').teamId
	});
};
const toSeeting = () => {
	uni.navigateTo({
		url: '/pages/me/seeting'
	});
};


const changeHead = () => {
	uni.$u.toast('暂无选择文件权限');
};
const dataVal = reactive({
	userInfo: {}
});
const iconList = ref([
	{
		title: '个人信息',
		icon: 'account',
		page: '/pages/me/info'
	},
	{
		title: '我的证书',
		icon: 'bookmark',
		page: '/pages/me/certificate'
	},
	{
		title: '平台公告',
		icon: 'coupon',
		page: '/pages/me/notice'
	},
	{
		title: '反馈建议',
		icon: 'kefu-ermai',
		page: '/pages/me/about'
	}
]);
const energyList = ref([]);
const toPage = (url) => {
	uni.navigateTo({
		url
	});
};

const onChooseAvatar = (e) => {
	console.log(e.detail.avatarUrl);

	uni.uploadFile({
		url: baseUrl + '/api/user/upload_img', // 仅为示例，非真实的接口地址
		filePath: e.detail.avatarUrl,
		name: 'file',
		formData: {
			user: 'test'
		},
		success: (res) => {
			const avatar = baseUrl + '/api/user/get_img' + JSON.parse(res.data).data.url;
			uni.$u.http
				.post('/api/user/update_user', {
					...userStore.userInfo,
					avatarUrl: avatar
				})
				.then((result) => {
					if (result.code === 200) {
						userStore.userInfo = {
							...userStore.userInfo,
							avatarUrl: avatar
						};
					}
					console.log(result);
				});
		}
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

const loginOut = () => {
	uni.redirectTo({
		url: '/pages/login/login'
	});
};
// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {});
onLoad((option) => {});
</script>

<style lang="less" scoped>
.head {
	display: flex;
	position: absolute;
}
.container {
	background: #f5f5f5;
	height: 100vh;
	padding: 0 30rpx;

	.task {
		border-radius: 30rpx;
		background: #ffffff;
		height: 186rpx;
		padding: 0 15%;
		display: flex;
		align-items: center;
	}

	.more {
		min-height: 486rpx;
		border-radius: 30rpx;
		background: #ffffff;
	}

	.other {
		min-height: 350rpx;
		border-radius: 30rpx;
		background: #ffffff;
	}
}
</style>
