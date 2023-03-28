import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  IFetchApiDataParams,
  IFetchApiDataResponse,
  IUsePagination,
} from '../../models';

// import { IUsePagination } from '@/models/Pagination'

/** Dictionary of fields names of the response data */
type ApiKeysDictForResponse = {
  dataArrayKey: string;
  totalPages: string;
  totalResults: string;
  currentPage: string;
};

interface IUsePaginationByApiParams<ResponseType> {
  fetchApiData: (
    params?: IFetchApiDataParams
  ) => Promise<IFetchApiDataResponse<ResponseType>>;
  fetchApiDataParams?: IFetchApiDataParams;
  /** Used to get the right key to get data from response object. */
  apiKeysDictForResponse: ApiKeysDictForResponse;
  initialPage?: number;
  initialPerPage?: number;
}

interface IUsePaginationByAPI<T> {
  loading: boolean;
  handleFetchApiDataWithParams: (params?: IFetchApiDataParams) => Promise<void>;
  paginationInfo: IUsePagination<T>;
}

export const usePaginationByAPI = <DataType, ApiResponseType>({
  fetchApiData,
  initialPage = 1,
  initialPerPage = 10,
  apiKeysDictForResponse,
  fetchApiDataParams = {},
}: IUsePaginationByApiParams<ApiResponseType>): IUsePaginationByAPI<DataType> => {
  const [internalData, setInternalData] = useState<DataType[]>([]);
  const [internalCurrentPage, setInternalCurrentPage] = useState(initialPage);
  const [internalPerPage, setInternalPerPage] = useState(initialPerPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const setMainStates = useCallback(
    (data: DataType[], pages: number, results: number) => {
      setInternalData(data);
      setTotalPages(pages);
      setTotalResults(results);
    },
    []
  );

  const memoizedParams = useMemo(
    () => fetchApiDataParams,
    [fetchApiDataParams]
  );
  const setPageStatesAndGetParsedParams = useCallback(
    (params?: IFetchApiDataParams) => {
      const parsedParams = {
        ...memoizedParams,
        ...params,
        page: params?.page || internalCurrentPage,
        perPage: params?.perPage || internalPerPage,
      };
      setInternalCurrentPage(parsedParams.page);
      setInternalPerPage(parsedParams.perPage);
      return parsedParams;
    },
    [internalCurrentPage, internalPerPage, memoizedParams]
  );

  const handleFetchApiData = useCallback(
    async (params?: IFetchApiDataParams) => {
      try {
        setLoading(true);

        const parsedParams = setPageStatesAndGetParsedParams(params);
        const response = await fetchApiData(parsedParams);

        if (response?.success && response.data) {
          const data = response.data as Record<string, any>;

          setMainStates(
            data[apiKeysDictForResponse.dataArrayKey],
            data[apiKeysDictForResponse.totalPages],
            data[apiKeysDictForResponse.totalResults]
          );
          return;
        }

        setMainStates([], 1, 0);
        throw new Error();
      } catch (error) {
        console.log('An error occurred trying to get the data.', { error });
      } finally {
        setLoading(false);
      }
    },
    [
      setPageStatesAndGetParsedParams,
      fetchApiData,
      setMainStates,
      apiKeysDictForResponse.dataArrayKey,
      apiKeysDictForResponse.totalPages,
      apiKeysDictForResponse.totalResults,
    ]
  );

  const handleChangePage = useCallback(
    (page = 1) => {
      if (internalCurrentPage === page) {
        return;
      }

      handleFetchApiData({ perPage: internalPerPage, page: page });
    },
    [handleFetchApiData, internalCurrentPage, internalPerPage]
  );

  const handleChangePerPage = useCallback(
    (perPage = 10) => {
      if (internalPerPage === perPage) {
        return;
      }

      handleFetchApiData({ page: 1, perPage });
    },
    [handleFetchApiData, internalPerPage]
  );

  useEffect(() => {
    handleFetchApiData();
    // is not necessary to have deps in this array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    handleFetchApiDataWithParams: handleFetchApiData,
    paginationInfo: {
      currentPageData: internalData,
      currentPage: internalCurrentPage,
      perPage: internalPerPage,
      totalPages,
      totalResults,
      setData: setInternalData,
      setPage: handleChangePage,
      setPerPage: handleChangePerPage,
    },
  };
};
