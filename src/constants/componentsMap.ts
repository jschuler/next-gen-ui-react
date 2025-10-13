import ImageComponent from "../components/ImageComponent";
import OneCardWrapper from "../components/OneCardWrapper";
import SetOfCardsWrapper from "../components/SetOfCardsWrapper";
import TableWrapper from "../components/TableWrapper";
import VideoPlayerWrapper from "../components/VideoPlayerWrapper";

export const componentsMap = {
  "one-card": OneCardWrapper,
  table: TableWrapper,
  image: ImageComponent,
  "video-player": VideoPlayerWrapper,
  "set-of-cards": SetOfCardsWrapper,
};
