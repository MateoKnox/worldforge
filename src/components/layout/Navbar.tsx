"use client";
import { useState } from "react";
import { Map, Users, Trophy, BookOpen, ExternalLink, Menu, X } from "lucide-react";

const links = [
  { label: "World Map", href: "/world", icon: Map },
  { label: "Factions", href: "/factions", icon: Users },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "History", href: "/history", icon: BookOpen },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(212,160,23,0.15)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-display text-xl font-bold tracking-widest text-[#d4a017] hover:text-[#f0c040] transition-colors">
          ⚔ WORLDFORGE
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#a09880] hover:text-[#d4a017] hover:bg-[rgba(212,160,23,0.08)] transition-all font-display tracking-wide">
              <Icon size={14} />
              {label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <a href="https://github.com/MateoKnox/worldforge" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#a09880] hover:text-white transition-colors">
            <ExternalLink size={16} /> GitHub
          </a>
          <a href="/world"
            className="px-5 py-2 bg-[#d4a017] text-black text-sm font-semibold rounded-lg hover:bg-[#f0c040] transition-all font-display tracking-wide glow-gold">
            Enter World
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-[#d4a017]" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[rgba(212,160,23,0.15)] px-6 py-4 flex flex-col gap-3">
          {links.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href}
              className="flex items-center gap-3 py-2 text-sm text-[#a09880] hover:text-[#d4a017] transition-colors font-display">
              <Icon size={16} /> {label}
            </a>
          ))}
          <a href="/world" className="mt-2 px-5 py-2 bg-[#d4a017] text-black text-sm font-semibold rounded-lg text-center font-display">
            Enter World
          </a>
        </div>
      )}
    </nav>
  );
}
