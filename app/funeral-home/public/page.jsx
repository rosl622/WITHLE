import { getFuneralHomesFromCSV } from "@/utils/csvLoader";
import PublicFuneralHomeList from "@/components/PublicFuneralHomeList";

export const metadata = {
    title: '전국 동물 장묘업체 | Withle',
    description: '농림축산식품부 정식 등록된 전국 동물 장묘업체 정보를 확인하세요.',
};

export default async function PublicFuneralHomesPage() {
    const homes = await getFuneralHomesFromCSV();

    return <PublicFuneralHomeList initialHomes={homes} />;
}
