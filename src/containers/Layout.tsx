import logo from '../assets/images/logo-rtoc.png';
import throttle from 'lodash.throttle';
import { NavLink, Outlet, useLocation } from 'react-router';
import { useEffect, useRef, useState, type FC, type JSX } from 'react';
import classNames from 'classnames';
import { getUserPicture, userHasAuth } from '../utilities/data';
import defaultProfileImg from '../assets/images/default-profile.jpg';
import { CONTENT_URL } from '../utilities/constants';

interface LayoutProps {
  fullWidth?: boolean;
};

const Layout: FC<LayoutProps> = ({ fullWidth = false }): JSX.Element => {
  const [userProfileImg, setUserProfileImg] = useState<string>(defaultProfileImg);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const userProfileImgRef = useRef<HTMLImageElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const setProfileImg = async () => {
      const userImage = await getUserPicture();
      setUserProfileImg(CONTENT_URL + userImage.thumb);
    };

    const userAuth: boolean = !!userHasAuth();
    if (userAuth) {
      setProfileImg();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement &&
          userMenuRef.current &&
          !userMenuRef.current.contains(event.target) &&
          event.target !== userProfileImgRef.current
      ) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    const stickOnScroll = throttle(() => {
      const sticky = stickyRef.current?.offsetHeight;

      if (sticky && window.pageYOffset > sticky) {
        stickyRef.current?.classList.add('sticky');
      } else {
        stickyRef.current?.classList.remove('sticky');
      }
    }, 100);

    window.addEventListener('scroll', stickOnScroll);

    return () => {
      window.removeEventListener('scroll', stickOnScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div
      className={
        classNames(
          'tw:w-full tw:flex tw:flex-col tw:items-center tw:lg:px-0 tw:px-3 tw:py-9 tw:mx-auto',
          {'tw:lg:w-[800px]': !fullWidth}
      )}
    >
      <div ref={stickyRef} className="tw:h-[42px] tw:fixed tw:w-full">
        <div className="tw:absolute tw:top-0 tw:right-2">
          <img
            ref={userProfileImgRef}
            className="tw:h-[42px] tw:w-[42px] tw:rounded-full tw:object-cover tw:cursor-pointer"
            src={userProfileImg}
            alt="profile picture"
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          />
          <div ref={userMenuRef} className={classNames('box-shadow user-menu', {'tw:hidden': !isMenuVisible})}>
            <ul >
              <li>
                <NavLink to="/profile" onClick={() => setIsMenuVisible(false)}>Profile</NavLink>
              </li>
              <li>
                <NavLink to="/matrix" onClick={() => setIsMenuVisible(false)}>Matrix</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="tw:w-full tw:flex tw:flex-col tw:items-center">
        <img className="tw:w-20 tw:mb-1" src={logo} alt="logo" />
        { title && <h2 className="tw:text-center tw:mb-8">{ title }</h2> }
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
