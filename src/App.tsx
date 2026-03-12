import React, { useEffect } from 'react';
import { TonConnectUIProvider, TonConnectButton } from '@tonconnect/ui-react';

function AppContent() {
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ fontSize: '32px', fontWeight: 700 }}>Risk Tower</div>
        <div style={{ marginTop: '12px', fontSize: '18px' }}>
          Базовый тестовый экран
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
          <TonConnectButton />
        </div>
      </div>
    </div>
  );
}

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
    <TonConnectUIProvider manifestUrl="https://risktowerbot.vercel.app/tonconnect-manifest.vercel.json">
      <AppContent />
    </TonConnectUIProvider>
  );
}
