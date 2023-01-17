import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'f29'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '193'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '975'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '0db'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'caa'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', 'a02'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '69d'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '808'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '8b3'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', 'd58'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', '935'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '2a2'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', 'aee'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '8a9'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '0dd'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '376'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', '387'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '4a7'),
    exact: true
  },
  {
    path: '/api',
    component: ComponentCreator('/api', 'd71'),
    routes: [
      {
        path: '/api/',
        component: ComponentCreator('/api/', '560'),
        exact: true,
        sidebar: "defaultSidebar"
      },
      {
        path: '/api/v1/auth',
        component: ComponentCreator('/api/v1/auth', '047'),
        exact: true,
        sidebar: "defaultSidebar"
      }
    ]
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '4be'),
    routes: [
      {
        path: '/docs/clusters/',
        component: ComponentCreator('/docs/clusters/', '301'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clusters/public-cloud/',
        component: ComponentCreator('/docs/clusters/public-cloud/', 'd10'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clusters/public-cloud/aws/',
        component: ComponentCreator('/docs/clusters/public-cloud/aws/', '6f0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clusters/public-cloud/aws/add-aws-accounts',
        component: ComponentCreator('/docs/clusters/public-cloud/aws/add-aws-accounts', 'd01'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clusters/public-cloud/aws/architecture',
        component: ComponentCreator('/docs/clusters/public-cloud/aws/architecture', 'b48'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/introduction',
        component: ComponentCreator('/docs/introduction', '1d7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/introduction/palette-modes',
        component: ComponentCreator('/docs/introduction/palette-modes', 'fac'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '13a'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
