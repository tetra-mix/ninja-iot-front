import { Box, Center, Loading, Heading } from "@yamada-ui/react";

export const LoadView = () => {

    return (
        <Box pt="32">
            <Center>
                <Loading fontSize="9xl"></Loading>
            </Center>
            <Center>
                <Heading fontFamily={"DotGothic16"} as="h3">Now Loading</Heading>
            </Center>
        </Box>
    );
}