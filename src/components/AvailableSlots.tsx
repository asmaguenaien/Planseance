import { TimeSlot, formatHour, SessionConfig, selectSessions } from "@/lib/scheduling";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock } from "lucide-react";

interface Props {
  slots: TimeSlot[];
  config: SessionConfig;
}

export function AvailableSlots({ slots, config }: Props) {
  const slotsToShow = selectSessions(slots, config.sessionCount);

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CalendarCheck className="mx-auto h-10 w-10 mb-2 opacity-40" />
        <p className="font-medium">Aucun créneau disponible</p>
        <p className="text-sm">Ajustez les emplois du temps ou la durée des séances</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {slots.length} créneau{slots.length > 1 ? "x" : ""} possible{slots.length > 1 ? "s" : ""}
        </p>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          {slotsToShow.length} / {config.sessionCount} séances
        </Badge>
      </div>
      <div className="grid gap-2">
        {slotsToShow.map((slot, i) => (
          <div
            key={`${slot.day}-${slot.startHour}-${i}`}
            className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border shadow-sm"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">{slot.day}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatHour(slot.startHour)} – {formatHour(slot.endHour)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {slotsToShow.length < config.sessionCount && (
        <p className="text-xs text-muted-foreground text-center">
          Seulement {slotsToShow.length} séance{slotsToShow.length > 1 ? "s" : ""} possible{slotsToShow.length > 1 ? "s" : ""} sans chevauchement, sur {config.sessionCount} demandée{config.sessionCount > 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
}
