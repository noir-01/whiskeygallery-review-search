import { VariantType, enqueueSnackbar } from "notistack";

const snackbar = (notice: string, variant: VariantType = "error") =>
  enqueueSnackbar(notice, {
    variant: variant,
    autoHideDuration: 2000,
  });

export default snackbar;
