import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2Eテスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* テストファイルのパターン */
  testMatch: '**/*.spec.ts',
  /* タイムアウト時間（ミリ秒） */
  timeout: 10 * 1000,
  /* 各テストのリトライ回数 */
  retries: process.env.CI ? 2 : 0,
  /* 並列実行するワーカー数 */
  workers: process.env.CI ? 1 : undefined,
  /* テスト実行前の準備 */
  use: {
    /* ベースURL */
    baseURL: 'http://localhost:5173',
    /* トレースを失敗時のみ記録 */
    trace: 'on-first-retry',
    /* スクリーンショットを失敗時のみ撮影 */
    screenshot: 'only-on-failure',
  },

  /* 開発サーバーの設定 */
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* 異なるブラウザでのテスト設定 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
