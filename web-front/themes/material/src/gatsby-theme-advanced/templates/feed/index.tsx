import React from "react";
import { Helmet } from "react-helmet";

import { visuallyHidden } from "@mui/utils";
import { Typography, Button, Box } from "@mui/material";

import {
  useConfig,
  useInfiniteFeed,
  FeedTemplateProps,
} from "gatsby-theme-advanced";

import Layout from "../../../layouts";
import FeedListing from "../../../components/FeedListing";
import ListingPageWrapper from "../../../components/shared/ListingPageWrapper";

const Feed = ({ pageContext }: FeedTemplateProps): JSX.Element => {
  const { feedListing, feedElementRef } = useInfiniteFeed(pageContext);

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

  return (
    <Layout>
      {getTitleOverride()}
      <ListingPageWrapper ref={feedElementRef}>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/SFUPlb01ick" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gap: { zero: 8, lg: 10 },
            gridTemplateColumns: { zero: "1fr", lg: "1fr 1fr" },
          }}>
          <Button variant="contained" color="primary">左に投票する</Button>
          <Button variant="contained" color="warning">右に投票する</Button>
        </Box>
      </ListingPageWrapper>
    </Layout>
  );
};

export default Feed;
