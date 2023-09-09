import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

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
              placeholder="Whiskey name"
              value={whiskey.name}
              onChange={(e) => updateWhiskey("name", e.target.value)}
              sx={{ ml: 1, flex: 2 }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
              placeholder="WB code"
              type="number"
              value={whiskey.wbCode}
              onChange={(e) => updateWhiskey("wbCode", e.target.value)}
              sx={{
                ml: 1,
                flex: 1,
                fontSize: "14px",

                "input[type=number]::-webkit-inner-spin-button, \
              input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
              type="number"
              placeholder="ABV (1~100)"
              value={whiskey.abv}
              onBlur={(e) => {
                if (e.target.value !== "")
                  updateWhiskey(
                    "abv",
                    Number(Number(e.target.value).toFixed(3)).toString()
                  );
              }}
              onChange={(e) => {
                if (Number(e.target.value) > 99) updateWhiskey("abv", "100");
                else if (Number(e.target.value) < 1) {
                  if (e.target.value === "") updateWhiskey("abv", "");
                  else updateWhiskey("abv", "1");
                } else updateWhiskey("abv", e.target.value);
              }}
              sx={{
                ml: 1,
                flex: 1,
                fontSize: "14px",

                "input[type=number]::-webkit-inner-spin-button, \
                input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
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
              {activeStep === steps.length - 1 ? "Result" : "Next"}
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
