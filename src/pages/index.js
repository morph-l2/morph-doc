import React, { useEffect } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { log } from '@site/src/components/log';

import styles from './index.module.css';

function HomepageHeader() {
  // const {siteConfig} = useDocusaurusContext();
  // const {colorMode, setColorMode} = useColorMode();

  return (
    <div>
      <header
        className={clsx('bg-bg-gradient hero hero--primary', styles.heroBanner, styles['header-bg'])}
        >
      </header>
    </div>
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
