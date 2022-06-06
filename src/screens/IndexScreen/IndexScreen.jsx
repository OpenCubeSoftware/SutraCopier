import {Box, Button, Grid, Typography} from "@mui/material";
import {uiActions} from "../../store/ui-slice.js";
import {sutraActions} from "../../store/sutra-slice.js";
import './IndexScreen.css';
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";

const IndexScreen = () => {
  const dispatch = useDispatch();
  const sutraTitles = useSelector((state) => state.sutra.sutraTitles);
  console.log(sutraTitles);
  const handleSelectSutra = (sutraTitle) => {
    dispatch(
      sutraActions.setSelectedSutra(
        {
          selectedSutra: sutraTitle
        }
      )
    );
    dispatch(uiActions.setCurrentPage({page: 'sutra'}));
  }

  return (
    <Box className="main-box">
      <Box>
        <h4 className="font-fondamento heading">Sutra Copy Tool</h4>
        <p className="info">This program helps you to copy Buddhist sutras in Chinese by displaying one character at a time.</p>
        <p className="info">Available sutras:</p>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {sutraTitles.map(s => (
            <Button key={s} sx={{color: '#fff'}} onClick={() => handleSelectSutra(s)}>{s}</Button>
        ))}</Box>
      </Box>
    </Box>
  )
}

IndexScreen.propTypes = {
  sutraTitles: PropTypes.array,
  changePage: PropTypes.func,
}

export default IndexScreen;
