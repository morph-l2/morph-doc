// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: 'Morph docs – The Optimistic zkEVM Scaling Solution docs',
  tagline: '',
  favicon: 'https://www.morphl2.io/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.morphl2.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'morph labs', // Usually your GitHub org/user name.
  projectName: 'morph docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/morph-l2/morph-doc/tree/main',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/morph-l2/morph-doc/tree/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [{
        name: 'keywords',
        content: 'Morph,EVM-equivalent,Optimistic,zkEVM'
      }, {
        name: 'google-site-verification',
        content: 'mDvOrPPWpVMPyzZmqjzK2nerPAPuWXsSOthN_2eQO20'
      }],
      algolia: {
        // The application ID provided by Algolia
        appId: 'ZPAGKYIZIQ',
  
        // Public API key: it is safe to commit it
        apiKey: '27fd51373bda15bdf1891fa3300527c8',
  
        indexName: 'morph_docs',
  
        // Optional: see doc section below
        contextualSearch: true,
  
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'morph\\.xyz|morph\\.xyz',
  
        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/docs/',
        },
  
        // Optional: Algolia search parameters
        searchParameters: {},
  
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
  
        //... other Algolia params
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Morph Doc Logo',
          src: 'img/index/logo_light.png',
          srcDark: 'img/index/logo_dark.png',
        },
        items: [

          {
            type: 'doc',
            position: 'right',
            docId: 'about-morph/overview-of-morph',
            label: 'About Morph',
          },
        /*
          {
            type: 'doc',
            position: 'right',
            docId: 'quick-start/welcome-to-morph',
            label: 'Quick Start',
          },
        */
          {
            type: 'doc',
            position: 'right',
            docId: 'how-morph-works/intro',
            label: 'How Morph works',
          },
          /*
          {
            type: 'doc',
            position: 'right',
            docId: 'build-on-morph/intro',
            label: 'Build on Morph',
          },
          */
          // {label: 'Website', position: 'left', href: 'https://www.morphl2.io',},
          /*
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
          */
        ],
      },
      footer: {
        links: [
          {
            title: 'Morph',
            items: [
              {
                label: 'About',
                to: 'https://www.morphl2.io/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/Morphl2',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://medium.com/@morphlayer2',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Morph. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
