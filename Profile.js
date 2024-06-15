import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({ username: '', email: '', password: '', balance: 0 });
    const [newPassword, setNewPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (username) {
            fetchProfile(username);
        }
    }, [username]);

    const fetchProfile = async (username) => {
        try {
            const response = await fetch(`http://localhost:5000/api/profiles/${username}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else {
                console.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const addBalance = () => {
        fetch(`http://localhost:5000/api/profiles/${username}/set-balance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ balance: 40000 })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                setUpdateMessage(data.message);
            } else {
                setProfile(data);
                setUpdateMessage('Balance updated successfully');
            }
        })
        .catch(error => {
            console.error('Error updating balance:', error);
            setUpdateMessage('Error updating balance');
        });
    };

    const changePassword = () => {
        fetch(`http://localhost:5000/api/profiles/${username}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: newPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUpdateMessage('Password updated successfully');
                setNewPassword('');
            } else {
                setUpdateMessage('Failed to update password');
            }
        })
        .catch(error => {
            console.error('Error updating password:', error);
            setUpdateMessage('Error updating password');
        });
    };

    return (
        <div className="profile-body">
        <div className="profile-container">
            <h2>My Profile</h2>
            <br />
            <br />
            <div className="profile-details">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <div className="change-password">
                    <label>
                        <strong> Forgot Password? </strong>
                        <br />  
                        <input
                            type="password"
                            value={newPassword}
                            placeholder='Enter new password'
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </label>
                    <br />
                    <button onClick={changePassword} className="change-password-btn">Change Password</button>
                </div>
                {updateMessage && <p className="update-message">{updateMessage}</p>}
                <br />
                <br />
                <p><strong>Balance Left:</strong> ${profile.balance}</p>
                <button onClick={addBalance} className="add-balance-btn">Reset Balance </button>
            </div>
        </div>
        </div>
    );
}

export default Profile;
