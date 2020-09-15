import React, { useMemo } from 'react';
import Link from './Link';

import { StyledNext } from './styles/PageNavigationButtons';

const Next = ({ mdx, nav }) => {
  const { nextInfo, currentIndex } = useMemo(() => {
    const currentIndex = nav.findIndex(el => {
      return el && el.url === mdx.fields.slug;
    });

    const nextInfo = {};

    if (currentIndex === undefined) {
      if (nav[0]) {
        nextInfo.url = nav[0].url;
        nextInfo.title = nav[0].title;
      }
      currentIndex = -1;
    } else {
      nextInfo.url = nav[currentIndex + 1] ? nav[currentIndex + 1].url : null;
      nextInfo.title = nav[currentIndex + 1] ? nav[currentIndex + 1].title : null;
    }

    if (currentIndex === 0) {
      nextInfo.url = nav[currentIndex + 1] ? nav[currentIndex + 1].url : null;
      nextInfo.title = nav[currentIndex + 1] ? nav[currentIndex + 1].title : null;
    }

    if (currentIndex === nav.length - 1) {
      nextInfo.url = null;
      nextInfo.title = null;
    }

    return { nextInfo, currentIndex };
  }, [mdx, nav]);

  return (
    <StyledNext className="next">
      {nextInfo.url && currentIndex >= 0 ? (
        <Link to={nav[currentIndex + 1].url} className={'nextBtn'}>
          <div className={'nextRightWrapper'}>
            <div className={'smallContent'}>
              <span>Next</span>
            </div>
            <div className={'nextPreviousTitle'}>
              <span>{nav[currentIndex + 1] && nav[currentIndex + 1].title}</span>
            </div>
          </div>
          <div className={'rightArrow'}>
            <svg
              preserveAspectRatio="xMidYMid meet"
              height="1em"
              width="1em"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
              className="_13gjrqj"
            >
              <g>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </g>
            </svg>
          </div>
        </Link>
      ) : null}
    </StyledNext>
  );
};

export default Next;
