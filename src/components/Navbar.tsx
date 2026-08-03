"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/browse", label: "Browse" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/orders", label: "My Orders" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f1712]/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent"
        >
          FitFork
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <button
              onClick={() => signOut()}
              className="hidden sm:inline-block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden sm:inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-orange-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#0f1712]/95 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {status === "authenticated" ? (
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm font-medium text-green-600 dark:text-green-400"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
