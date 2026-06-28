const brands = ["Dell", "Lenovo", "HP", "Microsoft", "Cisco", "Fortinet", "Hikvision", "Dahua", "UNV", "TP-Link", "Ubiquiti", "Epson", "APC", "Logitech", "Plantronics", "Transcend"];

export function Brands() {
  return (
    <section id="brands" className="bg-[var(--navy-deep)] text-white py-20 md:py-24 border-t border-white/5">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow text-white/70"><span className="h-px w-8 bg-[var(--steel)]" /> Brands We Supply</span>
            <h2 className="mt-4 text-2xl md:text-4xl font-bold leading-tight">Authorized and trusted partners.</h2>
          </div>
          <p className="text-white/60 max-w-sm text-sm">Official partner status with Dell and Lenovo, plus authorized supply across leading enterprise brands.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-px bg-white/10 border border-white/10">
          {brands.map((b) => (
            <div key={b} className="bg-[var(--navy-deep)] flex items-center justify-center py-8 px-4 text-white/70 hover:text-white hover:bg-[var(--navy)] transition">
              <span className="font-display font-semibold text-base tracking-wide">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}