import { Container, Center, Text } from "@yamada-ui/react";

export const Footer = () => {
    return (
        <Container p="2" m="0" className="footer" borderTop="solid" borderColor={"primary.500"} >
            <Center>
                <Text fontSize="sm" fontFamily={"DotGothic16"} colorScheme={"primary"}>NinjaかくれんぼIOT</Text>
            </Center>
        </Container>
    );
}