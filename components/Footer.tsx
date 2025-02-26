export function Footer() {
  return (
    <footer>
      <div className="container mx-auto px-4 py-3">
        <nav>
          <ul className="flex justify-center gap-6 text-sm">
            <li>
              <a
                href="https://github.com/pinka/dictionary"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:underline"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/pinka/dictionary/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:underline"
              >
                Report
              </a>
            </li>
            <li>
              <a
                href="https://github.com/pinka/dictionary/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:underline"
              >
                Contribute
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
