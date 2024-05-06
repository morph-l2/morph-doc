import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import React from 'react';
import classnames from 'classnames';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function HomepageHeader() {
  return (
    <header
      className={classnames('relative flex flex-col items-center justify-center text-[#FFF] heroBanner h-[320px] md:h-[780px] bg-[#7D68FF] px-4')}
      >
      <img  src="/lottie/bg-logo.svg" className="flex absolute top-[6px] h-[95%]" />
      <p className='text-[16px]'>Your gateway to the morph ecosystem</p>
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