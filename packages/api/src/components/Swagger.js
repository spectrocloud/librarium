import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';

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
`;

const ResponseCodes = styled(Label)`
  margin-top: 90px;
`;

const Hr = styled.hr`
  border: 0;
  margin-top: 80px;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(68, 50, 245, 0.75),
    rgba(0, 0, 0, 0)
  );
`;

const Summary = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;
`;

const normalizePath = path => {
  if (!path.endsWith('.{format}')) return path;

  return path.substring(0, path.length - 9);
};

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
            {operation.summary && (
              <Summary>
                <Label>Summary:</Label> {operation.summary}
              </Summary>
            )}
            {operation.parameters?.length > 0 ?
              <>
                <Label>Parameters:</Label>
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Context</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operation.parameters.map(parameter => (
                      <tr key={api.path + operation.method + parameter.name + parameter.paramType}>
                        <td>{parameter.paramType}</td>
                        <td>{parameter.name}</td>
                        <td>{parameter.type}</td>
                        <td>{parameter.description}</td>
                        <td>
                          {typeof parameter.required == 'undefined' || parameter.required == false
                            ? 'no'
                            : 'yes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
              : <Summary><Label>Parameters:</Label> No Parameters</Summary>
            }
            <ResponseCodes>Response codes:</ResponseCodes>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>HTTP code</th>
                  <th>Reason</th>
                  <td>Response model</td>
                </tr>
              </thead>
              <tbody>
                {operation.responseMessages &&
                  operation.responseMessages.map(response => (
                    <tr key={api.path + operation.method + response.code}>
                      <td>{response.code}</td>
                      <td>{response.message}</td>
                      <td>
                        {response.responseModel ? (
                          <a href={'#' + response.responseModel}>{response.responseModel}</a>
                        ) : (
                            'N/A'
                          )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Hr />
          </Operation>
        ))
      )}

      {props.documentation.models &&
        Object.keys(props.documentation.models).map(modelKey => {
          const model = props.documentation.models[modelKey];
          return (
            <div key={modelKey} id={modelKey}>
              <h4>{modelKey}</h4>
              {model.description && <p>{model.description}</p>}
              <h5>Properties:</h5>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <td>Format</td>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(model.properties).map(propertyKey => {
                    const property = model.properties[propertyKey];
                    return (
                      <tr key={modelKey + propertyKey}>
                        <td>{property.type}</td>
                        <td>{property.description}</td>
                        <td>{property.format}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
    </div>
  );
}
