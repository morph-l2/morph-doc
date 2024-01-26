import { Discord, Github, LinkedIn, Medium, Telegram, TwitterX } from './logo';

import Link from './Link';
import React from 'react';
import cls from 'classnames';
import { links } from './config';

const socialLinks = [{
  label: 'Twitter',
  link: links.twitter,
  img: (fill, size) => <TwitterX fill={fill} size={size} />,
  log_name: 'twitter:_click',
}, {
  label: 'Discord',
  link: links.discord,
  img: (fill, size) => <Discord fill={fill} size={size} />,
}, {
  label: 'Medium',
  link: links.medium,
  img: (fill, size) => <Medium fill={fill} size={size} />,
  log_name: 'medium:_click',
}, {
  label: 'Telegram',
  link: links.telegram,
  img: (fill, size) => <Telegram fill={fill} size={size} />,
}, {
  label: 'Github',
  link: links.github,
  img: (fill, size) => <Github fill={fill} size={size} />,
}, {
  label: 'LinkedIn',
  link: links.linkedIn,
  img: (fill, size) => <LinkedIn fill={fill} size={size} />,
}]

export default function SocialLinks(props) {
  const links = socialLinks.filter(v => v.link).slice(0, props.slice || socialLinks.length);

  return <div className={cls("text-b-white", props.className, {
    [`grid-cols-${links.length}`]: true
  })}>{links?.map((val, key) => {
    return (<Link
        key={key} href={val.link || ''}
        className={props.bgClass + " social-link flex justify-center items-center"}
        target={val.link.startsWith('http') ? "_blank" : "_self"}
        >
      <span className="inline-block w-6 h-6 flex items-center justify-center">{val.img(props.fill || '', props.size || '24')}</span>
      <span className="sr-only ml-3 -mt-1 social-label">{val.label}</span>
    </Link>)
  })}</div>
}