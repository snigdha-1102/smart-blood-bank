import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { api } from '../utils/api';
import { FiRefreshCw, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiHeart } from 'react-icons/fi';

interface BloodRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  units_required: number;
  emergency_level: 'low' | 'medium' | 'high';
  reason: string;
  doctor_name: string;
  required_date: string;
  status: 'pending' | 'fulfilled' | 'partially_fulfilled' | 'rejected';
  units_fulfilled?: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', icon: <FiClock /> },
  fulfilled: { label: 'Fulfilled', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400', icon: <FiCheckCircle /> },
  partially_fulfilled: { label: 'Partial', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', icon: <FiLoader /> },
  rejected: { label: 'Rejected', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', icon: <FiXCircle /> },
};

const emergencyConfig: Record<string, string> = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  low: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
};

export default function BloodRequestStatus() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'fulfilled' | 'rejected'>('all');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blood-requests/my');
      setRequests(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter || (filter === 'fulfilled' && r.status === 'partially_fulfilled'));
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    fulfilled: requests.filter((r) => r.status === 'fulfilled' || r.status === 'partially_fulfilled').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              My Blood Requests
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track the status of all requests raised by your hospital</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'all', label: 'Total Requests', color: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-100 dark:bg-slate-800' },
            { key: 'pending', label: 'Pending', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { key: 'fulfilled', label: 'Fulfilled', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { key: 'rejected', label: 'Rejected', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
          ].map(({ key, label, color, bg }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`${bg} rounded-2xl p-5 text-left transition-all ring-2 ${filter === key ? 'ring-red-500' : 'ring-transparent'} hover:ring-red-300`}
            >
              <div className={`text-3xl font-black ${color}`}>{counts[key as keyof typeof counts]}</div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{label}</div>
            </button>
          ))}
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FiHeart className="mx-auto text-5xl mb-4 text-red-200" />
              <p className="text-lg font-semibold">No requests found</p>
              <p className="text-sm mt-2">Your hospital hasn't raised any blood requests yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-left">
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Patient</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Blood Group</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Units</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Urgency</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Required By</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((req) => {
                    const sc = statusConfig[req.status] || statusConfig.pending;
                    return (
                      <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{req.patient_name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{req.reason}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-xs">
                            {req.blood_group}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold">{req.units_required} <span className="text-slate-400 font-normal">needed</span></div>
                          {req.units_fulfilled !== undefined && req.units_fulfilled > 0 && (
                            <div className="text-xs text-emerald-500 mt-0.5">{req.units_fulfilled} fulfilled</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold capitalize ${emergencyConfig[req.emergency_level]}`}>
                            {req.emergency_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                          {req.required_date ? new Date(req.required_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${sc.color}`}>
                            {sc.icon}
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
