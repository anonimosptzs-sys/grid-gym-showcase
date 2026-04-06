import { Dumbbell, Heart, Car, Utensils, Baby, Accessibility } from "lucide-react";

const features = [
  { icon: Dumbbell, title: "+90 Máquinas", desc: "Equipamentos de última geração para seu treino" },
  { icon: Dumbbell, title: "Halteres até 60kg", desc: "Área completa de pesos livres" },
  { icon: Heart, title: "Área Cardio", desc: "Esteiras, bikes, elíptico e simuladores de escada" },
  { icon: Utensils, title: "Espaço Refeições", desc: "Área dedicada para suas refeições" },
  { icon: Car, title: "Estacionamento", desc: "Amplo estacionamento na frente e nos fundos" },
  { icon: Baby, title: "Espaço Kids", desc: "Ambiente seguro para seus filhos" },
  { icon: Accessibility, title: "Acessibilidade", desc: "Estrutura completa para cadeirantes" },
];

const FeaturesSection = () => {
  return (
    <section id="estrutura" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-4">
          NOSSA <span className="text-gradient">ESTRUTURA</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Tudo que você precisa para alcançar seus objetivos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
            >
              <f.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
