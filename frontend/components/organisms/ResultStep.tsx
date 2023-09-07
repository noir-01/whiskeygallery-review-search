import { Fragment, useState } from "react";
import html2canvas from "html2canvas";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import {
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
  KeyboardReturnRounded as KeyboardReturnRoundedIcon,
  Liquor as LiquorIcon,
  LocalBar as LocalBarIcon,
  RestartAltRounded as RestartAltRoundedIcon,
  TaskAltRounded as TaskAltRoundedIcon,
} from "@mui/icons-material";

import ElementChart from "@/components/molecules/ElementChart";
import ResetCheckDialog from "@/components/molecules/ResetCheckDialog";
import { useReviewStore } from "@/store/MemoReview";
import { useWhiskeyStore } from "@/store/MemoWhiskey";
import type { ElementType, ResultStepProps } from "@/types/review";
import formattedTodayDate from "@/utils/formattedTodayDate";

const ResultStep = ({ handleBack, handleReset }: ResultStepProps) => {
  const { reviewList } = useReviewStore();
  const { whiskey } = useWhiskeyStore();

  const [isOpenResetCheckDialog, setIsOpenResetCheckDialog] = useState(false);

  const getNameList = (elementList: ElementType[]) =>
    elementList.map((element) => element.name);

  const getValueList = (elementList: ElementType[]) =>
    elementList.map((element) => element.value);

  const handleClickDownload = async () => {
    const element = document.getElementById("your-component-id");
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 4,
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${formattedTodayDate()}_${whiskey.name}.png`;
    link.click();
  };

  const changeFormattedText = (multiLineText: string) =>
    multiLineText.split("\n").map((line, index) => (
      <Fragment key={index}>
        {line}
        {index !== multiLineText.length - 1 && <br />}{" "}
      </Fragment>
    ));

  const rating = () => {
    const firstScore = Number(reviewList[0].score);
    const secondScore = Number(reviewList[1].score);
    const thirdScore = Number(reviewList[2].score);

    let zeroCount = 0;
    if (firstScore === 0) zeroCount++;
    if (secondScore === 0) zeroCount++;
    if (thirdScore === 0) zeroCount++;

    if (zeroCount !== 3)
      return (
        (firstScore + secondScore + thirdScore) /
        (3 - zeroCount)
      ).toFixed(1);

    return 0;
  };

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
    <Box>
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
          <Box
            sx={{
              color: "white",
              fontWeight: 700,
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DateRangeIcon sx={{ width: "20px" }} />
            {formattedTodayDate()}
          </Box>
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
            <Box sx={{ flex: 1 }}>Rating</Box>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            <Box sx={{ flex: 1 }}>{whiskey.name}</Box>
            <Box sx={{ flex: 1 }}>{whiskey.abv}</Box>
            <Box sx={{ flex: 1 }}>{whiskey.wbCode}</Box>
            <Box sx={{ flex: 1 }}>{rating()}</Box>
          </Box>
        </Paper>

        <Grid
          container
          rowSpacing={1}
          sx={{ justifyContent: "space-between", mb: 1 }}
        >
          {[0, 1, 2].map((step: number) => (
            <Fragment key={step}>
              <Grid item xs={5.8} sm={4}>
                <Paper sx={{ py: 1, height: "100%" }}>
                  <ElementChart
                    id={`${step}`}
                    nameList={getNameList(reviewList[step].elementList)}
                    valueList={getValueList(reviewList[step].elementList)}
                  />
                </Paper>
              </Grid>
              <Grid item xs={6} sm={7.8}>
                <Paper sx={{ p: 1, height: "100%" }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                      {["Nose", "Palate", "Finish"][step]}
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
                      {reviewList[step].score}
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                    {changeFormattedText(reviewList[step].comment)}
                  </Box>
                </Paper>
              </Grid>
            </Fragment>
          ))}
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
