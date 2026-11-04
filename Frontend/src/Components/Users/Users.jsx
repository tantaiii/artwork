import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
// eslint-disable-next-line
import HomePage from "./MainPage/HomePage.tsx";
// eslint-disable-next-line
import Footer from "./Footer.jsx";
import Menu from "./Menu.tsx";
import Background from "../Themes/Background.jsx";
import UserInfoForm from "./UserForms/CreateUserInfo.jsx";
import UploadArtwork from "./UserForms/UploadArtwork.tsx";
import ProfileUser from "./ProfileUser.tsx";
import ArtPost from "./ArtPost.tsx";
import SeeMoreOfArt1 from "./SeeMoreOfArt1.tsx";
import SeeMoreUser from "./SeeMoreUser.tsx";
import SeeMoreForYou from "./SeeMoreForYou.tsx";
import DashboardUser from "./DashboardUser.tsx";
import CommissionForm from "./CommissionForm.tsx";
import YourCommission from "./YourCommission.tsx";
import YourRequest from "./YourRequest.tsx";
import TransactionHistory from "./TransactionHistory.tsx";
import ProtectedRoute from "../../ProtectedRoutes/ProtectedRoute.tsx";
import ArtShop from "./ArtShop.jsx";
import ArtShopDetail from "./ArtShopDetail.jsx";
import PackagePage from "./PackagePage.tsx";
import UpdateArtwork from "./UpdateArtwork.tsx";
import SearchHome from "./MainPage/SearchHome.tsx";
import DepositeCoin from "./DepositeCoin.tsx";
import zIndex from "@mui/material/styles/zIndex";
import FavouritesArtwork from "./FavouritesArtwork.tsx";
import Forum from "./Forum.tsx";
import ThreadList from "./ThreadList.tsx";
import ThreadPage from "./ThreadPage.tsx";
import ThreadUpload from "./ThreadUpload.tsx";
import ChatButton from "../ChatButton.jsx";
import ArtHubAIButton from "../ArtHubAIButton.jsx";
import ArtShopConfirm from "./ArtShopConfirm.jsx";
import DevToolsBlocker from "../../ProtectedRoutes/DevToolsBlocker.jsx";
import ArtHubAI from "./ArtHubAI.tsx";

export default function Users() {
  return (
    <div>
      <Menu />
      <Background>
        {/* <div className="background" style={{ backgroundImage: `url('${listofimages[currentIndex]}')`, transition: theme.transition }}> */}
        <Routes>
          <Route path={`/`} element={<HomePage />} />
          <Route path={`creatorform`} element={<UserInfoForm />} />

          <Route path={`artwork/update/:id`} element={<UpdateArtwork />} />
          <Route path={`/SearchHome/Tags`} element={<SearchHome />} />

          <Route element={<ProtectedRoute allowedRoles={["AT", "AD"]} />}></Route>

          <Route path={`profile/:id`} element={<ProfileUser />} />
          <Route path={`yourcommision`} element={<YourCommission />} />
          <Route path={`yourrequest`} element={<YourRequest />} />
          <Route path={`transaction`} element={<TransactionHistory />} />
          <Route path={`artwork/:id`} element={<ArtPost />} />
          <Route path={`profile/:id/artwork/:id`} element={<ArtPost />} />
          <Route path={`Depositecoin`} element={<DepositeCoin />} />
          <Route path={`dashboarduser`} element={<DashboardUser />} />
          <Route path={`artshop`} element={<ArtShop />} />
          <Route path={`package`} element={<PackagePage />} />
          <Route path={`artworkform`} element={<UploadArtwork />} />
          <Route path={`profile/:id/commission`} element={<CommissionForm />} />
          <Route path={`favourite`} element={<FavouritesArtwork />} />
          <Route path={`forum`} element={<Forum />} />
          <Route path={`forum/:topicID`} element={<ThreadList />} />
          <Route path={`forum/:topicID/:threadId`} element={<ThreadPage />} />

          <Route path={`artwordrecomment`} element={<SeeMoreOfArt1 />} />
          <Route path={`userrecomment`} element={<SeeMoreUser />} />
          <Route path={`randomword`} element={<SeeMoreForYou />} />
          <Route path={`artwordrecomment/artwork/:id`} element={<ArtPost />} />
          <Route path={`randomword/artwork/:id`} element={<ArtPost />} />
          <Route path={`artshop/:id`} element={<ArtShopDetail />} />
          <Route path={`arthubai`} element={<ArtHubAI />} />

          {/* <Route path={`payment`} element={<Payment/>}/> */}
        </Routes>
        <Outlet />
        {/* Outlet is use to render child components */}
        {/* </div> */}
        <ArtHubAIButton />
        <ChatButton />
        <Footer />
      </Background>
    </div>
  );
}
