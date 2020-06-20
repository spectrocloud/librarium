import styled, { css } from "styled-components";

export const StyledHeading = styled.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 52px;
  letter-spacing: -0.02em;
  color: #0d1440;
  color: ${(props) => props.theme.colors.heading};
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
`;

export const StyledMainWrapper = styled.div`
  max-width: 750px;
  color: ${(props) => props.theme.colors.text};
  flex-grow: 1;
  ${(props) =>
    props.fullWidth &&
    css`
      max-width: none;
    `};

  h1 {
    font-weight: 600;
    font-size: 40px;
    line-height: 52px;
    margin: 30px 0;
    letter-spacing: -0.02em;
  }

  h2 {
    font-weight: 500;
    font-size: 32px;
    line-height: 42px;
    margin: 30px 0;
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
    margin: 16px 0px;
    padding: 0px 0px 0px 2em;

    li {
      line-height: 1.8;
      font-weight: 400;
    }
  }

  a {
    transition: color 0.15s;
    color: ${(props) => props.theme.colors.link};
  }

  code {
    border: 1px solid #ede7f3;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.9375em;

    background: ${(props) => props.theme.colors.background};
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
      text-transform: capitalize;
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
    }
  }

  pre {
    margin: 18px 0;
    background: transparent;
  }

  @media (max-width: 767px) {
    padding: 0 15px;
  }
`;
