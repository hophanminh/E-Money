import DashboardLayout from './components/DashboardLayout';
import CategoryAdmin from './pages/CategoryAdmin';
import TeamList from './components/Teams/TeamList'

const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'category', element: <CategoryAdmin /> },
      { path: 'teams', element: <TeamList /> },
    ]
  },
];

export default routes;
