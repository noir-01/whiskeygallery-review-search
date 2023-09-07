import type { AppProps } from "next/app";
import Head from "next/head";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { CssBaseline, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const queryClient = new QueryClient();
  const meta = {
    description: "위스키 리뷰 검색 & 작성 사이트",
    title: "위스키 리뷰 검색/작성기",
    url: "https://whiskeyreview.ddns.net",
    // image:"",
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} key="title" />
        <meta name="description" content={meta.description} key="description" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <SnackbarProvider
        action={(snackbarId) => (
          <IconButton onClick={() => closeSnackbar(snackbarId)} color="inherit">
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
