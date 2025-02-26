import { LanguageSwitch } from "@/components/LanguageSwitch";
import Image from "next/image";
import backgroundPic from "./background.webp";
import { Search } from "@/components/search/Search";
import { WordOfTheDay } from "@/components/WordOfTheDay";
import { RecentSearches } from "@/components/RecentSearches";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <div className="fixed -z-10 h-full w-full">
        <Image
          src={backgroundPic}
          alt="background"
          className="object-cover"
          fill
          priority
        />
      </div>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-6">
              <Search />
              <div className="flex justify-center gap-4 items-center">
                <LanguageSwitch />
              </div>
            </div>
            <RecentSearches />
            <WordOfTheDay />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
