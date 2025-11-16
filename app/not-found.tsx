export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-white text-black px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-semibold mb-4">404 – Page Not Found</h1>

        <p className="text-gray-600 text-base leading-relaxed mb-8">
          The page you’re trying to access doesn’t exist or may have been
          removed. Please check the URL or return to the homepage.
        </p>

        <a
          href="/"
          className="inline-block border border-black px-6 py-2 rounded-md text-sm font-medium hover:bg-black hover:text-white transition"
        >
          Go Back Home
        </a>
      </div>
    </main>
  );
}
