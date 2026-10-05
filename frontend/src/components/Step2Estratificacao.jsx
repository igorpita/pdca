import React from 'react';
import { BarChart2, Plus, Trash2, CheckCircle, Info } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine } from 'recharts';

export default function Step2Estratificacao({ project, onChange }) {
  const items = project.stratification || [];

  const recalculate = (newItems) => {
    // Sort descending by count
    const sorted = [...newItems].sort((a, b) => (parseFloat(b.count) || 0) - (parseFloat(a.count) || 0));
    const total = sorted.reduce((sum, item) => sum + (parseFloat(item.count) || 0), 0);
    
    let accum = 0;
    const computed = sorted.map(item => {
      const cnt = parseFloat(item.count) || 0;
      accum += cnt;
      const pct = total > 0 ? (cnt / total) * 100 : 0;
      const cumPct = total > 0 ? (accum / total) * 100 : 0;
      return {
        ...item,
        count: cnt,
        percentage: parseFloat(pct.toFixed(2)),
        cumulativePercentage: parseFloat(cumPct.toFixed(2))
      };
    });

    onChange({
      ...project,
      stratification: computed
    });
  };

  const handleItemChange = (index, field, val) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: field === 'count' ? (val === '' ? 0 : parseFloat(val)) : val
    };
    recalculate(updated);
  };

  const handleAddItem = () => {
    const updated = [
      ...items,
      { category: 'Nova Categoria', count: 10, percentage: 0, cumulativePercentage: 0 }
    ];
    recalculate(updated);
  };

  const handleDeleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    recalculate(updated);
  };

  const totalOccurrences = items.reduce((sum, i) => sum + (parseFloat(i.count) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-heading">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
            Etapa 2: Estratificação & Análise de Pareto
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Classifique o problema por categorias para identificar o princípio de Pareto (80% dos efeitos vêm de 20% das causas).
          </p>
        </div>
        <button
          onClick={handleAddItem}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Adicionar Categoria
        </button>
      </div>

      {/* Info Banner */}
      <div className="glass-card p-4 rounded-xl border-l-4 border-l-indigo-500 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Princípio de Pareto (Regra 80/20):</span> As categorias até a linha vermelha de 80% concentram a maioria esmagadora dos incidentes. Focalizar as ações nessas poucas categorias vitais trará o maior retorno na solução do problema.
        </div>
      </div>

      {/* Main Grid: Pareto Chart + Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pareto Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white font-heading flex items-center justify-between">
            <span>Gráfico de Pareto (Frequência x % Acumulado)</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
              Total: {totalOccurrences} incidentes
            </span>
          </h3>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={items} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis yAxisId="left" stroke="#818cf8" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#f43f5e" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val, name) => [name === '% Acumulado' ? `${val}%` : val, name]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <ReferenceLine yAxisId="right" y={80} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: '80% Pareto', fill: '#f43f5e', fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="count" name="Quantidade / Frequência" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="cumulativePercentage" name="% Acumulado" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5, fill: '#f43f5e' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white font-heading">
            Tabela de Estratificação
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2">Categoria / Fenômeno</th>
                  <th className="py-2.5 px-2 text-right">Qtd</th>
                  <th className="py-2.5 px-2 text-right">% Individual</th>
                  <th className="py-2.5 px-2 text-right">% Acum.</th>
                  <th className="py-2.5 px-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {items.map((item, idx) => {
                  const isVitalFew = item.cumulativePercentage <= 80 || (idx > 0 && items[idx - 1].cumulativePercentage < 80);
                  return (
                    <tr key={idx} className={isVitalFew ? 'bg-indigo-950/20' : ''}>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          value={item.count}
                          onChange={(e) => handleItemChange(idx, 'count', e.target.value)}
                          className="w-20 text-right bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-indigo-300 font-mono focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-2 px-2 text-right text-slate-300 font-mono">
                        {item.percentage}%
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold">
                        <span className={isVitalFew ? 'text-emerald-400' : 'text-slate-400'}>
                          {item.cumulativePercentage}%
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remover Categoria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
