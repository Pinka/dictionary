import Image from "next/image";
import backgroundPic from "./background.webp";
import { Words } from "@/components/Words";

export default function Home() {
  return (
    <>
      <div className="site-background fixed -z-10 h-full w-full">
        <Image
          src={backgroundPic}
          alt="background"
          className="object-cover"
          fill
          priority
        />
      </div>
      <main className="mx-auto max-w-sm pb-2 h-screen">
        <Words />
      </main>
    </>
  );
}
