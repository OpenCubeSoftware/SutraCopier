import {Box} from "@mui/material";
import {useEffect} from "react";

const SecondScreen = () => {
  useEffect(() => {
    console.log("use effect");
    return () => {
      console.log("Big purrs unmounted");
    }
  })
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <h2 className="font-fondamento">Big Purrs</h2>
    </Box>
  )
}

export default SecondScreen;
