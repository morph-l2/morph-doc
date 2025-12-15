import React from 'react';
import classnames from 'classnames';
import Link from "@docusaurus/Link";
import { links, footerLinks } from "@site/src/components/config";

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.52219 6.77491L13.4785 2.3999H12.5659L9.07378 6.19304L6.2971 2.3999H3.16602L7.30636 8.5862L3.16602 13.1999H4.07861L7.75339 9.19346L10.6931 13.1999H13.8242L9.52219 6.77491ZM8.19597 8.68588L7.79371 8.13075L4.39957 3.04687H5.86723L8.62828 7.21687L9.03054 7.772L12.5664 12.5831H11.0987L8.19597 8.68588Z" fill="currentColor"/>
  </svg>
);

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5464 3.70492C12.5366 3.23525 11.4537 2.89627 10.3219 2.7168C10.1855 2.96012 10.0212 3.29307 9.90748 3.55844C8.69746 3.39191 7.49947 3.39191 6.31354 3.55844C6.19979 3.29307 6.03145 2.96012 5.89405 2.7168C4.76121 2.89627 3.67729 3.23626 2.6675 3.70694C0.533725 6.78068 -0.0308593 9.77542 0.263242 12.7249C1.63324 13.7269 2.95896 14.3388 4.26053 14.7397C4.5703 14.3168 4.84582 13.8677 5.08206 13.3945C4.63181 13.2269 4.20056 13.0189 3.79233 12.7753C3.90608 12.6906 4.01679 12.6018 4.12347 12.511C6.66827 13.6892 9.42929 13.6892 11.9457 12.511C12.0534 12.6018 12.1641 12.6906 12.2768 12.7753C11.8676 13.0199 11.4353 13.2279 10.9851 13.3955C11.2213 13.8677 11.4958 14.3179 11.8066 14.7408C13.1092 14.3398 14.4359 13.7279 15.8059 12.7249C16.1481 9.32007 15.2604 6.35351 13.5464 3.70492ZM5.4511 10.9878C4.66883 10.9878 4.02491 10.2516 4.02491 9.35528C4.02491 8.45898 4.6547 7.72176 5.4511 7.72176C6.2475 7.72176 6.8894 8.45797 6.87725 9.35528C6.87826 10.2516 6.2475 10.9878 5.4511 10.9878ZM10.6181 10.9878C9.83581 10.9878 9.19189 10.2516 9.19189 9.35528C9.19189 8.45898 9.82168 7.72176 10.6181 7.72176C11.4145 7.72176 12.0564 8.45797 12.0442 9.35528C12.0442 10.2516 11.4145 10.9878 10.6181 10.9878Z" fill="currentColor"/>
  </svg>
);

const MediumIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.02503 8.00001C9.02503 10.2091 7.2342 12 5.02503 12C2.81587 12 1.02503 10.2091 1.02503 8.00001C1.02503 5.79084 2.81587 4.00001 5.02503 4.00001C7.2342 4.00001 9.02503 5.79084 9.02503 8.00001Z" fill="currentColor"/>
    <path d="M13.525 8.00001C13.525 10.0711 12.6296 11.75 11.525 11.75C10.4205 11.75 9.52503 10.0711 9.52503 8.00001C9.52503 5.92894 10.4205 4.25001 11.525 4.25001C12.6296 4.25001 13.525 5.92894 13.525 8.00001Z" fill="currentColor"/>
    <path d="M15.025 8.00001C15.025 9.79669 14.7364 11.25 14.3812 11.25C14.026 11.25 13.7375 9.79669 13.7375 8.00001C13.7375 6.20333 14.026 4.75001 14.3812 4.75001C14.7364 4.75001 15.025 6.20333 15.025 8.00001Z" fill="currentColor"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.9501 2.23499L12.7101 13.105C12.5451 13.855 12.0851 14.045 11.4401 13.69L8.22012 11.3L6.66512 12.79C6.49512 12.96 6.35012 13.105 6.02012 13.105L6.24512 9.82999L12.3201 4.36499C12.5701 4.13999 12.2651 4.01499 11.9351 4.23999L4.45512 8.94499L1.27512 7.94999C0.550122 7.71499 0.535122 7.19499 1.43012 6.83999L14.0001 1.92499C14.6001 1.71499 15.1301 2.06999 14.9501 2.23499Z" fill="currentColor"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.6333 1.33334H2.36C1.72267 1.33334 1.20667 1.85601 1.20667 2.50001V13.5C1.20667 14.144 1.72267 14.6667 2.36 14.6667H13.6333C14.2707 14.6667 14.7933 14.144 14.7933 13.5V2.50001C14.7933 1.85601 14.2707 1.33334 13.6333 1.33334ZM5.42 12.6667H3.41333V6.33334H5.42667V12.6667H5.42ZM4.41667 5.44001C3.75333 5.44001 3.21667 4.90334 3.21667 4.24001C3.21667 3.57668 3.75333 3.04001 4.41667 3.04001C5.08 3.04001 5.61667 3.57668 5.61667 4.24001C5.61667 4.90401 5.08 5.44001 4.41667 5.44001ZM12.78 12.6667H10.7733V9.57334C10.7733 8.81668 10.76 7.84001 9.71333 7.84001C8.65333 7.84001 8.49333 8.66668 8.49333 9.52001V12.6667H6.48667V6.33334H8.41333V7.23334H8.44C8.71333 6.71334 9.37667 6.16668 10.3533 6.16668C12.38 6.16668 12.78 7.49334 12.78 9.20001V12.6667Z" fill="currentColor"/>
  </svg>
);


const socialLinks = [
  { name: 'Twitter', icon: TwitterIcon, url: links.twitter },
  { name: 'Discord', icon: DiscordIcon, url: links.discord },
  { name: 'Medium', icon: MediumIcon, url: links.medium },
  { name: 'Telegram', icon: TelegramIcon, url: links.telegram },
  { name: 'LinkedIn', icon: LinkedInIcon, url: links.linkedIn },
];

export default function FooterLayout({style, links: docusaurusLinks, logo, copyright}) {
  const visibleFooterLinks = footerLinks
    .filter(column => !column.hidden)
    .map(column => ({
      ...column,
      children: column.children.filter(child => !child.hidden)
    }))
    .filter(column => column.children.length > 0);

  return (
    <footer
      className={classnames('footer', {
        'footer--dark': style === 'dark',
      })}
      style={{
        backgroundColor: 'var(--ifm-footer-background-color)',
        borderTop: '0.5px solid var(--ifm-border-color)',
        padding: '48px 120px',
      }}
    >
      <div 
        className="footer__container"
        style={{
          display: 'flex',
          gap: '120px',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        
        <div 
          className="footer__left"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            minWidth: '284px',
          }}
        >
          
          <div className="footer__logo">
            <Link 
              to="/"
              style={{
                display: 'inline-block',
                width: '114px',
                height: '28px',
              }}
            >
              <img 
                src="/logo/morph-docs-black.svg" 
                alt="Morph Docs"
                className="footer__logo-img"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
              />
            </Link>
          </div>

          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div 
              className="footer__social"
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  to={social.url}
                  className="footer__social-link"
                  aria-label={social.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '56px',
                    backgroundColor: 'rgba(14, 14, 17, 0.07)',
                    color: 'var(--ifm-heading-color)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <social.icon />
                </Link>
              ))}
            </div>

            
            <div 
              className="footer__copyright"
              style={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '12px',
                lineHeight: '16px',
                color: 'var(--ifm-color-secondary)',
              }}
            >
              © {new Date().getFullYear()} Morph. All rights reserved
            </div>
          </div>
        </div>

        
        <div 
          className="footer__links-wrapper"
          style={{
            display: 'flex',
            gap: '80px',
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          {visibleFooterLinks.map((column, index) => (
            <div key={index} className="footer__links-column">
              <div 
                className="footer__title"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  color: 'var(--ifm-heading-color)',
                  marginBottom: '8px',
                }}
              >
                {column.label}
              </div>
              <ul 
                className="footer__items"
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {column.children.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      className="footer__link-item"
                      to={item.link || '#'}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '20px',
                        color: 'var(--ifm-heading-color)',
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      
      <style jsx>{`
        @media (max-width: 996px) {
          footer {
            padding: 32px 24px !important;
          }
          
          .footer__container {
            flex-direction: column !important;
            gap: 48px !important;
          }
          
          .footer__links-wrapper {
            gap: 48px !important;
            flex-wrap: wrap;
          }
          
          .footer__left {
            min-width: auto !important;
          }
        }

        @media (max-width: 768px) {
          .footer__links-wrapper {
            flex-direction: column !important;
          }
          
          .footer__links-column {
            width: 100%;
          }
        }

        .footer__social-link:hover {
          background-color: var(--ifm-color-primary) !important;
          color: white !important;
        }

        .footer__link-item:hover {
          color: var(--ifm-color-primary) !important;
        }

        [data-theme='dark'] .footer__social-link {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        [data-theme='dark'] .footer__logo-img {
          content: url('/logo/morph-docs-white.svg');
        }
      `}</style>
    </footer>
  );
}
