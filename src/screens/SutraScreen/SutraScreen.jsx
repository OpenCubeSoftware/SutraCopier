import {useEffect, useRef, useState} from "react";
import {Box, Button, Grid, Typography} from '@mui/material';
import './SutraScreen.css';
import {useSelector, useDispatch} from "react-redux";
import {uiActions} from "../../store/ui-slice.js";
import PropTypes from "prop-types";
import {sutraActions} from "../../store/sutra-slice.js";
import {useEffectOnce} from "react-use";
import {BaseDirectory, createDir, readTextFile, writeFile} from "@tauri-apps/api/fs";
import {appWindow} from "@tauri-apps/api/window";
import {dialog} from "@tauri-apps/api";
import {isEmpty} from "lodash";
import SutraModal from "../../components/SutraModal/SutraModal";
/*import {useState} from "react";
import {invoke} from "@tauri-apps/api";*/

const SutraScreen = () => {
  const sutraData = useSelector((state) => state.sutra.selectedSutraData);
  const settingsSutras = useSelector((state) => state.sutra.settingsSutras)
  const totalChars = sutraData.data.length;
  const [savedIndex, setSavedIndex] = useState(0);
  const index = useSelector((state) => state.sutra.sutraIndex);
  const [openModal, setOpenModal] = useState(false);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  const indexRef = useRef(index);

  useEffectOnce(()=> {

    const setSutraIndex = (sutraIndex) => {
      setSavedIndex(sutraIndex);
      setOpenModal(true);
    }
    console.log(settingsSutras);
    const currentSutraFromSettings = settingsSutras.find((s) => s.title === sutraData.title);
    if (!isEmpty(currentSutraFromSettings)) {
      setSutraIndex(currentSutraFromSettings.sutraIndex);
    }
  })

  useEffectOnce(() => {
    buttonRef.current.focus();
  });

  const requestSave = (closeWindow) => {
    dialog.ask('Do you want to save your progress?').then((res) => {
      console.log("dialog result is", res);
      if (res) {
        saveData().then((res) => {
          if (res) {
            dialog.message("Data saved").then(() => {
              if (closeWindow) {
                return appWindow.close();
              } else {
                dispatch(uiActions.setCurrentPage({page: 'index'}));
              }
            });
          } else {
            dialog.ask("Saving data failed. Do you want to quit anyway?").then((res) => {
              if (res) {
                if (closeWindow) {
                  return appWindow.close();
                } else {
                  dispatch(uiActions.setCurrentPage({page: 'index'}));
                }
              }
            })
          }
        });
      } else {
        return appWindow.close();
      }
    })
  }



  useEffectOnce(() => {
    const unlisten = appWindow.listen('tauri://close-requested', ({event, payload}) => {
      requestSave(true);
    });

    return () => {
      unlisten.then(f => f());
    }
  })

  const readSettingsFile = async () => {
    try {
      const settingsData = await readTextFile(`sutracopy/sutrasettings.json`, {dir: BaseDirectory.Data});
      return JSON.parse(settingsData);
    } catch (e) {
      console.error("error reading settings file", e);
      return undefined;
    }
  }

  // const createDataFolder = async () => {
  //   try {
  //     await createDir("sutracopy", {
  //       dir: BaseDirectory.Data,
  //       recursive: true,
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  const saveData = async () => {
    try {
      let settingsData = await readSettingsFile();
      if (isEmpty(settingsData)) {
        console.log("Settings file is empty")
        settingsData = [];
      }
      const sutraObject = settingsData.find((s) => s.title === sutraData.title);
      if (!isEmpty(sutraObject)) {
        sutraObject.sutraIndex = indexRef.current;
      } else {
        settingsData.push({title: sutraData.title, sutraIndex: indexRef.current})
      }
      console.log("Settings data is: ", settingsData);
      writeFile(
        {
          contents: JSON.stringify(settingsData),
          path: `sutracopy/sutrasettings.json`,
        },
        {
          dir: BaseDirectory.Data,
        }
      ).then(() => {
        console.log("reached then of writefile")
      }).catch((err) => {
        console.log("fell into cattch block");
        console.error(err);
      });
      return true;
    } catch (e) {
      console.error("error writing file", e);
      return false;
    }
  };

  const backToMenu = () => {
   requestSave(false);
    // dispatch(uiActions.setCurrentPage({page: 'index'}));
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
    // setIndex(index + 1);
    dispatch(sutraActions.incrementSutraIndex());
  }

  const handleDecrementIndex = () => {
    indexRef.current -= 1;
    // setIndex(index - 1);
    dispatch(sutraActions.decrementSutraIndex());
  }

  const setNewSutraIndex = () => {
    dispatch(sutraActions.setSutraIndex({index: savedIndex}));
    indexRef.current = savedIndex;
    setOpenModal(false);
  }

  return (
    <Box className="sutra-box">

      <Box className="inner-sutra-box">
        {savedIndex !== 0 && <SutraModal handleOk={setNewSutraIndex} isOpen={openModal} prevIndex={savedIndex} sutraTitle={sutraData.title}/>}
        <h2 className="font-fondamento sutra-title-display">{sutraData.title}</h2>
        <h1 className="font-face-kt sutra-char">{getSutraCharacter()}</h1>
        <Box className="sutra-info">
          <Box className="prev-next">
            <span className="index-display">Previous:</span>
            <span
              className={getPrevNextSutraCharacter('prev') === 'None' ? "index-display pl" : "char-display font-face-kt"}>
              {getPrevNextSutraCharacter('prev')}
            </span>
          </Box>
          <span className="index-display">{index + 1}/{totalChars}</span>
          <Box className="prev-next">
            <span className="index-display">Next: </span>
            <span
              className={getPrevNextSutraCharacter('next') === 'None' ? "index-display pl" : "char-display font-face-kt"}> {getPrevNextSutraCharacter('next')}
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
