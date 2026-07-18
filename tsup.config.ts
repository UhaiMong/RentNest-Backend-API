// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/server.ts"],
//   outDir: "dist",
//   format: ["esm"],
//   target: "node20",
//   platform: "node",
//   sourcemap: true,
//   clean: true,
//   splitting: false,
//   bundle: false,
//   dts: false,
//   shims: false,
// });

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"], // Keep this as ESM
  target: "esnext",
  outDir: "dist",
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,
  banner: {
    js: `
   import { createRequire } from 'module';
   const require = createRequire(import.meta.url);
  `,
  },
});
