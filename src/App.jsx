import { useState, useLayoutEffect } from 'react'
import { Container, Button, useColorMode, } from "@yamada-ui/react"
import { GPSContent } from './contents/GPSContent';
import { Top } from './contents/Top';
import { LoadView } from './atom/LoadView';
import { Header } from './atom/Header';
import { Footer } from './atom/Footer';

function App() {
  const { colorMode, changeColorMode} = useColorMode()
  const [flag, setFlag] = useState(0);

  const loadingEvent = () => {
    setFlag(1);
    window.setTimeout(() => { setFlag(2); }, 2000);
  }

  useLayoutEffect(() => {
    changeColorMode("dark");
    console.log(colorMode);
  }, []);

  return (
    <>
      <Header />
      <Container fontFamily={"DotGothic16"} >
        {
          flag == 0 ? <Top><Button mt="4" colorScheme={"secondary"} onClick={loadingEvent}>探知開始</Button></Top> : <></>
        }
        {
          flag == 1 ? <LoadView /> : <></>
        }
        {
          flag == 2 ? <GPSContent /> : <></>
        }
      </Container>
      <Footer />
    </>
  )
}

export default App
