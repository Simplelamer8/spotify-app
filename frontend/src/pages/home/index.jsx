import React, { createContext, useState } from "react";
import { Artistsection } from "../../components/Artistsection";
import Header from "../../components/Header";
import { Playlistsection } from "../../components/PlaylistSection";
import Sidebar from "../../components/Sidebar";
import "./Home.css";
import { Footer } from "../../components/footer";
import SongsSection from "../../components/SongsSection";

export const ActiveUsersContext = createContext();
export const Home = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [userMusicList, setUserMusicList] = useState([]);

  return (
    <div className="min-h-screen text-gray-300">
      <ActiveUsersContext.Provider value={{userMusicList, setUserMusicList}}>
      <Header setShowSidebar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="bg-custom-section pt-28 md:pl-72 p-8">
        <SongsSection></SongsSection>
        <Artistsection></Artistsection>
        <Playlistsection></Playlistsection>
        <Playlistsection></Playlistsection>
        <Playlistsection></Playlistsection>
        <Playlistsection></Playlistsection>
        <Footer></Footer>
      </div>
      </ActiveUsersContext.Provider>
    </div>
  );
};
