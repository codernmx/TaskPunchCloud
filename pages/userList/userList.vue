<script setup>
import { ref } from 'vue';

const indexList = ref([]);

const scrolltolower = () => {
	loadmore();
};
const getList = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/user_list', {
			teamId: uni.getStorageSync('userInfo').teamId
		});
		indexList.value = res.data.list
	} catch (err) {
		console.log(err);
	}
};
const toDetail = () => {
	uni.navigateTo({
		url: '/pages/userList/userDetail'
	});
};
// loadmore();
getList();
</script>

<template>
	<view class="u-page">
		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in indexList" :key="index">
				<view class="item-list" @click="toDetail">
					<u-cell :title="item.realName">
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
