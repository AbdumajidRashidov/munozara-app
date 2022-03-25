import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
const Reset = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const PostData = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "Kechirasiz, tarmoqda bunday email yo'q!",
        classes: "#ff5252 red accent-3",
      });
    } else {
      fetch("/reset-password", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#ff5252 red accent-3" });
          } else {
            M.toast({ html: data.message, classes: "#ff5252 indigo accent-3" });
            history.push("/signin");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div>
      <div className="card login-card">
        <h2>Munozara</h2>
        <input
          type="email"
          placeholder="emailingizni kiriting!"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn #00e676 green accent-3 waves-effect waves-light"
          onClick={() => PostData()}
        >
          Emailga jo'natish
        </button>
      </div>
    </div>
  );
};
export default Reset;
