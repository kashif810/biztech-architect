import { Download, FileText } from "lucide-react";
import profile from "@/assets/company-profile.pdf.asset.json";

export function Profile() {
  return (
    <section id="profile" className="bg-[var(--surface)] py-24 md:py-32">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-sm bg-[var(--navy-deep)] text-white p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[var(--steel)]/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-20 h-72 w-72 rounded-full bg-[var(--steel)]/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="eyebrow text-white/70"><span className="h-px w-8 bg-[var(--steel)]" /> Company Profile</span>
              <h2 className="mt-5 text-3xl md:text-5xl font-bold leading-tight">
                The full Evertech capability brief — in one PDF.
              </h2>
              <p className="mt-5 text-white/70 max-w-xl">
                Download our official company profile for a complete overview of services, products, partnerships and project credentials. Share it with your procurement and IT teams.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={profile.url}
                  download
                  className="inline-flex items-center gap-2 rounded-sm bg-[var(--steel)] px-6 py-3.5 text-sm font-semibold text-white hover:brightness-110 transition"
                >
                  <Download className="h-4 w-4" /> Download Profile (PDF)
                </a>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  View Online
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm aspect-[3/4] bg-white text-[var(--navy-deep)] shadow-2xl rounded-sm p-8 flex flex-col">
                <FileText className="h-8 w-8 text-[var(--steel)]" />
                <div className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">Document</div>
                <div className="mt-1 text-2xl font-bold font-display leading-tight">Evertech Corporation</div>
                <div className="text-sm text-muted-foreground">Company Profile · 2025</div>
                <div className="mt-auto pt-6 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
                  <span>PDF · {(profile.size / 1024 / 1024).toFixed(1)} MB</span>
                  <span className="text-[var(--steel)] font-semibold">CONFIDENTIAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}