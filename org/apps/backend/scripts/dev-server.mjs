// @ts-check
/// <reference types="node" />

import fsSync from "fs"
import * as path from "path"
import chalk from "chalk"
import { spawnWithLabel } from "../../../utils/process.mjs"
import { esbuild, prisma, SRC } from "./builders.mjs"
import chokidar from "chokidar"

const SCHEMA_PATH = path.join(SRC, "..", "schema.prisma")
const SWC_REGEX = /\.(js|ts|mjs|cjs)$/i
const NOOP = () => {}

const start = () => {
  const label = chalk.bgGreenBright.black(" DEV ")

  const { sigkill, closed } = spawnWithLabel(label, "node", ["--enable-source-maps", "dist/index.js"])

  closed.catch(NOOP)

  return sigkill
}

let working = false

const init = async () => {
  let stop = async () => {}

  try {
    await prisma()
    await esbuild()
    stop = start()
  } catch (error) {
    console.error(error)
  }

  // fs.watch(..., { recursive: true }) is unsupported on linux; our project already depends on chokidar
  chokidar.watch(SRC, { ignoreInitial: true }).on("all", async (_, filename) => {
    if (working || !filename || !SWC_REGEX.test(filename)) {
      return
    }

    try {
      working = true

      await stop()
      await esbuild()
      stop = start()
    } catch (error) {
      console.error(error)
    } finally {
      working = false
    }
  })
  
  fsSync.watch(SCHEMA_PATH, async () => {
    if (working) {
      return
    }
      
    try {
      working = true

      await stop()
      await prisma()
      await esbuild()
      stop = start()
    } catch (error) {
      console.error(error)
    } finally {
      working = false
    }
  })
}

init().catch(console.error)
