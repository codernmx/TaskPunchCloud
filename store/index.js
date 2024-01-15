import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useUserStore = defineStore ('user', () => {
	const userInfo = reactive ({
		energy:0
	});
	const token = ref (null)
	return { userInfo, token };
});

