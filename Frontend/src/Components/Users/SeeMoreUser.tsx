import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import '../../css/SeeMoreUser.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import { CardActionArea } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { UserGetAPI } from '../../API/UserAPI/GET.tsx';
import { Creator } from '../../Interfaces/UserInterface.ts';
import { PlaceHoldersImageCard } from './PlaceHolders.jsx';
import { useNavigate } from "react-router-dom";

export default function SeeMoreUser() {
  const { theme } = useContext(ThemeContext);
  const { getAllUsers } = UserGetAPI();

  const [creatorList, setCreatorList] = useState<Creator[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const navigate = useNavigate();

  const savedAuth = sessionStorage.getItem('auth');
  const savedUser: Creator | null = savedAuth ? JSON.parse(savedAuth) : null;
  const currentUserId = savedUser?.userId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        const userArray = Array.isArray(res) ? res : res?.data || [];
        setCreatorList(userArray);
      } catch (err) {
        console.error("Error fetching users:", err);
        setCreatorList([]);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = creatorList.slice(indexOfFirstUser, indexOfLastUser);
  const pageCount = Math.ceil(creatorList.length / usersPerPage);

  const handleUserClick = (_id: number) => {
    navigate(`/characters/profile/${_id}`);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  function UserList() {
    return (
      <>
        {currentUsers.map((user: Creator) => (
          <Card key={user._id} sx={{ width: '30%', marginBottom: '20px' }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={user.backgroundPicture || "/images/defaultbgr.jpg"}
                alt="No Background Image"
              />
              <CardContent>
                <div className="infouser" onClick={() => handleUserClick(user._id)} style={{ cursor: 'pointer' }}>
                  <Typography gutterBottom variant="h5" component="div" style={{ marginBottom: '0' }}>
                    <div className="avartar">
                      <Avatar
                        alt="Remy Sharp"
                        src={`${user.profilePicture}`}
                        sx={{ width: 100, height: 100 }}
                        style={{ border: '3px solid white' }}
                      />
                    </div>
                    {user.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{user.firstName} {user.lastName}</strong>
                    <br /> Followers: {user.followerCount}
                  </Typography>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </>
    );
  }

  return (
    <div className="Box-content">
      <Box
        className="box"
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: '95%',
          margin: 'auto',
          borderRadius: '5px',
          marginBottom: '15px',
          paddingTop: '30px',
        }}
      >
        <Typography variant="h5" style={{ marginLeft: '100px' }}>
          Recommended User:
        </Typography>
        <div className="grid-container">
          {currentUsers.length !== 0 ? <UserList /> : <PlaceHoldersImageCard />}
        </div>
        {pageCount > 1 && (
          <div className="pagination">
            <Pagination count={pageCount} page={currentPage} onChange={handleChangePage} />
          </div>
        )}
      </Box>
    </div>
  );
}
