import React from 'react';
import { Box, VStack } from '@yamada-ui/react';

const Compass = ({ direction }) => {

    return (
        <VStack spacing="4" align="center" pt="6">
            {/* Compass Circle */}
            <Box
                w="120px"
                h="120px"
                borderWidth="8px"
                borderColor="gray.600"
                borderRadius="full"
                position="relative"
            >
                {/* Needle indicating target */}
                <Box
                    w="5px"
                    h="60px"
                    bg="blue.500"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform={`translate(-50%, -100%) rotate(${direction}deg)`}
                    transformOrigin="bottom"
                    borderRadius="md"
                />
            </Box>
        </VStack>
    );
};

export default Compass;
