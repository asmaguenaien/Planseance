import { useState, useMemo } from "react";
import { TimetableGrid } from "@/components/TimetableGrid";
import { SessionConfigurator } from "@/components/SessionConfigurator";
import { AvailableSlots } from "@/components/AvailableSlots";
import {
  Person,
  TimeSlot,
  SessionConfig,
  findAvailableSlots,
  generateId,
} from "@/lib/scheduling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  UserPlus,
  Trash2,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";

const Index = () => {
  const [professor, setProfessor] = useState<Person>({
    id: "prof",
    name: "Professeur",
    busySlots: [],
  });

  const [students, setStudents] = useState<Person[]>([
    { id: generateId(), name: "Étudiant 1", busySlots: [] },
  ]);

  const [config, setConfig] = useState<SessionConfig>({
    sessionCount: 3,
    hoursPerSession: 2,
  });

  const [step, setStep] = useState(0); // 0: prof, 1: students, 2: config+results

  const availableSlots = useMemo(
    () => findAvailableSlots(professor, students, config),
    [professor, students, config]
  );

  const addStudent = () => {
    setStudents((prev) => [
      ...prev,
      { id: generateId(), name: `Étudiant ${prev.length + 1}`, busySlots: [] },
    ]);
  };

  const removeStudent = (id: string) => {
    if (students.length > 1) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const updateStudentSlots = (id: string, slots: TimeSlot[]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, busySlots: slots } : s))
    );
  };

  const updateStudentName = (id: string, name: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  const steps = [
    { label: "Professeur", icon: GraduationCap },
    { label: "Étudiants", icon: Users },
    { label: "Résultats", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">PlanSeance</h1>
            <p className="text-xs text-muted-foreground">Planification intelligente</p>
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-1">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  step === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pb-8 space-y-4">
        {step === 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Emploi du temps du professeur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableGrid
                label="Marquez vos heures occupées"
                busySlots={professor.busySlots}
                onSlotsChange={(slots) => setProfessor((p) => ({ ...p, busySlots: slots }))}
              />
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setStep(1)}>
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <>
            {students.map((student) => (
              <Card key={student.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={student.name}
                      onChange={(e) => updateStudentName(student.id, e.target.value)}
                      className="h-8 text-sm font-semibold border-none shadow-none px-0 focus-visible:ring-0"
                    />
                    {students.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeStudent(student.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <TimetableGrid
                    label="Heures occupées"
                    busySlots={student.busySlots}
                    onSlotsChange={(slots) => updateStudentSlots(student.id, slots)}
                  />
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={addStudent}>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un étudiant
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
                Retour
              </Button>
              <Button className="flex-1" onClick={() => setStep(2)}>
                Calculer
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Paramètres des séances</CardTitle>
              </CardHeader>
              <CardContent>
                <SessionConfigurator config={config} onChange={setConfig} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Créneaux disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AvailableSlots slots={availableSlots} config={config} />
              </CardContent>
            </Card>
            <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
              Retour
            </Button>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
