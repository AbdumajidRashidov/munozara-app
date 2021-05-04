import React,{useContext,useState,useEffect} from 'react'
import { Link,useHistory } from 'react-router-dom'
import {UserContext} from '../App'
import 'materialize-css';
import { Button, SideNav,SideNavItem,Icon } from 'react-materialize';
const Navbar = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext) 

    const renderList = () => {
        if (state) {
            return [
                
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/createpost">CreatePost</Link></li>,
                <li><Link to="/myfollowerspost">My following posts</Link></li>,
                <li><a
                    onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push('/signin')
                        } 
                    }
                >Chiqish</a>
                </li>
                
                
                
            ]
        } else {
            return [
                <li><Link to="/signin">Login</Link></li>,
                <li><Link to="/signup">SignUp</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper #00e676 green accent-3">
                <Link to={state ? "/" :"/signin"} className="brand-logo left" style={{fontFamily:'Dancing Script',fontSize:"48px",marginLeft:"20px"}}>Munozara</Link>
            <ul id="nav-mobile" className="right desktop_nav">
                {renderList()}
            </ul>
            
            
            <div className="mobile_nav right #00e676 green accent-3">
                <SideNav
                    id="SideNav-11"
                    background="#00e676 green accent-3"
                    options={{
                    draggable: true
                    }}
                    trigger={
                    <Button  style={{boxShadow:"none"}} className="#00e676 green accent-3" node="button">
                        <Icon>menu</Icon>
                    </Button>}
                >
                    <SideNavItem
                    waves
                    user={{
                        
                        background:"https://res.cloudinary.com/munozara-uz/image/upload/v1617446807/jga4gxwoby3ql24xpwhf.png",
                        email:state ? state.email: "",
                        image:state? state.pic : "",
                        name:state? state.name: ""
                    }}
                    userView
                    />
                    {
                        renderList()
                    }
                </SideNav>
            </div>

            </div>
        </nav>
     )
}
 export default Navbar