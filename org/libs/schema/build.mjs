// @ts-check
/// <reference types="node" />

import { build as esbuild } from "esbuild"

const build = async () => {
  try {
    await esbuild({
      entryPoints: ["src/index.ts"],
      outfile: "dist/index.cjs",
      platform: "node",
      target: "node22",
      bundle: true,
      format: "cjs",
      sourcemap: true,
      minify: false,
      outExtension: { '.js': '.cjs' },
      logLevel: "info",
    })
  } catch (error) {
    console.error(error)
    
    process.exit(1)
  }
}

build()
