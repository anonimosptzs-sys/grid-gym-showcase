import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, UserPlus, MessageCircle, Loader2, Send } from "lucide-react";

interface Student {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  active: boolean;
}

const FuncionarioDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [billingStudent, setBillingStudent] = useState<Student | null>(null);
  const [billingMsg, setBillingMsg] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await supabase.from("students").select("*").order("full_name");
    setStudents((data as Student[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const { error } = await supabase.from("students").insert({
      full_name: name,
      phone: phone || null,
      email: email || null,
      created_by: user?.id,
    });
    if (error) {
      toast.error("Erro: " + error.message);
    } else {
      toast.success("Aluno cadastrado!");
      setName("");
      setPhone("");
      setEmail("");
      setShowForm(false);
      fetchStudents();
    }
    setCreating(false);
  };

  const handleSendBilling = async () => {
    if (!billingStudent || !billingMsg) return;

    // Save notification record
    await supabase.from("billing_notifications").insert({
      student_id: billingStudent.id,
      sent_by: user!.id,
      message: billingMsg,
      whatsapp_sent: true,
    });

    // Open WhatsApp
    const phoneClean = (billingStudent.phone || "").replace(/\D/g, "");
    const waUrl = `https://wa.me/55${phoneClean}?text=${encodeURIComponent(billingMsg)}`;
    window.open(waUrl, "_blank");

    toast.success("Cobrança enviada via WhatsApp!");
    setBillingStudent(null);
    setBillingMsg("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" /> Painel do Funcionário
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <UserPlus className="w-4 h-4 mr-2" /> Cadastrar Aluno
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAddStudent} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading text-lg font-bold">Novo Aluno</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input placeholder="Telefone (WhatsApp)" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" disabled={creating}>
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cadastrar"}
          </Button>
        </form>
      )}

      {/* Billing modal */}
      {billingStudent && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading text-lg font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Cobrar: {billingStudent.full_name}
          </h3>
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
            placeholder="Mensagem de cobrança..."
            value={billingMsg}
            onChange={(e) => setBillingMsg(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSendBilling} disabled={!billingMsg}>
              <Send className="w-4 h-4 mr-2" /> Enviar via WhatsApp
            </Button>
            <Button variant="outline" onClick={() => setBillingStudent(null)}>Cancelar</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">Telefone</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Cobrar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/20">
                  <td className="px-4 py-3">{s.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${s.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {s.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setBillingStudent(s);
                        setBillingMsg(`Olá ${s.full_name}! Passando para lembrar sobre o pagamento da mensalidade da Academia Benefit. Qualquer dúvida estamos à disposição! 💪`);
                      }}
                      disabled={!s.phone}
                    >
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FuncionarioDashboard;
