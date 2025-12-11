#/bin/bash
set -exu

grep -q '"web-sdk": "1.1.33"' package.json || sed -i  '40i\    "web-sdk": "1.1.33",' package.json

file=src/theme/Footer/index.js
new_content="import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';
import FooterLayout from '@theme/Footer/Layout';

import { log } from '@site/src/components/log';

function Footer() {
  const {footer} = useThemeConfig();

  React.useEffect(() => {
    log({
      page: 'docs_page',
    });
  }, []);

  if (!footer) {
    return null;
  }
  const {copyright, links, logo, style} = footer;
  return (
    <FooterLayout
      style={style}
      links={links && links.length > 0 && <FooterLinks links={links} />}
      logo={logo && <FooterLogo logo={logo} />}
      copyright={copyright && <FooterCopyright copyright={copyright} />}
    />
  );
}
export default React.memo(Footer);"

# 检查文件是否存在
if [ ! -f "$file" ]; then
    echo "File not found!"
    exit 1
fi

# 替换文件内容
echo "$new_content" > "$file"
echo "Content replaced successfully."