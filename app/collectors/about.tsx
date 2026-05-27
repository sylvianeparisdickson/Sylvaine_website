import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
    title: "About — Sylviane Paris-Dickson",
    description: "About Sylviane Paris-Dickson, painter based in Minneapolis, Minnesota.",
};

export default function AboutPage() {
    return (
        <main>
            <Nav />

            <div className="min-h-screen flex flex-col justify-center px-6 md:px-14 page-top pb-16 md:pb-20">

                <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-6 md:mb-8">
                    About
                </span>

                <h1
                    className="font-serif italic font-light text-[#1a1816] leading-[.9] mb-10 md:mb-16"
                    style={{ fontSize: "clamp(36px, 7vw, 88px)" }}
                >
                    Sylviane<br />Paris-Dickson
                </h1>

                <div className="max-w-xl">
                    <div className="border-t border-black/10 pt-10">
                        <p
                            className="font-serif italic font-light text-[#6a6560] leading-[1.8]"
                            style={{ fontSize: "clamp(17px, 2vw, 22px)" }}
                        >
                            Painter · Minneapolis, Minnesota<br />
                            Northrup King Building · Studio 439
                        </p>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
