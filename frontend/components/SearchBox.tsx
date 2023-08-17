import { useState, KeyboardEvent } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  ListItemButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import TuneIcon from "@mui/icons-material/Tune";

import { useQuery } from "@tanstack/react-query";

interface searchType {
  id: number;
  recommend: number;
  reply: number;
  time: number;
  title: string;
  url: string;
}

const SearchBox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<searchType[]>([]);

  const [focusPostId, setFocusPostId] = useState(0);
  const [focusPostTitle, setFocusPostTitle] = useState("");
  const [focusPostLink, setFocusPostLink] = useState("");
  const [displayedPost, setDisplayedPost] = useState(20);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [isOpenSearchTools, setIsSearchTools] = useState(false);
  const [searchOptionA1, setSearchOptionA1] = useState("");
  const [searchOptionA2, setSearchOptionA2] = useState("");
  const [searchOptionA3, setSearchOptionA3] = useState("");
  const [searchOptionO1, setSearchOptionO1] = useState("");
  const [searchOptionO2, setSearchOptionO2] = useState("");
  const [searchOptionO3, setSearchOptionO3] = useState("");
  const [onSearch, setOnSearch] = useState(false);

  const enterKeyEventOnSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      target.blur();
      setSearchQuery(searchInput);
      setSearchOptionA1(searchInput);
      setOnSearch(true);
      setHasMoreData(true);
      setDisplayedPost(20);
    }
  };

  const convertMilliToDay = (date: number) => {
    const dateData = new Date(date);
    if (isMobile)
      return `${dateData.getFullYear().toString().slice(-2)}-${(
        dateData.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${dateData.getDate().toString().padStart(2, "0")}`;
    else
      return `${dateData.getFullYear()}-${(dateData.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${dateData.getDate().toString().padStart(2, "0")}`;
  };

  const getData = async (): Promise<searchType[]> => {
    const value = await fetch(
      `https://whiskeyreview.ddns.net:444/search/?aSearch1=${searchOptionA1}&aSearch2=${searchOptionA2}&aSearch3=${searchOptionA3}&oSearch1=${searchOptionO1}&oSearch2=${searchOptionO2}&oSearch3=${searchOptionO3}&age=`
    );
    return value.json();
  };

  const { data, isFetching, refetch } = useQuery(
    ["search", searchQuery],
    async () => await getData(),
    {
      enabled: onSearch,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60,
      onSuccess: (data) => {
        if (data.length <= 20) setHasMoreData(false);
        setSearchResult(data);
      },
    }
  );

  return (
    <>
      <Box sx={{ backgroundColor: "#F2EDD7", color: "black" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, my: 2, color: "#755139" }}
        >
          리뷰 검색하기
        </Typography>
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
                  pl: 1,
                  width: { xs: "90vw", sm: "auto" },
                }}
              >
                <Box sx={{ width: "100%", display: "flex" }}>
                  <InputBase
                    disabled={isOpenSearchTools}
                    type="search"
                    placeholder="리뷰를 검색하세요."
                    sx={{ flex: 1 }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={enterKeyEventOnSearch}
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "8px" }}
                    onClick={() => {
                      setIsSearchTools(!isOpenSearchTools);
                      if (!isOpenSearchTools) setSearchOptionA1(searchInput);
                      else {
                        setSearchInput(searchOptionA1);
                        setSearchOptionA2("");
                        setSearchOptionA3("");
                        setSearchOptionO1("");
                        setSearchOptionO2("");
                        setSearchOptionO3("");
                      }
                    }}
                  >
                    <TuneIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    sx={{ p: "8px" }}
                    aria-label="search"
                    onClick={() => {
                      setSearchQuery(searchInput);
                      setOnSearch(true);
                      setDisplayedPost(20);
                      setHasMoreData(true);
                      refetch();
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    my: isOpenSearchTools ? 1 : 0,
                    height: isOpenSearchTools ? "32px" : 0,
                    overflow: "hidden",
                    transition: ".5s",
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
                    sx={{
                      flexBasis: "30%",
                    }}
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
                    my: isOpenSearchTools ? 1 : 0,
                    height: isOpenSearchTools ? "32px" : 0,
                    overflow: "hidden",
                    transition: ".5s",
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
              </Paper>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* <Box
                sx={{
                  backgroundColor: "#755139",
                  color: "white",
                  borderRadius: 4,
                  fontSize: "12px",
                  px: 1,

                }}
              >
                추천순
              </Box> */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, textAlign: "end" }}
              >
                {data?.length ? ` 검색 결과 [${data?.length}개]` : ""}
              </Typography>
            </Box>
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
        <Box>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 1.5,
              width: { xs: "90vw", md: "42vw" },
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
                searchResult
                  // ?.sort((a, b) => (a.recommend > b.recommend ? -1 : 1))
                  ?.slice(0, displayedPost)
                  .map((item: searchType) => (
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
                          <Grid item xs={2} sx={{ whiteSpace: "nowrap" }}>
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
        </Box>
      </Box>
    </>
  );
};

export default SearchBox;
