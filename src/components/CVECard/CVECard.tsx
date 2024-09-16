import React from "react";

export default function CveReportsTable(props) {
  const { cve } = props; // Accessing cve from props

  if (!cve) {
    return <div>No CVE data available</div>;
  }

  return (
    <div>
      <h1>CVE Reports Table</h1>

      <h2>CVE: {cve.cve}</h2>
      <p>
        <strong>Base Score:</strong> {cve.baseScore}
      </p>
      <p>
        <strong>Base Severity:</strong> {cve.baseSeverity}
      </p>
      <p>
        <strong>Security Severity:</strong> {cve.secSeverity}
      </p>
      <p>
        <strong>Impacting:</strong> {cve.isImpacting ? "Yes" : "No"}
      </p>
      <p>
        <strong>Modified Date:</strong> {new Date(cve.modifiedDateTime).toLocaleString()}
      </p>
      <p>
        <strong>Published Date:</strong> {new Date(cve.publishedDateTime).toLocaleString()}
      </p>

      <h3>Groups:</h3>
      <ul>{cve.groups && cve.groups.map((group, index) => <li key={index}>{group}</li>)}</ul>

      <h3>Images:</h3>
      <ul>{cve.images && cve.images.map((image, index) => <li key={index}>{image}</li>)}</ul>

      <h3>Packs:</h3>
      <ul>{cve.packs && cve.packs.map((pack, index) => <li key={index}>{pack}</li>)}</ul>
    </div>
  );
}
