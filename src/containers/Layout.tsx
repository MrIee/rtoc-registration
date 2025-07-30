import logo from '../assets/images/logo-rtoc.png';
import { Outlet, useLocation } from 'react-router';
import type { FC, JSX } from 'react';
import classNames from 'classnames';

interface LayoutProps {
  fullWidth?: boolean;
};

const Layout: FC<LayoutProps> = ({ fullWidth = false }): JSX.Element => {
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
    <div
      className={
        classNames(
          'tw:w-full tw:flex tw:flex-col tw:items-center tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto',
          {'tw:lg:w-[800px]': !fullWidth}
      )}
    >
      <div className="tw:w-full tw:flex tw:flex-col tw:items-center">
        <img className="tw:w-20 tw:mb-1" src={logo} alt="logo" />
        { title && <h2 className="tw:text-center tw:mb-8">{ title }</h2> }
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
