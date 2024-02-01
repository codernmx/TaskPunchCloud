<template>
	<view class="container">
		<view class="item">
			<view>
				<text class="text-bold">联系与合作 </text>
				<text class="size-24">(工作时间:9:00-17:00)</text>
			</view>
			<u-divider text=""></u-divider>
			<view @click="phone">
				<text class="text-bold">电话：</text>
				<text>18888888888</text>
			</view>
		</view>
		
		<view class="item mt-3">
			<view>
				<text class="text-bold">投诉建议 </text>
				<text class="size-24">(工作时间:9:00-17:00)</text>
			</view>
			<u-divider text=""></u-divider>
			<view @click="phone">
				<text class="text-bold">电话：</text>
				<text>18888888888</text>
			</view>
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



const phone=()=>{
	uni.makePhoneCall({
		phoneNumber:'18888888888'
	})
}
const submit = async () => {
	uni.$u.http
		.post('/api/user/update_user', {
			...userStore.userInfo,
			password: value.value
		})
		.then((result) => {
			if (result.code === 200) {
				uni.$u.toast('修改成功');
				uni.setStorageSync('password', value.value);
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/me/me'
					});
				}, 1500);
			}
			console.log(result);
		});
};

const toTeam = () => {
	uni.navigateTo({
		url: '/pages/userList/userList'
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
	height: calc(100vh - 60rpx);
	padding: 30rpx;
	.item {
		min-height: 100rpx;
		border-radius: 20rpx;
		background: #ffffff;
		padding: 20rpx;
	}
}
</style>
