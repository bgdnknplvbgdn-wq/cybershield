"use client";

import { useState, useCallback } from "react";
import type { Scenario, ScenarioStep } from "@/lib/scenario-types";
import { BriefingView } from "./BriefingView";
import { EmailInspector } from "./EmailInspector";
import { DialogScene } from "./DialogScene";
import { PasswordGame } from "./PasswordGame";
import { CipherPuzzle } from "./CipherPuzzle";
import { NetworkConfig } from "./NetworkConfig";
import { PermissionChecker } from "./PermissionChecker";
import { SmartHomeMap } from "./SmartHomeMap";
import { DataLeakCheck } from "./DataLeakCheck";
import { LawMatch } from "./LawMatch";
import { AIScamChat } from "./AIScamChat";
import FileScanner from "./FileScanner";
import { DebriefingView } from "./DebriefingView";
import { QuizView } from "./QuizView";
import { ArrowLeft } from "lucide-react";

interface ScenarioEngineProps {
  scenario: Scenario;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function ScenarioEngine({ scenario, onComplete, onBack }: ScenarioEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);

  const step = scenario.steps[currentStep];
  const isLastStep = currentStep === scenario.steps.length - 1;
  const progress = ((currentStep + 1) / scenario.steps.length) * 100;

  const handleStepComplete = useCallback((stepScore: number, maxScore: number) => {
    setScore((prev) => prev + stepScore);
    setTotalPossible((prev) => prev + maxScore);

    if (isLastStep) {
      const finalScore = Math.round(((score + stepScore) / (totalPossible + maxScore)) * 100);
      onComplete(Math.max(finalScore, 50));
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep, score, totalPossible, onComplete]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      const finalScore = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 100;
      onComplete(Math.max(finalScore, 50));
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep, score, totalPossible, onComplete]);

  return (
    <div className="min-h-[80dvh] px-4 md:px-8 py-6 md:py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 rounded-lg bg-card-alt border border-card-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-all">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{scenario.icon}</span>
            <h1 className="text-sm font-bold truncate font-cyber tracking-wider uppercase">{scenario.title}</h1>
          </div>
          <div className="cyber-progress">
            <div
              className="bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-accent font-mono font-bold">{currentStep + 1}/{scenario.steps.length}</span>
      </div>

      <div className="mt-6 animate-fadeIn" key={currentStep}>
        {renderStep(step, handleStepComplete, handleNext)}
      </div>
    </div>
  );
}

function renderStep(
  step: ScenarioStep,
  onComplete: (score: number, maxScore: number) => void,
  onNext: () => void,
) {
  switch (step.type) {
    case "briefing":
      return <BriefingView step={step} onNext={onNext} />;
    case "quiz":
      return <QuizView step={step} onComplete={onComplete} />;
    case "email-inspect":
      return <EmailInspector step={step} onComplete={onComplete} />;
    case "dialog":
      return <DialogScene step={step} onComplete={onComplete} />;
    case "password-game":
      return <PasswordGame step={step} onComplete={onComplete} />;
    case "cipher-puzzle":
      return <CipherPuzzle step={step} onComplete={onComplete} />;
    case "network-config":
      return <NetworkConfig step={step} onComplete={onComplete} />;
    case "permission-check":
      return <PermissionChecker step={step} onComplete={onComplete} />;
    case "smart-home":
      return <SmartHomeMap step={step} onComplete={onComplete} />;
    case "data-leak-check":
      return <DataLeakCheck step={step} onComplete={onComplete} />;
    case "law-match":
      return <LawMatch step={step} onComplete={onComplete} />;
    case "ai-scam-chat":
      return <AIScamChat step={step} onComplete={onComplete} />;
    case "file-scanner":
      return <FileScanner step={step} onComplete={() => onComplete(1, 1)} />;
    case "debriefing":
      return <DebriefingView step={step} onNext={onNext} />;
    default:
      return <div>Неизвестный тип шага</div>;
  }
}
