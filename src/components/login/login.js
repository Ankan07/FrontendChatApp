
import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const ENDPOINT = "http://65.1.11.198:4000";
function Login() {
    const history = useHistory();

    const [login, setLogin] = useState(true);
    const [signup, setSignup] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [displaytext, setdisplayText] = useState(false);

    const style = {
        backgroundColor: '#4caf50',

        height: '100vh'
    }

    const style1 = {
        marginTop: '25vh',
    }
    const shift = {
        marginLeft: '-11px'
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);

    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleKeyPress = (e) => {
        console.log("e.", e.key);
        if (e.key == "Enter") {
            submit();
        }
    }

    useEffect(() => {
        localStorage.clear();
    }, [])


    const submit = async () => {
        setdisplayText(true);

        var url = `${ENDPOINT}/v1/user/login`;
        var data = {
            email: email,
            password: password,
            signInMethod: "email"
        }
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': ''
        }


        try {
            const response = await axios.post(url, data, {
                headers: headers
            });


            if (response["data"]["status"] == true) {
                localStorage.setItem("id", response["data"]["data"]["_id"]);
                localStorage.setItem("token", response["data"]["token"]);

                history.push("/chat");

            }
            else {
                alert(response["data"]["message"]);
            }
            console.log("response is ", response);
        }
        catch (error) {

        }





    }

    return (
        <div class="row" style={style}>
            <div class="col s12 m4 offset-m4" style={style1}>


                <div class="card white darken-1">
                    <div class="card-content">

                        <div class="row">
                            <div class="col m12 l12 s12">



                                <div class="input-field ">
                                    <input id="email" type="email" class="validate" onChange={handleEmail} onKeyPress={handleKeyPress} />
                                    <label for="email">Email</label>
                                </div>
                                <div class="input-field ">
                                    <input id="password" type="password" class="validate" onChange={handlePassword} onKeyPress={handleKeyPress} />
                                    <label for="password">Password</label>
                                </div>

                            </div>
                        </div>
                        <div class="row" style={{ marginLeft: "-1%" }}>
                            <div class="col l8 offset-l4">

                                <a class="waves-effect waves-light btn-small" onClick={() => { submit() }}>Login</a>

                            </div>

                        </div>
                        <div class="row" style={{ marginLeft: "-10%" }}>
                            <div class="col l8 offset-l4">

                                <a href="/signup">Go to Signup Page</a>

                            </div>

                        </div>
                        <div class="row">
                            <div class="col l8 offset-l3">
                                {displaytext == true ? <p>Please wait for Login ..</p> : ""}
                            </div>

                        </div>


                    </div>

                </div>
            </div>
        </div >
    )
}
export default Login;
