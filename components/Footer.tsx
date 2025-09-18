import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-center py-6 mt-10 border-t border-gray-300">
      <p className="text-sm">&copy; 2025 DailySparks. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <Link href="/about" className="text-sm hover:underline">
          About
        </Link>
        <Link href="/contact" className="text-sm hover:underline">
          Contact
        </Link>
        <Link href="/privacy-policy" className="text-sm hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms-and-conditions" className="text-sm hover:underline">
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
}
