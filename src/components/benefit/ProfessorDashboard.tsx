import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dumbbell, Plus, Loader2, Edit, Power, PowerOff } from "lucide-react";
import WorkoutForm, { ExerciseInput, emptyExercise } from "./WorkoutForm";

interface Student {
  id: string;
  full_name: string;
}

interface WorkoutWithExercises {
  id: string;
  title: string;
  description: string | null;
  active: boolean;
  student_id: string;
  student_name?: string;
  created_at: string;
  exercises: ExerciseInput[];
}

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutWithExercises | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [studentsRes, workoutsRes] = await Promise.all([
      supabase.from("students").select("id, full_name").eq("active", true).order("full_name"),
      supabase.from("workouts").select("*").eq("professor_id", user!.id).order("created_at", { ascending: false }),
    ]);

    const studentsList = (studentsRes.data as Student[]) || [];
    setStudents(studentsList);

    const wData = workoutsRes.data || [];
    if (wData.length > 0) {
      const { data: exData } = await supabase
        .from("workout_exercises")
        .select("*")
        .in("workout_id", wData.map((w) => w.id))
        .order("order_index");

      const mapped: WorkoutWithExercises[] = wData.map((w) => ({
        id: w.id,
        title: w.title,
        description: w.description,
        active: w.active,
        student_id: w.student_id,
        student_name: studentsList.find((s) => s.id === w.student_id)?.full_name,
        created_at: w.created_at,
        exercises: (exData || [])
          .filter((e) => e.workout_id === w.id)
          .map((e) => ({
            exercise_name: e.exercise_name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight || "",
            rest_seconds: e.rest_seconds || 60,
            notes: e.notes || "",
          })),
      }));
      setWorkouts(mapped);
    } else {
      setWorkouts([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (data: { studentId: string; title: string; description: string; exercises: ExerciseInput[] }) => {
    if (!data.studentId || !data.title || data.exercises.length === 0) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSaving(true);
    const { data: workout, error } = await supabase
      .from("workouts")
      .insert({ student_id: data.studentId, professor_id: user!.id, title: data.title, description: data.description || null })
      .select("id")
      .single();

    if (error || !workout) {
      toast.error("Erro ao criar treino: " + (error?.message || ""));
      setSaving(false);
      return;
    }

    const rows = data.exercises.map((ex, i) => ({
      workout_id: workout.id, exercise_name: ex.exercise_name, sets: ex.sets,
      reps: ex.reps, weight: ex.weight || null, rest_seconds: ex.rest_seconds,
      notes: ex.notes || null, order_index: i,
    }));

    const { error: exError } = await supabase.from("workout_exercises").insert(rows);
    if (exError) toast.error("Treino criado mas erro nos exercícios: " + exError.message);
    else toast.success("Treino montado com sucesso!");

    setSaving(false);
    setView("list");
    fetchData();
  };

  const handleEdit = async (data: { studentId: string; title: string; description: string; exercises: ExerciseInput[] }) => {
    if (!editingWorkout) return;
    setSaving(true);

    const { error } = await supabase
      .from("workouts")
      .update({ title: data.title, description: data.description || null })
      .eq("id", editingWorkout.id);

    if (error) {
      toast.error("Erro ao atualizar treino: " + error.message);
      setSaving(false);
      return;
    }

    // Delete old exercises and insert new ones
    await supabase.from("workout_exercises").delete().eq("workout_id", editingWorkout.id);
    const rows = data.exercises.map((ex, i) => ({
      workout_id: editingWorkout.id, exercise_name: ex.exercise_name, sets: ex.sets,
      reps: ex.reps, weight: ex.weight || null, rest_seconds: ex.rest_seconds,
      notes: ex.notes || null, order_index: i,
    }));
    const { error: exError } = await supabase.from("workout_exercises").insert(rows);
    if (exError) toast.error("Erro nos exercícios: " + exError.message);
    else toast.success("Treino atualizado!");

    setSaving(false);
    setView("list");
    setEditingWorkout(null);
    fetchData();
  };

  const toggleActive = async (workout: WorkoutWithExercises) => {
    const newActive = !workout.active;
    const { error } = await supabase.from("workouts").update({ active: newActive }).eq("id", workout.id);
    if (error) toast.error("Erro: " + error.message);
    else {
      toast.success(newActive ? "Treino ativado" : "Treino desativado");
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (view === "create") {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Dumbbell className="w-7 h-7 text-primary" /> Novo Treino
        </h1>
        <WorkoutForm students={students} saving={saving} onSubmit={handleCreate} onCancel={() => setView("list")} />
      </div>
    );
  }

  if (view === "edit" && editingWorkout) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Edit className="w-7 h-7 text-primary" /> Editar Treino
        </h1>
        <WorkoutForm
          students={students}
          initialStudent={editingWorkout.student_id}
          initialTitle={editingWorkout.title}
          initialDesc={editingWorkout.description || ""}
          initialExercises={editingWorkout.exercises}
          saving={saving}
          onSubmit={handleEdit}
          onCancel={() => { setView("list"); setEditingWorkout(null); }}
          submitLabel="Atualizar Treino"
          disableStudentSelect
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
          <Dumbbell className="w-7 h-7 text-primary" /> Treinos
        </h1>
        <Button onClick={() => setView("create")}>
          <Plus className="w-4 h-4 mr-2" /> Novo Treino
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum treino criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((w) => (
            <div key={w.id} className={`bg-card border rounded-xl p-5 flex items-center justify-between gap-4 ${w.active ? "border-border" : "border-border opacity-60"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold truncate">{w.title}</h3>
                  {!w.active && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Inativo</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Aluno: {w.student_name || "—"} · {w.exercises.length} exercício(s)
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setEditingWorkout(w); setView("edit"); }}
                >
                  <Edit className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button
                  variant={w.active ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => toggleActive(w)}
                  title={w.active ? "Desativar" : "Ativar"}
                >
                  {w.active ? <PowerOff className="w-4 h-4 text-destructive" /> : <Power className="w-4 h-4 text-primary" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
