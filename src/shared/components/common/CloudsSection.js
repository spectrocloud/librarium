import React from "react";
import styled, { css } from "styled-components";

import Link from "../Link";

import aws from "../../assets/clouds/aws.png";
import azure from "../../assets/clouds/azure.png";
import google_cloud from "../../assets/clouds/google_cloud.png";
import vmware from "../../assets/clouds/vmware.png";
import openshift from "../../assets/clouds/openshift.png";
import openstack from "../../assets/clouds/openstack.png";
import maas from "../../assets/clouds/maas.png";

const clouds = {
  aws,
  azure,
  google_cloud,
  vmware,
  openshift,
  openstack,
  maas,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1110px;
  margin: 0px auto;
  overflow: hidden;

  ${(props) =>
    !props.noBorder &&
    css`
      ::after {
        content: " ";
        max-width: 1109.51px;
        width: 100%;
        border: 1px solid #d4d4d4;
        margin-top: 102px;
      }
    `}

  h3 {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: 0.25px;
    color: #2d2e55;
    margin-bottom: 50px !important;
    margin-top: 102px !important;
  }
`;

const Description = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 28px;
  color: #666a80;
  max-width: 936px;
  text-align: center;
  margin-bottom: 50px;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-width: 937px;
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
  width: 130px;
  height: 130px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 5.42752px 14.9257px -2.71376px rgba(21, 24, 51, 0.22);
  margin-bottom: 32px;
  img {
    height: 81px;
  }
`;

const CloudName = styled.div`
  font-weight: normal;
  font-size: 24px;
  line-height: 32px;
  color: #666a80;
`;

function CloudsSection({ noBorder = false, noMargin, title, description, options = [] }) {
  return (
    <Wrapper noBorder={noBorder} noMargin={noMargin}>
      {title ? <h3>{title}</h3> : null}
      {description ? <Description>{description}</Description> : null}
      <CardWrapper>
        {options.map((option) => (
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
