import React, { useEffect, useState } from "react";

interface PackCVEVersionProps {
  pack: string;
  version: string;
}

interface CVE {
  cve: string;
  severity: string;
  package: string;
  isImpacting: boolean;
}

interface ImageCVEData {
  image: string;
  tag: string;
  cves: CVE[];
}

interface PackCVEData {
  images: ImageCVEData[];
}

export default function PackCVEVersion({ pack, version }: PackCVEVersionProps) {
  const [data, setData] = useState<PackCVEData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function loadData(): Promise<void> {
      try {
        const response = await fetch(`/generated/pack-cves/${pack}-${version}.json`);

        if (!response.ok) {
          throw new Error(`Failed to fetch CVE data: ${response.status}`);
        }

        const json = (await response.json()) as PackCVEData;

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

    void loadData();

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
      {[...data.images]
        .sort((a: ImageCVEData, b: ImageCVEData) => {
          const imageA = a.image.replace(/^us-docker\.pkg\.dev\/palette-images\/packs\//, "");

          const imageB = b.image.replace(/^us-docker\.pkg\.dev\/palette-images\/packs\//, "");

          return imageA.localeCompare(imageB);
        })
        .map((imageData: ImageCVEData) => {
          const displayImage = imageData.image.replace(/^us-docker\.pkg\.dev\/palette-images\/packs\//, "");

          return (
            <section key={`${imageData.image}:${imageData.tag}`}>
              <h2>
                {displayImage}:{imageData.tag}
              </h2>

              <details>
                <summary style={{ fontSize: "16px", paddingTop: "8px", paddingBottom: "8px" }}>
                  Show image CVEs ({imageData.cves.length} CVEs)
                </summary>

                <table>
                  <thead>
                    <tr>
                      <th>CVE</th>
                      <th>Severity</th>
                      <th>Package</th>
                      <th>Impacting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {imageData.cves.length > 0 ? (
                      imageData.cves.map((cve: CVE) => (
                        <tr key={`${imageData.image}-${imageData.tag}-${cve.cve}-${cve.package}`}>
                          <td>
                            <a
                              href={`https://nvd.nist.gov/vuln/detail/${cve.cve}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {cve.cve}
                            </a>
                          </td>
                          <td>{cve.severity}</td>
                          <td>
                            <code>{cve.package}</code>
                          </td>
                          <td>{cve.isImpacting ? "Yes" : "No"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No HIGH/CRITICAL CVEs found</td>
                        <td />
                        <td />
                        <td />
                      </tr>
                    )}
                  </tbody>
                </table>
              </details>
            </section>
          );
        })}
    </>
  );
}
