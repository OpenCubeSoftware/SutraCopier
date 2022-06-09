import {useEffect, useMemo, useRef} from "react";
import {Box, Button, Grid, Typography} from '@mui/material';
import './SutraScreen.css';
import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import {uiActions} from "../../store/ui-slice.js";
import PropTypes from "prop-types";
import {invoke} from "@tauri-apps/api";
import {sutraActions} from "../../store/sutra-slice.js";
import {useEffectOnce, useUnmount} from "react-use";
import {BaseDirectory, createDir, writeFile} from "@tauri-apps/api/fs";

const SutraScreen = () => {
  const sutraData = useSelector((state) => state.sutra.selectedSutraData);
  const startingIndex = useSelector((state) => state.sutra.sutraIndex);
  const totalChars = sutraData.data.length;
  const [index, setIndex] = useState(startingIndex);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  const indexRef = useRef(startingIndex);

  useEffectOnce(() => {
    createDataFolder();
    buttonRef.current.focus();
  });

  useEffect(() => {
    createDataFile();
  }, [index])

  const createDataFolder = async () => {
    try {
      await createDir("sutracopy", {
        dir: BaseDirectory.Data,
        recursive: true,
      });
    } catch (e) {
      console.error(e);
    }
  }

  const createDataFile = async () => {
    try {
      await writeFile(
        {
          contents: JSON.stringify({title: sutraData.title, sutraIndex: indexRef.current}),
          path: `./sutracopy/sutracopy.settings.json`,
        },
        {
          dir: BaseDirectory.Data,
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

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
    buttonRef.current.focus();
    indexRef.current += 1;
    setIndex(index + 1);
  }

  const handleDecrementIndex = () => {
    indexRef.current -= 1;
    setIndex(index - 1);
  }

  return (
    <Box className="sutra-box">

      <Box className="inner-sutra-box">
        <h2 className="font-fondamento sutra-title-display">{sutraData.title}</h2>
        <h1 className="font-face-kt sutra-char">{getSutraCharacter()}</h1>
        <Box className="sutra-info">
          <Box className="prev-next">
            <span className="index-display">Previous:</span>
            <span className={getPrevNextSutraCharacter('prev') === 'None' ? "index-display pl" :"char-display font-face-kt"}>
              {getPrevNextSutraCharacter('prev')}
            </span>
          </Box>
          <span className="index-display">{index + 1}/{totalChars}</span>
          <Box className="prev-next">
            <span className="index-display">Next: </span>
            <span className={getPrevNextSutraCharacter('next') === 'None' ? "index-display pl" :"char-display font-face-kt"}> {getPrevNextSutraCharacter('next')}
            </span>
          </Box>
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
  startingIndex: PropTypes.number,
}

SutraScreen.defaultProps = {
  startingIndex: 0,
}

export default SutraScreen;
