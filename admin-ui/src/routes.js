import DashboardLayout from './components/DashboardLayout';
import CategoryAdmin from './pages/CategoryAdmin';
// import SignIn from './components/signin/SignIn'

const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'category', element: <CategoryAdmin /> },
      // { path: 'signin', element: <SignIn /> }
    ]
  },
];

export default routes;
