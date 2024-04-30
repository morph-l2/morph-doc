// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// If you are using dotenv (https://www.npmjs.com/package/dotenv)
require('dotenv').config();


const remarkMath  = require('remark-math');
const rehypeKatex = require('rehype-katex');
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;


export const links = {
  brand: 'https://morphl2.io/',
  website: 'https://morphl2.io',

  reCaptchaSiteKey: process.env.MORPH_reCAPTCHA_SITE_KEY || '6LdADEQpAAAAAMq2IagWaiURjl4YFklWqLMp6C1t',

  quickStart: 'https://docs.morphl2.io/',
  // point
  morphPointsRule: 'https://morphl2.io/rules',
  dailyCheckInRule: 'https://morphl2.io/rules',
  points: 'https://morphl2.io/points',
  myPoints: 'https://morphl2.io/points/phase1/mypoints',
  myVoting: 'https://morphl2.io/points/phase1/myvoting',

  howItWorks: 'https://docs.morphl2.io/docs/how-morph-works/intro/',
  contractMoohism: 'https://forms.gle/9zJxWbcoDAuZKFSW8',
  exploreMore: 'https://docs.morphl2.io/docs/how-morph-works/responsive-validity-proof/overview/',
  
  contactUs: 'https://morphl2.io/about',
  terms: 'https://morphl2.io/terms_of_service',
  policy: 'https://morphl2.io/privacy_policy',
  about: 'https://morphl2.io/about',
  wallet: 'https://morphl2.io/wallet',
  build: 'https://morphl2.io/build',
  careers: 'https://morphl2.io/careers',
  sparkLoom: 'https://morphl2.io/sparkloom',
  sparkLoomPdf: typeof window === 'undefined' ? 'https://morphl2.io/pdf/1.pdf' : (window.location.origin +'https://morphl2.io/pdf/1.pdf'),
  brandkit: 'https://morphl2brand.notion.site/Morph-brand-guideline-56eca01ef6d14212be0e9562ad1e2fc1',
  // sparkloom
  registerNow: 'https://app.buidlbox.io/morphl2/sparkloom',
  applyNow: 'https://forms.gle/6kDGru2dMzrqJgb69',

  whatIsMorph: 'https://docs.morphl2.io/docs/how-morph-works/intro/',
  docUrl: 'https://docs.morphl2.io',

  whatIsTheVotingPower: ``,

  learnmore: 'https://morphl2.io/docs/how-morph-works/intro/',
  doc: 'https://morphl2.io/docs/how-morph-works/intro/',
  walletSetup: 'https://morphl2.io/docs/quick-start/wallet-setup/',

  // start building
  apiDocs: 'https://explorer-testnet.morphl2.io/api-docs',
  explorer: 'https://explorer-testnet.morphl2.io',
  explorerApi: 'https://explorer-api-testnet.morphl2.io', // /api/v2/stats
  bridge: 'https://bridge-testnet.morphl2.io',
  
  holeskyWalletSetup: 'https://morphl2.io/docs/quick-start/wallet-setup/',
  holeskyApiDocs: 'https://explorer-holesky.morphl2.io/api-docs',
  holeskyExplorer: 'https://explorer-holesky.morphl2.io',
  holeskyExplorerApi: 'https://explorer-api-holesky.morphl2.io',
  holeskyBridge: 'https://bridge-holesky.morphl2.io',

  // social
  medium: 'https://blog.morphl2.io/',
  twitter: 'https://twitter.com/Morphl2',
  telegram: 'https://t.me/MorphL2official',
  // 'https://t.me/+qslsWvH2_-1iMTdl',
  discord: 'https://discord.gg/5SmG4yhzVZ',
  linkedIn: 'http://www.linkedin.com/company/morphl2',

  facebook: 'https://www.facebook.com/profile.php?id=61554448708419',
  tiktok: 'https://www.tiktok.com/@morphl2',
  youtube: 'https://www.youtube.com/channel/UCZW6iBpnbpCzYOrMY-RtDOw',

  github: '', // https://github.com/morph-l2

  blog: 'https://blog.morphl2.io/',
  forum: 'https://forum.morphl2.io',

  faucet: '',

  holeskyUSDT: 'https://discord.com/channels/1156486804661338162/1199665829730582620',
  holeskyETH: "https://holesky-faucet.pk910.de/",
  sepoliafaucet: "https://sepoliafaucet.com/",
  usdtfaucet: "https://discord.com/channels/1156486804661338162/1199665829730582620",

  community: 'https://twitter.com/Morphl2',
}

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: 'Morph docs – The Optimistic zkEVM Scaling Solution docs',
  tagline: '',
  favicon: 'https://www.morphl2.io/favicon.ico',

  staticDirectories: ['public', 'static'],

  // Set the production url of your site here
  url: 'https://docs.morphl2.io',
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
          // {
          //   to: '/docs/newDoc',
          //   from: '/docs/oldDoc',
          // },
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
          customCss: [require.resolve('./src/css/fonts.scss'), require.resolve('./src/css/custom.scss')],
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      prism: {
        additionalLanguages: ['bash', 'diff', 'json'],
      },
      metadata: [{
        name: 'keywords',
        content: 'Morph,EVM-equivalent,Optimistic,zkEVM'
      }, {
        name: 'google-site-verification',
        content: '-GPotcMH5Ecuj8EnU-Tasmm8TOZXEHWEPD5qP5d0FEU'
      }],
      algolia: {
        // The application ID provided by Algolia
        appId: process.env.ALGOLIA_APP_ID,
  
        // Public API key: it is safe to commit it
        apiKey: process.env.ALGOLIA_API_KEY,
  
        indexName: process.env.ALGOLIA_INDEX_NAME,
  
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
          src: 'logo/LogoMorphWhite.svg',
          srcDark: 'logo/LogoMorphWhite.svg',
        },
        items: [
          {
            type: 'doc',
            position: 'right',
            docId: 'about-morph/overview-of-morph',
            label: 'About Morph',
          },
        
          {
            type: 'doc',
            position: 'right',
            docId: 'quick-start/welcome-to-morph',
            label: 'Quick Start',
          },
        
          {
            type: 'doc',
            position: 'right',
            docId: 'how-morph-works/intro',
            label: 'How Morph works',
          },
          
          {
            type: 'doc',
            position: 'right',
            docId: 'build-on-morph/intro',
            label: 'Build on Morph',
          },
          
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
              {
                label: "Brand Kit",
                href: links.brandkit,
              }
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Morph. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;