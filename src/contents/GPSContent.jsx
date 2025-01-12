import { useState, useEffect, useRef } from "react"
import { Box, Flex, Text, Button, Center } from "@yamada-ui/react"
import { RelayServer } from "https://chirimen.org/remote-connection/js/beta/RelayServer.js";
import { Geodesic } from "geographiclib";
import Compass from "./Compass";

export const GPSContent = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [detectStatus, setDetectStatus] = useState("たぶんいない");
    const [detectColor, setDetectColor] = useState("warning.200");
    const [direction, setDirection] = useState(0);
    const [stopFunction, setStopFunction] = useState(null); // 停止用関数
    const [oniLat, setOniLat] = useState(0);
    const [oniLng, setOniLng] = useState(0);
    const [sinobiLat, setSinobiLat] = useState(0);
    const [sinobiLng, setSinobiLng] = useState(0);
    const headdingRef = useRef(0);
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


    const GPSDetect = () => {
        console.log(oniLat);
        console.log(oniLng);
        console.log(sinobiLat);
        console.log(sinobiLng);

        const distance = getDistance(oniLat, oniLng, sinobiLat, sinobiLng);
        const info = calculate(oniLat, oniLng, sinobiLat, sinobiLng);

        setMessage("距離: " + distance + " m");
        if (distance <= 10) {
            NumToDetect(4);
        } else if (distance <= 20) {
            NumToDetect(3);
        } else if (distance <= 30) {
            NumToDetect(2);
        } else if (distance <= 40) {
            NumToDetect(1);
        } else {
            NumToDetect(0);
        }

        const relativeHeading = (headdingRef.current - info.azi1 + 360) % 360;
        setDirection(relativeHeading)
    }

    function getDistance(latitude0,longitude0, latitude1,longitude1){
        var difLatM = (latitude1-latitude0) * 40000000 / 360;
        var difLngM = Math.cos(latitude0) * (longitude1-longitude0)* 40000000 / 360;
        var distance = Math.sqrt(difLatM * difLatM + difLngM * difLngM);
        return distance; // in meter
    }

    const calculate = (lat1, lng1, lat2, lng2) => {
        const geod = Geodesic.WGS84; // WGS84楕円体を使用
        const result = geod.Inverse(lat1, lng1, lat2, lng2); // 2地点間の情報を計算
        return result; // 距離（メートル単位）
    };

    const randomDetectStatus = () => {
        const rand = Math.floor(Math.random() * 4);
        console.log(rand);

        setDetectStatus(NumToDetect(rand));
        NumToDetect(rand);
    }

    const NumToDetect = (num) => {
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
        } else if (num == 4) {
            setDetectStatus("絶対にいる！");
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
        console.log(msg.data);

        if (msg.data.role){
            if(msg.data.role == "sinobi"){
                setSinobiLat(msg.data.lat);
                setSinobiLng(msg.data.lon);
            }else if(msg.data.role == "oni"){
                setOniLat(msg.data.lat);
                setOniLng(msg.data.lon);
            }
        }

        if (msg.data == "WAZA") {
            wazaStart();
        }
        if (msg.data == "SAFE") {
            handleStart();
        }
        if (msg.data == "DANGER") {
            handleStop();
        }

    }
    
    /*
    const sendMessage = (data) => {
        if (channel) {
            channel.send(data); // 現在のchannelにデータを送信
            console.log("SEND:" + data);
        } else {
            setError("接続チャンネルが初期化されていません")
            console.error("Channel is not initialized");
        }
    };
    */

    const startSpinning = () => {
        const duration = 30 * 1000; // 30秒
        const rotationSpeed = 500; // 1回転にかかる時間（ms）
        const startTime = Date.now();
        let intervalId;

        // アニメーションを開始
        const runAnimation = () => {
            intervalId = setInterval(() => {
                setError("忍が隠れ身の術を使いました");
                const elapsed = Date.now() - startTime;
                if (elapsed >= duration) {
                    clearInterval(intervalId); // 30秒経過で停止
                    setError(null);
                    return;
                }
                const newAngle = (elapsed / rotationSpeed) * 360; // 回転角度計算
                setDirection(newAngle % 360); // 360度でループ
            }, 16); // 更新間隔（16ms ≈ 60fps）
        };

        // アニメーションを実行
        runAnimation();

        // 停止用の関数を返す
        return () => clearInterval(intervalId);
    };

    const wazaStart = () => {
        const duration = 30 * 1000; // 30秒
        const rotationSpeed = 500; // 1回転にかかる時間（ms）
        const startTime = Date.now();
        let intervalId;

        // アニメーションを開始
        const runAnimation = () => {
            intervalId = setInterval(() => {
                randomDetectStatus();
                setError("忍が分身の術を使いました");
                const elapsed = Date.now() - startTime;
                if (elapsed >= duration) {
                    clearInterval(intervalId); // 30秒経過で停止
                    setError(null);
                    return;
                }
                const newAngle = (elapsed / rotationSpeed) * 360; // 回転角度計算
                setDirection(newAngle % 360); // 360度でループ
            }, 32); // 更新間隔（16ms ≈ 60fps）
        };

        // アニメーションを実行
        runAnimation();

        // 停止用の関数を返す
        return () => clearInterval(intervalId);
    }

    const handleStart = () => {
        if (stopFunction) {
            stopFunction(); // 既存の回転を停止
        }
        const stop = startSpinning(); // 新しい回転を開始
        setStopFunction(() => stop); // 停止用関数を保存
    };

    const handleStop = () => {
        if (stopFunction) {
            stopFunction(); // 現在の回転を停止
            setStopFunction(null); // 停止関数をリセット
        }
    };

    /*
    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('ブラウザで位置情報の許可をしてください。');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                oniLat = position.coords.latitude;
                oniLng = position.coords.longitude;
                setError(null);
            },
            (err) => {
                setError(`Error: ${err.message}`);
            }
        );
    };*/

    useEffect(() => {
        init();
        const interval = setInterval(() => {
            //sendMessage("GET GPS");
            //getLocation();
            GPSDetect();

        }, 4000);

        const handleOrientation = (event) => {
            const alpha = event.alpha; // 0〜360°: デバイスの真北からの角度
            headdingRef.current = alpha;
            if (alpha !== null) {
                headdingRef.current = alpha;
            } else {
                setError('方位センサーがサポートされていません。');
            }
        };

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 14以上の場合は許可をリクエスト
            DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation, true);
                    } else {
                        setError('センサーのアクセス許可が必要です。');
                    }
                })
                .catch((error) => {
                    setError('アクセスのリクエストに失敗しました。');
                });
        } else {
            // iOS 13以下の場合、または許可が不要な場合
            window.addEventListener('deviceorientation', handleOrientation, true);
        }

        return () => {
            clearInterval(interval);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return (
        <Box>
            <Box pt="4" pb="4">
                <Center>
                    <Text color={detectColor} className="detect" fontFamily={"DotGothic16"} text={"5xl"} fontWeight={"bold"}>{detectStatus}</Text>
                </Center>
                <Center>
                    <Text text="md">{message}</Text>
                </Center>
                <Compass direction={direction} />
            </Box>
            <Box text="lg" mt={2} p={4} borderRadius={"2xl"} border={"solid"} borderColor="success.500">
                <Center>
                    <Text pb="2" text="xl" fontWeight={"bolder"}>端末状態</Text>
                </Center>
                <Flex w="full" gap="sm">
                    <Text pr="4" text="xl" fontWeight={"bolder"}>鬼</Text>
                    <Text >緯度:{FloatToString(oniLat)}</Text>
                    <Text >経度:{FloatToString(oniLng)}</Text>
                </Flex>
                <Flex w="full" gap="sm">
                    <Text pr="4" text="xl" fontWeight={"bolder"}>忍</Text>
                    <Text >緯度:{FloatToString(sinobiLat)}</Text>
                    <Text >経度:{FloatToString(sinobiLng)}</Text>
                </Flex>
                <Text pt="2" text="xl" fontWeight={"bolder"}>動作状況</Text>
                {
                    error == null ?
                        <Text color="blue.300">正常</Text>
                        :
                        <Text color="red.500">{error}</Text>
                }
            </Box>
            <Flex mt="4" w="full" gap="md" align="center" justify="center">
                <Button colorScheme={"secondary"} onClick={() => { window.location.reload(); }}>リセット</Button>
            </Flex>
        </Box>
    );
}