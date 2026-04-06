import heroImg from "@/assets/hero-gym.jpg";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Interior da Academia GRID"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight mb-4">
          ACADEMIA <span className="text-gradient">GRID</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Centro de Treinamento em Joinville com estrutura completa, equipamentos de última geração e profissionais capacitados.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://wa.me/5547991700039"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-heading text-lg font-semibold px-8 py-4 rounded-lg hover:brightness-110 transition-all"
          >
            <Phone className="w-5 h-5" />
            FALE CONOSCO
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 flex items-center justify-center gap-2"
        >
          <span className="text-primary text-4xl font-heading font-bold">4,9</span>
          <div className="flex text-primary">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xl">★</span>
            ))}
          </div>
          <span className="text-muted-foreground text-sm">(516 avaliações)</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
