import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const CustomLoading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Box
      sx={{
        display: isLoading ? "block" : "none",
        svg: { color: "#755139" },
        textAlign: "center",
      }}
    >
      <CircularProgress
        variant="indeterminate"
        thickness={4}
        sx={{ circle: { r: { xs: "16px", sm: "20px" } } }}
      />
    </Box>
  );
};

export default CustomLoading;
