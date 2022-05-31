import styled, { css } from "styled-components";

import React, { useMemo, useState } from 'react';
import { FolderOutlined, FolderOpenOutlined, RightOutlined } from '@ant-design/icons'
// import AppSidebar from "./Sidebar";

function AppSidebar( props ) {

    let arr = Object.keys(props.data).map(item => {
        return props.data[item].status;
    }) || [];
    const [shouldExpand, setShouldExpand] = useState(arr);

    if(!Object.keys(props.data).length) {
        return null
    }

    let count = props.count + 1;
    return (
        <div>
            {
                Object.keys(props.data).map((item, index) => {
                    if(item == "status") {
                        return null
                    }
                    if(item == "operations"){
                        return <AppSidebarArray operations={props.data[item]} count={count}/>;
                    }
                    return (<div key={index}>
                                <div onClick={()=> {
                                    if(count == 0) {
                                        let pathName = window.location.pathname;
                                        if(!pathName.includes(item)) {
                                            let str = "/api/v1/" + item;
                                            window.location.href = str;
                                        }
                                    }
                                    let arr = JSON.parse(JSON.stringify(shouldExpand));
                                    arr[index] = !shouldExpand[index];
                                    setShouldExpand(arr);
                                }} style={{ color: "#1890ff", marginLeft: 20*count}}>
                                    {
                                        shouldExpand[index] ? <FolderOpenOutlined /> : <FolderOutlined />
                                    }
                                    <span style={{fontSize: 13, marginLeft: 10, cursor: "pointer" }}>
                                        {item}
                                    </span>
                                </div>
                                {
                                    shouldExpand[index] ? <AppSidebar data={props.data[item]} count={count} /> : null
                                }
                        </div>
                    )
                })
            }
        </div>
    );
}

function AppSidebarArray(props) {
    return <div style={{ marginLeft: props.count * 20 }}>
        {
            props.operations.map((item, index) => {
                return (
                    <div style={{ display: "flex" }} key={index} onClick={() => {
                        let location = window.location.href;
                        location = location.split("#")[0];
                        window.location.href = location + "#" + item.operationId;
                    }}>
                        {/* <div style={{ marginRight: 6 }}><RightOutlined style={{ fontSize: 12}} /></div> */}
                        <div className="cut-text" style={{ fontSize: 12, cursor: "pointer" }} >{item.summary}</div>
                    </div>
                );
            })
        }
    </div>
}


export const ListItem = ({ className, level, active, ...props }) => {
  return (
    <ListItemWrap className={className} isActive={active} {...props}>
      <a href={props.to}>{props.children}</a>
    </ListItemWrap>
  );
};

export default AppSidebar;

// TODO clean up these styles
export const Sidebar = styled.aside`
  overflow: auto;
  background: transparent;

  .rightSideTitle {
    font-size: 10px;
    line-height: 1;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    padding: 7px 24px 7px 16px;

    color: #666a80;
  }

  .rightSideBarUL {
    margin-top: 32px;
    padding: 0;
    border-left: 1px solid #e6ecf1;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

const ListItemWrap = styled.li`
  list-style-type: none;

  a {
    text-decoration: none;
    font-weight: ${({ level }) => (level === 0 ? 700 : 400)};
    padding: 0.45rem 0 0.45rem ${(props) => 2 + (props.level || 0) * 1}rem;
    display: block;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #9698a9;
    padding: 7px 24px 7px 16px;

    ${(props) =>
      props.isActive &&
      css`
        color: #206cd1;
      `};

    :hover {
      color: #206cd1 !important;
    }
  }
`;
