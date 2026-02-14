import Link from "next/link";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";

export default function ReservationSuccess() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base px-4 py-20 text-center animate-fade-in">
            <div className="bg-green-100 p-6 rounded-full mb-6">
                <CheckCircle2 className="w-16 h-16 text-green-main" />
            </div>

            <h1 className="text-3xl font-bold font-serif text-text-primary mb-4">
                예약이 확정되었습니다!
            </h1>

            <p className="text-text-secondary mb-8 max-w-md">
                입력하신 연락처로 예약 확인 문자가 발송되었습니다.<br />
                장례식장 담당자가 배정되면 곧 연락드리겠습니다.
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-main w-full max-w-sm mb-8 text-left">
                <h3 className="font-bold text-lg mb-4 text-center">예약 안내</h3>
                <ul className="text-sm text-text-secondary space-y-3">
                    <li className="flex items-start">
                        <span className="bg-green-100 text-green-dark text-xs p-1 rounded mr-2 mt-0.5">TIP 1</span>
                        <span>아이의 편안한 이동을 위해 담요나 타월을 준비해주세요.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="bg-green-100 text-green-dark text-xs p-1 rounded mr-2 mt-0.5">TIP 2</span>
                        <span>추억이 담긴 사진이나 장난감을 함께 가져오셔도 좋습니다.</span>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <Link
                    href="/"
                    className="flex-1 bg-green-main hover:bg-green-mid text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center"
                >
                    <Home className="w-5 h-5 mr-2" />
                    홈으로 돌아가기
                </Link>
                <Link
                    href="/memorial/intro"
                    className="flex-1 bg-white border border-green-main text-green-main hover:bg-green-bg font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center"
                >
                    추모 공간 만들기
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
            </div>
        </div>
    );
}
