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

    try {
      const TonConnectUI = (window as any).TON_CONNECT_UI?.TonConnectUI;

      if (!TonConnectUI) {
        console.error('TON Connect UI script not loaded');
        return;
      }

      if (!(window as any).__riskTowerTonConnect) {
        (window as any).__riskTowerTonConnect = new TonConnectUI({
          manifestUrl: 'https://risktowerbot.vercel.app/tonconnect-manifest.json',
          buttonRootId: 'ton-connect'
        });
      }
    } catch (e) {
      console.error('TON Connect init error', e);
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ fontSize: '32px', fontWeight: 700 }}>Risk Tower</div>

        <div style={{ marginTop: '12px', fontSize: '18px' }}>
          Базовый тестовый экран
        </div>

        <div style={{ marginTop: '10px', fontSize: '15px', opacity: 0.8 }}>
          Подключение кошелька
        </div>

        <div
          id="ton-connect"
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}
        ></div>
      </div>
    </div>
  );
}
