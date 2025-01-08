import { Center, Text, Box, DiscList, For, ListItem } from "@yamada-ui/react";

export const Top = ({children}) => {
    return (
        <>
            <Box pt="4">
                <Center>
                    <Text fontWeight={"bold"} text="2xl">NinjaかくれんぼIOT</Text>
                </Center>
                <Center>
                    <Text fontWeight={"bold"} text="md">=プレイヤー検知システム=</Text>
                </Center>
            </Box>
            <Box>
                <Center>
                    <Text color="warning.500" fontWeight={"bold"} text="lg">注意：</Text>
                </Center>
                <DiscList>
                    <For
                        each={[
                            "音がなるので音量を最小にしてください。",
                            "位置情報機能をオンにしてください。",
                            "プレイヤーとの近さが表示されます。",
                            "楽しみましょう!"
                        ]}
                    >
                        {(text, index) => <ListItem fontSize="sm" key={index}>{text}</ListItem>}
                    </For>
                </DiscList>
            </Box>
            {
                children
            }
        </>
    );
}