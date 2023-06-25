const { description } = require('../../package')
const path = require('path')

module.exports = {
  title: 'Morphism Docs',
  description: description,

  head: [ 
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/logos/favicon.png"}],
    ['meta', { property: 'og:image', content: 'https://community.Morphism.io/assets/logos/twitter-logo.png' }],
    ['meta', { name: 'twitter:image', content: 'https://community.Morphism.io/assets/logos/twitter-logo.png' }],
    ['meta', { name: 'twitter:title', content: 'Morphism Docs' }],
    ['meta', { property: 'og:title', content: 'Morphism Docs' }],
    ['meta', { name: 'twitter:card', content: 'summary' } ],    
  ],

  theme: path.resolve(__dirname, './theme'),
  themeConfig: {
    contributor: false,
    hostname: 'https://docs.morphism.xyz',
    logo: '/assets/logos/logo.png',
    docsDir: 'src',
    docsRepo: 'https://github.com/morphism-labs/morphism-doc',
    docsBranch: 'main',
    lastUpdated: false,
    darkmode: 'disable',
    themeColor: false,
    blog: false,
    iconPrefix: 'far fa-',
    pageInfo: false,
    pwa: {
      cacheHTML: false,
    },
    activeHash: {
      offset: -200,
    },
    algolia: {
      appId: '8LQU4WGQXA',
      apiKey: '2c1a86142192f96dab9a5066ad0c1d50',
      indexName: 'Morphism'
    },
    nav: [
      /* When you update here, don't forget to update the tiles
         in src/README.md */
      {
        text: "Quick Start",
        link: '/docs/guides/'
      },      
      {
        text: 'How Morphism Works',
        link: '/docs/protocol/',
      },     
      /* When you update here, don't forget to update the tiles
            {
        text: 'Module Deployment Guidence',
        link: '/docs/Module/'        
      },
         in src/README.md */ 

      {
        text: 'Build on Morphism',
        link: '/docs/developers/',
      },
      {
        text: 'Community',
        items: [
          /*{
            icon: 'discord',
            iconPrefix: 'fab fa-',
            iconClass: 'color-discord',
            text: 'Discord',
            link: 'https://discord.Morphism.io',
          },
          {
            icon: 'github',
            iconPrefix: 'fab fa-',
            iconClass: 'color-github',
            text: 'GitHub',
            link: 'https://github.com/ethereum-Morphism/Morphism',
          },
          {
            icon: 'twitter',
            iconPrefix: 'fab fa-',
            iconClass: 'color-twitter',
            text: 'Twitter',
            link: 'https://twitter.com/MorphismFND',
          },
          {
            icon: 'twitch',
            iconPrefix: 'fab fa-',
            iconClass: 'color-twitch',
            text: 'Twitch',
            link: 'https://www.twitch.tv/Morphismpbc'
          },
          {
            icon: 'medium',
            iconPrefix: 'fab fa-',
            iconClass: 'color-medium',
            text: 'Blog',
            link: 'https://Morphismpbc.medium.com/'
          },
          {
            icon: 'computer-classic',
            iconClass: 'color-ecosystem',
            text: 'Ecosystem',
            link: 'https://www.Morphism.io/apps/all',
          },
          {
            icon: 'globe',
            iconClass: 'color-Morphism',
            text: 'Morphism.io',
            link: 'https://www.Morphism.io/',
          }
            - title: Module Deployment Guide
    icon: shield
    details: Step by step guide on how to become part of Moprhism.
    link: /docs/Module/
                '/docs/Module/' :[

      ],
          */
          {
            icon: 'twitter',
            iconPrefix: 'fab fa-',
            iconClass: 'color-twitter',
            text: 'Twitter',
            link: 'https://twitter.com/MorphismFND',
          },
          {
            icon: 'medium',
            iconPrefix: 'fab fa-',
            iconClass: 'color-medium',
            text: 'Blog',
            link: 'https://Morphismpbc.medium.com/'
          },
          {
            icon: 'globe',
            iconClass: 'color-Morphism',
            text: 'Morphism.io',
            link: 'https://www.Morphism.io/',
          }
        ]
      }
    ],
    searchPlaceholder: 'Search Morphism',
    sidebar: {    
      '/docs/guides/': [
        {
          title: "Beginner",
          children: [
          ],
          collapsable: true,
        },
        {
          title: "Getting your dapp on Morphism",
          children: [
          ],
          collapsable: true,
        }        

      ],
      '/docs/protocol/': [
        '/docs/protocol/Architecture.md',
        {
          title: 'Responsive Validity Proof',
          children: [
            '/docs/protocol/ResFull/ResVaProOv.md',
            '/docs/protocol/ResFull/ResVaPro.md',
            '/docs/protocol/ResFull/Practice.md'
          ],
          collapsable: true,          
        },
        '/docs/protocol/DeSequencers.md',
        {
          title: 'General Protocol Design',
          children: [
            '/docs/protocol/General/L1-L2-Msg.md',
            '/docs/protocol/General/Rollups.md',
            '/docs/protocol/General/Txns-Life.md',
            //'/docs/protocol/General/Pro-Upg.md',
            //'/docs/protocol/General/Net-Sec.md',
            '/docs/protocol/General/L2-Gas.md'
          ],
          collapsable: true,          
        },
        

        // '/docs/protocol/ZKProver.md'
      ],

      '/docs/developers/': [
        {
          title: 'Build on Morphism',
          children: [
            '/docs/developers/buildon/diff.md',
            '/docs/developers/buildon/txfee.md',
            '/docs/developers/buildon/bridge.md'
          ],
        },
        {
          title: 'Practice Examples',
          children: [
            '/docs/developers/examples/contract.md',
            '/docs/developers/examples/nft.md',
            '/docs/developers/examples/token.md',
          ],
        },
      
        /*
        { 
          title: "Useful Tools",
          children: [
    
          ],
        },
        {
          title: "SDK",
          children: [
                 
          ]
        },
        */

      ]
    }
  },

  plugins: [
    "@vuepress/pwa",
    [
      '@vuepress/plugin-medium-zoom',
      {
        // When an image is inside a link, it means we don't to expand it
        // when clicked
        selector: ':not(a) > img'
      }
    ],
    "plausible-analytics"
  ]
}
  
module.exports.themeConfig.sidebar["/docs/useful-tools/"] = module.exports.themeConfig.sidebar["/docs/developers/"]
module.exports.themeConfig.sidebar["/docs/sdk/"] = module.exports.themeConfig.sidebar["/docs/developers/"]
