<!--
 * @Author: Maisy
 * @Date: 2024-02-01 21:44:03
 * @LastEditTime: 2024-02-03 14:34:04
 * @LastEditors: Maisy
 * @Description: 
-->
<template>
	<view class="container">
		<up-input placeholder="请输入原密码" border="surround" v-model="old"></up-input>
		<up-input placeholder="请输入新密码" custom-style="margin-top:30rpx" border="surround" v-model="value"></up-input>
		<up-input placeholder="请确认新密码" custom-style="margin-top:30rpx" border="surround" v-model="repasword"></up-input>
		<u-button text="提交" @click="$u.debounce(submit, 700)" type="error" custom-style="margin-top:30rpx"></u-button>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';

import { useUserStore } from '@/store/index';
const userStore = useUserStore();
import config from '@/common/config';
const baseUrl = config.baseUrl;

const old = ref('');
const value = ref('');
const repasword = ref('');
const submit = async () => {
	if (!value.value) {
		uni.$u.toast('请输入新密码');
		return;
	}
	
	if (old.value !== uni.getStorageSync('password')) {
		uni.$u.toast('原密码错误');
		return;
	}
	
	if (value.value !== repasword.value) {
		uni.$u.toast('两次密码不一致');
		return;
	}

	uni.$u.http
		.post('/api/user/update_user', {
			...userStore.userInfo,
			password: value.value
		})
		.then((result) => {
			if (result.code === 200) {
				uni.$u.toast('修改成功');
				uni.setStorageSync('password',value.value)
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/me/me'
					});
				}, 1500);
			}
			console.log(result);
		});
};

const dataVal = reactive({
	userInfo: {}
});

// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {});
onLoad((option) => {});
</script>

<style lang="less" scoped>
.container {
	background: #f5f5f5;
	height: 100vh;
	padding: 30rpx 30rpx 0 30rpx;

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
