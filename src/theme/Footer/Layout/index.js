import React from 'react';
import classnames from 'classnames';


import { links } from "@site/src/components/config";
import { LogoWithText } from "@site/src/components/logo";
import SocialLinks from "@site/src/components/SocialLinks";
import Link from "@site/src/components/Link";


export default function FooterLayout({style, links, logo, copyright}) {
  return (
    <footer
      className={classnames('footer', {
        'footer--dark': style === 'dark',
      })}>
        <div className='flex flex-col md:flex-row max-w-7xl mx-auto px-4 md:px-0 py-6 md:py-10'>
          <div className="order-3 md:order-1 mt-0 md:w-[284px]">
            {/* <img
              src={`/img/index/logo_${style}.svg`}
              alt="morph logo"
              className={"w-[160px] h-[25px]"}
            /> */}
            <div className="morph-logo w-[160px] h-[25px]"></div>
            {/* <p className="mt-[9px] text-[14px] font-medium md:text-tiny md:!font-semibold text-desc-1">Building an Ecosystem for Value-Driven Dapps</p> */}
            <SocialLinks bgClass="bg-[#ffffff1a] rounded-full" size="12" className="mt-6 flex flex-row gap-4" />
            <div className="copy-right mt-3 text-xs text-desc-1">© 2023 <Link href={links.brand} className="text-desc-1">Morph</Link>. All rights reserved</div>
          </div>
          <div className='order-1 flex-1'></div>
          <div className='order-2 flex-1 justify-end'>
            {links}
          </div>
        </div>
    </footer>
  );
}
