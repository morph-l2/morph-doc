import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import React from 'react';
import classnames from 'classnames';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function HomepageHeader() {
  return (
    <header
      className={"header-bg " + classnames('heroBanner')}
      >
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

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