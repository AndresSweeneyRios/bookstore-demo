// @ts-check
/// <reference types="node" />

import { esbuild, npm, prisma } from "./builders.mjs";

const build = async () => {
  await prisma()
  await esbuild()
  await npm()
}

build().catch((error) => {
  console.error(error)

  process.exit(1)
})
