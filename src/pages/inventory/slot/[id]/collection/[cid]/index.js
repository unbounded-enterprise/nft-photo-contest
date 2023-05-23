import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Breadcrumbs,
  LinearProgress,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { MainLayout } from "src/components/main-layout";
import { NftCard } from "src/components/inventory/NftCard";
import axios from "axios";
import React from "react";
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
const slotButtonStyle = { color: "blue", border: "1px solid blue" };
const textStyle = { font: "nunito", lineHeight: "50px" };
const boldTextStyle = {
  font: "nunito",
  fontWeight: "bold",
  lineHeight: "50px",
};

const loading = (
  <>
    {" "}
    <CenteredImage src="/static/loader.gif" alt="placeholder" />{" "}
  </>
);

const InventoryCollectionPage = () => {
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  const [nfts, setNFTs] = useState(null);
  const [chosenCollection, setChosenCollection] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(20);
  const [nftSearch, setNftSearch] = useState(null);

  const [slotId, setSlotId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const { user } = useAuth();

  const handleNftSearch = (e) => {
    if (e.key === "Enter") {
      sendCollection(nfts, e.target.value);
    }
  };

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
    if (chosenCollection) {
      getNFTs({ collectionId: chosenCollection.collectionId })
        .then((nfts) => {
          setNFTs(nfts);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    }
  }, [chosenCollection]);

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
  if (!(chosenCollection && chosenSlot && app)) return loading;

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
        <Grid container spacing={2}>
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
              <Typography color="text.primary">Collection</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <Typography
              variant="h3"
              sx={{ font: "nunito", fontWeight: "bold", lineHeight: "40px" }}
            >
              {chosenCollection.collectionName}
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Creator:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenCollection.tags[0]} &emsp;
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
              {chosenCollection.maximum > 900000000
                ? "\u221e"
                : chosenCollection.maximum}{" "}
              &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              My Supply:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {nfts?.length || 0} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Type:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenCollection.type} &emsp;
            </Typography>
          </Grid>
          {user.handle != "jacklaskey" ? (
            <></>
          ) : (
            <Grid item xs={12} sx={{ backgroundColor: "none" }}>
              <Box sx={{ left: 0, width: "100%" }}>
                <TextField
                  onKeyPress={handleNftSearch}
                  sx={{ left: 0, width: "80%", p: 1 }}
                />
              </Box>
            </Grid>
          )}
          <Grid item>
            <Box sx={{}}>
              <Typography variant="h3">Select NFT to View Details</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} sx={{ p: 1 }}>
              {!!nfts ? (
                nfts.map((nft) => (
                  <React.Fragment key={nft.nftId}>
                    <NftCard
                      search={nftSearch}
                      collection={chosenCollection}
                      nft={nft}
                      slot={chosenSlot}
                    />
                  </React.Fragment>
                ))
              ) : (
                <LinearProgress sx={{ width: "100%", mb: "1rem" }} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

InventoryCollectionPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default InventoryCollectionPage;

const getApp = async () => {
  const appObject = await axios.post("/api/app/info", {});
  return appObject.data.app;
};

const getSlot = async (slotId) => {
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

const getNFTs = async ({ collectionId }) => {
  let nftsObject;
  if (collectionId) {
    nftsObject = await axios.post("/api/nft/collections", {
      collectionIds: [collectionId],
      idOnly: false,
    });
    return nftsObject.data.collections[collectionId];
  }
};

const sendCollection = async (nfts, recipientHandle) => {
  let nftsObject;
  nfts.forEach((element) => {
    axios.post("/api/nft/send", {
      recipientHandle: recipientHandle,
      nftId: element.nftId,
    });
  });
  //nftsObject = (await axios.post('/api/nft/send', { recipientHandle: recipientHandle, nftId: nfts[0].nftId }));
  //console.log(nftsObject);
};
