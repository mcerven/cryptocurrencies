import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'List',
    component: () => import(/* webpackChunkName: "List" */ './components/coins/list'),
  },
  {
    path: '/coin/:id',
    name: 'Item',
    component: () => import(/* webpackChunkName: "Item" */ './components/coins/item'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;