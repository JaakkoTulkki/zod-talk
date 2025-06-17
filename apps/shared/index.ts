import {z} from "zod/v4";

export function foo() {
    return 'from shared';
}

export const ParamsSchema = z.object({
    id: z.string(),
})

export const QuerySchema = z.object({
    friends: z.boolean(),
});

export const AddressSchema = z.object({
    street: z.string(),
    postCode: z.string().optional(),
})

export const BodySchema = z.object({
    name: z.string(),
    address: AddressSchema,
})
