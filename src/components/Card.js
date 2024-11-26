import cls from 'classnames';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

/**
 * https://tailwindcss.com/docs/grid-template-columns

import { CardGroup, Card } from '@site/src/components/Card'

<CardGroup className="grid-cols-3">
  <Card
    href="https://morphl2.io"
    icon="/img/cards/logo.svg"
    darkIcon="/img/cards/logo-dark.svg"
    text="LOGO 1" />
  <Card 
    href="https://morphl2.io"
    icon="/img/cards/logo.svg"
    text="LOGO 2" />
  <Card
    icon="/img/cards/logo.svg"
    text="LOGO 3" />
  <Card icon="/img/cards/logo.svg" text="LOGO 4" />
  <Card icon="/img/cards/logo.svg" text="LOGO 5" />
  <Card icon="/img/cards/logo.svg" text="LOGO 6" />
  <Card icon="/img/cards/logo.svg" text="LOGO 7" />
</CardGroup>
 */
export const CardGroup = ({
  className,
  children
}) => {
  return <div className={"flex gap-4 mb-8 grid " + className}>
    {children}
  </div>
}

export const Card = ({
  className,
  href,
  icon,
  darkIcon,
  text,
  children
}) => {
  const {withBaseUrl} = useBaseUrlUtils();
  const sources = {
    light: withBaseUrl(icon),
    dark: withBaseUrl(darkIcon ?? icon),
  };

  return <a href={href} target={href?.startsWith('http') ? "_blank" : "_self"} className={cls("no-underline items-center hover:no-underline bg-card-background cursor-pointer rounded-[4px] text-card-text border border-solid border-card-border py-5 px-4 flex flex-row", {
    'hover:border-[#14A800] hover:text-brand': href
  })}>
    {/* <img className="w-6 h-6" src={icon} /> */}
    <ThemedImage
      className={cls('w-6 h-6')}
      alt={icon}
      sources={sources}
    />
    <span className="ml-2 text-[16px] leading-[20px]">{text}</span>
  </a>
}