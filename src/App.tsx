import './App.scss';
import React from 'react';
import {
  THEME,
  TonConnectButton,
  TonConnectUIProvider
} from '@tonconnect/ui-react';

function AppContent() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        color: '#ffffff',
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '12px'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 800,
                lineHeight: 1.1
              }}
            >
              Risk Tower
            </div>
            <div
              style={{
                opacity: 0.7,
                fontSize: '14px',
                marginTop: '6px'
              }}
            >
              Telegram Mini App test screen
            </div>
          </div>

          <TonConnectButton />
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '18px',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              opacity: 0.75,
              marginBottom: '8px'
            }}
          >
            Status
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: 700
            }}
          >
            Mini App loaded successfully
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '18px',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              opacity: 0.75,
              marginBottom: '10px'
            }}
          >
            Test game block
          </div>

          <div
            style={{
              display: 'grid',
              gap: '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '12px 14px'
              }}
            >
              <span>Floor</span>
              <strong>1</strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '12px 14px'
              }}
            >
              <span>Multiplier</span>
              <strong>x1.20</strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '12px 14px'
              }}
            >
              <span>Stake</span>
              <strong>0.10 TON</strong>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}
        >
          <button
            style={{
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              background: '#22c55e',
              color: '#08130b'
            }}
          >
            Cash Out
          </button>

          <button
            style={{
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              background: '#f59e0b',
              color: '#1f1300'
            }}
          >
            Climb
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://risktowerbot.vercel.app/tonconnect-manifest.vercel.json"
      uiPreferences={{ theme: THEME.DARK }}
    >
      <AppContent />
    </TonConnectUIProvider>
  );
}
