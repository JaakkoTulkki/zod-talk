/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod/v4";

const dateSchema = z.iso.date().transform((date) => new Date(date));

const d = dateSchema.parse("2000-12-31");
console.log(d instanceof Date);

const nameSchema = z.string();
const ageSchema = z.number().int().min(0).max(150);

const addressSchema = z.object({
  street: z.string(),
  postCode: z.string().length(6),
});

const userSchema = z.object({
  id: z.string().optional(),
  name: nameSchema,
  age: ageSchema,
  address: addressSchema,
  get friends() {
    return z.array(userSchema).optional();
  },
});

type User = z.infer<typeof userSchema>;

const user: User = {
  id: "abc",
  name: "Alice",
  age: 44,
  address: {
    street: "Main St",
    postCode: "123456",
  },
};
