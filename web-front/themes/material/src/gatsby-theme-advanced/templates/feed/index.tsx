import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { visuallyHidden } from "@mui/utils";
import YouTube from "react-youtube";
import { Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  useConfig,
  useInfiniteFeed,
  FeedTemplateProps,
} from "gatsby-theme-advanced";

import Layout from "../../../layouts";
import FeedListing from "../../../components/FeedListing";
import ListingPageWrapper from "../../../components/shared/ListingPageWrapper";
import axios from "axios";

type VoteTypes = "left" | "right";
interface VoteResult {
  left: number;
  right: number;
}

const Feed = ({ pageContext }: FeedTemplateProps): JSX.Element => {
  const { feedListing, feedElementRef } = useInfiniteFeed(pageContext);
  const [voteResult, setVoteResult] = useState<VoteResult>({
    left: 0,
    right: 0,
  });
  //    const rootUrl = "http://localhost:3000/dev"
  const rootUrl =
    "https://vermorhp1e.execute-api.ap-northeast-1.amazonaws.com/production";

  const loadPolingData = async () => {
    const res = await axios.get<VoteResult>(rootUrl + "/poling/vote");
    setVoteResult(res.data);
  };

  useEffect(() => {
    loadPolingData();
    const interval = setInterval(async () => {
      loadPolingData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const config = useConfig();

  // Don't show hero images on non-index feeds
  const noHero = pageContext.feedType !== "index";

  // Override the title for non-index feeds
  const getTitleOverride = () => {
    if (pageContext.feedId) {
      if (pageContext.feedType === "tag")
        return (
          <Helmet
            title={`Posts tagged as "${pageContext.feedId}" | ${config.website.title}`}
          />
        );

      if (pageContext.feedType === "category")
        return (
          <Helmet
            title={`Posts in category "${pageContext.feedId}" | ${config.website.title}`}
          />
        );
    }

    return null;
  };

  const onVoteRequest = async (voteType: VoteTypes) => {
    const formParams = new URLSearchParams();
    formParams.append("vote_type", voteType.toString());
    console.log("click:" + voteType);
    const res = await axios.post<VoteResult>(rootUrl + "/vote", {
      vote_type: voteType,
    });
    setVoteResult(res.data);
  };

  // TODO iframe???Youtube live??????????????????
  return (
    <Layout>
      <ListingPageWrapper ref={feedElementRef}>
        <Typography variant="h3">?????????????????????</Typography>
        <iframe
          id="inlineMapbox"
          title="Inline Mapbox"
          width="60%"
          height="480"
          src="https://elix.jp/test/mapbox/typhoon/?caption=no&drag=no&interval=2"
        ></iframe>
        <Box textAlign="center">
          <Grid container spacing={10}>
            <Grid item spacing={{ xs: 6 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onVoteRequest("left")}
              >
                ??????????????????
              </Button>
            </Grid>
            <Grid item spacing={{ xs: 6 }}>
              <Button
                variant="contained"
                color="warning"
                onClick={() => onVoteRequest("right")}
              >
                ??????????????????
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box textAlign="center">
          <Grid container spacing={10}>
            <Grid item spacing={{ xs: 3 }}>
              <Typography variant="h5">???????????????</Typography>
            </Grid>
            <Grid item spacing={{ xs: 3 }}>
              <Typography variant="h5">{voteResult.left}</Typography>
            </Grid>
            <Grid item spacing={{ xs: 3 }}>
              <Typography variant="h5">{voteResult.right}</Typography>
            </Grid>
            <Grid item spacing={{ xs: 3 }}>
              <Typography variant="h5">???????????????</Typography>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="h3">??????????????????????????????(Live?????????!!)</Typography>
        <YouTube videoId="XMyMZIsfKAU" />
      </ListingPageWrapper>
    </Layout>
  );
};

export default Feed;
