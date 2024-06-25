import { Server } from "socket.io";

const io = new Server(9000, {
    cors: {
        origin: "*"
    }
});

let sockets:{[key: string]: string} = {};

io.on("connection", (socket) => {
    socket.on("join-room", (data) => {
        sockets[socket.id] = "room" + data.roomNumber;
        socket.join(sockets[socket.id]);
        console.log("The socket joined the room: ", sockets[socket.id]);

        socket.on("startMusic", (data:{from: string, songName: string}) => {
            console.log("emiting event for room: ", sockets[socket.id]);
            io.to(sockets[socket.id]).emit("startdMusic", data);
        })

        socket.on("stopMusic", (data) => {
            io.to(sockets[socket.id]).emit("stopMusic", data);
        })
    })

    // socket.on(sockets[socket.id], (data:{from: string, songName: string}) => {
    //     console.log("Listening to certain room...");
    //     socket.emit(sockets[socket.id], {from: data.from, songName: data.songName});
    // })

    socket.on("disconnect", () => {
        delete sockets[socket.id];
    })
})