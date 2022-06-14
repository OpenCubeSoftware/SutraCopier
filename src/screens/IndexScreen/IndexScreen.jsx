import {Box, Button} from "@mui/material";
import {uiActions} from "../../store/ui-slice.js";
import {sutraActions} from "../../store/sutra-slice.js";
import './IndexScreen.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffectOnce} from "react-use";
import {appWindow} from "@tauri-apps/api/window";
// import PropTypes from "prop-types";

const IndexScreen = () => {
  const dispatch = useDispatch();
  const sutraTitles = useSelector((state) => state.sutra.sutraTitles);
  const sutras = useSelector((state) => state.sutra.sutras);
  console.log("Sutras from index screen are: ", sutras);
  const currentSutra = useSelector((state) => state.settingsSutra);
  const currentIndex = useSelector((state) => state.settingsSutraIndex);
  const sutraSettings = useSelector((state) => ({title: state.settingsSutra, index: state.settingsSutraIndex}));

  useEffectOnce(() => {
    const unlisten = appWindow.listen('tauri://close-requested', ({event, payload}) => {
      appWindow.close();
    });

    return () => {
      unlisten.then(f => f());
    }
  })

  const handleSelectSutra = (sutraTitle) => {
    dispatch(
      sutraActions.setSelectedSutra(
        {
          selectedSutra: sutraTitle,
        }
      )
    );
    dispatch(uiActions.setCurrentPage({page: 'sutra'}));
  }

  const handleSelectSutraWithIndex = (sutraTitle, sutraIndex) => {
    dispatch(
      sutraActions.setSelectedSutraWithIndex(
        {
          selectedSutra: sutraTitle,
          currentIndex: sutraIndex
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
        {currentSutra && currentIndex !== 0 &&
          <div className="resume" onClick={() => handleSelectSutraWithIndex(currentSutra, currentIndex)}>
            <p className="info">Resume {currentSutra} from character {currentIndex +1}?</p></div>
        }
        <p className="info">Available sutras:</p>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {sutraTitles.map(s => (
            <Button key={s} sx={{color: '#fff'}} onClick={() => handleSelectSutra(s)}>{s}</Button>
        ))}</Box>
      </Box>
    </Box>
  )
}

export default IndexScreen;
