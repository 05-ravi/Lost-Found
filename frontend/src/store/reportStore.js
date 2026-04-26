import { create } from 'zustand';

const useReportStore = create((set) => ({
  reports: [],
  myReports: [],
  filters: {
    type: 'lost',
    category: '',
    status: 'published',
  },

  setReports: (reports) => set({ reports }),
  setMyReports: (myReports) => set({ myReports }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  
  addReport: (report) => set((state) => ({
    reports: [report, ...state.reports],
    myReports: report.reportedBy?._id === state.user?._id ? [report, ...state.myReports] : state.myReports
  })),

  updateReportInStore: (id, updatedData) => set((state) => ({
    reports: state.reports.map(r => r._id === id ? { ...r, ...updatedData } : r),
    myReports: state.myReports.map(r => r._id === id ? { ...r, ...updatedData } : r)
  })),

  removeReport: (id) => set((state) => ({
    reports: state.reports.filter(r => r._id !== id),
    myReports: state.myReports.filter(r => r._id !== id)
  })),
}));

export default useReportStore;
