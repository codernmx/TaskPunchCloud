<!--
 * @Date: 2024-02-04 10:04:55
 * @LastEditTime: 2024-02-04 12:38:42
-->
<script>
import { useUserStore } from '@/store/index';
export default {
	onLaunch: function () {
		// uni.login({
		// 	provider: 'weixin',
		// 	onlyAuthorize: true, // 微信登录仅请求授权认证
		// 	success: async ({ code }) => {
		// 		uni.showLoading({
		// 			mask:true,
		// 			title:'加载中'
		// 		})
		// 		const res = await uni.$u.http.post('/api/weapp/login', { code });
		// 		const userStore = useUserStore();
		// 		userStore.userInfo = res.data;
		// 		userStore.token = res.data.token;
		// 		console.log(userStore, 'userStore');
		// 		uni.setStorageSync('userInfo', res.data);
		// 		uni.setStorageSync('token', res.data.token);
		// 		uni.hideLoading()
		// 	},
		// 	fail: (err) => {
		// 		console.log(err, 'err------------------>');
		// 		uni.$u.toast(err.errMsg);
		// 	},
		// 	complete() {}
		// });
	},
	onShow: function (options) {
		console.log('App Show--->', options);
		this.updateApp();
		// this.getUserInfo();
	},
	onHide: function () {
		console.log('App Hide');
	},
	methods: {
		async getUserInfo() {
			try {
				const userId = uni.getStorageSync('userId').toString()
				if(!userId){
					return
				}
				const res = await uni.$u.http.post('/api/user/user_list', {
					userId,
				});
				const userStore = useUserStore();
				userStore.userInfo = res.data.list[0]
				uni.setStorageSync('userInfo', res.data.list[0]);
				uni.setStorageSync('userId', res.data.list[0].userId);
			} catch (err) {
				console.log(err);
			}
		},
		updateApp: function () {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					uni.$u.toast('检测到新版本~');
				}
			});
			updateManager.onUpdateReady(function (res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function (res) {
				uni.showToast({
					title: '更新失败',
					icon: 'none',
					duration: 2000
				});
				// 新的版本下载失败
			});
		}
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uni_modules/uview-plus/index.scss';

page {
	max-width: 1000rpx;
	margin: 0 auto;
	min-height: calc(100% - 56rpx);
}

</style>
