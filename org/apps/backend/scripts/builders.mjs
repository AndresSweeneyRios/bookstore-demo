// @ts-check
/// <reference types="node" />

import * as path from "path"
import { spawnWithLabel } from "../../../utils/process.mjs"
import chalk from "chalk"
import { build as es } from "esbuild";
import { builtinModules } from "node:module";
import * as fs from "fs/promises"
import orgManifest from "../../../package.json" with { type: "json" }
import backendManifest from "../package.json" with { type: "json" }

export const ROOT = path.join(import.meta.dirname, "..")
export const SRC = path.join(ROOT, "src")
export const DIST = path.join(ROOT, "dist")
export const PRISMA_CLIENT = path.join(ROOT, "prisma-client")
export const PRISMA_CLIENT_DIST = path.join(DIST, "prisma-client")
export const MANIFEST_PATH = path.join(DIST, "package.json")

export const prisma = async () => {
  const label = chalk.bgMagentaBright.black(" PRISMA ")

  console.log(`${label} Generating Prisma client`)

  const { closed } = spawnWithLabel(label, "prisma", ["generate", "--no-hints"])

  await closed

  try {
    await fs.mkdir(DIST)
  } catch { }

  await fs.cp(PRISMA_CLIENT, PRISMA_CLIENT_DIST, { recursive: true })
}

export const esbuild = async () => {
  const label = chalk.bgCyanBright.black(" ESBUILD ")
  
  console.log(`${label} Bundling from source`)

  await es({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    platform: "node",
    target: "node22",
    bundle: true,
    format: "cjs",
    sourcemap: true,
    minify: false,
    external: [
      ...builtinModules,
      ...builtinModules.map(m => `node:${m}`),
      "argon2",
    ],
    plugins: [{
      name: "external-prisma-client",
      setup(build) {
        build.onResolve({ filter: /^(\.\/|\.\.\/)?prisma-client(\/.*)?$/ }, (args) => {
          return { path: args.path.replace(/^.*?prisma-client/, "./prisma-client"), external: true }
        })
      },
    }],
    logLevel: "info",
  })
}

export const npm = async () => {
  const manifest = {
    name: "@org/backend",
    version: backendManifest.version || "1.0.0",
    main: "index.js",
    dependencies: {
      argon2: orgManifest.dependencies["argon2"],
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2))

  const label = chalk.bgRedBright.black(" NPM ")

  const { closed } = spawnWithLabel(label, "npm", ["i"], {
    cwd: DIST
  })

  await closed
}
