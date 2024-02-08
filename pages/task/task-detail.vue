<template>
	<view class="container">
		<view class="position-relative">
			<image src="../../static/detail.png" style="width: 100%; height: 250rpx" mode=""></image>
			<image src="../../static/cloud.png" mode="" class="position-absolute" style="z-index: 3; top: 30rpx; right: 50rpx; width: 150rpx; height: 150rpx"></image>

			<view class="position-absolute white" style="bottom: 160rpx; left: 30rpx">{{ dataVal.info.typeName }}</view>
			<view class="position-absolute white" style="bottom: 120rpx; left: 30rpx">打卡时间：{{ dataVal.info.completeTime }}</view>
		</view>
		<view class="main position-relative">
			<view class="d-flex space-between ydk">
				<view class="d-flex align-items-center">
					<image :src="dataVal.user.avatarUrl" style="width: 120rpx; height: 120rpx; border-radius: 50%" mode=""></image>
					<view class="pl-2">
						<view>{{ dataVal.user.realName }}</view>
						<view>{{ dataVal.user.teamName }}</view>
					</view>
				</view>
				<image src="../../static/ydk.png" style="width: 156rpx; height: 122rpx" mode=""></image>
			</view>

			<view class="intro">
				<view class="text-bold">先锋值</view>
				<view class="mt-1" style="color: #f12f2f">{{ dataVal.info.score + dataVal.info.diffScore }}</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">参与者</view>
				<view class="mt-1">{{ dataVal.user.realName }}</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">任务照片</view>
				<view>
					<image
						v-for="item in dataVal.info.imgArr"
						:src="item"
						mode="aspectFill"
						style="width: 120rpx; height: 120rpx; margin: 10rpx 10rpx 10rpx 0"
						@click="previewImg(item)"
					></image>
				</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">定位地址</view>
				<view>{{ dataVal.info.location }}</view>
				<u-divider text=""></u-divider>
				<view class="text-bold">任务详情</view>
				<view>{{ dataVal.info.detail }}</view>
				
			</view>

			<!-- 评论区 -->
			<Comment ref='commentRef' />
			<view class="d-flex justify-content-end pr-4">
				<view class="size-24 comment-btn mt-1" @click="writeComment = true">写评论</view>
			</view>
			<view style="height: 60rpx"></view>
			<!-- 写评论的弹窗 -->
			<u-popup :show="writeComment" :round="10" mode="bottom" @close="writeComment = false;bottomHeight=0" @open="open" customStyle="min-height:50%">
				<view class="p-2">
					<u--textarea v-model="comment" placeholder="请输入评论内容" autoHeight :showConfirmBar="false" customStyle="min-height:200rpx"></u--textarea>
					<!-- <view style="height: 100rpx;"></view> -->
					<view class="d-flex justify-content-end"><up-button type="primary" :disabled="loading" @click="sendComment" shape="circle" text="发送" color="#F24643" size="mini" customStyle="width:150rpx;display:block;margin-top:30rpx"></up-button></view>
					<view class="bottom-box" :style="{ height: `${bottomHeight}rpx` }"></view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh,onReady } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index';

import Comment from '@/components/Comment.vue';

const userStore = useUserStore();
import config from '@/common/config';

const baseUrl = config.baseUrl;


const commentRef = ref(null)
const writeComment = ref(false)
const systemBottom = ref(0)
const bottomHeight = ref(0)
const loading = ref(false)
const comment = ref('')
const dataVal = reactive({
	userInfo: {},
	info: {
		score: 0,
		diffScore: 0
	},
	user: {}
});

const toAddEdit = () => {
	uni.navigateTo({
		url: '/pages/task/task-add-edit'
	});
};

const previewImg = (item) => {
	uni.previewImage({
		urls: [item]
	});
};
const getInfo = async (taskId) => {
	try {
		const res = await uni.$u.http.post('/api/user/task_detail', { taskId });
		dataVal.info = {
			...res.data.info,
			imgArr: JSON.parse(res.data.info.img)
		};
		dataVal.user = res.data.user;
	} catch (err) {
		console.log(err);
	}
};
const sendComment = async ()=>{
	try {
		loading.value = true
		const res = await uni.$u.http.post('/api/user/task_detail', { });
		loading.value = false
		uni.$u.toast('留言成功');
		writeComment.value = false
		comment.value = ''
		commentRef.value.getList()
		
	} catch (err) {
		console.log(err);
	}
}
// 下拉刷新
onPullDownRefresh(() => {});

onShow(() => {});

const onKey=(e)=> {
            // console.log('键盘高度改变', e)
            if (e.height) {
                bottomHeight.value = e.height * 2 - (systemBottom.value * 2);
                // console.log('键盘打开', 'bottomHeight.value', bottomHeight.value);
            } else {
                // console.log('键盘关闭');
                bottomHeight.value = 0;
            }
        }
onReady(() => {

	        // 监听键盘高度变化
	        uni.onKeyboardHeightChange(onKey);
	        // 获取系统底部虚拟按键高度
	        uni.getSystemInfo({
	            success(e) {
	                console.log('参数', e.safeAreaInsets);
	                if (e && e.safeAreaInsets && e.safeAreaInsets.bottom) {
	                    systemBottom.value = e.safeAreaInsets.bottom;
	                }
	            }
	        })
});
onLoad((options) => {
	getInfo(Number(options.clockId));
});
</script>

<style lang="less" scoped>
.container {
	background: #f5f5f5;
	height: 100vh;
	.comment-btn {
		background: #f24643;
		width: 100rpx;
		text-align: center;
		color: #ffffff;
		padding: 5rpx 10rpx;
		border-radius: 20rpx;
	}
	.main {
		padding: 0 20rpx;
		.ydk {
			background: #ffffff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: -60rpx;
		}
		.intro {
			margin-top: 20rpx;
			background: #ffffff;
			border-radius: 20rpx;
			padding: 20rpx;
		}
	}
}
</style>
