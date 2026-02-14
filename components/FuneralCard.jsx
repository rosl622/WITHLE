import Link from "next/link";
import { MapPin, Star, Phone, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function FuneralCard({ home }) {
    const formatPrice = (price) => {
        return (price / 10000).toLocaleString() + "만원~";
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-border-main p-4 md:p-5 card-hover flex flex-col md:flex-row gap-5 animate-fade-in relative overflow-hidden">
            {/* 24h Badge (Top Left Overlay similar to design) */}
            {home.open24h && (
                <div className="absolute top-0 left-0 bg-terra-main text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">
                    24H 운영
                </div>
            )}

            {/* Image Section */}
            <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                <img
                    src={home.image}
                    alt={home.name}
                    className="w-full h-full object-cover"
                />
                {home.distance && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {home.distance}km
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold font-serif text-text-primary">{home.name}</h3>
                                {home.certified && (
                                    <span className="bg-green-main text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center">
                                        <CheckCircle2 className="w-3 h-3 mr-0.5" />
                                        인증
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-text-secondary">{home.address}</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end text-terra-main font-bold">
                                <Star className="w-4 h-4 fill-current mr-1" />
                                {home.rating}
                            </div>
                            <p className="text-xs text-text-muted">후기 {home.reviewCount}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {home.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-bg-muted text-text-secondary px-2 py-1 rounded-md">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 text-xs text-text-secondary mb-4">
                        {home.facilities.slice(0, 4).map((facility, index) => (
                            <span key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-green-mid rounded-full mr-1"></span>
                                {facility}
                            </span>
                        ))}
                    </div>

                    {/* Review Highlight */}
                    {home.reviewHighlight && (
                        <div className="text-xs text-text-muted italic border-l-2 border-terra-border pl-2 py-1 mb-4 bg-terra-bg/30 rounded-r-md">
                            "{home.reviewHighlight}"
                        </div>
                    )}
                </div>

                {/* Footer: Price & Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pt-3 border-t border-border-main">
                    <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-bg text-green-mid font-semibold">
                            소형 {formatPrice(home.price.small)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                            기본 {formatPrice(home.price.medium)}
                        </span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <a href={`tel:${home.phone}`} className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-white border border-terra-main text-terra-main px-4 py-2 rounded-xl text-sm font-bold hover:bg-terra-bg transition-colors">
                            <Phone className="w-4 h-4" />
                            전화
                        </a>
                        <Link href={`/funeral-home/${home.id}`} className="flex-1 sm:flex-initial flex items-center justify-center bg-green-main hover:bg-green-mid text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-md hover:shadow-lg">
                            상세보기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
