/* eslint-disable react/no-children-prop */
import { useState } from "react";
import Head from "next/head";
import { Fab, Grid, useMediaQuery, useTheme } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SearchIcon from "@mui/icons-material/Search";

import ReviewBox from "@/components/ReviewBox";
import SearchBox from "@/components/SearchBox";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSearchBox, setIsSearchBox] = useState(true);

  return (
    <>
      <Head children={undefined} />
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
          sx={{
            display: isMobile ? (isSearchBox ? "block" : "none") : "block",
          }}
        >
          <SearchBox />
        </Grid>
        <Grid
          item
          xs={11}
          md={5}
          sx={{
            display: isMobile ? (isSearchBox ? "none" : "block") : "block",
          }}
        >
          <ReviewBox />
        </Grid>

        {isMobile && (
          <Fab
            onClick={() => setIsSearchBox(!isSearchBox)}
            sx={{
              position: "fixed",
              bottom: "30px",
              backgroundColor: "#F2EDD7",
              ":hover": { backgroundColor: "#F2EDD7" },
            }}
          >
            {isSearchBox ? (
              <BorderColorIcon
                sx={{ display: "block", fontSize: "20px", color: "#755139" }}
              />
            ) : (
              <SearchIcon
                sx={{ display: "block", fontSize: "28px", color: "#755139" }}
              />
            )}
          </Fab>
        )}
      </Grid>
    </>
  );
}
