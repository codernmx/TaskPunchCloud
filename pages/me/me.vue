<template>
	<view style="height: 330rpx" class="position-relative d-flex align-items-center">
		<image src="/static/me_bg.png" style="width: 100%;height: 330rpx" class="position-absolute"></image>
		<view class="head white align-items-center pl-3">
			<image src="/static/head.png" style="width: 120rpx;height: 120rpx;border-radius: 50%"></image>
			<view class="ml-4">
				<view class="size-40">张三</view>
				<view class="mt-1">19923756596</view>
			</view>
		</view>
	</view>
	<view class="container">
		<view class="task d-flex space-between" style="position: relative;z-index: 6;margin-top: -60rpx">
			<view class="d-flex direction-column align-items-center">
				<image src="/static/me.png" style="width: 68rpx;height: 68rpx"></image>
				我的任务
			</view>
			<view class="d-flex direction-column align-items-center">
				<image src="/static/not-pass.png" style="width: 68rpx;height: 68rpx"></image>
				未通过任务
			</view>
		</view>

		<view class="more mt-3 p-2">
			<view class="text-bold">更多功能</view>

			<MeLink name="团队成员" icon="/static/team.png"/>
			<MeLink name="帮助中心" icon="/static/bz.png"/>
			<MeLink name="帮助与反馈" icon="/static/bzhu.png"/>
		</view>

		<view class="other mt-3 p-2">
			<view class="text-bold">其他</view>
			<MeLink name="设置" icon="/static/seeting.png"/>
			<MeLink name="退出登录" icon="/static/out.png"/>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import MeLink from "@/components/MeLink.vue";


import { useUserStore } from '@/store/index';

const userStore = useUserStore ();
import config from '@/common/config';

const baseUrl = config.baseUrl;


const dataVal = reactive ({
	userInfo: {},
});
const iconList = ref ([
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
const energyList = ref ([]);
const toPage = (url) => {
	uni.navigateTo ({
		url
	});
};


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
.head{
	display: flex;
	position: absolute;
}
.container {
	background: #F5F5F5;
	height: 100vh;
	padding: 0 30rpx;


	.task {
		border-radius: 30rpx;
		background: #FFFFFF;
		height: 186rpx;
		padding: 0 15%;
		display: flex;
		align-items: center;
	}

	.more {
		min-height: 486rpx;
		border-radius: 30rpx;
		background: #FFFFFF;
	}

	.other {
		min-height: 350rpx;
		border-radius: 30rpx;
		background: #FFFFFF;
	}
}
</style>
