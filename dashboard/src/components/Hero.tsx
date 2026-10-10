import TerminalWindow from "./TerminalWindow";

export default function Hero() {
  return (
    <section className="bg-[radial-gradient(ellipse_at_center,rgba(78,166,116,0.25),transparent_70%)]">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-7 py-6 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-sage/15 px-3.5 py-1.5 text-[11px] text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            self-healing kubernetes infrastructure
          </span>

          <h1 className="mt-4 text-[clamp(2rem,6vh,3.5rem)] font-medium leading-tight text-cream">
            Infrastructure that <span className="text-sage">fixes itself</span>
          </h1>

          <p className="mt-3 max-w-sm text-sm text-mint">
            Provisioned with Terraform, orchestrated with k3s, self-healing by
            design.
          </p>

          <div className="mt-5 flex gap-3">
            <a
              href="https://github.com/CarlCode-dev/verdant"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-sage px-5 py-2.5 text-[13px] font-medium text-ink"
            >
              View on GitHub
            </a>
            <a
              href="#status"
              className="rounded-lg border border-sage px-5 py-2.5 text-[13px] text-mint"
            >
              See live status
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 md:items-end">
          <TerminalWindow>
            <p>$ kubectl delete pod -l app=verdant</p>
            <p>
              verdant-68c5cd6bc6-lchnp{" "}
              <span className="text-cream">Terminating</span>
            </p>
            <p>
              verdant-68c5cd6bc6-6nw5r{" "}
              <span className="text-sage">1/1 Running</span>
            </p>
            <p className="pt-1">$ kubectl scale deployment verdant --replicas=3</p>
            <p>
              3 pods <span className="text-sage">Running</span> within 7s
            </p>
          </TerminalWindow>
          <p className="text-[11px] text-mint/70">
            real output from the cluster, September 26, 2026
          </p>
        </div>
      </div>
    </section>
  );
}