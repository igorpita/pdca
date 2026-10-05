import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, LayoutGrid, Table as TableIcon, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function Step6PlanoAcao({ project, onChange }) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const actionPlan = project.actionPlan || [];

  const handleActionChange = (index, field, val) => {
    const updated = [...actionPlan];
    updated[index] = {
      ...updated[index],
      [field]: val
    };

    // Auto calculate status based on dates if status is not explicitly set to Cancelado
    const item = updated[index];
    if (item.status !== 'Cancelado') {
      const today = new Date().toISOString().split('T')[0];
      if (item.realEnd) {
        item.status = 'Concluído';
      } else if (item.realStart) {
        if (item.plannedEnd && today > item.plannedEnd) {
          item.status = 'Atrasado';
        } else {
          item.status = 'Em Andamento';
        }
      } else if (item.plannedEnd && today > item.plannedEnd) {
        item.status = 'Atrasado';
      } else {
        item.status = 'No Prazo';
      }
    }

    onChange({
      ...project,
      actionPlan: updated
    });
  };

  const handleAddAction = () => {
    const newNo = actionPlan.length + 1;
    const newAction = {
      no: newNo,
      what: 'Nova Ação de Solução',
      why: 'Tratar causa raiz',
      where: project.unit || 'TI',
      who: project.responsible || 'Responsável',
      plannedStart: new Date().toISOString().split('T')[0],
      plannedEnd: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      realStart: null,
      realEnd: null,
      status: 'No Prazo',
      notes: ''
    };

    onChange({
      ...project,
      actionPlan: [...actionPlan, newAction]
    });
  };

  const handleDeleteAction = (index) => {
    const updated = actionPlan.filter((_, i) => i !== index).map((act, i) => ({ ...act, no: i + 1 }));
    onChange({
      ...project,
      actionPlan: updated
    });
  };

  // Metrics summary
  const total = actionPlan.length;
  const concluded = actionPlan.filter(a => a.status === 'Concluído').length;
  const inProgress = actionPlan.filter(a => a.status === 'Em Andamento').length;
  const delayed = actionPlan.filter(a => a.status === 'Atrasado').length;
  const onTrack = actionPlan.filter(a => a.status === 'No Prazo').length;
  const pctConcluded = total > 0 ? Math.round((concluded / total) * 100) : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Concluído':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold badge-concluido">Concluído ✓</span>;
      case 'Em Andamento':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold badge-em-andamento">Em Andamento</span>;
      case 'Atrasado':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold badge-atrasado">Atrasado !</span>;
      case 'Cancelado':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold badge-cancelado">Cancelado</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold badge-no-prazo">No Prazo</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            Etapa 6: Plano de Ação (Matriz 5W2H & Acompanhamento)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Planejamento e acompanhamento do Farol das ações (O que, Por que, Onde, Quem, Quando, Status).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Tabela 5W2H
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>

          <button
            onClick={handleAddAction}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nova Ação 5W2H
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="glass-card p-3.5 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total de Ações</span>
          <div className="text-xl font-bold text-white font-mono">{total}</div>
        </div>

        <div className="glass-card p-3.5 rounded-xl space-y-1 border-l-2 border-l-emerald-500">
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Concluídas
          </span>
          <div className="text-xl font-bold text-emerald-400 font-mono">{concluded} ({pctConcluded}%)</div>
        </div>

        <div className="glass-card p-3.5 rounded-xl space-y-1 border-l-2 border-l-blue-500">
          <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Em Andamento
          </span>
          <div className="text-xl font-bold text-blue-400 font-mono">{inProgress}</div>
        </div>

        <div className="glass-card p-3.5 rounded-xl space-y-1 border-l-2 border-l-rose-500">
          <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Atrasadas
          </span>
          <div className="text-xl font-bold text-rose-400 font-mono">{delayed}</div>
        </div>

        <div className="glass-card p-3.5 rounded-xl space-y-1 border-l-2 border-l-teal-500">
          <span className="text-[10px] uppercase font-bold text-teal-400">No Prazo</span>
          <div className="text-xl font-bold text-teal-400 font-mono">{onTrack}</div>
        </div>
      </div>

      {/* Main View: Table or Kanban */}
      {viewMode === 'table' ? (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-2 text-center w-10">Nº</th>
                  <th className="py-3 px-3">O Que (Ação / Etapa)</th>
                  <th className="py-3 px-3">Por Que (Motivo)</th>
                  <th className="py-3 px-2 w-28">Quem</th>
                  <th className="py-3 px-2 w-28 text-center">Início (P)</th>
                  <th className="py-3 px-2 w-28 text-center">Término (P)</th>
                  <th className="py-3 px-2 w-28 text-center">Término (R)</th>
                  <th className="py-3 px-2 text-center w-32">Farol / Status</th>
                  <th className="py-3 px-2 text-center w-12">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {actionPlan.map((act, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-2 text-center font-bold text-slate-400">{act.no}</td>
                    
                    {/* What */}
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={act.what || ''}
                        onChange={(e) => handleActionChange(idx, 'what', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* Why */}
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={act.why || ''}
                        onChange={(e) => handleActionChange(idx, 'why', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* Who */}
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={act.who || ''}
                        onChange={(e) => handleActionChange(idx, 'who', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-indigo-300 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* Planned Start */}
                    <td className="py-2 px-1 text-center">
                      <input
                        type="date"
                        value={act.plannedStart || ''}
                        onChange={(e) => handleActionChange(idx, 'plannedStart', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-slate-300 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* Planned End */}
                    <td className="py-2 px-1 text-center">
                      <input
                        type="date"
                        value={act.plannedEnd || ''}
                        onChange={(e) => handleActionChange(idx, 'plannedEnd', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-slate-300 focus:border-indigo-500 focus:outline-none"
                      />
                    </td>

                    {/* Real End */}
                    <td className="py-2 px-1 text-center">
                      <input
                        type="date"
                        value={act.realEnd || ''}
                        onChange={(e) => handleActionChange(idx, 'realEnd', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[11px] text-emerald-400 focus:border-emerald-500 focus:outline-none"
                      />
                    </td>

                    {/* Status Select */}
                    <td className="py-2 px-2 text-center">
                      <select
                        value={act.status || 'No Prazo'}
                        onChange={(e) => handleActionChange(idx, 'status', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="No Prazo">No Prazo</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Atrasado">Atrasado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>

                    {/* Delete */}
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteAction(idx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {['No Prazo', 'Em Andamento', 'Atrasado', 'Concluído'].map((statusCol) => {
            const statusActions = actionPlan.filter(a => a.status === statusCol);
            return (
              <div key={statusCol} className="glass-panel p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {statusCol}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {statusActions.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {statusActions.map((act) => (
                    <div key={act.no} className="glass-card p-3 rounded-xl space-y-2 border-l-2 border-l-indigo-500">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-400 font-mono">#{act.no}</span>
                        {getStatusBadge(act.status)}
                      </div>
                      <p className="text-xs font-bold text-white">{act.what}</p>
                      <p className="text-[11px] text-slate-400">{act.why}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                        <span>Resp: <strong className="text-slate-200">{act.who}</strong></span>
                        <span>Fim P: <strong className="text-slate-300">{act.plannedEnd || 'N/A'}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
