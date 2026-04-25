// @ts-check
/// <reference types="node" />

import childProcess from "child_process";

export const spawnWithLabel = (
  /** @type {string} */ label, 
  /** @type {string} */ command, 
  /** @type {readonly string[] | undefined} */ args,
  /** @type {childProcess.SpawnOptionsWithoutStdio} */ options = {},
) => {
  const child = childProcess.spawn(command, args, {
    stdio: "pipe",
    shell: true,
    ...options,
  })

  child.stdout.on('data', (data) => {
    console.log(`${label} ${data.toString().trim()}`)
  })

  child.stderr.on('data', (data) => {
    console.error(`${label} ${data.toString().trim()}`)
  })

  /** @type {Promise<void>} */
  const closed = new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code !== 0) {
        reject(`${label}: Closed with code ${code}`)
      }

      resolve()
    })

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(`${label}: Exited with code ${code}`)
      }

      resolve()
    })
  })

  const sigkill = async () => {
    if (!child.pid) {
      return
    }

    try {
      if (process.platform === 'win32') {
        childProcess.execSync(`taskkill /pid ${child.pid} /t /f`, { stdio: 'ignore' }); 
      } else {
        process.kill(child.pid, 'SIGKILL');
      }

      await closed
    } catch { }
  }

  return {
    sigkill,
    closed,
  }
}
