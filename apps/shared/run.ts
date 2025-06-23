import { z, ZodType } from "zod/v4";

const addressSchema = z.object({
    street: z.string(),
    postCode: z.string().length(6),
});
const userSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    address: addressSchema,
    get friends() {
        return z.array(userSchema).optional();
    },
});

type User = z.infer<typeof userSchema>;

type People = User[];

z.infer<>