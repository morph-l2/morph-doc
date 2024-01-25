import React from 'react';

export default function Link({
  children,
  href,
  ...props
}) {
  return <a
    href={href || ''}
    target={href?.startsWith('http') ? "_blank" : "_self"}
    {...props}
  >
    {children}
  </a>
}