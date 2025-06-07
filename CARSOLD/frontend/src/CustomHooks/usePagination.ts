import {useEffect, useRef, useState} from "react";
import {useUtil} from "../GlobalProviders/Util/useUtil.ts";
import {useSearchParams} from "react-router-dom";

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const hasNextPage = currentPage < totalPages - 1;
    const hasPrevPage = currentPage > 0;
    const [hovered, setHovered] = useState<boolean[]>(Array(2).fill(false));
    const {isMobile} = useUtil();
    const [searchParams, setSearchParams] = useSearchParams();
    const isInitial = useRef<boolean>(true);

    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleHover = (index: number, val: boolean) => {
        setHovered(prev => {
            const copy = [...prev];
            copy[index] = val;
            return copy;
        });
    };

    const bindHoverButtons = (index: number) => {
        if (isMobile) {
            return {
                onTouchStart: () => handleHover(index, true),
                onTouchEnd: () => handleHover(index, false)
            };
        } else {
            return {
                onMouseEnter: () => handleHover(index, true),
                onMouseLeave: () => handleHover(index, false)
            };
        }
    };

    useEffect(() => {
        setHovered([false, false]);
    }, [currentPage]);

    useEffect(() => {
        if (searchParams.has("page")) {
            const page = Number(searchParams.get("page"));
            if (!isNaN(page)) setCurrentPage(page);
        }
        isInitial.current = false;
    }, [searchParams]); //sets currentPage from URL on initial load (e.g. after refresh or back navigation)

    useEffect(() => {
        if (isInitial.current) return;
        const params = new URLSearchParams(searchParams);
        params.set("page", String(currentPage));
        setSearchParams(params, { replace: true });
    }, [currentPage]);  //sets currentPage in params

    return {currentPage, setCurrentPage, setTotalPages, hasPrevPage, hasNextPage, prevPage, nextPage, hovered, bindHoverButtons}
};