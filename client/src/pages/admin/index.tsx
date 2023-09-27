export function Admin() {
  return (
    <div className="px-8">
      <p>
        I'm the super secret admin page! In this page, allow me to manage all
        the resources of this website!
      </p>

      <ul>
        <li>
          <a href="/admin/users">Users</a>
        </li>
        <li>
          <a href="/admin/items">Items</a>
        </li>
      </ul>
    </div>
  );
}
