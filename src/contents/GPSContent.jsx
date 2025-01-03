import { useState, useEffect, useRef } from "react"
import { Box, Flex, Heading, Text, Button, Center } from "@yamada-ui/react"
import { RelayServer } from "https://chirimen.org/remote-connection/js/beta/RelayServer.js";


export const GPSContent = () => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const [detectStatus, setDetectStatus] = useState("たぶんいない");
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
            setDetectStatus("そんなん知らん");
            setDetectColor("danger.200");
        } else if (num == 1) {
            setDetectStatus("たぶんいない");
            setDetectColor("warning.200");
        } else if (num == 2) {
            setDetectStatus("いるっぽい！");
            setDetectColor("success.200");
        } else if (num == 3) {
            setDetectStatus("ここにいる！");
            setDetectColor("primary.200");
        }

        // クリップボードにあるbase64文字列を貼り付けます
        var base64 = "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"
        // datauri scheme 形式にして Audio オブジェクトを生成します
        var sound = new Audio("data:audio/wav;base64," + base64);
        sound.play();
        navigator.vibrate(200);
    }

    const FloatToString = (num) => {
        const rounded = parseFloat(num.toFixed(5));
        return rounded.toString();
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
            <Center pt="4" pb="8">
                <Text color={detectColor} className="detect" fontFamily={"DotGothic16"} text={"5xl"} fontWeight={"bold"}>{detectStatus}</Text>
            </Center>
            <Flex w="full" gap="md">
                <Button colorScheme={"secondary"} onClick={() => { sendMessage("LED ON"); }}>LEDを光らせる</Button>
                <Button colorScheme={"secondary"} onClick={() => { randomDetectStatus(); }}>ランダム</Button>
                <Button colorScheme={"secondary"} onClick={() => { window.location.reload(); }}>リセット</Button>
            </Flex>
            <Box>
                <Text>{message}</Text>
            </Box>
            <Box text="lg" mt={8} p={4} borderRadius={"2xl"} border={"solid"} borderColor="success.500">
                <Center>
                    <Text pb="2" text="xl" fontWeight={"bolder"}>端末状態</Text>
                </Center>
                <Text pt="2" text="xl" fontWeight={"bolder"}>現在地</Text>
                <Flex w="full" gap="md">
                    <Text >緯度:{FloatToString(latitude)}</Text>
                    <Text >軽度:{FloatToString(longitude)}</Text>
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