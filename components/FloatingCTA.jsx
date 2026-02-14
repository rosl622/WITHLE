import { PhoneCall } from "lucide-react";

export default function FloatingCTA() {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <a
                href="tel:1577-0000"
                className="flex items-center gap-2 bg-terra-main text-white px-5 py-3 rounded-full shadow-lg btn-pulse hover:bg-[#A96B56] transition-colors font-bold"
            >
                <PhoneCall className="w-5 h-5" />
                <span className="hidden md:inline">긴급 장례 상담</span>
                <span className="md:hidden">상담</span>
            </a>
        </div>
    );
}
