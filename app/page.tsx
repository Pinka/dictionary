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
      <main className="h-screen overflow-y-auto overflow-x-hidden">
        <div className="max-w-sm mx-auto relative">
          <Words />
        </div>
      </main>
    </>
  );
}
