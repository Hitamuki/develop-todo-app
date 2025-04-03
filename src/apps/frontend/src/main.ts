/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

async function prepare() {
  // ローカル開発環境に限定
  if (isDevMode()) {
    if (environment.mock) {
      const { worker } = await import('./mocks/browser');
      // モックサーバーを起動
      return await worker.start();
    }
  }

  return Promise.resolve();
}

// Angularアプリケーションを起動する直前にService Workerを立ち上げる
prepare().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
});
