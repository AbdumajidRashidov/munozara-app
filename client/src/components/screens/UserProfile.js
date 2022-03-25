import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);

  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userid]);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setShowFollow(true);
      });
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "600px", margin: "10px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "40px 0px",
              padding: "20px",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 7px 10px -3px",
            }}
          >
            <div>
              <img
                alt="ava"
                style={{
                  width: "120px",
                  objectFit: "cover",
                  height: "120px",
                  borderRadius: "50%",
                  margin: "0 0 30px 0",
                }}
                src={userProfile.user.pic}
              />
            </div>
            <div>
              <h4 style={{ fontSize: "26px" }}>{userProfile.user.name}</h4>
              <h5 style={{ fontSize: "20px" }}>{userProfile.user.email}</h5>

              <div
                style={{
                  display: "flex",
                  opacity: "0.7",
                  justifyContent: "space-between",
                }}
              >
                <h5 style={{ margin: "0 5px", fontSize: "20px" }}>
                  {userProfile.posts.length} posts
                </h5>
                <h5 style={{ margin: "0 5px", fontSize: "20px" }}>
                  {userProfile.user.followers.length} followers
                </h5>
                <h5 style={{ margin: "0 5px", fontSize: "20px" }}>
                  {userProfile.user.following.length} following
                </h5>
              </div>
              <div></div>

              {showFollow ? (
                <button
                  className="btn #00e676 green accent-3 waves-effect waves-light"
                  onClick={() => followUser()}
                >
                  follow
                </button>
              ) : (
                <button
                  className="btn #00e676 green accent-3 waves-effect waves-light"
                  onClick={() => unfollowUser()}
                >
                  unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  className="item"
                  key={item._id}
                  alt={item.title}
                  src={item.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </>
  );
};
export default Profile;
