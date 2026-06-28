import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { FiUsers, FiHeart, FiActivity, FiShield, FiCheckCircle, FiXCircle, FiRefreshCw, FiEye } from 'react-icons/fi';

interface BloodBank {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  is_email_verified: boolean;
  status?: string;
  created_at: string;
}

interface Hospital {
  id: string;
  name: string;
  email: string;
  city?: string;
  state?: string;
  doctor_name?: string;
  created_at: string;
}

interface Stats {
  total_bloodbanks: number;
  total_hospitals: number;
  total_requests: number;
  pending_requests: number;
  fulfilled_requests: number;
  total_donors: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bloodbanks' | 'hospitals'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [bloodbanks, setBloodbanks] = useState<BloodBank[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, bbRes, hospRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/bloodbanks'),
        api.get('/admin/hospitals'),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || null);
      if (bbRes.status === 'fulfilled') setBloodbanks(bbRes.value.data?.data || []);
      if (hospRes.status === 'fulfilled') setHospitals(hospRes.value.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const statCards = [
    { label: 'Blood Banks', value: stats?.total_bloodbanks ?? '—', icon: FiHeart, color: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/30' },
    { label: 'Hospitals', value: stats?.total_hospitals ?? '—', icon: FiActivity, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { label: 'Total Requests', value: stats?.total_requests ?? '—', icon: FiShield, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
    { label: 'Total Donors', value: stats?.total_donors ?? '—', icon: FiUsers, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bloodbanks', label: `Blood Banks (${bloodbanks.length})` },
    { id: 'hospitals', label: `Hospitals (${hospitals.length})` },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Admin Control Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and oversee the entire Smart Blood Bank network</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-purple-50 hover:text-purple-600 transition-all shadow-sm"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, shadow }) => (
            <div key={label} className={`rounded-3xl p-6 bg-gradient-to-br ${color} text-white shadow-xl ${shadow}`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className="text-2xl text-white/80" />
                <div className="w-8 h-8 rounded-xl bg-white/20" />
              </div>
              <div className="text-3xl font-black">{value}</div>
              <div className="text-sm text-white/80 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Request Progress */}
        {stats && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-8">
            <h2 className="font-bold text-lg mb-6">Blood Request Summary</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 p-5">
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.pending_requests}</div>
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-500 mt-1">Pending</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-5">
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.fulfilled_requests}</div>
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-500 mt-1">Fulfilled</div>
              </div>
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
                <div className="text-3xl font-black">{stats.total_requests}</div>
                <div className="text-sm font-semibold text-slate-500 mt-1">Total</div>
              </div>
            </div>
            {stats.total_requests > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span>Fulfillment rate</span>
                  <span>{Math.round((stats.fulfilled_requests / stats.total_requests) * 100)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all"
                    style={{ width: `${Math.round((stats.fulfilled_requests / stats.total_requests) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-900 text-purple-600 border-t border-l border-r border-slate-200 dark:border-slate-800 -mb-px'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Blood Banks Table */}
        {activeTab === 'bloodbanks' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
            {bloodbanks.length === 0 && !loading ? (
              <div className="text-center py-16 text-slate-400">
                <FiHeart className="mx-auto text-4xl mb-3 text-red-200" />
                <p>No blood banks registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60">
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">#</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Name</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Email</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Location</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Email Verified</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bloodbanks.map((bb, i) => (
                      <tr key={bb.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                              {bb.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-semibold">{bb.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{bb.email}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{[bb.city, bb.state].filter(Boolean).join(', ') || '—'}</td>
                        <td className="px-6 py-4">
                          {bb.is_email_verified ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                              <FiCheckCircle /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                              <FiXCircle /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(bb.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Hospitals Table */}
        {activeTab === 'hospitals' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
            {hospitals.length === 0 && !loading ? (
              <div className="text-center py-16 text-slate-400">
                <FiActivity className="mx-auto text-4xl mb-3 text-blue-200" />
                <p>No hospitals registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60">
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">#</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Hospital</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Email</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Doctor</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Location</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase text-xs tracking-wide">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {hospitals.map((h, i) => (
                      <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                              {h.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-semibold">{h.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{h.email}</td>
                        <td className="px-6 py-4 text-slate-500">{h.doctor_name || '—'}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{[h.city, h.state].filter(Boolean).join(', ') || '—'}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(h.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Overview placeholder */}
        {activeTab === 'overview' && !loading && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FiHeart className="text-red-500" /> Recent Blood Banks</h3>
              <div className="space-y-3">
                {bloodbanks.slice(0, 5).map((bb) => (
                  <div key={bb.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                      {bb.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm truncate">{bb.name}</div>
                      <div className="text-xs text-slate-400 truncate">{bb.email}</div>
                    </div>
                    {bb.is_email_verified && (
                      <FiCheckCircle className="text-emerald-500 flex-shrink-0 ml-auto" />
                    )}
                  </div>
                ))}
                {bloodbanks.length === 0 && <p className="text-slate-400 text-sm">No blood banks yet</p>}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FiActivity className="text-blue-500" /> Recent Hospitals</h3>
              <div className="space-y-3">
                {hospitals.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                      {h.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm truncate">{h.name}</div>
                      <div className="text-xs text-slate-400 truncate">{h.email}</div>
                    </div>
                  </div>
                ))}
                {hospitals.length === 0 && <p className="text-slate-400 text-sm">No hospitals yet</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
