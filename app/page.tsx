import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VoiceSearch } from "@/components/VoiceSearch";
import Image from "next/image";
import backgroundPic from "./background.webp";

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
        {/* Header */}
        <header>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div></div>
            <Button variant="ghost">Login</Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Search Section */}
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for a word..."
                  className="w-full pl-4 pr-12 py-6 text-lg rounded-full"
                />
                <VoiceSearch />
              </div>

              {/* Language Selector */}
              <div className="flex justify-center gap-2 items-center">
                <select className="rounded-md border p-2">
                  <option value="en">English</option>
                </select>
                <span>→</span>
                <select className="rounded-md border p-2">
                  <option value="mu">Mauritian</option>
                </select>
              </div>
            </div>

            {/* Recent Searches - Only shown when logged in */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
              <ul className="space-y-2">
                <li className="hover:bg-gray-100 p-2 rounded">
                  Recent search 1
                </li>
                <li className="hover:bg-gray-100 p-2 rounded">
                  Recent search 2
                </li>
              </ul>
            </div>

            {/* Word of the Day */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Word of the Day</h2>
              <div>
                <p className="font-bold">Inspiration</p>
                <p className="text-gray-600 italic">
                  A sudden brilliant or timely idea
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
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
