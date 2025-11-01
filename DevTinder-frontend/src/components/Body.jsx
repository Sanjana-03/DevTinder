import { Outlet } from 'react-router-dom'
import React, {useEffect} from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Body = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async() =>{
    try{
      const res = await axios.get(BASE_URL + '/profile/view', {withCredentials: true});
      dispatch(addUser(res.data));

    } catch(err){
      if(err.status === 401) navigate('/login')
    }
  }
  useEffect(() => {
    if(!userData){
    fetchUser();
    }

  }, [])
  
  return (
    <div>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body