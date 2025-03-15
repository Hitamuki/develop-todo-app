/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function prepare() {
  // ローカル開発環境に限定
  if (isDevMode()) {
    const { worker } = await import('./mocks/browser');
    return await worker.start();
  }

  return Promise.resolve();
}

// Angularアプリケーションを起動する直前にService Workerを立ち上げる
prepare().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
});
