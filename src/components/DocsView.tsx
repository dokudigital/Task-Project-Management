import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Tag, 
  User, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Document, Project } from '../types';

interface DocsViewProps {
  documents: Document[];
  projects: Project[];
  onOpenNewDocModal: () => void;
}

export const DocsView: React.FC<DocsViewProps> = ({
  documents,
  projects,
  onOpenNewDocModal
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [search, setSearch] = useState('');

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">DOKU Workspace Docs & Notes</h2>
          <p className="text-xs text-slate-500 mt-0.5">Project documentation, PRDs, SOPs, architecture specifications, and team meeting summaries</p>
        </div>

        <button
          onClick={onOpenNewDocModal}
          className="px-4 py-2.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Document</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: List of Documents */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[600px]">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-rose-50/80 border-[#ea1d25] text-[#ea1d25] shadow-2xs font-bold' 
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{doc.icon}</span>
                    <span className="text-xs font-bold line-clamp-1">{doc.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>{doc.authorName}</span>
                    <span>{doc.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Document Viewer & Reader */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          {selectedDoc ? (
            <div>
              <div className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{selectedDoc.icon}</span>
                  <span>Workspace Document</span>
                  <span>•</span>
                  <span>Written by {selectedDoc.authorName}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">{selectedDoc.title}</h1>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedDoc.tags?.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Formatted Markdown Reader Content */}
              <div className="prose prose-slate max-w-none text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                {selectedDoc.content}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              Select a document from the list on the left to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
