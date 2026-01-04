"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import UserMenu from "./UserMenu";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Hide sidebar on auth routes
  if (pathname.startsWith('/sign-in')) {
    return null;
  }

  const links = [
    {
      href: "/dashboard",
      label: "Home",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/gallery",
      label: "Gallery",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: "/search",
      label: "Search",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-60"
      } bg-black/70 backdrop-blur-sm min-h-screen p-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1
            className={`text-xl font-bold text-gray-100 whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            Promptr
          </h1>
        </div>
        <nav className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-6 py-2 text-base font-medium transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isCollapsed ? "p-2 w-fit" : "px-4"
              } ${
                pathname === link.href
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              <span
                className={`whitespace-nowrap overflow-hidden transition-[opacity,width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-4">
        <UserMenu />
      </div>
    </aside>
  );
}
