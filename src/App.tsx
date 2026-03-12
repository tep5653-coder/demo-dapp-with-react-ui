import React, { useEffect, useMemo, useState } from 'react';

type GameState = 'idle' | 'active' | 'lost' | 'cashed';

type HistoryItem = {
  id: number;
  result: 'win' | 'loss';
  floor: number;
  multiplier: number;
  payout: string;
  text: string;
};

export default function App() {
  const [floor, setFloor] = useState(1);
  const [multiplier, setMultiplier] = useState(1.2);
  const [stake, setStake] = useState('0.10');
  const [status, setStatus] = useState('Нажми Start Round');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [lastWin, setLastWin] = useState<string>('—');
  const [riskText, setRiskText] = useState('Этаж 1: безопасный старт');
  const [history, setHistory] = useState<HistoryItem[]>([]);

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

  function getSuccessChance(currentFloor: number) {
    if (currentFloor <= 3) return 0.9;
    if (currentFloor <= 6) return 0.75;
    if (currentFloor <= 9) return 0.58;
    if (currentFloor <= 12) return 0.42;
    return 0.28;
  }

  function getRiskLabel(currentFloor: number) {
    if (currentFloor <= 3) return 'Низкий риск';
    if (currentFloor <= 6) return 'Средний риск';
    if (currentFloor <= 9) return 'Высокий риск';
    return 'Экстремальный риск';
  }

  const successChancePercent = useMemo(() => {
    return Math.round(getSuccessChance(floor) * 100);
  }, [floor]);

  const towerFloors = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => 12 - i);
  }, []);

  function addHistory(item: HistoryItem) {
    setHistory((prev) => [item, ...prev].slice(0, 6));
  }

  function startRound() {
    setFloor(1);
    setMultiplier(1.2);
    setGameState('active');
    setStatus('Раунд начался');
    setRiskText(`Этаж 1: ${getRiskLabel(1)}`);
  }

  function handleClimb() {
    if (gameState !== 'active') {
      setStatus('Сначала нажми Start Round');
      return;
    }

    const successChance = getSuccessChance(floor);
    const roll = Math.random();

    if (roll <= successChance) {
      const nextFloor = floor + 1;
      const nextMultiplier = Number((multiplier * 1.35).toFixed(2));

      setFloor(nextFloor);
      setMultiplier(nextMultiplier);
      setStatus(`Успех. Поднялись на этаж ${nextFloor}`);
      setRiskText(`Этаж ${nextFloor}: ${getRiskLabel(nextFloor)}`);
    } else {
      setGameState('lost');
      setStatus(`Поражение на этаже ${floor}. Ставка сгорела`);
      setRiskText('Раунд завершен: проигрыш');

      addHistory({
        id: Date.now(),
        result: 'loss',
        floor,
        multiplier,
        payout: '0 TON',
        text: `Проигрыш на ${floor} эт.`
      });
    }
  }

  function handleCashOut() {
    if (gameState !== 'active') {
      setStatus('Нет активного раунда для фиксации');
      return;
    }

    const stakeValue = Number(stake || '0');
    const payout = (stakeValue * multiplier).toFixed(2);

    setGameState('cashed');
    setLastWin(`${payout} TON`);
    setStatus(`Результат зафиксирован: ${payout} TON`);
    setRiskText('Раунд завершен: cash out');

    addHistory({
      id: Date.now(),
      result: 'win',
      floor,
      multiplier,
      payout: `${payout} TON`,
      text: `Cash out x${multiplier.toFixed(2)}`
    });
  }

  function handleReset() {
    setFloor(1);
    setMultiplier(1.2);
    setGameState('idle');
    setStatus('Нажми Start Round');
    setRiskText('Этаж 1: безопасный старт');
  }

  const isRoundActive = gameState === 'active';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #111827 0%, #0b1220 100%)',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        padding: '18px 14px 24px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700 }}>Risk Tower</div>
            <div style={{ marginTop: '6px', fontSize: '14px', opacity: 0.8 }}>
              MVP игрового экрана
            </div>
          </div>

          <div id="ton-connect"></div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '14px'
          }}
        >
          <div style={{ fontSize: '14px', opacity: 0.75 }}>Статус</div>
          <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 700 }}>
            {status}
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
            {riskText}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '14px'
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '13px', opacity: 0.75 }}>Этаж</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700 }}>
              {floor}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '13px', opacity: 0.75 }}>Множитель</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700 }}>
              x{multiplier.toFixed(2)}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '13px', opacity: 0.75 }}>Шанс</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700 }}>
              {successChancePercent}%
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '14px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.75 }}>Башня</div>
            <div style={{ fontSize: '13px', opacity: 0.75 }}>
              Текущий этаж: {floor}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '8px'
            }}
          >
            {towerFloors.map((itemFloor) => {
              const isCurrent = itemFloor === floor;
              const isPassed = itemFloor < floor;
              const isTop = itemFloor > floor;

              let bg = 'rgba(255,255,255,0.04)';
              let border = '1px solid rgba(255,255,255,0.08)';
              let color = '#ffffff';

              if (isCurrent) {
                bg = 'linear-gradient(90deg, rgba(245,158,11,0.95), rgba(251,191,36,0.95))';
                border = '1px solid rgba(251,191,36,1)';
                color = '#231500';
              } else if (isPassed) {
                bg = 'rgba(34,197,94,0.16)';
                border = '1px solid rgba(34,197,94,0.28)';
              } else if (isTop) {
                bg = 'rgba(255,255,255,0.03)';
                border = '1px solid rgba(255,255,255,0.05)';
              }

              const floorMultiplier = (1.2 * Math.pow(1.35, itemFloor - 1)).toFixed(2);

              return (
                <div
                  key={itemFloor}
                  style={{
                    background: bg,
                    border,
                    color,
                    borderRadius: '14px',
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: '0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 700 }}>Этаж {itemFloor}</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    x{floorMultiplier}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '14px'
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '13px', opacity: 0.75 }}>Ставка</div>
            <div style={{ marginTop: '8px', fontSize: '22px', fontWeight: 700 }}>
              {stake} TON
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: '14px'
            }}
          >
            <div style={{ fontSize: '13px', opacity: 0.75 }}>Последний win</div>
            <div style={{ marginTop: '8px', fontSize: '22px', fontWeight: 700 }}>
              {lastWin}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '14px'
          }}
        >
          <div style={{ fontSize: '14px', opacity: 0.75, marginBottom: '10px' }}>
            Ставка
          </div>

          <input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            placeholder="0.10"
            disabled={isRoundActive}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none',
              opacity: isRoundActive ? 0.7 : 1
            }}
          />

          <div
            style={{
              marginTop: '10px',
              fontSize: '13px',
              opacity: 0.7
            }}
          >
            Тестовый режим. Транзакции пока не подключены.
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px'
          }}
        >
          <button
            onClick={handleCashOut}
            disabled={!isRoundActive}
            style={{
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isRoundActive ? 'pointer' : 'default',
              background: '#22c55e',
              color: '#08130b',
              opacity: isRoundActive ? 1 : 0.55
            }}
          >
            Cash Out
          </button>

          <button
            onClick={handleClimb}
            disabled={!isRoundActive}
            style={{
              border: 'none',
              borderRadius: '16px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isRoundActive ? 'pointer' : 'default',
              background: '#f59e0b',
              color: '#1f1300',
              opacity: isRoundActive ? 1 : 0.55
            }}
          >
            Climb
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '14px'
          }}
        >
          <button
            onClick={startRound}
            disabled={isRoundActive}
            style={{
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isRoundActive ? 'default' : 'pointer',
              background: '#3b82f6',
              color: '#ffffff',
              opacity: isRoundActive ? 0.55 : 1
            }}
          >
            Start Round
          </button>

          <button
            onClick={handleReset}
            style={{
              border: 'none',
              borderRadius: '16px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.08)',
              color: '#ffffff'
            }}
          >
            Reset
          </button>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '14px', opacity: 0.75, marginBottom: '10px' }}>
            История раундов
          </div>

          {history.length === 0 ? (
            <div style={{ fontSize: '14px', opacity: 0.7 }}>
              Пока нет завершенных раундов
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background:
                      item.result === 'win'
                        ? 'rgba(34,197,94,0.14)'
                        : 'rgba(239,68,68,0.14)',
                    border:
                      item.result === 'win'
                        ? '1px solid rgba(34,197,94,0.24)'
                        : '1px solid rgba(239,68,68,0.24)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>
                      {item.text}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>
                      Этаж {item.floor} • x{item.multiplier.toFixed(2)}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.payout}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
