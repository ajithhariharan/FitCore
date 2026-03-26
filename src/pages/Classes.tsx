import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar as CalendarIcon, Clock, Users, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MOCK_CLASSES = [
  { id: 1, name: 'Morning HIIT', trainer: 'Sarah Smith', time: '06:00 AM', duration: '45 min', capacity: 20, enrolled: 15, type: 'HIIT' },
  { id: 2, name: 'Power Yoga', trainer: 'Alex Johnson', time: '08:00 AM', duration: '60 min', capacity: 15, enrolled: 15, type: 'Yoga' },
  { id: 3, name: 'CrossFit WOD', trainer: 'Mike Brown', time: '05:30 PM', duration: '60 min', capacity: 25, enrolled: 12, type: 'CrossFit' },
  { id: 4, name: 'Strength Training', trainer: 'Sarah Smith', time: '07:00 PM', duration: '60 min', capacity: 12, enrolled: 8, type: 'Strength' },
];

export function Classes() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState(MOCK_CLASSES);

  const handleBook = (id: number) => {
    setClasses(classes.map(c => {
      if (c.id === id && c.enrolled < c.capacity) {
        return { ...c, enrolled: c.enrolled + 1 };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Book and manage fitness classes.</p>
        </div>
        {(profile?.role === 'admin' || profile?.role === 'trainer') && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">{c.type}</Badge>
                <Badge variant={c.enrolled >= c.capacity ? "destructive" : "secondary"}>
                  {c.enrolled}/{c.capacity}
                </Badge>
              </div>
              <CardTitle>{c.name}</CardTitle>
              <CardDescription>with {c.trainer}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {c.time} ({c.duration})
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Today
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {c.capacity - c.enrolled} spots left
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              {profile?.role === 'member' ? (
                <Button 
                  className="w-full" 
                  disabled={c.enrolled >= c.capacity}
                  onClick={() => handleBook(c.id)}
                >
                  {c.enrolled >= c.capacity ? 'Waitlist' : 'Book Class'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Edit</Button>
                  <Button variant="secondary" className="flex-1">View Roster</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
