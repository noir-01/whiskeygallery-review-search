import { useState } from "react";
import { Box, Fab, Grid, useMediaQuery, useTheme } from "@mui/material";
import {
  BorderColor as BorderColorIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import ReviewBox from "@/components/templates/ReviewBox";
import SearchBox from "@/components/templates/SearchBox";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSearchBox, setIsSearchBox] = useState(true);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        backgroundColor: "#F2EDD7",
        width: "100%",
        height: "100vh",
        justifyContent: "space-evenly",
        overflow: "auto",
      }}
    >
      <Grid
        item
        xs={0}
        md={5}
        sx={{ display: isMobile && !isSearchBox ? "none" : "block" }}
      >
        <SearchBox />
      </Grid>
      <Grid
        item
        xs={11}
        md={5}
        sx={{ display: isMobile && isSearchBox ? "none" : "block" }}
      >
        <ReviewBox />
      </Grid>

      {isMobile && (
        <Fab
          size="small"
          variant="extended"
          onClick={() => setIsSearchBox(!isSearchBox)}
          sx={{
            position: "fixed",
            top: "16px",
            right: "20px",
            backgroundColor: "#F2EDD7",

            ":hover": { backgroundColor: "#F2EDD7" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              fontSize: "12px",
              fontWeight: 700,
              alignItems: "center",
              color: "#755139",
              svg: { fontSize: "16px", color: "#755139" },
            }}
          >
            {isSearchBox ? <BorderColorIcon /> : <SearchIcon />}
            {isSearchBox ? "리뷰 작성하기" : "리뷰 검색하기"}
          </Box>
        </Fab>
      )}
    </Grid>
  );
}
