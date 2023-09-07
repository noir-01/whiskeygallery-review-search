import { useState, KeyboardEvent, useRef } from "react";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputBase,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  ArrowDropUp as ArrowDropUpIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

import CustomLoading from "@/components/atoms/CustomLoading";
import DropDownOption from "@/components/atoms/DropDownOption";
import type { SearchType, SortOptionType } from "@/types/search";

const SearchBox = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [displayedPost, setDisplayedPost] = useState(20);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [isOpenSearchTools, setIsOpenSearchTools] = useState(false);
  const [isOtherSearch, setIsOtherSearch] = useState(false);
  const [sortOption, setSortOption] = useState<SortOptionType>("최신순");

  const [visitedPostList, setVisitedPostList] = useState<number[]>([]);
  const [recentlyVisitedPost, setRecentlyVisitedPost] = useState<number>(0);

  const searchOptionA1 = useRef("");
  const searchOptionA2 = useRef("");
  const searchOptionA3 = useRef("");
  const searchOptionO1 = useRef("");
  const searchOptionO2 = useRef("");
  const searchOptionO3 = useRef("");
  const age = useRef("");

  const noticeRequiredInput = () => {
    enqueueSnackbar("검색어를 입력하세요.", {
      variant: "error",
      autoHideDuration: 2000,
    });
  };

  const checkIsEmptyInput = () =>
    searchOptionA1.current === "" &&
    searchOptionA2.current === "" &&
    searchOptionA3.current === "" &&
    searchOptionO1.current === "" &&
    searchOptionO2.current === "" &&
    searchOptionO3.current === "" &&
    age.current === "";

  const enterKeyEventOnSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (isOpenSearchTools) {
        if (checkIsEmptyInput()) {
          noticeRequiredInput();
          return;
        }
      } else {
        if (searchInput.trim() === "") {
          noticeRequiredInput();
          return;
        }
        setSearchQuery(searchInput);
        searchOptionA1.current = searchInput;
      }
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      target.blur();
      setHasMoreData(false);
      setDisplayedPost(20);
      refetch();
    }
  };

  const onClickSearchIcon = () => {
    if (isOpenSearchTools) {
      if (checkIsEmptyInput()) {
        noticeRequiredInput();
        return;
      }
    } else {
      if (searchInput.trim() === "") {
        noticeRequiredInput();
        return;
      }
      setSearchQuery(searchInput);
      searchOptionA1.current = searchInput;
    }
    setDisplayedPost(20);
    setHasMoreData(false);
    refetch();
  };

  const convertMilliToDay = (date: number) => {
    const dateData = new Date(date);
    return `${dateData.getFullYear().toString().slice(-2)}-${(
      dateData.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateData.getDate().toString().padStart(2, "0")}`;
  };

  const getData = async (): Promise<SearchType[]> => {
    const value = await fetch(
      `https://whiskeyreview.ddns.net:444${
        isOtherSearch ? "/other" : ""
      }/search/?aSearch1=${searchOptionA1.current}&aSearch2=${
        searchOptionA2.current
      }&aSearch3=${searchOptionA3.current}&oSearch1=${
        searchOptionO1.current
      }&oSearch2=${searchOptionO2.current}&oSearch3=${
        searchOptionO3.current
      }&age=${age.current}`
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
      onError: (err) => {
        enqueueSnackbar(
          `에러가 발생했습니다. 다시 시도해주세요. (error:${err})`,
          { variant: "error", autoHideDuration: 2000 }
        );
      },
    }
  );

  const addVisitedList = (visitedPostId: number) => {
    if (!visitedPostList.includes(visitedPostId)) {
      setVisitedPostList([...visitedPostList, visitedPostId]);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F2EDD7",
        mt:
          isFetching || isInitialLoading || data
            ? 0
            : isOpenSearchTools
            ? "30vh"
            : "40vh",
        mb: data ? 0 : isOpenSearchTools ? "30vh" : "50vh",
        transition: ".5s",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          my: 2,
          color: "#755139",
          textAlign: data ? "left" : "center",
        }}
      >
        {isOtherSearch ? "기타 리뷰 검색하기" : "리뷰 검색하기"}
      </Typography>
      <CustomLoading isLoading={isFetching || isInitialLoading} />
      <Box sx={{ mb: 2 }}>
        <Paper
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 1,
            width: { xs: "90vw", sm: "auto" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "100%", display: "flex" }}>
            <InputBase
              disabled={isOpenSearchTools}
              type="search"
              placeholder="리뷰를 검색하세요."
              sx={{
                flex: 1,
                opacity: isOpenSearchTools ? 0 : 1,
                height: isOpenSearchTools ? 0 : "40px",
                transition: ".5s",
                "input::-webkit-search-cancel-button": { display: "none" },
              }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={enterKeyEventOnSearch}
            />
            <IconButton
              type="button"
              sx={{
                p: "8px",
                position: "absolute",
                top: isOpenSearchTools ? "-4px" : 0,
                right: isOpenSearchTools ? "-4px" : "40px",
                transition: ".5s",
              }}
              onClick={() => {
                setIsOpenSearchTools(!isOpenSearchTools);
                setSearchInput(searchOptionA1.current);
              }}
            >
              {isOpenSearchTools ? (
                <ArrowDropUpIcon fontSize="medium" />
              ) : (
                <TuneIcon />
              )}
            </IconButton>
            <Button
              size="small"
              aria-label="search"
              onClick={onClickSearchIcon}
              sx={{
                position: "absolute",
                top: isOpenSearchTools ? "132px" : "4px",
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
              height: isOpenSearchTools ? "175px" : 0,
              overflow: "hidden",
              transition: ".5s",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                my: 1,
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#755139",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 2,
                  width: "44px",
                  p: 0.5,
                  mr: 0.5,
                }}
              >
                AND
              </Box>
              <InputBase
                type="search"
                placeholder="option1"
                sx={{ flexBasis: "25%" }}
                defaultValue={searchOptionA1.current}
                onChange={(e) => (searchOptionA1.current = e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                placeholder="option2"
                sx={{ flexBasis: "25%" }}
                defaultValue={searchOptionA2.current}
                onChange={(e) => (searchOptionA2.current = e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                placeholder="option3"
                sx={{ flexBasis: "25%" }}
                defaultValue={searchOptionA3.current}
                onChange={(e) => (searchOptionA3.current = e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                my: 1,
                gap: 0.5,
              }}
            >
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
                  width: "44px",
                  mr: 0.5,
                }}
              >
                OR
              </Box>
              <InputBase
                type="search"
                placeholder="option1"
                sx={{
                  flexBasis: "25%",
                }}
                defaultValue={searchOptionO1.current}
                onChange={(e) => (searchOptionO1.current = e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                placeholder="option2"
                sx={{ flexBasis: "25%" }}
                defaultValue={searchOptionO2.current}
                onChange={(e) => (searchOptionO2.current = e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
              <InputBase
                type="search"
                placeholder="option3"
                sx={{ flexBasis: "25%" }}
                defaultValue={searchOptionO3.current}
                onChange={(e) => (searchOptionO3.current = e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                my: 1,
                gap: 1,
              }}
            >
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
                  width: "44px",
                }}
              >
                Age
              </Box>
              <InputBase
                type="search"
                placeholder="age"
                defaultValue={age.current}
                onChange={(e) => (age.current = e.target.value)}
                onKeyPress={enterKeyEventOnSearch}
                sx={{ flexBasis: "35%" }}
              />
              <Button
                variant="contained"
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
        </Paper>
      </Box>
      {data ? (
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
      ) : null}

      {data ? (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 1.5,
            width: { xs: "90vw", sm: "95vw", md: "42vw" },
            height: isOpenSearchTools
              ? { xs: "50vh", md: "55vh" }
              : { xs: "65vh", md: "78vh" },
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
                ? { xs: "42vh", md: "48vh" }
                : { xs: "60vh", md: "73vh" },
              overflow: "auto",
              p: "6px 6px 10px 6px",

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
                ?.sort((a, b) => {
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
                ?.slice(0, displayedPost)
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
      ) : null}
    </Box>
  );
};

export default SearchBox;
