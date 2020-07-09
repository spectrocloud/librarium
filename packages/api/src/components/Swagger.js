import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';

import CodeHighlight from "./CodeHighlight";

const colors = {
  get: '#4aa908',
  post: '#f5a632',
  put: '#f5a632',
  patch: '#f5a632',
  delete: '#f54432',
};

const Button = styled.button`
  text-transform: uppercase;
  background-color: transparent;
  border: 0;
  color: ${props => props.color};
  margin-right: 16px;
  padding: 0;
`;
const Signature = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 30px 0;

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
  margin-bottom: 10px;
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
  margin: 20px 0;
`;

const ResponsesWrapper = styled.div`
  margin-left: 60px;
`;
const OperationWrap = styled.div`
  display: flex;
  > * {
    width: 50%;
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
    content: "${props => props.type}";
    position: absolute;
    top: 0px;
    right: 1rem;
    font-size: 0.7rem;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #fff;
    padding: 2px 10px;
    border-radius: 0px 0px 5px 5px;
    background: #78909C;
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

const normalizePath = path => {
  if (!path.endsWith('.{format}')) return path;

  return path.substring(0, path.length - 9);
};

function Property({ label, value }) {
  return (
    <Summary>
      <Label>{label}:</Label> {value || `No ${label}`}
    </Summary>
  )
}

function Parameters({ parameters, method, path }) {
  if (!parameters?.length) {
    return (
      <Summary>
        <Label>Parameters:</Label> No parameters
      </Summary>)
  }

  function renderParameter(parameter) {
    return (
      <tr
        key={path + method + parameter.name + parameter.paramType}
      >
        <td>{parameter.name}</td>
        <td>{parameter.type}</td>
        <td>{parameter.description}</td>
        <td>
          {typeof parameter.required == 'undefined' ||
            parameter.required == false
            ? 'no'
            : 'yes'}
        </td>
      </tr>
    );
  }

  return (
    <>
      <Label>Parameters:</Label>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map(renderParameter)}
        </tbody>
      </table>
    </>
  )
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
  )
}

function ResponseMessages({ responseMessages }) {
  if (!responseMessages || responseMessages.length === 0) {
    return null;
  }

  return responseMessages.map(response => (
    <Response type="response">
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
      {props.documentation.apis.map(api =>
        api.operations.map(operation => (
          <Operation key={operation.method + api.path}>
            <Signature>
              <Button color={colors[operation.method]}>{operation.method}</Button>&#8594;
              <h4>{props.prefix + normalizePath(api.path)}</h4>
            </Signature>
            <OperationWrap>
              <div>
                <Property label="summary" value={operation.summary} />
                <Property label="description" value={operation.description} />
                <Parameters
                  parameters={operation?.parameters}
                  method={operation.method}
                  path={api?.path}
                />
                <RequestBody body={operation.body} />
              </div>
              <ResponsesWrapper>
                <ResponseMessages responseMessages={operation.responseMessages} />
              </ResponsesWrapper>
            </OperationWrap>
            <Hr />
          </Operation>
        ))
      )}
    </div>
  );
}
