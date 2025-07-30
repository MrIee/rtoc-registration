import triangleIcon from '../assets/images/icon-triangle.svg';
import classNames from 'classnames';
import { useRef, useState, type FC, type JSX, type PropsWithChildren } from 'react';

interface AccordionProps extends PropsWithChildren {
  title: string;
};

const Accordion: FC<AccordionProps> = ({ title, children }): JSX.Element => {
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
    <div className="accordion">
      <button
        className="tw:w-full tw:px-4 tw:cursor-pointer"
        onClick={handleClick}
      >
        <span
          className={classNames('tw:w-full tw:px-2 tw:py-2.5 tw:inline-flex tw:justify-between', {'tw:border-b tw:border-gray-300': !isExpanded})}
        >
          <strong>{title}</strong>
          <img className={classNames('tw:transition tw:duration-300', {'tw:rotate-180': isExpanded})} src={triangleIcon} alt="triangle icon" />
        </span>
      </button>
      <div ref={panelRef} className="accordion__body">
        {children}
      </div>
    </div>
  );
};

export default Accordion;
