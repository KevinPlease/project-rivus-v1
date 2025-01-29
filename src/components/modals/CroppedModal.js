import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Modal, Slider } from "@mui/material";
import AvatarEditor from "react-avatar-editor";


export const CropperModal = ({ src, modalOpen, setModalOpen, setImage }) => {
	const [slideValue, setSlideValue] = useState(10);
	const cropRef = useRef(null);
  
	//handle save
	const handleSave = async () => {
	  if (cropRef) {
		const dataUrl = cropRef.current.getImage().toDataURL();
		const result = await fetch(dataUrl);
		const blob = await result.blob();
		const file = new File([blob], 'cropped_image.png', { type: blob.type });
		setImage({ file, src: URL.createObjectURL(blob), isImg: true });
		setModalOpen(false);
	  }
	};
  
	return (
	  <Modal sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
		open={modalOpen}>
		<Box sx={{
		  width: "300px",
		  height: "300px",
		  display: "flex",
		  flexFlow: "column",
		  justifyContent: "center",
		  alignItems: "center"
		}}>
		  <AvatarEditor
			ref={cropRef}
			image={src}
			style={{ width: "100%", height: "100%" }}
			border={50}
			borderRadius={150}
			color={[0, 0, 0, 0.72]}
			scale={slideValue / 10}
			rotate={0}
		  />
  
		  {/* MUI Slider */}
		  <Slider
			min={10}
			max={50}
			sx={{
			  margin: "0 auto",
			  width: "80%",
			  color: "cyan"
			}}
			size="medium"
			defaultValue={slideValue}
			value={slideValue}
			onChange={(e) => setSlideValue(e.target.value)}
		  />
		  <Box
			sx={{
			  display: "flex",
			  padding: "10px",
			  border: "3px solid white",
			  background: "black"
			}}
		  >
			<Button
			  size="small"
			  sx={{ marginRight: "10px", color: "white", borderColor: "white" }}
			  variant="outlined"
			  onClick={(e) => setModalOpen(false)}
			>
			  cancel
			</Button>
			<Button
			  sx={{ background: "#5596e6" }}
			  size="small"
			  variant="contained"
			  onClick={handleSave}
			>
			  Save
			</Button>
		  </Box>
		</Box>
	  </Modal>
	);
  };