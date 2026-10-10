export default function TerminalWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-dark w-full max-w-sm rounded-xl border border-white/10 bg-[#031f22]/90 text-left">
      <div className="flex gap-1.5 border-b border-white/10 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#e24b4a]" />
        <span className="h-2 w-2 rounded-full bg-[#ef9f27]" />
        <span className="h-2 w-2 rounded-full bg-sage" />
      </div>
      <div className="space-y-1.5 p-4 font-mono text-[11px] leading-relaxed text-mint">
        {children}
      </div>
    </div>
  );
}