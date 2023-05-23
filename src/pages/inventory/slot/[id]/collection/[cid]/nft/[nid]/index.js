import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { BasicSearchbar } from "src/components/widgets/basic/basic-searchbar";
import { MainLayout } from "src/components/main-layout";
import axios from "axios";
import { NftDetailDisplay } from "src/components/DisplayNFT/NftDetailDisplay";
import CollectionDetailsInfos from "src/components/DisplayNFT/CollectionDetailsInfos";
import { parseBasicErrorClient } from "src/_api_/auth-api";
import { styled } from "@mui/system";
import { useAuth } from "src/hooks/use-auth";
import { HomeHandcash } from "src/components/home/home-handcash";

const CenteredImage = styled("img")({
  display: "block",
  marginLeft: "auto",
  maxWidth: "200px",
  marginRight: "auto",
  width: "50%",
});
const slotButtonStyle = {
  color: "blue",
  border: "1px solid blue",
  fontSize: "1vw",
};

const loading = (
  <>
    {" "}
    <CenteredImage src="/static/loader.gif" alt="placeholder" />{" "}
  </>
);

const InventoryNftDetailPage = () => {
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  //const [nftSort, setNftSort] = useState("ascending");
  const [chosenCollection, setChosenCollection] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [chosenNft, setChosenNft] = useState(null);

  const [slotId, setSlotId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [nftId, setNftId] = useState(null);
  const [handleEntry, setHandleEntry] = useState(null);
  const [sent, setSent] = useState(false);
  const [badSend, setBadSend] = useState(false);

  const { user } = useAuth();

  const handleSend = async () => {
    try {
      let response = await sendNFT(chosenNft, handleEntry);
      if (response.status === 200) {
        setSent(true);
      }
    } catch (error) {
      setBadSend(true);
    }

    /*let response = await sendNFT(chosenNft, handleEntry);
    if (response.status === 200) {
      setSent(true);
    } else {
      if(!sent){
        setBadSend(true);
      }
    }*/
  };

  const handleEntryHandler = (e) => {
    setHandleEntry(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    if (router.isReady) {
      setSlotId(router.asPath.split("/")[3]);
      setCollectionId(router.asPath.split("/")[5]);
      setNftId(router.asPath.split("/")[7]);
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
          console.log("setting error: ", error.message);
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
          console.log("setting error: ", error.message);
        });
    }
  }, [collectionId]);

  useEffect(() => {
    if (nftId) {
      getNft(nftId)
        .then((nft) => {
          setChosenNft(nft);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    }
  }, [nftId]);

  useEffect(() => {
    getApp()
      .then((app) => {
        setApp(app);
      })
      .catch((e) => {
        const error = parseBasicErrorClient(e);
        console.log("setting error: ", error.message);
      });
  }, []);

  if (!user) return <HomeHandcash />;
  if (!(chosenCollection && chosenSlot && chosenNft && app)) return loading;

  return (
    <Box sx={{ backgroundColor: "none", py: 5 }}>
      <Box
        sx={{
          width: "95%",
          alignSelf: "stretch",
          marginLeft: "auto",
          marginRight: "auto",
          py: 1,
          px: { xs: 2, sm: 5 },
          backgroundColor: "none",
        }}
      >
        <Grid container spacing={2} minWidth="320px">
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink underline="hover" color="inherit" href="/inventory">
                App
              </NextLink>
              <NextLink
                underline="hover"
                color="inherit"
                href={`/inventory/slot/${slotId}`}
              >
                Slot
              </NextLink>
              <NextLink
                underline="hover"
                color="inherit"
                href={`/inventory/slot/${slotId}/collection/${collectionId}`}
              >
                Collection
              </NextLink>
              <Typography color="text.primary">NFT</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid
            item
            container
            xs={12}
            justifyContent="flex-start"
            sx={{ backgroundColor: "none" }}
          >
            <Grid item xs={12}>
              <Typography variant="h3" sx={{ lineHeight: "40px" }}>
                {chosenCollection.collectionName} #{chosenNft.serial}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CollectionDetailsInfos
                creator={chosenCollection.tags[0]}
                appName={app.appName}
                slotName={chosenSlot.slotName}
                totalSupply={chosenCollection.maximum}
                collectionName={chosenCollection.collectionName}
                type={chosenCollection.type}
                nftLocation={chosenNft.location}
              />
            </Grid>
            <Grid container spacing={2} pt={1} alignItems="center">
              <Grid item xs={12} md={6} lg={4}>
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: "#045CD2",
                    color: "white",
                    fontSize: "1em",
                    px: "1em",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#045CD2",
                      transform: "scale(1.01)",
                    },
                  }}
                  onClick={handleSend}
                >
                  Send
                </Button>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  onChange={handleEntryHandler}
                  label="Recipient Handle"
                  sx={{ left: 0, p: 1 }}
                />
              </Grid>
              {sent ? (
                <Grid item sm={12} md={6} lg={4}>
                  <Typography color="text.primary" fontWeight="bold">
                    Sent Successfully
                  </Typography>
                </Grid>
              ) : (
                <></>
              )}
              {badSend ? (
                <Grid item sm={12} md={6} lg={4}>
                  <Typography color="text.primary">Send Unsuccesful</Typography>
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item container xs={12} sx={{ my: "2rem" }}>
              <NftDetailDisplay nft={chosenNft} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

InventoryNftDetailPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default InventoryNftDetailPage;

const getApp = async () => {
  const appObject = await axios.post("/api/app/info", {});
  return appObject.data.app;
};

const getSlot = async (slotId) => {
  // just used for testing
  if (slotId.length > 10) {
    const slotsObject = await axios.post("/api/slot/info", { slotId });
    return slotsObject.data.slot;
  }
};

const getCollection = async (collection, sortFunction) => {
  if (collection.length > 10) {
    const collectionsObject = await axios.post("/api/collection/info", {
      collectionId: collection,
      idOnly: false,
      includeDeactivated: false,
    });
    return collectionsObject.data.collections[0];
  }
};

const getNft = async (nftId) => {
  let nftObject;
  if (nftId) {
    nftObject = await axios.post("/api/nft/info", { nftId });
  }
  return nftObject.data.nfts[0];
};

const sendNFT = async (nft, recipientHandle) => {
  let nftsObject;
  nftsObject = await axios.post("/api/nft/send", {
    recipientHandle: recipientHandle,
    nftId: nft.nftId,
  });
  return nftsObject;
};
