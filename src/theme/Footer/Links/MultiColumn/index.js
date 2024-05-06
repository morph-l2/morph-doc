import React from 'react';
import LinkItem from '@theme/Footer/LinkItem';
function ColumnLinkItem({item}) {
  return item.html ? (
    <li
      className="footer__item"
      // Developer provided the HTML, so assume it's safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: item.html}}
    />
  ) : (
    <li key={item.href ?? item.to} className="footer__item">
      <LinkItem item={item} />
    </li>
  );
}
function Column({column}) {
  return (
    <div className="flex-1">
      <div className="footer__title text-[#FFFFFF66]">{column.title}</div>
      <ul className="flex flex-col footer__items clean-list text-[#fff]">
        {column.items.map((item, i) => (
          <ColumnLinkItem key={i} item={item} />
        ))}
      </ul>
    </div>
  );
}
export default function FooterLinksMultiColumn({columns}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:flex xl:flex-row">
      {columns.map((column, i) => (
        <Column key={i} column={column} />
      ))}
    </div>
  );
}
