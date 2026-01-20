import type { Clip } from '@/types/clip';
import type { VideoFormat } from '@/types/showreel';

export type CompatibilityReason = 'standard' | 'resolution';

export type ClipCompatibility = {
  ok: boolean;
  reasons: CompatibilityReason[];
};

/**
 * クリップのフォーマット互換性を判定
 * @param clip - 判定対象クリップ
 * @param lockedFormat - ロックされたフォーマット（未指定なら常にOK）
 * @returns 互換性情報（ok: trueなら追加可能）
 */
export function getClipCompatibility(
  clip: Clip,
  lockedFormat?: VideoFormat
): ClipCompatibility {
  // ロックされていなければ常にOK
  if (!lockedFormat) {
    return { ok: true, reasons: [] };
  }

  const reasons: CompatibilityReason[] = [];

  if (clip.standard !== lockedFormat.standard) {
    reasons.push('standard');
  }

  if (clip.resolution !== lockedFormat.resolution) {
    reasons.push('resolution');
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}

/**
 * 互換性理由から日本語説明を生成
 */
export function formatCompatibilityReasons(
  compatibility: ClipCompatibility,
  clip: Clip,
  lockedFormat: VideoFormat
): string {
  if (compatibility.ok) {
    return '';
  }

  const parts: string[] = [];
  if (compatibility.reasons.includes('standard')) {
    parts.push(
      `規格: ${clip.standard} (ショーリール: ${lockedFormat.standard})`
    );
  }
  if (compatibility.reasons.includes('resolution')) {
    parts.push(
      `解像度: ${clip.resolution} (ショーリール: ${lockedFormat.resolution})`
    );
  }

  return `非対応: ${parts.join(', ')}`;
}
