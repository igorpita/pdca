import React from 'react';
import { HelpCircle, Plus, Trash2, ArrowRight, CheckSquare, Sparkles } from 'lucide-react';

export default function Step5CincoPorques({ project, onChange }) {
  const fiveWhysList = project.fiveWhys || [];

  const handleWhyTextChange = (causeIndex, whyIndex, val) => {
    const updated = [...fiveWhysList];
    const item = { ...updated[causeIndex] };
    const whys = [...(item.whys || [])];
    whys[whyIndex] = val;
    item.whys = whys;
    updated[causeIndex] = item;

    onChange({
      ...project,
      fiveWhys: updated
    });
  };

  const handleActionChange = (causeIndex, actionIndex, val) => {
    const updated = [...fiveWhysList];
    const item = { ...updated[causeIndex] };
    const actions = [...(item.actions || [])];
    actions[actionIndex] = val;
    item.actions = actions;
    updated[causeIndex] = item;

    // Sync generated actions into 5W2H action plan!
    syncActionsTo5W2H(updated);
  };

  const handleAddAction = (causeIndex) => {
    const updated = [...fiveWhysList];
    const item = { ...updated[causeIndex] };
    item.actions = [...(item.actions || []), 'Nova ação de solução'];
    updated[causeIndex] = item;

    syncActionsTo5W2H(updated);
  };

  const handleDeleteAction = (causeIndex, actionIndex) => {
    const updated = [...fiveWhysList];
    const item = { ...updated[causeIndex] };
    item.actions = item.actions.filter((_, i) => i !== actionIndex);
    updated[causeIndex] = item;

    syncActionsTo5W2H(updated);
  };

  const syncActionsTo5W2H = (updatedWhys) => {
    const existing5W2H = project.actionPlan || [];
    
    // Gather all actions from 5-whys
    const allWhyActions = [];
    updatedWhys.forEach(w => {
      (w.actions || []).forEach(actText => {
        if (actText.trim()) {
          allWhyActions.push({
            what: actText.trim(),
            why: `Tratar Causa Raiz: ${w.causeText}`,
            who: project.responsible || 'Responsável',
            where: project.unit || 'TI',
            plannedStart: new Date().toISOString().split('T')[0],
            plannedEnd: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            status: 'No Prazo'
          });
        }
      });
    });

    // Merge with existing 5W2H, keeping numbers and existing details
    const mergedPlan = allWhyActions.map((item, idx) => {
      const existing = existing5W2H.find(e => e.what === item.what) || existing5W2H[idx];
      return {
        no: idx + 1,
        what: item.what,
        why: existing?.why || item.why,
        where: existing?.where || item.where,
        who: existing?.who || item.who,
        plannedStart: existing?.plannedStart || item.plannedStart,
        plannedEnd: existing?.plannedEnd || item.plannedEnd,
        realStart: existing?.realStart || null,
        realEnd: existing?.realEnd || null,
        status: existing?.status || item.status,
        notes: existing?.notes || ''
      };
    });

    onChange({
      ...project,
      fiveWhys: updatedWhys,
      actionPlan: mergedPlan
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            Etapa 5: Investigação dos 5 Porquês (Causa Raiz)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Questiona-se sucessivamente "Por quê?" para cada causa influente até descobrir a raiz real do problema e gerar as ações corretivas.
          </p>
        </div>
      </div>

      {fiveWhysList.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300 font-heading">Nenhuma Causa Influente Selecionada</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Vá até a <strong>Etapa 4: Hipóteses</strong> e marque as causas prioritárias como <em>"Causa Influente"</em> para investigar os 5 Porquês aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {fiveWhysList.map((item, causeIdx) => (
            <div key={causeIdx} className="glass-panel p-6 rounded-2xl space-y-6">
              
              {/* Cause Banner */}
              <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Causa Influente #{causeIdx + 1}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{item.causeText}</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-600/30 text-indigo-300 font-mono">
                  Investigação em Cadeia
                </span>
              </div>

              {/* 5 Whys Sequence */}
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map((wIdx) => {
                  const isRoot = wIdx === 4;
                  return (
                    <div
                      key={wIdx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                        isRoot
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isRoot ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-indigo-300'
                      }`}>
                        {wIdx + 1}º
                      </div>

                      <div className="flex-1 space-y-1">
                        <label className={`text-xs font-bold block ${isRoot ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isRoot ? 'Causa Raiz Fundamental (5º Por quê)' : `${wIdx + 1}º Por quê?`}
                        </label>
                        <input
                          type="text"
                          value={item.whys?.[wIdx] || ''}
                          onChange={(e) => handleWhyTextChange(causeIdx, wIdx, e.target.value)}
                          placeholder={isRoot ? 'Conclusão da causa raiz real...' : `Descreva o porquê do nível ${wIdx + 1}...`}
                          className={`w-full bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none ${
                            isRoot ? 'border-emerald-500/50 focus:border-emerald-400 font-semibold' : 'border-slate-800 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Countermeasures / Action steps generated */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Etapas de Ação / Contra-medidas Propostas
                  </h4>
                  <button
                    onClick={() => handleAddAction(causeIdx)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Ação
                  </button>
                </div>

                <div className="space-y-2">
                  {(item.actions || []).map((actionText, actIdx) => (
                    <div key={actIdx} className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={actionText}
                        onChange={(e) => handleActionChange(causeIdx, actIdx, e.target.value)}
                        placeholder="Ação corretiva (o que fazer)..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleDeleteAction(causeIdx, actIdx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
