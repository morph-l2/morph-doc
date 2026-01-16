/**
 * Docusaurus Sidebar Configuration
 * 
 * Important: Each document can only belong to one sidebar.
 * Use type: 'link' with internal paths to reference documents without jumping sidebars.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const GetStartedSidebar = [
  { type: 'doc', id: 'about-morph/user-navigation-page', label: 'Welcome to Morph' },
  {
    type: 'html',
    value: `<a href="https://explorer.morph.network" target="_blank" rel="noopener noreferrer" class="menu__link menu__link--icon">
      <img src="/img/menu/explorer.svg" alt="" class="menu__link-icon" />
      <span>Explorer</span>
      <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules--pnpm-@docusaurus+theme-classic@3-1-1_@types+react@18-3-12_acorn@8-14-0_react-dom@18-3-1_react@18-3-1_typescript@5-2-2-node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
    </a>`,
    className: 'sidebar-icon-link',
  },
  {
    type: 'html',
    value: `<a href="https://bridge.morph.network" target="_blank" rel="noopener noreferrer" class="menu__link menu__link--icon">
      <img src="/img/menu/bridge.svg" alt="" class="menu__link-icon" />
      <span>Bridge</span>
      <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules--pnpm-@docusaurus+theme-classic@3-1-1_@types+react@18-3-12_acorn@8-14-0_react-dom@18-3-1_react@18-3-1_typescript@5-2-2-node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
    </a>`,
    className: 'sidebar-icon-link',
  },
  {
    type: 'category',
    label: 'Quickstart',
    collapsed: false,
    items: [
      'build-on-morph/developer-navigation-page',
      'build-on-morph/build-on-morph/integration-one-page',
      'build-on-morph/build-on-morph/development-setup',
      'build-on-morph/code-examples/deploy-contract-on-morph',
      'build-on-morph/build-on-morph/verify-your-smart-contracts',
    ],
  },
  {
    type: 'category',
    label: 'General Protocol Design',
    collapsed: false,
    items: [
      'how-morph-works/general-protocol-design/rollup',
      'how-morph-works/general-protocol-design/communicate-between-morph-and-ethereum',
      'how-morph-works/general-protocol-design/transactions-life-cycle',
      'how-morph-works/general-protocol-design/difference-between-ethereum-and-morph',
      'build-on-morph/build-on-morph/understand-transaction-cost-on-morph',
      'about-morph/eip7702',
      'about-morph/altfeetx',
    ],
  },
  {
    type: 'category',
    label: 'Learn',
    collapsed: false,
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
    collapsed: false,
    items: [
      'about-morph/faqs',
    ],
  },
];

const MorphChainSidebar = [
  {
    type: 'category',
    label: 'Build on Morph',
    collapsed: false,
    items: [
      { type: 'doc', id: 'build-on-morph/developer-navigation-page', label: 'Start Here' },
      { type: 'doc', id: 'build-on-morph/build-on-morph/integration-one-page', label: 'Morph Integration One Page' },
      { type: 'doc', id: 'build-on-morph/developer-resources/contracts', label: 'Contract Addresses' },
      { type: 'doc', id: 'quick-start/wallet-setup', label: 'Wallet Setup' },
      { type: 'doc', id: 'quick-start/faucet', label: 'Faucet' },
      { type: 'doc', id: 'quick-start/bridge', label: 'Bridge' },
    ],
  },
  {
    type: 'category',
    label: 'Developer Guides',
    collapsed: false,
    items: [
      { type: 'doc', id: 'build-on-morph/build-on-morph/development-setup', label: 'Development Setup' },
      { type: 'doc', id: 'build-on-morph/code-examples/deploy-contract-on-morph', label: 'Deploy Contracts on Morph' },
      { type: 'doc', id: 'build-on-morph/build-on-morph/verify-your-smart-contracts', label: 'Verify Your Smart Contracts' },
      { type: 'doc', id: 'build-on-morph/build-on-morph/bridge-between-morph-and-ethereum', label: 'Bridge Between Morph and Ethereum' },
      { type: 'doc', id: 'build-on-morph/sdk/js-sdk', label: 'Morph SDK'},
      { type: 'doc', id: 'build-on-morph/developer-resources/rpc-playground', label: 'HTTP RPC Playground' },
      'build-on-morph/developer-resources/dapp-examples-on-morph',
    ],
  },
  {
    type: 'category',
    label: 'Ecosystem Developers Tools',
    collapsed: false,
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
    collapsed: false,
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
  {
    type: 'category',
    label: 'Fundamental Concepts',
    collapsed: false,
    items: [
      { type: 'doc', id: 'about-morph/overview-of-morph', label: 'Overview' },
      { type: 'doc', id: 'how-morph-works/morph-modular-design', label: 'Morph Modular Design' },
      { type: 'doc', id: 'how-morph-works/optimistic-zkevm', label: 'Optimistic zkEVM' },
      { type: 'doc', id: 'how-morph-works/decentralized-sequencers/morph-decentralized-sequencer-network', label: 'Morph Decentralized Sequencer Network' },
    ],
  }
];

module.exports = {
  GetStartedSidebar,
  MorphChainSidebar,
  NodeOperatorsSidebar,
  LearnSidebar,
};
