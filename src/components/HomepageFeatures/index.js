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
        Get a quick overview of what is Morph and what our mission is.
      </>
    ),
  },
  
  {
    title: 'Quick Start',
    url: '/docs/quick-start/welcome-to-morph',
    svg: '/img/index/quick-start.png',
    description: (
      <>
        A go-to guide on how to easily start to experience Morph ecosystem.
      </>
    ),
  },

  {
    title: 'How Morph works',
    url: '/docs/how-morph-works/intro',
    svg: '/img/index/how-morph-works.png',
    description: (
      <>
        General explaination of what makes morph different from others
      </>
    ),
  },


  {
    title: 'Build on Morph',
    url: '/docs/build-on-morph/intro',
    svg: '/img/index/build-on-morph.png',
    description: (
      <>
        Everything you need to know on how to launch your dapp on Morph
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