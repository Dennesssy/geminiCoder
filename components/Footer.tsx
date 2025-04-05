import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mb-3 mt-5 flex h-16 w-full flex-col items-center justify-between space-y-3 px-3 pt-4 text-center sm:mb-0 sm:h-20 sm:flex-row sm:pt-2">
      <div>
        <div className="font-medium">
          Built with{" "}
          <a
            href="https://ai.google.dev/gemini-api/docs"
            className="font-semibold text-blue-600 underline-offset-4 transition hover:text-gray-700 hover:underline"
            target="_blank"
          >
            Daily PNP API
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/nutlope/llamacoder"
            className="font-semibold text-blue-600 underline-offset-4 transition hover:text-gray-700 hover:underline"
            target="_blank"
          >
            Inspired on Llamacoder
          </a>
          .
        </div>
      </div>
      <div className="flex space-x-4 pb-4 sm:pb-0">
        {/* Replaced Twitter with Telegram */}
        <Link
          href="https://t.me/thedailypnp"
          className="group"
          aria-label="Telegram"
          target="_blank"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 fill-gray-500 group-hover:fill-gray-700 dark:fill-slate-500 dark:group-hover:fill-slate-400" // Added dark mode fill
            viewBox="0 0 24 24" // Added viewBox for better scaling
          >
            {/* Simple Telegram/Paper Plane Icon Path */}
            <path d="M21.9 3.31a1.07 1.07 0 0 0-1.44-.24L2.71 11.29a1 1 0 0 0 .18 1.85l4.8 1.53 1.52 4.8a1 1 0 0 0 1.85.18l8.22-17.75a1.07 1.07 0 0 0-.23-1.44zm-5.4 4.15-6.58 5.98-3.8-1.2Z"/>
          </svg>
        </Link>
      </div>
    </footer>
  );
}
