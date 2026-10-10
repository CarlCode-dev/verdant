import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  good = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <div className="rounded-xl border border-cream/10 bg-cream/5 px-3.5 py-3">
      <div className="flex items-center gap-1.5">
        <Icon size={14} className="text-sage" />
        <p className="text-[11px] text-mint">{label}</p>
      </div>
      <p className={`mt-1 text-base font-medium ${good ? "text-sage" : "text-cream"}`}>
        {value}
      </p>
    </div>
  );
}