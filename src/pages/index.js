import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import React from 'react';
import classnames from 'classnames';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function HomepageHeader() {
  return (
    <header
      className={classnames('flex flex-col items-center justify-center text-[#FFF] heroBanner h-screen bg-[#7D68FF] px-4')}
      >
      <p className='text-[16px]'>Your Gateway to the Morph Ecosystem</p>
      <h2 className='text-[48px] leading-[70px] md:text-[85px] md:leading-[85px] xl:text-[140px] xl:leading-[100px] font-bold font-denim text-[#FFF]'>MORPH-DOCS</h2>
      <p className='hidden text-[18px] text-center'>Learn everything about Morph here.</p>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      className="min-h-screen"
      description="Morph is a secure, decentralized, and EVM-compatiable rollup that is cost-efficient and high-performing.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}