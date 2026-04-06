import { MapPin, Phone, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contato" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-16">
          VENHA <span className="text-gradient">NOS VISITAR</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1">Endereço</h3>
                <p className="text-muted-foreground">R. XV de Novembro, 5992 - Vila Nova, Joinville - SC, 89237-000</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1">Telefone</h3>
                <a href="tel:+5547991700039" className="text-muted-foreground hover:text-primary transition-colors">
                  (47) 99170-0039
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-lg font-semibold mb-1">Horário</h3>
                <p className="text-muted-foreground">Segunda a Sábado · Até 00:00</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border h-72 md:h-auto">
            <iframe
              title="Localização Academia GRID"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.5!2d-48.845!3d-26.305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE4JzE4LjAiUyA0OMKwNTAnNDIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 288 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
