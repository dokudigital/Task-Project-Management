import { Project, Task, User } from '../types';

export function exportTasksToCSV(tasks: Task[], filename = 'doku-tasks-report.csv') {
  const headers = [
    'ID Task',
    'Judul Task',
    'Proyek',
    'Status',
    'Prioritas',
    'Penanggung Jawab',
    'Tenggat Waktu',
    'Estimasi (Jam)',
    'Realisasi (Jam)',
    'Subtask Selesai'
  ];

  const rows = tasks.map(t => {
    const completedSubs = t.subtasks?.filter(s => s.completed).length || 0;
    const totalSubs = t.subtasks?.length || 0;
    return [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.projectName.replace(/"/g, '""')}"`,
      t.status.toUpperCase(),
      t.priority.toUpperCase(),
      `"${t.assigneeName}"`,
      t.dueDate,
      t.estimatedHours || 0,
      t.actualHours || 0,
      `"${completedSubs}/${totalSubs}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportProjectsToCSV(projects: Project[], tasks: Task[], filename = 'doku-projects-report.csv') {
  const headers = [
    'Kode Proyek',
    'Nama Proyek',
    'Kategori',
    'Status',
    'Project Lead',
    'Progres (%)',
    'Anggaran (IDR)',
    'Tanggal Mulai',
    'Target Selesai',
    'Total Task',
    'Task Selesai'
  ];

  const rows = projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    const completedTasks = pTasks.filter(t => t.status === 'done').length;
    return [
      p.code,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.status.toUpperCase(),
      `"${p.leadName}"`,
      `${p.progress}%`,
      p.budget || 0,
      p.startDate,
      p.targetEndDate,
      pTasks.length,
      completedTasks
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printExecutiveReport(projects: Project[], tasks: Task[], users: User[]) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const nowStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Eksekutif Project & Task Management - DOKU</title>
      <style>
        body {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          margin: 0;
          padding: 30px;
          color: #1f2937;
          background-color: #ffffff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #ea1d25;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #ea1d25;
          letter-spacing: -0.5px;
        }
        .date {
          font-size: 13px;
          color: #6b7280;
        }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          background: #f9fafb;
        }
        .card-title {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 600;
        }
        .card-value {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-top: 5px;
        }
        section {
          margin-bottom: 30px;
        }
        h2 {
          font-size: 18px;
          color: #111827;
          border-left: 4px solid #ea1d25;
          padding-left: 10px;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 10px 12px;
          text-align: left;
        }
        th {
          background-color: #161616;
          color: #ffffff;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background-color: #fafafa;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-active { background: #fee2e2; color: #991b1b; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-done { background: #d1fae5; color: #065f46; }
        .status-in_progress { background: #fef3c7; color: #92400e; }
        .status-planning { background: #f3f4f6; color: #374151; }
        .footer {
          margin-top: 40px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">DOKU Workspaces</div>
          <div style="font-size: 14px; color: #4b5563;">Laporan Eksekutif Portofolio Proyek & Tugas</div>
        </div>
        <div style="text-align: right;">
          <div class="date">${nowStr}</div>
          <button class="no-print" onclick="window.print()" style="margin-top: 8px; padding: 6px 12px; background: #ea1d25; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Cetak Laporan</button>
        </div>
      </div>

      <div class="summary-cards">
        <div class="card">
          <div class="card-title">Total Proyek</div>
          <div class="card-value">${totalProjects}</div>
        </div>
        <div class="card">
          <div class="card-title">Proyek Aktif</div>
          <div class="card-value">${activeProjects}</div>
        </div>
        <div class="card">
          <div class="card-title">Total Tugas</div>
          <div class="card-value">${totalTasks}</div>
        </div>
        <div class="card">
          <div class="card-title">Tingkat Penyelesaian</div>
          <div class="card-value">${completionRate}%</div>
        </div>
      </div>

      <section>
        <h2>Status Portofolio Proyek</h2>
        <table>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Proyek</th>
              <th>Lead</th>
              <th>Kategori</th>
              <th>Progres</th>
              <th>Status</th>
              <th>Tenggat Selesai</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map(p => `
              <tr>
                <td><strong>${p.code}</strong></td>
                <td>${p.name}</td>
                <td>${p.leadName}</td>
                <td>${p.category}</td>
                <td>${p.progress}%</td>
                <td><span class="badge status-${p.status}">${p.status}</span></td>
                <td>${p.targetEndDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Daftar Tugas & Penanggung Jawab</h2>
        <table>
          <thead>
            <tr>
              <th>Judul Task</th>
              <th>Proyek</th>
              <th>Assignee</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(t => `
              <tr>
                <td>${t.title}</td>
                <td>${t.projectName}</td>
                <td>${t.assigneeName}</td>
                <td>${t.priority.toUpperCase()}</td>
                <td><span class="badge status-${t.status}">${t.status.replace('_', ' ')}</span></td>
                <td>${t.dueDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>

      <div class="footer">
        <div>DOKU Project Management System - Auto Generated Report</div>
        <div>Total Tim: ${users.length} Anggota | Dokumen Rahasia Internal</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => {
            // Option to auto open print dialog
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
