import {useEffect, useMemo, useRef} from "react";
import {Box, Button, Grid, Typography} from '@mui/material';
import './SutraScreen.css';
import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import {uiActions} from "../../store/ui-slice.js";
import PropTypes from "prop-types";
import {invoke} from "@tauri-apps/api";
import {sutraActions} from "../../store/sutra-slice.js";

const SutraScreen = () => {
  const sutraData = useSelector((state) => state.sutra.selectedSutraData);
  const totalChars = sutraData.data.length;
  // const [index, setIndex] = useState( 0);
  const index = useSelector((state) => state.sutra.sutraIndex);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  const indexRef = useRef(0);

  // const sutraSettings = useMemo(() => {
  //   return JSON.stringify({title: sutraData.title, currentIndex: index});
  // }, [sutraData, index]);

  useEffect(() => {
    buttonRef.current.focus();

    return async () => {
      const sutraSettings = JSON.stringify({title: sutraData.title, index: indexRef.current});
      console.log(sutraSettings);
      await invoke('persist_settings', {settings: sutraSettings});
    }
  }, []);


  const backToMenu = () => {

    dispatch(uiActions.setCurrentPage({page: 'index'}));
  }

  const getSutraCharacter = () => {
    const sutraChars = sutraData.data;
    const char = sutraChars.find((s) => s.index === index);
    return char?.character;
  }

  const getPrevNextSutraCharacter = (prevOrNext) => {
    const sutraChars = sutraData.data;
    let searchIndex;
    if (prevOrNext === 'prev') {
      searchIndex = index - 1;
    } else if (prevOrNext === 'next') {
      searchIndex = index + 1;
    }
    const char = sutraChars.find((s) => s.index === searchIndex);
    return char?.character ?? 'None';
  }

  const handleIncrementIndex = () => {
    indexRef.current += 1;
    dispatch(sutraActions.incrementSutraIndex());
  }

  const handleDecrementIndex = () => {
    indexRef.current -= 1;
    dispatch(sutraActions.decrementSutraIndex());
  }

  return (
    <Box className="sutra-box">

      <Box className="inner-sutra-box">
        <h2 className="font-fondamento sutra-title-display">{sutraData.title}</h2>
        <h1 className="font-face-kt sutra-char">{getSutraCharacter()}</h1>
        <Box className="sutra-info">
          <p className="index-display">Previous: {getPrevNextSutraCharacter('prev')}</p>
          <p className="index-display">{index + 1}/{totalChars}</p>
          <p className="index-display">Next: {getPrevNextSutraCharacter('next')}</p>
        </Box>

        <Box className="sutra-info">
          <Button onClick={handleDecrementIndex} disabled={index === 0}>Previous</Button>
          <Button
          variant="contained"
          color="primary"
          disabled={index === totalChars - 1}
          ref={buttonRef}
          onClick={handleIncrementIndex}
        >
          Next Character
        </Button>
        <Button onClick={backToMenu}>Main Menu</Button>
        </Box>
      </Box>

    </Box>
  )
}

SutraScreen.propTypes = {
  initialIndex: PropTypes.number,
}

SutraScreen.defaultProps = {
  initialIndex: 0,
}

export default SutraScreen;
