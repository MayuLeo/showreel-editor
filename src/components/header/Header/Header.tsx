import { DurationDisplay } from '../DurationDisplay';
import { FormatSummary } from '../FormatSummary';
import { HeaderBar } from '../HeaderBar';
import type { HeaderProps } from './type';

export function Header({ showreelInfo, onNameChange }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* ショーリール名編集エリア */}
          <HeaderBar name={showreelInfo.name} onNameChange={onNameChange} />

          {/* フォーマットと再生時間の情報エリア */}
          <div className="flex items-center justify-between">
            <FormatSummary format={showreelInfo.format} />
            <DurationDisplay duration={showreelInfo.totalDuration} />
          </div>
        </div>
      </div>
    </header>
  );
}
