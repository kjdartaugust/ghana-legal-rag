import Link from "next/link";
import { Logo } from "./components/Logo";

const FEATURES = [
  {
    icon: "⚖️",
    title: "Grounded in law",
    desc: "Every answer cites the exact Act and section — no hallucination.",
  },
  {
    icon: "📄",
    title: "3 key documents",
    desc: "1992 Constitution, Companies Act 2019, and Labour Act 2003.",
  },
  {
    icon: "⚡",
    title: "Instant answers",
    desc: "Get clear, plain-language explanations in seconds.",
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
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/chat"
            className="text-sm bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-amber-200">
          🇬🇭 Powered by official Ghanaian legal documents
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Get instant, cited answers to{" "}
          <span className="text-blue-900">Ghanaian legal questions</span>
        </h1>

        <p className="mt-5 text-lg text-gray-500 max-w-xl leading-relaxed">
          Ask about your rights, employment, or how to start a business —
          and get answers backed by the exact text of Ghanaian law.
        </p>

        <div className="flex gap-3 mt-8">
          <Link
            href="/chat"
            className="bg-blue-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            Start Chatting
          </Link>
          <Link
            href="/sign-in"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Sample questions */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {SAMPLE_QUESTIONS.map((q) => (
            <span
              key={q}
              className="bg-gray-50 text-gray-600 text-sm px-4 py-2 rounded-full border border-gray-200"
            >
              {q}
            </span>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 max-w-3xl w-full text-left">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-4 text-center text-xs text-gray-400">
        Not legal advice — for informational purposes only. &nbsp;·&nbsp; ©{" "}
        {new Date().getFullYear()} GhanaLaw AI
      </footer>
    </div>
  );
}
