import {Box, Button, Grid} from "@mui/material";
import {useEffect} from "react";

const IndexScreen = ({val}) => {
  useEffect(() => {
    console.log("use effect");
    return () => {
      console.log("Meow unmounted");
    }
  })

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          Hello
        </Grid>
        <Grid item xs={9}>
          The cat says meow meow meow meow meow meow meow meow meow
        </Grid>
      </Grid>
    </Box>
  )
}

export default IndexScreen;
