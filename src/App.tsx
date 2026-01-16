import { useState } from 'react';
import { Header } from './components/header';
import type { ShowreelInfo } from './types/showreel';

function App() {
  const [showreelInfo, setShowreelInfo] = useState<ShowreelInfo>({
    name: '新規ファイル',
    format: {
      standard: 'PAL',
      resolution: 'HD',
    },
    totalDuration: {
      hours: 0,
      minutes: 15,
      seconds: 30,
      frames: 12,
    },
  });

  const handleNameChange = (name: string) => {
    setShowreelInfo((prev) => ({
      ...prev,
      name,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showreelInfo={showreelInfo} onNameChange={handleNameChange} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🎬 Showreel Editor</h1>
          <p className="text-muted-foreground">
            動画ショーリールを作成・編集するツールです
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
