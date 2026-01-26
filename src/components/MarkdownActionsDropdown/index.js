import React, { useState, useRef, useEffect } from 'react';

export default function MarkdownActionsDropdown() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get pathname from window.location
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  // Only show on docs pages (not blog, homepage, etc.)
  const isDocsPage = currentPath.startsWith('/docs/');

  // Handle click outside to close dropdown
  useEffect(() => {
    // Only add listener if dropdown is open
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // If the click is outside the dropdown, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener to document
    // Use mousedown instead of click for better UX (fires before click)
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isDocsPage) {
    return null;
  }

  // Construct the .md URL (handles directory indexes like /docs/ -> /docs/intro.md)
  const markdownUrl = currentPath.endsWith('/')
    ? `${currentPath}intro.md`
    : `${currentPath}.md`;

  // Fetch markdown content helper
  const fetchMarkdownContent = async () => {
    const response = await fetch(markdownUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch markdown');
    }
    return await response.text();
  };

  // Handle opening markdown in new tab
  const handleOpenMarkdown = () => {
    window.open(markdownUrl, '_blank');
    setIsOpen(false);
  };

  // Handle copying markdown to clipboard
  const handleCopyMarkdown = async () => {
    try {
      const markdown = await fetchMarkdownContent();
      await navigator.clipboard.writeText(markdown);

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy markdown:', error);
      alert('Failed to copy markdown. Please try again.');
    }
  };

  // Handle opening in ChatGPT
  const handleOpenInChatGPT = () => {
    // Build full markdown URL with origin
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullMarkdownUrl = `${origin}${markdownUrl}`;
    
    // ChatGPT can read from URL directly
    const prompt = `Read from ${fullMarkdownUrl} so I can ask questions about it.`;
    const chatGPTUrl = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
    
    window.open(chatGPTUrl, '_blank');
    setIsOpen(false);
  };

  // Handle opening in Claude
  const handleOpenInClaude = () => {
    // Build full markdown URL with origin
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullMarkdownUrl = `${origin}${markdownUrl}`;
    
    // Claude can read from URL directly
    const prompt = `Read from ${fullMarkdownUrl} so I can ask questions about it.`;
    const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    
    window.open(claudeUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${isOpen ? 'dropdown--show' : ''}`}
    >
      <button
        className="button button--outline button--secondary button--sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Open Markdown
        <svg width="14" height="14" viewBox="0 0 16 16" style={{marginLeft: '4px'}}>
          <path fill="currentColor" d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396a.25.25 0 00-.177-.427H4.604a.25.25 0 00-.177.427z"/>
        </svg>
      </button>

      <ul className="dropdown__menu" id="page-context-menu">
        {/* AI Assistant Section */}
        <li className="dropdown__link--header" style={{padding: '6px 12px', fontSize: '11px', fontWeight: '600', color: 'var(--ifm-color-emphasis-600)', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
          Ask AI about this page
        </li>
        <li>
          <button
            className="dropdown__link"
            onClick={handleOpenInChatGPT}
            style={{cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center'}}
          >
            {/* ChatGPT Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" style={{marginRight: '8px', flexShrink: 0}}>
              <path fill="currentColor" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
            </svg>
            Open in ChatGPT
          </button>
        </li>
        <li>
          <button
            className="dropdown__link"
            onClick={handleOpenInClaude}
            style={{cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center'}}
          >
            {/* Claude Icon */}
            <svg style={{marginRight: '8px', flexShrink: 0}} fill="currentColor" fillRule="evenodd" height="1em" viewBox="0 0 256 257" width="1em" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" preserveAspectRatio="xMidYMid"><title>Anthropic</title><path d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"></path></svg>
            Open in Claude
          </button>
        </li>
        
        {/* Divider */}
        <li style={{borderTop: '1px solid var(--ifm-color-emphasis-300)', margin: '8px 0'}} />
        
        {/* Copy & View Section */}
        <li>
          <button
            className="dropdown__link"
            onClick={handleCopyMarkdown}
            disabled={copied}
            style={{cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center'}}
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{marginRight: '8px', flexShrink: 0}}>
                  <path fill="currentColor" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{marginRight: '8px', flexShrink: 0}}>
                  <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
                  <path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
                </svg>
                Copy page as Markdown
              </>
            )}
          </button>
        </li>
        <li>
          <button
            className="dropdown__link"
            onClick={handleOpenMarkdown}
            style={{cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center'}}
          >
            {/* Markdown Icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" style={{marginRight: '8px', flexShrink: 0}}>
              <path fill="currentColor" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"/>
            </svg>
            View as Markdown
          </button>
        </li>
      </ul>
    </div>
  );
}
