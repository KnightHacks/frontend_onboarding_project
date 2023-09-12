import { useLoader } from "@tanstack/react-router";

export function Users() {
  const data = useLoader({ from: "/admin/users" });

  return (
    <div>
      <h1>Users</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
