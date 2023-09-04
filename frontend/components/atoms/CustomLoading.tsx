import { CircularProgress, Dialog } from "@mui/material";

const CustomLoading = ({ isLoading }: { isLoading: boolean }) => (
  <Dialog
    open={isLoading}
    sx={{ overflowY: "hidden" }}
    PaperProps={{
      style: {
        backgroundColor: "transparent",
        overflow: "hidden",
        boxShadow: "none",
      },
    }}
  >
    <CircularProgress variant="indeterminate" size={40} thickness={4} />
  </Dialog>
);

export default CustomLoading;