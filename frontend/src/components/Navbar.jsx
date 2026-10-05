import React, { useState } from 'react';
import { Target, Plus, Save, Download, RefreshCw, CheckCircle2, ChevronDown, Layers } from 'lucide-react';

export default function Navbar({
  projects,
  currentProject,
  onSelectProject,
  onNewProject,
  onSaveProject,
  isSaving,
  hasUnsavedChanges
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleExportJSON = () => {
    if (!currentProject) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentProject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pdca-${currentProject.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-heading">
                PDCA <span className="text-indigo-400">MASP</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Metodologia de Solução Definitiva de Problemas</p>
          </div>
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-200 transition-all"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="max-w-[200px] truncate">
              {currentProject ? currentProject.title : 'Selecionar Projeto'}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Seus Projetos PDCA
              </div>
              <div className="max-h-60 overflow-y-auto">
                {projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-indigo-600/10 hover:text-indigo-300 transition-colors ${
                      currentProject?.id === proj.id ? 'bg-indigo-600/20 text-indigo-400 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span className="truncate">{proj.title}</span>
                    {currentProject?.id === proj.id && <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-800 mt-2 pt-2 px-2">
                <button
                  onClick={() => {
                    onNewProject();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Projeto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            title="Exportar dados do projeto em formato JSON"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </button>

          <button
            onClick={onSaveProject}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-orange-500/25 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Salvando...' : hasUnsavedChanges ? 'Salvar Alterações*' : 'Salvo'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
