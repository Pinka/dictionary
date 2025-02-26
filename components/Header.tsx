import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div></div>
        <Button variant="ghost">Login</Button>
      </div>
    </header>
  );
}
