const Footer = () => (
  <footer className="border-t border-border py-8 px-4 text-center">
    <p className="font-heading text-lg font-bold text-gradient mb-2">ACADEMIA GRID</p>
    <p className="text-muted-foreground text-sm">
      R. XV de Novembro, 5992 - Vila Nova, Joinville - SC · (47) 99170-0039
    </p>
    <p className="text-muted-foreground text-xs mt-4">© {new Date().getFullYear()} Academia GRID. Todos os direitos reservados.</p>
  </footer>
);

export default Footer;
