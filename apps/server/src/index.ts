import express from "express";
import cors from "cors";
import { BodySchema, GetUserRequestParamSchema, UserSchema } from "shared";
import { validate } from "./validate.ts";

const app = express();
const port = 3000;

const users = [
    {
        id: "1",
        name: "Alice",
        address: { street: "123 Main St", postCode: "123456" },
    },
    {
        id: "2",
        name: "Bob",
        address: { street: "456 Elm St", postCode: "654321" },
    },
];

app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.use(express.json());

app.get(
    "/user/:name/",
    validate({
        params: GetUserRequestParamSchema,
        response: UserSchema,
    }),
    (req, res) => {
        const { name } = req.params;
        const user = users.find((u) => u.name === name);
        if (user) {
            res.status(200).send({ ...user });
        } else {
            res.status(404).send({ error: "User not found" });
        }
    }
);

app.post(
    "/user",
    validate({
        body: BodySchema,
        response: UserSchema,
    }),
    (req, res) => {
        const {
            name,
            address: { street, postCode },
        } = req.body;
        const user = {
            id: (users.length + 1).toString(),
            name,
            address: {
                street,
                postCode,
            },
        };
        users.push(user);
        res.status(201).send(user);
    }
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
