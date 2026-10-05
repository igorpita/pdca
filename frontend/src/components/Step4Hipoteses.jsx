import React from 'react';
import { ShieldAlert, CheckCircle, Flame, Users, Info } from 'lucide-react';

export default function Step4Hipoteses({ project, onChange }) {
  const hypotheses = project.hypotheses || [];

  const handleHypothesisChange = (index, field, val) => {
    const updated = [...hypotheses];
    const curr = { ...updated[index], [field]: val };

    // Calculate GUT Score = G * U * T
    const g = parseInt(curr.g) || 1;
    const u = parseInt(curr.u) || 1;
    const t = parseInt(curr.t) || 1;
    curr.gutScore = g * u * t;

    updated[index] = curr;

    // Sort hypotheses descending by GUT score & votes
    updated.sort((a, b) => (b.gutScore || (b.g * b.u * b.t) || 0) - (a.gutScore || (a.g * a.u * a.t) || 0));

    // Update 5 Whys section with Influential causes!
    const influentialCauses = updated.filter(h => h.isInfluential);
    const existing5Whys = project.fiveWhys || [];
    const updated5Whys = influentialCauses.map(inf => {
      const match = existing5Whys.find(w => w.causeText === inf.causeText);
      return match || {
        causeText: inf.causeText,
        whys: [
          `Por que ocorre "${inf.causeText}"? R: `,
          `Por que motivo? R: `,
          `Por que motivo? R: `,
          `Por que motivo? R: `,
          `Causa Raiz: `
        ],
        actions: [`Ação preventiva para ${inf.causeText}`]
      };
    });

    onChange({
      ...project,
      hypotheses: updated,
      fiveWhys: updated5Whys
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            Etapa 4: Análise das Hipóteses & Matriz GUT de Priorização
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Avalie o impacto das causas mapeadas através da Matriz GUT (Gravidade, Urgência e Tendência) e eleja as Causas Influentes.
          </p>
        </div>
      </div>

      {/* GUT Explanation Banner */}
      <div className="glass-card p-4 rounded-xl border-l-4 border-l-indigo-500 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Pontuação GUT (Gravidade x Urgência x Tendência):</span>
          <span className="ml-1 text-slate-400">
            Dê notas de 1 a 5 para cada critério. A pontuação varia de 1 a 125. Marque como <strong className="text-emerald-400">"Causa Influente"</strong> as causas de maior impacto para avançar aos 5 Porquês.
          </span>
        </div>
      </div>

      {/* Table of Hypotheses */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Causa Hipotética</th>
                <th className="py-3 px-2 text-center w-20">Gravidade (G)</th>
                <th className="py-3 px-2 text-center w-20">Urgência (U)</th>
                <th className="py-3 px-2 text-center w-20">Tendência (T)</th>
                <th className="py-3 px-2 text-center w-24">Score GUT</th>
                <th className="py-3 px-2 text-center w-24">Votos Time</th>
                <th className="py-3 px-3 text-center w-36">Causa Influente?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {hypotheses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    Nenhuma causa cadastrada na Etapa 3. Adicione causas no Ishikawa primeiro.
                  </td>
                </tr>
              ) : (
                hypotheses.map((h, idx) => {
                  const g = parseInt(h.g) || 1;
                  const u = parseInt(h.u) || 1;
                  const t = parseInt(h.t) || 1;
                  const score = g * u * t;

                  return (
                    <tr key={h.id || idx} className={h.isInfluential ? 'bg-indigo-950/20' : ''}>
                      <td className="py-3 px-3 text-slate-200 font-medium">
                        {h.causeText}
                      </td>

                      {/* G */}
                      <td className="py-2 px-2 text-center">
                        <select
                          value={h.g || 3}
                          onChange={(e) => handleHypothesisChange(idx, 'g', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </td>

                      {/* U */}
                      <td className="py-2 px-2 text-center">
                        <select
                          value={h.u || 3}
                          onChange={(e) => handleHypothesisChange(idx, 'u', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </td>

                      {/* T */}
                      <td className="py-2 px-2 text-center">
                        <select
                          value={h.t || 3}
                          onChange={(e) => handleHypothesisChange(idx, 't', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </td>

                      {/* GUT Score */}
                      <td className="py-2 px-2 text-center font-mono font-bold text-sm">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          score >= 60 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          score >= 25 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {score}
                        </span>
                      </td>

                      {/* Votos */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={h.votes || 0}
                          onChange={(e) => handleHypothesisChange(idx, 'votes', parseInt(e.target.value) || 0)}
                          className="w-16 text-center bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-indigo-300 font-mono focus:border-indigo-500 focus:outline-none"
                        />
                      </td>

                      {/* Influential Checkbox Toggle */}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleHypothesisChange(idx, 'isInfluential', !h.isInfluential)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            h.isInfluential
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                              : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                          }`}
                        >
                          <CheckCircle className={`w-3.5 h-3.5 ${h.isInfluential ? 'text-emerald-400' : 'text-slate-600'}`} />
                          {h.isInfluential ? 'Influente ✓' : 'Secundária'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
