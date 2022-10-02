import React, { useState } from "react";
import { Helmet } from "react-helmet";

import { visuallyHidden } from "@mui/utils";
import YouTube from "react-youtube";
import { Typography, Button, Box } from "@mui/material";

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
    //    const rootUrl = "http://localhost:3000/dev"
    const rootUrl =
      "https://vermorhp1e.execute-api.ap-northeast-1.amazonaws.com/production";
    const formParams = new URLSearchParams();
    formParams.append("vote_type", voteType.toString());
    console.log("click:" + voteType);
    const res = await axios.post<VoteResult>(rootUrl + "/vote", {
      vote_type: voteType,
    });
    setVoteResult(res.data);
  };

  // TODO iframeのYoutube liveの部分は明日
  return (
    <Layout>
      {getTitleOverride()}
      <ListingPageWrapper ref={feedElementRef}>
        <YouTube videoId="5EQVoIUQlHw" />
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gap: { zero: 8, lg: 10 },
            gridTemplateColumns: { zero: "1fr", lg: "1fr 1fr" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => onVoteRequest("left")}
          >
            左に投票する
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => onVoteRequest("right")}
          >
            右に投票する
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gap: { zero: 8, lg: 10 },
            gridTemplateColumns: { zero: "1fr", lg: "1fr 1fr" },
          }}
        >
          {voteResult.left}
          {voteResult.right}
        </Box>
      </ListingPageWrapper>
    </Layout>
  );
};

export default Feed;
