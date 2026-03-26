import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

const MOCK_WORKOUT = {
  id: 'w1',
  name: 'Hypertrophy Phase 1',
  trainer: 'Alex Johnson',
  days: [
    {
      name: 'Day 1: Push',
      exercises: [
        { id: 'e1', name: 'Barbell Bench Press', sets: 4, reps: '8-10', weight: '135 lbs', completed: false },
        { id: 'e2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '50 lbs', completed: false },
        { id: 'e3', name: 'Overhead Press', sets: 3, reps: '8-10', weight: '95 lbs', completed: false },
        { id: 'e4', name: 'Tricep Pushdowns', sets: 3, reps: '12-15', weight: '40 lbs', completed: false },
      ]
    },
    {
      name: 'Day 2: Pull',
      exercises: [
        { id: 'e5', name: 'Deadlift', sets: 4, reps: '5-8', weight: '225 lbs', completed: false },
        { id: 'e6', name: 'Pull-ups', sets: 3, reps: 'AMRAP', weight: 'Bodyweight', completed: false },
        { id: 'e7', name: 'Barbell Rows', sets: 3, reps: '8-10', weight: '135 lbs', completed: false },
        { id: 'e8', name: 'Bicep Curls', sets: 3, reps: '12-15', weight: '30 lbs', completed: false },
      ]
    }
  ]
};

export function WorkoutPlans() {
  const { profile } = useAuth();
  const [workout, setWorkout] = useState(MOCK_WORKOUT);

  const toggleExercise = (dayIndex: number, exerciseId: string) => {
    const newWorkout = { ...workout };
    const day = newWorkout.days[dayIndex];
    const exercise = day.exercises.find(e => e.id === exerciseId);
    if (exercise) {
      exercise.completed = !exercise.completed;
      setWorkout(newWorkout);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Plans</h1>
          <p className="text-muted-foreground">View and track your fitness progress.</p>
        </div>
        {profile?.role === 'trainer' && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{workout.name}</CardTitle>
          <CardDescription>Assigned by {workout.trainer}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {workout.days.map((day, dayIndex) => (
            <div key={day.name} className="space-y-4">
              <h3 className="text-lg font-semibold">{day.name}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {day.exercises.map((exercise) => (
                  <div 
                    key={exercise.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${exercise.completed ? 'bg-muted/50 border-primary/50' : 'bg-card'}`}
                  >
                    <div className="space-y-1">
                      <p className={`font-medium ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {exercise.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets x {exercise.reps} @ {exercise.weight}
                      </p>
                    </div>
                    {profile?.role === 'member' && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleExercise(dayIndex, exercise.id)}
                        className={exercise.completed ? 'text-primary' : 'text-muted-foreground'}
                      >
                        {exercise.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
