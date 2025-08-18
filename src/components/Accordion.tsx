import triangleIcon from '../assets/images/icon-triangle.svg';
import classNames from 'classnames';
import { useRef, useState, type FC, type JSX, type PropsWithChildren } from 'react';

interface AccordionProps extends PropsWithChildren {
  title: string;
  isParent?: boolean;
};

const Accordion: FC<AccordionProps> = ({ title, isParent = false, children }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const onClickToggleChildren = (expanded = false) => {
    const childNodes: NodeListOf<Element> | undefined = panelRef.current?.querySelectorAll('.accordion');

    childNodes?.forEach((_, i: number) => {
      if (childNodes) {
        const childPanelBody: HTMLElement | null = childNodes[i].querySelector('.accordion__body');

        if (childPanelBody) {
          const button: HTMLElement | undefined = panelRef.current?.querySelectorAll('button.accordion__button')[i] as HTMLElement;
          const isChildExpanded: boolean = !childPanelBody.classList.contains('tw:hidden');

          if (expanded) {
            if (!isChildExpanded) {
              button?.click();
            }
          } else {
            if (isChildExpanded) {
              button?.click();
            }
          }
        }
      }
    });
  };

  const handleClick = () => {
    const expanded = !isExpanded;
    setIsExpanded(expanded);

    if (isParent) {
      onClickToggleChildren(expanded);
    }
  };

  return (
    <div className="accordion">
      <button className="accordion__button" onClick={handleClick}>
        <span
          className={classNames('tw:w-full tw:px-2 tw:py-2.5 tw:inline-flex tw:justify-between', {'tw:border-b tw:border-gray-300': !isExpanded})}
        >
          <strong>{title}</strong>
          <img className={classNames('tw:transition tw:duration-300', {'tw:rotate-180': isExpanded})} src={triangleIcon} alt="triangle icon" />
        </span>
      </button>
      <div ref={panelRef} className={classNames('accordion__body', { 'tw:hidden': !isExpanded && !isParent })}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
