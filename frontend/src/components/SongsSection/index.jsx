import React, { useContext, useEffect, useRef, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { app } from "../../config/firebase"; 
import { Socket, io } from "socket.io-client";
import { ActiveUsersContext } from '../../pages/home';

export default function SongsSection() {
    let socket = useRef(null);
    const [audioPerc, setAudioPerc] = useState(0);
    const [audio, setAudio] = useState(null);
    const [inputs, setInputs] = useState({});
    const [loadedAudio, setLoadedAudio] = useState([]);
    const [audioStates, setAudioStates] = useState([]);
    const userMusicList = useContext(ActiveUsersContext).userMusicList, setUserMusicList = useContext(ActiveUsersContext).setUserMusicList;

    const audioRefs = useRef([]);

    const handleStartMusic = (data) => {
        setUserMusicList((prevMusicList) => [...prevMusicList, data]);
    }

    useEffect(() => {
        if (localStorage.getItem("userData") === null)
        {
            return;   
        }
        const listRef = ref(getStorage(app), "audio/" + JSON.parse(localStorage.getItem("userData")).user.email);
        listAll(listRef)
        .then((response) => {
            response.items.forEach(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                const name = itemRef.name;
                console.log(name);
                setLoadedAudio([...loadedAudio, {url, name}]);
            })
        })


        socket.current = io("http://localhost:9000/");
        socket.current.emit("join-room", {roomNumber: JSON.parse(localStorage.getItem("userData")).user.groupNumber});

        socket.current.on("startdMusic", (data) => {
            console.log("start music detected");
            setUserMusicList([...userMusicList, data]);
        })

        socket.current.on("stopMusic", (data) => {
            setUserMusicList(userMusicList.filter((musicData) => musicData.from !== data.from));
        })

        return () => {
            // socket.current.off("startMusic", handleStartMusic);
            socket.current.disconnect();
        }
    }, [])

    useEffect(() => {
        setAudioStates(loadedAudio.map(() => ({playing: false, stopped: true})));
    }, [loadedAudio])

    useEffect(() => {
        audio && uploadFile(audio, "audioUrl");
    }, [audio])

    const uploadFile = (file, fileType) => {
        const storage = getStorage(app);
        const folder = "audio/" + JSON.parse(localStorage.getItem("userData")).user.email;
        const fileName = file.name;
        const storageRef = ref(storage, folder + fileName);
        // storageRef.child("audio/").listAll()
        // .then((response) => {
        //     console.log(response.items)
        // })
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", 
            (snapshot) => {
                setAudioPerc(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    console.log("downloadUrl: ", downloadUrl);
                    setInputs((prev) => {
                        return {
                            ...prev, 
                            [fileType]: downloadUrl
                        };
                    })
                })
            }
        )
    }

    function handleSubmit(e)
    {
        e.preventDefault();
    }

    function handleFileUpload(e)
    {
        if (localStorage.getItem("userData") === null)
        {
            e.preventDefault();
            alert("Unauthorized user can't upload audio files");
            return;
        }
        setAudio((prev) => e.target.files[0]);
    }


    const handlePlay = (index) => {
        const roomNumber = JSON.parse(localStorage.getItem("userData")).user.groupNumber;
        
        socket.current.emit("startMusic", {from: JSON.parse(localStorage.getItem("userData")).user.email, songName: loadedAudio[index].name});

        const newAudioStates = audioStates.map((state, idx) => ({
          playing: idx === index,
          stopped: idx !== index,
        }));
        setAudioStates(newAudioStates);
    };
    
      const handlePause = (index) => {
        const roomNumber = JSON.parse(localStorage.getItem("userData")).user.groupNumber;
        
        socket.current.emit("startMusic", {from: JSON.parse(localStorage.getItem("userData")).user.email, songName: loadedAudio[index].name});

        
        const email = JSON.parse(localStorage.getItem("userData")).user.email;
        socket.current.emit("stopMusic", {from: email});

        const newAudioStates = [...audioStates];
        newAudioStates[index] = { playing: false, stopped: false };
        setAudioStates(newAudioStates);
      };
    
      const handleEnded = (index) => {
        const newAudioStates = [...audioStates];
        newAudioStates[index] = { playing: false, stopped: true };
        setAudioStates(newAudioStates);
      };



    useEffect(() => {
        audioRefs.current.forEach((audio, index) => {
            if (audio)
            {
                audio.addEventListener("play", () => handlePlay(index));
                audio.addEventListener("pause", () => handlePause(index));
                audio.addEventListener("ended", () => handleEnded(index));
            }
        })

        return () => {
            audioRefs.current.forEach((audio) => {
                audio.removeEventListener("play", handlePlay);
                audio.removeEventListener("pause", handlePause);
                audio.removeEventListener("ended", handleEnded);
            })
        }
    }, [audioRefs, audioStates])

  return (
    <form onSubmit={handleSubmit}>
        {
            loadedAudio.map((audio, index) => (
                <figure key={index}>
                    <figcaption>{audio.name}</figcaption>
                    <audio 
                    controls src={audio.url}
                    ref={(el) => (audioRefs.current[index] = el)}
                    ></audio>
                </figure>
            ))
        }
        <div>
            <label htmlFor='audio'>Audio:</label> {"Uploading: " + audioPerc + "%"}
            <br />
            <input
            type="file"
            accept="audio/*"
            id="audio"
            onChange={handleFileUpload}
            onClick={handleFileUpload}
            />
        </div>
        <br />
    </form>
  )
}
