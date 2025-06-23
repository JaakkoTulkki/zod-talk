import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import React from "react";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { UserSchema, type CreateBody } from "shared";

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
  const [error, setError] = React.useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      name: "",
      street: "",
      postCode: "",
    },
    onSubmit: async ({ value: { name, street, postCode } }) => {
      const body: CreateBody = {
        name,
        address: { street, postCode },
      };
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        try {
          UserSchema.parse(data);
        } catch (e) {
          console.error("Invalid user data:", e);
          throw new Error("Failed to create user: ");
        }
        form.reset();
        window.location.href = `/user/${name}`;
      } else {
        const data = await response.json();
        setError(data.error || "Something happend");

        console.error("Failed to create user", data);
      }
    },
  });

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <form.Field
          name="name"
          validators={{
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return value.includes("error") && 'No "error" allowed in name';
            },
          }}
        >
          {(field) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor={field.name}>First Name:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="street">
          {(field) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor={field.name}>Street:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="postCode">
          {(field) => (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor={field.name}>Post Code:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
        {error && <div style={{ color: "red" }}>{error}</div>}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
