"use client";

import { useState } from "react";
import type { SmartHomeStep } from "@/lib/scenario-types";
import { Card, Badge } from "@/components/shared";
import { Home, Shield, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

interface SmartHomeMapProps {
  step: SmartHomeStep;
  onComplete: (score: number, maxScore: number) => void;
}

export function SmartHomeMap({ step, onComplete }: SmartHomeMapProps) {
  const [fixed, setFixed] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);

  const vulnerableDevices = step.devices.filter((d) => d.vulnerable);
  const allFixed = fixed.size >= vulnerableDevices.length;

  const handleFix = (idx: number) => {
    const device = step.devices[idx];
    if (!device.vulnerable || fixed.has(idx)) return;
    setFixed((prev) => new Set(prev).add(idx));
    setSelected(idx);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Home size={18} className="text-accent" />
        <h3 className="font-semibold text-sm">Найди уязвимости в умном доме</h3>
        <Badge variant="accent">{fixed.size}/{vulnerableDevices.length}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {step.devices.map((device, i) => {
          const isFixed = fixed.has(i);
          const isVulnerable = device.vulnerable;
          const isSelected = selected === i;

          return (
            <button
              key={i}
              onClick={() => isVulnerable ? handleFix(i) : setSelected(i)}
              className={`text-left p-3 rounded-card border transition-all ${
                isFixed
                  ? "bg-success/5 border-success/30"
                  : isVulnerable
                  ? "bg-error/5 border-error/30 hover:border-error cursor-pointer"
                  : "bg-card border-card-border"
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-1 relative inline-block">
                  {device.icon}
                  {isVulnerable && !isFixed && (
                    <span className="absolute -top-1 -right-2">
                      <AlertTriangle size={12} className="text-error" />
                    </span>
                  )}
                  {isFixed && (
                    <span className="absolute -top-1 -right-2">
                      <CheckCircle2 size={12} className="text-success" />
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold">{device.name}</p>
                <p className="text-xs text-muted">{device.location}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && step.devices[selected].vulnerable && (
        <Card className={fixed.has(selected) ? "bg-success/5 border-success/20" : "bg-error/5 border-error/20"}>
          <div className="flex items-start gap-2">
            {fixed.has(selected) ? (
              <Shield size={16} className="text-success shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={16} className="text-error shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-semibold">{step.devices[selected].name}</p>
              <p className="text-xs text-error mt-0.5">Уязвимость: {step.devices[selected].vulnerability}</p>
              {fixed.has(selected) && (
                <p className="text-xs text-success mt-1">Исправление: {step.devices[selected].fix}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {allFixed && (
        <div className="space-y-3">
          <Card className="bg-success/5 border-success/20 text-center">
            <CheckCircle2 size={24} className="text-success mx-auto mb-1" />
            <p className="text-sm font-semibold text-success">Все уязвимости устранены!</p>
          </Card>
          <button
            onClick={() => onComplete(fixed.size, vulnerableDevices.length)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <span>Далее</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
