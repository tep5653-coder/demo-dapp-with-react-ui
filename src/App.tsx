import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      tg?.ready();
      tg?.expand();
    } catch (e) {
      console.error('Telegram init error', e);
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
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '24px'
      }}
    >
      <div>
        <div style={{ fontSize: '32px', fontWeight: 700 }}>Risk Tower</div>
        <div style={{ marginTop: '12px', fontSize: '18px' }}>
          Базовый тестовый экран
        </div>
        <div style={{ marginTop: '10px', fontSize: '15px', opacity: 0.8 }}>
          Если вы это видите, Mini App открыт правильно
        </div>
      </div>
    </div>
  );
}
