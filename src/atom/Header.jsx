import { Container, Center,Text } from "@yamada-ui/react";

export const Header = () => {
    return (
        <Container borderBottom="solid" borderBottomColor={"primary.500"} >
            <Center>
                <Text fontFamily={"DotGothic16"} fontWeight={"bold"} colorScheme={"primary"} as="h1" text="2xl">プレイヤー検知システム</Text>
            </Center>
        </Container>
    );
}