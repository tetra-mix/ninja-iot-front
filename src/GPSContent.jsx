import { useState, useEffect, useRef } from "react"
import { Box, Flex, Heading, Text, Button } from "@yamada-ui/react"
import { RelayServer } from "https://chirimen.org/remote-connection/js/beta/RelayServer.js";

export const GPSContent = () => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [detectStatus, setDetectStatus ] = useState("たぶんいない");
    const channelRef = useRef(null);

    const init = async () => {
        try {
            const relay = RelayServer("chirimentest", "chirimenSocket");
            const channel = await relay.subscribe("ninja-iot");
            channelRef.current = channel; // useRefに保存
            channel.onmessage = getMessage;
        } catch (err) {
            setError("Failed to initialize channel");
            console.error(err);
        }
    };

    const randomDetectStatus = () => {
        const rand = Math.floor(Math.random() * 4);
        if(rand == 0){
            setDetectStatus("そんなん知らん")
        }else if(rand == 1){
            setDetectStatus("たぶんいない")
        }else if(rand == 2){
            setDetectStatus("いそう！");
        }else if(rand == 3){
            setDetectStatus("ここにいる！")
        }
    }

    const getMessage = (msg) => {
        console.log(msg);
        setMessage(msg.data.toString());
    }

    const sendMessage = (data) => {
        if (channelRef.current) {
            channelRef.current.send(data); // 現在のchannelにデータを送信
            console.log("SEND:" + data);
        } else {
            setError("Channel is not initialized")
            console.error("Channel is not initialized");
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setError(null);
            },
            (err) => {
                setError(`Error: ${err.message}`);
            }
        );
    };

    useEffect(() => {
        init();

        const interval = setInterval(() => {
            getLocation();
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);


    return (
        <Box>
            <Heading fontFamily={"DotGothic16"} as="h2" p={16}>
                {detectStatus}
            </Heading>
            <Flex w="full" gap="md">
                <Button colorScheme={"secondary"} onClick={() => { sendMessage("LED ON"); }}>LEDを光らせる</Button>
                <Button colorScheme={"secondary"} onClick={() => { randomDetectStatus(); }}>ランダム</Button>
                <Button colorScheme={"secondary"} onClick={() => { window.location.reload(); }}>リセット</Button>
            </Flex>
            <Box>
                <Text>{message}</Text>
            </Box>
            <Box text="lg" pt={16}>
                <Text pb="2" text="2xl" fontWeight={"bolder"}>端末状態</Text>
                <Text pt="2" text="xl" fontWeight={"bolder"}>現在地</Text>
                <Flex w="full" gap="md">
                    <Text >緯度:{latitude.toString()}</Text>
                    <Text >軽度:{longitude.toString()}</Text>
                </Flex>
                <Text pt="2" text="xl" fontWeight={"bolder"}>動作状況</Text>
                {
                    error == null ?
                        <Text color="blue.500">正常</Text>
                        :
                        <Text color="red.500">{error}</Text>
                }
            </Box>

        </Box>
    );
}