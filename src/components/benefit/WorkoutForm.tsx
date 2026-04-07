import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2 } from "lucide-react";

export interface ExerciseInput {
  exercise_name: string;
  sets: number;
  reps: string;
  weight: string;
  rest_seconds: number;
  notes: string;
}

export const emptyExercise = (): ExerciseInput => ({
  exercise_name: "",
  sets: 3,
  reps: "12",
  weight: "",
  rest_seconds: 60,
  notes: "",
});

interface Student {
  id: string;
  full_name: string;
}

interface WorkoutFormProps {
  students: Student[];
  initialStudent?: string;
  initialTitle?: string;
  initialDesc?: string;
  initialExercises?: ExerciseInput[];
  saving: boolean;
  onSubmit: (data: {
    studentId: string;
    title: string;
    description: string;
    exercises: ExerciseInput[];
  }) => void;
  onCancel?: () => void;
  submitLabel?: string;
  disableStudentSelect?: boolean;
}

const WorkoutForm = ({
  students,
  initialStudent = "",
  initialTitle = "",
  initialDesc = "",
  initialExercises,
  saving,
  onSubmit,
  onCancel,
  submitLabel = "Salvar Treino",
  disableStudentSelect = false,
}: WorkoutFormProps) => {
  const [selectedStudent, setSelectedStudent] = useState(initialStudent);
  const [workoutTitle, setWorkoutTitle] = useState(initialTitle);
  const [workoutDesc, setWorkoutDesc] = useState(initialDesc);
  const [exercises, setExercises] = useState<ExerciseInput[]>(
    initialExercises || [emptyExercise()]
  );

  const addExercise = () => setExercises([...exercises, emptyExercise()]);
  const removeExercise = (idx: number) =>
    setExercises(exercises.filter((_, i) => i !== idx));
  const updateExercise = (
    idx: number,
    field: keyof ExerciseInput,
    value: string | number
  ) => {
    const updated = [...exercises];
    (updated[idx] as any)[field] = value;
    setExercises(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      studentId: selectedStudent,
      title: workoutTitle,
      description: workoutDesc,
      exercises,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Aluno</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
              disabled={disableStudentSelect}
            >
              <option value="">Selecione um aluno...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Título do Treino</label>
            <Input
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
              placeholder="Ex: Treino A - Peito e Tríceps"
              required
            />
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
              <span className="text-sm font-medium text-primary">
                Exercício {i + 1}
              </span>
              {exercises.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExercise(i)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-muted-foreground">Nome</label>
                <Input
                  value={ex.exercise_name}
                  onChange={(e) => updateExercise(i, "exercise_name", e.target.value)}
                  placeholder="Supino reto"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Séries</label>
                <Input
                  type="number"
                  value={ex.sets}
                  onChange={(e) =>
                    updateExercise(i, "sets", parseInt(e.target.value) || 0)
                  }
                  min={1}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Reps</label>
                <Input
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, "reps", e.target.value)}
                  placeholder="12"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Peso</label>
                <Input
                  value={ex.weight}
                  onChange={(e) => updateExercise(i, "weight", e.target.value)}
                  placeholder="20kg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default WorkoutForm;
