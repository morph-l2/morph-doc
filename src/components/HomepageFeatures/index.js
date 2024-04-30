import React from 'react';
import classnames from 'classnames';

import MORPH_green_loop from '@site/static/lottie/MORPH_green_loop.json';
import MORPH_pink_loop from '@site/static/lottie/MORPH_pink_loop.json';
import MORPH_purple_loop from '@site/static/lottie/MORPH_purple_loop.json';
import MORPH_yellow_loop from '@site/static/lottie/MORPH_yellow_loop.json';

const Lottie = React.lazy(() => import('lottie-react'));


const FeatureList = [
  {
    title: 'About Morph',
    url: '/docs/about-morph/overview-of-morph',
    svg: MORPH_green_loop,
    style: 'green-bg',
    description: (
      <>
        Learn more on what Morph is and our mission to revolutionize the industry.
      </>
    ),
  },
  
  {
    title: 'Quick Start',

    url: '/docs/quick-start/welcome-to-morph',
    svg: MORPH_yellow_loop,
    style: 'yellow-bg',
    description: (
      <>
        This guide will lead you through a seamless start with the vibrant Morph ecosystem.
      </>
    ),
  },

  {
    title: 'How Morph works',
    url: '/docs/how-morph-works/intro',
    svg: MORPH_pink_loop,
    style: 'pink-bg',
    description: (
      <>
        Gain insights into our unique approach and what distinguishes us from the rest.
      </>
    ),
  },

  {
    title: 'Build on Morph',
    url: '/docs/build-on-morph/intro',
    svg: MORPH_purple_loop,
    style: 'purple-bg',
    description: (
      <>
        Access comprehensive resources to bring your DApp from concept to launch on the Morph platform.
      </>
    ),

  },

];

function Feature({svg, title, url, style, description}) {
  return (
    <div className={"mt-8"}>
      <a href={url} className={classnames("feature-a p-2 pb-4 lg:p-[55px] lg:pb-[55px] md:p-8 md:pb-8 flex items-center justify-center flex-col md:flex-row")} alt="description">
        <div className={"text-left flex items-center justify-center p-[5px] w-[60px] h-[60px] md:w-[140px] md:h-[140px] "+ style}>
          {/* <img className={classnames('feature-svg w-[60px] md:w-[140px]')} src={svg} alt={description} role="img" /> */}
          <Lottie animationData={svg} className="feature-svg w-[50px] h-[50px] md:w-[130px] md:h-[130px]"/>
        </div>
        <div className="mt-1 text-left md:pl-8 flex flex-col items-center md:items-start justify-center">
          <h3 className={classnames('feature-h3 mb-0 !text-xs md:!text-3xl')}>{title}</h3>
          <p className={classnames('feature-p mt-2 md:mt-[20px] !text-[10px] !leading-[12px] md:!text-xl')}>{description}</p>
        </div>
      </a>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className="features xl:min-h-[700px] xl:h-screen">
      <div className="container flex flex-col items-center mb-4">
        {/* <h2 className="mt-4 md:mt-12 text-[15px] md:text-[32px]">Resource</h2> */}
        <div className="mt-4 md:mt-8 gap-0 md:gap-0 flex items-center grid grid-flow-row grid-cols-2">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}