import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faBookOpen,
  faBox,
  faBoxesStacked,
  faBrain,
  faChartLine,
  faCode,
  faCompactDisc,
  faCubes,
  faDesktop,
  faDiagramProject,
  faGears,
  faGlobe,
  faHardDrive,
  faLayerGroup,
  faMicrochip,
  faPalette,
  faPlug,
  faRobot,
  faServer,
  faShieldHalved,
  faTerminal,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { library, config, findIconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition, IconName } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import VersionedLink from "../VersionedLink";
import styles from "./Landing.module.scss";

// Ship FontAwesome's CSS statically and stop the core from injecting it at runtime.
// Otherwise the SVGs render at their intrinsic size on first paint and visibly
// shrink once the JS-injected styles arrive.
config.autoAddCss = false;

// Register only the icons the landing page uses, so they can be selected by name
// from Markdown (for example, icon="plug"). To use a new icon, import it above and
// add it to this list.
library.add(
  faArrowsRotate,
  faBookOpen,
  faBox,
  faBoxesStacked,
  faBrain,
  faChartLine,
  faCode,
  faCompactDisc,
  faCubes,
  faDesktop,
  faDiagramProject,
  faGears,
  faGlobe,
  faHardDrive,
  faLayerGroup,
  faMicrochip,
  faPalette,
  faPlug,
  faRobot,
  faServer,
  faShieldHalved,
  faTerminal,
  faWandMagicSparkles
);

// Resolve a FontAwesome solid icon name to a definition, falling back to a generic icon.
function resolveIcon(name?: string): IconDefinition {
  if (!name) return faCubes;
  return findIconDefinition({ prefix: "fas", iconName: name as IconName }) ?? faCubes;
}

function isExternal(url: string): boolean {
  return url.startsWith("http");
}

interface ButtonProps {
  text: string;
  url: string;
  variant: "primary" | "secondary";
}

function Button({ text, url, variant }: ButtonProps) {
  const className = variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary;
  if (isExternal(url)) {
    return (
      <a className={className} href={url} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );
  }
  return <VersionedLink url={url} component={<span className={className}>{text}</span>} />;
}

interface HeroPanelProps {
  // Any FontAwesome free-solid icon name or alias (for example, icon="plug"). Falls back to a generic icon.
  icon?: string;
  title: string;
  description: string;
  url: string;
}

export function HeroPanel({ icon, title, description, url }: HeroPanelProps) {
  const card = (
    <div className={styles.panel}>
      <div className={styles.panelIcon}>
        <FontAwesomeIcon icon={resolveIcon(icon)} />
      </div>
      <div className={styles.panelBody}>
        <span className={styles.panelTitle}>{title}</span>
        <p className={styles.panelDescription}>{description}</p>
      </div>
    </div>
  );
  if (isExternal(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }
  return <VersionedLink url={url} component={card} />;
}

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryText?: string;
  primaryUrl?: string;
  secondaryText?: string;
  secondaryUrl?: string;
  // HeroPanel elements rendered in rows of three beside the hero copy.
  children?: React.ReactNode;
}

export function LandingHero({
  eyebrow,
  title,
  subtitle,
  primaryText,
  primaryUrl,
  secondaryText,
  secondaryUrl,
  children,
}: HeroProps) {
  const hasPanels = React.Children.count(children) > 0;

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            <h2 className={styles.heroTitle}>{title}</h2>
            <p className={styles.heroSubtitle}>{subtitle}</p>
          </div>
          {((primaryText && primaryUrl) || (secondaryText && secondaryUrl)) && (
            <div className={styles.heroActions}>
              {primaryText && primaryUrl && <Button text={primaryText} url={primaryUrl} variant="primary" />}
              {secondaryText && secondaryUrl && <Button text={secondaryText} url={secondaryUrl} variant="secondary" />}
            </div>
          )}
        </div>
        {hasPanels && <div className={styles.panelColumn}>{children}</div>}
      </div>
    </section>
  );
}

interface FeatureTileProps {
  // Any FontAwesome free-solid icon name or alias (for example, icon="stack"). Falls back to a generic icon.
  icon?: string;
  title: string;
  description: string;
  url?: string;
}

export function FeatureTile({ icon, title, description, url }: FeatureTileProps) {
  const tile = (
    <article className={styles.featureTile}>
      <div className={styles.featureIcon}>
        <FontAwesomeIcon icon={resolveIcon(icon)} />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </article>
  );
  if (!url) {
    return <div>{tile}</div>;
  }
  if (isExternal(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {tile}
      </a>
    );
  }
  return <VersionedLink url={url} component={tile} />;
}

interface FeatureHighlightsProps {
  // FeatureTile elements rendered in a responsive grid.
  children?: React.ReactNode;
}

export function FeatureHighlights({ children }: FeatureHighlightsProps) {
  // The stable `feature-grid` class (alongside the hashed module class) is a hook
  // for landing-page-only global CSS, e.g. adjusting columns inside the accordion.
  return <div className={`feature-grid ${styles.featureGrid}`}>{children}</div>;
}

interface CTABannerProps {
  title: string;
  description: string;
  primaryText?: string;
  primaryUrl?: string;
  secondaryText?: string;
  secondaryUrl?: string;
}

export function CTABanner({
  title,
  description,
  primaryText,
  primaryUrl,
  secondaryText,
  secondaryUrl,
}: CTABannerProps) {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaText}>
        <h2 className={styles.ctaTitle}>{title}</h2>
        <p className={styles.ctaDescription}>{description}</p>
      </div>
      <div className={styles.ctaActions}>
        {primaryText && primaryUrl && <Button text={primaryText} url={primaryUrl} variant="primary" />}
        {secondaryText && secondaryUrl && <Button text={secondaryText} url={secondaryUrl} variant="secondary" />}
      </div>
    </section>
  );
}
