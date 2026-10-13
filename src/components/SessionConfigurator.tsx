import { SessionConfig } from "@/lib/scheduling";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  config: SessionConfig;
  onChange: (config: SessionConfig) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min;

export function SessionConfigurator({ config, onChange }: Props) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="sessionCount">Nombre de séances</Label>
        <Input
          id="sessionCount"
          type="number"
          min={1}
          max={20}
          value={config.sessionCount}
          onChange={(e) => onChange({ ...config, sessionCount: clamp(+e.target.value, 1, 20) })}
        />
      </div>
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="hoursPerSession">Heures / séance</Label>
        <Input
          id="hoursPerSession"
          type="number"
          min={1}
          max={4}
          value={config.hoursPerSession}
          onChange={(e) => onChange({ ...config, hoursPerSession: clamp(+e.target.value, 1, 4) })}
        />
      </div>
    </div>
  );
}
