import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dumbbell, Loader2 } from "lucide-react";

interface WorkoutExercise {
  id: string;
  exercise_name: string;
  sets: number;
  reps: string;
  weight: string | null;
  rest_seconds: number | null;
  notes: string | null;
  order_index: number;
}

interface Workout {
  id: string;
  title: string;
  description: string | null;
  active: boolean;
  exercises: WorkoutExercise[];
}

const AlunoDashboard = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      // First find the student record linked to this user
      const { data: studentData } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!studentData) {
        setLoading(false);
        return;
      }

      const { data: workoutsData } = await supabase
        .from("workouts")
        .select("*")
        .eq("student_id", studentData.id)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!workoutsData || workoutsData.length === 0) {
        setLoading(false);
        return;
      }

      const workoutIds = workoutsData.map((w) => w.id);
      const { data: exercisesData } = await supabase
        .from("workout_exercises")
        .select("*")
        .in("workout_id", workoutIds)
        .order("order_index");

      const result: Workout[] = workoutsData.map((w) => ({
        ...w,
        exercises: (exercisesData || []).filter((e) => e.workout_id === w.id),
      }));

      setWorkouts(result);
      setLoading(false);
    };

    fetchWorkouts();
  }, [user]);

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
        <Dumbbell className="w-7 h-7 text-primary" /> Meus Treinos
      </h1>

      {workouts.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum treino disponível ainda.</p>
          <p className="text-sm text-muted-foreground mt-1">Seu professor irá montar seu treino em breve!</p>
        </div>
      ) : (
        workouts.map((w) => (
          <div key={w.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="bg-primary/10 px-6 py-4 border-b border-border">
              <h2 className="font-heading text-xl font-bold text-primary">{w.title}</h2>
              {w.description && <p className="text-sm text-muted-foreground mt-1">{w.description}</p>}
            </div>
            <div className="divide-y divide-border">
              {w.exercises.map((ex, i) => (
                <div key={ex.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="text-primary font-heading font-bold text-lg w-8">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium">{ex.exercise_name}</p>
                    {ex.notes && <p className="text-xs text-muted-foreground mt-0.5">{ex.notes}</p>}
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span><strong className="text-foreground">{ex.sets}</strong> séries</span>
                    <span><strong className="text-foreground">{ex.reps}</strong> reps</span>
                    {ex.weight && <span><strong className="text-foreground">{ex.weight}</strong></span>}
                    {ex.rest_seconds && <span>{ex.rest_seconds}s desc.</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AlunoDashboard;
