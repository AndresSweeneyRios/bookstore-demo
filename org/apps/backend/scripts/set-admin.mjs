// @ts-check
/// <reference types="node" />

import { z } from "zod"
import { prisma } from "./db.mjs";

export const setAdmin = async () => {
  try {
    const arg = process.argv[2]
  
    const { data: email, success: isValidEmail } = z.email().safeParse(arg)
  
    if (!isValidEmail) {
      throw new Error("Invalid email. Usage: `node set-admin example@example.com`")
    }

    const userRecord = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
      }
    })

    if (!userRecord) {
      throw new Error("userRecord is undefined")
    }

    const roleRecord = await prisma.userRoles.create({
      select: {
        id: true,
      },

      data: {
        user: {
          connect: {
            id: userRecord.id,
          }
        },

        // TODO: turn constants into a shared lib so we can import ROLE_ADMIN instead of hardcoding 
        role: 'admin',
      }
    })

    console.log(`Successfully added admin role for ${email} (user.id: ${userRecord.id}, role.id: ${roleRecord.id})`)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}

void setAdmin()
