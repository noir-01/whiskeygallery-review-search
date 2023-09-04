import { useMemo, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  List,
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
import type { ElemenetType, ReviewStepperProps } from "@/types/review";

const ReviewStepper = ({
  step,
  review,
  handleUpdateReview,
}: ReviewStepperProps) => {
  const [open, setOpen] = useState(false);
  const [elementList, setElementList] = useState<ElemenetType[]>(
    review.elementList
  );
  const [comment, setComment] = useState<string>(review.comment);
  const [score, setScore] = useState<string>(review.score);
  const [addElement, setAddElement] = useState<ElemenetType>({
    name: "",
    value: 3,
  });

  const nameList = useMemo(
    () => elementList.map((element) => element.name),
    [elementList]
  );
  const valueList = useMemo(
    () => elementList.map((element) => element.value),
    [elementList]
  );

  const handleDeleteElement = (value: string) => {
    const newList = elementList.filter((element) => element.name !== value);
    setElementList(newList);
  };

  const handleClickElement = (selectElement: ElemenetType) => {
    if (!nameList.includes(selectElement.name) && elementList.length < 8) {
      const newList = [...elementList, selectElement];
      setElementList(newList);
      handleUpdateReview(step, {
        ...review,
        elementList: newList,
      });
    }
    if (nameList.includes(selectElement.name)) {
      const newList = elementList.filter((element) => {
        return element.name !== selectElement.name;
      });
      setElementList(newList);
      handleUpdateReview(step, {
        ...review,
        elementList: newList,
      });
    }
  };

  const handleChangeElementValue = (id: string, newValue: number) => {
    const newList = elementList.map((element) => {
      if (element.name === id) element.value = newValue;
      return element;
    });
    setElementList(newList);
    handleUpdateReview(step, {
      ...review,
      elementList: newList,
    });
  };

  return (
    <Box>
      {!open && (
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
          <Grid item xs={6.5}>
            <Paper sx={{ height: "100%", py: 0.5 }}>
              <Typography sx={{ px: 1, fontSize: { xs: "12px", sm: "16px" } }}>
                Diagram
              </Typography>
              <Divider sx={{ m: 0.5 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {nameList.length > 0 && (
                  <ElementChart
                    id={`${step}`}
                    nameList={nameList}
                    valueList={valueList}
                  />
                )}
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
              <Typography sx={{ px: 1, fontSize: { xs: "12px", sm: "16px" } }}>
                Elements
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

          <Grid item xs={6.5}>
            <Paper sx={{ px: 2, height: "100%", display: "flex" }}>
              <InputBase
                type="number"
                placeholder="Total score"
                value={score}
                onChange={(e) => {
                  setScore(e.target.value);
                  handleUpdateReview(step, {
                    ...review,
                    score: e.target.value,
                  });
                }}
                sx={{ fontSize: { xs: "14px", sm: "18px" } }}
              />
            </Paper>
          </Grid>
          <Grid item xs={6.5}>
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
              }}
            >
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
      )}

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
              Element List
            </Typography>
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{ width: "32px", height: "32px" }}
            >
              {open ? (
                <UnfoldLessIcon sx={{ fontSize: "20px" }} />
              ) : (
                <UnfoldMoreIcon sx={{ fontSize: "20px" }} />
              )}
            </IconButton>
          </Box>
          <Divider sx={{ m: 0 }} />
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: 1,
              height: open ? { xs: "60vh", sm: "70vh" } : "30vh",
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
          </List>
        </Paper>
      </Box>

      {!open && (
        <Box sx={{ mb: 1 }}>
          <Paper
            component="form"
            sx={{
              height: "82px",
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              "&::-webkit-scrollbar": {
                width: "12px",
                backgroundColor: "lightgray",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray", // 스크롤바 색상
                borderRadius: "20px", // 스크롤바 모양
              },
            }}
          >
            <InputBase
              placeholder="Comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                handleUpdateReview(step, {
                  ...review,
                  comment: e.target.value,
                });
              }}
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
