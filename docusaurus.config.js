// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// If you are using dotenv (https://www.npmjs.com/package/dotenv)
require('dotenv').config();


const remarkMath  = require('remark-math');
const rehypeKatex = require('rehype-katex');
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

import { links } from './src/components/config'

/**
 * SEO constants
 */
const SITE_URL = process.env.MORPH_DOCS_URL || 'https://docs.morph.network';
const SITE_NAME = 'Morph Docs';
const DEFAULT_TITLE = 'Morph Docs | Developer Documentation for Morph Network';
const DEFAULT_DESCRIPTION = 'Official developer documentation for Morph Network - the secure settlement layer for global crypto payments. Learn how to build on Morph with comprehensive guides, API references, and tutorials.';
const DEFAULT_OG_IMAGE = 'https://morph.network/share/share-morph.jpeg';
const TWITTER_HANDLE = '@MorphNetwork';

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: DEFAULT_TITLE,
  tagline: 'Build the future of crypto payments on Morph',
  favicon: '/favicon.ico',

  staticDirectories: ['public', 'static'],

  // Set the production url of your site here
  url: SITE_URL,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // onBrokenLinks: 'ignore',

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

  plugins: [
    'docusaurus-plugin-sass',
    // Use local plugin instead of npm package to fix /docs/ path
    require.resolve('./plugins/markdown-source-plugin.js'),
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html', 'htm'], // /myPage.html -> /myPage
        toExtensions: ['exe', 'zip'], // /myAsset -> /myAsset.zip (if latter exists)
        redirects: [
          // /docs/oldDoc -> /docs/newDoc
          {
            to: '/docs/about-morph/user-navigation-page',
            from: ['/docs'],
          },
        ],
      },
    ],
  ],

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
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/morph-l2/morph-doc/tree/main',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: [
            require.resolve('./src/css/fonts.scss'), 
            require.resolve('./src/css/custom.scss'),
            require.resolve('./src/css/figma-overrides.scss')
          ],
        },
      }),
    ],
  ],

  /*
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  */

  stylesheets: [
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],
  // add head tags for SEO
  headTags: [
    // Open Graph tags
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: SITE_NAME,
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:locale',
        content: 'en_US',
      },
    },
    // Twitter Card tags
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:site',
        content: TWITTER_HANDLE,
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:creator',
        content: TWITTER_HANDLE,
      },
    },
    // other SEO tags
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'Morph',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: SITE_URL,
      },
    },
    // hreflang meta tags
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        hreflang: 'en',
        href: SITE_URL,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        hreflang: 'x-default',
        href: SITE_URL,
      },
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // SEO metadata 
      metadata: [
        // base meta tags
        {
          name: 'keywords',
          content: 'Morph, Morph Network, crypto payment gateway, blockchain documentation, developer docs, EVM-equivalent, optimistic zkEVM, scaling solution, stablecoin infrastructure, BGB',
        },
        {
          name: 'description',
          content: DEFAULT_DESCRIPTION,
        },
        // Google site verification
        {
          name: 'google-site-verification',
          content: '-GPotcMH5Ecuj8EnU-Tasmm8TOZXEHWEPD5qP5d0FEU',
        },
        // robots tags
        {
          name: 'robots',
          content: 'index, follow',
        },
        // Open Graph additional tags
        {
          property: 'og:title',
          content: DEFAULT_TITLE,
        },
        {
          property: 'og:description',
          content: DEFAULT_DESCRIPTION,
        },
        {
          property: 'og:image',
          content: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        },
        {
          property: 'og:image:width',
          content: '1200',
        },
        {
          property: 'og:image:height',
          content: '630',
        },
        {
          property: 'og:image:alt',
          content: 'Morph Docs - Developer Documentation',
        },
        {
          property: 'og:url',
          content: SITE_URL,
        },
        // Twitter Card additional tags
        {
          name: 'twitter:title',
          content: DEFAULT_TITLE,
        },
        {
          name: 'twitter:description',
          content: DEFAULT_DESCRIPTION,
        },
        {
          name: 'twitter:image',
          content: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        },
      ],
      algolia: {
        // The application ID provided by Algolia
        appId: process.env.ALGOLIA_APP_ID || '8HKAWLQMLZ',
  
        // Public API key: it is safe to commit it
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY || '021dba71d50406f34ded5e71c22283e5',
  
        indexName: process.env.ALGOLIA_INDEX_NAME || 'morph_doc',
  
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
      // social sharing image (recommended size: 1200x630)
      image: DEFAULT_OG_IMAGE,
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      sidebar: {
        autoCollapseCategories: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Morph Doc Logo',
          src: 'logo/morph-docs-black.svg',
          srcDark: 'logo/morph-docs-white.svg',
        },
        items: [
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'GetStartedSidebar',
            label: 'Get Started',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'MorphChainSidebar',
            label: 'Morph Chain',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'NodeOperatorsSidebar',
            label: 'Node Operators',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'LearnSidebar',
            label: 'Learn',
          },
        ],
      },
      footer: {
        links: [
          {
            title: "Learn",
            items: [
              {
                label: "Docs",
                href: links.doc,
              },
              {
                label: "Blog",
                href: links.blog,
              },
            ],
          },
          {
            title: "Developers",
            items: [
              {
                label: "APIs",
                href: links.apiDocs,
              },
              {
                label: "Tools",
                href: links.build,
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Forum",
                href: links.forum,
              },
              {
                label: "Telegram",
                href: links.telegram,
              },
              {
                label: "Twitter",
                href: links.twitter,
              },
              {
                label: "Discord",
                href: links.discord,
              },
            ],
          },
          {
            title: "Company",
            items: [
              {
                label: "About",
                href: links.about,
              },
              {
                label: "Contact us",
                href: links.contactUs,
              },
              {
                label: "Careers",
                href: links.careers,
              },
              // {
              //   label: "Brand Kit",
              //   href: links.brandkit,
              // }
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Morph. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'diff', 'json'],
      },
    }),
};

module.exports = config;
