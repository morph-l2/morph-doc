import React from 'react';
import classnames from 'classnames';

const FeatureList = [
  {
    title: 'For Users',
    url: '/docs/user-navigation-page',
    svg: '/img/banner1.svg',
    description: (
      <>
        Learn more on what Morph is and get guid on how to explore Moprh's ecosystem.
      </>
    ),
  },

  {
    title: 'For Developers',
    url: '/docs/build-on-morph/developer-navigation-page',
    svg: '/img/banner4.svg',

    description: (
      <>
        Access comprehensive resources to bring your DApp from concept to launch on Morph.
      </>
    ),

  },

];


function Feature({svg, title, url, description}) {
  return (
    <div className={"mt-2"}>
      <a href={url} className={classnames("feature-a p-2 pb-4 lg:p-[55px] lg:pb-[55px] md:p-8 md:pb-8 flex-col md:flex-row")} alt="description">
        <div className="text-left flex items-center justify-center">
          <img className={classnames('feature-svg w-[60px] md:w-[140px]')} src={svg} alt={description} role="img" />
        </div>
        <div className="mt-1 text-left pl-4 flex flex-col items-center md:items-start justify-center">
          <h3 className={classnames('feature-h3 mb-0 !text-xs md:!text-3xl')}>{title}</h3>
          <p className={classnames('feature-p mt-2 md:mt-[20px] !text-[10px] !leading-[12px] md:!text-xl')}>{description}</p>
        </div>
      </a>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className="features">
      <div className="container flex flex-col items-center">
        {/* <h2 className="mt-4 md:mt-12 text-[15px] md:text-[32px]">Resource</h2> */}
        <div className="mt-4 md:mt-[80px] gap-2 md:gap-8 flex items-center grid grid-flow-row grid-cols-2">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}