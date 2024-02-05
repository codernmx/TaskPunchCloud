<script setup>
import { ref, reactive } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
const tableData = ref([]);
const dataVal = reactive({
	teamId: '',
	page: 1,
	total: 0
});
const scrolltolower = () => {
	if (tableData.value.length < dataVal.total) {
		dataVal.page++;
		getList();
	} else {
		console.log('到底了');
	}
};
const getList = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/user_list', {
			teamId: dataVal.teamId,
			page: dataVal.page,
			pageSize: 15
		});
		tableData.value = [...tableData.value, ...res.data.list];
		dataVal.total = res.data.total;
	} catch (err) {
		console.log(err);
	}
};
const toDetail = ({ userId }) => {
	uni.navigateTo({
		url: '/pages/userList/userDetail?userId=' + userId + '&status=2'
	});
};
onLoad((options) => {
	dataVal.teamId = options.teamId;
	uni.setNavigationBarTitle({
		title:options.teamName
	})
	getList();
});
</script>

<template>
	<view class="u-page">
		<u-list @scrolltolower="scrolltolower" width="100%">
			<u-list-item v-for="(item, index) in tableData" :key="index">
				<view class="item-list" @click="toDetail(item)">
					<u-cell :title="item.realName">
						<template #icon>
							<u-avatar shape="circle" size="35" :src="item.avatarUrl" customStyle="margin: -3px 5px -3px 0"></u-avatar>
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
<style>
.u-cell {
	width: 90%;
}
</style>
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
