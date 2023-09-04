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

import ResultStep from "../organisms/ResultStep";
import ReviewStepper from "../organisms/ReviewStepper";

interface ReviewType {
  elementList: { name: string; value: number }[];
  comment: string;
  score: string;
}

const ReviewBox = () => {
  const steps = ["Nose", "Palate", "Finish"];
  const initReview = { elementList: [], comment: "", score: "" };

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [whiskey, setWhiskey] = useState<string>("");
  const [abv, setAbv] = useState<string>("");
  const [wbCode, setWbCode] = useState<string>("");
  const [firstStepReview, setFirstStepReview] =
    useState<ReviewType>(initReview);
  const [secondStepReview, setSecondStepReview] =
    useState<ReviewType>(initReview);
  const [thridStepReview, setThridStepReview] =
    useState<ReviewType>(initReview);

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFirstStepReview(initReview);
    setSecondStepReview(initReview);
    setThridStepReview(initReview);
  };

  const handleUpdateReview = (step: number, review: ReviewType) => {
    if (step === 0) setFirstStepReview({ ...firstStepReview, ...review });
    else if (step === 1)
      setSecondStepReview({ ...secondStepReview, ...review });
    else if (step === 2) setThridStepReview({ ...thridStepReview, ...review });
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
        <ResultStep
          handleReset={handleReset}
          handleBack={handleBack}
          firstStepReview={firstStepReview}
          secondStepReview={secondStepReview}
          thridStepReview={thridStepReview}
          whiskey={whiskey}
          abv={abv}
          wbCode={wbCode}
        />
      ) : (
        <Box>
          <Paper
            component="form"
            sx={{
              p: "0 4px",
              display: "flex",
              alignItems: "center",
              my: 2,
              flex: 1,
            }}
          >
            <InputBase
              placeholder="Whiskey"
              value={whiskey}
              onChange={(e) => setWhiskey(e.target.value)}
              sx={{ ml: 1, flex: 2 }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
              placeholder="ABV"
              value={abv}
              onChange={(e) => setAbv(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase
              placeholder="WB code"
              value={wbCode}
              onChange={(e) => setWbCode(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
          </Paper>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step
                  key={label}
                  {...stepProps}
                  sx={{
                    circle: { color: "#755139", opacity: 0.7 },
                    path: { color: "#755139" },
                  }}
                >
                  <StepLabel
                    onClick={(_) => setActiveStep(index)}
                    sx={{ cursor: "pointer" }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Box sx={{ display: "flex", flexDirection: "row", my: 2, gap: 1 }}>
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
                bgcolor: "#755139",
                fontWeight: 700,
                ":active": {
                  bgcolor: "#755139",
                },
                ":hover": {
                  bgcolor: "#755139",
                },
              }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>

          {activeStep === 0 && (
            <ReviewStepper
              step={0}
              handleUpdateReview={handleUpdateReview}
              review={firstStepReview}
            />
          )}
          {activeStep === 1 && (
            <ReviewStepper
              step={1}
              handleUpdateReview={handleUpdateReview}
              review={secondStepReview}
            />
          )}
          {activeStep === 2 && (
            <ReviewStepper
              step={2}
              handleUpdateReview={handleUpdateReview}
              review={thridStepReview}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ReviewBox;
