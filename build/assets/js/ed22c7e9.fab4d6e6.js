"use strict";(self.webpackChunkmorph_doc=self.webpackChunkmorph_doc||[]).push([[2188],{991:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>a,contentTitle:()=>s,default:()=>l,frontMatter:()=>i,metadata:()=>d,toc:()=>c});var t=n(3274),r=n(2333);const i={title:"How to Run a Morph Full Node with Docker",lang:"en-US"},s=void 0,d={id:"build-on-morph/developer-resources/node-operation/how-to-run-a-morph-node-docker",title:"How to Run a Morph Full Node with Docker",description:"Run a Morph node with docker",source:"@site/docs/build-on-morph/developer-resources/node-operation/2-how-to-run-a-morph-node-docker.md",sourceDirName:"build-on-morph/developer-resources/node-operation",slug:"/build-on-morph/developer-resources/node-operation/how-to-run-a-morph-node-docker",permalink:"/docs/build-on-morph/developer-resources/node-operation/how-to-run-a-morph-node-docker",draft:!1,unlisted:!1,editUrl:"https://github.com/morph-l2/morph-doc/tree/main/docs/build-on-morph/developer-resources/node-operation/2-how-to-run-a-morph-node-docker.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"How to Run a Morph Full Node with Docker",lang:"en-US"},sidebar:"DeveloperSidebar",previous:{title:"Use Ecosystem Infrastructures",permalink:"/docs/build-on-morph/developer-resources/ecosystem-infrastructure"},next:{title:"How to Run a Morph Full Node from Source",permalink:"/docs/build-on-morph/developer-resources/node-operation/how-to-run-a-morph-node"}},a={},c=[{value:"Run a Morph node with docker",id:"run-a-morph-node-with-docker",level:2},{value:"Quick Start",id:"quick-start",level:3},{value:"Advanced Usage",id:"advanced-usage",level:3},{value:"Customizing Data Directory",id:"customizing-data-directory",level:4},{value:"Customizing parameters",id:"customizing-parameters",level:4},{value:"Managing Snapshots Yourself",id:"managing-snapshots-yourself",level:4},{value:"Run a Morph node with docker",id:"run-a-morph-node-with-docker-1",level:2}];function h(e){const o={a:"a",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.h2,{id:"run-a-morph-node-with-docker",children:"Run a Morph node with docker"}),"\n",(0,t.jsx)(o.p,{children:"This guide will help you start a full node running in the docker container."}),"\n",(0,t.jsx)(o.h3,{id:"quick-start",children:"Quick Start"}),"\n",(0,t.jsx)(o.p,{children:"Currently, users need to build the Docker image themselves using the Docker file and Docker Compose file we provide. However, there's no need to worry, as you only need one command to quickly start a full node. This command will handle everything for you, including downloading snapshots, structure data and config files, building the image, and starting the container."}),"\n",(0,t.jsxs)(o.ol,{children:["\n",(0,t.jsx)(o.li,{children:"Clone the dockerfile repository"}),"\n"]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-bash",children:"git clone --branch release/v0.2.x https://github.com/morph-l2/morph.git\n"})}),"\n",(0,t.jsxs)(o.ol,{start:"2",children:["\n",(0,t.jsx)(o.li,{children:"Run the following command"}),"\n"]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-bash",children:"cd ops/publicnode\nmake run-holesky-node\n"})}),"\n",(0,t.jsx)(o.p,{children:"Running this command will create a .morph-holesky directory in your user directory by default, serving as the node's home directory. Before starting the node, this command will perform several preparations:"}),"\n",(0,t.jsxs)(o.ul,{children:["\n",(0,t.jsx)(o.li,{children:"Create the node's home directory and copy the default configuration file into it."}),"\n",(0,t.jsx)(o.li,{children:"Prepare the secret-jwt.txt file for for authentication during RPC calls between geth and the node."}),"\n",(0,t.jsx)(o.li,{children:"Download the latest snapshot data to speed up node synchronization."}),"\n",(0,t.jsx)(o.li,{children:"Place the extracted snapshot data into the corresponding folder within the home directory."}),"\n"]}),"\n",(0,t.jsx)(o.p,{children:"After completing these preparations, the command will automatically build the image and start the container, with Docker volumes mounted to the created node home directory. If this is your first run, these processes may take some time."}),"\n",(0,t.jsx)(o.p,{children:"Note that if you are starting the node for the first time but already have a .morph-holesky directory, you must delete that directory before running the command. Otherwise, the preparation phase will be skipped, which may prevent the node from running properly."}),"\n",(0,t.jsx)(o.p,{children:"If the command fails during execution, you will also need to delete the previously created .morph-holesky directory before restarting."}),"\n",(0,t.jsx)(o.h3,{id:"advanced-usage",children:"Advanced Usage"}),"\n",(0,t.jsxs)(o.p,{children:["With the ",(0,t.jsx)(o.a,{href:"#quick-start",children:"Quick Start"})," guide above, you can quickly start a node using the default configuration files. However, we also support customizing the node's home directory and parameter settings."]}),"\n",(0,t.jsx)(o.h4,{id:"customizing-data-directory",children:"Customizing Data Directory"}),"\n",(0,t.jsxs)(o.p,{children:["The host directory paths that are mounted by the Docker container are specified in the ",(0,t.jsx)(o.code,{children:"ops/publicnode/.env"})," file."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-javascript",children:"##the home folder of your Morph node\nNODE_HOME=${HOME}/.morph-holesky \n## the data directory for your execution client: geth\nGETH_DATA_DIR=${NODE_HOME}/geth-data\n## the data directory for you consensus client: tendermint\nNODE_DATA_DIR=${NODE_HOME}/node-data\n## the entrypoint shell script for start execution client\nGETH_ENTRYPOINT_FILE=${NODE_HOME}/entrypoint-geth.sh\n## the jwt secret file for communicating between execution client and consensus client via engine API\nJWT_SECRET_FILE=${NODE_HOME}/jwt-secret.txt\n## the snapshot name for holesky Morph node \nSNAPSHOT_NAME=snapshot-20240805-1\n"})}),"\n",(0,t.jsxs)(o.p,{children:["You have the flexibility to customize the directory paths as per your requirements.\nPlease note that if you want make ",(0,t.jsx)(o.em,{children:"run-holesky-node"})," to generate the necessary configuration files and snapshots for running the node, you need to ensure that the specified node home directory is new (not previously created) and do ",(0,t.jsx)(o.em,{children:"NOT"})," alter the paths for ",(0,t.jsx)(o.code,{children:"GETH_DATA_DIR"})," and ",(0,t.jsx)(o.code,{children:"NODE_DATA_DIR"}),"."]}),"\n",(0,t.jsx)(o.h4,{id:"customizing-parameters",children:"Customizing parameters"}),"\n",(0,t.jsxs)(o.p,{children:["The default configuration required for node startup is located in the ",(0,t.jsx)(o.code,{children:"ops/publicnode/holesky "}),"directory. If your node home directory is empty, the ",(0,t.jsx)(o.em,{children:"run"})," command will automatically copy these configuration files to the directory mounted in the node's docker container."]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-javascript",children:"\u2514\u2500\u2500 holesky\n    \u251c\u2500\u2500 entrypoint-geth.sh\n    \u251c\u2500\u2500 geth-data\n    \u2502\xa0\xa0 \u2514\u2500\u2500 static-nodes.json\n    \u2514\u2500\u2500 node-data\n        \u251c\u2500\u2500 config\n        \u2502\xa0\xa0 \u251c\u2500\u2500 config.toml\n        \u2502\xa0\xa0 \u2514\u2500\u2500 genesis.json\n        \u2514\u2500\u2500 data\n"})}),"\n",(0,t.jsxs)(o.p,{children:["If you wish to modify the Geth startup command, you can do so by editing the ",(0,t.jsx)(o.code,{children:"entrypoint-geth.sh"})," file. For adjustments to the Tendermint-related configuration parameters, you should modify the node-data/config/config.toml file.\nNote that if you have customized your ",(0,t.jsx)(o.code,{children:"GETH_DATA_DIR"})," and ",(0,t.jsx)(o.code,{children:"NODE_DATA_DIR"}),", you will need to manually place the modified configuration files in the appropriate locations."]}),"\n",(0,t.jsx)(o.h4,{id:"managing-snapshots-yourself",children:"Managing Snapshots Yourself"}),"\n",(0,t.jsxs)(o.p,{children:["You may also manually manage snapshot, particularly if you are using custom paths for the node directories.\nThe ",(0,t.jsx)(o.em,{children:"make download-and-decompress-snapshot"})," command in the ",(0,t.jsx)(o.code,{children:"ops/publicnode"})," directory will assist you in downloading and decompressing the snapshot archive."]}),"\n",(0,t.jsxs)(o.p,{children:["Then, you need to manually place the decompressed data files in the appropriate node data directories.\nFor example, if the snapshot folder is named ",(0,t.jsx)(o.code,{children:"snapshot-20240805-1"}),", move the contents from ",(0,t.jsx)(o.code,{children:"snapshot-20240805-1/geth"})," to the ",(0,t.jsx)(o.code,{children:"${GETH_DATA_DIR}/geth"})," directory and the contents from ",(0,t.jsx)(o.code,{children:"snapshot-20240805-1/data"})," to the ",(0,t.jsx)(o.code,{children:"${NODE_DATA_DIR}/data"})," directory."]}),"\n",(0,t.jsx)(o.h2,{id:"run-a-morph-node-with-docker-1",children:"Run a Morph node with docker"})]})}function l(e={}){const{wrapper:o}={...(0,r.R)(),...e.components};return o?(0,t.jsx)(o,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},2333:(e,o,n)=>{n.d(o,{R:()=>s,x:()=>d});var t=n(9474);const r={},i=t.createContext(r);function s(e){const o=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function d(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:s(e.components),t.createElement(i.Provider,{value:o},e.children)}}}]);