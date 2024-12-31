import { useState } from 'react'
import { Container, Box, Center, Button, Heading } from "@yamada-ui/react"
import { GPSContent } from './GPSContent';

function App() {
  const [flag, setFlag] = useState(false);

  return (
    <>
      <Container>
        <Box>
          <Heading as="h1">プレイヤー検知システム</Heading>
        </Box>
      </Container>
      <Container>
        {
          !flag ? <Button onClick={() => { setFlag(true); }}>探知開始</Button> : <GPSContent/>
        }
      </Container>
    </>
  )
}

export default App
