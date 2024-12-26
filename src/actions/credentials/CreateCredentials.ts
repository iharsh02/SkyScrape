"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  createCredentialsSchema,
  createCredentialsSchemaType,
} from "@/schema/credentails";
import { revalidatePath } from "next/cache";
import { symetricEncrypt } from "@/lib/encryption";

type CreateCredentialsResponse = {
  success: boolean;
  error?: string;
};

export default async function createCredentials(
  form: createCredentialsSchemaType,
): Promise<CreateCredentialsResponse> {
  try {
    const { success, data, error } = createCredentialsSchema.safeParse(form);

    if (!success) {
      console.error("Validation error:", error.format());
      return {
        success: false,
        error: "Invalid form data",
      };
    }

    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized access",
      };
    }

    let encryptedValue: string;
    try {
      encryptedValue = symetricEncrypt(data.value);
    } catch (encryptionError) {
      console.error("Encryption error:", encryptionError);
      return {
        success: false,
        error: "Failed to secure credentials",
      };
    }

    const credential = await db.credential.create({
      data: {
        userId,
        name: data.name,
        value: encryptedValue,
      },
    });

    if (!credential) {
      return {
        success: false,
        error: "Failed to create credential",
      };
    }

    revalidatePath("/credentails");

    return {
      success: true,
    };

  } catch (error) {
    console.error("Create credentials error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
