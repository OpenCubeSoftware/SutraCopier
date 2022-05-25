import {Box, Button, Grid, Typography} from "@mui/material";
import {useEffect} from "react";
import './IndexScreen.css';

const IndexScreen = ({sutraTitles}) => {
  // const {classes} = useStyles();
  useEffect(() => {
    console.log("use effect");
    return () => {
      console.log("Meow unmounted");
    }
  })

  return (
    <Box className="main-box">
      <Box>
        <h4 className="font-fondamento heading">Sutra Copy Tool</h4>
      </Box>
    </Box>
  )
}

export default IndexScreen;
