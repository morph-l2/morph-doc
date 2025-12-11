/**
 * Docusaurus Sidebar Configuration
 * 
 * Important: Each document can only belong to one sidebar.
 * Use type: 'ref' to reference documents from other sidebars.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const GetStartedSidebar = [
  'about-morph/user-navigation-page',
  {
    type: 'link',
    href: 'https://explorer.morph.network',
    label: 'Explorer',
  },
  {
    type: 'link',
    href: 'https://status.morph.network',
    label: 'Status',
  },
  {
    type: 'link',
    href: 'https://bridge.morph.network',
    label: 'Bridge',
  },
  {
    type: 'category',
    label: 'Quick Start Guides',
    collapsed: false,
    items: [
      'quick-start/wallet-setup',
      'quick-start/faucet',
      'quick-start/bridge',
    ],
  },
  {
    type: 'category',
    label: 'Quickstart',
    collapsed: false,
    items: [
      'build-on-morph/intro',
      'build-on-morph/build-on-morph/integration-one-page',
      'build-on-morph/build-on-morph/development-setup',
      'build-on-morph/code-examples/deploy-contract-on-morph',
      'build-on-morph/build-on-morph/verify-your-smart-contracts',
    ],
  },
  {
    type: 'category',
    label: 'General Protocol Design',
    collapsed: true,
    items: [
      'how-morph-works/general-protocol-design/rollup',
      'how-morph-works/general-protocol-design/communicate-between-morph-and-ethereum',
      'how-morph-works/general-protocol-design/transactions-life-cycle',
      'how-morph-works/general-protocol-design/difference-between-ethereum-and-morph',
      'build-on-morph/build-on-morph/understand-transaction-cost-on-morph',
    ],
  },
  {
    type: 'category',
    label: 'Learn',
    collapsed: true,
    items: [
      'about-morph/the-technology-behind-morph',
      'about-morph/morphs-architecture',
      'about-morph/key-concepts',
      'about-morph/roadmap',
      'about-morph/morphs-vision-and-mission',
      'about-morph/morph-rails',
    ],
  },
  {
    type: 'category',
    label: 'Support',
    collapsed: true,
    items: [
      'about-morph/faqs',
    ],
  },
];

const MorphChainSidebar = [
  'build-on-morph/developer-navigation-page',
  {
    type: 'category',
    label: 'Build on Morph',
    collapsed: false,
    items: [
      { type: 'ref', id: 'build-on-morph/intro' },
      { type: 'ref', id: 'build-on-morph/build-on-morph/integration-one-page' },
      'build-on-morph/developer-resources/contracts',
      { type: 'ref', id: 'quick-start/wallet-setup' },
      { type: 'ref', id: 'quick-start/faucet' },
      { type: 'ref', id: 'quick-start/bridge' },
    ],
  },
  {
    type: 'category',
    label: 'Developer Guides',
    collapsed: false,
    items: [
      { type: 'ref', id: 'build-on-morph/build-on-morph/development-setup' },
      { type: 'ref', id: 'build-on-morph/code-examples/deploy-contract-on-morph' },
      { type: 'ref', id: 'build-on-morph/build-on-morph/verify-your-smart-contracts' },
      'build-on-morph/build-on-morph/bridge-between-morph-and-ethereum',
      'build-on-morph/sdk/globals',
      'build-on-morph/developer-resources/dapp-examples-on-morph',
    ],
  },
  {
    type: 'category',
    label: 'Ecosystem Developers Tools',
    collapsed: true,
    items: [
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/user-onboarding',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/cross-chain-interoperability',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/safe-multi-signature-wallet',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/rpc-services',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/account-abstraction',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/blockchain-indexing-services',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/blockchain-oracles',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/block-explorer',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/artificial-intelligence',
      'build-on-morph/developer-resources/use-ecosystem-developer-tools/decentralized-naming-services',
    ],
  },
  {
    type: 'category',
    label: 'Links and Tools',
    collapsed: true,
    items: [
      {
        type: 'link',
        href: 'https://bridge.morph.network/',
        label: 'Morph Official Bridge',
      },
      {
        type: 'link',
        href: 'https://explorer.morph.network/',
        label: 'Morph Mainnet Explorer',
      },
      {
        type: 'link',
        href: 'https://bridge-hoodi.morph.network/',
        label: 'Morph Hoodi Official Bridge',
      },
      {
        type: 'link',
        href: 'https://explorer-hoodi.morph.network/',
        label: 'Morph Hoodi Explorer',
      },
      {
        type: 'link',
        href: 'https://hoodi.etherscan.io/',
        label: 'Ethereum Hoodi Explorer',
      },
    ],
  },
];

const NodeOperatorsSidebar = [
  {
    type: 'category',
    label: 'Full Node',
    collapsed: false,
    items: [
      'build-on-morph/developer-resources/node-operation/full-node/run-in-docker',
      'build-on-morph/developer-resources/node-operation/full-node/run-on-host',
      'build-on-morph/developer-resources/node-operation/prune-state',
    ],
  },
  {
    type: 'category',
    label: 'Validator',
    collapsed: false,
    items: [
      'build-on-morph/developer-resources/node-operation/validator-node/run-in-docker',
      'build-on-morph/developer-resources/node-operation/validator-node/run-on-host',
    ],
  },
  {
    type: 'category',
    label: 'Upgrade Node',
    collapsed: false,
    items: [
      'build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-docker',
      'build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-host',
    ],
  },
];

const LearnSidebar = [
  'about-morph/overview-of-morph',
  {
    type: 'category',
    label: 'Fundamental Concepts',
    collapsed: false,
    items: [
      'how-morph-works/morph-modular-design',
      'how-morph-works/optimistic-zkevm',
      'how-morph-works/decentralized-sequencers/morph-decentralized-sequencer-network',
    ],
  },
  {
    type: 'category',
    label: 'General Protocol Design',
    collapsed: true,
    items: [
      { type: 'ref', id: 'how-morph-works/general-protocol-design/rollup' },
      { type: 'ref', id: 'how-morph-works/general-protocol-design/communicate-between-morph-and-ethereum' },
      { type: 'ref', id: 'how-morph-works/general-protocol-design/transactions-life-cycle' },
      { type: 'ref', id: 'how-morph-works/general-protocol-design/difference-between-ethereum-and-morph' },
      { type: 'ref', id: 'build-on-morph/build-on-morph/understand-transaction-cost-on-morph' },
    ],
  },
  {
    type: 'category',
    label: 'About Morph',
    collapsed: true,
    items: [
      { type: 'ref', id: 'about-morph/the-technology-behind-morph' },
      { type: 'ref', id: 'about-morph/morphs-architecture' },
      { type: 'ref', id: 'about-morph/key-concepts' },
      { type: 'ref', id: 'about-morph/roadmap' },
      { type: 'ref', id: 'about-morph/morphs-vision-and-mission' },
      { type: 'ref', id: 'about-morph/morph-rails' },
    ],
  },
  {
    type: 'category',
    label: 'Support',
    collapsed: true,
    items: [
      { type: 'ref', id: 'about-morph/faqs' },
    ],
  },
];

module.exports = {
  GetStartedSidebar,
  MorphChainSidebar,
  NodeOperatorsSidebar,
  LearnSidebar,
};
