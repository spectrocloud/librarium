import React from 'react'
import _ from 'underscore'

const colors = {
  'GET': 'pull-left btn btn-lg btn-success',
  'POST': 'pull-left btn btn-lg btn-warning',
  'PUT': 'pull-left btn btn-lg btn-warning',
  'DELETE': 'pull-left btn btn-lg btn-danger'
}

const normalizePath = (path) => {
  if (!path.endsWith('.{format}')) return path

  return path.substring(0, path.length - 9)
}

export default function Swagger(props) {
  return (
    <div>
      {props.documentation.apis.map(api =>
        api.operations.map(operation => (
          <div key={operation.method + api.path} className="well">
            <button style={{ marginRight: '20px' }}
              className={colors[operation.method]}>{operation.method}</button>
            <h4 className="pull-left">{props.prefix + normalizePath(api.path)}</h4>
            <div className="clearfix" style={{ marginBottom: '20px' }}></div>
            {operation.summary && (<p>{operation.summary}</p>)}
            <h5>Parameters:</h5>
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
                    <td>{typeof parameter.required == 'undefined' || parameter.required == false ? 'no' : 'yes'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h5>Response codes:</h5>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>HTTP code</th>
                  <th>Reason</th>
                  <td>Response model</td>
                </tr>
              </thead>
              <tbody>
                {operation.responseMessages && operation.responseMessages.map(response => (
                  <tr key={api.path + operation.method + response.code}>
                    <td>{response.code}</td>
                    <td>{response.message}</td>
                    <td>{response.responseModel ? <a href={'#' + response.responseModel}>{response.responseModel}</a> : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {props.documentation.models && Object.keys(props.documentation.models).map(modelKey => {
        const model = props.documentation.models[modelKey]
        return (
          <div className="well" key={modelKey} id={modelKey}>
            <h4>{modelKey}</h4>
            {model.description && (<p>{model.description}</p>)}
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
                  const property = model.properties[propertyKey]
                  return (
                    <tr key={modelKey + propertyKey}>
                      <td>{property.type}</td>
                      <td>{property.description}</td>
                      <td>{property.format}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>);
}
