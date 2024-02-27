
import { NavLink } from "react-router-dom"
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
const Navbar = () => {
  const navigate = useNavigate()
  const setStateUser = useAuthStore(state=>state.setUser)
  const activeStyle = {
    textDecoration : "underline",
    fontWeight : "bold",
    color : "red" 
    }
  
  const logout = () => {
    setStateUser(null)
    localStorage.setItem("userToken","")
    navigate("/")
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
            <NavLink style={({isActive})=>isActive ? activeStyle : null} to="/dashboard">Dashboard</NavLink>
            <NavLink style={({isActive})=>isActive ? activeStyle : null} to="/courses">Courses</NavLink>
            <NavLink style={({isActive})=>isActive ? activeStyle : null} to="/profile">Profile</NavLink>
            <button onClick={logout}>Logout</button>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

