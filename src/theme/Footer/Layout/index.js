import React from 'react';
import classnames from 'classnames';
// import BrowserOnly from '@docusaurus/BrowserOnly';

import SocialLinks from "@site/src/components/SocialLinks";
import Link from "@site/src/components/Link";

// import logoHi from '@site/static/lottie/hi.json';

// const Lottie = React.lazy(() => import('lottie-react'));

export default function FooterLayout({style, links, logo, copyright}) {

  return (
      <footer
        className={classnames('relative h-screen !bg-[#21231C]', {
          'footer--dark': style === 'dark',
        })}>
          <div className='flex flex-col md:flex-row max-w-7xl mx-auto px-4 md:px-0 py-6 md:py-10'>
            <div className="order-3 md:order-1 mt-0 md:w-[284px]">
              {/* <img
                src={`/img/index/logo_${style}.svg`}
                alt="morph logo"
                className={"w-[160px] h-[25px]"}
              /> */}
              <div className="hidden morph-logo w-[160px] h-[25px]"></div>
              {/* <p className="mt-[9px] text-[14px] font-medium md:text-tiny md:!font-semibold text-desc-1">Building an Ecosystem for Value-Driven Dapps</p> */}
              <SocialLinks bgClass="hidden bg-[#ffffff1a] rounded-full" size="12" className="mt-6 flex flex-row gap-4" />
              <div className="copy-right mt-3 text-xs text-desc-1">© {new Date().getFullYear()} <Link href={links.brand} className="text-desc-1">Morph</Link>. All rights reserved</div>
            </div>
            <div className='order-1 w-[284px]'></div>
            <div className='order-2 flex-1 justify-end'>
              {links}
            </div>

          <p className="order-3 mt-[133px] xl:mt-0 text-left pb-8 xl:pb-0 xl:absolute screen-huge xl:bottom-8 text-[#AEDFE0] leading-[59px] text-[59px] md:leading-[84px] md:text-[84px] xl:leading-[100px] xl:text-[140px] font-bold uppercase font-denim">
            <p className="animate-up">It’s</p>
            <p className="animate-up">morphing</p>
            <p className="animate-up">time!</p>
          </p>
        </div>
        
        {/* <Lottie animationData={animationData} className="absolute w-[100px] xl:w-[280px] bottom-0 right-[30%]" /> */}
      </footer>
  );
}
