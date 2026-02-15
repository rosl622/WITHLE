import { NextResponse } from 'next/server';
import { getFuneralHomesFromCSV } from '@/utils/csvLoader';

export async function GET() {
    try {
        console.log("API: Fetching funeral homes...");
        const data = await getFuneralHomesFromCSV();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
    }
}
