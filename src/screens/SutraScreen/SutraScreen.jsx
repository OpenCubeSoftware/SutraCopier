import {useEffect, useRef} from "react";
import {Box, Button, Grid, Typography} from '@mui/material';
import './SutraScreen.css';
import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import {uiActions} from "../../store/ui-slice.js";
import PropTypes from "prop-types";
import {invoke} from "@tauri-apps/api";

const SutraScreen = ({initialIndex, dataStore}) => {
  console.log("Initial index is", initialIndex.value)
  const sutraData = useSelector((state) => state.sutra.selectedSutraData);
  const totalChars = sutraData.data.length;
  const [index, setIndex] = useState(initialIndex.value ?? 0);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    buttonRef.current.focus();

    return async () => {
      // await dataStore.set('sutra-index', {value: index});
      await invoke('tesst_close');
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
          <Button onClick={() => setIndex(index -1)} disabled={index === 0}>Previous</Button>
          <Button
          variant="contained"
          color="primary"
          disabled={index === totalChars - 1}
          ref={buttonRef}
          onClick={() => setIndex(index + 1)}
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
