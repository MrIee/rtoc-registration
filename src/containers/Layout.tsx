import logo from '../assets/images/logo-rtoc.png';
import { Outlet, useLocation } from 'react-router';
import type { FC, JSX } from 'react';

const Layout: FC = (): JSX.Element => {
  const location = useLocation();
  let title = '';

  switch (location.pathname) {
    case '/create-profile':
      title = 'Create a Profile';
      break;
    case '/profile':
      title = 'Your Profile';
      break;
    case '/matrix':
      title = 'Trainers Matrix';
      break;
  }


  return (
    <div className="tw:lg:w-[800px] tw:w-full tw:flex tw:flex-col tw:items-center tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto">
      <div className="tw:lg:w-[640px] tw:w-full tw:flex tw:flex-col tw:items-center">
        <img className="tw:w-20 tw:mb-1" src={logo} alt="logo" />
        { title && <h2 className="tw:text-center tw:mb-8">{ title }</h2> }
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
