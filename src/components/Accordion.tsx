import triangleIcon from '../assets/images/icon-triangle.svg';
import classNames from 'classnames';
import { useRef, useState, type FC, type JSX, type PropsWithChildren } from 'react';

interface AccordionProps extends PropsWithChildren {
  buttonClasses?: string;
  panelClasses?: string;
  title: string;
};

const Accordion: FC<AccordionProps> = ({ buttonClasses, panelClasses, title, children }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    const expanded = !isExpanded;
    setIsExpanded(expanded);

    if (panelRef.current) {
      if (expanded) {
        panelRef.current.style.maxHeight = panelRef.current.scrollHeight + 'px';
      } else {
        panelRef.current.style.maxHeight = '0px';
      }
    }
  };

  return (
    <>
      <button
        className={classNames('tw:w-full tw:px-4 tw:py-2.5 tw:flex tw:justify-between tw:bg-gray-100 tw:cursor-pointer', buttonClasses)}
        onClick={handleClick}
      >
        <strong>{title}</strong>
        <img className={classNames('tw:transition tw:duration-300', {'tw:rotate-180': isExpanded})} src={triangleIcon} alt="triangle icon" />
      </button>
      <div ref={panelRef} className={classNames('tw:transition-all tw:duration-200 tw:ease-out tw:overflow-hidden', panelClasses)}>
        {children}
      </div>
    </>
  );
};

export default Accordion;
