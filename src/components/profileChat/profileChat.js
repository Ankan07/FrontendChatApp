import React, { useState, useEffect, useLayoutEffect } from 'react';
import M from "materialize-css";
import profile_pic from '../../assets/dummy_profile.jpeg'
function ProfileChat(props) {
    const [count, setCount] = useState(0);
    const [id, setId] = useState("");
    const [typing, setTyping] = useState({});
    const cardStyle = {
        marginBottom: "-3%",
        paddingTop: "3%",
        paddingBottom: "3%",
        paddingLeft: "3%",
        backgroundColor: ''
    }



    useEffect(() => {
        setId(localStorage.getItem("selected_id"));
        M.AutoInit();
    }, []);

    return (
        <div class="row">

            <div class="col l12 m12 s12">
                <div class=" z-depth-1" style={cardStyle} id={props.user["_id"]} >
                    <div class="row valign-wrapper">
                        <div class="col s2 l2 m2 ">
                            <img src={profile_pic} alt="" class="circle responsive-img" />
                        </div>
                        <div class="col s10 l10 m10">
                            <span class="black-text">
                                {props.user.name}
                            </span>
                            <p>{props["status"][props.user["_id"].toString()] == "connected" ? "online" : "offline"}</p>
                            {/* <p>{(JSON.parse(localStorage.getItem("typing")) == null || JSON.parse(localStorage.getItem("typing")) == undefined || Object.keys(JSON.parse(localStorage.getItem("typing"))).length == 0) ? "" : JSON.parse(localStorage.getItem("typing"))[props.user["_id"].toString()].toString()}</p> */}
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
}
export default ProfileChat;