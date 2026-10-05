import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Stepper from './components/Stepper';
import Step1Identificacao from './components/Step1Identificacao';
import Step2Estratificacao from './components/Step2Estratificacao';
import Step3Ishikawa from './components/Step3Ishikawa';
import Step4Hipoteses from './components/Step4Hipoteses';
import Step5CincoPorques from './components/Step5CincoPorques';
import Step6PlanoAcao from './components/Step6PlanoAcao';
import Step7Padronizacao from './components/Step7Padronizacao';
import ProjectModal from './components/ProjectModal';
import * as api from './services/api';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Load project list on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.getProjects();
      setProjects(list);
      if (list.length > 0) {
        setCurrentProject(list[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Não foi possível conectar ao servidor backend. Verifique a API.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (id) => {
    if (hasUnsavedChanges) {
      if (!window.confirm('Existem alterações não salvas. Deseja trocar de projeto assim mesmo?')) {
        return;
      }
    }
    setLoading(true);
    try {
      const proj = await api.getProjectById(id);
      setCurrentProject(proj);
      setHasUnsavedChanges(false);
      setActiveStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (updated) => {
    setCurrentProject(updated);
    setHasUnsavedChanges(true);
  };

  const handleSaveProject = async () => {
    if (!currentProject) return;
    setSaving(true);
    try {
      const saved = await api.updateProject(currentProject.id, currentProject);
      setCurrentProject(saved);
      setHasUnsavedChanges(false);
      // Update in projects list
      setProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
    } catch (err) {
      alert('Erro ao salvar projeto: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    setLoading(true);
    try {
      const newProj = await api.createProject(projectData);
      setProjects(prev => [...prev, newProj]);
      setCurrentProject(newProj);
      setActiveStep(1);
      setHasUnsavedChanges(false);
    } catch (err) {
      alert('Erro ao criar projeto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentProject) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Carregando Sistema PDCA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold font-heading">{error}</h2>
        <button
          onClick={loadProjects}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-all"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Header Navigation */}
      <Navbar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        onNewProject={() => setModalOpen(true)}
        onSaveProject={handleSaveProject}
        isSaving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Stepper Navigation Bar */}
      <Stepper
        activeStep={activeStep}
        onStepChange={(step) => setActiveStep(step)}
      />

      {/* Main Active Step Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProject && (
          <>
            {activeStep === 1 && (
              <Step1Identificacao project={currentProject} onChange={handleProjectChange} />
            )}
            {activeStep === 2 && (
              <Step2Estratificacao project={currentProject} onChange={handleProjectChange} />
            )}
            {activeStep === 3 && (
              <Step3Ishikawa project={currentProject} onChange={handleProjectChange} />
            )}
            {activeStep === 4 && (
              <Step4Hipoteses project={currentProject} onChange={handleProjectChange} />
            )}
            {activeStep === 5 && (
              <Step5CincoPorques project={currentProject} onChange={handleProjectChange} />
            )}
            {activeStep === 6 && (
              <Step6PlanoAcao project={currentProject} onChange={handleProjectChange} />
            )}
            {activeStep === 7 && (
              <Step7Padronizacao project={currentProject} onChange={handleProjectChange} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        Sistema PDCA / MASP &copy; {new Date().getFullYear()} — Solução Definitiva de Problemas em Container
      </footer>

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
