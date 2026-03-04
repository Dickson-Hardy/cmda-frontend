import { useMemo } from "react";
import { useGetAllChaptersQuery } from "~/redux/api/chaptersApi";
import { studentChapterOptions, doctorsRegionLists, globalRegionsData } from "~/utilities/reusableVariables";

/**
 * Custom hook to fetch and format chapters from the API
 * Falls back to hardcoded arrays if API fails
 * @param {string} type - Chapter type: 'Student', 'Doctor', or 'GlobalNetwork'
 * @returns {Object} { chapters, isLoading, error }
 */
export const useChapters = (type) => {
  const { data, isLoading, error } = useGetAllChaptersQuery(
    { type },
    {
      refetchOnMountOrArgChange: true,
      skip: !type, // Skip query if no type provided
    }
  );

  const chapters = useMemo(() => {
    // If API data is available, use it
    if (data?.items && data.items.length > 0) {
      return data.items.map((chapter) => ({
        label: chapter.name,
        value: chapter.name,
      }));
    }
    
    // Fallback to hardcoded arrays if API fails or returns empty
    if (error || !data) {
      // Silently fallback to hardcoded data
      if (type === 'Student') return studentChapterOptions;
      if (type === 'Doctor') return doctorsRegionLists;
      if (type === 'GlobalNetwork') return globalRegionsData;
    }
    
    return [];
  }, [data, error, type]);

  return {
    chapters,
    isLoading,
    error,
    totalCount: data?.meta?.totalItems || chapters.length,
  };
};

/**
 * Hook to get all chapters (no filtering)
 */
export const useAllChapters = () => {
  const { data, isLoading, error } = useGetAllChaptersQuery({}, {
    refetchOnMountOrArgChange: true,
  });

  const chapters = useMemo(() => {
    if (!data?.items) return [];
    
    return data.items.map((chapter) => ({
      label: chapter.name,
      value: chapter.name,
      type: chapter.type,
    }));
  }, [data]);

  return {
    chapters,
    isLoading,
    error,
    totalCount: data?.meta?.totalItems || 0,
  };
};
