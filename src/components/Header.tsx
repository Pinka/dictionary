// create header component with next-auth login/logout

import { useSession } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex-row align-middle">
      <div className="mx-2 flex-1 px-2">
        {session ? <span>Logged in as {session?.user?.name}</span> : null}
      </div>
      <nav className="flex-none gap-2">
        <ul>
          <li>
            <Link href="/api/auth/signin">
              {session ? "Sign out" : "Sign in"}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
