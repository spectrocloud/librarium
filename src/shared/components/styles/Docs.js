import styled, { css } from 'styled-components';

export const StyledHeading = styled.h1`
  font-style: normal;
  margin: 32px 0;
  font-size: 40px;
  line-height: 60px;
  letter-spacing: -0.02em;
  color: #0d1440;
  font-weight: normal;
  color: #000;
`;

export const Edit = styled.div`
  white-space: nowrap;

  a {
    font-size: 14px;
    font-weight: 500;
    line-height: 1em;
    text-decoration: none;
    color: #555;
    border: 1px solid rgb(211, 220, 228);
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.2s ease-out 0s;
    text-decoration: none;
    color: rgb(36, 42, 49);
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(116, 129, 141, 0.1) 0px 1px 1px 0px;
    height: 30px;
    padding: 5px 16px;
    &:hover {
      background-color: rgb(245, 247, 249);
    }
  }

  @media (max-width: 1100px) {
    float: right;
  }
`;

export const StyledMainWrapper = styled.div`
  max-width: 840px;
  color: #666A80;
  flex-grow: 1;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  .previous,
  .next {
    margin-bottom: 40px;
    width: calc(50% - 8px);
  }

  .content {
    width: 100%;
  }

  @media (max-width: 1100px) {
    .previous {
      order: 0;
    }
    .content {
      order: 1;
    }
    .next {
      order: 2;
    }
  }

  @media (max-width: 600px) {
    .previous,
    .next {
      width: 100%;
    }
  }

  ${props =>
    props.fullWidth &&
    css`
      max-width: none;
    `};

  h1 {
    margin: 32px 0;
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    letter-spacing: -0.5px;

    color: #0d1440;

    ::before {
      display: block;
      content: '';
      width: 1px;
      margin-top: -110px;
      height: 110px;
    }
  }

  h2 {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: 0.25px;

    color: #2d2e55;

    margin: 20px 0;

    ::before {
      display: block;
      content: '';
      width: 1px;
      margin-top: -110px;
      height: 110px;
    }
  }

  h3 {
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    margin: 30px 0;
  }

  ul,
  ol {
    -webkit-padding-start: 40px;
    -moz-padding-start: 40px;
    -o-padding-start: 40px;
    padding: 0px 0px 0px 2em;
    margin: 24px 0;

    li {
      font-weight: normal;
      font-size: 16px;
      line-height: 28px;
      color: #666a80;
      > p {
        margin: 0px;
      }
      > ul,
      > ol {
        margin: 0px;
      }
    }
  }

  a {
    transition: color 0.15s;
    color: #206CD1;
  }

  code {
    border: 1px solid #ede7f3;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.9375em;

    background: #fff;
  }

  table {
    margin: 24px 0;
    width: 100%;
    text-align: left;
    border-radius: 4px 4px 0 0;
    border-collapse: separate;
    border-spacing: 0;

    thead > tr {
      background: #fafafa;
      box-shadow: 0px 1px 0px #ddd;
    }

    th {
      padding: 16px;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: 0.02em;
      color: #777;
    }

    th:first-child {
      border-top-left-radius: 4px;
    }
    th:last-child {
      border-top-right-radius: 4px;
    }

    tbody > tr {
      box-shadow: 0px 1px 0px #f2f2f2;
    }

    tbody > tr > td {
      padding: 16px;
      font-size: 12px;
      line-height: 20px;
      letter-spacing: 0.02em;
      color: #555;
      vertical-align: top;
      text-align: left;

      pre {
        margin: 0;
      }
    }
  }

  pre {
    padding: 10px 5px;
    background: transparent;
  }

  @media (max-width: 767px) {
    padding: 0 15px;
  }
`;
