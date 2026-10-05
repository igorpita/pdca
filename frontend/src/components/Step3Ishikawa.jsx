import React, { useState } from 'react';
import { GitFork, Plus, Trash2, Tag, HelpCircle, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Mão de Obra',
  'Método',
  'Material',
  'Máquina',
  'Meio Ambiente',
  'Medida'
];

export default function Step3Ishikawa({ project, onChange }) {
  const causes = project.causes || [];
  const [selectedCat, setSelectedCat] = useState('Método');
  const [newCauseText, setNewCauseText] = useState('');

  const handleAddCause = () => {
    if (!newCauseText.trim()) return;
    const newCause = {
      id: `C${Date.now()}`,
      category: selectedCat,
      cause: newCauseText.trim()
    };

    const updatedCauses = [...causes, newCause];
    
    // Also auto-sync/ensure hypothesis item exists in step 4!
    const updatedHypotheses = [...(project.hypotheses || [])];
    if (!updatedHypotheses.some(h => h.causeText === newCause.cause)) {
      updatedHypotheses.push({
        id: `H${Date.now()}`,
        causeId: newCause.id,
        causeText: newCause.cause,
        g: 3, u: 3, t: 3, votes: 5,
        isInfluential: false
      });
    }

    onChange({
      ...project,
      causes: updatedCauses,
      hypotheses: updatedHypotheses
    });

    setNewCauseText('');
  };

  const handleDeleteCause = (id) => {
    const updatedCauses = causes.filter(c => c.id !== id);
    onChange({
      ...project,
      causes: updatedCauses
    });
  };

  const getCausesByCat = (catName) => causes.filter(c => c.category === catName);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <GitFork className="w-6 h-6 text-indigo-400" />
            Etapa 3: Análise das Causas (Diagrama de Ishikawa / 6M)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Mapeie todas as causas prováveis que impactam o problema divididas pelas categorias dos 6M (Espinha de Peixe).
          </p>
        </div>
      </div>

      {/* Cause Creator Form */}
      <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Categoria (6M):</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="text"
            value={newCauseText}
            onChange={(e) => setNewCauseText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCause()}
            placeholder="Descreva uma causa provável (ex: Licenças de TS não foram ativadas...)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleAddCause}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Causa
          </button>
        </div>
      </div>

      {/* Visual Ishikawa Fishbone Canvas */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 overflow-x-auto">
        <h3 className="text-lg font-bold text-white font-heading flex items-center justify-between">
          <span>Diagrama Espinha de Peixe (Ishikawa)</span>
          <span className="text-xs text-slate-400 font-normal">
            Cabeça do Peixe: <strong className="text-amber-400">{project.identification?.problem || 'Problema'}</strong>
          </span>
        </h3>

        {/* Fishbone Diagram Layout */}
        <div className="min-w-[800px] py-8 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80 relative">
          
          {/* Main Horizontal Spine Line */}
          <div className="absolute top-1/2 left-8 right-44 h-1 bg-indigo-500/80 -translate-y-1/2 rounded-full shadow-lg shadow-indigo-500/30" />

          {/* Fishhead Box (Right side) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 p-3 bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-2 border-amber-500/50 rounded-xl text-center shadow-xl">
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Efeito / Problema</span>
            <p className="text-xs font-bold text-white leading-snug line-clamp-3 mt-1">
              {project.identification?.problem || 'Alto Índice de Incidentes'}
            </p>
          </div>

          {/* Top 3 Spines (Mão de Obra, Método, Material) */}
          <div className="grid grid-cols-3 gap-6 mb-16 relative z-10">
            {['Mão de Obra', 'Método', 'Material'].map(cat => {
              const catCauses = getCausesByCat(cat);
              return (
                <div key={cat} className="space-y-2 border-l-2 border-indigo-500/40 pl-3">
                  <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold text-indigo-300">
                    {cat}
                  </div>
                  <div className="space-y-1.5 min-h-[60px]">
                    {catCauses.length === 0 ? (
                      <p className="text-[11px] text-slate-600 italic">Nenhuma causa mapeada</p>
                    ) : (
                      catCauses.map(c => (
                        <div key={c.id} className="flex items-center justify-between group p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all">
                          <span className="text-xs text-slate-200">{c.cause}</span>
                          <button
                            onClick={() => handleDeleteCause(c.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom 3 Spines (Máquina, Meio Ambiente, Medida) */}
          <div className="grid grid-cols-3 gap-6 relative z-10">
            {['Máquina', 'Meio Ambiente', 'Medida'].map(cat => {
              const catCauses = getCausesByCat(cat);
              return (
                <div key={cat} className="space-y-2 border-l-2 border-cyan-500/40 pl-3">
                  <div className="inline-block px-2.5 py-1 rounded-md bg-cyan-600/30 border border-cyan-500/40 text-xs font-bold text-cyan-300">
                    {cat}
                  </div>
                  <div className="space-y-1.5 min-h-[60px]">
                    {catCauses.length === 0 ? (
                      <p className="text-[11px] text-slate-600 italic">Nenhuma causa mapeada</p>
                    ) : (
                      catCauses.map(c => (
                        <div key={c.id} className="flex items-center justify-between group p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all">
                          <span className="text-xs text-slate-200">{c.cause}</span>
                          <button
                            onClick={() => handleDeleteCause(c.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
