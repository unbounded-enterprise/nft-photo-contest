import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { MainLayout } from "../components/main-layout";
import { HomeHero } from "../components/home/home-hero";
import { parseBasicErrorClient } from "src/_api_/auth-api";

// NOTE: must enable SSR for app here to enable SEO for page (unimplemented)

const Page = () => {
  return (
    <>
      <Box sx={{ width: "80%", mx: "auto" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ textAlign: "center", mt: "1em" }}>
              How the NFT Photo Contest Works
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p1" sx={{ mt: "1em" }}>
              The NFT Photo Contest is a contest being held both at the London
              Blockchain Conference (LBC) and virtually between May 31 and June
              2, 2023 sponsored by Asset Layer. Here’s how to get involved, and
              the contest rules!{" "}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              How To Enter
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p1" sx={{ mt: "1em" }}>
              To enter, contestants must take a photo on-site at the LBC and
              mint the photo as an NFT collection which belongs to the NFT Photo
              Contest app on Asset Layer. The minting process must be done at
              the Asset Layer booth on-site at the LBC. Contestants may enter
              multiple times at the discretion of the Asset Layer team who will
              be screening entries.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              How To Win
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p1" sx={{ mt: "1em" }}>
              The winning entry will be the entry with the most votes. Votes may
              be cast through the contest website, nftphotocontest.com by anyone
              with a HandCash wallet. Voters may vote for multiple entries. Any
              entry suspected of leveraging bots to collect votes or any other
              unethical behavior may be eliminated or have their vote count
              reduced at the discretion of the Asset Layer team. Contestants are
              encouraged to share their entries on social media to get votes,
              but only from real humans casting votes from a single wallet.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              Prizes
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p1" sx={{ mt: "1em" }}>
              Each winning entry will be an NFT collection with a certain number
              of NFTs between 10 and 100. This number may be determined by the
              contestant at the time of minting. The prize amount for the
              winning entry will be split into equal parts for each NFT in the
              collection and distributed to the holders of the winning
              collection. A snapshot will be taken of the current holders at
              17:00 EST on June 2, and the holders at that time will receive the
              prize money within the next 7 days.
              <br />
              <br />
              Contestants will receive all of the NFTs in their entry’s
              collection immediately following the mint. They may send NFTs they
              own to other people at their discretion through
              nftphotocontest.com Please note that NFTs sent to other people can
              not be recovered without their cooperation.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Page;
