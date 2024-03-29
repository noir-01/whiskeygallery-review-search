import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import type { ReviewSliderProps } from "@/types/review";

import CloseIcon from "@mui/icons-material/Close";

const ReviewSlider = ({
  title,
  value,
  onClick,
  handleChangeElementValue,
}: ReviewSliderProps) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      gap: 1.5,
      px: 1,
      alignItems: "center",
      height: "24px",
      mb: 0.5,
    }}
  >
    <Box
      sx={{
        whiteSpace: "nowrap",
        minWidth: { xs: "40px", sm: "48px" },
        textAlign: "center",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontSize: { xs: "8px", sm: "12px" } }}
      >
        {title}
      </Typography>
    </Box>
    <Slider
      defaultValue={3}
      aria-valuetext={`${value}`}
      valueLabelDisplay="auto"
      step={1}
      marks
      min={1}
      max={5}
      onChange={(e, value) => {
        if (typeof value === "number") handleChangeElementValue(title, value);
      }}
      value={value}
      sx={{ color: "#755139" }}
    />
    <CloseIcon
      onClick={() => onClick(title)}
      sx={{ color: "gray", fontSize: "20px", cursor: "pointer" }}
    />
  </Box>
);

export default ReviewSlider;
