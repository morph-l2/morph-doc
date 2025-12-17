import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    // 立即跳转到文档页面
    history.replace('/docs/about-morph/user-navigation-page');
  }, [history]);

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--ifm-background-color)',
      }}
    >
      {/* Loading spinner */}
      <div 
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--ifm-color-emphasis-200)',
          borderTop: '3px solid var(--ifm-color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}