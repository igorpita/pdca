import React from 'react';
import { Target, Calendar, User, MapPin, Building, AlertTriangle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function Step1Identificacao({ project, onChange }) {
  const ident = project.identification || {};

  const handleFieldChange = (field, val) => {
    onChange({
      ...project,
      identification: {
        ...ident,
        [field]: val
      }
    });
  };

  const handleHeaderChange = (field, val) => {
    onChange({
      ...project,
      [field]: val
    });
  };

  const handleMetricChange = (index, field, val) => {
    const updatedHistory = [...(ident.metricHistory || [])];
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: val === '' ? null : parseFloat(val)
    };
    handleFieldChange('metricHistory', updatedHistory);
  };

  const chartData = (ident.metricHistory || []).map(m => ({
    period: m.period,
    Meta: m.target,
    Real: m.real
  }));

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <Target className="w-6 h-6 text-indigo-400" />
            Etapa 1: Identificação do Problema & Meta
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Defina o resultado indesejável (problema), a meta clara a ser alcançada e acompanhe o indicador histórico.
          </p>
        </div>
      </div>

      {/* Project Meta Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
            <Building className="w-3.5 h-3.5 text-indigo-400" /> Unidade Gerencial
          </label>
          <input
            type="text"
            value={project.unit || ''}
            onChange={(e) => handleHeaderChange('unit', e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:border-indigo-500 focus:outline-none"
            placeholder="Ex: TI Infraestrutura"
          />
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Localidade / Estado
          </label>
          <input
            type="text"
            value={project.location || ''}
            onChange={(e) => handleHeaderChange('location', e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:border-indigo-500 focus:outline-none"
            placeholder="Ex: Matriz / SP"
          />
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Responsáveis
          </label>
          <input
            type="text"
            value={project.responsible || ''}
            onChange={(e) => handleHeaderChange('responsible', e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:border-indigo-500 focus:outline-none"
            placeholder="Ex: Antoniel, Igor Pita"
          />
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Data de Elaboração
          </label>
          <input
            type="date"
            value={project.createdAt || ''}
            onChange={(e) => handleHeaderChange('createdAt', e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Problem & Goal Definition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Card */}
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              1. Definição do Problema (Efeito Indesejável)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">Fenômeno</span>
          </div>
          <p className="text-xs text-slate-400">
            Descreva com precisão o problema atual (efeito indesejado) no processo.
          </p>
          <textarea
            rows={4}
            value={ident.problem || ''}
            onChange={(e) => handleFieldChange('problem', e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-all"
            placeholder="Ex: Quantidade de ocorrências de incidentes muito elevada. Acima de 60%..."
          />
        </div>

        {/* Goal Card */}
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              2. Definição da Meta (Objetivo + Valor + Prazo)
            </h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">Alvo</span>
          </div>
          <p className="text-xs text-slate-400">
            Defina o resultado futuro a ser atingido com valor quantitativo e prazo limite.
          </p>
          <textarea
            rows={4}
            value={ident.goal || ''}
            onChange={(e) => handleFieldChange('goal', e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
            placeholder="Ex: Reduzir em 40% as ocorrências de incidentes no prazo de 90 dias..."
          />
        </div>
      </div>

      {/* Indicator & Metrics Details */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <h3 className="text-lg font-bold text-white font-heading">
          3. Histórico do Indicador (Meta vs Real)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Nome do Indicador</label>
            <input
              type="text"
              value={ident.indicator || ''}
              onChange={(e) => handleFieldChange('indicator', e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Ex: Chamados de TI"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Unidade de Medida</label>
            <input
              type="text"
              value={ident.unit || ''}
              onChange={(e) => handleFieldChange('unit', e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Ex: Quantidade / %"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Fonte dos Dados</label>
            <input
              type="text"
              value={ident.source || ''}
              onChange={(e) => handleFieldChange('source', e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Ex: Service Desk GLPI"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Periodicidade</label>
            <input
              type="text"
              value={ident.frequency || ''}
              onChange={(e) => handleFieldChange('frequency', e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Ex: Mensal"
            />
          </div>
        </div>

        {/* Recharts Target vs Real Chart */}
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Meta" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              <Bar dataKey="Real" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Data Entry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Mês / Período</th>
                {(ident.metricHistory || []).map((m, idx) => (
                  <th key={idx} className="py-2.5 px-2 text-center">{m.period}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-semibold">Meta (Planejado)</td>
                {(ident.metricHistory || []).map((m, idx) => (
                  <td key={idx} className="p-1">
                    <input
                      type="number"
                      value={m.target ?? ''}
                      onChange={(e) => handleMetricChange(idx, 'target', e.target.value)}
                      className="w-full text-center bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-xs text-emerald-300 focus:border-emerald-500 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 text-indigo-400 font-semibold">Real (Executado)</td>
                {(ident.metricHistory || []).map((m, idx) => (
                  <td key={idx} className="p-1">
                    <input
                      type="number"
                      value={m.real ?? ''}
                      onChange={(e) => handleMetricChange(idx, 'real', e.target.value)}
                      className="w-full text-center bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-xs text-indigo-300 focus:border-indigo-500 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
