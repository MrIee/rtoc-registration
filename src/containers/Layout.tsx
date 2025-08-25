import logo from '../assets/images/logo-rtoc.png';
import { Outlet, useLocation } from 'react-router';
import { useEffect, useState, type FC, type JSX } from 'react';
import classNames from 'classnames';
import Menu from '../components/Menu';

interface LayoutProps {
  fullWidth?: boolean;
};

const Layout: FC<LayoutProps> = ({ fullWidth = false }): JSX.Element => {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    switch (location.pathname) {
      case '/create-profile/':
      case '/create-profile':
        setTitle('Create a Profile');
        setShowMenu(false);
        break;
      case '/profile/':
      case '/profile':
        setTitle('Profile');
        break;
      case '/matrix/':
      case '/matrix':
        setTitle('Trainers Matrix');
        break;
      case '/user-details/':
      case '/user-details':
        setTitle('Personal Information');
        break;
    }
  }, [location.pathname]);

  return (
    <div
      className={
        classNames(
          'tw:w-full tw:flex tw:flex-col tw:items-center tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto',
          {'tw:lg:w-[800px]': !fullWidth}
      )}
    >
      { showMenu && <Menu /> }
      <div className="tw:w-full tw:flex tw:flex-col tw:items-center">
        <img className="tw:w-20 tw:mb-1" src={logo} alt="logo" />
        { title && <h2 className="tw:text-center tw:mb-8">{ title }</h2> }
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
