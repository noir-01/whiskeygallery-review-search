import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  InputBase,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import ResultStep from "@/components/organisms/ResultStep";
import ReviewStepper from "@/components/organisms/ReviewStepper";
import { useReviewStore } from "@/store/MemoReview";
import { useWhiskeyStore } from "@/store/MemoWhiskey";
import snackbar from "@/utils/snackbar";

const ReviewBox = () => {
  const { resetReviewList } = useReviewStore();
  const { whiskey, resetWhiskey, updateWhiskey } = useWhiskeyStore();

  const steps = ["Nose", "Palate", "Finish"];

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepSkipped = (step: number) => skipped.has(step);

  const isWhiskeyEmpty = () => {
    if (!whiskey.name) {
      snackbar("위스키 이름을 입력하세요.");
      return true;
    }
    return false;
  };

  const handleNext = () => {
    let newSkipped = skipped;

    if (isWhiskeyEmpty()) return;

    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => {
    setActiveStep(0);
    resetWhiskey();
    resetReviewList();
    snackbar("리셋되었습니다.", "success");
  };

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 2, color: "#755139" }}
      >
        리뷰 작성하기
      </Typography>
      {activeStep === 3 ? (
        <ResultStep handleReset={handleReset} handleBack={handleBack} />
      ) : (
        <Box>
          <Paper
            component="form"
            sx={{
              p: "0 4px",
              display: "flex",
              alignItems: "center",
              my: 1.5,
              flex: 1,
            }}
          >
            <InputBase
              placeholder="Whiskey"
              value={whiskey.name}
              onChange={(e) => updateWhiskey("name", e.target.value)}
              sx={{ ml: 1, flex: 2 }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
              placeholder="ABV"
              value={whiskey.abv}
              onChange={(e) => updateWhiskey("abv", e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
              placeholder="WB code"
              value={whiskey.wbCode}
              onChange={(e) => updateWhiskey("wbCode", e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
          </Paper>

          <Stepper activeStep={activeStep} sx={{ mb: 1.5 }}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              if (isStepSkipped(index)) stepProps.completed = false;

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel
                    onClick={(_) => {
                      if (isWhiskeyEmpty()) return;
                      setActiveStep(index);
                    }}
                    sx={{
                      cursor: "pointer",
                      circle: {
                        color: "#755139",
                        opacity: activeStep === index ? 1 : 0.4,
                      },
                      path: {
                        color: "#755139",
                        opacity: activeStep === index ? 1 : 0.4,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Box sx={{ display: "flex", flexDirection: "row", mb: 1.5, gap: 1 }}>
            <Button
              size="small"
              color="inherit"
              variant="contained"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: "#755139", fontWeight: 700, flex: 1 }}
            >
              Back
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleNext}
              sx={{
                flex: 1,
                color: "white",
                fontWeight: 700,
                bgcolor: "#755139",

                ":active": { bgcolor: "#755139" },
                ":hover": { bgcolor: "#755139" },
              }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>

          {[0, 1, 2].map(
            (step) =>
              activeStep === step && <ReviewStepper key={step} step={step} />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ReviewBox;
