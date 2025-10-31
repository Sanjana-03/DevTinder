import { useState } from 'react'
import UserCard from './UserCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';

const EditProfile = ({ user }) => {

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState(user.age || "");
    const [gender, setGender] = useState(user.gender || "");
    const [about, setAbout] = useState(user.about || "");
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
    const [skills, setSkills] = useState(user.skills ||"");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const dispatch = useDispatch();

    const handleEditProfile = async () => {
        setError("");
        try {
            const res = await axios.patch(BASE_URL + '/profile/edit', { firstName, lastName, age, gender, about, photoUrl,skills }, { withCredentials: true });
            dispatch(addUser(res?.data?.data));
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 2000);
        } catch (err) {
            setError(err?.response?.data || "Something went wrong");
        }
    }

    return (
        <>
            <div className='flex justify-center my-10'>
                <div className='flex mx-10'>
                    <div className="card bg-base-300 w-96 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title justify-center">Edit Profile</h2>
                            <div>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend py-2">First Name:</legend>
                                    <input type="text" className="input"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <legend className="fieldset-legend py-2">Last Name:</legend>
                                    <input type="text" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    <legend className="fieldset-legend py-2">Age:</legend>
                                    <input type="text" className="input" value={age} onChange={(e) => setAge(e.target.value)} />
                                    <legend className="fieldset-legend py-2">Photo Url:</legend>
                                    <input type="text" className="input" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
                                    <legend className="fieldset-legend py-2">Gender:</legend>
                                    <input type="text" className="input" value={gender} onChange={(e) => setGender(e.target.value)} />
                                    <legend className="fieldset-legend py-2">Skills:</legend>
                                    <input type="text" className="input" value={skills} onChange={(e) => setSkills(e.target.value)} />
                                    <legend className="fieldset-legend py-2">About:</legend>
                                    <input type="text" className="input" value={about} onChange={(e) => setAbout(e.target.value)} />

                                </fieldset>
                            </div>
                            <p className="text-red-500">{error}</p>
                            <div className="card-actions justify-center">
                                <button className="btn btn-primary" onClick={handleEditProfile}>Save Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
                <UserCard user={{ firstName, lastName, age, gender, about, photoUrl }} />
            </div>
            {showToast &&
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Profile saved successfully.</span>
                    </div>
                </div>}
        </>
    )
}

export default EditProfile