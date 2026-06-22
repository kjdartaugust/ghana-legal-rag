import Link from "next/link";
import { Logo } from "./components/Logo";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Grounded in law",
    desc: "Every answer cites the exact Act and section number — no guessing, no hallucination.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "3 official documents",
    desc: "Covers the 1992 Constitution, Companies Act 2019, and Labour Act 2003.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Instant answers",
    desc: "Get clear, plain-language explanations in seconds — no legal jargon.",
  },
];

const SAMPLE_QUESTIONS = [
  "What's the minimum wage in Ghana?",
  "How do I register a company?",
  "What are my rights if I'm arrested?",
  "How many days of annual leave am I entitled to?",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/chat"
              className="text-sm font-semibold bg-[#071e4a] text-white px-5 py-2.5 rounded-xl hover:bg-[#0d3875] transition-all shadow-sm hover:shadow-md"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-20 pb-24 px-6">

          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/40 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 border border-amber-200/80 shadow-sm">
              🇬🇭 Powered by official Ghanaian legal documents
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-[#071e4a] leading-[1.1] tracking-tight">
              Get instant, cited answers to{" "}
              <span className="relative">
                <span className="text-[#1a4a8a]">Ghanaian legal</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                  <path d="M2 6 Q75 2 150 5 Q225 8 298 4" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </span>{" "}
              questions
            </h1>

            <p className="mt-7 text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
              Ask about your rights, employment, or how to start a business —
              and get answers backed by the exact text of Ghanaian law.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                href="/chat"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#071e4a] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#0d3875] transition-all shadow-md hover:shadow-lg"
              >
                Start Chatting
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Sign in
              </Link>
            </div>

            {/* Sample question pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <span
                  key={q}
                  className="bg-white text-slate-600 text-xs font-medium px-4 py-2 rounded-full border border-slate-200 shadow-sm"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-12">
              Why GhanaLaw AI
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group bg-white border border-slate-100 rounded-2xl p-7 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-11 h-11 bg-navy-50 text-[#1a4a8a] rounded-xl flex items-center justify-center mb-5">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-[#071e4a] mb-2 text-base">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="py-16 px-6 bg-[#071e4a]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to get legal clarity?
            </h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Join users who use GhanaLaw AI to understand their rights and navigate Ghanaian law confidently.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 bg-amber-400 text-[#071e4a] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors shadow-lg"
            >
              Start for free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <Logo size="sm" />
          <p>Not legal advice — for informational purposes only. © {new Date().getFullYear()} GhanaLaw AI</p>
        </div>
      </footer>

    </div>
  );
}
