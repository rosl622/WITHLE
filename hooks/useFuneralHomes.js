import { useState, useEffect, useMemo } from "react";


export function useFuneralHomes() {
    const [homes, setHomes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("전체");
    const [activeSort, setActiveSort] = useState("distance");



    // Fetch from API (CSV Data)
    useEffect(() => {
        async function fetchHomes() {
            try {
                const response = await fetch('/api/funeral-homes');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setHomes(data);
                } else {
                    console.error("Invalid data format received");
                    setHomes([]);
                }
            } catch (error) {
                console.error("Error fetching homes:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchHomes();
    }, []);

    // Filtering & Sorting Logic
    const filteredHomes = useMemo(() => {
        let result = [...homes];

        // Filter
        if (activeFilter !== "전체") {
            result = result.filter(home => {
                if (activeFilter === "24시간") return home.open24h;
                return home.tags?.includes(activeFilter) || home.facilities?.includes(activeFilter);
            });
        }

        // Sort
        result.sort((a, b) => {
            if (activeSort === "distance") return a.distance - b.distance;
            if (activeSort === "rating") return b.rating - a.rating;
            if (activeSort === "price") return a.price.small - b.price.small;
            return 0;
        });

        return result;
    }, [homes, activeFilter, activeSort]);

    return {
        homes: filteredHomes, // Return the processed list directly
        isLoading,
        activeFilter,
        setActiveFilter,
        activeSort,
        setActiveSort
    };
}
