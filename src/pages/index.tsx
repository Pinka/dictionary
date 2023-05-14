import { type NextPage } from "next";
import Head from "next/head";
// import { signIn, signOut, useSession } from "next-auth/react";
import { Words } from "~/components/Words";

const Home: NextPage = () => {
  // const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Dictionary</title>
      </Head>
      <main className="mx-auto max-w-sm pb-2">
        {/* <div className="flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            className="w-full bg-black/5 px-10 py-3 hover:bg-black/10"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div> */}

        <Words />
      </main>
    </>
  );
};

export default Home;
