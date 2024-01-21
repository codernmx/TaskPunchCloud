<script setup>
import { ref } from 'vue';

const indexList = ref([]);
const urls = ref([
	'https://cdn.uviewui.com/uview/album/1.jpg',
	'https://cdn.uviewui.com/uview/album/2.jpg',
	'https://cdn.uviewui.com/uview/album/3.jpg',
	'https://cdn.uviewui.com/uview/album/4.jpg',
	'https://cdn.uviewui.com/uview/album/5.jpg',
	'https://cdn.uviewui.com/uview/album/6.jpg',
	'https://cdn.uviewui.com/uview/album/7.jpg',
	'https://cdn.uviewui.com/uview/album/8.jpg',
	'https://cdn.uviewui.com/uview/album/9.jpg',
	'https://cdn.uviewui.com/uview/album/10.jpg'
]);

const scrolltolower = () => {
	loadmore();
};

const loadmore = () => {
	for (let i = 0; i < 30; i++) {
		indexList.value.push({
			url: urls.value[uni.$u.random(0, urls.value.length - 1)]
		});
	}
};
const toDetail = () => {
	uni.navigateTo({
		url: '/pages/userList/userDetail'
	});
};
loadmore();
</script>

<template>
	<view class="u-page">
		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in indexList" :key="index">
				<view class="item-list"  @click="toDetail">
					<u-cell :title="`列表长度-${index + 1}`">
						<template #icon>
							<u-avatar shape="circle" size="35" :src="item.url" customStyle="margin: -3px 5px -3px 0"></u-avatar>
						</template>
					</u-cell>
					<view class="icon-uni">
						<u-icon size="20" name="arrow-right"></u-icon>
					</view>
				</view>
			</u-list-item>
		</u-list>
	</view>
</template>

<style scoped lang="scss">
.u-page {
	width: 100%;
	height: 100vh;
	.item-list {
		width: 100%;
		display: flex;
		align-items: center;
		.icon-uni {
			margin: 0 10px 0 auto;
		}
	}
}
</style>
