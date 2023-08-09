import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import CloseIcon from "@mui/icons-material/Close";

const valuetext = (value: number) => {
  return `${value}`;
};

const ReviewSlider = ({
  title,
  value,
  onClick,
  handleChangeElementValue,
}: {
  title: string;
  value: number;
  onClick: (value: string) => void;
  handleChangeElementValue: (id: string, newValue: number) => void;
}) => {
  return (
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
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={5}
        onChange={(e, value) => {
          console.log(value);
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
};

export default ReviewSlider;
