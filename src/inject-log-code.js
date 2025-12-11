/**
 * 此脚本用于在构建时注入日志代码到 Footer/index.js
 * 使用 replace code 模式，只替换需要的部分
 */

const fs = require('fs');
const path = require('path');

const FOOTER_FILE = path.join(__dirname, 'theme/Footer/index.js');

if (!fs.existsSync(FOOTER_FILE)) {
  console.error(`Error: ${FOOTER_FILE} not found!`);
  process.exit(1);
}

let content = fs.readFileSync(FOOTER_FILE, 'utf-8');

if (content.includes("import { log } from '@site/src/components/log'")) {
  console.log('Log code already injected, skipping...');
  process.exit(0);
}

console.log(`Injecting log code into ${FOOTER_FILE}...`);

const importStatement = "/*** import log code ***/";
const newImport = `import { log } from '@site/src/components/log';`;

content = content.replace(importStatement, newImport);

const hookInsertPoint = '/*** log code end ***/';
const newHookCode = `
  React.useEffect(() => {
    log({
      page: 'docs_page',
    });
  }, []);`;

content = content.replace(hookInsertPoint, newHookCode);

fs.writeFileSync(FOOTER_FILE, content, 'utf-8');

console.log('Log code injection complete!');
