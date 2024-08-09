/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
/* const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
  
}
*/

//module.exports = sidebars;
/*
{
  type: 'autogenerated',
  dirName: 'how-morph-works', // Generate sidebar slice from docs/How Morph Works
}
*/
module.exports = {
  UserSidebar:[
    {
      type:'doc',
      id:'about-morph/user-navigation-page'
    },
    {
      type:'category',
      label:'Introductory Concepts',
      items:[
        {
          type: 'doc',
          id:'about-morph/overview-of-morph'
        },
        {
          type: 'doc',
          id:'about-morph/the-technology-behind-morph'
        },
        {
          type: 'doc',
          id:'about-morph/morphs-architecture'
        },
        {
          type: 'doc',
          id:'about-morph/morphs-vision-and-mission'
        },
        {
          type: 'doc',
          id:'about-morph/key-concepts'
        },
        {
          type: 'doc',
          id:'about-morph/roadmap'
        },
        {
          type: 'doc',
          id:'about-morph/faqs'
        },
      ]
    },
    {
      type: 'category',
      label: 'Morph Zoo',
      items: [
        {
          type: 'autogenerated',
          dirName: 'quick-start/morph-zoo'
        },
      ],
    },
    {
      type:'category',
      label:'Step-by-Step Guides',
      items:[
        {
          type: 'doc',
          id:'quick-start/wallet-setup'
        },
        {
          type: 'doc',
          id:'quick-start/faucet'
        },
        {
          type: 'doc',
          id:'quick-start/bridge'
        },
        
      ]
    },
    {
      type:'category',
      label:'Links and Tools',
      items:[
        {
          type: 'link',
          href: "https://bridge-holesky.morphl2.io/",
          label: 'Morph Holesky Official Bridge'
        },
        {
          type: 'link',
          href: "https://explorer-holesky.morphl2.io/",
          label: 'Morph Holesky Explorer'
        },
        {
          type: 'link',
          href: "https://holesky.etherscan.io/",
          label: 'Ethereum Holesky Explorer'
        },
      ]
    }
  ],
  DeveloperSidebar:[
    {
      type:'doc',
      id:'build-on-morph/developer-navigation-page'
    },
    {
      type:'category',
      label:'Fundamental Concepts',
      items:[
        {
          type: 'doc',
          id:'how-morph-works/morph-modular-design'
        },
        {
          type: 'doc',
          id:'how-morph-works/optimistic-zkevm'
        },
        {
          type: 'category',
          label: 'Decentralized Sequencers',
          items: [
            {
              type: 'autogenerated',
              dirName: 'how-morph-works/decentralized-sequencers'
            },
          ],
        },

        {
          type: 'category',
          label: 'General Protocol Design',
          items: [
            {
              type: 'autogenerated',
              dirName: 'how-morph-works/general-protocol-design'
            },
            {
              type: 'doc',
              id:'build-on-morph/build-on-morph/understand-transaction-cost-on-morph'
            },
          ],
        },
      
      ]
    },
    {
      type:'category',
      label:'Developer Guides',
      items:[
        {
          type: 'doc',
          id:'build-on-morph/build-on-morph/development-setup'
        },
        {
          type: 'doc',
          id:'build-on-morph/code-examples/deploy-contract-on-morph'
        },
        {
          type: 'doc',
          id:'build-on-morph/build-on-morph/verify-your-smart-contracts'
        },
        {
          type: 'doc',
          id:'build-on-morph/build-on-morph/bridge-between-morph-and-ethereum'
        },
        {
          type: 'doc',
          id:'build-on-morph/sdk/globals'
        },
        {
          type: 'doc',
          id:'build-on-morph/developer-resources/create-a-safe-multi-signature-wallet'
        },
        {
          type: 'doc',
          id:'build-on-morph/developer-resources/ecosystem-infrastructure'
        },
        
        {
          type:'category',
          label:'Node Operation',
          items:[
            {
              type: 'doc',
              id:'build-on-morph/developer-resources/node-operation/how-to-run-a-morph-node-docker'
            },
            {
              type: 'doc',
              id:'build-on-morph/developer-resources/node-operation/how-to-run-a-morph-node'
            },
            {
              type: 'doc',
              id:'build-on-morph/developer-resources/node-operation/how-to-run-a-validator-node'
            },
            {
              type: 'category',
              label:'Upgrade Node',
              items:[
                {
                type: 'doc',
                id:'build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-docker'
                },
                {
                  type: 'doc',
                  id:'build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-host'
                }
              ]
            },
          ]
        }
      ]
    },
    {
      type:'category',
      label:'Developer Resources',
      items:[
        {
          type: 'doc',
          id:'build-on-morph/developer-resources/contracts'
        },
        {
          type: 'doc',
          id:'build-on-morph/developer-resources/dapp-examples-on-morph'
        },
        {
          type: 'doc',
          id:'build-on-morph/developer-resources/morph-json-rpc-api-methods'
        },
        {
          type: 'link',
          href: "https://explorer-holesky.morphl2.io/",
          label: 'Morph Holesky Explorer'
        },
        {
          type: 'link',
          href: "https://holesky.etherscan.io/",
          label: 'Ethereum Holesky Explorer'
        },
        
      
      ]
    },


  ]
};
