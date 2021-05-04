import React,{useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App'
import 'materialize-css';
import { Button, Modal} from 'react-materialize';
const Profile = () => {
    const {state, dispatch} = useContext(UserContext)
    const [mypics, setMypics] = useState([]);
    const [image, setImage] = useState("")
    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization":"Muhammad "+localStorage.getItem("jwt") 
            }
        }).then(res => res.json())
            .then(result => {
                setMypics(result.mypost)
            }).catch(err => {
            console.log(err)
        })
    },[])
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","munozara-uz")
            data.append("cloud_name", "munozara.uz")
            fetch("https://api.cloudinary.com/v1_1/munozara-uz/image/upload", {
                method: "post",
                body:data
            }).then(res => res.json())
                .then(data => {
                    fetch('/updatepic',{
                        method:"put",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":"Muhammad "+localStorage.getItem("jwt") 
                        },
                        body:JSON.stringify({
                            pic:data.url
                        })
                    }).then(res=> res.json())
                    .then(result =>{
                        console.log(result)
                        localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                        dispatch({type:"UPDATEPIC",payload:result.pic})
                    })
                })
                .catch(err => {
                    console.log(err)
            })
        }
    },[image])
    const updatePhoto= (file)=>{
        setImage(file)
    }
    return (
        <div style={{maxWidth:"600px",margin:"10px auto"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "40px 0px",
                padding:"20px",
                boxShadow: "rgba(0, 0, 0, 0.2) 0px 7px 10px -3px"
            }}>
                <div>
                
                    <Modal
                        actions={[
                            <Button flat modal="close" node="button" waves="green"></Button>
                        ]}
                        bottomSheet={false}
                        fixedFooter={false}
                        header="Upload Pic"
                        id="Modal-0"
                        open={false}
                        options={{
                            dismissible: true,
                            endingTop: '10%',
                            inDuration: 250,
                            onCloseEnd: null,
                            onCloseStart: null,
                            onOpenEnd: null,
                            onOpenStart: null,
                            opacity: 0.5,
                            outDuration: 250,
                            preventScrolling: true,
                            startingTop: '4%'
                        }}
                        trigger={
                        <div>
                            <div className="img_photo">
                                <i className="material-icons">camera_alt</i>
                            </div>
                            <img 
                                alt="ava" 
                                className="avaUpload"
                                style={{ 
                                    width:"120px",
                                    objectFit:"cover",
                                    height:"120px", 
                                    borderRadius:"50%",
                                    margin:"0 0 30px 0",
                                    cursor:"pointer",
                                }}
                                src={state ? state.pic : "loading"}
                                
                            />
                        </div>
                        }
                        >
                         <div className="file-field input-field">
                            <div className="btn green accent-3">
                                <span>rasm yuklang</span>
                                <input
                                    type="file"
                                    onChange={(e)=>setImage(e.target.files[0])}
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                            <Button  flat
                                modal="close"
                                node="button"
                                waves="green" 
                                className="btn #00e676 green accent-3"
                                style={{
                                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                    color:"white",
                                    float:"right"
                                }}
                                onClick={()=>updatePhoto()} >Upload</Button>
                        </div>
                    </Modal>
                </div>
                <div>
                    <h4 style={{fontSize:"26px"}}>{ state ? state.name :"loading..." }</h4>
                    <h5 style={{fontSize:"20px"}}>{ state ? state.email :"loading..." }</h5>
                    <div style={{ display: "flex", opacity:"0.7", justifyContent:"space-between"}}>
                        <h5 style={{margin:"0 5px",fontSize:"20px"}}>{mypics.length} posts</h5>
                        <h5 style={{ margin: "0 5px",fontSize:"20px" }}>
                        {
                            state ? state.followers.length : "0"
                        } followers
                        </h5>
                        
                        <h5 style={{ margin: "0 5px",fontSize:"20px" }}>
                            {
                                state ? state.following.length : "0"
                            } following
                        </h5>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img className="item" style={{objectFit:"cover"}} key={item._id} alt={item.title} src={item.photo } />
                        )
                    })
                }
            </div>
        </div>
    )
}
 export default Profile