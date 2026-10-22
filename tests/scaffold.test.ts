import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Project Scaffold Verification', () => {
  const rootDir = process.cwd();

  it('must contain package.json with react-native and expo dependencies', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    assert.strictEqual(fs.existsSync(pkgPath), true, 'package.json must exist');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    assert.ok(pkg.dependencies, 'dependencies must be defined');
    assert.ok(pkg.dependencies['expo'], 'expo must be installed');
    assert.ok(pkg.dependencies['react-native'], 'react-native must be installed');
    assert.ok(pkg.dependencies['zustand'], 'zustand must be installed');
    assert.ok(pkg.dependencies['@react-native-async-storage/async-storage'], 'async-storage must be installed');
    assert.ok(pkg.dependencies['@expo/vector-icons'], '@expo/vector-icons must be installed');
  });

  it('must contain app.json for Android configuration', () => {
    const appJsonPath = path.join(rootDir, 'app.json');
    assert.strictEqual(fs.existsSync(appJsonPath), true, 'app.json must exist');
    const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
    assert.ok(appConfig.expo, 'expo config must exist');
    assert.strictEqual(appConfig.expo.name, 'Focus 21');
    assert.ok(appConfig.expo.android, 'android config must exist');
  });

  it('must contain App.tsx entry point', () => {
    const appPath = path.join(rootDir, 'App.tsx');
    assert.strictEqual(fs.existsSync(appPath), true, 'App.tsx must exist');
  });

  it('must contain valid icon, adaptive-icon, and splash configuration and asset files', () => {
    const appJsonPath = path.join(rootDir, 'app.json');
    const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
    assert.ok(appConfig.expo.icon, 'expo.icon must be configured');
    assert.ok(appConfig.expo.splash?.image, 'expo.splash.image must be configured');
    assert.ok(appConfig.expo.android?.adaptiveIcon?.foregroundImage, 'android.adaptiveIcon.foregroundImage must be configured');

    assert.ok(fs.existsSync(path.join(rootDir, appConfig.expo.icon)), 'icon file must exist');
    assert.ok(fs.existsSync(path.join(rootDir, appConfig.expo.splash.image)), 'splash image file must exist');
    assert.ok(fs.existsSync(path.join(rootDir, appConfig.expo.android.adaptiveIcon.foregroundImage)), 'adaptive icon file must exist');
  });
});
