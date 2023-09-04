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
    title: "Whiskey Gallery",
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
        <meta name="theme-color" content="#755139" key="themeColor" />
        <link rel="canonical" href={meta.url} />

        <meta property="og:title" content={meta.title} key="og_title" />
        <meta
          property="og:description"
          content={meta.description}
          key="og_description"
        />
        <meta property="og:site_name" content={meta.title} key="og_site_name" />
        <meta property="og:url" content={meta.url} key="og_url" />

        <meta name="twitter:title" content={meta.title} key="twt_title" />
        <meta
          name="twitter:description"
          content={meta.description}
          key="twt_description"
        />
        <meta name="twitter:url" content={meta.url} key="twt_url" />

        <meta
          name="apple-mobile-web-app-title"
          content={meta.title}
          key="apple_mobile_title"
        />

        <meta
          name="application-name"
          content={meta.title}
          key="application_name"
        />

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
