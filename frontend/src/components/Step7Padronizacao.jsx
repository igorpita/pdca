import React, { useEffect } from 'react';
import { Award, CheckCircle2, AlertCircle, FileText, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Step7Padronizacao({ project, onChange }) {
  const std = project.standardization || {};

  const handleFieldChange = (field, val) => {
    const updated = {
      ...std,
      [field]: val
    };

    // Trigger confetti if goal achieved!
    if (field === 'isGoalAchieved' && val === true) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    onChange({
      ...project,
      standardization: updated
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <Award className="w-6 h-6 text-indigo-400" />
            Etapa 7: Verificação, Padronização & Lições Aprendidas
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Valide a eficácia da solução, estabeleça o Procedimento Operacional Padrão (POP) e previna o reaparecimento do problema.
          </p>
        </div>
      </div>

      {/* Main Form Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Results Verification Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              1. Verificação dos Resultados Alcançados
            </h3>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400">
              Descreva o resultado obtido comparado com a Meta Inicial:
            </label>
            <textarea
              rows={4}
              value={std.verifiedResult || ''}
              onChange={(e) => handleFieldChange('verifiedResult', e.target.value)}
              placeholder="Ex: Redução observada de 42% no número de incidentes nos últimos 30 dias após implementação das ações..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Goal Achieved Checkbox Toggle */}
          <div className="pt-2">
            <button
              onClick={() => handleFieldChange('isGoalAchieved', !std.isGoalAchieved)}
              className={`w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border font-bold text-sm transition-all ${
                std.isGoalAchieved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${std.isGoalAchieved ? 'text-emerald-400' : 'text-slate-600'}`} />
              {std.isGoalAchieved ? 'META ALCANÇADA COM SUCESSO! 🎉' : 'Meta Ainda em Acompanhamento'}
            </button>
          </div>
        </div>

        {/* Standardization Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <FileText className="w-5 h-5 text-indigo-400" />
            2. Padronização (POP) & Documentação
          </h3>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400">
              Descreva a Ação Padrão (Procedimento, Treinamento, Manual) criado:
            </label>
            <textarea
              rows={4}
              value={std.standardAction || ''}
              onChange={(e) => handleFieldChange('standardAction', e.target.value)}
              placeholder="Ex: Elaboração do Procedimento Operacional Padrão POP-TI-014 para triagem de N1 e gestão de licenças TS..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3 pt-1">
            <label className="text-xs font-semibold text-slate-400">
              Próximos Passos / Observações Finais:
            </label>
            <input
              type="text"
              value={std.nextSteps || ''}
              onChange={(e) => handleFieldChange('nextSteps', e.target.value)}
              placeholder="Ex: Auditoria mensal no indicador de incidentes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
