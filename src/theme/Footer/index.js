import React from 'react';
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
  }, [])

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
export default React.memo(Footer);
