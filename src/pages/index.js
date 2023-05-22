import Head from 'next/head';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, CardMedia, Grid } from '@mui/material';
import { MainLayout } from '../components/main-layout';
import { HomeHero } from '../components/home/home-hero';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { useRouter } from 'next/router';


// NOTE: must enable SSR for app here to enable SEO for page (unimplemented)

const Page = () => {
  const router = useRouter();

  const [app, setApp] = useState(null);

  useEffect(() => {
    getApp()
      .then((app) => {
        setApp(app)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  if (!app) return <></>;

  return (<>
    <Head>
      <title>
        { app.appName }
      </title>
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta property="og:url" content={router.asPath} key="ogurl" />
      <meta property="og:image" content={app.appImage} key="ogimage" />
      <meta property="og:site_name" content="NFT Photo Contest" key="ogsitename" />
      <meta property="og:title" content="NFT Photo Contest" key="ogtitle" />
      <meta property="og:description" content={"See what's happening at the London Blockchain Convention by exploring the NFT Photo Contest and voting for your favorite entries!"} key="ogdesc" />
    </Head>
    <main>
      <Grid container spacing={2} mb={"1em"}>
        <Grid item sm={12} md={7} lg={6}>
          <HomeHero app={app} />
        </Grid>
        <Grid item sm={12} md={5} lg={6} sx={{ display: 'flex', flexDirection: { xs:'column', md:'row' }, alignItems: 'center', mt: { xs: '.5em' , md: '2em' } }}>
          <Card sx={{
            backgroundColor: '#ffffff',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '32px',
            border: 32,
            borderColor: "background.paper"
          }}>
            <CardMedia
              component="img"
              alt="app image"
              image={app.appImage}
            />
          </Card>
        </Grid>
      </Grid>
    </main>
  </>);
};

Page.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

export default Page;

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', {}));
  return appObject.data.app;
}