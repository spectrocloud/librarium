import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faArrowsRotate,
  faGlobe,
  faCode,
  faGears,
  faChartLine,
  faShieldHalved,
  faCubes,
  faWandMagicSparkles,
  faDesktop,
  faBrain,
  faPlug,
  faBookOpen,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import VersionedLink from "../VersionedLink";
import styles from "./Landing.module.scss";

const ICONS: Record<string, IconDefinition> = {
  layers: faLayerGroup,
  lifecycle: faArrowsRotate,
  globe: faGlobe,
  developer: faCode,
  operations: faGears,
  executive: faChartLine,
  security: faShieldHalved,
  stack: faCubes,
};

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

// Icon keys usable in the HeroPanel `icon` prop from Markdown. Add new entries
// here to make more icons selectable by name.
const PANEL_ICONS: Record<string, IconDefinition> = {
  paletteai: faWandMagicSparkles,
  mcp: faPlug,
  api: faBookOpen,
  ai: faMicrochip,
  brain: faBrain,
  vm: faDesktop,
  layers: faLayerGroup,
  globe: faGlobe,
  code: faCode,
  gears: faGears,
  security: faShieldHalved,
  stack: faCubes,
};

interface HeroPanelProps {
  // Icon key from PANEL_ICONS (for example, icon="mcp"). Falls back to a generic icon.
  icon?: string;
  title: string;
  description: string;
  url: string;
}

export function HeroPanel({ icon, title, description, url }: HeroPanelProps) {
  const card = (
    <div className={styles.panel}>
      <div className={styles.panelIcon}>
        <FontAwesomeIcon icon={(icon && PANEL_ICONS[icon]) || faCubes} />
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
  // Icon key from ICONS (for example, icon="stack"). Falls back to a generic icon.
  icon?: string;
  title: string;
  description: string;
  url?: string;
}

export function FeatureTile({ icon, title, description, url }: FeatureTileProps) {
  const tile = (
    <article className={styles.featureTile}>
      <div className={styles.featureIcon}>
        <FontAwesomeIcon icon={(icon && ICONS[icon]) || faCubes} />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </article>
  );
  return url ? <VersionedLink url={url} component={tile} /> : <div>{tile}</div>;
}

interface FeatureHighlightsProps {
  // FeatureTile elements rendered in a responsive grid.
  children?: React.ReactNode;
}

export function FeatureHighlights({ children }: FeatureHighlightsProps) {
  return <div className={styles.featureGrid}>{children}</div>;
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
