export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <nav>
          <ul className="flex justify-center gap-8">
            <li>
              <a href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </a>
            </li>
            <li>
              <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
