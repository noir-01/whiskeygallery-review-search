import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import CustomLoading from "@/components/atoms/CustomLoading";
import type { SearchType } from "@/types/search";
import snackbar from "@/utils/snackbar";

import SearchTextfield from "../organisms/SearchTextfield";
import SearchResultListBox from "../organisms/SearchResultListBox";

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParam, setSearchParam] = useState("");

  const [displayedPost, setDisplayedPost] = useState(20);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [isOpenSearchTools, setIsOpenSearchTools] = useState(true);
  const [isOtherSearch, setIsOtherSearch] = useState(false);

  const getSearchData = async (): Promise<SearchType[]> => {
    const value = await fetch(
      `https://whiskeygallery-review.com:444${
        isOtherSearch ? "/other" : ""
      }/search/${searchParam}`
    );

    return value.json();
  };

  const {
    data: SearchResultDataList,
    isFetching,
    isInitialLoading,
    refetch,
  } = useQuery(["search", searchParam], async () => await getSearchData(), {
    enabled: searchQuery !== "",
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
    onSuccess: (data) => {
      if (data.length > 20) setHasMoreData(true);
    },
    onError: (err) =>
      snackbar(`에러가 발생했습니다. 다시 시도해주세요. (error:${err})`),
  });

  const isLoading = isFetching || isInitialLoading;

  const handleMoreActionOnSearch = (searchInput: string) => {
    setSearchQuery(searchInput.trim());
    setDisplayedPost(20);
    setHasMoreData(false);
    refetch();
  };

  const handleChangeSearchParam = (
    searchInput: string,
    searchOptionA2: string,
    searchOptionA3: string,
    searchOptionO1: string,
    searchOptionO2: string,
    searchOptionO3: string,
    age: string
  ) => {
    setSearchParam(
      `?aSearch1=${searchInput.trim()}&aSearch2=${searchOptionA2}&aSearch3=${searchOptionA3}&oSearch1=${searchOptionO1}&oSearch2=${searchOptionO2}&oSearch3=${searchOptionO3}&age=${age}`
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F2EDD7",
        mt:
          isLoading || SearchResultDataList
            ? 0
            : isOpenSearchTools
            ? "30vh"
            : "35vh",
        mb: SearchResultDataList ? 0 : isOpenSearchTools ? "30vh" : "50vh",
        transition: ".5s",
        maxWidth: "680px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          my: 2,
          color: "#755139",
          textAlign: SearchResultDataList || isLoading ? "left" : "center",
        }}
      >
        {isOtherSearch ? "기타 리뷰 검색하기" : "리뷰 검색하기"}
      </Typography>

      <SearchTextfield
        isLoading={isLoading}
        isOpenSearchTools={isOpenSearchTools}
        isOtherSearch={isOtherSearch}
        handleChangeSearchParam={handleChangeSearchParam}
        handleOpenSearchTool={() => setIsOpenSearchTools(!isOpenSearchTools)}
        handleChangeOtherSearch={() => setIsOtherSearch(!isOtherSearch)}
        handleMoreActionOnSearch={handleMoreActionOnSearch}
      />

      <Box sx={{ display: isLoading ? "block" : "none", mt: "5vh" }}>
        <CustomLoading isLoading={isLoading} />
      </Box>

      {!isLoading && SearchResultDataList ? (
        <SearchResultListBox
          SearchResultDataList={SearchResultDataList}
          hasMoreData={hasMoreData}
          displayedPost={displayedPost}
          isOpenSearchTools={isOpenSearchTools}
          handleMoreDisplayResult={() => setDisplayedPost(displayedPost + 20)}
          handleChangeNoMoreData={() => setHasMoreData(false)}
        />
      ) : null}
    </Box>
  );
};

export default SearchSection;
