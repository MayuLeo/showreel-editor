import type { Timecode, VideoStandard } from '@/types/clip';
import type { Duration } from '@/types/showreel';

/**
 * ビデオ規格からフレームレートを取得
 * @param standard - ビデオ規格（PAL/NTSC）
 * @returns フレームレート（PAL=25, NTSC=30）
 */
export function getFrameRate(standard: VideoStandard): number {
  return standard === 'PAL' ? 25 : 30;
}

/**
 * タイムコードを総フレーム数に変換
 * @param timecode - タイムコード
 * @param fps - フレームレート
 * @returns 総フレーム数
 */
export function timecodeToFrames(timecode: Timecode, fps: number): number {
  const totalSeconds =
    timecode.hours * 3600 + timecode.minutes * 60 + timecode.seconds;
  return totalSeconds * fps + timecode.frames;
}

/**
 * 総フレーム数をDurationに変換
 * @param totalFrames - 総フレーム数（負の値は0として扱う）
 * @param fps - フレームレート
 * @returns Durationオブジェクト（正規化済み）
 */
export function framesToDuration(totalFrames: number, fps: number): Duration {
  // 負数は0として扱う
  const frames = Math.max(0, totalFrames);

  const totalSeconds = Math.floor(frames / fps);
  const remainingFrames = frames % fps;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    frames: remainingFrames,
  };
}

import type { Clip } from '@/types/clip';

/**
 * クリップの長さをフレーム数で計算
 * @param clip - クリップ
 * @param fps - フレームレート
 * @returns クリップの長さ（フレーム数、最小0）
 */
export function clipDurationFrames(clip: Clip, fps: number): number {
  const startFrames = timecodeToFrames(clip.startTimecode, fps);
  const endFrames = timecodeToFrames(clip.endTimecode, fps);
  return Math.max(0, endFrames - startFrames);
}

/**
 * 複数クリップの合計フレーム数を計算
 * @param clips - クリップ配列
 * @param fps - フレームレート
 * @returns 合計フレーム数
 */
export function sumDurationFrames(clips: Clip[], fps: number): number {
  return clips.reduce((total, clip) => {
    return total + clipDurationFrames(clip, fps);
  }, 0);
}
