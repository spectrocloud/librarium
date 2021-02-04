import React from 'react';
import styled from 'styled-components';

import Link from '../Link';

import aws from '../../assets/clouds/aws.png';
import azure from '../../assets/clouds/azure.png';
import google_cloud from '../../assets/clouds/google_cloud.png';
import vmware from '../../assets/clouds/vmware.png';
import bare_metal from '../../assets/clouds/bare_metal.png';

const clouds = {
  aws,
  azure,
  google_cloud,
  vmware,
  bare_metal,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  max-width: 1024px;
  margin: 30px auto 0;
  overflow: hidden;

  ::after {
    content: ' ';
    width: 680px;
    border: 1px solid #dddddd;
    margin-top: 60px;
  }
`;

const Description = styled.div`
  font-size: 14px;
  color: #111;
  max-width: 680px;
  text-align: center;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-width: 880px;
  margin-top: 30px;
  @media (max-width: 830px) {
    overflow-y: auto;
  }
  @media (max-width: 650px) {
    justify-content: flex-start;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 830px) {
    margin: 20px;
    margin-top: 65px;
    justify-content: center;
  }
`;

const Icon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 6px 10px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const CloudName = styled.div`
  color: #777;
  @media (max-width: 830px) {
    text-align: center;
    white-space: nowrap;
  }
`;

function CloudsSection({ title, description, options = [] }) {
  return (
    <Wrapper>
      <h3>{title}</h3>
      <Description>{description}</Description>
      <CardWrapper>
        {options.map(option => (
          <Link to={option.href}>
            <Card>
              <Icon>
                <img src={clouds[option.cloud]} alt={`${option.cloud} icon`} />
              </Icon>
              <CloudName>{option.title}</CloudName>
            </Card>
          </Link>
        ))}
      </CardWrapper>
    </Wrapper>
  );
}

export default CloudsSection;
