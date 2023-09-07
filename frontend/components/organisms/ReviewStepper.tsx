import { useMemo, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import {
  PlaylistAdd as PlaylistAddIcon,
  UnfoldLess as UnfoldLessIcon,
  UnfoldMore as UnfoldMoreIcon,
} from "@mui/icons-material";

import ReviewSlider from "@/components/atoms/ReviewSlider";
import ElementChart from "@/components/molecules/ElementChart";
import ElementPartBox from "@/components/molecules/ElementPartBox";
import getElementList from "@/data/getElementList";
import { useReviewStore } from "@/store/MemoReview";
import type { ElementType } from "@/types/review";
import snackbar from "@/utils/snackbar";

const ReviewStepper = ({ step }: { step: number }) => {
  const { reviewList, updateReview } = useReviewStore();

  const [open, setOpen] = useState(false);
  const [addElement, setAddElement] = useState<ElementType>({
    name: "",
    value: 3,
  });

  const elementList = useMemo(
    () => reviewList[step].elementList,
    [reviewList[step].elementList]
  );
  const nameList = elementList.map((element) => element.name);
  const valueList = elementList.map((element) => element.value);

  const handleDeleteElement = (targetName: string) => {
    const newList = elementList.filter(
      (element) => element.name !== targetName
    );
    updateReview("elementList", step, newList);
  };

  const handleClickElement = (selectElement: ElementType) => {
    if (!nameList.includes(selectElement.name) && elementList.length < 8) {
      const newList = [...elementList, selectElement];
      updateReview("elementList", step, newList);
    } else if (nameList.includes(selectElement.name)) {
      handleDeleteElement(selectElement.name);
    } else {
      snackbar(`최대 8개까지 선택이 가능합니다.`);
    }
  };

  const handleChangeElementValue = (id: string, newValue: number) => {
    const newList = elementList.map((element) => {
      if (element.name === id) element.value = newValue;
      return element;
    });
    updateReview("elementList", step, newList);
  };

  return (
    <Box>
      <Grid
        container
        spacing={1}
        columns={13}
        sx={{
          height: "100%",
          transition: "height 0.5s",
          overflow: "hidden",
          pb: 1,
        }}
      >
        {!open && nameList.length > 0 && (
          <>
            <Grid item xs={6.5}>
              <Paper sx={{ height: "100%", py: 0.5 }}>
                <Typography
                  sx={{ px: 1, fontSize: { xs: "12px", sm: "16px" } }}
                >
                  Diagram
                </Typography>
                <Divider sx={{ m: 0.5 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ElementChart
                    id={`${step}`}
                    nameList={nameList}
                    valueList={valueList}
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={6.5}>
              <Paper
                sx={{
                  py: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  height: "100%",
                }}
              >
                <Typography
                  sx={{ px: 1, fontSize: { xs: "12px", sm: "16px" } }}
                >
                  {`Elements (${elementList.length}/8)`}
                </Typography>
                <Divider sx={{ m: 0.5 }} />
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {elementList.map((element, index) => (
                    <ReviewSlider
                      title={element.name}
                      value={element.value}
                      onClick={handleDeleteElement}
                      handleChangeElementValue={handleChangeElementValue}
                      key={index}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </>
        )}

        <Grid item xs={6.5}>
          <Paper sx={{ px: 2, height: "100%" }}>
            <InputBase
              type="number"
              placeholder="Total score"
              value={reviewList[step].score}
              onChange={(e) => updateReview("score", step, e.target.value)}
              sx={{
                width: "100%",
                fontSize: { xs: "14px", sm: "18px" },
                "input[type=number]::-webkit-inner-spin-button, \
                  input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={6.5}>
          <Paper sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <InputBase
              placeholder="Add Element"
              value={addElement.name}
              onChange={(e) =>
                setAddElement({ ...addElement, name: e.target.value })
              }
              sx={{ ml: 2, flex: 1, fontSize: { xs: "14px", sm: "18px" } }}
            />
            <IconButton
              onClick={() => {
                if (addElement.name !== "") {
                  handleClickElement(addElement);
                  setAddElement({ name: "", value: 3 });
                }
              }}
            >
              <PlaylistAddIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 1 }}>
        <Paper sx={{ px: 1, pb: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pr: 0.5,
            }}
          >
            <Typography sx={{ mx: 1, fontSize: { xs: "12px", sm: "16px" } }}>
              {`Element List (${elementList.length}/8)`}
            </Typography>
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{ width: "32px", height: "32px", svg: { fontSize: "20px" } }}
            >
              {open ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            </IconButton>
          </Box>

          <Box
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: 1,
              height: open
                ? { xs: "60vh", sm: "70vh" }
                : nameList.length > 0
                ? nameList.length >= 3
                  ? "15vh"
                  : "25vh"
                : "50vh",
              transition: "height 0.5s",
              overflow: "auto",
            }}
          >
            {getElementList.map(({ title, values }) => (
              <ElementPartBox
                key={title}
                title={title}
                list={values}
                addElement={handleClickElement}
                nameList={nameList}
              />
            ))}
          </Box>
        </Paper>
      </Box>

      {!open && (
        <Box sx={{ mb: 1 }}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",

              "&::-webkit-scrollbar": {
                width: "12px",
                backgroundColor: "lightgray",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray",
                borderRadius: "20px",
              },
            }}
          >
            <InputBase
              placeholder="Comment"
              value={reviewList[step].comment}
              onChange={(e) => updateReview("comment", step, e.target.value)}
              sx={{ ml: 1, flex: 1, fontSize: { xs: "14px", sm: "18px" } }}
              multiline
              maxRows={3}
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ReviewStepper;
