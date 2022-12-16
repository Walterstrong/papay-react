import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Pagination,
  PaginationItem,
  Stack,
} from "@mui/material";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TViewer from "../../components/tuiEditor/TViewer";
import { MemberFollowers } from "./memberFollowers";
import { MemberFollowing } from "./memberFollowing";
import { MemberPosts } from "./memberPosts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// REDUX
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import {
  setChosenMember,
  setChosenMemberBoArticles,
  setChosenSingleBoArticle,
} from "./slice";
import { Member, Restaurant } from "../../../types/user";
import RestaurantApiService from "../../apiServices/restaurantApiService";
import {
  retrieveChosenMember,
  retrieveChosenMemberBoArticles,
  retrieveChosenSingleBoArticle,
} from "./selector";
import { BoArticle, SearchMemberArticlesObj } from "types/boArticle";
import { useHistory } from "react-router-dom";
import CommunityApiService from "app/apiServices/communityApiService";
import MemberApiService from "app/apiServices/memberApiService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "app/lib/sweetAlert";
import assert from "assert";
import FollowApiService from "app/apiServices/followApiService";
import { Definer } from "app/lib/Definer";

// REDUX SLICE

const actionDispatch = (dispatch: Dispatch) => ({
  setChosenMember: (data: Member) => dispatch(setChosenMember(data)),
  setChosenMemberBoArticles: (data: BoArticle[]) =>
    dispatch(setChosenMemberBoArticles(data)),
  setChosenSingleBoArticle: (data: BoArticle) =>
    dispatch(setChosenSingleBoArticle(data)),
});

// REDUX SELECTOR
const chosenMemberRetriever = createSelector(
  retrieveChosenMember,
  (chosenMember) => ({
    chosenMember,
  })
);
const chosenMemberBoArticlesRetriever = createSelector(
  retrieveChosenMemberBoArticles,
  (chosenMemberBoArticles) => ({
    chosenMemberBoArticles,
  })
);
const chosenSingleBoArticleRetriever = createSelector(
  retrieveChosenSingleBoArticle,
  (chosenSingleBoArticle) => ({
    chosenSingleBoArticle,
  })
);
export function VisitOtherPage(props: any) {
  /** INITIALIZATIONSS **/
  const history = useHistory();
  const {
    setChosenMember,
    setChosenMemberBoArticles,
    setChosenSingleBoArticle,
  } = actionDispatch(useDispatch());
  const { verifiedMemberData, chosen_mb_id, chosen_art_id } = props;
  const { chosenMember } = useSelector(chosenMemberRetriever);
  const { chosenSingleBoArticle } = useSelector(chosenSingleBoArticleRetriever);
  const { chosenMemberBoArticles } = useSelector(
    chosenMemberBoArticlesRetriever
  );
  const [value, setValue] = useState("1");
  const [memberArticlesSearchObj, setMemberArticlesSearchObj] =
    useState<SearchMemberArticlesObj>({
      mb_id: chosen_mb_id,
      page: 1,
      limit: 5,
    });
  const [articlesRebuild, setArticlesRebuild] = useState<Date>(new Date());
  const [followRebuild, setFollowRebuild] = useState<boolean>(false);

  useEffect(() => {
    if (chosen_mb_id === verifiedMemberData?._id) {
      history.push("/member-page");
    }

    const communityService = new CommunityApiService();

    communityService
      .getChosenArticle(chosen_art_id)
      .then((data) => {
        setChosenSingleBoArticle(data);
        setValue("4");
      })
      .catch((err) => console.log(err));
    communityService
      .getMemberCommunityArticles(memberArticlesSearchObj)
      .then((data) => setChosenMemberBoArticles(data))
      .catch((err) => console.log(err));
  }, [memberArticlesSearchObj, chosen_mb_id, articlesRebuild]);

  useEffect(() => {
    if (chosen_mb_id === verifiedMemberData?._id) {
      history.push("/member-page");
    }

    const memberService = new MemberApiService();
    memberService
      .getChosenMember(memberArticlesSearchObj.mb_id)
      .then((data) => setChosenMember(data))
      .catch((err) => console.log(err));
  }, [verifiedMemberData, chosen_mb_id, followRebuild]);

  /** HANDLERS **/
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handlePaginationChange = (event: any, value: number) => {
    memberArticlesSearchObj.page = value;
    setMemberArticlesSearchObj({ ...memberArticlesSearchObj });
  };

  const renderChosenArticleHandler = async (art_id: string) => {
    try {
      const communityService = new CommunityApiService();
      communityService
        .getChosenArticle(art_id)
        .then((data) => {
          setChosenSingleBoArticle(data);
          setValue("4");
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const subscribeHandler = async (e: any) => {
    try {
      assert.ok(localStorage.getItem("member_data"), Definer.auth_err1);

      const followService = new FollowApiService();
      await followService.subscribe(e.target.value);

      await sweetTopSmallSuccessAlert("subscribed successfully", 700, false);
      setFollowRebuild(!followRebuild);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const unsubscribeHandler = async (e: any) => {
    try {
      assert.ok(localStorage.getItem("member_data"), Definer.auth_err1);

      const followService = new FollowApiService();
      await followService.unsubscribe(e.target.value);

      await sweetTopSmallSuccessAlert("unsubscribed successfully", 700, false);
      setFollowRebuild(!followRebuild);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };
  return (
    <div className={"my_page"}>
      <Container maxWidth="lg" sx={{ mt: "50px", mb: "50px" }}>
        <Stack className={"my_page_frame"}>
          <TabContext value={value}>
            <Stack className={"my_page_left"}>
              <Box display={"flex"} flexDirection={"column"}>
                <TabPanel value={"1"}>
                  <Box className={"menu_name"}>Maqolalar</Box>
                  <Box className={"menu_content"}>
                    <MemberPosts
                      chosenMemberBoArticles={chosenMemberBoArticles}
                      renderChosenArticleHandler={renderChosenArticleHandler}
                      setArticlesRebuild={setArticlesRebuild}
                    />
                    <Stack
                      sx={{ my: "40px" }}
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box className={"bottom_box"}>
                        <Pagination
                          count={
                            memberArticlesSearchObj.page >= 3
                              ? memberArticlesSearchObj.page + 1
                              : 3
                          }
                          page={memberArticlesSearchObj.page}
                          renderItem={(item) => (
                            <PaginationItem
                              components={{
                                previous: ArrowBackIcon,
                                next: ArrowForwardIcon,
                              }}
                              {...item}
                              color={"secondary"}
                            />
                          )}
                          onChange={handlePaginationChange}
                        />
                      </Box>
                    </Stack>
                  </Box>
                </TabPanel>
                <TabPanel value={"2"}>
                  <Box className={"menu_name"}>Followers</Box>
                  <Box className={"menu_content"}>
                    <MemberFollowers
                      actions_enabled={false}
                      mb_id={chosen_mb_id}
                      setFollowRebuild={setFollowRebuild}
                      followRebuild={followRebuild}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value={"3"}>
                  <Box className={"menu_name"}>Following</Box>
                  <Box className={"menu_content"}>
                    <MemberFollowing
                      actions_enabled={false}
                      mb_id={chosen_mb_id}
                      setFollowRebuild={setFollowRebuild}
                      followRebuild={followRebuild}
                    />
                  </Box>
                </TabPanel>

                <TabPanel value={"4"}>
                  <Box className={"menu_name"}>Tanlangan Maqola</Box>
                  <Box className={"menu_content"}>
                    <TViewer chosenSingleBoArticle={chosenSingleBoArticle} />
                  </Box>
                </TabPanel>
              </Box>
            </Stack>
            <Stack className={"my_page_right"}>
              <Box className={"order_info_box"}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <div className={"order_user_img"}>
                    <img
                      src={"/auth/default_user.svg"}
                      className={"order_user_avatar"}
                    />
                    <div className={"order_user_icon_box"}>
                      <img src={"/icons/user_icon.svg"} />
                    </div>
                  </div>
                  <span className={"order_user_name"}>
                    {" "}
                    {chosenMember?.mb_nick}
                  </span>
                  <span className={"order_user_prof"}>
                    {" "}
                    {chosenMember?.mb_type}
                  </span>
                </Box>
                <Box className={"user_media_box"}>
                  <FacebookIcon />
                  <InstagramIcon />
                  <TelegramIcon />
                  <YouTubeIcon />
                </Box>
                <Box className={"user_media_box"}>
                  <p className={"follows"}>
                    Followers: {chosenMember?.mb_subscriber_cnt}
                  </p>
                  <p className={"follows"}>
                    Followings: {chosenMember?.mb_follow_cnt}
                  </p>
                </Box>
                <p className={"user_desc"}>
                  {chosenMember?.mb_description ??
                    "qushimcha malumot kiritilmagan"}
                </p>

                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  sx={{ mt: "10px" }}
                >
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    {chosenMember?.me_followed &&
                    chosenMember?.me_followed[0]?.my_following ? (
                      <Tab
                        style={{ flexDirection: "column" }}
                        value={"4"}
                        component={(e) => (
                          <Button
                            value={chosenMember?._id}
                            variant={"contained"}
                            style={{ backgroundColor: "#f70909b8" }}
                            onClick={unsubscribeHandler}
                          >
                            BEKOR QILISH
                          </Button>
                        )}
                      />
                    ) : (
                      <Tab
                        style={{ flexDirection: "column" }}
                        value={"4"}
                        component={(e) => (
                          <Button
                            value={chosenMember?._id}
                            variant={"contained"}
                            style={{ backgroundColor: "#30945e" }}
                            onClick={subscribeHandler}
                            // @ts-ignore
                          >
                            FOLLOW QILISH
                          </Button>
                        )}
                      />
                    )}
                  </TabList>
                </Box>
              </Box>

              <Box className={"my_page_menu"}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    style={{ flexDirection: "column" }}
                    value={"1"}
                    component={(e) => (
                      <div
                        className={`menu_box ${e} `}
                        onClick={() => setValue("1")}
                      >
                        <img src={"/icons/post.svg"} />
                        <span>Maqolalari</span>
                      </div>
                    )}
                  />
                  <Tab
                    style={{ flexDirection: "column" }}
                    value={"2"}
                    component={() => (
                      <div
                        className={`menu_box ${value} `}
                        onClick={() => setValue("2")}
                      >
                        <img src={"/icons/followers.svg"} />
                        <span>Followers</span>
                      </div>
                    )}
                  />
                  <Tab
                    style={{ flexDirection: "column" }}
                    value={"3"}
                    component={() => (
                      <div
                        className={`menu_box ${value} `}
                        onClick={() => setValue("3")}
                      >
                        <img src={"/icons/following.svg"} />
                        <span>Following</span>
                      </div>
                    )}
                  />
                </TabList>
              </Box>
            </Stack>
          </TabContext>
        </Stack>
      </Container>
    </div>
  );
}
function memberArticlesSearchObj(memberArticlesSearchObj: any) {
  throw new Error("Function not implemented.");
}
