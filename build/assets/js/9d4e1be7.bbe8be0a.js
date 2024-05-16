"use strict";(self.webpackChunkmorph_doc=self.webpackChunkmorph_doc||[]).push([[7220],{929:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>s,metadata:()=>h,toc:()=>d});var o=t(3274),n=t(2333);const s={title:"Development Setup",lang:"en-US",keywords:["morph","ethereum","rollup","layer2","validity proof","optimistic zk-rollup"],description:"Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!"},i="Start Developing on Morph",h={id:"build-on-morph/build-on-morph/development-setup",title:"Development Setup",description:"Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!",source:"@site/docs/build-on-morph/build-on-morph/2-development-setup.md",sourceDirName:"build-on-morph/build-on-morph",slug:"/build-on-morph/build-on-morph/development-setup",permalink:"/docs/build-on-morph/build-on-morph/development-setup",draft:!1,unlisted:!1,editUrl:"https://github.com/morph-l2/morph-doc/tree/main/docs/build-on-morph/build-on-morph/2-development-setup.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Development Setup",lang:"en-US",keywords:["morph","ethereum","rollup","layer2","validity proof","optimistic zk-rollup"],description:"Upgrade your blockchain experience with Morph - the secure decentralized, cost0efficient, and high-performing optimistic zk-rollup solution. Try it now!"},sidebar:"DevSidebar",previous:{title:"Difference between Morph and Ethereum",permalink:"/docs/build-on-morph/build-on-morph/difference-between-morph-and-ethereum"},next:{title:"Bridge between Morph and Ethereum",permalink:"/docs/build-on-morph/build-on-morph/bridge-between-morph-and-ethereum"}},l={},d=[{value:"Step 1: Network Configuration",id:"step-1-network-configuration",level:2},{value:"Step 2: Set up your developing framework",id:"step-2-set-up-your-developing-framework",level:2},{value:"Hardhat",id:"hardhat",level:3},{value:"Foundry",id:"foundry",level:3},{value:"ethers.js",id:"ethersjs",level:3},{value:"Step 3: Acquire Ether",id:"step-3-acquire-ether",level:2}];function c(e){const r={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.h1,{id:"start-developing-on-morph",children:"Start Developing on Morph"}),"\n",(0,o.jsx)(r.p,{children:"Developing on Morph is as easy as developing on Ethereum \u2014 literally!"}),"\n",(0,o.jsx)(r.p,{children:"To deploy contracts onto a MorphL2 chain, simply set the RPC endpoint of your target MorphL2 chain and deploy using your preferred Ethereum development framework :"}),"\n",(0,o.jsxs)(r.ul,{children:["\n",(0,o.jsx)(r.li,{children:(0,o.jsx)(r.a,{href:"https://hardhat.org/",children:"Hardhat"})}),"\n",(0,o.jsx)(r.li,{children:(0,o.jsx)(r.a,{href:"https://github.com/foundry-rs/foundry",children:"Foundry"})}),"\n",(0,o.jsx)(r.li,{children:(0,o.jsx)(r.a,{href:"https://eth-brownie.readthedocs.io/en/stable/",children:"Brownie"})}),"\n",(0,o.jsx)(r.li,{children:(0,o.jsx)(r.a,{href:"https://docs.alchemy.com/reference/alchemy-sdk-quickstart",children:"Alchemy"})}),"\n",(0,o.jsx)(r.li,{children:(0,o.jsx)(r.a,{href:"https://www.quicknode.com/docs/quicknode-sdk/getting-started?utm_source=morph-docs",children:"QuickNode SDK"})}),"\n"]}),"\n",(0,o.jsx)(r.p,{children:"...it all just works!"}),"\n",(0,o.jsx)(r.h1,{id:"holesky-testnet",children:"Holesky Testnet:"}),"\n",(0,o.jsx)(r.h2,{id:"step-1-network-configuration",children:"Step 1: Network Configuration"}),"\n",(0,o.jsx)(r.p,{children:"Before you start, ensure you are connected to the following networks:"}),"\n",(0,o.jsxs)(r.table,{children:[(0,o.jsx)(r.thead,{children:(0,o.jsxs)(r.tr,{children:[(0,o.jsx)(r.th,{children:"Network Name"}),(0,o.jsx)(r.th,{children:"Morph Holesky Testnet"}),(0,o.jsx)(r.th,{children:"Holesky Testnet"})]})}),(0,o.jsxs)(r.tbody,{children:[(0,o.jsxs)(r.tr,{children:[(0,o.jsx)(r.td,{children:"RPC URL"}),(0,o.jsx)(r.td,{children:(0,o.jsx)(r.a,{href:"https://rpc-quicknode-holesky.morphl2.io",children:"https://rpc-quicknode-holesky.morphl2.io"})}),(0,o.jsx)(r.td,{children:(0,o.jsx)(r.a,{href:"https://ethereum-holesky-rpc.publicnode.com/",children:"https://ethereum-holesky-rpc.publicnode.com/"})})]}),(0,o.jsxs)(r.tr,{children:[(0,o.jsx)(r.td,{children:"Chain ID"}),(0,o.jsx)(r.td,{children:"2810"}),(0,o.jsx)(r.td,{children:"17000"})]}),(0,o.jsxs)(r.tr,{children:[(0,o.jsx)(r.td,{children:"Currency Symbol"}),(0,o.jsx)(r.td,{children:"ETH"}),(0,o.jsx)(r.td,{children:"ETH"})]}),(0,o.jsxs)(r.tr,{children:[(0,o.jsx)(r.td,{children:"Block Explorer URL"}),(0,o.jsx)(r.td,{children:(0,o.jsx)(r.a,{href:"https://explorer-holesky.morphl2.io/",children:"https://explorer-holesky.morphl2.io/"})}),(0,o.jsx)(r.td,{children:(0,o.jsx)(r.a,{href:"https://holesky.etherscan.io/",children:"https://holesky.etherscan.io/"})})]})]})]}),"\n",(0,o.jsx)(r.admonition,{title:"Websocket Connection",type:"tip",children:(0,o.jsx)(r.p,{children:"wss://rpc-quicknode-holesky.morphl2.io"})}),"\n",(0,o.jsx)(r.h2,{id:"step-2-set-up-your-developing-framework",children:"Step 2: Set up your developing framework"}),"\n",(0,o.jsx)(r.h3,{id:"hardhat",children:"Hardhat"}),"\n",(0,o.jsx)(r.p,{children:"Modify your Hardhat config file hardhat.config.ts to point at the Morph public RPC."}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-jsx",children:'const config: HardhatUserConfig = {\n  ...\n  networks: {\n    morphl2: {\n      url: "" || "",\n      accounts:\n        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],\n    },\n  },\n};\n\n'})}),"\n",(0,o.jsx)(r.h3,{id:"foundry",children:"Foundry"}),"\n",(0,o.jsx)(r.p,{children:"To deploy using Morph Public RPC, run:"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-jsx",children:"forge create ... --rpc-url= --legacy\n"})}),"\n",(0,o.jsx)(r.h3,{id:"ethersjs",children:"ethers.js"}),"\n",(0,o.jsx)(r.p,{children:"Setting up a Morph  provider in an ethers script:"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-jsx",children:"import { ethers } from 'ethers';\n\nconst provider = new ethers.providers.JsonRpcProvider(\n  'https://\n);\n"})}),"\n",(0,o.jsx)(r.h2,{id:"step-3-acquire-ether",children:"Step 3: Acquire Ether"}),"\n",(0,o.jsxs)(r.p,{children:["To start building on Morph, you may need some testnet ETH. Use a faucet to acquire holesky Ether, then ",(0,o.jsx)(r.a,{href:"https://bridge-holesky.morphl2.io",children:"bridge"})," the test Ethereum Ether to the Morph testnet."]}),"\n",(0,o.jsx)(r.p,{children:"Each faucet has its own rules and requirements, so you may need to try a few before finding one that works for you."}),"\n",(0,o.jsx)(r.p,{children:"Here are some Holesky ETH faucet websites:"}),"\n",(0,o.jsx)(r.p,{children:(0,o.jsx)(r.a,{href:"https://stakely.io/en/faucet/ethereum-holesky-testnet-eth",children:"https://stakely.io/en/faucet/ethereum-holesky-testnet-eth"})}),"\n",(0,o.jsx)(r.p,{children:(0,o.jsx)(r.a,{href:"https://faucet.quicknode.com/ethereum/holesky",children:"https://faucet.quicknode.com/ethereum/holesky"})}),"\n",(0,o.jsx)(r.p,{children:(0,o.jsx)(r.a,{href:"https://holesky-faucet.pk910.de/",children:"https://holesky-faucet.pk910.de/"})}),"\n",(0,o.jsxs)(r.p,{children:["You can also use our own ",(0,o.jsx)(r.a,{href:"/docs/quick-start/faucet#morph-holesky-eth",children:"discord faucet"})," to obtain Morph Holesky USDT & Morph Holesky ETH."]}),"\n",(0,o.jsxs)(r.p,{children:["Once you receive ETH on holesky, you should see it in your wallet on the\xa0",(0,o.jsx)(r.em,{children:"holesky Network"}),". It may take a few seconds for them to appear, but you can check the status by looking for a transaction to your address on a\xa0",(0,o.jsx)(r.strong,{children:(0,o.jsx)(r.a,{href:"https://holesky.etherscan.io/",children:"Holesky Block Explorer"})}),"."]})]})}function p(e={}){const{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,o.jsx)(r,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},2333:(e,r,t)=>{t.d(r,{R:()=>i,x:()=>h});var o=t(9474);const n={},s=o.createContext(n);function i(e){const r=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function h(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),o.createElement(s.Provider,{value:r},e.children)}}}]);