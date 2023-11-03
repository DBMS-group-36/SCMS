import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';
import TruckIcon from '@heroicons/react/24/solid/TruckIcon';
import BuildingStorefrontIcon from '@heroicons/react/24/solid/BuildingStorefrontIcon';
import ShoppingCartIcon from '@heroicons/react/24/solid/ShoppingCartIcon';
import TicketIcon from '@heroicons/react/24/solid/TicketIcon';
import ArrowTrendingUpIcon from '@heroicons/react/24/solid/ArrowTrendingUpIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Trucks',
    path: '/trucks',
    icon: (
      <SvgIcon fontSize="small">
        <TruckIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingCartIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Stores',
    path: '/stores',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingStorefrontIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Products',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Transportation train trips',
    path: '/transportation_train_trips',
    icon: (
      <SvgIcon fontSize="small">
        <TicketIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Routes',
    path: '/routes',
    icon: (
      <SvgIcon fontSize="small">
        <ArrowTrendingUpIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Account',
  //   path: '/account',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Settings',
  //   path: '/settings',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Login',
  //   path: '/auth/login',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <LockClosedIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Register',
  //   path: '/auth/register',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];
