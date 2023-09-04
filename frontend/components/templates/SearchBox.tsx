import { useState, KeyboardEvent } from "react";
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
  HighlightOff as HighlightOffIcon,
  LibraryAdd as LibraryAddIcon,
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

  const [focusPostId, setFocusPostId] = useState(0);
  const [focusPostTitle, setFocusPostTitle] = useState("");
  const [focusPostLink, setFocusPostLink] = useState("");

  const [displayedPost, setDisplayedPost] = useState(20);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [isOpenSearchTools, setIsOpenSearchTools] = useState(true);
  const [searchOptionA1, setSearchOptionA1] = useState("");
  const [searchOptionA2, setSearchOptionA2] = useState("");
  const [searchOptionA3, setSearchOptionA3] = useState("");
  const [searchOptionO1, setSearchOptionO1] = useState("");
  const [searchOptionO2, setSearchOptionO2] = useState("");
  const [searchOptionO3, setSearchOptionO3] = useState("");

  const [isOtherSearch, setIsOtherSearch] = useState(false);
  const [age, setAge] = useState("");
  const [sortOption, setSortOption] = useState<SortOptionType>("최신순");

  const enterKeyEventOnSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput);
      setSearchOptionA1(searchInput);

      if (searchQuery.trim() === "") {
        enqueueSnackbar("검색어를 입력하세요.", {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
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
    setSearchQuery(searchInput);
    setSearchOptionA1(searchInput);

    if (searchQuery.trim() === "") {
      enqueueSnackbar("검색어를 입력하세요.", {
        variant: "error",
        autoHideDuration: 2000,
      });
      return;
    }
    setDisplayedPost(20);
    setHasMoreData(true);
    refetch();
    setIsOpenSearchTools(false);
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
      }/search/\
?aSearch1=${searchOptionA1}\&aSearch2=${searchOptionA2}&aSearch3=${searchOptionA3}\
&oSearch1=${searchOptionO1}&oSearch2=${searchOptionO2}&oSearch3=${searchOptionO3}\
&age=${age}`
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
    }
  );

  return (
    <Box sx={{ backgroundColor: "#F2EDD7", color: "black" }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, my: 2, color: "#755139" }}
      >
        {isOtherSearch ? "기타 리뷰 검색하기" : "리뷰 검색하기"}
      </Typography>
      <CustomLoading isLoading={isFetching || isInitialLoading} />
      {!focusPostTitle && (
        <>
          <Box sx={{ mb: 2 }}>
            <Paper
              component="form"
              sx={{
                p: "0 4px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: 1,
                width: { xs: "90vw", sm: "auto" },
              }}
            >
              <Box sx={{ width: "100%", display: "flex" }}>
                <InputBase
                  disabled={isOpenSearchTools}
                  type="search"
                  placeholder="리뷰를 검색하세요."
                  sx={{ flex: 1, opacity: isOpenSearchTools ? 0 : 1 }}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={enterKeyEventOnSearch}
                />
                <IconButton
                  type="button"
                  sx={{ p: "8px" }}
                  onClick={() => {
                    setIsOpenSearchTools(!isOpenSearchTools);
                    if (!isOpenSearchTools) setSearchOptionA1(searchInput);
                    else {
                      setSearchInput(searchOptionA1);
                    }
                  }}
                >
                  {isOpenSearchTools ? (
                    <ArrowDropUpIcon fontSize="medium" />
                  ) : (
                    <TuneIcon />
                  )}
                </IconButton>
                <IconButton
                  type="button"
                  sx={{ p: "8px" }}
                  aria-label="search"
                  onClick={onClickSearchIcon}
                >
                  <SearchIcon />
                </IconButton>
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
                      width: "48px",
                      p: 0.5,
                    }}
                  >
                    AND
                  </Box>
                  <InputBase
                    type="search"
                    placeholder="option1"
                    sx={{ flexBasis: "30%" }}
                    value={searchOptionA1}
                    onChange={(e) => setSearchOptionA1(e.target.value)}
                  />
                  <InputBase
                    type="search"
                    placeholder="option2"
                    sx={{ flexBasis: "30%" }}
                    value={searchOptionA2}
                    onChange={(e) => setSearchOptionA2(e.target.value)}
                  />
                  <InputBase
                    type="search"
                    placeholder="option3"
                    sx={{ flexBasis: "30%" }}
                    value={searchOptionA3}
                    onChange={(e) => setSearchOptionA3(e.target.value)}
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
                      width: "48px",
                    }}
                  >
                    OR
                  </Box>
                  <InputBase
                    type="search"
                    placeholder="option1"
                    sx={{
                      flexBasis: "30%",
                    }}
                    value={searchOptionO1}
                    onChange={(e) => setSearchOptionO1(e.target.value)}
                  />
                  <InputBase
                    type="search"
                    placeholder="option2"
                    sx={{ flexBasis: "30%" }}
                    value={searchOptionO2}
                    onChange={(e) => setSearchOptionO2(e.target.value)}
                  />
                  <InputBase
                    type="search"
                    placeholder="option3"
                    sx={{ flexBasis: "30%" }}
                    value={searchOptionO3}
                    onChange={(e) => setSearchOptionO3(e.target.value)}
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
                      width: "48px",
                    }}
                  >
                    Age
                  </Box>
                  <InputBase
                    placeholder="age"
                    sx={{
                      flexBasis: "95%",
                    }}
                    value={age}
                    onChange={(e) => {
                      const regex = /\D/gi;
                      const slicedValue = e.target.value.replaceAll(regex, "");
                      if (slicedValue === "") setAge("");
                      else {
                        const numValue = Number(slicedValue) ?? 0;
                        setAge(numValue < 0 ? "0" : `${numValue}`);
                      }
                    }}
                  />
                </Box>
                <Box sx={{ width: "100%", mb: 1 }}>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      bgcolor: "#755139",
                      ":active": { bgcolor: "#755139" },
                      ":hover": { bgcolor: "#755139" },
                    }}
                    onClick={() => {
                      setIsOtherSearch(!isOtherSearch);
                    }}
                  >
                    {isOtherSearch
                      ? "리뷰 검색으로 바꾸기"
                      : "기타 리뷰 검색으로 바꾸기"}
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
                onChange={(e) =>
                  setSortOption(e.target.value as SortOptionType)
                }
                optionList={[
                  { value: "최신순", content: "최신순" },
                  { value: "추천순", content: "추천순" },
                  { value: "댓글순", content: "댓글순" },
                ]}
              />
            </Box>
          ) : null}
        </>
      )}
      {focusPostTitle && (
        <Paper
          sx={{
            overflow: "hidden",
            my: 2,
            p: 0.5,
            height: "60vh",
            width: "110%",
            ml: "-5%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: 1,
              py: 0.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                maxWidth: "70vw",
                display: "-webkit-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {focusPostTitle}
            </Typography>
            <Box sx={{ display: "flex", alignContent: "center", gap: 1 }}>
              <IconButton
                sx={{ width: "20px", height: "20px" }}
                onClick={() => window.open(focusPostLink, "_blank")}
              >
                <LibraryAddIcon />
              </IconButton>
              <IconButton
                sx={{ width: "20px", height: "20px" }}
                onClick={() => {
                  setFocusPostTitle("");
                  setFocusPostLink("");
                  setFocusPostId(0);
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </Box>
          </Box>
          <iframe src={focusPostLink} width="100%" height="100%" />
        </Paper>
      )}
      {data ? (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 1.5,
            width: { xs: "90vw", sm: "95vw", md: "42vw" },
            height: focusPostTitle
              ? { xs: "17vh", md: "20vh" }
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
              height: focusPostTitle
                ? { xs: "13vh", md: "16vh" }
                : { xs: "60vh", md: "73vh" },
              overflow: "auto",
              position: "relative",
              p: "6px 6px 10px 12px",
              "&::-webkit-scrollbar": {
                width: "6px",
                backgroundColor: "lightgray",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray", // 스크롤바 색상
                borderRadius: "20px", // 스크롤바 모양
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
                        backgroundColor:
                          focusPostId === item.id ? "#755139" : "white",
                        color: focusPostId === item.id ? "white" : "black",
                        ":hover": {
                          backgroundColor:
                            focusPostId === item.id ? "#755139" : "white",
                        },
                      }}
                      onClick={() => {
                        setFocusPostTitle(item.title);
                        setFocusPostLink(item.url);
                        setFocusPostId(item.id);
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
