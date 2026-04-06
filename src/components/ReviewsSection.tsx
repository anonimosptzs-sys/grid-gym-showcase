import { motion } from "framer-motion";

const reviews = [
  { name: "Jairo Alves Ferreira", text: "Lugar Top, equipamentos de primeira e a equipe um Show!!!!" },
  { name: "David", text: "Academia Top Boa infraestrutura, tem bons instrutores, a organização é top." },
  { name: "Robson Moretti", text: "O ambiente, os profissionais, tudo proporciona uma experiência única." },
];

const ReviewsSection = () => {
  return (
    <section id="avaliacoes" className="py-20 px-4 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl md:text-5xl font-bold text-center mb-4"
        >
          O QUE DIZEM <span className="text-gradient">NOSSOS ALUNOS</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-16"
        >
          <div className="flex text-primary text-xl">★★★★★</div>
          <span className="text-foreground font-heading text-2xl font-bold">4,9</span>
          <span className="text-muted-foreground text-sm">/ 516 avaliações no Google</span>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex text-primary text-sm mb-3">★★★★★</div>
              <p className="text-foreground mb-4 italic">"{r.text}"</p>
              <p className="text-muted-foreground text-sm font-semibold">— {r.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
