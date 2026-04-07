import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AdminDashboard from "@/components/benefit/AdminDashboard";
import ProfessorDashboard from "@/components/benefit/ProfessorDashboard";
import FuncionarioDashboard from "@/components/benefit/FuncionarioDashboard";
import AlunoDashboard from "@/components/benefit/AlunoDashboard";
import DashboardLayout from "@/components/benefit/DashboardLayout";

const BenefitDashboard = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/benefit/login" replace />;

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Seu acesso ainda não foi configurado. Contate o administrador.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {role === "admin" && <AdminDashboard />}
      {role === "professor" && <ProfessorDashboard />}
      {role === "funcionario" && <FuncionarioDashboard />}
      {role === "aluno" && <AlunoDashboard />}
    </DashboardLayout>
  );
};

export default BenefitDashboard;
