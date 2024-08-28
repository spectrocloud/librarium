import React from "react";

// Define the CVE data structure (TypeScript interface)
interface CVEData {
  baseScore: number;
  baseSeverity: string;
  cve: string;
  groups: string[];
  images: string[];
  isImpacting: boolean;
  modifiedDateTime: string;
  publishedDateTime: string;
  secSeverity: string;
  summary: string;
}

// Create the CVECard component
const CVECard: React.FC<{ cve: CVEData }> = ({ cve }) => {
  return (
    <div className="cve-card">
      <h2>
        {cve.cve} - {cve.baseSeverity}
      </h2>
      <p>
        <strong>Base Score:</strong> {cve.baseScore}
      </p>
      <p>
        <strong>Summary:</strong> {cve.summary}
      </p>
      <p>
        <strong>Published Date:</strong> {new Date(cve.publishedDateTime).toLocaleDateString()}
      </p>
      <p>
        <strong>Modified Date:</strong> {new Date(cve.modifiedDateTime).toLocaleDateString()}
      </p>
      <p>
        <strong>Security Severity:</strong> {cve.secSeverity}
      </p>
      <p>
        <strong>Groups:</strong> {cve.groups.join(", ")}
      </p>
      <p>
        <strong>Images:</strong>
      </p>
      <ul>
        {cve.images.map((image, index) => (
          <li key={index}>{image}</li>
        ))}
      </ul>
      <p>
        <strong>Impacting:</strong> {cve.isImpacting ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default CVECard;
