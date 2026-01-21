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
  format: VideoFormat | null;
  totalDuration: Duration;
};
