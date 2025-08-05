import triangleIcon from '../assets/images/icon-triangle.svg';
import classNames from 'classnames';
import { useEffect, useRef, useState, type FC, type JSX, type PropsWithChildren } from 'react';

interface AccordionProps extends PropsWithChildren {
  title: string;
  isNested?: boolean;
};

const Accordion: FC<AccordionProps> = ({ title, isNested = false, children }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.style.maxHeight = panelRef.current.scrollHeight + 'px';
    }
  }, [isNested]);

  const onClickCollapseChildren = () => {
    const childNodes: NodeListOf<Element> | undefined = panelRef.current?.querySelectorAll('.accordion');

    childNodes?.forEach((_, i: number) => {
      if (childNodes) {
        const childPanelBody: HTMLElement | null = childNodes[i].querySelector('.accordion__body');

        if (childPanelBody) {
          const maxHeight = childPanelBody.style.maxHeight;

          if (parseInt(maxHeight, 10) > 0) {
            panelRef.current?.querySelectorAll('button')[i].click();
          } else if (isExpanded === false) {
            panelRef.current?.querySelectorAll('button')[i].click();
          }
        }
      }
    });
  };

  const handleClick = () => {
    const expanded = !isExpanded;
    setIsExpanded(expanded);

    if (isNested) {
      onClickCollapseChildren();
    } else {
      if (panelRef.current) {
        if (expanded) {
          panelRef.current.style.maxHeight = panelRef.current.scrollHeight + 'px';
        } else {
          panelRef.current.style.maxHeight = '0px';
        }
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
      <div ref={panelRef} className="accordion__body tw:overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Accordion;
