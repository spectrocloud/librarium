import React from "react";
import _ from "underscore";
import styled from "styled-components";

import CodeHighlight from "./CodeHighlight";
import DeprecatedTag from "shared/components/common/DeprecatedTag";

const colors = {
  get: "#4aa908",
  post: "#f5a632",
  put: "#f5a632",
  patch: "#f5a632",
  delete: "#f54432",
};

const Button = styled.button`
  text-transform: uppercase;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.color};
  margin-right: 16px;
  padding: 0;
`;
const Signature = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 30px 0;
  margin-bottom : 40px;

  h4 {
    margin-bottom: 0;
    margin: 0 16px;
    word-break: break-word;
  }
`;
const Operation = styled.div`
  margin-bottom: 100px;
  position: relative;
`;

const Label = styled.div`
  font-weight: bold;
  color: #555;
  margin-right: 10px;
  text-transform: capitalize;
`;

const Hr = styled.hr`
  border: 0;
  margin-top: 80px;
  height: 1px;
  background-color: #ddd;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  white-space: pre-line;
`;

const ResponsesWrapper = styled.div`
  margin-left: 60px;

  @media (max-width: 1730px) {
    margin: 20px 0;
  }
`;
const OperationWrap = styled.div`
  display: flex;
  > * {
    width: 50%;
  }

  @media (max-width: 1730px) {
    flex-direction: column;
    > * {
      width: 100%;
    }
  }
`;

const Response = styled.div`
  background-color: rgb(251, 251, 251);
  padding: 10px 20px;
  color: #555;
  border-radius: 4px;
  position: sticky;
  top: 100px;
  font-size: 14px;
  max-height: 600px;
  overflow-y: auto;

  &:after {
    content: "${(props) => props.type}";
    position: absolute;
    top: 0px;
    right: 1rem;
    font-size: 0.7rem;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #fff;
    padding: 2px 10px;
    border-radius: 0px 0px 5px 5px;
    background: #78909c;
  }

  pre {
    margin: 0;
  }

  label {
    font-weight: 500;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
`;

const Table = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const StyledDeprecatedTag = styled(DeprecatedTag)`
  margin-right: 16px;
`;

const normalizePath = (path) => {
  if (!path.endsWith(".{format}")) return path;

  return path.substring(0, path.length - 9);
};

function Property({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <Summary>
      <Label>{label}:</Label> {value}
    </Summary>
  );
}

function Parameters({ parameters, method, path, title }) {
  if (!parameters?.length) {
    return null;
  }

  function renderParameter(parameter, index) {
    return (
      <tr key={index} key={path + method + parameter.name + parameter.paramType}>
        <td>{parameter.name}</td>
        <td>{parameter.type}</td>
        <td>{parameter.description}</td>
        <td>
          {typeof parameter.required == "undefined" || parameter.required == false ? "no" : "yes"}
        </td>
      </tr>
    );
  }

  return (
    <Table>
      <Label>{title}:</Label>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>{parameters.map(renderParameter)}</tbody>
      </table>
    </Table>
  );
}

function RequestBody({ body }) {
  if (!body) {
    return null;
  }

  return (
    <Response type="request">
      <label>Body</label>
      <CodeHighlight code={body} />
    </Response>
  );
}

function ResponseMessages({ responseMessages }) {
  if (!responseMessages || responseMessages.length === 0) {
    return null;
  }

  return responseMessages.map((response, index) => (
    <Response type="response" key={index}>
      <label>HTTP code:</label> {response.code} <br />
      <label>Description:</label> {response.description} <br />
      {response.schema && response.schema !== "null" && (
        <>
          <label>Response body:</label>
          <CodeHighlight code={response.schema} />
        </>
      )}
    </Response>
  ));
}

export default function Swagger(props) {
  return (
    <div>
      {props.documentation.apis.map((api, index) =>
        api.operations.map(operation => (
          <div id={operation.operationId}>
              <div style={{paddingTop: 100}}
                   key={operation.method + api.path}>
                  <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", marginRight: 20, justifyContent: "center", alignItems: "center" }}>
                      <a href={"#" + operation.operationId}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" 
                          d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path>
                        </svg>
                      </a>
                    </div>
                    <Signature>
                        {operation?.description?.includes("Deprecated") && <StyledDeprecatedTag/>}
                        <Button color={colors[operation.method]}>{operation.method}</Button>
                        <h4>{props.prefix + normalizePath(api.path)}</h4>
                    </Signature>
                  </div>
                  <OperationWrap>
                      <div>
                          <Property label="summary" value={operation.summary}/>
                          <Property label="description" value={operation.description}/>
                          <Parameters
                              title="Parameters"
                              parameters={operation?.parameters}
                              method={operation.method}
                              path={api?.path}
                          />
                          <Parameters
                              title="Path parameters"
                              parameters={operation?.pathParameters}
                          />
                          <RequestBody body={operation.body}/>
                      </div>
                      <ResponsesWrapper>
                          <ResponseMessages key={index} responseMessages={operation.responseMessages}/>
                      </ResponsesWrapper>
                  </OperationWrap>
              <Hr/>
          </div>
          </div>)
        )
      )}
    </div>
  );
}
