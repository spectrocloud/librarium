import React, { useMemo } from 'react';
import { graphql } from 'gatsby';
import Helmet from "react-helmet";
import favicon from "../../../shared/src/assets/favicon.png"

import { Layout, DocsLayout, Link } from '@librarium/shared';
import Integrations from '@librarium/docs/src/components/Integrations';
import App from '../App';

//

export default function IntegrationsTemplate({ children, data, ...rest }) {
  const integrations = data.allMdx.edges.filter(edge => edge.node.fields.isIntegration);
  const menu = useMemo(() => {
    return DocsLayout.calculateMenuTree(
      data.allMdx.edges.filter(edge => edge.node.fields.isDocsPage)
    );
  }, [data.allMdx.edges]);

  const metaTitle = "Integrations"
  const metaDescription = "Integrations are packages that enhances your Kubernetes cluster with different capabilities like: networking, load balancing, security, logging, ingress or monitoring"

  return (
    <App>
      <Helmet>
        {metaTitle ? <title>{metaTitle}</title> : null}
        {metaTitle ? <meta name="title" content={metaTitle} /> : null}
        {metaDescription ? <meta name="description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
        {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
        {metaDescription ? <meta property="twitter:description" content={metaDescription} /> : null}
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <Layout menu={menu} {...rest}>
        <h1>Integrations</h1>
        <p>
          Integrations are the additional entities that are used to ensure and/or improve on the
          functionality of Kubernetes. Integrations are better understood as the options that are
          available for the various "layers" of the Spectro Cloud SaaS.
        </p>
        <h1>Layers</h1>
        <p>
          Kubernetes, as the official document{' '}
          <Link to="https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/#what-kubernetes-is-not">
            says
          </Link>
          , is "not a traditional, all-inclusive PaaS system". As such, it requires a lot of{' '}
          <Link to="https://kubernetes.io/docs/concepts/overview/components/#addons">add-ons</Link>{' '}
          tailored for specific uses. A full{' '}
          <Link to="https://kubernetes.io/docs/concepts/cluster-administration/addons/">
            list of add-ons
          </Link>{' '}
          is available here. The specific uses (or the functionalities) that the add-ons provide are
          called "Layers" in the Spectro Cloud universe. For example, authentication is a layer
          which has the options of Dex and Permission Manager. Monitoring is another layer with
          options of Kubernetes Dashboard, Prometheus Grafana and a whole lot more. To learn more
          about individual integrations, use the search bar below to find a specific option.
          Alternatively, use the filter buttons to see the available options.
        </p>
        <Integrations edges={integrations} />
      </Layout>
    </App>
  );
}

export const pageQuery = graphql`
  {
    allMdx {
      edges {
        node {
          fields {
            id
            slug
            title
            icon
            index
            hiddenFromNav
            category
            isIntegration
            isDocsPage
            logoUrl
          }
        }
      }
    }
  }
`;
