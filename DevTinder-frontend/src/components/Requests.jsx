import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestsSlice';

const Requests = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const requests = useSelector((store) => store.requests);

  const reviewRequests = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + '/request/review/' + status + '/' + _id, 
        {}, 
        { withCredentials: true });
        dispatch(removeRequest(_id))
    } catch (err) {
      console.log(err?.response?.data || "Something went wrong");

    }
  }
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + '/user/requests/received', { withCredentials: true });
      console.log(res.data.data);
      dispatch(addRequests(res.data.data));
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length <= 0) return <h1 className='flex justify-center my-10'>No Requests Found</h1>
  return (
    <div className='text-center my-10'>
      <h1 className='text-bold text-3xl'>Connection Requests</h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = request.fromUserId;
        return (
          <div className='flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto'>
            <div>
              <img src={photoUrl} alt="photo" className='mx-auto w-32 h-32 rounded-full object-cover' />
            </div>
            <div className='text-left mx-4'>
              <h1 className='font-bold text-xl'>{firstName + " " + lastName}</h1>
              {age && gender && <p>{age + "," + gender}</p>}
              <p>{about}</p>
            </div>
            <div>
              <button className="btn btn-primary mx-2" onClick={()=>reviewRequests("rejected", request._id)}>Reject</button>
              <button className="btn btn-secondary mx-2" onClick={()=>reviewRequests("accepted", request._id)}>Accept</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Requests