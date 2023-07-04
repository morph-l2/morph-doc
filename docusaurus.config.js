// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Morphism docs – The Optimistic zkEVM Scaling Solution docs',
  tagline: '',
  favicon: 'https://www.morphism.xyz/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.morphism.xyz',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

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
            'https://github.com/morphism-labs/morphism-doc/blob/main',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/morphism-labs/morphism-doc/blob/main',
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
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '',
        logo: {
          alt: 'Morphism Doc Logo',
          src: 'img/index/logo_dark.svg',
          srcDark: 'img/index/logo_light.svg',
        },
        items: [
          {
            type: 'doc',
            position: 'right',
            docId: 'quick-start/startintro',
            label: 'Quick Start',
          },
          {
            type: 'doc',
            position: 'right',
            docId: 'How Morphism Works/howintro',
            label: 'How Morhsim works',
          },
          {
            type: 'doc',
            position: 'right',
            docId: 'Build on Morphism/devintro',
            label: 'Build on Morphism',
          },
          // {label: 'Website', position: 'left', href: 'https://www.morphism.xyz',},
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
            title: 'Morphism',
            items: [
              {
                label: 'About',
                to: 'https://www.morphism.xyz/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/Morphism_EN',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://medium.com/@Morphism_EN',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Morphism. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
