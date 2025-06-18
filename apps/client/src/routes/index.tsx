import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import React from "react";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { AddressSchema, UserSchema } from "shared";

export const Route = createFileRoute("/")({
    component: UserForm,
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em>{field.state.meta.errors.join(", ")}</em>
            ) : null}
            {field.state.meta.isValidating ? "Validating..." : null}
        </>
    );
}

function UserForm() {
    const form = useForm({
        defaultValues: {
            name: "",
            street: "",
            postCode: "",
        },
        onSubmit: async ({ value: { name, street, postCode } }) => {
            const response = await fetch("http://localhost:3000/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    address: { street, postCode },
                }),
            });
            const data = await response.json();
            try {
                UserSchema.parse(data);
                console.log("User created successfully:", data);
                form.reset();
                window.location.href = `/user/${data.name}`;
            } catch (error: unknown) {
                console.error("Invalid user data:", error);
                throw new Error("Failed to create user: ");
            }
        },
    });

    return (
        <div style={{ margin: "0 auto", width: "500px" }}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div>
                    {/* A type-safe field component*/}
                    <form.Field
                        name="name"
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: async ({ value }) => {
                                await new Promise((resolve) =>
                                    setTimeout(resolve, 1000)
                                );
                                return (
                                    value.includes("error") &&
                                    'No "error" allowed in name'
                                );
                            },
                        }}
                        children={(field) => {
                            // Avoid hasty abstractions. Render props are great!
                            return (
                                <>
                                    <label htmlFor={field.name}>
                                        First Name:
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                    <FieldInfo field={field} />
                                </>
                            );
                        }}
                    />
                </div>
                <div>
                    <form.Field
                        name="street"
                        children={(field) => (
                            <>
                                <label htmlFor={field.name}>Street:</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                                <FieldInfo field={field} />
                            </>
                        )}
                    />
                </div>
                <div>
                    <form.Field
                        name="postCode"
                        children={(field) => (
                            <>
                                <label htmlFor={field.name}>Post Code:</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                                <FieldInfo field={field} />
                            </>
                        )}
                    />
                </div>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button type="submit" disabled={!canSubmit}>
                            {isSubmitting ? "..." : "Submit"}
                        </button>
                    )}
                />
            </form>
        </div>
    );
}
