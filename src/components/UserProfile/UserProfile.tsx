import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';

// internal imports
import { NavBar } from '../sharedComponents';

type UserProfileData = {
    userID: string;
    name: string;
    email: string;
    city: string;
    state:string;
    profilePic: string;
    bio: string;

}


export const UserProfile = () => {
    const [userData, setUserData] = useState<UserProfileData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;

            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserData(userDoc.data() as UserProfileData);
                }
            } catch (err) {
                setError("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleUpdateProfile = async (updatedData: UserProfileData) => {
        if (!currentUser) return;

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, updatedData);
            setUserData(updatedData);
            setIsEditing(false);
        } catch (err) {
            setError("Failed to update user data.");
        }
    };



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!currentUser) return; 

        const updatedData: UserProfileData = {
            userID: currentUser.uid,
            name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
            email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
            city: (e.currentTarget.elements.namedItem('city') as HTMLInputElement).value,
            state: (e.currentTarget.elements.namedItem('state') as HTMLInputElement).value,
            profilePic: (e.currentTarget.elements.namedItem('profilePic') as HTMLInputElement).value,
            bio: (e.currentTarget.elements.namedItem('bio') as HTMLTextAreaElement).value,
        };
        handleUpdateProfile(updatedData);
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2>this works!</h2>
            {isEditing ? (
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name: <input type="text" defaultValue={userData.name} name="name" />
                        </label>
                        <label>
                            Email: <input type="email" defaultValue={userData.email} name="email" />
                        </label>
                        <label>
                            City: <input type="text" defaultValue={userData.city} name="city" />
                        </label>
                        <label>
                            State: <input type="text" defaultValue={userData.state} name="state" />
                        </label>
                        <label>
                            Profile Pic URL: <input type="text" defaultValue={userData.profilePic} name="profilePic" />
                        </label>
                        <label>
                            Bio: <textarea defaultValue={userData.bio} name="bio"></textarea>
                        </label>
                        <button type="submit">Save</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h1>{userData.name}</h1>
                    <h2>{userData.bio}</h2>
                    {/* You can add more display elements for other user attributes */}
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};