"use client";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="bg-white p-6 md:p-8">
          <h1 className="font-serif italic text-[28px] md:text-[32px] text-[#1a1816] mb-2 text-center">
            Admin
          </h1>
          <p className="text-[11px] tracking-[.14em] uppercase text-[#9a9188] mb-8 text-center">
            Quick access tools
          </p>

          <div className="space-y-4">
            <a
              href="/studio-payment"
              className="block w-full px-6 py-4 bg-[#1a1816] text-white text-[12px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors text-center"
            >
              Studio Payment
            </a>

            <a
              href="/"
              className="block w-full px-6 py-4 bg-transparent text-[#1a1816] text-[12px] tracking-[.18em] uppercase border border-black/20 hover:border-[#1a1816] transition-colors text-center"
            >
              Return to Website
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
