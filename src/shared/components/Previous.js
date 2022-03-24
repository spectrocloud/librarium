import React, { useMemo } from "react";
import Link from "./Link";

import { StyledPrevious } from "./styles/PageNavigationButtons";

const Previous = ({ mdx, nav }) => {
  const { previousInfo, currentIndex } = useMemo(() => {
    let currentIndex = nav.findIndex((el) => {
      return el && el.url === mdx.fields.slug;
    });

    const previousInfo = {};

    if (currentIndex === -1 || currentIndex === undefined) {
      previousInfo.url = null;
      previousInfo.title = null;
      currentIndex = -1;
    } else {
      if (nav[currentIndex - 1]) {
        previousInfo.url = nav[currentIndex - 1].url;
        previousInfo.title = nav[currentIndex - 1].title;
      }
    }

    if (currentIndex === 0) {
      previousInfo.url = null;
      previousInfo.title = null;
    }

    if (currentIndex === nav.length - 1) {
      previousInfo.url = nav[currentIndex - 1] ? nav[currentIndex - 1].url : null;
      previousInfo.title = nav[currentIndex - 1] ? nav[currentIndex - 1].title : null;
    }

    return { previousInfo, currentIndex };
  }, [mdx, nav]);

  return previousInfo.url && currentIndex >= 0 ? (
    <StyledPrevious className="previous">
      <Link to={nav[currentIndex - 1].url} className={"previousBtn"}>
        <div className={"leftArrow"}>
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </g>
          </svg>
        </div>
        <div className={"preRightWrapper"}>
          <div className={"smallContent"}>
            <span>Previous</span>
          </div>
          <div className="nextPreviousTitle">
            <span>{nav[currentIndex - 1].title}</span>
          </div>
        </div>
      </Link>
    </StyledPrevious>
  ) : null;
};

export default Previous;
