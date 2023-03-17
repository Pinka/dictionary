// create header component with next-auth login/logout

import { useSession } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case">daisyUI</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input-bordered input"
          />
        </div>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
            <div className="w-10 rounded-full">
              {/* <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // return (
  //   <header className="navbar bg-primary text-primary-content">
  //     <div className="flex-1 pl-5 text-3xl font-bold">
  //       {session ? <span>Logged in as {session?.user?.name}</span> : null}
  //     </div>
  //     <nav className="flex-none gap-2">
  //       <ul>
  //         <li>
  //           <Link href="/api/auth/signin">
  //             {session ? "Sign out" : "Sign in"}
  //           </Link>
  //         </li>
  //       </ul>
  //     </nav>
  //   </header>
  // );
};
