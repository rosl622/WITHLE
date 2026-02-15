import { MapPin } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[480px] flex items-center justify-center bg-gradient-to-br from-green-dark via-green-main to-green-light text-white overflow-hidden py-20">
            {/* Abstract Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-dark/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6 border border-white/30 animate-fade-in">
                    우리 아이와 이별하는 가장 현명한 방법
                </span>
                <h1 className="text-2xl md:text-5xl font-bold mb-6 font-serif leading-tight text-shadow-sm animate-fade-in break-keep" style={{ animationDelay: '0.1s' }}>
                    반려동물 장례식장,<br />
                    투명하게 비교하고 예약하세요
                </h1>
                <p className="text-sm md:text-xl text-white/90 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    전국 73개 허가받은 장례식장의 가격, 시설, 후기를 한눈에 확인하세요.
                </p>

                {/* Search Bar */}
                <div className="bg-white p-1.5 md:p-2 rounded-full shadow-lg flex items-center max-w-2xl mx-auto animate-fade-in transform hover:scale-[1.01] transition-transform" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center pl-3 md:pl-4 text-gray-400">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="지역을 입력하세요 (예: 강남구, 분당)"
                        className="flex-grow px-3 py-2 md:px-4 md:py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base min-w-0"
                    />
                    <button className="bg-green-dark hover:bg-green-mid text-white px-4 py-2 md:px-8 md:py-3 rounded-full font-bold transition-all shadow-md text-sm md:text-base whitespace-nowrap">
                        검색
                    </button>
                </div>
            </div>
        </section>
    );
}
