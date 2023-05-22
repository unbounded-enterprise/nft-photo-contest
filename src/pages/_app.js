import { Fragment } from 'react';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react"
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from '../contexts/auth-context';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { useRouter } from 'next/router';


const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const router = useRouter();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          NFT Photo Contest
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
        <meta name="twitter:card" content="summary" key="twcard" />
      <meta property="og:url" content={router.asPath} key="ogurl" />
      <meta property="og:image" content="https://nftphotocontest.com/static/appImage.png" key="ogimage" />
      <meta property="og:site_name" content="NFT Photo Contest" key="ogsitename" />
      <meta property="og:title" content="NFT Photo Contest" key="ogtitle" />
      <meta property="og:description" content={"See what's happening at the London Blockchain Convention by exploring the NFT Photo Contest and voting for your favorite entries!"} key="ogdesc" />
   
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <AuthConsumer>
              {
                (auth) => auth.isLoading
                  ? <Fragment />
                  : getLayout(<Component {...pageProps} />)
              }
            </AuthConsumer>
          </AuthProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
    </SessionProvider>
  );
};

export default App;
