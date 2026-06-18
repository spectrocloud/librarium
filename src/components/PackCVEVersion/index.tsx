import React, { useEffect, useState } from "react";

interface PackCVEVersionProps {
  pack: string;
  version: string;
}

export default function PackCVEVersion({ pack, version }: PackCVEVersionProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const response = await fetch(`/generated/pack-cves/${pack}-${version}.json`);

        if (!response.ok) {
          throw new Error(`Failed to fetch CVE data: ${response.status}`);
        }

        const json = await response.json();

        if (mounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [pack, version]);

  if (loading) {
    return <p>Loading CVEs...</p>;
  }

  if (error || !data) {
    return <p>Unable to load CVE data.</p>;
  }

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
