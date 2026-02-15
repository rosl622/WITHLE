"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Calendar, Phone, MapPin, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchReservations();
    }, []);

    async function fetchReservations() {
        let dbReservations = [];

        const { data, error } = await supabase
            .from('reservations')
            .select(`
        *,
        funeral_homes (
          name,
          address
        )
      `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching reservations:", error);
        } else {
            dbReservations = data || [];
        }

        // Fetch mock reservations from localStorage (for CSV items)
        let mockReservations = [];
        try {
            const stored = localStorage.getItem('mock_reservations');
            if (stored) {
                mockReservations = JSON.parse(stored);
            }
        } catch (e) {
            console.error("Error fetching mock reservations:", e);
        }

        // Merge and sort
        const allReservations = [...mockReservations, ...dbReservations].sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        setReservations(allReservations);
        setIsLoading(false);
    }

    const handleStatusChange = async (id, newStatus) => {
        // Check if it's a mock reservation
        if (id.toString().startsWith('mock-')) {
            try {
                const stored = JSON.parse(localStorage.getItem('mock_reservations') || '[]');
                const updated = stored.map(res =>
                    res.id === id ? { ...res, status: newStatus } : res
                );
                localStorage.setItem('mock_reservations', JSON.stringify(updated));
                fetchReservations(); // Refresh locally
            } catch (e) {
                console.error("Failed to update mock status:", e);
            }
            return;
        }

        const { error } = await supabase
            .from('reservations')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchReservations(); // Refresh list
        }
    };

    return (
        <div className="min-h-screen bg-bg-base p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-serif text-text-primary">
                        예약 관리 대시보드
                    </h1>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-bold text-green-dark">
                        총 예약 {reservations.length}건
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-main"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-border-main overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-muted text-text-secondary text-sm border-b border-border-main">
                                        <th className="p-4 font-bold">상태</th>
                                        <th className="p-4 font-bold">예약번호</th>
                                        <th className="p-4 font-bold">장례식장</th>
                                        <th className="p-4 font-bold">예약일시</th>
                                        <th className="p-4 font-bold">보호자</th>
                                        <th className="p-4 font-bold">연락처</th>
                                        <th className="p-4 font-bold text-right">관리</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-main">
                                    {reservations.map((res) => (
                                        <tr key={res.id} className="hover:bg-green-50/50 transition-colors">
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {res.status === 'confirmed' ? '확정됨' :
                                                        res.status === 'cancelled' ? '취소됨' : '대기중'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-text-muted">#{res.id}</td>
                                            <td className="p-4 font-medium text-text-primary">
                                                {res.funeral_homes?.name}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-text-muted" />
                                                    {res.date}
                                                </div>
                                                <div className="flex items-center gap-1 text-text-muted text-xs mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {res.time}
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold">{res.customer_name}</td>
                                            <td className="p-4 text-sm font-mono">{res.customer_phone}</td>
                                            <td className="p-4 text-right">
                                                {res.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(res.id, 'confirmed')}
                                                            className="bg-green-main text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-mid"
                                                        >
                                                            승인
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(res.id, 'cancelled')}
                                                            className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200"
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                )}
                                                {res.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleStatusChange(res.id, 'pending')}
                                                        className="text-xs text-text-muted underline hover:text-text-primary"
                                                    >
                                                        상태 변경
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {reservations.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="p-10 text-center text-text-muted">
                                                아직 접수된 예약이 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
