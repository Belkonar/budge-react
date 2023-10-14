import { RouteObject } from 'react-router-dom';
import AccountEditComponent from './components/account-edit';
import AccountsComponent from './components/accounts';
import Home from './components/home';
import RegisterComponent from './components/register';
import { Root } from './app';
import SchedulesComponent from './components/schedules';

export function getRoutes(): RouteObject[] {
  return [
    {
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/accounts',
          element: <AccountsComponent />,
        },
        {
          path: '/account-new',
          element: <AccountEditComponent />,
        },
        {
          path: '/account-edit/:id',
          element: <AccountEditComponent />,
        },
        {
          path: '/register/:accountId',
          element: <RegisterComponent />,
        },
        {
          path: '/schedules',
          element: <SchedulesComponent />,
        }
      ]
    }
  ];
}
