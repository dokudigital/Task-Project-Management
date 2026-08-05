import React from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  CheckCircle2, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { Project, Task, User } from '../types';
import { exportTasksToCSV, exportProjectsToCSV, printExecutiveReport } from '../utils/exportUtils';

interface ReportsViewProps {
  projects: Project[];
  tasks: Task[];
  users: User[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  projects,
  tasks,
  users
}) => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#000000] via-[#161616] to-[#000000] text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ea1d25] text-white">
              DOKU Executive Reporting Hub
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Laporan & Ekspor Data Workspaces DOKU</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Cetak laporan eksekutif resmi atau unduh file CSV spreadsheet untuk keperluan audit, evaluasi manajemen, dan pelaporan hasil kerja proyek.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => printExecutiveReport(projects, tasks, users)}
            className="px-4 py-2.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Export Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Print Executive PDF */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Laporan Eksekutif Format Cetak / PDF</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Hasil ringkasan resmi portofolio proyek, tingkat penyelesaian task, status milestone, dan alokasi tim dalam tata letak siap cetak.
            </p>
          </div>

          <button
            onClick={() => printExecutiveReport(projects, tasks, users)}
            className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Cetak & Simpan PDF</span>
          </button>
        </div>

        {/* Card 2: Export Tasks CSV */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Unduh Spreadsheet Task (CSV)</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Seluruh data detail {tasks.length} task mencakup penanggung jawab, prioritas, tenggat waktu, estimasi jam, dan subtask dalam format CSV Excel.
            </p>
          </div>

          <button
            onClick={() => exportTasksToCSV(tasks)}
            className="mt-5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV Task</span>
          </button>
        </div>

        {/* Card 3: Export Projects CSV */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Unduh Spreadsheet Proyek (CSV)</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Data lengkap {projects.length} proyek mencakup progres, anggaran, kategori, tanggal mulai, dan status eksekusi.
            </p>
          </div>

          <button
            onClick={() => exportProjectsToCSV(projects, tasks)}
            className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV Proyek</span>
          </button>
        </div>
      </div>

      {/* Summary Tables Preview */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Ringkasan Portofolio Saat Ini</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Proyek</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalProjects}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Proyek Aktif</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{activeProjects}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Task</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalTasks}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Tingkat Done</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{completionRate}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
