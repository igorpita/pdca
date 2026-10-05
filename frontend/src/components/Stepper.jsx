import React from 'react';
import { Target, BarChart2, GitFork, ShieldAlert, HelpCircle, CheckSquare, Award } from 'lucide-react';

const STEPS = [
  { id: 1, name: '1. Identificação', phase: 'PLAN', icon: Target, desc: 'Problema & Meta' },
  { id: 2, name: '2. Estratificação', phase: 'PLAN', icon: BarChart2, desc: 'Análise de Pareto' },
  { id: 3, name: '3. Ishikawa', phase: 'PLAN', icon: GitFork, desc: 'Diagrama de Causas' },
  { id: 4, name: '4. Hipóteses', phase: 'PLAN', icon: ShieldAlert, desc: 'Matriz GUT / Votação' },
  { id: 5, name: '5. 5 Porquês', phase: 'PLAN', icon: HelpCircle, desc: 'Investigação Causa Raiz' },
  { id: 6, name: '6. Plano de Ação', phase: 'DO', icon: CheckSquare, desc: 'Matriz 5W2H & Status' },
  { id: 7, name: '7. Padronização', phase: 'CHECK & ACT', icon: Award, desc: 'Verificação & POP' },
];

export default function Stepper({ activeStep, onStepChange }) {
  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800 py-3 px-4">
      <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-none">
        <nav className="flex items-center space-x-2 min-w-max">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <div className={`h-0.5 w-6 rounded-full ${isCompleted ? 'bg-indigo-500/60' : 'bg-slate-800'}`} />
                )}
                <button
                  onClick={() => onStepChange(step.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-500/10'
                      : isCompleted
                      ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-tight">{step.name}</div>
                    <div className="text-[10px] text-slate-400 leading-none">{step.desc}</div>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
