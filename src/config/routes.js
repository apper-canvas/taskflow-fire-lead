import HomePage from '@/components/pages/HomePage';

export const routes = {
  home: {
    id: 'home',
label: 'Tasks',
    path: '/home',
    icon: 'CheckSquare',
    component: HomePage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: () => null // Placeholder as it's not directly used by router in App.jsx
}

export const routeArray = Object.values(routes);