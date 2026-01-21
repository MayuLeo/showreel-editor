import { expect, test } from '@playwright/test';

test.describe('App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページが正しく表示される', async ({ page }) => {
    // タイトルを確認
    await expect(page).toHaveTitle(/showreel-editor/i);

    // ヘッダーが表示される
    await expect(page.getByText('新規ファイル')).toBeVisible();

    // 再生プレビューパネルが表示される
    await expect(page.getByText('再生プレビュー')).toBeVisible();
    await expect(
      page.getByText('ここにプレビューが表示されます')
    ).toBeVisible();

    // タイムラインパネルが表示される（PanelTitleを使用）
    await expect(
      page.locator('[data-slot="panel-title"]', { hasText: 'タイムライン' })
    ).toBeVisible();

    // クリップライブラリが表示される
    await expect(
      page.locator('[data-slot="panel-title"]', {
        hasText: 'クリップライブラリ',
      })
    ).toBeVisible();
  });

  test('初期状態のヘッダー情報を確認', async ({ page }) => {
    // デフォルトのファイル名
    await expect(page.getByText('新規ファイル')).toBeVisible();

    // デュレーションが00:00:00:00（header内のものを指定）
    await expect(page.locator('header').getByText('00:00:00:00')).toBeVisible();

    // フォーマットサマリー
    await expect(page.locator('header').getByText('PAL')).toBeVisible();
    await expect(page.locator('header').getByText('HD')).toBeVisible();
  });

  test('クリップを追加できる', async ({ page }) => {
    // クリップライブラリから最初の「追加」ボタンをクリック
    const addButtons = page.getByRole('button', { name: '追加' });
    const count = await addButtons.count();
    console.log(`追加ボタンの数: ${count}`);

    const firstAdd = addButtons.first();
    const isEnabled = await firstAdd.isEnabled();
    console.log(`最初の追加ボタンが有効: ${isEnabled}`);

    // ボタンを強制的にクリック
    await firstAdd.click({ force: true });

    // 少し待機して状態変化を確認
    await page.waitForTimeout(2000);

    // タイムラインにクリップが追加されることを確認（TimelineEmptyStateが消える）
    await expect(page.getByText('クリップが未追加です')).not.toBeVisible();
  });

  test('フォーマットが異なるクリップを追加するとエラーが表示される', async ({
    page,
  }) => {
    // 最初のクリップ（PAL/HD）を追加
    const addButtons = page.getByRole('button', { name: '追加' });
    await addButtons.nth(0).click();

    // 少し待機してフォーマットがロックされるのを待つ
    await page.waitForTimeout(500);

    // NTSCクリップを探して追加しようとする
    const ntscClipLabel = page.getByText('NTSC').first();
    const ntscAddButton = ntscClipLabel
      .locator('../..')
      .getByRole('button', { name: '追加' });

    // NTSCボタンはdisabledになっているはず
    await expect(ntscAddButton).toBeDisabled();
  });

  test('クリップを削除できる', async ({ page }) => {
    // クリップを追加
    const addButtons = page.getByRole('button', { name: '追加' });
    await addButtons.first().click();

    // 少し待機してクリップが追加されるのを待つ
    await page.waitForTimeout(1000);

    // タイムラインにクリップがあることを確認（EmptyStateが消える）
    await expect(page.getByText('クリップが未追加です')).not.toBeVisible();

    // タイムラインパネル内の削除ボタンをクリック
    const timelinePanel = page
      .locator('[data-slot="panel-header"]', {
        hasText: 'タイムライン',
      })
      .locator('..');

    const deleteButton = timelinePanel.getByRole('button', {
      name: '削除',
      exact: true,
    });
    await deleteButton.click();

    // 少し待機してクリップが削除されるのを待つ
    await page.waitForTimeout(500);

    // タイムラインが空になる（EmptyStateが表示される）
    await expect(page.getByText('クリップが未追加です')).toBeVisible();

    // デュレーションが00:00:00:00に戻る
    await expect(page.locator('header').getByText('00:00:00:00')).toBeVisible();
  });

  test('PAL SDビデオリールにNTSC SDクリップを追加しようとすると防止される', async ({
    page,
  }) => {
    // Given: PAL SDビデオリールを作成する（Bud LightはPAL SD）
    const palSdClipName = 'Bud Light';

    // PAL SDクリップを探して追加（クリップ名を含むカードを取得）
    const palClipCard = page.locator('text=' + palSdClipName).locator('..');
    const palAddButton = palClipCard.getByRole('button', { name: '追加' });
    await palAddButton.click();

    // 少し待機してフォーマットがロックされるのを待つ
    await page.waitForTimeout(500);

    // フォーマットがPAL SDに設定されたことを確認
    await expect(page.locator('header').getByText('PAL')).toBeVisible();
    await expect(page.locator('header').getByText('SD')).toBeVisible();

    // When: NTSC SDクリップを追加しようとする
    const ntscSdClipName = "M&M's";
    const ntscClipCard = page.locator('text=' + ntscSdClipName).locator('..');

    // Then: UIがアクションを防止する（追加ボタンが表示されない、またはdisabledになっている）
    const ntscAddButton = ntscClipCard.getByRole('button', { name: '追加' });
    const ntscAddButtonCount = await ntscAddButton.count();

    if (ntscAddButtonCount === 0) {
      // 追加ボタンが表示されていない（正常）
      expect(true).toBe(true);
    } else {
      // 追加ボタンが存在する場合はdisabledになっているはず
      await expect(ntscAddButton.first()).toBeDisabled();
    }
  });

  test('PAL SDビデオリールにPAL HDクリップを追加しようとすると防止される', async ({
    page,
  }) => {
    // Given: PAL SDビデオリールを作成する（Bud LightはPAL SD）
    const palSdClipName = 'Bud Light';

    // PAL SDクリップを探して追加（クリップ名を含むカードを取得）
    const palClipCard = page.locator('text=' + palSdClipName).locator('..');
    const palAddButton = palClipCard.getByRole('button', { name: '追加' });
    await palAddButton.click();

    // 少し待機してフォーマットがロックされるのを待つ
    await page.waitForTimeout(500);

    // フォーマットがPAL SDに設定されたことを確認
    await expect(page.locator('header').getByText('PAL')).toBeVisible();
    await expect(page.locator('header').getByText('SD')).toBeVisible();

    // When: PAL HDクリップを追加しようとする
    const palHdClipName = 'Best Buy';
    const palHdClipCard = page.locator('text=' + palHdClipName).locator('..');

    // Then: UIがアクションを防止する（追加ボタンが表示されない、またはdisabledになっている）
    const palHdAddButton = palHdClipCard.getByRole('button', { name: '追加' });
    const palHdAddButtonCount = await palHdAddButton.count();

    if (palHdAddButtonCount === 0) {
      // 追加ボタンが表示されていない（正常）
      expect(true).toBe(true);
    } else {
      // 追加ボタンが存在する場合はdisabledになっているはず
      await expect(palHdAddButton.first()).toBeDisabled();
    }
  });

  test('すべてのPAL SDビデオクリップを追加すると合計再生時間が正しく表示される', async ({
    page,
  }) => {
    // Given: PAL SDビデオリールを作成する
    const palSdClips = ['Bud Light', 'Audi'];

    // When: すべてのPAL SDビデオクリップを追加する
    for (const clipName of palSdClips) {
      const clipCard = page.locator('text=' + clipName).locator('..');
      const addButton = clipCard.getByRole('button', { name: '追加' });
      await addButton.click();
      await page.waitForTimeout(200);
    }

    // 少し待機してすべてのクリップが追加されるのを待つ
    await page.waitForTimeout(500);

    // Then: 表示される合計再生時間は 00:02:11:01 である
    await expect(page.locator('header').getByText('00:02:11:01')).toBeVisible();
  });
});
