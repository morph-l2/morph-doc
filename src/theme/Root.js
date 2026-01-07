// theme/Root.js - Plugin-provided theme component
import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { createRoot } from 'react-dom/client';
import MarkdownActionsDropdown from '../components/MarkdownActionsDropdown';

export default function Root({ children }) {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToElement = () => {
        const id = decodeURIComponent(hash.substring(1));
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!scrollToElement()) {
        // If element not found, wait for images and content to load
        const timeouts = [100, 300, 500, 1000];

        timeouts.forEach(delay => {
          setTimeout(() => {
            scrollToElement();
          }, delay);
        });

        // Also wait for images to load
        window.addEventListener('load', scrollToElement, { once: true });
      }
    }
  }, [hash]);

  // Inject dropdown button into article header
  useEffect(() => {
    let rootInstance = null;
    let containerElement = null;

    const injectDropdown = () => {
      // Only inject on docs pages
      if (!pathname.startsWith('/docs/')) return;

      // Check if already injected anywhere on the page
      if (document.querySelector('.markdown-actions-container')) return;

      // Try multiple selectors to find the right place to inject
      // Priority: header in markdown > first h1 in markdown > article header
      const selectors = [
        'article .markdown header',           // Standard markdown header
        'article .markdown h1',               // First h1 in markdown (MDX pages)
        'article header',                     // Article header fallback
        '.theme-doc-markdown h1',             // Theme doc markdown h1
      ];

      let targetElement = null;
      for (const selector of selectors) {
        targetElement = document.querySelector(selector);
        if (targetElement) break;
      }

      if (!targetElement) return;

      // Create container for the dropdown
      containerElement = document.createElement('div');
      containerElement.className = 'markdown-actions-container';

      // For h1 elements, we need to wrap or insert after
      if (targetElement.tagName === 'H1') {
        // Check if h1 is inside a header, if so use the header
        const parentHeader = targetElement.closest('header');
        if (parentHeader) {
          parentHeader.appendChild(containerElement);
        } else {
          // Create a wrapper div to contain h1 and dropdown button
          // This avoids applying flex styles to the entire .markdown container
          const wrapper = document.createElement('div');
          wrapper.className = 'markdown-header-wrapper';
          wrapper.style.display = 'flex';
          wrapper.style.flexWrap = 'wrap';
          wrapper.style.alignItems = 'center';
          wrapper.style.gap = '1rem';
          wrapper.style.marginBottom = '1rem';
          
          // Insert wrapper before h1, then move h1 into wrapper
          targetElement.parentNode.insertBefore(wrapper, targetElement);
          wrapper.appendChild(targetElement);
          wrapper.appendChild(containerElement);
        }
      } else {
        // For header elements, just append
        targetElement.appendChild(containerElement);
      }

      // Render React component into container
      rootInstance = createRoot(containerElement);
      rootInstance.render(<MarkdownActionsDropdown />);
    };

    // Try to inject after delays to ensure DOM is ready
    const timeouts = [0, 100, 300, 500, 1000];
    timeouts.forEach(delay => {
      setTimeout(injectDropdown, delay);
    });

    // Cleanup function
    return () => {
      if (rootInstance) {
        rootInstance.unmount();
      }
      if (containerElement && containerElement.parentNode) {
        containerElement.parentNode.removeChild(containerElement);
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
