import type { Clip } from '@/types/clip';
import type { VideoFormat } from '@/types/showreel';
import { describe, expect, test } from 'bun:test';
import {
  formatCompatibilityReasons,
  getClipCompatibility,
  type ClipCompatibility,
} from './compatibility';

describe('getClipCompatibility', () => {
  const mockClip: Clip = {
    id: '1',
    name: 'Test Clip',
    description: 'Test Description',
    standard: 'PAL',
    resolution: 'HD',
    startTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
    endTimecode: { hours: 0, minutes: 0, seconds: 10, frames: 0 },
  };

  test('フォーマット未ロック時はOKを返す', () => {
    const result = getClipCompatibility(mockClip, null);
    expect(result).toEqual({ ok: true, reasons: [] });
  });

  test('フォーマット未ロック時はOKを返す（undefined）', () => {
    const result = getClipCompatibility(mockClip, undefined);
    expect(result).toEqual({ ok: true, reasons: [] });
  });

  test('フォーマットが一致する場合はOKを返す', () => {
    const lockedFormat: VideoFormat = { standard: 'PAL', resolution: 'HD' };
    const result = getClipCompatibility(mockClip, lockedFormat);
    expect(result).toEqual({ ok: true, reasons: [] });
  });

  test('規格が異なる場合はNGを返す', () => {
    const lockedFormat: VideoFormat = { standard: 'NTSC', resolution: 'HD' };
    const result = getClipCompatibility(mockClip, lockedFormat);
    expect(result).toEqual({ ok: false, reasons: ['standard'] });
  });

  test('解像度が異なる場合はNGを返す', () => {
    const lockedFormat: VideoFormat = { standard: 'PAL', resolution: 'SD' };
    const result = getClipCompatibility(mockClip, lockedFormat);
    expect(result).toEqual({ ok: false, reasons: ['resolution'] });
  });

  test('規格と解像度が両方異なる場合はNGを返す', () => {
    const lockedFormat: VideoFormat = { standard: 'NTSC', resolution: 'SD' };
    const result = getClipCompatibility(mockClip, lockedFormat);
    expect(result).toEqual({ ok: false, reasons: ['standard', 'resolution'] });
  });
});

describe('formatCompatibilityReasons', () => {
  const mockClip: Clip = {
    id: '1',
    name: 'Test Clip',
    description: 'Test Description',
    standard: 'PAL',
    resolution: 'HD',
    startTimecode: { hours: 0, minutes: 0, seconds: 0, frames: 0 },
    endTimecode: { hours: 0, minutes: 0, seconds: 10, frames: 0 },
  };

  test('互換性OK時は空文字を返す', () => {
    const compatibility = { ok: true, reasons: [] };
    const lockedFormat: VideoFormat = { standard: 'PAL', resolution: 'HD' };
    const result = formatCompatibilityReasons(
      compatibility,
      mockClip,
      lockedFormat
    );
    expect(result).toBe('');
  });

  test('lockedFormatがnullの場合は空文字を返す', () => {
    const compatibility: ClipCompatibility = {
      ok: false,
      reasons: ['standard'],
    };
    const result = formatCompatibilityReasons(compatibility, mockClip, null);
    expect(result).toBe('');
  });

  test('lockedFormatがundefinedの場合は空文字を返す', () => {
    const compatibility: ClipCompatibility = {
      ok: false,
      reasons: ['standard'],
    };
    const result = formatCompatibilityReasons(
      compatibility,
      mockClip,
      undefined
    );
    expect(result).toBe('');
  });

  test('規格不一致時に理由を含むメッセージを返す', () => {
    const compatibility: ClipCompatibility = {
      ok: false,
      reasons: ['standard'],
    };
    const lockedFormat: VideoFormat = { standard: 'NTSC', resolution: 'HD' };
    const result = formatCompatibilityReasons(
      compatibility,
      mockClip,
      lockedFormat
    );
    expect(result).toBe('非対応: 規格: PAL (ショーリール: NTSC)');
  });

  test('解像度不一致時に理由を含むメッセージを返す', () => {
    const compatibility: ClipCompatibility = {
      ok: false,
      reasons: ['resolution'],
    };
    const lockedFormat: VideoFormat = { standard: 'PAL', resolution: 'SD' };
    const result = formatCompatibilityReasons(
      compatibility,
      mockClip,
      lockedFormat
    );
    expect(result).toBe('非対応: 解像度: HD (ショーリール: SD)');
  });

  test('規格と解像度の両方が不一致時に両方の理由を含むメッセージを返す', () => {
    const compatibility: ClipCompatibility = {
      ok: false,
      reasons: ['standard', 'resolution'],
    };
    const lockedFormat: VideoFormat = { standard: 'NTSC', resolution: 'SD' };
    const result = formatCompatibilityReasons(
      compatibility,
      mockClip,
      lockedFormat
    );
    expect(result).toBe(
      '非対応: 規格: PAL (ショーリール: NTSC), 解像度: HD (ショーリール: SD)'
    );
  });

  test('NTSCクリップがPALショーリールと不一致の場合のメッセージ', () => {
    const ntscClip: Clip = {
      ...mockClip,
      standard: 'NTSC',
    };
    const compatibility: ClipCompatibility = {
      ok: false,
      reasons: ['standard'],
    };
    const lockedFormat: VideoFormat = { standard: 'PAL', resolution: 'HD' };
    const result = formatCompatibilityReasons(
      compatibility,
      ntscClip,
      lockedFormat
    );
    expect(result).toBe('非対応: 規格: NTSC (ショーリール: PAL)');
  });

  test('SDクリップがHDショーリールと不一致の場合のメッセージ', () => {
    const sdClip: Clip = {
      ...mockClip,
      resolution: 'SD',
    };
    const compatibility: ClipCompatibility = {
      ok: false,
      reasons: ['resolution'],
    };
    const lockedFormat: VideoFormat = { standard: 'PAL', resolution: 'HD' };
    const result = formatCompatibilityReasons(
      compatibility,
      sdClip,
      lockedFormat
    );
    expect(result).toBe('非対応: 解像度: SD (ショーリール: HD)');
  });
});
