import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { FiSearch, FiMapPin, FiDroplet, FiFilter } from 'react-icons/fi';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface AvailabilityRecord {
  bloodbank_name: string;
  bloodbank_id: string;
  city: string;
  state: string;
  blood_group: string;
  units: number;
  contact?: string;
}

export default function BloodAvailabilitySearch() {
  const [results, setResults] = useState<AvailabilityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (filterCity) params.set('city', filterCity);
      if (filterState) params.set('state', filterState);
      if (filterBloodGroup) params.set('blood_group', filterBloodGroup);
      const res = await api.get(`/blood/availability?${params.toString()}`);
      setResults(res.data?.data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const urgencyColor = (units: number) => {
    if (units >= 10) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
    if (units >= 5) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Blood Availability Search
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Find available blood from blood banks by location and blood group</p>
        </div>

        {/* Search Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FiFilter className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold">Search Filters</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Blood Group</label>
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Any Blood Group</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">City</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  placeholder="e.g., Chennai, Mumbai"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">State</label>
              <input
                type="text"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                placeholder="e.g., Tamil Nadu"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            <FiSearch />
            {loading ? 'Searching...' : 'Search Blood Banks'}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiDroplet className="text-red-500 text-xl" />
                <h2 className="font-bold text-lg">
                  {loading ? 'Searching...' : `${results.length} Blood Banks Found`}
                </h2>
              </div>
              <div className="flex gap-3 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">● High ≥10 units</span>
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">● Med 5-9 units</span>
                <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">● Low &lt;5 units</span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-semibold">No blood banks found for those filters</p>
                <p className="text-sm mt-2">Try broadening your search criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-left">
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Blood Bank</th>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Location</th>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Blood Group</th>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Available Units</th>
                      <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0">
                              {r.bloodbank_name?.[0]?.toUpperCase() || 'B'}
                            </div>
                            <span className="font-semibold">{r.bloodbank_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <FiMapPin className="text-xs flex-shrink-0" />
                            {[r.city, r.state].filter(Boolean).join(', ') || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-xs">
                            {r.blood_group}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold">{r.units} units</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${urgencyColor(r.units)}`}>
                            {r.units >= 10 ? 'Adequate' : r.units >= 5 ? 'Moderate' : 'Critical Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
