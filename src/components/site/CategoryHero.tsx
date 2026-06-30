import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  tagline: string;
  image: string;
  breadcrumb: { label: string; to: string }[];
};

export function CategoryHero({ eyebrow, title, tagline, image, breadcrumb }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--navy-deep)] text-white">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-deep)] via-[var(--navy-deep)]/85 to-[var(--navy-deep)]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-transparent to-transparent" />

      <div className="relative container-x pt-36 md:pt-44 pb-20 md:pb-28">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-white/60">
          {breadcrumb.map((b, i) => (
            <span key={b.to} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {i < breadcrumb.length - 1 ? (
                <Link to={b.to} className="hover:text-white transition-colors">{b.label}</Link>
              ) : (
                <span className="text-white">{b.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-6 max-w-3xl">
          <span className="eyebrow text-white/70">
            <span className="h-px w-8 bg-[var(--steel)]" /> {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            {title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
            {tagline}
          </p>
        </div>
      </div>
    </section>
  );
}