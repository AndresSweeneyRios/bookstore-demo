// @ts-check
/// <reference types="node" />

import { prisma } from "./db.mjs";
import defaultBooks from "../json/defaultBooks.json" with { type: "json" }

export const setDefaultBooks = async () => {
  try {
    await prisma.book.createMany({
      data: defaultBooks
    })

    console.log(`Successfully inserted default books`)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}

void setDefaultBooks()
