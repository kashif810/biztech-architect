import { Mail, MessageCircle, MapPin } from "lucide-react";
import logo from "@/assets/evertech-logo.png";

export function Footer() {
  return (
    <footer className="bg-[var(--navy-deep)] text-white/80 border-t border-white/10">
      <div className="container-x py-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Evertech" className="h-10 w-10" />
            <div>
              <div className="text-white font-display font-bold">EVERTECH CORPORATION</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Enterprise IT Solutions</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/60 max-w-sm leading-relaxed">
            Founded in 2001 in Lahore. Official Dell and Lenovo partner delivering enterprise IT infrastructure, networking, surveillance and corporate hardware supply.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold">Solutions</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#solutions" className="hover:text-white">Infrastructure</a></li>
            <li><a href="#services" className="hover:text-white">Networking</a></li>
            <li><a href="#services" className="hover:text-white">Surveillance</a></li>
            <li><a href="#services" className="hover:text-white">IT Support / AMC</a></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#brands" className="hover:text-white">Brands</a></li>
            <li><a href="#profile" className="hover:text-white">Company Profile</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--steel)]" /> info@evertech.com.pk</li>
            <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-[var(--steel)]" /> WhatsApp on request</li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[var(--steel)]" /> Lahore, Pakistan</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Evertech Corporation. All rights reserved.</div>
          <div>Enterprise IT · Networking · Surveillance · Procurement</div>
        </div>
      </div>
    </footer>
  );
}