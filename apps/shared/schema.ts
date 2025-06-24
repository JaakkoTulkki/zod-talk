import { z, type ZodType } from "zod/v4";

const envSchema = z.object({
  ENVIRONMENT: z.literal(["prod", "dev", "test"]),
  API_SECRET: z.string(),
});

function validateEnv<T extends ZodType>(schema: T): z.infer<T> {
  try {
    const ENV = schema.parse(globalThis.process.env);
    return ENV;
  } catch (e: unknown) {
    console.error("Cannot parse the environment");
    throw e;
  }
}

export const ENV = validateEnv(envSchema);
