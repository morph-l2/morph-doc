/**
 * Agent Skills (skills/) sidebar: mirrors each subdirectory's SKILL.md and skills/README.md.
 * When adding a new skill, append an entry here; or run __tests__/skills-sidebar.test.mjs to validate against the directory.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const SkillsSidebar = [
  { type: 'doc', id: 'README', label: 'Overview' },
  {
    type: 'category',
    label: 'Skill playbooks',
    collapsed: false,
    items: [
      { type: 'doc', id: 'morph-contracts/SKILL', label: 'Morph Contract Addresses' },
      { type: 'doc', id: 'morph-dapp-code-review/SKILL', label: 'Morph dApp Code Review' },
      { type: 'doc', id: 'morph-dapp-codegen/SKILL', label: 'Morph dApp TDD Codegen' },
      { type: 'doc', id: 'morph-dapp-planning/SKILL', label: 'Morph dApp Planning' },
      { type: 'doc', id: 'morph-dapp-workflow/SKILL', label: 'Morph dApp End-to-End Workflow' },
      { type: 'doc', id: 'morph-full-node-run-on-host/SKILL', label: 'Morph Full Node (host)' },
      { type: 'doc', id: 'morph-js-sdk/SKILL', label: 'Morph JS/TS SDK' },
      { type: 'doc', id: 'morph-rails/SKILL', label: 'Morph Rails' },
      { type: 'doc', id: 'morph-skill-ln/SKILL', label: 'morph-skill-ln (symlink script)' },
      { type: 'doc', id: 'morph-tx-cost/SKILL', label: 'Morph Transaction Fees' },
    ],
  },
];

module.exports = {
  SkillsSidebar,
};
