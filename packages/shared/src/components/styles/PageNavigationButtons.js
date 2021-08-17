import styled from 'styled-components';

export const StyledPrevious = styled.div`
  .previousBtn {
    cursor: pointer;
    -moz-box-align: center;
    -moz-box-direction: normal;
    -moz-box-orient: horizontal;
    margin: 0px;
    position: relative;
    display: flex;
    padding: 8px 16px;
    flex-direction: row;
    align-items: center;
    place-self: stretch;
    border-radius: 3px;
    border: 1px solid rgb(230, 236, 241);
    transition: border 200ms ease 0s;
    box-shadow: rgba(116, 129, 141, 0.1) 0px 3px 8px 0px;
    text-decoration: none;

    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  .previousBtn:hover {
    text-decoration: none;
    border: 1px solid #1ed3c6;
  }

  .previousBtn:hover .leftArrow {
    color: #1ed3c6;
  }

  .leftArrow {
    display: block;
    color: rgb(157, 170, 182);
    flex: 0 0 auto;
    margin-right: 16px;
    font-size: 24px;
    transition: color 200ms ease 0s;
    display: flex;
    align-items: center;
  }

  .nextPreviousTitle {
    margin: 0px;
    padding: 0px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: #252b53;

    transition: color 200ms ease 0s;
  }
  .nextPreviousTitle span {
    font-weight: 500;
  }

  .smallContent {
    font-size: 14px;
    line-height: 24px;
    color: #666a80;
  }

  .nextRightWrapper {
    height: 100%;
  }
`;

export const StyledNext = styled.div`
  .nextBtn {
    cursor: pointer;
    -moz-box-align: center;
    -moz-box-direction: normal;
    -moz-box-orient: horizontal;
    margin: 0px;
    position: relative;
    display: flex;
    padding: 8px 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    place-self: stretch;
    border-radius: 3px;
    border: 1px solid rgb(230, 236, 241);
    transition: border 200ms ease 0s;
    box-shadow: rgba(116, 129, 141, 0.1) 0px 3px 8px 0px;
    text-decoration: none;

    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
  .nextBtn {
    cursor: pointer;
    -moz-box-align: center;
    -moz-box-direction: normal;
    -moz-box-orient: horizontal;
    margin: 0px;
    position: relative;
    display: flex;
    padding: 6.5px 20px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    place-self: stretch;
    border-radius: 3px;
    border: 1px solid rgb(230, 236, 241);
    transition: border 200ms ease 0s;
    box-shadow: rgba(116, 129, 141, 0.1) 0px 3px 8px 0px;
    text-decoration: none;

    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }

  .nextBtn:hover {
    text-decoration: none;
    border: 1px solid #1ed3c6;
  }

  .nextBtn:hover .rightArrow {
    color: #1ed3c6;
  }

  .rightArrow {
    flex: 0 0 auto;
    font-size: 24px;
    transition: color 200ms ease 0s;
    display: block;
    margin-left: 16px;
    color: rgb(157, 170, 182);
    display: flex;
    align-items: center;
  }

  .nextPreviousTitle {
    margin: 0px;
    padding: 0px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: #252b53;

    transition: color 200ms ease 0s;
  }
  .nextPreviousTitle span {
    font-weight: 500;
  }
  .nextRightWrapper {
    height: 100%;
  }
`;
