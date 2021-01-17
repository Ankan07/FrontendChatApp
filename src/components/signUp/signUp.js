
import React, { useState, useEffect } from 'react';
import axios from 'axios';


function SignUp() {

    const [login, setLogin] = useState(true);
    const [signup, setSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const ENDPOINT = "52.66.174.250:4000";
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

    const submit = async () => {

        var url = `${ENDPOINT}v1/user`;
        var data = {
            name: name,
            email: email,
            password: password,
            signInMethod: "email"
        }
        var headers = {
            'Content-Type': 'application/json',
        }


        try {
            const response = await axios.post(url, data, {
                headers: headers
            });

            if (response["data"]["status"] == true) {

                alert(response["data"]["message"]);


            }
            else {
                alert(response["data"]["message"]);
            }
        }
        catch (error) {

            alert(error);
        }





    }
    const handleKeyPress = (e) => {
        if (e.key == "Enter") {
            submit();
        }
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);

    }
    const handleName = (e) => {
        setName(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }


    return (
        <div class="row" style={style}>
            <div class="col s12 m4 offset-m4" style={style1}>


                <div class="card white darken-1">
                    <div class="card-content">

                        <div class="row">
                            <div class="col m12 l12 s12">


                                <div class="input-field ">
                                    <input id="name" type="text" class="validate" onChange={handleName} onKeyPress={handleKeyPress} />
                                    <label for="name">Name</label>
                                </div>

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
                        <div class="row">
                            <div class="col l8 offset-l4">

                                <a class="waves-effect waves-light btn-small" onClick={submit} >Sign UP</a>

                            </div>

                        </div>
                        <div class="row">
                            <div class="col l8 offset-l4">

                                <a href="/login" style={{ marginLeft: '-5%' }}>Go to Login Page</a>
                            </div>

                        </div>


                    </div>

                </div>
            </div>
        </div >
    )
}
export default SignUp;
