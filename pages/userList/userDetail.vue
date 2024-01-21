<script setup>
import { ref, reactive } from 'vue';

const indexList = ref([]);
const dataVal = reactive({
	info: {
		info: {
			rank: 0,
			hisClockNum: 0,
			todayClockNum: 0
		},
		list: []
	}
});

const bottomList = ref([
	{ src: '', value: 88 },
	{ src: '', value: 88 }
]);
const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg');

const scrolltolower = () => {
	loadmore();
};

const loadmore = () => {
	console.log('more');
};
const getList = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/task_list', {
			userId: uni.getStorageSync('userInfo').userId
		});
		dataVal.info = res.data;
		console.log(res.data, 'res.data');
	} catch (err) {
		console.log(err);
	}
};
loadmore();
getList();
</script>

<template>
	<view class="u-page">
		<view>
			<image src="/static/detail.png" style="width: 100%; height: 117px"></image>
			<view class="user-info">
				<image src="/static/user.png" style="width: 100%; height: 155px" />
				<view class="info">
					<view class="top">
						<view style="margin-left: 20px">
							<up-avatar src="" shape="square"></up-avatar>
						</view>
						<view class="name">张三</view>
						<view class="type">用户组1</view>
					</view>
					<view class="bottom">
						<view class="bottom-item">
							<view class="t-title">{{ dataVal.info.info.todayClockNum }}</view>
							<view class="b-title">今日打卡数</view>
						</view>
						<view class="bottom-item">
							<view class="t-title">{{ dataVal.info.info.hisClockNum }}</view>
							<view class="b-title">历史打卡数</view>
						</view>
						<view class="bottom-item">
							<view class="t-title">{{ dataVal.info.info.rank }}</view>
							<view class="b-title">本周排名</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-list @scrolltolower="scrolltolower">
			<u-list-item v-for="(item, index) in dataVal.info.list" :key="index">
				<view class="item-list">
					<view class="top">
						<image src="/static/detail.png" style="width: 60px; height: 60px; margin-right: 10px"></image>
						<view style="width: calc(100% - 60px)">
							<view class="title-1">{{ item.detail }}</view>
							<view class="title-2">{{ item.location }}1</view>
						</view>
					</view>
					<view class="bottom size-26">
						<view class="bottom-item">
							<view class="t-title d-flex align-items-center">
								<u-icon name="share" size="20"></u-icon>
								{{ item.shareNum }}
							</view>
						</view>
						<view class="bottom-item">
							<view class="t-title d-flex align-items-center">
								<u-icon name="thumb-up" size="20"></u-icon>
								{{ item.zanNum }}
							</view>
						</view>
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
	background: #f5f5f5;
	.user-info {
		width: calc(100% - 30px);
		padding: 0 15px 0 15px;
		height: 155px;
		margin-top: -113px;
		.info {
			width: 100%;
			height: 100%;
			margin-top: -140px;
			.top {
				width: 100%;
				display: flex;
				align-items: center;
				height: 48px;
				.name {
					color: #333333;
					margin-left: 12px;
					font-size: 16px;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
				}
				.type {
					border: 1px solid #f53c3c;
					color: #f53c3c;
					font-size: 10px;
					margin-left: 17px;
					border-radius: 2px;
				}
			}
			.bottom {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 60px;
				.bottom-item {
					width: 33%;
					height: 100%;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					justify-content: center;
					.t-title {
						width: 100%;
						text-align: center;
						font-size: 24px;
						font-family: PingFang SC, PingFang SC;
						font-weight: 600;
						color: #333333;
					}
					.b-title {
						width: 100%;
						text-align: center;
						font-size: 12px;
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						color: #666666;
					}
				}
			}
		}
	}
	.item-list {
		width: calc(100% - 30px);
		margin: 10px 15px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		height: 118px;
		border-radius: 10px;
		background: #ffffff;
		.top {
			display: flex;
			width: calc(100% - 40px);
			margin: 10px 20px 0 20px;
			height: 60px;
			.title-1 {
				width: 100%;
				font-size: 14px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 600;
				color: #333333;
				margin-bottom: 5px;
			}
			.title-2 {
				font-size: 11px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				color: #999999;
			}
		}
		.bottom {
			display: flex;
			width: calc(100% - 40px);
			margin: 10px 20px 0 20px;
			border-top: 1px solid #eeeeee;
			height: 37px;
			.bottom-item {
				width: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
