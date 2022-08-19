import Vue from 'vue';
import VueRouter from 'vue-router';

import { loadweb3 } from '@/utils/web3_stake';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		redirect: '/index',
		name: 'init'
	},
	{
		path: '/index',
		name: 'index',
		redirect: {
			name: 'Pledges_home'
		},
		component: () => import('@/views/home'),
		children: [
			{
				path: 'Pledges_home',
				name: 'Pledges_home',
				component: () => import('@/components/ChooseWay/nft_home')
			},
			{
				path: 'Introduction',
				name: 'Introduction',
				component: () => import('@/components/ChooseWay')
			},


		]
	},
	{
		path: '/Chainrecord',
		name: 'Chainrecord',
		component: () => import('@/components/ChooseWay/Chainrecord')
	},

	{
		path: '/404',
		component: () => import('@/components/NotFound')
	},
	{
		path: '*',
		redirect: '/404'
	}
];

const originalReplace = VueRouter.prototype.replace;

VueRouter.prototype.replace = function replace(location) {
	return originalReplace.call(this, location).catch((err) => { });
};

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => { });
};

const router = new VueRouter({
	routes
});


// router.beforeEach((to, form, next) => {
// 	if (to.name === 'Pledges_home') {
// 		console.log(1)
// 		loadweb3();
// 		next();
// 	}
// 	next();
// });

export default router;
