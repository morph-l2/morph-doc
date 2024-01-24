import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'About Morph',
    url: '/docs/about-morph/overview-of-morph',
    svg: '/img/index/about-morph.png',
    description: (
      <>
        Learn more on what Morph is and our mission to revolutionize the industry.
      </>
    ),
  },
  
  {
    title: 'Quick Start',
    url: '/docs/quick-start/welcome-to-morph',
    svg: '/img/index/quick-start.png',
    description: (
      <>
        This guide will lead you through a seamless start with the vibrant Morph ecosystem.
      </>
    ),
  },

  {
    title: 'How Morph works',
    url: '/docs/how-morph-works/intro',
    svg: '/img/index/how-morph-works.png',
    description: (
      <>
        Gain insights into our unique approach and what distinguishes us from the rest.

      </>
    ),
  },


  {
    title: 'Build on Morph',
    url: '/docs/build-on-morph/intro',
    svg: '/img/index/build-on-morph.png',
    description: (
      <>
       Access comprehensive resources to bring your DApp from concept to launch on the Morph platform.
      </>
    ),
  }

];

function Feature({svg, title, url, description}) {
  return (
    <div className={clsx(styles.feature, 'col col--4')}>
      <a href={url} className={styles.featureA} alt="description">
        <div className="text--center">
          <img className={styles.featuresvg} src={svg} alt={description} role="img" />
          {/* <svg className={styles.featuresvg} role="img" /> */}
        </div>
        <div className="text--center padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </a>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.homepageResource}>Resource</h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}