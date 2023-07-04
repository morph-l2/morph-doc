import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const {colorMode, setColorMode} = useColorMode();
  console.log('siteConfig', colorMode, siteConfig);
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <img src={`/img/index/banner_${colorMode}.svg`} alt="banner" />
      <div className={clsx(styles.headerContainer)}>
        <img src={`/img/index/header_${colorMode}.svg`} alt="banner" />
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Morphism is a secure, decentralized, and EVM-equivalent rollup that is cost-efficient and high-performing.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
