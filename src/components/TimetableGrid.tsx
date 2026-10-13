import { Fragment, useState } from "react";
import { DAYS, HOURS, TimeSlot, Day, formatHour } from "@/lib/scheduling";
import { cn } from "@/lib/utils";

interface TimetableGridProps {
  busySlots: TimeSlot[];
  onSlotsChange: (slots: TimeSlot[]) => void;
  label: string;
}

export function TimetableGrid({ busySlots, onSlotsChange, label }: TimetableGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "remove">("add");

  const isSlotBusy = (day: Day, hour: number) =>
    busySlots.some((s) => s.day === day && s.startHour <= hour && s.endHour > hour);

  const toggleSlot = (day: Day, hour: number, forceMode?: "add" | "remove") => {
    const busy = isSlotBusy(day, hour);
    const mode = forceMode ?? (busy ? "remove" : "add");

    if (mode === "add" && !busy) {
      onSlotsChange([...busySlots, { day, startHour: hour, endHour: hour + 1 }]);
    } else if (mode === "remove" && busy) {
      onSlotsChange(
        busySlots.filter((s) => !(s.day === day && s.startHour <= hour && s.endHour > hour))
      );
    }
  };

  const handlePointerDown = (day: Day, hour: number) => {
    const busy = isSlotBusy(day, hour);
    const mode = busy ? "remove" : "add";
    setDragMode(mode);
    setIsDragging(true);
    toggleSlot(day, hour, mode);
  };

  const handlePointerEnter = (day: Day, hour: number) => {
    if (isDragging) {
      toggleSlot(day, hour, dragMode);
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  return (
    <div className="select-none" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <div className="overflow-x-auto">
        <div className="grid gap-px min-w-[400px]" style={{ gridTemplateColumns: `48px repeat(${DAYS.length}, 1fr)` }}>
          {/* Header */}
          <div />
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-foreground py-1.5 bg-muted rounded-t-md">
              {day.slice(0, 3)}
            </div>
          ))}
          {/* Grid */}
          {HOURS.map((hour) => (
            <Fragment key={`row-${hour}`}>
              <div className="text-xs text-muted-foreground text-right pr-2 py-1">
                {formatHour(hour)}
              </div>
              {DAYS.map((day) => {
                const busy = isSlotBusy(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={cn(
                      "h-7 border border-border/50 rounded-sm cursor-pointer transition-colors touch-none",
                      busy ? "bg-destructive/80" : "bg-card hover:bg-primary/10"
                    )}
                    onPointerDown={() => handlePointerDown(day, hour)}
                    onPointerEnter={() => handlePointerEnter(day, hour)}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        Cliquez ou glissez pour marquer les heures <span className="font-semibold text-destructive">occupées</span>
      </p>
    </div>
  );
}
