import { useCallback, useEffect, useRef } from 'react';

type Props = {
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  rootMargin?: string
  threshold?: number
}

export const useInfiniteScroll = ({
                                    hasNextPage,
                                    isFetching,
                                    fetchNextPage,
                                    rootMargin = '100px',
                                    threshold = 0.1,
                                  }: Props) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMoreHandler = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  useEffect(() => {

    const observer = new IntersectionObserver(
      entries => {

        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      },
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {

      observer.observe(currentObserverRef);
    }


    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loadMoreHandler, rootMargin, threshold]);

  return { observerRef };
};