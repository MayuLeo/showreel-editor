import type { Clip, Timecode } from '@/types/clip';
import type { Duration } from '@/types/showreel';
import { describe, expect, test } from 'bun:test';
import {
  clipDurationFrames,
  formatDuration,
  framesToDuration,
  getFrameRate,
  sumDurationFrames,
  timecodeToFrames,
} from './timecode';

describe('getFrameRate', () => {
  test('PALは25fpsを返す', () => {
    expect(getFrameRate('PAL')).toBe(25);
  });

  test('NTSCは30fpsを返す', () => {
    expect(getFrameRate('NTSC')).toBe(30);
  });
});

describe('timecodeToFrames', () => {
  test('ゼロタイムコードは0フレームを返す', () => {
    const timecode: Timecode = { hours: 0, minutes: 0, seconds: 0, frames: 0 };
    expect(timecodeToFrames(timecode, 25)).toBe(0);
  });

  test('秒とフレームのみのタイムコードをフレーム数に変換する（25fps）', () => {
    const timecode: Timecode = { hours: 0, minutes: 0, seconds: 10, frames: 5 };
    expect(timecodeToFrames(timecode, 25)).toBe(255); // 10 * 25 + 5
  });

  test('分と秒を含むタイムコードをフレーム数に変換する（30fps）', () => {
    const timecode: Timecode = { hours: 0, minutes: 1, seconds: 30, frames: 0 };
    expect(timecodeToFrames(timecode, 30)).toBe(2700); // 90 * 30
  });

  test('時間のみのタイムコードをフレーム数に変換する（25fps）', () => {
    const timecode: Timecode = { hours: 1, minutes: 0, seconds: 0, frames: 0 };
    expect(timecodeToFrames(timecode, 25)).toBe(90000); // 3600 * 25
  });

  test('時分秒フレームすべてを含むタイムコードをフレーム数に変換する（30fps）', () => {
    const timecode: Timecode = {
      hours: 2,
      minutes: 34,
      seconds: 56,
      frames: 12,
    };
    const expected = (2 * 3600 + 34 * 60 + 56) * 30 + 12;
    expect(timecodeToFrames(timecode, 30)).toBe(expected);
  });
});

describe('framesToDuration', () => {
  test('フレーム数をDurationに変換する（25fps）', () => {
    const duration = framesToDuration(255, 25);
    expect(duration).toEqual({ hours: 0, minutes: 0, seconds: 10, frames: 5 });
  });

  test('フレーム数をDurationに変換する（30fps）', () => {
    const duration = framesToDuration(2700, 30);
    expect(duration).toEqual({ hours: 0, minutes: 1, seconds: 30, frames: 0 });
  });

  test('1秒未満のフレーム数を扱う', () => {
    const duration = framesToDuration(15, 25);
    expect(duration).toEqual({ hours: 0, minutes: 0, seconds: 0, frames: 15 });
  });

  test('時間を含むフレーム数を扱う', () => {
    const duration = framesToDuration(90000, 25);
    expect(duration).toEqual({ hours: 1, minutes: 0, seconds: 0, frames: 0 });
  });

  test('負のフレーム数を0として扱う', () => {
    const duration = framesToDuration(-100, 25);
    expect(duration).toEqual({ hours: 0, minutes: 0, seconds: 0, frames: 0 });
  });

  test('時分秒フレームすべてを含むDurationに変換する（30fps）', () => {
    const frames = (2 * 3600 + 34 * 60 + 56) * 30 + 12;
    const duration = framesToDuration(frames, 30);
    expect(duration).toEqual({
      hours: 2,
      minutes: 34,
      seconds: 56,
      frames: 12,
    });
  });
});

describe('formatDuration', () => {
  test('DurationをHH:MM:ss:ff形式にフォーマットする', () => {
    const duration: Duration = { hours: 1, minutes: 2, seconds: 3, frames: 4 };
    expect(formatDuration(duration)).toBe('01:02:03:04');
  });

  test('一桁の値を2桁にゼロ埋めしてフォーマットする', () => {
    const duration: Duration = { hours: 0, minutes: 5, seconds: 6, frames: 7 };
    expect(formatDuration(duration)).toBe('00:05:06:07');
  });

  test('すべてゼロのDurationをフォーマットする', () => {
    const duration: Duration = { hours: 0, minutes: 0, seconds: 0, frames: 0 };
    expect(formatDuration(duration)).toBe('00:00:00:00');
  });

  test('二桁の値をそのままフォーマットする', () => {
    const duration: Duration = {
      hours: 12,
      minutes: 34,
      seconds: 56,
      frames: 23,
    };
    expect(formatDuration(duration)).toBe('12:34:56:23');
  });
});

describe('clipDurationFrames', () => {
  const mockClip: Clip = {
    id: '1',
    name: 'Test Clip',
    description: 'Test Description',
    standard: 'PAL',
    resolution: 'HD',
    startTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
    endTimecode: { hours: 0, minutes: 0, seconds: 10, frames: 5 },
  };

  test('クリップのデュレーションをフレーム数で計算する（25fps）', () => {
    expect(clipDurationFrames(mockClip, 25)).toBe(255); // 10 * 25 + 5
  });

  test('クリップのデュレーションをフレーム数で計算する（30fps）', () => {
    expect(clipDurationFrames(mockClip, 30)).toBe(305); // 10 * 30 + 5
  });

  test('終了タイムコードが開始より前の場合0を返す', () => {
    const reversedClip: Clip = {
      ...mockClip,
      startTimecode: { hours: 0, minutes: 0, seconds: 10, frames: 5 },
      endTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
    };
    expect(clipDurationFrames(reversedClip, 25)).toBe(0);
  });

  test('開始と終了が同じタイムコードの場合0を返す', () => {
    const zeroClip: Clip = {
      ...mockClip,
      endTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
    };
    expect(clipDurationFrames(zeroClip, 25)).toBe(0);
  });
});

describe('sumDurationFrames', () => {
  const clips: Clip[] = [
    {
      id: '1',
      name: 'Clip 1',
      description: 'Description 1',
      standard: 'PAL',
      resolution: 'HD',
      startTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
      endTimecode: { hours: 0, minutes: 0, seconds: 10, frames: 0 },
    },
    {
      id: '2',
      name: 'Clip 2',
      description: 'Description 2',
      standard: 'PAL',
      resolution: 'HD',
      startTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
      endTimecode: { hours: 0, minutes: 0, seconds: 20, frames: 5 },
    },
    {
      id: '3',
      name: 'Clip 3',
      description: 'Description 3',
      standard: 'PAL',
      resolution: 'HD',
      startTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
      endTimecode: { hours: 0, minutes: 0, seconds: 5, frames: 10 },
    },
  ];

  test('複数のクリップデュレーションを合計する（25fps）', () => {
    // Clip 1: 250 frames, Clip 2: 505 frames, Clip 3: 135 frames
    // Total: 890 frames
    expect(sumDurationFrames(clips, 25)).toBe(890);
  });

  test('複数のクリップデュレーションを合計する（30fps）', () => {
    // Clip 1: 300 frames, Clip 2: 605 frames, Clip 3: 160 frames
    // Total: 1065 frames
    expect(sumDurationFrames(clips, 30)).toBe(1065);
  });

  test('空配列の場合0を返す', () => {
    expect(sumDurationFrames([], 25)).toBe(0);
  });

  test('クリップが1つの場合そのデュレーションを返す', () => {
    const singleClip = [clips[0]];
    expect(sumDurationFrames(singleClip, 25)).toBe(250);
  });
});
