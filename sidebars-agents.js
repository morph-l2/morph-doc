/**
 * Agent definitions (agents/*.md): mirror markdown files in agents/.
 * When adding a file here, append an entry; run __tests__/agents-sidebar.test.mjs to validate.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const AgentsSidebar = [
  { type: 'doc', id: 'morph-doc-agent', label: 'Morph Doc Agent' },
  { type: 'doc', id: 'morph-dapp-agent', label: 'Morph dApp Agent' },
];

module.exports = {
  AgentsSidebar,
};
