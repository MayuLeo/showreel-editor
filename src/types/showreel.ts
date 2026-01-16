// ビデオフォーマットの型定義
export type VideoStandard = 'PAL' | 'NTSC';
export type VideoResolution = 'SD' | 'HD';

// デュレーションの型定義（時:分:秒:フレーム）
export type Duration = {
  hours: number;
  minutes: number;
  seconds: number;
  frames: number;
};

// ビデオフォーマットの型定義
export type VideoFormat = {
  standard: VideoStandard;
  resolution: VideoResolution;
};

// ショーリールの基本情報
export type ShowreelInfo = {
  name: string;
  format: VideoFormat;
  totalDuration: Duration;
};

// デュレーションをフォーマット文字列に変換するヘルパー関数
export function formatDuration(duration: Duration): string {
  const pad = (num: number, length: number = 2) =>
    num.toString().padStart(length, '0');

  return `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(duration.seconds)}:${pad(duration.frames)}`;
}

// 秒とフレームからDurationオブジェクトを作成するヘルパー関数
export function createDuration(
  totalSeconds: number,
  frameRate: number = 25
): Duration {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const frames = Math.floor((totalSeconds % 1) * frameRate);

  return { hours, minutes, seconds, frames };
}
