import Head from 'next/head';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Breadcrumbs, IconButton, Typography, Grid, LinearProgress, TextField } from '@mui/material';
import { BasicSearchbar } from 'src/components/widgets/basic/basic-searchbar';
import { MainLayout } from 'src/components/main-layout';
import { VoteLogin } from 'src/components/explorer/voteLogin';
import { NftCard } from 'src/components/explorer/NftCard';
import axios from 'axios';
import React from 'react';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';
import { useAuth } from 'src/hooks/use-auth';
import { HomeHandcash } from 'src/components/home/home-handcash';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});
const slotButtonStyle = { color: 'blue', border: '1px solid blue'};
const textStyle = { font: 'nunito', lineHeight: '50px' };
const boldTextStyle = { font: 'nunito', fontWeight: 'bold', lineHeight: '50px' };

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const ExploreCollectionPage = () => {
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  const [nfts, setNFTs] = useState(null);
  const [chosenCollection, setChosenCollection] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(19);
  const [nftSearch, setNftSearch] = useState(null);
  const [slotId, setSlotId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [page, setPage] = useState(1);
  const [voted, setVoted] = useState(null);
  const { user } = useAuth();


  function nextPage() {
    setFrom(from+20); 
    setTo(to+20);
    setNFTs(null);
    setPage(page+1);
    //scroll(0,0)
  }

  function lastPage() {
    if (from > 0) { 
      setFrom(from-20); 
      setTo(to-20);
      setNFTs(null);
      setPage(page-1);
      //scroll(0,0)
    }
  }

  const handlePageChange = (event) => {
    setPage(event.target.value);
    const newValue = parseInt(event.target.value);
    if (!isNaN(newValue)) {
      setFrom((newValue-1)*20);
      setTo((newValue-1)*20+19);
    }
  };

  const handleNftSearch = (e) => {
    if (e.key === "Enter") {
      setNftSearch(e.target.value);
    }
  }

  const handleVote = async () => {
    voteOnCollection(nfts[0].nftId);
    setVoted(true);
  }

  useEffect(() => {
    if (router.isReady) {
      setSlotId(router.asPath.split("/")[3]);
      setCollectionId(router.asPath.split("/")[5]);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (slotId) {
      getSlot(slotId)
        .then((slot) => {
          setChosenSlot(slot);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [slotId]);

  useEffect(() => {
    if (collectionId) {
      getCollection(collectionId, sort)
        .then((collection) => {
          setChosenCollection(collection);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [collectionId]);

  useEffect(() => {
    if (chosenCollection) {
      getNFTs({ collectionId: chosenCollection.collectionId, to, from })
        .then((nfts) => {
          setNFTs(nfts);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [chosenCollection, from, to]);

  useEffect(() => {
    if (collectionId) {
      getNFTs({ collectionId: chosenCollection.collectionId, serials:nftSearch })
        .then((nfts) => {
          setNFTs(nfts);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [nftSearch]);

  useEffect(() => {
    if (user && nfts) {
      console.log("In the use effect");
      if(containsUser(nfts[0], user)){
        setVoted(true);
      }
    }
  }, [user, nfts]);

  useEffect(() => {
    getApp()
      .then((app) => {
        setApp(app);
      })
      .catch((e) => {
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  //if (!user) return <HomeHandcash />;
  if (!(chosenCollection && chosenSlot && app)) return loading;

  return (<>
    <Head>
      {/* Open Graph */}
      <meta property="og:url" content={router.asPath} key="ogurl" />
      <meta property="og:image" content={chosenCollection.collectionImage} key="ogimage" />
      <meta property="og:site_name" content={chosenCollection.collectionName} key="ogsitename" />
      <meta property="og:title" content={chosenCollection.collectionName} key="ogtitle" />
      <meta property="og:description" content={"Vote for " + chosenCollection.tags[0] + "'s entry into the NFT Photo Contest!"} key="ogdesc" />
    </Head>
    <Box sx={{ backgroundColor: 'none', py: 5 }}>
      <Box sx={{
        width: '95%',
        alignSelf: 'stretch',
        marginLeft: "auto",
        marginRight: "auto",
        py: 1,
        px: {xs:2, sm:5},
        backgroundColor: 'none'
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink underline="hover" color="inherit" href="/explorer">
                App
              </NextLink>
              <NextLink underline="hover" color="inherit" href={`/explorer/slot/${slotId}`}>
                Slot
              </NextLink>
              <Typography color="text.primary">
                Collection
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <Typography variant="h3" sx={{ font: 'nunito', fontWeight: 'bold', lineHeight: '40px' }}>
              { chosenCollection.collectionName }
            </Typography> 
            <Typography variant="p2" sx={textStyle}>
              Creator:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
             { chosenCollection.tags[0] } &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              App:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {app.appName} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Slot:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenSlot.slotName} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Minted:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenCollection.minted} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Max Supply:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              { (chosenCollection.maximum > 900000000) ? '\u221e' : chosenCollection.maximum } &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Type:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenCollection.type} &emsp;
            </Typography>
          </Grid>
          {user ?
          <></>
          :
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
          <VoteLogin></VoteLogin>
          </Grid>}
          {user && !voted ?
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
          <Button onClick={handleVote}
            sx={{
              height: '4em',
              width: '20em',
              backgroundColor: '#045CD2', 
              color: 'white',
              fontSize: '1em',
              px: '1em',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#045CD2',
                transform: 'scale(1.01)',
              }
            }}
          >
            Vote For This Entry
          </Button>
          </Grid> 
          :<></>}
          {user && voted ?
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
          <Typography>
            You&apos;ve voted for this collection!
          </Typography>
          </Grid> 
          :<></>}
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
            <Box sx={{ left: 0, width: "100%" }}>
              <BasicSearchbar onKeyPress={handleNftSearch} sx={{ left: 0, width: "80%", p: 1 }}/>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{}}>
              <Typography variant="h3">
                Select NFT to View Details
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} sx={{ p: 1 }}>
              { (!!nfts) ? nfts.map((nft) => (
                <React.Fragment key={nft.nftId}>
                  <NftCard collection={chosenCollection} nft={nft} slot={chosenSlot} />
                </React.Fragment>
              )) : <LinearProgress sx={{ width: '100%', mb: '1rem' }}/> }
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="p2" alignSelf="center">
                  {from}-{to} of {chosenCollection.minted} &emsp;
                </Typography>
                <IconButton onClick={lastPage}>
                  <ArrowBackIosIcon/>
                </IconButton>
                <TextField
                  type="number"
                  label="Page"
                  value={page}
                  onChange={handlePageChange}
                />
                <IconButton onClick={nextPage}>
                  <ArrowForwardIosIcon/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
  )
}

ExploreCollectionPage.getLayout = (page) => (
    <MainLayout>
      { page }
    </MainLayout>
  );

export default ExploreCollectionPage;

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.app;
}

const getSlot = async (slotId)=>{ 
  if (slotId.length > 10) {
    const slotsObject = (await axios.post('/api/slot/info', { slotId }));
    return slotsObject.data.slot;
  }
}


const getCollection = async (collection, sortFunction) => {
  if (collection.length > 10) {
    const collectionsObject = (await axios.post('/api/collection/info', { collectionId: collection, idOnly: false, includeDeactivated: false }));
    return collectionsObject.data.collections[0];
  }
}

const getNFTs = async ({ collectionId, serials, from, to }) => {
  let nftsObject;
  if (collectionId) {
    if (serials) {
      nftsObject = (await axios.post('/api/collection/nfts', { collectionId, idOnly: false, serials }));
    } else {  
      nftsObject = (await axios.post('/api/collection/nfts', { collectionId, idOnly: false, from, to }));
    }
    return nftsObject.data.collection.nfts;
  }
}

const voteOnCollection = async (nftId) => {
  let voteObject = (await axios.post('/api/nft/vote', { nftId:nftId}));
  return voteObject;
}

const containsUser = (nft, user) =>{
  console.log(nft);
  if(nft.properties){
    if(nft.properties["6464dae89c62e203e8e57cd6"]){
      if(nft.properties["6464dae89c62e203e8e57cd6"].votes){
        if(nft.properties["6464dae89c62e203e8e57cd6"].votes.includes(user.handle)){
          console.log("here");
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}