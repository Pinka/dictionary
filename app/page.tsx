import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import Image from "next/image";
import backgroundPic from "./background.webp";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { WordOfTheDay } from "@/components/WordOfTheDay";
import { RecentSearches } from "@/components/RecentSearches";

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
        <header>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div></div>
            <Button variant="ghost">Login</Button>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-6">
              <SearchSuggestions />
              <div className="flex justify-center gap-4 items-center">
                <LanguageSwitch />
              </div>
            </div>

            <RecentSearches />

            <WordOfTheDay />
          </div>
        </main>

        <footer className="border-t bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <nav>
              <ul className="flex justify-center gap-8">
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
