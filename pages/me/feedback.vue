<template>
	<view class="container">
		<!-- <view class="item">
			<view>
				<text class="text-bold">联系与合作 </text>
				<text class="size-24">(工作时间:9:00-17:00)</text>
			</view>
			<u-divider text=""></u-divider>
			<view @click="phone">
				<text class="text-bold">电话：</text>
				<text>18888888888</text>
			</view>
		</view> -->

		<!--<view class="item mt-3 mb-3">-->
		<!--	<view>-->
		<!--		<text class="text-bold">投诉建议</text>-->
		<!--		<text class="size-24">(工作时间:9:00-17:00)</text>-->
		<!--	</view>-->
		<!--	<u-divider text=""></u-divider>-->
		<!--	<view @click="phone">-->
		<!--		<text class="text-bold">电话：</text>-->
		<!--		<text>18888888888</text>-->
		<!--	</view>-->
		<!--</view>-->

		<u--textarea v-model="content" placeholder="请输入您的详细意见" height="300" count
					 maxlength="500"></u--textarea>
		<up-button type="primary" text="提交" color="#F24643" shape="circle" customStyle="margin-top:100rpx"
				   @click="submit" :disabled="disabled"></up-button>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index';

const userStore = useUserStore ();
import config from '@/common/config';
const baseUrl = config.baseUrl;


const content = ref ('')
const disabled = ref (false)
const phone = () => {
	uni.makePhoneCall ({
		phoneNumber: '18888888888'
	})
}
const submit = async () => {
	if ( !content.value ) {
		uni.$u.toast ('请先输入您的建议！');
		return
	}
	disabled.value = true
	uni.$u.http
		.post ('/api/user/add_suggestion', {
			content: content.value,
			userName: userStore.userInfo.realName
		})
		.then ((result) => {
			if ( result.code === 200 ) {
				uni.$u.toast ('感谢您的建议');
				setTimeout (() => {
					uni.switchTab ({
						url: '/pages/me/me'
					})
				}, 1500)
			}
			console.log (result);
		}).finally (() => {
		setTimeout (() => {
			disabled.value = false
		}, 3000)
	})
};


const dataVal = reactive ({
	userInfo: {}
});

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
