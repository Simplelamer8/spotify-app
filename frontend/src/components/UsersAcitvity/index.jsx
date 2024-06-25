import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ActiveUsersContext } from "../../pages/home";

export default function UsersActivity() {
  const [groupmates, setGroupmates] = useState([]);
  const {userMusicList, setUserMusicList} = useContext(ActiveUsersContext);

  useEffect(() => {
    const getUsersFromSameGroup = async () => {
      if (localStorage.getItem("userData") === null)
      {
        return;
      }

      const userData = JSON.parse(localStorage.getItem("userData"));
      try{
        const response = await axios.post("http://localhost:5000/api/v5/auth/get-groupmates", {userData});
        console.log(response);
        setGroupmates(response.data);
      }
      catch(error)
      {
        console.log(error);
      }
    }
    getUsersFromSameGroup();
  }, [])
  return (
    <div className="border-t border-gray-700 mt-8 pt-4">
      <h4 className="text-white text-lg font-bold mb-4">Users Activity</h4>
      <div className="flex flex-col gap-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {
          groupmates.map((mate) => {

            const foundUser = userMusicList.find((user) => user.from === mate.email);

            return (
            <div>
              <h5 className="text-white font-bold">{mate.email}</h5>
              <p className="text-gray-400">{foundUser ? foundUser.songName : ""}</p>
              <p className="text-gray-400">{foundUser ? "Listening Now" : ""}</p>
            </div>
            )
          })
        }
      </div>
    </div>
  );
}
