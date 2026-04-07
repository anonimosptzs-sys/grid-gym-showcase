import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, UserPlus, Loader2, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  role?: AppRole;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<AppRole>("aluno");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");

    const merged = (profiles || []).map((p) => ({
      id: p.user_id,
      email: p.email,
      full_name: p.full_name,
      role: roles?.find((r) => r.user_id === p.user_id)?.role,
    }));
    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const { data, error } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
      options: { data: { full_name: newName } },
    });

    if (error || !data.user) {
      toast.error(error?.message || "Erro ao criar usuário");
      setCreating(false);
      return;
    }

    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: data.user.id,
      role: newRole,
    });

    if (roleError) {
      toast.error("Usuário criado, mas erro ao definir role: " + roleError.message);
    } else {
      toast.success(`Usuário ${newName} criado como ${newRole}`);
    }

    setNewEmail("");
    setNewPassword("");
    setNewName("");
    setNewRole("aluno");
    setShowForm(false);
    setCreating(false);
    fetchUsers();
  };

  const handleDeleteRole = async (userId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (error) {
      toast.error("Erro ao remover role");
    } else {
      toast.success("Role removida");
      fetchUsers();
    }
  };

  const roleLabels: Record<string, string> = {
    admin: "ADM",
    professor: "Professor",
    funcionario: "Funcionário",
    aluno: "Aluno",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" /> Painel do Administrador
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateUser} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-heading text-lg font-bold">Cadastrar Novo Usuário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Nome completo" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            <Input type="email" placeholder="E-mail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            <Input type="password" placeholder="Senha (min 6)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as AppRole)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="admin">Administrador</option>
              <option value="professor">Professor</option>
              <option value="funcionario">Funcionário</option>
              <option value="aluno">Aluno</option>
            </select>
          </div>
          <Button type="submit" disabled={creating}>
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Usuário"}
          </Button>
        </form>
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
                <th className="text-left px-4 py-3 font-medium">E-mail</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium w-16">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20">
                  <td className="px-4 py-3">{u.full_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                      {u.role ? roleLabels[u.role] : "Sem role"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.role && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(u.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
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

export default AdminDashboard;
