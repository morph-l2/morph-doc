import React, { useEffect } from 'react';
import classnames from 'classnames';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { log } from '@site/src/components/log';

function HomepageHeader() {
  // const {siteConfig} = useDocusaurusContext();
  // const {colorMode, setColorMode} = useColorMode();

  return (
    <header
      className={"header-bg " + classnames('heroBanner')}
      >
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  useEffect(() => {
    log({
      page: 'docs_page',
    });
  }, [])
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Morph is a secure, decentralized, and EVM-compatiable rollup that is cost-efficient and high-performing.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}