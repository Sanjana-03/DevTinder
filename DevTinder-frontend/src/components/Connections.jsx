import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addConnections } from '../utils/connectionsSlice';
const Connections = () => {
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + '/user/connections', { withCredentials: true });
            dispatch(addConnections(res.data.connections));
        } catch (err) {
            setError(err?.response?.data || "Something went wrong");
        }
    }
    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;

    if (connections.length === 0) return <h1>No Connections Found</h1>

    return (
        <div className='text-center my-10'>
            <h1 className='text-bold text-3xl'>Connections</h1>

            {connections.map((conn) => {
                const { firstName, lastName, photoUrl, age, gender, about, skills } = conn;
                return (
                    <div className='flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto'>
                        <div>
                            <img src={photoUrl} alt="photo" className='mx-auto w-32 h-32 rounded-full object-cover' />
                        </div>
                        <div className='text-left mx-4'>
                            <h1 className='font-bold text-xl'>{firstName + " " + lastName}</h1>
                            {age && gender && <p>{age + "," + gender}</p>}
                            <p>{about}</p>
                            
                        </div>
                        
                    </div>
                )
            })}
        </div>
    )
}

export default Connections