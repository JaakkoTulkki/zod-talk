import { z } from "zod/v4";

export const AddressSchema = z.object({
    street: z.string(),
    postCode: z.string().refine((val) => val.length === 6),
});

const UserSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    address: AddressSchema,
    get friends() {
        return z.array(UserSchema).optional();
    },
});

type User = z.infer<typeof UserSchema>;
