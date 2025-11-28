import { useQuery } from 'react-query';
import { useEffect } from 'react';
import { toiletService } from '../services/toiletService';
import useToiletStore from '../store/useToiletStore';
import useLocationStore from '../store/useLocationStore';

export const useToilets = () => {
  const userLocation = useLocationStore((state) => state.userLocation);
  const setToilets = useToiletStore((state) => state.setToilets);
  const cacheToilets = useToiletStore((state) => state.cacheToilets);
  const getCachedToilets = useToiletStore((state) => state.getCachedToilets);

  const queryKey = userLocation
    ? ['toilets', userLocation.latitude, userLocation.longitude]
    : ['toilets'];

  const { data, isLoading, error, refetch } = useQuery(
    queryKey,
    async () => {
      if (userLocation) {
        return await toiletService.getToiletsNearby(
          userLocation.latitude,
          userLocation.longitude,
          5
        );
      }
      return await toiletService.getAllToilets();
    },
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        setToilets(data);
        cacheToilets(data);
      },
      onError: async (err) => {
        console.warn('Error fetching toilets, trying cache:', err);
        const cachedToilets = await getCachedToilets();
        if (cachedToilets) {
          setToilets(cachedToilets);
        }
      },
    }
  );

  return {
    toilets: data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useToiletDetails = (toiletId) => {
  return useQuery(
    ['toilet', toiletId],
    () => toiletService.getToiletDetails(toiletId),
    {
      enabled: !!toiletId,
      staleTime: 10 * 60 * 1000,
    }
  );
};

export const useRateToilet = () => {
  return async (toiletId, rating) => {
    try {
      return await toiletService.rateToilet(toiletId, rating);
    } catch (error) {
      console.error('Error rating toilet:', error);
      throw error;
    }
  };
};

export const useReportIssue = () => {
  return async (toiletId, issue) => {
    try {
      return await toiletService.reportIssue(toiletId, issue);
    } catch (error) {
      console.error('Error reporting issue:', error);
      throw error;
    }
  };
};
