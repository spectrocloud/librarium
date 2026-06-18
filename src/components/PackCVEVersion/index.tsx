import React from "react";

export default function PackCVEVersion({ data }) {
  return (
    <>
      {data.images.map((imageData) => (
        <section key={`${imageData.image}:${imageData.tag}`}>
          <h2>
            {imageData.image}:{imageData.tag}
          </h2>

          <table>
            <thead>
              <tr>
                <th>CVE</th>
                <th>Severity</th>
                <th>Package</th>
                <th>Has Fix</th>
                <th>Impacting</th>
              </tr>
            </thead>
            <tbody>
              {imageData.cves.length > 0 ? (
                imageData.cves.map((cve) => (
                  <tr key={`${imageData.image}-${imageData.tag}-${cve.cve}-${cve.package}`}>
                    <td>{cve.cve}</td>
                    <td>{cve.severity}</td>
                    <td>
                      <code>{cve.package}</code>
                    </td>
                    <td>{cve.hasFix ? "Yes" : "No"}</td>
                    <td>{cve.isImpacting ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No HIGH/CRITICAL CVEs found</td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        </section>
      ))}
    </>
  );
}
