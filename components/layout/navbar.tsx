"use client";

import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { LayoutDashboard } from "lucide-react";

export default function NavBar() {
  const scrolled = useScroll(50);

  return (
    <nav className="fixed top-0 left-0 w-full z-30 transition-all neumorph-navbar">
      <div className="flex justify-center items-center w-full h-full">
        <a href="https://bridgit-ai.com" target="_blank" rel="noopener noreferrer" className="no-underline">
          <button className="neumorph-btn">
            COMMUNITY
          </button>
        </a>
      </div>
    </nav>
  );
}