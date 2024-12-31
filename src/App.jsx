import { useState, useLayoutEffect } from 'react'
import { Container, Button, useColorMode, } from "@yamada-ui/react"
import { GPSContent } from './contents/GPSContent';
import { LoadView } from './atom/LoadView';
import { Header } from './atom/Header';
import { Footer } from './atom/Footer';

function App() {
  const [flag, setFlag] = useState(0);
  const { colorMode, changeColorMode, toggleColorMode } = useColorMode()

  // ビジーwaitを使う方法
  const sleep = (waitMsec) => {
    var startMsec = new Date();

    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
  }

  useLayoutEffect(() => {
    changeColorMode("dark");
  }, []);
  const loadingEvent = () => {
    setFlag(1);
    window.setTimeout(()=>{setFlag(2);}, 2000);
  }
  return (
    <>
      <Header />
      <Container fontFamily={"DotGothic16"} >
        {
          flag == 0 ? <Button mt="32" colorScheme={"secondary"} onClick={loadingEvent}>探知開始</Button> : <></>
        }
        {
          flag == 1 ? <LoadView /> : <></>
        }
        {
          flag == 2 ? <GPSContent /> : <></>
        }
      </Container>
      <Footer/>
    </>
  )
}

export default App
