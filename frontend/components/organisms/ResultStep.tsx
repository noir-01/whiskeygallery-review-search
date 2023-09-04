import { Fragment, useState } from "react";
import html2canvas from "html2canvas";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import {
  Download as DownloadIcon,
  KeyboardReturnRounded as KeyboardReturnRoundedIcon,
  Liquor as LiquorIcon,
  LocalBar as LocalBarIcon,
  RestartAltRounded as RestartAltRoundedIcon,
  TaskAltRounded as TaskAltRoundedIcon,
} from "@mui/icons-material";

import ElementChart from "@/components/molecules/ElementChart";
import ResetCheckDialog from "@/components/molecules/ResetCheckDialog";
import type { ResultStepProps, ReviewType } from "@/types/review";

const ResultStep = ({
  abv,
  firstStepReview,
  secondStepReview,
  thridStepReview,
  wbCode,
  whiskey,
  handleBack,
  handleReset,
}: ResultStepProps) => {
  const [isOpenResetCheckDialog, setIsOpenResetCheckDialog] = useState(false);

  const getNameList = (review: ReviewType) => {
    return review.elementList.map((element) => element.name);
  };
  const getValueList = (review: ReviewType) => {
    return review.elementList.map((element) => element.value);
  };

  const todayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleClickDownload = async () => {
    const element = document.getElementById("your-component-id");
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 4,
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${todayDate()}_${whiskey}.png`;
    link.click();
  };

  const changeFormattedText = (multiLineText: string) =>
    multiLineText.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        {index !== multiLineText.length - 1 && <br />}{" "}
      </Fragment>
    ));

  const buttonList = [
    {
      label: "Back",
      icon: <KeyboardReturnRoundedIcon />,
      onClick: handleBack,
    },
    {
      label: "Reset",
      icon: <RestartAltRoundedIcon />,
      onClick: () => setIsOpenResetCheckDialog(true),
    },
    {
      label: "Download",
      icon: <DownloadIcon />,
      onClick: handleClickDownload,
    },
  ];

  return (
    <Box sx={{ mb: 14 }}>
      <Box
        id="your-component-id"
        sx={{
          backgroundColor: "#755139",
          p: 1,
          borderRadius: 2,
          border: "2px solid #755139",
          height: "75%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 1.5,
            px: 0.5,
            alignItems: "flex-end",
          }}
        >
          <LiquorIcon sx={{ color: "white", fontSize: "36px" }} />
          <LocalBarIcon sx={{ color: "white", fontSize: "24px" }} />
          <Typography sx={{ color: "white", fontWeight: 700, ml: "auto" }}>
            {todayDate()}
          </Typography>
        </Box>
        <Paper sx={{ p: 1, mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              color: "gray",
              fontSize: "14px",
            }}
          >
            <Box sx={{ flex: 1 }}>Whiskey</Box>
            <Box sx={{ flex: 1 }}>ABV</Box>
            <Box sx={{ flex: 1 }}>WB code</Box>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            <Box sx={{ flex: 1 }}>{whiskey}</Box>
            <Box sx={{ flex: 1 }}>{abv}</Box>
            <Box sx={{ flex: 1 }}>{wbCode}</Box>
          </Box>
        </Paper>
        <Grid
          container
          xs={12}
          rowSpacing={1}
          sx={{ justifyContent: "space-between", mb: 1 }}
        >
          <Grid item xs={5.8} sm={4}>
            <Paper sx={{ py: 1, height: "100%" }}>
              <ElementChart
                id="1"
                nameList={getNameList(firstStepReview)}
                valueList={getValueList(firstStepReview)}
              />
            </Paper>
          </Grid>
          <Grid item xs={6} sm={7.8}>
            <Paper sx={{ p: 1, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                  Nose
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 700,
                  }}
                >
                  <TaskAltRoundedIcon
                    color="action"
                    sx={{ fontSize: "16px" }}
                  />
                  {firstStepReview.score}
                </Typography>
              </Box>
              <Box sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                {changeFormattedText(firstStepReview.comment)}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={5.8} sm={4}>
            <Paper sx={{ py: 1, height: "100%" }}>
              <ElementChart
                id="2"
                nameList={getNameList(secondStepReview)}
                valueList={getValueList(secondStepReview)}
              />
            </Paper>
          </Grid>
          <Grid item xs={6} sm={7.8}>
            <Paper sx={{ p: 1, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                  Palate
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 700,
                  }}
                >
                  <TaskAltRoundedIcon
                    color="action"
                    sx={{ fontSize: "16px" }}
                  />
                  {secondStepReview.score}
                </Typography>
              </Box>
              <Box sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                {changeFormattedText(secondStepReview.comment)}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={5.8} sm={4}>
            <Paper sx={{ py: 1, height: "100%" }}>
              <ElementChart
                id="3"
                nameList={getNameList(thridStepReview)}
                valueList={getValueList(thridStepReview)}
              />
            </Paper>
          </Grid>
          <Grid item xs={6} sm={7.8}>
            <Paper sx={{ p: 1, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                  Finish
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 700,
                  }}
                >
                  <TaskAltRoundedIcon
                    color="action"
                    sx={{ fontSize: "16px" }}
                  />
                  {thridStepReview.score}
                </Typography>
              </Box>
              <Box sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                {changeFormattedText(thridStepReview.comment)}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 0.5,
          mb: 5,
        }}
      >
        {buttonList.map(({ label, icon, onClick }) => (
          <Button
            key={label}
            onClick={onClick}
            sx={{
              color: "#755139",
              fontWeight: 700,
              textTransform: "none",
              svg: { mr: 0.5 },
            }}
          >
            {icon}
            {label}
          </Button>
        ))}
        {isOpenResetCheckDialog && (
          <ResetCheckDialog
            open={isOpenResetCheckDialog}
            onClose={() => setIsOpenResetCheckDialog(false)}
            onClick={handleReset}
          />
        )}
      </Box>
    </Box>
  );
};

export default ResultStep;
