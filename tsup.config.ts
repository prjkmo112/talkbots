import { defineConfig } from 'tsup';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
    entry: ['src/index.ts'], // 진입점 파일
    format: ['cjs', 'esm'],  // CommonJS와 ES Module 모두 출력
    dts: true,               // 타입 정의 파일(.d.ts) 생성 (tsconfig 설정을 따름)
    sourcemap: true,         // 디버깅을 위한 소스맵 생성
    clean: true,             // 빌드 시 dist 폴더 초기화
    treeshake: true,         // 사용하지 않는 코드 제거
});