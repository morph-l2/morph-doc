import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Quick Start',
    url: '/docs/quick-start/startintro',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        A go-to guide on how to easily start to experience Morphism ecosystem.
      </>
    ),
  },
  {
    title: 'Developer Docs',
    url: '',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Everything you need to know on how to launch your dapp on Morphism
      </>
    ),
  },
  {
    title: 'How Morphism works',
    url: '',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        General explaination of what makes morphism different from others
      </>
    ),
  },
];

function Feature({Svg, title, url, description}) {
  return (
    <div className={clsx(styles.feature, 'col col--4')}>
      <a href={url} className={styles.featureA} alt="description">
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
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
