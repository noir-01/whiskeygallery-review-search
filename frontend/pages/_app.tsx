import type { AppProps } from "next/app";
import { SnackbarProvider, closeSnackbar } from "notistack";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CloseIcon from "@mui/icons-material/Close";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const queryClient = new QueryClient();

  return (
    <>
      <CssBaseline />
      <SnackbarProvider
        action={(snackbarId) => (
          <IconButton
            aria-label="snackbar close button"
            onClick={() => closeSnackbar(snackbarId)}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        )}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        preventDuplicate={true}
      >
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </SnackbarProvider>
    </>
  );
};

export default App;
