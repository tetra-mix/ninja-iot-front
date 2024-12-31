import { Container, Center, Heading } from "@yamada-ui/react";

export const Header = () => {
    return (
        <Container borderBottom="solid" borderBottomColor={"primary.500"} >
            <Center>
                <Heading fontFamily={"DotGothic16"} colorScheme={"primary"} as="h1">プレイヤー検知システム</Heading>
            </Center>
        </Container>
    );
}