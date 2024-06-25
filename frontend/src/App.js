
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { RouteList } from "./routes";
import { db } from "./config/firebase"
import { getDocs, collection } from "firebase/firestore";

 const App = () => {
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    
    const getUsersList = async () => {
      try
      {
        const response = await getDocs(usersCollectionRef);
        const data = response.docs.map((doc) => (
          {...doc.data(), id: doc.id}
        ))
        console.log(data);
        setUsers(data);
      }
      catch(error)
      {
        console.log(error);
      }
    }

    getUsersList();
  },[])

  return (
    <BrowserRouter>
      <RouteList/>
    </BrowserRouter>
    
  );
};

export default App;