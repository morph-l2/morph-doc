import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Quick Start',
    // url: '/docs/quick start/quickintro',
    svg: '/img/index/quick_start.svg',
    description: (
      <>
        A go-to guide on how to easily start to experience Morphism ecosystem.
      </>
    ),
  },

  {
    title: 'How Morphism works',
    url: '/docs/how-morphism-works/intro',
    svg: '/img/index/how_morphism_works.svg',
    description: (
      <>
        General explaination of what makes morphism different from others
      </>
    ),
  },
  {
    title: 'Developer Docs',
    // url: '/docs/Build on Morphism/devintro',
    svg: '/img/index/developer_docs.svg',
    description: (
      <>
        Everything you need to know on how to launch your dapp on Morphism
      </>
    ),
  },
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
