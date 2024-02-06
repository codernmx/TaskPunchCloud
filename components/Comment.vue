<template>
	<view>
		<h-comment-box :list="commentList" @getLike="getLike" @sendComment="sendComment" v-model="inputVal" @getMore="getMore" ref="commontRef" @remove="remove"></h-comment-box>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const commontRef = ref(null); // 评论组件实例
const inputVal = ref(''); // 评论弹框的value

// 模拟当前用户信息
const userInfo = ref({
	id: 999,
	name: 'h_comment',
	url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
	contentStr: '',
	isLike: false,
	likeNum: 0,
	date: '2023-06-01 12:00'
});

/**
 * 点赞事件
 * @param data {index: number, j: number}  index 一级评论的索引 j 回复的索引
 * @param callback  调用点赞接口成功后，调用该方法更新点赞状态
 */
function getLike(data, callback) {
	// j 是给回复点赞，给一级评论点赞时，j 为undefined

	console.log(data); // 输出：{index: 0，j: undefined}

	callback(); // 点赞成功后调用该方法 更新点赞状态
}

/**
 * 发送评论事件
 * @param data {index: number, index_s: number, row: {一级评论的信息}, row_s: { 点击当前回复的信息} }
 * @param callback
 */
function sendComment(data, callback) {
	// 给一级评论回复时，row_s 为空对象 {}
	console.log(data); // 输出： {index: 0, index_s: 0, row: {…}, row_s: {…}}

	const params = { ...userInfo.value, contentStr: inputVal.value };

	// 判断是否有回复的人，有的话，就是回复的回复，没有就是回复的一级评论
	if (data.row_s.id) {
		params.to_user_id = data.row_s.id;
		params.to_user_name = data.row_s.name;
	}

	// 评论接口发送成功后，把当前评论的信息传给 callback(新的评论信息，接口返回) 用于更新评论列表
	callback(params);

	// 关闭评论框
	commontRef.value.close();
}

/**
 * 获取更多评论
 * @param data {index: number, row: {一级评论的信息}}
 * @param callback 调用获取更多回复接口成功后，调用该方法更新回复列表，会自动关闭加载动画
 */
function getMore(data, callback) {
	// 调用 获取更多评论接口，成功后调用 callback(【新的评论信息，接口返回，可是对象】) 用于更新评论列表
	console.log(data, 'data');
	setTimeout(() => {
		callback([
			{
				user_reply_name: 'h_comment',
				user_reply_id: 20,
				isMyComment: true,
				user_reply_content: 'h_comment是基于uniapp和uview的一个评论组件，基于uview评论模版新增了二级评论功能',
				user_reply_avatar: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
				user_reply_is_like: false,
				user_reply_like_num: 33,
				pid: data.row.id,
				user_reply_date: '2023-06-01 12:00',
				to_user_id: '',
				to_user_name: ''
			},
			{
				user_reply_name: 'h_comment_box',
				user_reply_id: 21,
				isMyComment: false,
				pid: data.row.id,
				user_reply_content: 'h_comment是基于uniapp和uview的一个评论组件，基于uview评论模版新增了二级评论功能',
				user_reply_avatar: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
				user_reply_is_like: false,
				user_reply_like_num: 33,
				user_reply_date: '2023-06-01 12:00',
				to_user_id: '',
				to_user_name: ''
			}
		]);
	}, 200);
}

/**
 * 删除评论
 */
function remove(data, callback) {
	// 调用删除接口
	console.log(data);

	// 调用删除接口成功后，调用 callback() 用于更新评论列表
	callback();
}

/*
 * 列表数据
 */
const commentList = ref([
	{
		id: 1,
		user_id: 1,
		user_name: '叶轻眉',
		user_avatar: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
		user_content: '我对这个话题有很深的感触。在我看来，这是一个引发深思的议题。我认为，我们需要更加深入地探讨其中的各个方面，以便得出更全面的结论。',
		user_date: '2021-12-25 18:58',
		allReply: 4,
		user_like_num: 33,
		user_is_like: false,
		isMyComment: true,
		isLoading: false,
		user_reply_list: [
			{
				user_reply_id: 20,
				user_reply_name: '叮叮',
				user_reply_content: '你的观点非常有趣。然而，我个人对这个问题持有不同的见解。我认为这个议题可以从不同的角度来看待，这样我们可能会发现一些新的视角。',
				user_reply_avatar: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
				user_reply_is_like: true,
				user_reply_like_num: 1,
				user_reply_date: '2023-06-01 12:00',
				pid: 1,
				user_isMyComment: false
			},
			{
				user_reply_id: 21,
				user_reply_name: '虎虎',
				user_reply_content: '这个讨论真的很引人入胜。我想深入探讨一下你提到的观点。我认为我们可以进一步挖掘这个话题，以便更好地理解其中的复杂性。',
				user_reply_avatar: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
				user_reply_is_like: false,
				user_reply_like_num: 0,
				user_reply_date: '2023-06-01 19:00',
				to_user_name: '叮叮',
				to_user_id: 20,
				pid: 1,
				user_isMyComment: true
			}
		]
	},
	{
		id: 2,
		user_id: 2,
		user_name: '张三丰',
		user_date: '2021-01-25 13:58',
		user_content: '你的看法让我重新思考了这个问题。我之前没有考虑到你提到的那一点，但现在我认为这是一个非常值得关注的方向。或许我们可以就这个展开更深入的交流。',
		allReply: 0,
		user_like_num: 11,
		user_is_like: false,
		user_avatar: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
		isLoading: false,
		user_reply_list: [],
		isMyComment: false
	},
	{
		id: 3,
		user_id: 3,
		user_name: '鲁班',
		user_date: '2021-03-25 13:58',
		user_content: '基于我的经验，我发现这个问题可能涉及到更多的因素。我想分享一些我之前遇到的类似情况，并探讨它们对我们当前的讨论有什么启示。',
		user_like_num: 21,
		user_is_like: false,
		allReply: 2,
		user_avatar: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
		isLoading: false,
		isMyComment: false,
		user_reply_list: [
			{
				user_reply_id: 20,
				user_reply_name: '小猪',
				user_reply_content: '你的观点让我回想起了一个相似的情境。当时我面临了类似的抉择，经历了一些挑战。我想分享一下那段经历，看看是否对我们的讨论有所启发。',
				user_reply_avatar: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
				user_reply_is_like: true,
				user_reply_like_num: 1,
				user_reply_date: '2023-06-01 12:00',
				pid: 3,
				user_isMyComment: false
			},
			{
				user_reply_id: 21,
				user_reply_name: '小狗',
				user_reply_content: '对于这个问题，我认为关键在于更全面地考虑各种因素。我们可以尝试从不同的角度来看待，以确保我们的讨论更加全面和深刻。',
				user_reply_avatar: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
				user_reply_is_like: false,
				user_reply_like_num: 0,
				user_reply_date: '2023-06-01 19:00',
				to_user_name: '小猪',
				to_user_id: 20,
				pid: 3,
				user_isMyComment: true
			}
		]
	}
]);
</script>

<style></style>
