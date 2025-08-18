import triangleIcon from '../assets/images/icon-triangle.svg';
import classNames from 'classnames';
import { useEffect, useRef, useState, type FC, type JSX, type PropsWithChildren } from 'react';

// =======================================================================================================
// ============================================== README =================================================
// =======================================================================================================
// Accordion component with transitions via CSS.
// Currently replaced with Accordion.tsx due to state updates breaking the Accordion layout when CSS
// associated with transitions are implemented. Perhaps a solution can be found in future but for now
// I do not find it important to spend the time to figure it out.

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
      panelRef.current.style.overflow = 'visible';
    }
  }, [isNested]);

  const onClickCollapseChildren = () => {
    const childNodes: NodeListOf<Element> | undefined = panelRef.current?.querySelectorAll('.accordion');

    childNodes?.forEach((_, i: number) => {
      if (childNodes) {
        const childPanelBody: HTMLElement | null = childNodes[i].querySelector('.accordion__body');

        if (childPanelBody) {
          const maxHeight = childPanelBody.style.maxHeight;
          const button: HTMLElement | undefined = panelRef.current?.querySelectorAll('button.accordion__button')[i] as HTMLElement;

          if (isExpanded) {
            if (parseInt(maxHeight, 10) > 0) {
              button?.click();
            }
          } else {
            if (parseInt(maxHeight, 10) === 0) {
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

    if (panelRef.current) {
      if (expanded) {
        // using a setTimeout to delay setting overflow to visible so that collapsing Accordion layout does not break due
        // to CSS adjustments for Dropdowns to overlap the .accordion__body
        // NOTE: the timing has to be the same as the transition duration specified as part of .accordion__body's CSS

        setTimeout(() => {
          if (panelRef.current) {
            panelRef.current.style.overflow = 'visible';
          }
        }, 200);
      } else {
        panelRef.current.style.overflow = 'hidden';
      }
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
      <div ref={panelRef} className={classNames('accordion__body', { 'tw:overflow-hidden': false })}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
