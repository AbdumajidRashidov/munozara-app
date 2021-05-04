import React,{useState} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css';
const NewPassword = () => {
    const history = useHistory()
    const {token} = useParams()
    console.log(token)
    const [password, setPassword] = useState("")
    const PostData = () => {
            fetch("/newpassword", {
                method: "post",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    password,
                    token,
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({html: data.error, classes:"#ff5252 red accent-3"})
                    } else {
                        history.push('/signin')
                        M.toast({ html: data.message , classes: "#ff5252 indigo accent-3" })
                        
                    }
                }).catch(err => {
                    console.log(err)
                })
            
    }
    return (
        <div>
            <div className="card login-card">
                <h2>Munozara</h2>
                <input
                    id="password"
                    type="password"
                    placeholder="yangi parolni kiriting"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button
                    className="btn #00e676 green accent-3 waves-effect waves-light"
                    onClick={()=> PostData()}
                >Yangi parol</button>
            </div>
            
        </div>
    )
}
 export default NewPassword