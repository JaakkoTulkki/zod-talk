import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/user/$name")({
    component: RouteComponent,
    loader: async ({ params }) => {
        // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
        const response = await fetch(
            `http://localhost:3000/user/${params.name}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        const data = await response.json();

        return { ...data };
    },
});

function RouteComponent() {
    const data = Route.useLoaderData();

    return (
        <div style={{ margin: "0 auto", width: "500px" }}>
            <h2>{data.name}</h2>
            <p>Id: {data.id}</p>
            <p>Street: {data.address.street}</p>
            <p>Post Code: {data.address.postCode}</p>
        </div>
    );
}
