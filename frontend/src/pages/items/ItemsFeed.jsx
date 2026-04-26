import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search as SearchIcon, MapPin, Calendar, 
  SlidersHorizontal, ArrowRight, LockKeyhole, 
  Info, X, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as reportsApi from '../../api/reportsApi';
import ItemCard from '../../components/ItemCard';
import { categories } from '../../utils/getCategoryIcon';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const ItemsFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'lost'; // 'lost' or 'found'
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLostReport, setHasLostReport] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'published',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || ''
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === 'lost') {
        res = await reportsApi.getReports({ 
          type: 'lost', 
          category: filters.category,
          search: filters.search,
          status: filters.status,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          page
        });
        // Normalize response structure if different
        setItems(res.data.reports || res.data);
        setTotalPages(res.data.totalPages || res.totalPages || 1);
        setTotalResults(res.data.totalResults || res.totalResults || (res.data.reports?.length || 0));
        setHasLostReport(true);
      } else {
        res = await reportsApi.getRelevantFoundItems({ 
          page, 
          category: filters.category,
          location: filters.search, // FoundFeed uses location for search
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo
        });
        setItems(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalResults(res.totalResults || res.data.length);
        setHasLostReport(true);
      }
    } catch (error) {
      if (mode === 'found' && error.response?.status === 403) {
        setHasLostReport(false);
      } else {
        console.error('Error fetching feed:', error);
        toast.error('Failed to load items. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // Update URL params
    const newParams = { mode, page };
    if (filters.category) newParams.category = filters.category;
    if (filters.search) newParams.search = filters.search;
    if (filters.status !== 'published') newParams.status = filters.status;
    if (filters.dateFrom) newParams.dateFrom = filters.dateFrom;
    if (filters.dateTo) newParams.dateTo = filters.dateTo;
    setSearchParams(newParams);
  }, [mode, page, filters]);

  const handleTabChange = (newMode) => {
    setSearchParams({ mode: newMode, page: 1 });
    setItems([]);
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', search: '', status: 'published', dateFrom: '', dateTo: '' });
    setPage(1);
  };

  const tabItems = [
    { id: 'lost', label: 'Lost Items', icon: SearchIcon },
    { id: 'found', label: 'Found Items', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-secondary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <h1 className="text-4xl font-black text-dark-blue mb-3 tracking-tight">
              {mode === 'lost' ? 'Lost Items Feed' : 'Found Items For You'}
            </h1>
            <p className="text-text-secondary font-medium opacity-80 leading-relaxed">
              {mode === 'lost' 
                ? "Browse items posted by fellow students who've lost something. If you've found any of these, let them know!" 
                : "Results are personalized based on your active lost reports. Items are ranked by how closely they match what you lost."}
            </p>
          </div>
          
          <Tabs 
            tabs={tabItems} 
            activeTab={mode} 
            onChange={handleTabChange}
            className="self-start md:self-end"
          />
        </div>

        {/* Search & Statistics Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="flex-1 relative group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-dark-blue transition-colors" />
            <input 
              type="text"
              placeholder={mode === 'lost' ? "Search titles, descriptions..." : "Search relevant locations..."}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-border-custom rounded-[2rem] outline-none focus:ring-4 focus:ring-dark-blue/5 focus:border-dark-blue transition-all shadow-[0_4px_15px_-3px_rgba(0,0,0,0.04)] font-medium"
            />
          </div>
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-[2rem] border border-border-custom shadow-sm overflow-hidden whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-dark-blue animate-pulse" />
            <span className="text-sm font-bold text-dark-blue uppercase tracking-widest leading-none mt-0.5">
              {totalResults} {mode} items discovered
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Enhanced Filter Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-border-custom rounded-[2.5rem] p-8 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-dark-blue" />
                  <h3 className="font-bold text-dark-blue text-sm uppercase tracking-wider">Filters</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters} 
                  className="text-red-cta font-bold text-xs p-0 hover:bg-transparent"
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-10">
                {/* Categories */}
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">Category</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map((cat) => {
                      const CatIcon = cat.icon;
                      const isSelected = filters.category === cat.name;
                      return (
                        <button 
                          key={cat.name}
                          onClick={() => handleFilterChange('category', isSelected ? '' : cat.name)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group",
                            isSelected 
                              ? "bg-dark-blue text-white shadow-lg shadow-dark-blue/10" 
                              : "hover:bg-secondary-bg text-text-secondary"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                              isSelected ? "bg-white/20" : "bg-secondary-bg group-hover:bg-white"
                            )}>
                              <CatIcon size={16} />
                            </div>
                            <span className="text-sm font-bold">{cat.name}</span>
                          </div>
                          {isSelected && <ArrowRight size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">Timeline</h4>
                  <div className="space-y-3">
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-dark-blue" />
                      <input 
                        type="date" 
                        className="w-full pl-10 pr-3 py-3 bg-secondary-bg border-none rounded-2xl text-xs font-bold text-dark-blue outline-none focus:ring-2 focus:ring-dark-blue/5 transition-all"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      />
                    </div>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-dark-blue" />
                      <input 
                        type="date" 
                        className="w-full pl-10 pr-3 py-3 bg-secondary-bg border-none rounded-2xl text-xs font-bold text-dark-blue outline-none focus:ring-2 focus:ring-dark-blue/5 transition-all"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {mode === 'lost' && (
                  <div>
                    <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4 opacity-50">Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['published', 'matched', 'resolved'].map(s => (
                        <button 
                          key={s}
                          onClick={() => handleFilterChange('status', s)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filters.status === s 
                              ? "bg-dark-blue text-white shadow-md shadow-dark-blue/10" 
                              : "bg-secondary-bg text-text-secondary hover:bg-white border border-transparent hover:border-border-custom"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Grid Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {mode === 'found' && !loading && !hasLostReport ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-border-custom rounded-[3rem] p-16 text-center shadow-xl shadow-dark-blue/5"
                >
                  <div className="w-20 h-20 bg-secondary-bg text-dark-blue rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <LockKeyhole className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black text-dark-blue mb-4 tracking-tight">Access Restricted</h2>
                  <p className="text-text-secondary mb-10 leading-relaxed font-medium max-w-md mx-auto opacity-80">
                    To maintain portal security, found items are only visible to students with active lost reports. 
                    This helps us rank results specifically for your needs.
                  </p>
                  
                  <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[2rem] flex gap-4 text-left mb-12 max-w-lg mx-auto">
                    <Info className="w-6 h-6 text-dark-blue flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-dark-blue leading-relaxed">
                      Reporting what you lost allows our matching engine to calculate relevance scores and notify you immediately of potential matches.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                      to="/report-lost"
                      variant="primary-blue"
                      size="lg"
                      className="w-full sm:w-auto px-10 py-4 font-black rounded-2xl"
                    >
                      Report Lost Item
                    </Button>
                    <Button 
                      onClick={() => handleTabChange('lost')}
                      variant="ghost"
                      size="lg"
                      className="text-dark-blue font-black underline underline-offset-8"
                    >
                      Browse Lost Feed
                    </Button>
                  </div>
                </motion.div>
              ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[450px] bg-white border border-border-custom rounded-[2.5rem] animate-pulse" />
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="space-y-12">
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    {items.map((item) => (
                      <ItemCard key={item._id} item={item} />
                    ))}
                  </motion.div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-10 border-t border-border-custom/50">
                      <Button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        variant="outlined-blue"
                        isIconOnly
                        leftIcon={ChevronLeft}
                        size="lg"
                        className="rounded-full shadow-sm hover:shadow-md"
                      />
                      
                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={cn(
                              "w-12 h-12 rounded-2xl font-black text-sm transition-all duration-300",
                              page === i + 1 
                                ? "bg-dark-blue text-white shadow-lg shadow-dark-blue/20 scale-110" 
                                : "bg-white text-text-secondary hover:bg-secondary-bg hover:text-dark-blue border border-border-custom"
                            )}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <Button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        variant="outlined-blue"
                        isIconOnly
                        leftIcon={ChevronRight}
                        size="lg"
                        className="rounded-full shadow-sm hover:shadow-md"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-32 text-center bg-white border border-border-custom rounded-[3rem] shadow-sm px-8"
                >
                  <div className="w-24 h-24 bg-secondary-bg rounded-full flex items-center justify-center mb-8 shadow-inner">
                    <SearchIcon className="w-10 h-10 text-dark-blue opacity-20" />
                  </div>
                  <h3 className="text-3xl font-black text-dark-blue mb-3 tracking-tight">No Items Discovered</h3>
                  <p className="text-text-secondary font-medium mt-2 max-w-xs mx-auto leading-relaxed opacity-70">
                    We couldn't find any {mode} items matching your current filters or active reports.
                  </p>
                  <Button 
                    onClick={clearFilters}
                    variant="primary-blue"
                    size="lg"
                    className="mt-10 font-black px-12 py-4 rounded-2xl"
                  >
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ItemsFeed;
