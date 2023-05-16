import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "../utils/axios";
import { MdAdd } from 'react-icons/md';
import { Buffer } from "buffer";
import { Button, Slider } from "@mui/material";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import Cropper from "react-easy-crop";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [custom_uploads, setcustom_upload] = useState([])
   const fileInputRef = useRef(null);
   const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };


  const CropComplete = async(_, AreaPix) => {
    const croppedImage = await getCroppedImage(AreaPix, image);
    setCroppedImage(croppedImage);
	};

  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      navigate("/login");
    else
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)}`;
  }, []);
  const getCroppedImage = async (croppedAreaPixels) => {
  const canvas = document.createElement("canvas");
  const imageElement = document.createElement("img");
  imageElement.src = image;
  const scaleX = imageElement.naturalWidth / imageElement.width;
  const scaleY = imageElement.naturalHeight / imageElement.height;
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    imageElement,
    croppedAreaPixels.x * scaleX,
    croppedAreaPixels.y * scaleY,
    croppedAreaPixels.width * scaleX,
    croppedAreaPixels.height * scaleY,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );
  const dataUrl = canvas.toDataURL("image/jpeg");
  return dataUrl;
};

  const setProfilePicture = async () => {
    if(selectedAvatar === undefined && Image ==null){
      toast.error("Please select an avatar or upload image", toastOptions);
    }
    let imgurl=""
    if(image!=null){
      try {
        const formData = new FormData();
        formData.append('file', croppedImage);
        formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: "POST",
        body: formData
      }).then(r=>r.json());
        imgurl = await  res.secure_url;
        const user_id =  localStorage.getItem("user_id")
        const { data } = await axios.post(`${setAvatarRoute}/${user_id}`, {
            image: imgurl,
        });
          if (data.isSet) {
            navigate("/");
          } else {
            toast.error("Error setting avatar. Please try again.", toastOptions);
          }
    } catch (error) {
     toast.error("Error setting avatar. Please try again.", toastOptions);
    }
      setImage("");
    }
    else{
      const objurl=avatars[selectedAvatar]
      const binaryString = window.atob(objurl);
      const bytes = new Uint8Array(binaryString.length);
      for (let j = 0; j < binaryString.length; j++) {
        bytes[j] = binaryString.charCodeAt(j);
      }
      const imageData = new Blob([bytes], { type: "image/jpeg" });
      const formData = new FormData();
        formData.append('file', imageData);
        formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
        method: "POST",
        body: formData
      }).then(r=>r.json());
        imgurl = await  res.secure_url;
        const user_id =  localStorage.getItem("user_id")
        const { data } = await axios.post(`${setAvatarRoute}/${user_id}`, {
          image: imgurl,
        });
        if (data.isSet) {
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastOptions);
        }
    }
    
  };

  useEffect(() => {
 const fetchData = async () => {
        const data = [];
      for (let i = 0; i < 4; i++) {
        const response = await fetch(`${api}/${JSON.stringify(Math.round(Math.random() * 1000))}`, {
          responseType: 'arraybuffer'
        });
        const buffer = await response.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');
        data.push(base64String);
      }
      setAvatars(data);
      setIsLoading(false);
  };

fetchData();

  }, []);
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
  };
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          { image ? (
          <>
          <div className='imd'>
          <Crop >
          <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={CropComplete}
          />
          </Crop>
            </div>
          <Slide>
          <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e, zoom) => setZoom(zoom)}
              />
            <Button variant='contained' onClick={setProfilePicture}>Set PIC</Button>
            <Button variant='contained' onClick={()=>{setImage("")}}>Cancel</Button>
            </Slide>
          </>
        ) : (
          <React.Fragment>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
            
             <AvatarContainer  onClick={handleAvatarClick}>
              <AddIcon />
              </AvatarContainer>
          </div>
          <FileInput type="file" accept="image/*" onChange={onFileChange}  ref={fileInputRef} />

          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
          </React.Fragment>
        )}
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      text-align: center;
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
    @media only screen and (max-width: 600px) {
    .avatars {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar {
        border: 0.2rem solid transparent;
        padding: 0.2rem;
        border-radius: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.5s ease-in-out;
        img {
          height: 4rem;
          transition: 0.5s ease-in-out;
        }
      }
    }
    .submit-btn {
      width: 100%;
    }
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #ccc;
  padding: 1.5rem;
  border-radius: 5rem;
  transition: 0.5s ease-in-out;
  img {
      height: 6rem;
      transition: 0.5s ease-in-out;
    }
  cursor: pointer;
`;

const AddIcon = styled(MdAdd)`
  font-size: 24px;
  color: #ccc;
`;

const FileInput = styled.input`
  display: none;
`;


const Crop=styled.div`
height:fit-content;
width: fit-content;
`;

const Slide=styled.div`
display:flex;
padding-left:190px;
width:80vw;
height:80vh;
justify-content:center;
align-items: flex-end;
Button{
    width:200px;
    margin-left:60px;
}
`;