import { Link } from "@tanstack/react-router";

export function Users() {
  return (
    <div className="px-8">
      <Link to="/admin">Back to Admin</Link>
      <p>
        I'm the users page! In this page, allow me to manage all the users of
        this website including admins!
      </p>
    </div>
  );
}
