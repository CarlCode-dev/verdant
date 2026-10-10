import { Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center gap-6 border-t border-cream/10 px-7 py-3 text-xs text-mint">
      <a
        href="https://github.com/CarlCode-dev"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:text-cream"
      >
        github <ArrowUpRight size={13} />
      </a>
      <a
        href="https://www.linkedin.com/in/carlito-dignos-b270a5439/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:text-cream"
      >
        linkedin <ArrowUpRight size={13} />
      </a>
      <a
        href="mailto:dignoscarlito123@gmail.com"
        className="flex items-center gap-1 hover:text-cream"
      >
        <Mail size={13} /> email
      </a>
    </footer>
  );
}