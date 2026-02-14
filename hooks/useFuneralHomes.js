import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";

export function useFuneralHomes() {
    const [homes, setHomes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("전체");
    const [activeSort, setActiveSort] = useState("distance");

    const supabase = createClient();

    // Fetch from Supabase
    useEffect(() => {
        async function fetchHomes() {
            const { data, error } = await supabase.from('funeral_homes').select('*');

            if (error) {
                console.error("Error fetching homes:", error);
            } else if (data) {
                // Map DB fields to Component expected structure
                const mappedData = data.map(h => ({
                    ...h,
                    distance: (Math.random() * 20).toFixed(1), // Mock distance for now (not in DB)
                    price: {
                        small: h.price_small,
                        medium: h.price_medium,
                        large: h.price_large
                    }
                }));
                setHomes(mappedData);
            }
            setIsLoading(false);
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
