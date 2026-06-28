import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { FiSearch, FiFilter, FiRefreshCw, FiUser, FiDroplet, FiMapPin } from 'react-icons/fi';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface Donor {
  id: string;
  name?: string;
  phone: string;
  gender: string;
  blood_group: string;
  date_of_birth: string;
  city: string;
  state: string;
  weight_kg: number;
  medical_history?: string;
  created_at: string;
}

function calcAge(dob: string) {
  if (!dob) return '—';
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' yrs';
}

export default function DonorAvailabilityList() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filtered, setFiltered] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [filterBG, setFilterBG] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/donors');
      setDonors(res.data?.data || []);
      setFiltered(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = [...donors];
    if (filterBG) list = list.filter((d) => d.blood_group === filterBG);
    if (filterCity) list = list.filter((d) => d.city?.toLowerCase().includes(filterCity.toLowerCase()));
    if (searchText) list = list.filter((d) => d.phone?.includes(searchText) || d.name?.toLowerCase().includes(searchText.toLowerCase()));
    setFiltered(list);
  }, [filterBG, filterCity, searchText, donors]);

  const bgColors: Record<string, string> = {
    'A+': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'A-': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'B+': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'B-': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'AB+': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'AB-': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'O+': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'O-': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  const bloodGroupCounts = BLOOD_GROUPS.reduce<Record<string, number>>((acc, bg) => {
    acc[bg] = donors.filter((d) => d.blood_group === bg).length;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              Donor Registry
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">All donors registered under your blood bank</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Blood Group Summary */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setFilterBG(filterBG === bg ? '' : bg)}
              className={`rounded-2xl p-3 text-center transition-all ring-2 ${filterBG === bg ? 'ring-red-500 scale-105' : 'ring-transparent'} ${bgColors[bg] || 'bg-slate-100'} hover:scale-105 hover:shadow-md`}
            >
              <div className="text-2xl font-black">{bloodGroupCounts[bg] || 0}</div>
              <div className="text-xs font-bold mt-0.5">{bg}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name or phone..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="relative">
              <FiDroplet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterBG}
                onChange={(e) => setFilterBG(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                placeholder="Filter by city..."
                className="pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            {(filterBG || filterCity || searchText) && (
              <button
                onClick={() => { setFilterBG(''); setFilterCity(''); setSearchText(''); }}
                className="px-5 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 font-semibold text-sm hover:bg-red-100 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Donor Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold">{filtered.length} of {donors.length} donors</span>
            {filterBG && <span className="ml-3 px-3 py-1 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">{filterBG}</span>}
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FiUser className="mx-auto text-5xl mb-4 text-slate-200 dark:text-slate-700" />
              <p className="text-lg font-semibold">No donors found</p>
              <p className="text-sm mt-2">Register your first donor from the Blood Bank Dashboard</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">#</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Donor</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Blood Group</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Age / Gender</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Location</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Weight</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((d, i) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 text-xs">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {(d.name || d.phone)?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">{d.name || 'Donor'}</div>
                            <div className="text-xs text-slate-400">{d.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${bgColors[d.blood_group] || 'bg-slate-100 text-slate-600'}`}>
                          {d.blood_group}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        <div>{calcAge(d.date_of_birth)}</div>
                        <div className="text-xs capitalize text-slate-400">{d.gender}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 text-xs">
                          <FiMapPin className="flex-shrink-0" />
                          {[d.city, d.state].filter(Boolean).join(', ') || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{d.weight_kg ? `${d.weight_kg} kg` : '—'}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
