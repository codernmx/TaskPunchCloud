<template>
	<view style="height: 45rpx"></view>
	<view class="d-flex align-items-center space-between">
		<view class="d-flex align-items-center">
			<image :src="icon" style="width: 56rpx;height: 56rpx" class="mr-2"></image>
			{{name}}
		</view>
		<image src="/static/right.png" style="width: 56rpx;height: 56rpx"></image>
	</view>
	<view style="height: 45rpx"></view>
	<u-line></u-line>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';

const emit = defineEmits (['click']);
const props = defineProps ({
	icon: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: '',
		required: true
	}
});
// const click =()=>{
// 	emit('click')
// }
// 下拉刷新
onPullDownRefresh (() => {
});

onShow (() => {
});

onMounted (() => {
});
</script>

<style lang="less" scoped>

</style>
