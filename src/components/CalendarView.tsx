import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Plus,
  Filter,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenNewTaskModal?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onSelectTask,
  onOpenNewTaskModal
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');
  const [selectedDayTasks, setSelectedDayTasks] = useState<{ dateStr: string; tasks: Task[] } | null>(null);

  // Helper to get YYYY-MM-DD from Date object
  const formatDateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = useMemo(() => formatDateKey(new Date()), []);

  // Map tasks by YYYY-MM-DD due date
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (!task.dueDate) return;
      const dateKey = task.dueDate.split('T')[0];
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(task);
    });
    return map;
  }, [tasks]);

  // Calendar Navigation
  const handlePrev = () => {
    if (viewType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const handleNext = () => {
    if (viewType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(currentDate.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Name & Year Title
  const monthTitle = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  // Week range title (e.g. "Aug 3 - Aug 9, 2026")
  const weekTitle = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day); // Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Saturday

    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    }
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
  }, [currentDate]);

  // Generate Month Grid Days
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun

    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days: { date: Date; dateKey: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Prev month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      const dateKey = formatDateKey(prevDate);
      days.push({
        date: prevDate,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === todayStr
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const currDate = new Date(year, month, d);
      const dateKey = formatDateKey(currDate);
      days.push({
        date: currDate,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === todayStr
      });
    }

    // Next month padding to complete 35 or 42 grid cells
    const totalGridCells = days.length > 35 ? 42 : 35;
    const remainingCells = totalGridCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateKey = formatDateKey(nextDate);
      days.push({
        date: nextDate,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === todayStr
      });
    }

    return days;
  }, [currentDate, todayStr]);

  // Generate Week Grid Days
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day); // Sunday as start

    const days: { date: Date; dateKey: string; dayName: string; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const curr = new Date(startOfWeek);
      curr.setDate(startOfWeek.getDate() + i);
      const dateKey = formatDateKey(curr);
      days.push({
        date: curr,
        dateKey,
        dayName: curr.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: dateKey === todayStr
      });
    }
    return days;
  }, [currentDate, todayStr]);

  // Helper for task status color badges
  const getTaskStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'in_review':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
      case 'todo':
        return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200';
      case 'backlog':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
    }
  };

  const getPriorityDot = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" title="Urgent" />;
      case 'high':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="High" />;
      case 'medium':
        return <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Medium" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" title="Low" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-[#ea1d25]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {viewType === 'month' ? monthTitle : weekTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {tasks.length} total tasks scheduled across workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Navigation Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md transition-all"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded-md transition-all"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md transition-all"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month / Week Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewType('month')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                viewType === 'month'
                  ? 'bg-[#ea1d25] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                viewType === 'week'
                  ? 'bg-[#ea1d25] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
          </div>

          {onOpenNewTaskModal && (
            <button
              onClick={onOpenNewTaskModal}
              className="px-3 py-1.5 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* MONTH VIEW GRID */}
      {viewType === 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          {/* Day Headers (Sun - Sat) */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-600 py-2.5 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100/50">
            {monthDays.map((dayItem) => {
              const dayTasks = tasksByDate[dayItem.dateKey] || [];
              const displayTasks = dayTasks.slice(0, 3);
              const overflowCount = dayTasks.length - 3;

              return (
                <div
                  key={dayItem.dateKey}
                  className={`bg-white min-h-[110px] p-1.5 flex flex-col justify-between transition-colors ${
                    !dayItem.isCurrentMonth ? 'bg-slate-50/60 text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {/* Top Bar: Date Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full ${
                        dayItem.isToday
                          ? 'bg-[#ea1d25] text-white shadow-2xs'
                          : dayItem.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayItem.date.getDate()}
                    </span>

                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-extrabold text-slate-400">
                        {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Task List Pills */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {displayTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className={`p-1.5 rounded-md border text-[11px] leading-tight font-semibold cursor-pointer transition-all flex items-center justify-between gap-1 shadow-2xs ${getTaskStatusStyle(
                          t.status
                        )}`}
                        title={`${t.title} (${t.projectName})`}
                      >
                        <div className="flex items-center gap-1 min-w-0">
                          {getPriorityDot(t.priority)}
                          <span className="truncate">{t.title}</span>
                        </div>
                        {t.assigneeAvatar && (
                          <img
                            src={t.assigneeAvatar}
                            alt=""
                            className="w-3.5 h-3.5 rounded-full shrink-0 object-cover"
                          />
                        )}
                      </div>
                    ))}

                    {overflowCount > 0 && (
                      <button
                        onClick={() => setSelectedDayTasks({ dateStr: dayItem.dateKey, tasks: dayTasks })}
                        className="w-full text-left text-[10px] font-extrabold text-[#a80800] hover:text-[#800600] hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors"
                      >
                        + {overflowCount} more...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW GRID */}
      {viewType === 'week' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="grid grid-cols-7 divide-x divide-slate-200 bg-slate-50 border-b border-slate-200 text-center py-3">
            {weekDays.map(w => (
              <div key={w.dateKey} className="px-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {w.dayName}
                </span>
                <span
                  className={`inline-flex items-center justify-center text-sm font-extrabold w-7 h-7 rounded-full mt-1 ${
                    w.isToday ? 'bg-[#ea1d25] text-white shadow-2xs' : 'text-slate-900'
                  }`}
                >
                  {w.date.getDate()}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[420px] bg-slate-50/30">
            {weekDays.map(w => {
              const dayTasks = tasksByDate[w.dateKey] || [];

              return (
                <div key={w.dateKey} className="bg-white p-2 space-y-2">
                  {dayTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-300 font-medium py-8">
                      No tasks
                    </div>
                  ) : (
                    dayTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all space-y-1.5 hover:shadow-xs ${getTaskStatusStyle(
                          t.status
                        )}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 border border-black/5 truncate max-w-[80px]">
                            {t.projectName}
                          </span>
                          {getPriorityDot(t.priority)}
                        </div>

                        <h5 className="font-bold text-slate-900 leading-snug line-clamp-2">
                          {t.title}
                        </h5>

                        <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] text-slate-500">
                          <span className="truncate max-w-[70px]">{t.assigneeName}</span>
                          <span className="capitalize font-semibold text-[9px]">
                            {t.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overflow Day Modal */}
      {selectedDayTasks && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Tasks due on {selectedDayTasks.dateStr}</h3>
                <p className="text-xs text-slate-400">{selectedDayTasks.tasks.length} total tasks scheduled</p>
              </div>
              <button
                onClick={() => setSelectedDayTasks(null)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-2.5">
              {selectedDayTasks.tasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTask(t);
                    setSelectedDayTasks(null);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all space-y-1.5 hover:shadow-xs ${getTaskStatusStyle(
                    t.status
                  )}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#a80800] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                      {t.projectName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getPriorityDot(t.priority)}
                      <span className="text-[10px] font-bold uppercase text-slate-600">{t.priority}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs">{t.title}</h4>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <img src={t.assigneeAvatar} alt="" className="w-4 h-4 rounded-full" />
                      <span>{t.assigneeName}</span>
                    </div>
                    <span className="font-bold text-slate-700 capitalize">{t.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
