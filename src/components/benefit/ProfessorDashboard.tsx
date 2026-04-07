import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dumbbell, Plus, Loader2, Trash2 } from "lucide-react";

interface Student {
  id: string;
  full_name: string;
}

interface ExerciseInput {
  exercise_name: string;
  sets: number;
  reps: string;
  weight: string;
  rest_seconds: number;
  notes: string;
}

const emptyExercise = (): ExerciseInput => ({
  exercise_name: "",
  sets: 3,
  reps: "12",
  weight: "",
  rest_seconds: 60,
  notes: "",
});

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workoutDesc, setWorkoutDesc] = useState("");
  const [exercises, setExercises] = useState<ExerciseInput[]>([emptyExercise()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("students")
      .select("id, full_name")
      .eq("active", true)
      .order("full_name")
      .then(({ data }) => {
        setStudents((data as Student[]) || []);
        setLoading(false);
      });
  }, []);

  const addExercise = () => setExercises([...exercises, emptyExercise()]);

  const removeExercise = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const updateExercise = (idx: number, field: keyof ExerciseInput, value: string | number) => {
    const updated = [...exercises];
    (updated[idx] as any)[field] = value;
    setExercises(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !workoutTitle || exercises.length === 0) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSaving(true);

    const { data: workout, error } = await supabase
      .from("workouts")
      .insert({
        student_id: selectedStudent,
        professor_id: user!.id,
        title: workoutTitle,
        description: workoutDesc || null,
      })
      .select("id")
      .single();

    if (error || !workout) {
      toast.error("Erro ao criar treino: " + (error?.message || ""));
      setSaving(false);
      return;
    }

    const exerciseRows = exercises.map((ex, i) => ({
      workout_id: workout.id,
      exercise_name: ex.exercise_name,
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight || null,
      rest_seconds: ex.rest_seconds,
      notes: ex.notes || null,
      order_index: i,
    }));

    const { error: exError } = await supabase.from("workout_exercises").insert(exerciseRows);

    if (exError) {
      toast.error("Treino criado mas erro nos exercícios: " + exError.message);
    } else {
      toast.success("Treino montado com sucesso!");
      setWorkoutTitle("");
      setWorkoutDesc("");
      setExercises([emptyExercise()]);
      setSelectedStudent("");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
        <Dumbbell className="w-7 h-7 text-primary" /> Montar Treino
      </h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Aluno</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Selecione um aluno...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Título do Treino</label>
              <Input value={workoutTitle} onChange={(e) => setWorkoutTitle(e.target.value)} placeholder="Ex: Treino A - Peito e Tríceps" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              value={workoutDesc}
              onChange={(e) => setWorkoutDesc(e.target.value)}
              placeholder="Observações gerais do treino..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold">Exercícios</h2>
            <Button type="button" variant="outline" size="sm" onClick={addExercise}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </div>

          {exercises.map((ex, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">Exercício {i + 1}</span>
                {exercises.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeExercise(i)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs text-muted-foreground">Nome</label>
                  <Input value={ex.exercise_name} onChange={(e) => updateExercise(i, "exercise_name", e.target.value)} placeholder="Supino reto" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Séries</label>
                  <Input type="number" value={ex.sets} onChange={(e) => updateExercise(i, "sets", parseInt(e.target.value) || 0)} min={1} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Reps</label>
                  <Input value={ex.reps} onChange={(e) => updateExercise(i, "reps", e.target.value)} placeholder="12" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Peso</label>
                  <Input value={ex.weight} onChange={(e) => updateExercise(i, "weight", e.target.value)} placeholder="20kg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Treino"}
        </Button>
      </form>
    </div>
  );
};

export default ProfessorDashboard;
