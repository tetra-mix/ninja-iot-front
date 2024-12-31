import { useState, useEffect, useRef } from "react"
import { Box, Flex, Heading, Text, Button, Center } from "@yamada-ui/react"
import { RelayServer } from "https://chirimen.org/remote-connection/js/beta/RelayServer.js";
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'


export const GPSContent = () => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const detectStatus = useRef("たぶんいない");
    const [detectColor, setDetectColor] = useState("warning.200");
    const channelRef = useRef(null);

    const init = async () => {
        try {
            const relay = RelayServer("chirimentest", "chirimenSocket");
            const channel = await relay.subscribe("ninja-iot");
            channelRef.current = channel; // useRefに保存
            channel.onmessage = getMessage;
        } catch (err) {
            setError("チャンネルの初期化に失敗しました");
            console.error(err);
        }
    };

    const randomDetectStatus = () => {
        const rand = Math.floor(Math.random() * 4);
        NumToDetext(rand);
    }

    const NumToDetext = (num) => {
        if (num == 0) {
            detectStatus.current = "そんなん知らん";
            setDetectColor("danger.200");
        } else if (num == 1) {
            detectStatus.current = "たぶんいない";
            setDetectColor("warning.200");
        } else if (num == 2) {
            detectStatus.current = "いるっぽい！";
            setDetectColor("success.200");
        } else if (num == 3) {
            detectStatus.current = "ここにいる！";
            setDetectColor("primary.200");
        }
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(200);
        }
        setAnimation();
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
            setError("接続チャンネルが初期化されていません")
            console.error("Channel is not initialized");
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('ブラウザで位置情報の許可をしてください。');
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

    const setAnimation = () => {
        gsap.to(".detect", {
            duration: 2, //アニメーション時間（秒）
            text: {
                value: detectStatus.current.toString(), //表示するテキスト
                delimiter: "",  //区切り文字
            },
            ease: "ease",  // アニメーションのタイミング・進行割合を指定する
        })
    }

    useEffect(() => {
        init();
        gsap.registerPlugin(TextPlugin);
        setAnimation();
        const interval = setInterval(() => {
            getLocation();
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <Box>
            <Heading color={detectColor} className="detect" fontFamily={"DotGothic16"} as="h2" p={16}></Heading>
            <Flex w="full" gap="md">
                <Button colorScheme={"secondary"} onClick={() => { sendMessage("LED ON"); }}>LEDを光らせる</Button>
                <Button colorScheme={"secondary"} onClick={() => { randomDetectStatus(); }}>ランダム</Button>
                <Button colorScheme={"secondary"} onClick={() => { window.location.reload(); }}>リセット</Button>
            </Flex>
            <Box>
                <Text>{message}</Text>
            </Box>
            <Box text="lg" mt={16} p={4} borderRadius={"2xl"} border={"solid"} borderColor="success.500">
                <Center>
                    <Text pb="2" text="xl" fontWeight={"bolder"}>端末状態</Text>
                </Center>
                <Text pt="2" text="xl" fontWeight={"bolder"}>現在地</Text>
                <Flex w="full" gap="md">
                    <Text >緯度:{latitude.toString()}</Text>
                    <Text >軽度:{longitude.toString()}</Text>
                </Flex>
                <Text pt="2" text="xl" fontWeight={"bolder"}>動作状況</Text>
                {
                    error == null ?
                        <Text color="blue.300">正常</Text>
                        :
                        <Text color="red.500">{error}</Text>
                }
            </Box>

        </Box>
    );
}