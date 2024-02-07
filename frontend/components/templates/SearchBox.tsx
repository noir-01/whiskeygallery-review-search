import { useState, KeyboardEvent, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import CustomLoading from "@/components/atoms/CustomLoading";
import DropDownOption from "@/components/atoms/DropDownOption";
import type { SearchType, SortOptionType } from "@/types/search";
import convertMilliToDay from "@/utils/convertMilliToDay";
import snackbar from "@/utils/snackbar";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";

const SearchBox = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchOptionA2, setSearchOptionA2] = useState("");
  const [searchOptionA3, setSearchOptionA3] = useState("");
  const [searchOptionO1, setSearchOptionO1] = useState("");
  const [searchOptionO2, setSearchOptionO2] = useState("");
  const [searchOptionO3, setSearchOptionO3] = useState("");
  const [age, setAge] = useState("");
  const [nickname, setNickname] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [displayedPost, setDisplayedPost] = useState(20);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [isOpenSearchTools, setIsOpenSearchTools] = useState(true);
  const [isOtherSearch, setIsOtherSearch] = useState(false);
  const [sortOption, setSortOption] = useState<SortOptionType>("최신순");

  const [visitedPostList, setVisitedPostList] = useState<number[]>([]);
  const [recentlyVisitedPost, setRecentlyVisitedPost] = useState<number>(0);

  const checkIsEmptyInput = () =>
    searchInput === "" &&
    searchOptionA2 === "" &&
    searchOptionA3 === "" &&
    searchOptionO1 === "" &&
    searchOptionO2 === "" &&
    searchOptionO3 === "" &&
    age === ""&&
    nickname==="";

  const onSearch = () => {
    if (isOpenSearchTools) {
      if (checkIsEmptyInput()) {
        snackbar("검색어를 입력하세요.");
        return;
      }
    } else {
      if (searchInput.trim() === "") {
        snackbar("검색어를 입력하세요.");
        return;
      }
      setSearchInput(searchInput.trim());
      setSearchQuery(searchInput.trim());
    }
    setDisplayedPost(20);
    setHasMoreData(false);
    refetch();
  };

  const enterKeyEventOnSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      onSearch();

      e.preventDefault();
      const target = e.target as HTMLInputElement;
      target.blur();
    }
  };

  const getData = async (): Promise<SearchType[]> => {
    const value = await fetch(
      `https://whiskeygallery-review.com:444${
        isOtherSearch ? "/other" : ""
      }/search/?aSearch1=${searchInput.trim()}&aSearch2=${searchOptionA2}&aSearch3=${searchOptionA3
      }&oSearch1=${searchOptionO1}&oSearch2=${searchOptionO2}&oSearch3=${searchOptionO3
      }&age=${age}&nickname=${nickname}`
    );
    return value.json();
  };

  const { data, isFetching, isInitialLoading, refetch } = useQuery(
    ["search", searchQuery],
    async () => await getData(),
    {
      enabled: searchQuery !== "",
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60,
      onSuccess: (data) => {
        if (data.length > 20) setHasMoreData(true);
      },
      onError: (err) =>
        snackbar(`에러가 발생했습니다. 다시 시도해주세요. (error:${err})`),
    }
  );

  const isLoading = isFetching || isInitialLoading;

  const addVisitedList = (visitedPostId: number) => {
    if (!visitedPostList.includes(visitedPostId))
      setVisitedPostList([...visitedPostList, visitedPostId]);
  };

  const handleDeleteAllInput = () => {
    setSearchInput("");
    setSearchOptionA2("");
    setSearchOptionA3("");
    setSearchOptionO1("");
    setSearchOptionO2("");
    setSearchOptionO3("");
    setAge("");
    setNickname("");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F2EDD7",
        mt: isLoading || data ? 0 : isOpenSearchTools ? "30vh" : "35vh",
        mb: data ? 0 : isOpenSearchTools ? "30vh" : "50vh",
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
          textAlign: data || isLoading ? "left" : "center",
        }}
      >
        {isOtherSearch ? "기타 리뷰 검색하기" : "리뷰 검색하기"}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Paper
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 1,
            width: { xs: "90vw", sm: "95vw", md: "auto" },
            maxWidth: "680px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "100%", display: "flex" }}>
            <InputBase
              disabled={isOpenSearchTools || isLoading}
              type="search"
              placeholder="리뷰를 검색하세요."
              sx={{
                flex: 1,
                opacity: isOpenSearchTools ? 0 : 1,
                height: isOpenSearchTools ? 0 : "40px",
                transition: ".5s",
                mr: { xs: "15vw", sm: "10vw", md: "8vw", lg: "6vw" },

                "input::-webkit-search-cancel-button": { display: "none" },
              }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={enterKeyEventOnSearch}
            />
            <IconButton
              type="button"
              disabled={isLoading}
              aria-label="search filter button"
              sx={{
                p: "8px",
                position: "absolute",
                top: isOpenSearchTools ? "-4px" : 0,
                right: isOpenSearchTools ? "-4px" : "40px",
                transition: ".5s",
              }}
              onClick={() => setIsOpenSearchTools(!isOpenSearchTools)}
            >
              {isOpenSearchTools ? (
                <ArrowDropUpIcon fontSize="medium" />
              ) : (
                <TuneIcon />
              )}
            </IconButton>
            <Button
              size="small"
              disabled={isLoading}
              aria-label="search"
              onClick={onSearch}
              sx={{
                position: "absolute",
                top: isOpenSearchTools ? "172px" : "4px",
                right: isOpenSearchTools ? "8px" : "12px",
                minWidth: 0,
                bgcolor: isOpenSearchTools ? "#755139" : "transparent",
                color: isOpenSearchTools ? "white" : "gray",
                transition: ".5s",
                px: isOpenSearchTools ? 11 : 1,
                height: isOpenSearchTools ? "36px" : "32px",
                width: isOpenSearchTools ? "97%" : 0,

                ":active": {
                  bgcolor: isOpenSearchTools ? "#755139" : "transparent",
                },
                ":hover": {
                  bgcolor: isOpenSearchTools ? "#755139" : "transparent",
                },
                ":disabled": {
                  opacity: 0.8,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  transition: ".5s",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontWeight: 700,
                  color: "white",
                  px: isOpenSearchTools ? 1 : 0,
                }}
              >
                상세 검색하기
              </Typography>
              <SearchIcon />
            </Button>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: isOpenSearchTools ? "216px" : 0,
              overflow: "hidden",
              transition: ".5s",
            }}
          >
            <Box sx={{ display: "flex", width: "100%", my: 1, gap: 0.5 }}>
              <Box
                sx={{
                  backgroundColor: "#755139",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  width: "57px",
                  p: 0.5,
                  mr: 0.5,
                }}
              >
                AND
              </Box>
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="option1"
                sx={{ flexBasis: "25%" }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="option2"
                sx={{ flexBasis: "25%" }}
                value={searchOptionA2}
                onChange={(e) => setSearchOptionA2(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="option3"
                sx={{ flexBasis: "25%" }}
                value={searchOptionA3}
                onChange={(e) => setSearchOptionA3(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
            </Box>
            <Box sx={{ display: "flex", width: "100%", my: 1, gap: 0.5 }}>
              <Box
                sx={{
                  backgroundColor: "#755139",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  p: 0.5,
                  width: "57px",
                  mr: 0.5,
                }}
              >
                OR
              </Box>
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="option1"
                sx={{ flexBasis: "25%" }}
                value={searchOptionO1}
                onChange={(e) => setSearchOptionO1(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="option2"
                sx={{ flexBasis: "25%" }}
                value={searchOptionO2}
                onChange={(e) => setSearchOptionO2(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="option3"
                sx={{ flexBasis: "25%" }}
                value={searchOptionO3}
                onChange={(e) => setSearchOptionO3(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
            </Box>
            <Box sx={{ display: "flex", width: "100%", my: 1, gap: 1 }}>
              <Box
                sx={{
                  backgroundColor: "#755139",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  p: 0.5,
                  width: "57px",
                }}
              >
                Age
              </Box>
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: "flex", width: "100%", my: 1, gap: 1 }}>
              <Box
                sx={{
                  backgroundColor: "#755139",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  p: 0.5,
                  width: "58px",
                }}
              >
                닉네임
              </Box>
              <InputBase
                type="search"
                disabled={isLoading}
                placeholder="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
                sx={{ flex: 1 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  disabled={checkIsEmptyInput()}
                  onClick={handleDeleteAllInput}
                  sx={{
                    bgcolor: "#755139",
                    ":active": { bgcolor: "#755139" },
                    ":hover": { bgcolor: "#755139" },
                  }}
                >
                  입력 지우기
                </Button>
                <Button
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    flex: 1,
                    bgcolor: "#755139",

                    ":active": { bgcolor: "#755139" },
                    ":hover": { bgcolor: "#755139" },
                  }}
                  onClick={() => setIsOtherSearch(!isOtherSearch)}
                >
                  {isOtherSearch ? "리뷰 검색기" : "기타 리뷰 검색기"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ display: isLoading ? "block" : "none", mt: "5vh" }}>
        <CustomLoading isLoading={isLoading} />
      </Box>

      {!isLoading && data ? (
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
              {`검색 결과 [총 ${data?.length}개]`}
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
              {data?.length !== 0 &&
                data
                  .sort((a, b) => {
                    let A, B;
                    switch (sortOption) {
                      case "최신순":
                        A = a.time;
                        B = b.time;
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
                      <ListItemButton
                        title={item.title}
                        sx={{
                          p: 0.5,
                          backgroundColor: visitedPostList.includes(item.id)
                            ? "#755139"
                            : "white",
                          color: visitedPostList.includes(item.id)
                            ? "white"
                            : "black",
                          opacity: visitedPostList.includes(item.id)
                            ? recentlyVisitedPost === item.id
                              ? 1
                              : 0.7
                            : 1,

                          ":hover": {
                            backgroundColor: visitedPostList.includes(item.id)
                              ? "#755139"
                              : "white",
                          },
                        }}
                        onClick={() => {
                          window.open(item.url, "_blank");
                          addVisitedList(item.id);
                          setRecentlyVisitedPost(item.id);
                        }}
                      >
                        <Grid container>
                          <Grid
                            item
                            xs={8.5}
                            sx={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflowWrap: "anywhere",
                            }}
                          >
                            <Typography variant="subtitle2">{`${item.title} ${
                              item.reply !== 0 ? `(${item.reply})` : ""
                            }`}</Typography>
                          </Grid>
                          <Grid item xs={1.5}>
                            <Typography
                              variant="subtitle2"
                              sx={{ px: 1, textAlign: "center" }}
                            >
                              {item.recommend}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            sx={{ whiteSpace: "nowrap", textAlign: "center" }}
                          >
                            <Typography variant="subtitle2">
                              {convertMilliToDay(item.time)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                      <Divider />
                    </Box>
                  ))}

              {data && data.length !== 0 && hasMoreData && (
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
                    if (data.length > displayedPost) {
                      setDisplayedPost(displayedPost + 20);
                      if (data.length <= displayedPost + 20)
                        setHasMoreData(false);
                    } else setHasMoreData(false);
                  }}
                >
                  {`더보기 (${
                    displayedPost > data.length ? data.length : displayedPost
                  }/${data.length})`}
                </Box>
              )}

              {data && data.length === 0 && <Box>검색결과가 없습니다.</Box>}
            </Box>
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default SearchBox;
