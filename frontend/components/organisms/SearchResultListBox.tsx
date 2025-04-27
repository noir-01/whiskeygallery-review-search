import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import type { SearchType, SortOptionType } from "@/types/search";

import DropDownOption from "../atoms/DropDownOption";
import SearchResultItem from "../molecules/SearchResultItem";

const SearchResultListBox = ({
  SearchResultDataList,
  isOpenSearchTools,
  displayedPost,
  hasMoreData,
  handleMoreDisplayResult,
  handleChangeNoMoreData,
}: {
  SearchResultDataList: SearchType[];
  isOpenSearchTools: boolean;
  displayedPost: number;
  hasMoreData: boolean;
  handleMoreDisplayResult: () => void;
  handleChangeNoMoreData: () => void;
}) => {
  const [visitedPostList, setVisitedPostList] = useState<number[]>([]);
  const [recentlyVisitedPost, setRecentlyVisitedPost] = useState<number>(0);
  const [sortOption, setSortOption] = useState<SortOptionType>("최신순");

  const addVisitedList = (visitedPostId: number) => {
    if (!visitedPostList.includes(visitedPostId))
      setVisitedPostList([...visitedPostList, visitedPostId]);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mx: { xs: 0.5, sm: 2 },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          {`검색 결과 [총 ${SearchResultDataList?.length}개]`}
        </Typography>
        <DropDownOption
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOptionType)}
          optionList={[
            { value: "최신순", content: "최신순" },
            { value: "추천순", content: "추천순" },
            { value: "댓글순", content: "댓글순" },
          ]}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 1.5,
          width: { xs: "90vw", sm: "95vw", md: "46vw" },
          maxWidth: "680px",
          pb: 1,
        }}
      >
        <Grid
          container
          id="list label"
          sx={{
            display: "flex",
            fontSize: "15px",
            fontWeight: 700,
            width: "100%",
            textAlign: "center",
            py: 1,
            borderBottom: "1px solid lightgray",
          }}
        >
          <Grid item xs={8.5}>
            제목
          </Grid>
          <Grid item xs={1}>
            추천
          </Grid>
          <Grid item xs={2.5} sx={{ whiteSpace: "nowrap" }}>
            작성일
          </Grid>
        </Grid>
        <Box
          sx={{
            height: isOpenSearchTools
              ? "calc(100vh - 380px)"
              : "calc(100vh - 240px)",
            transition: ".5s",
            overflow: "auto",
            p: "6px",

            "&::-webkit-scrollbar": {
              width: "6px",
              backgroundColor: "lightgray",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray",
              borderRadius: "20px",
            },
          }}
        >
          {SearchResultDataList?.length !== 0 &&
            SearchResultDataList.sort((a, b) => {
              let A, B;
              switch (sortOption) {
                case "최신순":
                  A = a.postDate;
                  B = b.postDate;
                  break;
                case "댓글순":
                  A = a.reply;
                  B = b.reply;
                  break;
                case "추천순":
                  A = a.recommend;
                  B = b.recommend;
                  break;
              }

              return A > B ? -1 : 1;
            })
              .slice(0, displayedPost)
              .map((item: SearchType) => (
                <Box key={item.id}>
                  <SearchResultItem
                    searchResultData={item}
                    visitedPostList={visitedPostList}
                    recentlyVisitedPost={recentlyVisitedPost}
                    addVisitedList={addVisitedList}
                    handleChangeLastVisitPost={(visitPostId: number) =>
                      setRecentlyVisitedPost(visitPostId)
                    }
                  />
                  <Divider />
                </Box>
              ))}

          {SearchResultDataList &&
            SearchResultDataList.length !== 0 &&
            hasMoreData && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  height: "30px",

                  ":hover": {
                    opacity: 0.5,
                  },
                }}
                onClick={() => {
                  if (SearchResultDataList.length > displayedPost) {
                    handleMoreDisplayResult();
                    if (SearchResultDataList.length <= displayedPost + 20)
                      handleChangeNoMoreData();
                  } else handleChangeNoMoreData();
                }}
              >
                {`더보기 (${
                  displayedPost > SearchResultDataList.length
                    ? SearchResultDataList.length
                    : displayedPost
                }/${SearchResultDataList.length})`}
              </Box>
            )}

          {SearchResultDataList && SearchResultDataList.length === 0 && (
            <Box>검색결과가 없습니다.</Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SearchResultListBox;
