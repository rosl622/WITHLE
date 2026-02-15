"use client";

import { useState } from "react";
import { X, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function BookingModal({ isOpen, onClose, home }) {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Check if it's a CSV item (string ID)
            const isCsvItem = typeof home.id === 'string' && home.id.startsWith('csv-');

            if (isCsvItem) {
                // For CSV items specifically, we bypass Supabase because the DB expects integer IDs.
                // In a real production scenario, we would need to migrate the DB to support string IDs or sync CSV data to DB.
                // For now, we simulate success to allow the flow to complete.

                const mockReservation = {
                    id: `mock-${Date.now()}`,
                    home_id: home.id,
                    funeral_homes: {
                        name: home.name,
                        address: home.address
                    },
                    date: date,
                    time: time,
                    customer_name: name,
                    customer_phone: phone,
                    status: 'pending',
                    created_at: new Date().toISOString()
                };

                // Save to localStorage for demo purposes so it shows up in dashboard
                try {
                    const existing = JSON.parse(localStorage.getItem('mock_reservations') || '[]');
                    localStorage.setItem('mock_reservations', JSON.stringify([mockReservation, ...existing]));
                } catch (e) {
                    console.error("Failed to save mock reservation:", e);
                }

                console.log("Mock reservation saved:", mockReservation);

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));
            } else {
                // Legacy DB items
                const { data, error } = await supabase
                    .from('reservations')
                    .insert([
                        {
                            home_id: home.id,
                            date: date,
                            time: time,
                            customer_name: name,
                            customer_phone: phone,
                            status: 'pending' // Default status
                        }
                    ]);

                if (error) throw error;
            }

            // Success
            router.push("/reservation/success");

        } catch (error) {
            console.error("Booking failed:", error);
            alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full md:w-[480px] rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-main flex justify-between items-center bg-bg-card">
                    <h2 className="text-lg font-bold">장례식장 예약하기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-bg-muted rounded-full">
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {/* Summary */}
                    <div className="flex items-center gap-3 mb-6 bg-green-50 p-3 rounded-xl border border-green-100">
                        <img src={home.image} alt={home.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                            <div className="font-bold text-text-primary">{home.name}</div>
                            <div className="text-xs text-text-muted">{home.address}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Date & Time Selection */}
                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-green-dark" /> 방문 희망 일시
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-border-main focus:border-green-main focus:ring-1 focus:ring-green-main outline-none text-sm"
                                />
                                <select
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-border-main focus:border-green-main focus:ring-1 focus:ring-green-main outline-none text-sm appearance-none bg-white"
                                >
                                    <option value="">시간 선택</option>
                                    <option value="09:00">09:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="13:00">13:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="17:00">17:00</option>
                                    <option value="19:00">19:00 (야간)</option>
                                </select>
                            </div>
                        </div>

                        {/* User Info */}
                        <div>
                            <label className="block text-sm font-bold mb-2">예약자 정보</label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="보호자 성함 (예: 홍길동)"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-border-main focus:border-green-main focus:ring-1 focus:ring-green-main outline-none text-sm"
                                />
                                <input
                                    type="tel"
                                    placeholder="휴대폰 번호 (- 없이 입력)"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-border-main focus:border-green-main focus:ring-1 focus:ring-green-main outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Checkbox */}
                        <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer bg-bg-muted p-3 rounded-lg">
                            <input type="checkbox" required className="accent-green-main w-4 h-4" />
                            <span>개인정보 수집 및 이용에 동의합니다.</span>
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-main hover:bg-green-mid disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                "예약 접수하기"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
