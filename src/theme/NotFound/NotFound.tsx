import React from "react";
import { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import hero from "@site/static/assets/man_space_lost.png";
import Layout from "@theme/Layout";
import styles from "./NotFound.module.scss";
import Image from "@theme/IdealImage";

export default function NotFound() {
  return (
    <>
      <PageMetadata
        title={translate({
          id: "theme.NotFound.title",
          message: "Page Not Found",
        })}
      />
      <Layout>
        <main className="container margin-vert--xl">
          <div className="row">
            <div className={styles.contentWrapper}>
              <div className={styles.content}>
                <div className={styles.boundingBox}>
                  <h1 className={styles.title}>404 Lost in Space</h1>
                  <p>Oooops. Looks like the page you&apos;re are trying to reach is no longer available.</p>
                </div>
                <Image className={styles.man} img={hero as string} alt={"space-man"} />
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
