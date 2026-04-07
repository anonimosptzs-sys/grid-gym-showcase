import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Básico",
    price: "89,90",
    period: "/mês",
    features: [
      "Acesso à musculação",
      "Área de cardio",
      "Vestiário com chuveiro",
      "Estacionamento",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "129,90",
    period: "/mês",
    features: [
      "Tudo do plano Básico",
      "Todas as modalidades",
      "Avaliação física mensal",
      "Treino personalizado",
      "Espaço Kids",
    ],
    highlighted: true,
  },
  {
    name: "Black",
    price: "169,90",
    period: "/mês",
    features: [
      "Tudo do plano Premium",
      "Personal trainer incluso",
      "Acesso 24h",
      "Nutricionista online",
      "Armário exclusivo",
      "Prioridade em horários",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="planos" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl md:text-5xl font-bold text-center mb-4"
        >
          NOSSOS <span className="text-gradient">PLANOS</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-center max-w-xl mx-auto mb-16"
        >
          Escolha o plano ideal para alcançar seus objetivos
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-xl p-8 flex flex-col border transition-colors ${
                plan.highlighted
                  ? "border-primary bg-card scale-[1.03] shadow-[0_0_40px_-12px_hsl(var(--primary)/0.3)]"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Mais Popular
                </span>
              )}

              <h3 className="font-heading text-2xl font-bold mb-2">{plan.name}</h3>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className="font-heading text-5xl font-bold text-primary">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/5547991700039"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-md font-medium h-11 px-8 text-sm transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                Começar Agora
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
