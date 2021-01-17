import React, { useState, useEffect } from 'react';
import M from "materialize-css";
import ProfileChat from '../profileChat/profileChat.js';
import Navbar from '../navbar/navbar';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { computeHeadingLevel } from '@testing-library/react';
import { useHistory } from 'react-router-dom';

const ENDPOINT = "http://65.1.11.198:4000";
const socket = socketIOClient(ENDPOINT, {
    withCredentials: true,
});




function Chat() {


    const history = useHistory();

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }
    const [count, setCount] = useState(0);
    const [height, setHeight] = useState(getWindowDimensions().height);
    const [width, setWidth] = useState(getWindowDimensions().width);
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState({});
    const [chat, setChat] = useState([]);
    const [id, setId] = useState("");
    const [messagetext, setMessagetext] = useState("");
    const [status, setStatus] = useState({});
    const [typing, setTyping] = useState({});



    const left = {
        backgroundColor: '#f5f5f5',
        height: height * 0.8,
        "overflow-y": 'scroll'

    }
    const right = {
        backgroundColor: '#ffffff',
        height: height * 0.8,
        "overflow-y": 'scroll'


    }




    function sendMessage() {


        var chatdiv = document.getElementById("chat_div");
        if (chatdiv !== null) {
            chatdiv.scrollTop = chatdiv.scrollHeight;
        }


        if (messagetext.length == 0) {
            alert("Please enter some message!");
        }
        else {

            const message = {
                from: localStorage.getItem("id"),
                to: id,
                timestamp: new Date().getTime(),
                content: messagetext,
                type: "message",
                status: "not-delivered",
                "chat-id": localStorage.getItem("id") + '-' + id
            }
            setMessagetext("");
            socket.emit("received", message);
        }



    }

    const setupBeforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {

            socket.emit('disconnect_socket', { id: localStorage.getItem("id") });
        });
    };


    const filterchats = (series, type) => {

        var hash = {};

        series.forEach(element => {

            if (element["to"] == localStorage.getItem("id")) {

                if (hash[element["from"]]) {

                    var existing = hash[element["from"]];
                    existing.push(element);
                    hash[element["from"].toString()] = existing;


                }
                else {
                    hash[element["from"].toString()] = [];
                    hash[element["from"].toString()].push(element);

                }

            }

            if (element["from"] == localStorage.getItem("id")) {

                if (hash[element["to"]]) {

                    var existing = hash[element["to"]];
                    existing.push(element);
                    hash[element["to"].toString()] = existing;


                }
                else {
                    hash[element["to"].toString()] = [];
                    hash[element["to"].toString()].push(element);

                }

            }


        });


        setChats(hash);
        var chatdiv = document.getElementById("chat_div");
        if (chatdiv !== null) {
            chatdiv.scrollTop = chatdiv.scrollHeight;
        }


    }

    const openchat = (element) => {

        var id_1 = element["_id"];
        localStorage.setItem("selected_id", id_1);
        setId(id_1);
        users.forEach((element) => {
            document.getElementById(element["_id"]).style.backgroundColor = ""

        })
        document.getElementById(id_1).style.backgroundColor = "#ffffbd";
        resetcurrentchat();

    }
    const resetcurrentchat = () => {
        var current_id = localStorage.getItem("selected_id");
        var idloggedin = localStorage.getItem("id");

        callchatsapi(`${current_id}-${idloggedin}`, `${idloggedin}-${current_id}`, idloggedin, current_id);
    }



    const callchatsapi = async (id1, id2, to, from) => {

        var url = `${ENDPOINT}/v1/user/getchat`;
        var data = {

            "id1": id1,
            "id2": id2,
            "to": to,
            "from": from

        }

        var headers = {
            headers: {
                Authorization: 'Bearer' + ' ' + localStorage.getItem("token")
            }
        }


        try {
            const response = await axios.post(url, data, headers);

            var temp_chats = response.data.data;
            var latest_chat_array = [];
            var latest_chat_array = [...temp_chats];

            setChat(latest_chat_array); // chats;
            filterchats(latest_chat_array, "api");

            // console.log("after calling chats api", latest_chat_array);
        }
        catch (err) {
            console.log("error is ", err);
        }
    }


    const handlemessage = (e) => {
        setMessagetext(e.target.value);
    }



    const callapi = async () => {

        var url = `${ENDPOINT}/v1/user`;
        var headers = {
            headers: {
                Authorization: 'Bearer' + ' ' + localStorage.getItem("token")
            }
        }


        try {
            const response = await axios.get(url, headers);

            var users = response.data.data;
            var temparray = [];
            users.forEach((el) => {
                if (el["_id"] !== localStorage.getItem("id"))
                    temparray.push(el);
            })
            setUsers(temparray);
            console.log(temparray);
        }
        catch (err) {
            console.log("error is ", err);
        }


    }
    const keyPress = (event) => {

        setTimeout(() => {
            socket.emit("typing_receive", {
                from: localStorage.getItem("selected_id"),
                to: localStorage.getItem("id"),
                status: "typing"
            })
        }, 2000)
    }


    useEffect(() => {
        socket.on('message', (data) => {
            data["type"] = "socket";
            var temp = chat;
            temp.push(data);
            setChat(temp);

            filterchats(chat, "socket");

        })
        socket.on("typing_message", (data) => {

            setTyping(data);
            if (data[localStorage.getItem("id")]) {
                localStorage.setItem("typing", JSON.stringify(data[localStorage.getItem("id")]));
            }
            else {
                localStorage.setItem("typing", "");
            }

            // console.log("tt us ", typing);
        })
        socket.on('status', (data) => {
            let selected_id = localStorage.getItem("selected_id");

            if (selected_id) {

                if (status[selected_id] != data[selected_id] && data[selected_id] == "connected") {
                    console.log("status change ", selected_id);
                    resetcurrentchat();
                }

            }

            setStatus(data);
            // console.log("dd are ", data);

        })

        return () => {

            socket.removeAllListeners();
        }
    })

    useEffect(() => {



        M.AutoInit();

        if (localStorage.getItem("token") == null || localStorage.getItem("token") == undefined) {
            history.push('/login');
        }
        else {

            setupBeforeUnloadListener();


            var id = localStorage.getItem("id");

            var hash = {};
            hash["id"] = id;
            hash["status"] = "connected";


            socket.emit('join', 'room1');
            socket.emit("online_status", hash);

            callapi();


        }




    }, []);

    return (

        <div>
            <Navbar socket={socket} />

            <div class="row" style={{ marginTop: 10 }} >

                <div class="col l4 m4 s4" style={left}>

                    {users.map((element) => {
                        return <div style={{ cursor: 'pointer' }} onClick={() => { openchat(element) }} >  <ProfileChat user={element} status={status} typing={typing} /> </div>

                    })}



                </div>
                <div class="col l8 m8 s8" style={right}>

                    {id.length == 0 ? <div>

                        <div class="row">
                            <div class="col l7 m7 s7 offset-l5">
                                <i class="large material-icons">insert_chart</i>

                            </div> </div><div class="row">
                            <div class="col l9 m9 s9 offset-l3">

                                <h5>Click on Any User to Continue Chatting</h5>
                            </div> </div>
                    </div>

                        :
                        <div>
                            <div class="row" id="chat_div" style={{ "overflow-y": 'scroll', height: height * 0.6 }}>


                                <div class="col s12 m12 l12">



                                    {chats.hasOwnProperty(id) ? chats[id].map((element) => {
                                        {
                                            return element["from"] == localStorage.getItem("id") ? <div class="row">
                                                <div class="col l7 s7 m7 offset-l5 offset-m5 offset-s5">
                                                    <div class="card-panel white">
                                                        <p style={{ marginTop: "-2%" }}>{new Date(element.timestamp).toString().substring(0, 21)}</p>
                                                        <span class="black-text">{element.content}
                                                            {element.status == "delivered" ? <i class="tiny material-icons" style={{ float: "right" }}>done_all</i> : <i class="tiny material-icons" style={{ float: "right" }}>done</i>}

                                                        </span>
                                                    </div>

                                                </div>

                                            </div> : <div class="row">
                                                    <div class="col l7 s7 m7">

                                                        <div class="card-panel  indigo lighten-3">
                                                            <p style={{ marginTop: "-2%" }}>{new Date(element.timestamp).toString().substring(0, 21)}</p>
                                                            <span class="white-text">{element.content}

                                                            </span>
                                                        </div>

                                                    </div>
                                                </div>
                                        }


                                    }) : ""}


                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12 l12 m12" style={{ height: height * 0.1 }}>

                                    <span>
                                        <input id="text" type="text" style={{ width: '75%', marginRight: '5%' }} value={messagetext} onChange={handlemessage} onKeyPress={(event) => {

                                            keyPress(event);
                                            if (event.key === 'Enter') {
                                                sendMessage();
                                            }
                                        }} />

                                        <button style={{ float: 'right', marginTop: "1%" }} class="btn waves-effect waves-light" type="submit" name="action" onClick={() => { sendMessage() }}>Send
<i class="material-icons right">send</i>
                                        </button>
                                    </span>


                                </div>



                            </div>

                        </div>
                    }




                </div>




            </div>

        </div>

    );
}
export default Chat;