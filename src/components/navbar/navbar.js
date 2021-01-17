
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
function Navbar(props) {
    const history = useHistory();
    const logout = () => {
        props.socket.emit('disconnect_socket', { id: localStorage.getItem("id") });
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        history.push('/login');

    }
    return (
        <nav>
            <div class="nav-wrapper green darken-2" >
                <a href="#" class="brand-logo">MangoChat</a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li><a href="/login" onClick={() => { logout('') }}>Logout</a></li>

                </ul>
            </div>
        </nav>
    )
}
export default Navbar;
