"use strict";(self.webpackChunkmorph_doc=self.webpackChunkmorph_doc||[]).push([[3046],{9455:(e,o,t)=>{t.r(o),t.d(o,{assets:()=>i,contentTitle:()=>d,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var n=t(3274),r=t(2333);const s={title:"Upgrade node running on the host",lang:"en-US"},d=void 0,a={id:"build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-host",title:"Upgrade node running on the host",description:"If you are running the Docker container for the node using a custom setup, you will need to update the docker image yourself and then restart the container.",source:"@site/docs/build-on-morph/developer-resources/node-operation/upgrade-node/1-upgrade-node-host.md",sourceDirName:"build-on-morph/developer-resources/node-operation/upgrade-node",slug:"/build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-host",permalink:"/docs/build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-host",draft:!1,unlisted:!1,editUrl:"https://github.com/morph-l2/morph-doc/tree/main/docs/build-on-morph/developer-resources/node-operation/upgrade-node/1-upgrade-node-host.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Upgrade node running on the host",lang:"en-US"},sidebar:"DeveloperSidebar",previous:{title:"Upgrade node running from docker",permalink:"/docs/build-on-morph/developer-resources/node-operation/upgrade-node/upgrade-node-docker"},next:{title:"Contract Addresses",permalink:"/docs/build-on-morph/developer-resources/contracts"}},i={},c=[{value:"Step1:  Fetch latest code version",id:"step1--fetch-latest-code-version",level:3},{value:"Step2: Stop the nodes and delete previous images",id:"step2-stop-the-nodes-and-delete-previous-images",level:3},{value:"Step3: Build the latest image and restart the container",id:"step3-build-the-latest-image-and-restart-the-container",level:3}];function h(e){const o={a:"a",code:"code",h3:"h3",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.p,{children:"If you are running the Docker container for the node using a custom setup, you will need to update the docker image yourself and then restart the container."}),"\n",(0,n.jsxs)(o.p,{children:["The source code is available at ",(0,n.jsx)(o.a,{href:"https://github.com/morph-l2/morph.git",children:"https://github.com/morph-l2/morph.git"}),". You need to switch to the latest version of the code and then update your docker image."]}),"\n",(0,n.jsx)(o.p,{children:"If you are using  Run a Morph node with docker to start the docker container, you can follow the subsequent steps to upgrade the node."}),"\n",(0,n.jsx)(o.h3,{id:"step1--fetch-latest-code-version",children:"Step1:  Fetch latest code version"}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-bash",children:"git clone https://github.com/morph-l2/morph.git\n## checkout the latest version of the source code you need\ngit checkout ${latestVersion}\n"})}),"\n",(0,n.jsx)(o.h3,{id:"step2-stop-the-nodes-and-delete-previous-images",children:"Step2: Stop the nodes and delete previous images"}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-bash",children:"## stop docker container\ncd ops/publicnode\nmake stop-holesky-node\nmake rm-holesky-node\n## delete the pervious docker image for node\ndocker rmi morph/node:latest\n## delete the pervious docker image for geth\ndocker rmi morph/geth-nccc:latest\n"})}),"\n",(0,n.jsx)(o.h3,{id:"step3-build-the-latest-image-and-restart-the-container",children:"Step3: Build the latest image and restart the container"}),"\n",(0,n.jsx)(o.p,{children:"Please note that we need to ensure that the Docker container startup parameters are consistent with those used previously. If you used a custom configuration before, make sure that the configuration and directory paths used in this run are the same as before. For details, please refer to Advanced Usage"}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-bash",children:"## start the docker container, it will automatically build the new docker images\nmake run-holesky-node\n"})})]})}function u(e={}){const{wrapper:o}={...(0,r.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},2333:(e,o,t)=>{t.d(o,{R:()=>d,x:()=>a});var n=t(9474);const r={},s=n.createContext(r);function d(e){const o=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function a(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:d(e.components),n.createElement(s.Provider,{value:o},e.children)}}}]);