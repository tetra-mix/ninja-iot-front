import { useState } from 'react';
import { Button, Box, Text, Container, Center, Flex } from "@yamada-ui/react";
export const BluetoothBeacon = () => {
    const [beaconData, setBeaconData] = useState(null);
    const [distance, setDistance] = useState(null);

    // 距離計算のためのRSSIの値と推定距離の簡単なモデル
    const calculateDistance = (rssi) => {
        const txPower = -59; // 送信機の標準出力（dBm）
        if (rssi === 0) {
            return -1.0; // 無効な距離
        }

        const ratio = rssi * 1.0 / txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio, 10);
        } else {
            const distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
            return distance;
        }
    };

    const startScan = async () => {
        try {
            const scan = await navigator.bluetooth.requestLEScan({
                filters: [{ name: ["NINJAIOT_SINOBI"] }],
                keepRepeatedDevices: true,
            });

            navigator.bluetooth.addEventListener('advertisementreceived', event => {
                const { rssi } = event;
                const estimatedDistance = calculateDistance(rssi);
                setBeaconData({ rssi, distance: estimatedDistance });
                console.log(`RSSI: ${rssi} dBm, 推定距離: ${estimatedDistance.toFixed(2)} m`);
            });

            // 例: 30秒後にスキャンを停止
            setTimeout(() => {
                scan.stop();
                setScanning(false);
                console.log('スキャン停止');
            }, 30000);

        } catch (error) {
            console.error('Bluetoothデバイスとの接続に失敗しました: ', error);
        }
    };

    return (
        <Container fontFamily={"DotGothic16"}>
            <Center>
                <Text fontWeight={"bold"} text="2xl">設定</Text>
            </Center>
            <Flex w="full" mt="4" justifyContent="center">
                <Button onClick={startScan} colorScheme={"primary"}>iBeaconをスキャン</Button>
            </Flex>
            <Box mt="4">
                {beaconData ? (
                    <Box>
                        <Text>RSSI: {beaconData.rssi} dBm</Text>
                        <Text>推定距離: {distance ? `${distance.toFixed(2)} メートル` : '計測中'}</Text>
                    </Box>
                ) : (
                    <Text>iBeaconをスキャン中...</Text>
                )}
            </Box>
        </Container>
    );
};
