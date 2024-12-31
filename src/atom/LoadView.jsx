import { Box, Center, Loading, Heading } from "@yamada-ui/react";
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useEffect } from "react";

export const LoadView = () => {
    useEffect(() => {
        gsap.registerPlugin(TextPlugin);
        setAnimation();
    }, []);

    const setAnimation = () => {
        gsap.to(".load", {
            duration: 2, //アニメーション時間（秒）
            text: {
                value: "Now Loading ...", //表示するテキスト
                delimiter: "",  //区切り文字
            },
            ease: "ease",  // アニメーションのタイミング・進行割合を指定する
        })
    }

    return (
        <Box pt="32">
            <Center>
                <Loading fontSize="9xl"></Loading>
            </Center>
            <Center pt={4}>
                <Heading className="load" fontFamily={"DotGothic16"} as="h3"></Heading>
            </Center>
        </Box>
    );
}