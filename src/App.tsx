import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    try {
      tg?.ready();
      tg?.expand();
    } catch (e) {
      console.error('Telegram WebApp init error:', e);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111827',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <h1 style={{ margin: 0, fontSize: '32px' }}>Башня Риска</h1>
      <p style={{ marginTop: '12px', fontSize: '18px' }}>
        Тестовый экран работает
      </p>
    </div>
  );
}
