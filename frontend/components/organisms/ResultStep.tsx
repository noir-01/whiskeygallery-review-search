import { useState } from "react";
import html2canvas from "html2canvas";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ChangeFormattedText from "../atoms/ChangeFormattedText";
import ElementChart from "@/components/molecules/ElementChart";
import CustomDialog from "@/components/molecules/CustomDialog";
import { useReviewStore } from "@/store/MemoReview";
import { useWhiskeyStore } from "@/store/MemoWhiskey";
import type { ElementType, ResultStepProps } from "@/types/review";
import formattedTodayDate from "@/utils/formattedTodayDate";

import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import DownloadIcon from "@mui/icons-material/Download";
import LiquorIcon from "@mui/icons-material/Liquor";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

const ResultStep = ({ handleBack, handleReset }: ResultStepProps) => {
  const { reviewList } = useReviewStore();
  const { whiskey } = useWhiskeyStore();

  const [isOpenResetCheckDialog, setIsOpenResetCheckDialog] = useState(false);
  const [isOpenPushDialog, setIsOpenPushDialog] = useState(false);

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

    setIsOpenPushDialog(true);
  };

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
    <Box sx={{ mx: { xs: "-3vw", md: 0 } }}>
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
            <Box sx={{ flex: 2 }}>Whiskey</Box>
            {whiskey.wbCode !== "" && <Box sx={{ flex: 1.5 }}>WB code</Box>}
            {whiskey.abv !== "" && <Box sx={{ flex: 1 }}>ABV</Box>}
            {rating() !== 0 && <Box sx={{ flex: 1 }}>Rating</Box>}
          </Box>
          <Divider />
          <Box sx={{ display: "flex", textAlign: "center", fontWeight: "600" }}>
            <Box sx={{ flex: 2 }}>{whiskey.name}</Box>
            {whiskey.wbCode !== "" && (
              <Box sx={{ flex: 1.5 }}>{whiskey.wbCode}</Box>
            )}
            {whiskey.abv !== "" && (
              <Box sx={{ flex: 1 }}>{`${whiskey.abv}%`}</Box>
            )}
            {rating() !== 0 && <Box sx={{ flex: 1 }}>{rating()}</Box>}
          </Box>
        </Paper>

        <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          {[0, 1, 2].map((step: number) => {
            const isEmptyList = reviewList[step].elementList.length === 0;
            const isEmptyStep =
              isEmptyList &&
              reviewList[step].comment === "" &&
              reviewList[step].score === "";

            if (isEmptyStep) return <></>;
            return (
              <Paper key={step} sx={{ p: 1, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", sm: "16px" },
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
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
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ maxWidth: "180px", mt: "-28px" }}>
                    {!isEmptyList && (
                      <ElementChart
                        id={`${step}`}
                        isHideLabel
                        nameList={getNameList(reviewList[step].elementList)}
                        valueList={getValueList(reviewList[step].elementList)}
                      />
                    )}
                  </Box>
                </Box>
                <ChangeFormattedText multiLineText={reviewList[step].comment} />
              </Paper>
            );
          })}
        </Box>
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
          <CustomDialog
            content="정말로 리셋하시겠습니까?"
            open={isOpenResetCheckDialog}
            onClose={() => setIsOpenResetCheckDialog(false)}
            onClick={handleReset}
          />
        )}

        {isOpenPushDialog && (
          <CustomDialog
            content={
              <>
                {"리뷰가 이미지로 저장되었습니다."}
                <br />
                {"위스키 갤러리에 작성하러 가시겠습니까?"}
              </>
            }
            open={isOpenPushDialog}
            onClose={() => setIsOpenPushDialog(false)}
            onClick={() => {
              setIsOpenPushDialog(false);
              window.open(
                "https://gall.dcinside.com/mgallery/board/write/?id=whiskey",
                "_blank"
              );
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ResultStep;
