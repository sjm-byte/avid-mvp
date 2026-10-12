import type { PublicProject } from "@/lib/data/public-projects";
import { EnSettlementTable } from "@/components/en/transparency/EnSettlementTable";
import { EnRiskNote } from "@/components/en/EnSection";

/* Shared prose styles: readable measure, serif sub-headings. */
const prose = "max-w-[68ch] space-y-4 leading-[1.75]";

function PanelIntro({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <header className="max-w-[68ch]">
      <h2 className="text-[2rem] leading-tight text-navy sm:text-[2.4rem]">{title}</h2>
      <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted-foreground">{children}</p>
    </header>
  );
}

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-10">
      <h3 className="text-[1.75rem] leading-snug text-navy">{title}</h3>
      <div className="mt-5 space-y-6">{children}</div>
    </section>
  );
}

function Points({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <dl className="max-w-[68ch] space-y-5 border-l border-gold/50 ps-5">
      {items.map((it) => (
        <div key={it.title}>
          <dt className="font-semibold text-navy">{it.title}</dt>
          <dd className="mt-1 leading-relaxed text-muted-foreground">{it.body}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ── 1. Track record ─────────────────────────────────────────────────── */

export function EnHistoryPanel({ rows }: { rows: PublicProject[] }) {
  return (
    <div className="space-y-10">
      <PanelIntro title="Track record and results">
        This section shows the results of Avid’s projects. Each project is ticked according to its
        latest status. Projects still in progress have no tick.
      </PanelIntro>

      <EnSettlementTable rows={rows} />

      <div className="grid gap-6 md:grid-cols-2">
        <EnRiskNote title="Performance summary" tone="plain">
          No project has resulted in a loss of principal. Most projects were settled on time, and
          some were settled roughly one month late.
        </EnRiskNote>
        <EnRiskNote>
          Past performance is not a reliable indicator of future results. Every new project has its
          own risks and its own projected return.
        </EnRiskNote>
      </div>
    </div>
  );
}

/* ── 2. Contract principles ──────────────────────────────────────────── */

const COLLATERAL_CASES = [
  {
    title: "1. Failure to meet obligations",
    body: "If the business raising funds fails to meet its obligations — for example, it does not deliver the agreed goods on the due date — the investor (as buyer of the goods) may use the collateral to obtain the same goods elsewhere.",
  },
  {
    title: "2. Failure to return capital after the venture ends",
    body: "If the business activity has ended and the profit has been determined, but the business (as seller of the goods) does not return the capital on the agreed date, the claim may likewise be recovered from the collateral.",
  },
] as const;

export function EnMethodologyPanel() {
  return (
    <div className="space-y-12">
      <PanelIntro title="Contract principles">
        This section explains Avid’s most fundamental principle, which underpins every contract,
        and the types of risk involved.
      </PanelIntro>

      <Article title="1. The founding principle of investment">
        <div className={prose}>
          <p>Our core rule for any financing or investment is this:</p>
        </div>
        <blockquote className="max-w-[60ch] border-l-2 border-gold ps-6 font-display text-[1.6rem] italic leading-snug text-navy">
          “An investor is entitled to a profit only if they accept at least some of the economic
          risk of the venture.”
        </blockquote>
        <div className={prose}>
          <p className="text-muted-foreground">
            In other words, an investor cannot receive a guarantee on their principal and also claim
            a profit from the business. If the business guarantees the principal outright, in our
            view the contract has become a <em>loan</em>, and the investor is then entitled to the
            principal only — nothing more.
          </p>
        </div>
      </Article>

      <Article title="2. Types of investment risk">
        <div className={prose}>
          <p className="text-muted-foreground">
            Broadly, every investment or financing arrangement faces two kinds of risk. They differ
            in nature, and in how each can be covered.
          </p>
        </div>
        <div className="grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="bg-card p-6">
            <h4 className="font-display text-[1.4rem] font-semibold text-navy">
              a) Credit risk (default)
            </h4>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              This concerns the creditworthiness of the person or entity receiving the funds:
              whether they can honour their cheques and obligations on the due date. It exists in
              every type of contract, and is usually covered by taking guarantees, valid
              documents and several layers of cheques.
            </p>
          </div>
          <div className="bg-card p-6">
            <h4 className="font-display text-[1.4rem] font-semibold text-navy">
              b) Economic risk (market)
            </h4>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              This concerns economic swings and changes in the price of the goods under contract.
              For example, if an investor pre-buys goods and by the due date their market price has
              halved, an economic loss has occurred.
            </p>
          </div>
        </div>

        <h4 className="pt-2 font-display text-[1.4rem] font-semibold text-navy">
          When can the guarantee documents be used?
        </h4>
        <div className={prose}>
          <p className="text-muted-foreground">
            As noted above, the risk that the business must not guarantee is economic risk.
            Taking any form of guarantee to cover default risk, however, is perfectly acceptable.
          </p>
          <p className="text-muted-foreground">
            The guarantee documents may be called upon in two situations:
          </p>
        </div>
        <Points items={COLLATERAL_CASES} />

        <EnRiskNote title="Key point" className="max-w-[68ch]">
          The risk that must not be guaranteed by the business is economic risk. A loss to the
          principal or to the profit that results from the business activity itself cannot be
          guaranteed — the investor cannot recover such a loss from the collateral.
        </EnRiskNote>
      </Article>

      <Article title="3. How investing through Avid differs from other platforms">
        <div className={prose}>
          <p className="text-muted-foreground">
            Most capital-raising platforms, including crowdfunding platforms, promise a profit while
            guaranteeing both principal and return. At the other end of the spectrum, real business
            activity always carries foreseen and unforeseen risks, which can lead to high profits in
            some periods — or even to losses.
          </p>
          <p className="text-muted-foreground">
            Avid does not promise a profit and does not guarantee principal or return. Given its
            roots in financing, however, it has taken only a small step towards real business
            activity. Despite all the risks described, investing through Avid does not mean
            entering the turbulent world of running a business. Rather than investing directly in
            risky operations, we place capital in the part of a project that serves as its safety
            margin, so that the main operating risk does not fall on the investor. Risk is not zero,
            but it is very different from the risk of running a business directly.
          </p>
          <p className="text-muted-foreground">
            For example, under a forward-purchase contract the investor buys goods at a discount,
            and the seller must deliver them a few months later. If the price of the goods has
            fallen at delivery, the loss falls on the investor — though in an inflationary economy
            the risk of a price fall is small. In short: at Avid neither principal nor profit is
            guaranteed, but this does not mean taking on high risk.
          </p>
        </div>
      </Article>
    </div>
  );
}

/* ── 3. Contract texts ───────────────────────────────────────────────── */

const MURABAHA_RISKS = [
  {
    title: "1. Withdrawal risk",
    body: "Under this contract, the agent cannot be compelled from the outset — before the goods are bought — to purchase them once they have been obtained. The agent might therefore buy the goods for the investor and then not sell them to itself. In that case the goods belong to the investor.",
  },
  {
    title: "2. Loss-of-goods risk",
    body: "Between the agent buying the goods and selling them to itself, the goods could be destroyed. In that case, provided the agent has not been negligent, the loss falls on the owner of the goods — the investor.",
  },
] as const;

const SALAF_RISKS = [
  {
    title: "1. Price-fall risk",
    body: "The investor owns the goods. If their price has fallen by the due date, the loss falls on the investor.",
  },
  {
    title: "2. Risk of not selling at maturity",
    body: "The other risk of this contract is that the goods may not sell on the due date.",
  },
] as const;

const PARTNERSHIP_TYPES = [
  {
    title: "Full partnership",
    body: "Profit and loss are shared according to actual performance — for example, by capping the investor’s profit and allocating any surplus to the operator. Because the necessary infrastructure is still lacking, this contract is used less often at present; we are, however, working to make room for full partnership too.",
  },
  {
    title: "Preferred partnership",
    body: "When profit is distributed, the investor has priority. If there is a loss, however, it is first borne by the investor’s principal and only then by the operator.",
  },
] as const;

const PARTNERSHIP_RISKS = [
  {
    title: "1. Risk to principal and profit",
    body: "Under this contract the principal is more exposed to risk than under murabaha or salaf, and the profit is somewhat less certain — but in return there is the possibility of a higher profit.",
  },
  {
    title: "2. Fit with non-manufacturing activities",
    body: "For activities that do not produce goods — where the business provides services — this contract is preferable to the other two.",
  },
] as const;

export function EnContractsPanel() {
  return (
    <div className="space-y-12">
      <PanelIntro title="Contract texts">
        We choose the right type of contract based on the economic risks of each project and on the
        investor’s appetite for risk. Below are the three types of contract we use, and the risks of
        each.
      </PanelIntro>

      <Article title="1. Cash purchase and instalment sale of goods (murabaha)">
        <div className={prose}>
          <p className="text-muted-foreground">
            Under this contract, instead of paying cash directly, the investor buys the asset or raw
            material that is needed — such as steel or machinery — and sells it to the applicant in
            instalments at an agreed rate. The rate of return is close to fixed and predictable,
            because the business transaction is completed within a short period, say one week, and
            the profit is then known.
          </p>
          <p className="text-muted-foreground">
            For the investor’s convenience, the project works in practice like this: the investor
            first appoints the business as its agent to buy the goods for cash, out of the
            investor’s contribution, within a set period such as one week. Once the goods have been
            obtained, the agent sells them to itself on the instalment terms agreed in advance. In
            this way the business is financed and obtains the goods it needs, and the investor
            earns the expected profit.
          </p>
        </div>
        <h4 className="font-display text-[1.4rem] font-semibold text-navy">Risks of this contract</h4>
        <Points items={MURABAHA_RISKS} />
      </Article>

      <Article title="2. Forward purchase of goods and sale after delivery (salaf, with agency to sell)">
        <div className={prose}>
          <p className="text-muted-foreground">
            Under this contract, the investor pays cash today in order to receive goods in the
            future — say, six months later. The business gains access to the cash and can use it as
            it sees fit. The investor, meanwhile, has bought the goods at a discount: below today’s
            price, and possibly worth more in the months ahead. In this model the business, as the
            seller of the goods, usually also takes on selling them at maturity, and must try to
            sell them at a price that at least delivers the investor’s target profit.
          </p>
          <p className="text-muted-foreground">
            An important advantage of this contract is that the investor can benefit from future
            price rises. Under murabaha the profit rate is fixed from the outset and cannot change
            once the purchase and sale are complete; under a forward purchase, the investor can
            structure the contract so that a rise in the price of the goods brings a larger profit.
          </p>
        </div>
        <h4 className="font-display text-[1.4rem] font-semibold text-navy">Risks of this contract</h4>
        <Points items={SALAF_RISKS} />
      </Article>

      <Article title="3. Partnership contract (musharakah)">
        <div className={prose}>
          <p className="text-muted-foreground">
            Under this contract, both the investor and the operator contribute capital and share
            in the profit and the loss.
          </p>
        </div>
        <h4 className="font-display text-[1.4rem] font-semibold text-navy">Types of partnership</h4>
        <Points items={PARTNERSHIP_TYPES} />

        <h4 className="font-display text-[1.4rem] font-semibold text-navy">A worked example</h4>
        <ol className="max-w-[68ch] list-decimal space-y-3 ps-5 leading-relaxed text-muted-foreground marker:font-display marker:text-gold">
          <li>
            Suppose the investor contributes 1 billion Toman and expects a profit of about 40% over
            seven months — that is, for their 1 billion Toman to grow to 1.4 billion Toman by the end
            of the seventh month.
          </li>
          <li>
            Suppose the business must also contribute 1 billion Toman under this contract, so the
            two parties contribute 2 billion Toman in total.
          </li>
          <li>
            When the business activity ends, profit up to 400 million Toman — equivalent to 20% of
            the total — belongs to the investor, and any profit beyond that, however large, belongs
            to the business.
          </li>
          <li>
            If the project’s total profit after seven months is less than 400 million Toman, all of
            it belongs to the investor and the business takes no profit.
          </li>
          <li>
            If there is a loss of principal, losses up to 1 billion Toman are borne by the
            business’s contribution, and anything beyond that falls on the investor’s contribution.
          </li>
        </ol>

        <h4 className="font-display text-[1.4rem] font-semibold text-navy">Risks of this contract</h4>
        <Points items={PARTNERSHIP_RISKS} />
      </Article>

      <section className="border border-dashed border-border px-6 py-6">
        <h3 className="text-2xl text-navy">Download sample contracts</h3>
        <p className="mt-2 max-w-[68ch] text-muted-foreground">
          Sample murabaha, salaf and musharakah contracts will soon be available here to read and
          download.
        </p>
      </section>
    </div>
  );
}
