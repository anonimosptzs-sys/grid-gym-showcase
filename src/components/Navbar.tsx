import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Estrutura", href: "#estrutura" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="font-heading text-2xl font-bold">
          <span className="text-gradient">GRID</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5547991700039"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground font-heading font-semibold px-5 py-2 rounded-lg text-sm hover:brightness-110 transition-all"
          >
            MATRICULE-SE
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5547991700039"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-primary text-primary-foreground font-heading font-semibold px-5 py-2 rounded-lg text-sm text-center"
          >
            MATRICULE-SE
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
