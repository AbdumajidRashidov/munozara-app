import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";
const Home = () => {
  const { state } = useContext(UserContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likedPost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikedPost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid} `, {
      method: "delete",
      headers: {
        Authorization: "Muhammad " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
        M.toast({
          html: "post muvaffaqiyatli o'chirildi!",
          classes: "#ff5252 indigo accent-3",
        });
      });
  };
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <div>
              <img
                alt="ava"
                style={{
                  width: "50px",
                  objectFit: "cover",
                  height: "50px",
                  float: "left",
                  borderRadius: "50%",
                  margin: "10px 0 10px 10px",
                }}
                src={item.postedBy.pic}
              />
              <h5 style={{ float: "left" }}>
                <Link
                  style={{ margin: "15px 0px 15px 0" }}
                  to={
                    item.postedBy._id === state._id
                      ? `/profile`
                      : `/profile/${item.postedBy._id}`
                  }
                >
                  {item.postedBy.name}
                </Link>
              </h5>
              {item.postedBy._id === state._id && (
                <i
                  onClick={() => deletePost(item._id)}
                  className="material-icons"
                  style={{ color: "red", float: "right", margin: "15px" }}
                >
                  delete
                </i>
              )}
            </div>
            <div className="card-image" style={{ position: "unset" }}>
              <img
                alt="img"
                src={item.photo}
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    style={{ color: "#00e676" }}
                    onClick={() => {
                      unlikedPost(item._id);
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    style={{ color: "#00e676" }}
                    onClick={() => {
                      likedPost(item._id);
                    }}
                  >
                    thumb_up
                  </i>
                )}
                <h6>{item.likes.length} likes </h6>
              </div>

              <h5>{item.title}</h5>
              <h6>{item.body}</h6>
              <div>
                <h5>comments:</h5>
                {item.comments.map((record) => {
                  return (
                    <h6
                      key={record._id}
                      style={{ opacity: "0.7", fontWeight: "500" }}
                    >
                      <span>{record.postedBy.name} :</span>
                      {record.text}
                    </h6>
                  );
                })}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  e.target[0].value = "";
                }}
              >
                <input
                  type="text"
                  placeholder="write something comment"
                ></input>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Home;
