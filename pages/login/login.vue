<template>
	<view class="container position-relative" style="padding: 0 60rpx">
		<view class="position-absolute logo"></view>
		<image src="/static/bg.jpg" mode="heightFix" style="opacity: 0.6; width: 100%; height: 100%; position: absolute; margin-left: -60rpx"></image>
		<view class="position-absolute login-form">
			<up-input placeholder="请输入账号" border="surround" v-model="dataVal.form.username" custom-style="background:#ffffff"></up-input>
			<up-input placeholder="请输入密码" border="surround" password clearable v-model="dataVal.form.password" custom-style="margin-top:30rpx;background:#ffffff"></up-input>
			<up-input
				v-if="register"
				placeholder="请重复输入密码"
				border="surround"
				password
				clearable
				v-model="dataVal.form.repassword"
				custom-style="margin-top:30rpx;background:#ffffff"
			></up-input>
			<view v-if="register" style="height: 30rpx"></view>
			<uni-combox
				v-if="register"
				@input="changeCompany"
				:candidates="dataVal.comanyLable"
				placeholder="请选择团队"
				v-model="dataVal.form.campusName"
				@empty="empty"
			></uni-combox>

			<up-input v-if="register" placeholder="请输入手机号" border="surround" v-model="dataVal.form.phone" custom-style="margin-top:30rpx;background:#ffffff"></up-input>
			<up-input v-if="register" placeholder="请输入真实姓名" border="surround" v-model="dataVal.form.realName" custom-style="margin-top:30rpx;background:#ffffff"></up-input>
			<up-button type="error" @click="$u.debounce(login, 700)" :text="!register ? '登录' : '注册'" custom-style="margin-top:30rpx;"></up-button>
			<view class="mt-2" style="text-align: right" @click="register = !register">{{ !register ? '去注册' : '去登录' }}</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/index';
import { formatDate } from '@/util/util';
const userStore = useUserStore();

const dataVal = reactive({
	form: {
		username: uni.getStorageSync('username'),
		password: uni.getStorageSync('password'),
		updateTime: formatDate(new Date())
	},
	comanyLable: []
});
const register = ref(false);
onShow(() => {
	// if (uni.getStorageSync('userInfo')) {
	// 	uni.switchTab({
	// 		url: '/pages/home/home'
	// 	});
	// }
});
const empty = () => {};
const changeCompany = (val) => {
	const obj = dataVal.comanyLableAll.find((item) => item.teamName == val);
	if (!obj) {
		return;
	}
	dataVal.form.teamId = obj.teamId;
	dataVal.form.teamName = obj.teamName;
	console.log(dataVal.form);
};

const getTeamList = async () => {
	try {
		const res = await uni.$u.http.post('/api/user/group_list', {});
		dataVal.comanyLableAll = res.data.list;
		dataVal.comanyLable = res.data.list.map((item) => {
			return item.teamName;
		});
	} catch (err) {
		console.log(err);
	}
};

onLoad((option) => {});

getTeamList();
const login = () => {
	const { username, password, repassword, phone, realName } = dataVal.form;
	if (!username || !password) {
		uni.$u.toast('请输入账号密码');
		return;
	}
	if (register.value) {
		if (!repassword || password != repassword) {
			uni.$u.toast('输入密码不一致');
			return;
		}
		if (!phone || !realName) {
			uni.$u.toast('输入手机号和真实姓名');
			return;
		}
	}
	uni.login({
		provider: 'weixin',
		onlyAuthorize: true, // 微信登录仅请求授权认证
		success: async ({ code }) => {
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			let url = register.value ? '/api/user/register' : '/api/user/wx_login';
			const res = await uni.$u.http.post(url, {
				code,
				...dataVal.form
			});

			if (register.value && res.code === 200) {
				uni.$u.toast('注册成功');
				register.value = true;
			}
			if (!register.value && res.code === 200) {
				uni.$u.toast('登录成功');
				userStore.userInfo = res.data.userInfo;
				userStore.token = res.data.token;
				uni.setStorageSync('userInfo', res.data.userInfo);
				uni.setStorageSync('token', res.data.token);

				uni.setStorageSync('username', username);
				uni.setStorageSync('password', password);

				setTimeout(() => {
					
					uni.switchTab({
						url: '/pages/home/home'
					});
				}, 1000);
			}
		},
		fail: (err) => {
			console.log(err, 'err------------------>');
		},
		complete() {
			uni.hideLoading();
		}
	});
};
</script>

<style lang="less" scoped>
.container {
	height: 100vh;
	overflow: hidden;
	.login-form {
		top: 20%;
		width: calc(100% - 120rpx);
	}
	.logo {
		top: 30%;
		width: 100%;
		text-align: center;
	}
}
</style>
