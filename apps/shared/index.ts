import { z } from "zod/v4";

export const AddressSchema = z.object({
  street: z.string().min(4),
  postCode: z.string().refine((val) => val.match(/[a-zA-Z0-9]{6}/), {
    error: "post code should have length of 6",
  }),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  address: AddressSchema,
});

export const GetUserRequestParamSchema = z.object({
  name: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const ParamsSchema = z.object({
  name: z.string(),
});

export const BodySchema = UserSchema.omit({ id: true });
export type CreateBody = z.infer<typeof BodySchema>;
