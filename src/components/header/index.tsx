// import { useState } from 'react';
// import Link from 'next/link';
// import { Menu, X, Github } from 'lucide-react';

// export const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg z-50">
//       <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="text-white font-extrabold text-2xl">codeFlux</span>
//             <span className="text-white font-semibold text-sm tracking-wider">AI Dev Assistant</span>
//           </Link>

//           {/* Desktop Menu */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <Link href="/" className="text-white hover:text-yellow-300 font-medium transition">
//               Dashboard
//             </Link>
//             <Link href="/repositories" className="text-white hover:text-yellow-300 font-medium transition">
//               Repositories
//             </Link>
//             <Link href="/settings" className="text-white hover:text-yellow-300 font-medium transition">
//               Settings
//             </Link>
//             <a
//               href="https://github.com/your-repo"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white hover:text-yellow-300 transition"
//             >
//               <Github className="w-5 h-5" />
//             </a>
//           </nav>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="text-white p-2 rounded-md hover:bg-white/20 transition"
//               aria-label="Toggle Menu"
//             >
//               {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-gradient-to-b from-blue-600 to-purple-600 shadow-inner">
//           <nav className="px-4 py-4 space-y-3 flex flex-col">
//             <Link href="/" className="text-white font-medium hover:text-yellow-300" onClick={() => setMenuOpen(false)}>
//               Dashboard
//             </Link>
//             <Link href="/repositories" className="text-white font-medium hover:text-yellow-300" onClick={() => setMenuOpen(false)}>
//               Repositories
//             </Link>
//             <Link href="/settings" className="text-white font-medium hover:text-yellow-300" onClick={() => setMenuOpen(false)}>
//               Settings
//             </Link>
//             <a
//               href="https://github.com/your-repo"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white font-medium hover:text-yellow-300"
//               onClick={() => setMenuOpen(false)}
//             >
//               GitHub
//             </a>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Github, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/repositories", label: "Repositories" },
    { href: "/settings", label: "Settings" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Code2 className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-extrabold text-2xl tracking-tight">
                codeFlux
              </span>
              <span className="text-gray-700 font-medium text-xs tracking-wider uppercase">
                AI Dev Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg font-medium transition-all duration-300",
                  isActive(item.href)
                    ? "text-white bg-blue-600 shadow"
                    : "text-black hover:text-blue-600 hover:bg-gray-100"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 p-2 text-black hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-black p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
              aria-label="Toggle Menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-white border-t border-gray-200">
          <nav className="px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-4 py-3 rounded-lg font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "text-white bg-blue-600 shadow"
                    : "text-black hover:text-blue-600 hover:bg-gray-100"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-3 text-black hover:text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
