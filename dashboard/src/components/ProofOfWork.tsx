import TerminalWindow from "./TerminalWindow";

export default function ProofOfWork() {
  return (
    <section className="mx-auto max-w-5xl px-7 pb-16">
      <h2 className="mb-1 text-center text-sm font-medium text-cream">
        Proof of work
      </h2>
      <p className="mb-5 text-center text-[11px] text-mint/70">
        real output from the cluster, September 26, 2026
      </p>
      <div className="flex justify-center">
        <TerminalWindow>
          <p>$ kubectl delete pod -l app=verdant</p>
          <p>
            verdant-68c5cd6bc6-lchnp <span className="text-cream">Terminating</span>
          </p>
          <p>
            verdant-68c5cd6bc6-6nw5r <span className="text-sage">1/1 Running</span>
          </p>
          <p className="pt-1">$ kubectl scale deployment verdant --replicas=3</p>
          <p>
            3 pods <span className="text-sage">Running</span> within 7s
          </p>
        </TerminalWindow>
      </div>
    </section>
  );
}