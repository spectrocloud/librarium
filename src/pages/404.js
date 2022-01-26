import React from "react";
import styled from "styled-components";

import backgroundImage from "assets/404.jpg";
import spaceMan from "assets/man_space_lost.png";

const ContentWrapper = styled.div`
  background-image: url(${backgroundImage});
  height: 100vh;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background-color: white;
  max-width: 1200px;
  overflow: hidden;
  text-align: center;
  border-radius: 20px;
  margin: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const BoundingBox = styled.div`
  display: inline-block;
  padding: 20px;
  width: 320px;
`;
const Man = styled.img`
  margin: 0 20px;
  width: 50%;
  @media (max-height: 500px) {
    display: none;
  }
`;

const Title = styled.h1`
  color: #206cd1;
`;

export default function Error() {
  return (
    <>
      <ContentWrapper>
        <Content>
          <BoundingBox>
            <Title>404 Lost in Space</Title>
            <p>Oooops. Looks like the page you're are trying to reach is no longer available.</p>
          </BoundingBox>
          <Man src={spaceMan} />
        </Content>
      </ContentWrapper>
    </>
  );
}
