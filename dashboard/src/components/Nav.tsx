import { Leaf } from "lucide-react";
import StatusPill from "./StatusPill";
import ThemeToggle from "./ThemeToggle";

const link = "hidden hover:text-cream sm:inline";

export default function Nav() {
  return (
    <header className="flex items-center justify-between border-b border-cream/10 px-5 py-4 sm:px-7">
      <div className="flex items-center gap-2">
        <Leaf size={17} className="text-sage" />
        <span className="text-[15px] font-medium text-cream">Verdant</span>
      </div>
      <nav className="flex items-center gap-3 text-[13px] text-mint sm:gap-5">
        <a
          href="https://github.com/CarlCode-dev/verdant#architecture"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Architecture
        </a>
        <a
          href="/api/status"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          Status API
        </a>
        <a
          href="https://github.com/CarlCode-dev/verdant"
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          GitHub
        </a>
        <StatusPill />
        <ThemeToggle />
      </nav>
    </header>
  );
}