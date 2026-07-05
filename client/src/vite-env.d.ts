declare module 'vite' {
  interface UserConfig {
    test?: import('vitest').VitestConfig;
  }
}
