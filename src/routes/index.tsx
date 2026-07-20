import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Solutions } from "@/components/site/Solutions";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Products } from "@/components/site/Products";
import { Trust } from "@/components/site/Trust";
import { Profile } from "@/components/site/Profile";
import { Brands } from "@/components/site/Brands";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { getRequestOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const origin = await getRequestOrigin();
    return { origin };
  },
  head: ({ loaderData }) => {
    const origin = loaderData?.origin ?? "https://evertechcorp.com";
    return {
      meta: [
        { title: "Evertech Corporation — Enterprise IT Solutions, Networking & Surveillance" },
        { name: "description", content: "Trusted enterprise IT vendor since 2001. Official Dell & Lenovo partner delivering infrastructure, networking, IP surveillance and corporate hardware procurement across Pakistan." },
        { property: "og:title", content: "Evertech Corporation — Enterprise IT Solutions" },
        { property: "og:description", content: "Enterprise infrastructure, networking, surveillance and corporate hardware supply. Request a quotation today." },
        { property: "og:image", content: `${origin}/og-image.png` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "640" },
        { property: "og:url", content: `${origin}/` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: `${origin}/og-image.png` },
      ],
      links: [{ rel: "canonical", href: `${origin}/` }],
    };
  },
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Solutions />
        <About />
        <Services />
        <Products />
        <Trust />
        <Profile />
        <Brands />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
