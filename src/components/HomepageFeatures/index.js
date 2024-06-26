import React from 'react';
import classnames from 'classnames';
// import BrowserOnly from '@docusaurus/BrowserOnly';

// import MORPH_green_loop from '@site/static/lottie/MORPH_green_loop.svg';
// import MORPH_pink_loop from '@site/static/lottie/MORPH_pink_loop.svg';
// import MORPH_purple_loop from '@site/static/lottie/MORPH_purple_loop.svg';
// import MORPH_yellow_loop from '@site/static/lottie/MORPH_yellow_loop.svg';

// const Lottie = React.lazy(() => import('lottie-react'));

const FeatureList = [
  {
    title: 'For Users',
    url: '/docs/user-navigation-page',
    svg: '/lottie/MORPH_green_loop.svg',
    description: (
      <>
        Learn more on what Morph is and get guid on how to explore Moprh's ecosystem.
      </>
    ),
  },
  {
    title: 'For Developers',
    url: '/docs/build-on-morph/developer-navigation-page',
    svg: '/lottie/MORPH_green_loop.svg',
    description: (
      <>
        Access comprehensive resources to bring your DApp from concept to launch on Morph.
      </>
    ),
  },

];

function Feature({svg, title, url, style, description, index}) {
  return (
      <div className={"mt-4"}>
        <a href={url} className={classnames({
          '!border-r-0': index % 2 == 0,
          'hover:!border-r-1': index % 2 == 0,
        }, "feature-a p-2 pb-4 md:p-[55px] lg:pb-[55px] md:p-8 md:pb-8 flex items-center justify-center flex-col md:flex-row")} alt="description">
          <div className={"text-left flex items-center justify-center p-[0px] w-[60px] h-[60px] md:w-[140px] "+ style}>
            <img className={classnames('feature-svg w-[50px] h-[50px] md:w-[130px] md:h-[130px]')} src={svg} alt={description} role="img" />
            {/* <Lottie animationData={animationData} className="feature-svg w-[50px] h-[50px] md:w-[130px] md:h-[130px]"/> */}
          </div>
          <div className="mt-1 text-left md:pl-8 flex flex-col items-center md:items-start justify-center">
            <h3 className={classnames('feature-h3 mb-0 !text-xs md:!text-3xl')}>{title}</h3>
            <p className={classnames('feature-p mt-2 md:mt-[20px] !text-[10px] !leading-[12px] md:!text-xl xl:h-[84px]')}>{description}</p>
          </div>
        </a>
      </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className="features xl:min-h-[700px] xl:min-h-screen">
      <div className="container flex flex-col items-center mb-4">
        {/* <h2 className="mt-4 md:mt-12 text-[15px] md:text-[32px]">Resource</h2> */}
        <div className="mt-4 md:mt-8 gap-0 md:gap-0 flex items-center grid grid-flow-row grid-cols-2">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}