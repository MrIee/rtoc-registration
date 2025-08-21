import { useEffect, useRef, useState, type FC, type JSX, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPicture } from '../store/userPictureSlice';
import type { RootState } from '../store/store';
import throttle from 'lodash.throttle';
import classNames from 'classnames';
import { NavLink } from 'react-router';
import { getUser, getUserPicture, userHasAuth } from '../utilities/data';
import { CONTENT_URL } from '../utilities/constants';
import type { UserPicture } from '../utilities/interfaces';

interface MenuLink {
  url: string;
  label: string;
};

const Menu: FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const stickyRef = useRef<HTMLDivElement>(null);
  const userProfileImgRef = useRef<HTMLImageElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const pictureUrl = useSelector((state: RootState) => state.userPicture.pictureUrl);
  const URL = useRef('');

  useEffect(() => {
    const setProfileImg = async () => {
      const user = await getUser();
      URL.current = user.URL;
      const userImage: UserPicture = await getUserPicture();
      dispatch(setPicture(CONTENT_URL + userImage.thumb));
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
      const sticky = 36 + (stickyRef.current?.offsetHeight || 0);

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

  const menuLinks: Array<MenuLink> = [
    { url: '/user-details', label: 'Personal Information' },
    { url: '/profile/' + URL.current, label: 'Public Profile' },
    { url: '/profile', label: 'Edit Profile' },
    { url: '/matrix', label: 'Matrix' },
  ];

  const printMenuLinks: ReactNode = menuLinks.map((link: MenuLink, i: number) =>
    <li key={i}><NavLink to={link.url} onClick={() => setIsMenuVisible(false)}>{link.label}</NavLink></li>
  );

  return (
    <div ref={stickyRef} className="tw:h-[42px] tw:fixed tw:w-full">
      <div className="tw:absolute tw:top-0 tw:right-2">
        { pictureUrl &&
          <img
            ref={userProfileImgRef}
            className="tw:h-[42px] tw:w-[42px] tw:rounded-full tw:object-cover tw:cursor-pointer"
            src={pictureUrl}
            alt="profile picture"
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          />
        }
        <div ref={userMenuRef} className={classNames('box-shadow user-menu', {'tw:hidden': !isMenuVisible})}>
          <ul>{ printMenuLinks }</ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
