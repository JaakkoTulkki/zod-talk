import { z } from "zod/v4";

export const AddressSchema = z.object({
    street: z.string(),
    postCode: z.string().refine((val) => val.length === 6),
});

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
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
