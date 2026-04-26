import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft, Filter, SlidersHorizontal, MapPin, Grid } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import * as searchApi from '../../api/searchApi';
import ItemCard from '../../components/ItemCard';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';
    
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = async (searchQuery) => {
        setIsLoading(true);
        try {
            const res = await searchApi.searchReports({ q: searchQuery });
            setResults(res.data);
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`, { replace: true });
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSearch(query);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-dark-blue">Quick Search</h1>
                    <p className="text-text-secondary mt-1">Found {results.length} results for "{initialQuery}"</p>
                </div>
                
                <form onSubmit={onSubmit} className="flex gap-2 w-full md:w-96">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input 
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Try 'Blue backpack' or 'Keys'..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-border-custom rounded-2xl outline-none focus:border-medium-blue shadow-sm"
                        />
                    </div>
                </form>
             </div>

             {isLoading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[1, 2, 3].map(i => (
                         <div key={i} className="h-96 bg-white border border-border-custom rounded-[32px] animate-pulse" />
                     ))}
                 </div>
             ) : results.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                     {results.map(item => (
                         <ItemCard key={item._id} item={item} />
                     ))}
                 </div>
             ) : (
                 <div className="bg-white border border-border-custom rounded-[40px] py-40 text-center">
                    <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center mx-auto mb-6">
                        <SearchIcon className="w-10 h-10 text-text-secondary opacity-10" />
                    </div>
                    <h3 className="text-xl font-bold text-dark-blue">No matches found</h3>
                    <p className="text-text-secondary mt-2 max-w-xs mx-auto text-sm italic">
                        Try searching for keywords instead of full sentences. For example, search "Wallet" instead of "I lost my red wallet".
                    </p>
                 </div>
             )}
        </div>
    );
};

export default SearchResults;
