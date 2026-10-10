import { Blocks, Cloud, Ship, Container } from "lucide-react";

const stack = [
  { name: "terraform", icon: Blocks },
  { name: "aws", icon: Cloud },
  { name: "k3s", icon: Ship },
  { name: "docker", icon: Container },
];

export default function TechStrip() {
  return (
    <section
      id="architecture"
      className="mx-auto w-full max-w-5xl border-t border-cream/10 px-7 py-3"
    >
      <ul className="flex flex-wrap items-center justify-center gap-8 text-xs text-mint">
        {stack.map(({ name, icon: Icon }) => (
          <li key={name} className="flex items-center gap-2">
            <Icon size={15} className="text-sage" />
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}