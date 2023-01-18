import React, {useCallback, useEffect, useState, useRef } from "react";
import * as PIXI from 'pixi.js';
import * as PIXISPINE from 'pixi-spine';
import { Spine } from 'pixi-spine';
import { Button, Box, Grid, Stack, Typography } from '@mui/material';



export function getExpressionValue(expressionValues, expressionName, expressionAttributeName) {
    return String(expressionValues?.find((expressionVal) => expressionVal?.expression?.expressionName === expressionName && expressionVal?.expressionAttribute?.expressionAttributeName === expressionAttributeName)?.value);
}

export function parseNFT(nft, expression) {
    if (!nft) {
        return { parsedJson: null, parsedAtlas: null, parsedPng: null}
    }
    const parsedJson = getExpressionValue(nft.expressionValues || [], expression, 'JSON');
    const parsedAtlas = getExpressionValue(nft.expressionValues || [], expression, 'Atlas');
    const parsedImage = getExpressionValue(nft.expressionValues || [], expression, 'PNG');
    return { 
        parsedJson, 
        parsedAtlas,
        parsedImage, 
    };
}

export function setNewSlotImage(spine, slotName, texture) {
    if(!texture) {
      spine.hackTextureBySlotName(slotName, PIXI.Texture.EMPTY);
      return;
    }
    if(texture.baseTexture) {
      spine.hackTextureBySlotName(slotName, texture);
    } else {
      const baseTex = new PIXI.BaseTexture(texture);
      const tex = new PIXI.Texture(baseTex);
      spine.hackTextureBySlotName(slotName, tex);
    }
  }

export function playAnimation(animationName, spine, looped= true) {
    if (!spine || !animationName) {
        return;
    }
    if (spine.state?.hasAnimation(animationName)) {
        spine.state.setAnimation(0, animationName, looped);
        spine.state.timeScale = 1;
    } else {
        console.log('animation not found');
    }
}



export default function PixiNFT({ 
    assetlayerNFT,  // the nft you receive from assetlayer requests
    expression,  // choose the expression(Name) that should be displayed
    defaultAnimation, // animation name that will be played loop on start, leave undefined to not animate at start.
    showAnimations,  // displays buttons on the left or right of the container that can trigger the animations of the chosen expression of your nft
    animationAlign,  // 'right' or 'left' to choose if the animationbuttosn should be displayed right or left of the container. If left undefined, it will be displayed left.
    nftSizePercentage, // value from 0-100 to choose how much of the container the nft spine should fill. It will be size of height or width depending on spine ratios and container ratios, default is 75 to leave some space for your animations to be inside of the canvas
    onLoaded, // (spine)=>void will be called once the spine is loaded and have the spine as parameter, use the spine i.e. to call animations manually
    }) { 

    const container = useRef();
    const animationContainer = useRef();

    const [app, setApp] = useState(null);
    const [nftLoaded, setNftLoaded] = useState(false);

    const [spineJson, setSpineJson] = useState(null);
    const [spineAtlas, setSpineAtlas]  = useState(null);
    const [spinePng, setSpinePng] = useState(null);

    const [spine, setSpine] = useState(null);

    const [animations, setAnimations] = useState([]);
    const [animationButtons, setAnimationButtons] = useState(null);
    const [currentAnimation, setCurrentAnimation] = useState(null);

    const [canvasWidth, setCanvasWidth] = useState(800);
    const [canvasHeight, setCanvasHeight] = useState(800);



    

    useEffect(()=>{
        const { parsedJson, parsedAtlas, parsedImage } = parseNFT(assetlayerNFT, expression);
        if (parsedJson) {
            // setSpineJson('jsonNamehere.json'); // setting this do a local copy of any nfts, they are not nft specific, only the image is
            setSpineJson(parsedJson);  // using the parse Json from the nft.
        }
        if (parsedAtlas) {
            // setSpineAtlas('atlasNamehere.atlas');  // setting this do a local copy of any nfts, they are not nft specific, only the image is
            setSpineAtlas(parsedAtlas); // using the parse Atlas from the nft.
        }
        if (parsedImage) {
            setSpinePng(parsedImage); 
        }
    

    }, [assetlayerNFT, expression])


    useEffect(()=>{
            setApp(new PIXI.Application({ forceCanvas: true, backgroundAlpha: 0, width: container?.current?.clientWidth || 800, height: container?.current?.clientHeight || 800  }))      
    }, [])

    const handleResize = useCallback(() =>{
        if(!app) {
            return;
        }
        const parent = container.current.parentElement;
        app.resizeTo = parent;
        app.resize();
        setCanvasWidth(app.view.clientWidth); // will trigger resize of spine in useEffect
        setCanvasHeight(app.view.clientHeight);
    }, [app]);

    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        handleResize();
        return ()=>{window.removeEventListener('resize', handleResize)}
        
      }, [handleResize]);


    useEffect(()=>{
        setNftLoaded(false);
    }, [spineJson, spineAtlas, spinePng])

    useEffect(()=>{
        if (app && app.view) {
            container.current.appendChild(app.view);
            handleResize();
        }
    }, [app])


    const adjustSizeOfSpine = useCallback((externalSpine)  => {
        const spineToAdjust = externalSpine?externalSpine:spine; // passing an external spine is optional
        if (!spineToAdjust || !canvasHeight || !canvasWidth) {
            return;
        }
        const ratio = spineToAdjust.width / spineToAdjust.height;
        const canvasRatio = canvasWidth / canvasHeight;

        if (ratio < canvasRatio) { 
            spineToAdjust.height = canvasHeight * (nftSizePercentage || 75) * 0.01; //leaving space for animations to not go over the container 
            spineToAdjust.width = ratio * spineToAdjust.height;
        } else {
            spineToAdjust.width = canvasWidth * (nftSizePercentage || 75) * 0.01; //leaving space for animations to not go over the container 
            spineToAdjust.height = spineToAdjust.width / ratio;
        }
        spineToAdjust.x = (canvasWidth/ 2);
        spineToAdjust.y = (canvasHeight / 2) + spineToAdjust.height / 2;
    }, [spine, canvasHeight, canvasWidth]);

    useEffect(()=>{
        adjustSizeOfSpine();
    }, [adjustSizeOfSpine])

    useEffect(()=>{
        if (app && app?.view) {
            if (!nftLoaded && spineJson && spineAtlas && spinePng) {
                loadPixiNFT();
            }
            
        }
    }, [app, app?.view, spineJson, spineAtlas, spinePng, nftLoaded])

    useEffect(()=>{
        if(animations && animations.length > 0) {
            const fontSize = '12px';
            const animationButtons = 
            <Grid container sx={{height: '100%', overflow: 'auto'}}>
                <Grid item xs={12}><Typography sx={{fontSize}}>Animations: </Typography></Grid>
                {animations.map((animation) =>
                    <React.Fragment key={animation}>
                        <Grid item xs={12} sx={{padding: 1}}>
                            <Button variant='contained' sx={{color: 'black', fontSize, width: '100%'}} onClick={()=>{setCurrentAnimation(animation)}}>{animation}</Button>
                        </Grid>
                    </React.Fragment>)
                }
            </Grid>
            
            setAnimationButtons(animationButtons);
        }
    }, [animations, canvasWidth])

    useEffect(()=>{
        playAnimation(currentAnimation, spine, true);
    }, [currentAnimation, spine])


    function clearStage() {
        for (let i = app.stage.children.length - 1; i >= 0; i--) {	
            app.stage.removeChild(app.stage.children[i]);
        };
    }
    
    function parseAnimations(spineData) {
        try {
            const parsedAnimations = [];
            spineData.animations.forEach((animation)=>{
                parsedAnimations.push(animation.name);
            })
            return parsedAnimations;
        } catch(e) {
            console.log('animation parsing error: ', + e.message)
            return [];
        }
        
    }

    function resourcesLoaded (loader, resources) {
        const nftSpine = new PIXISPINE.Spine(resources[(assetlayerNFT.nftId + expression)].spineData);
        if (nftSpine) {
            adjustSizeOfSpine(nftSpine);
            app.stage.addChild(nftSpine); 
            setAnimations(parseAnimations(nftSpine.spineData));
            setNftLoaded(true);
            setSpine(nftSpine);
            setCurrentAnimation(defaultAnimation);
        }
        }

    async function loadPixiNFT() {
        clearStage();
        const texture = await PIXI.Texture.fromURL(spinePng);
        let spineLoaderOptions = { metadata: { 
                    spineAtlasFile: spineAtlas,
                    image: texture }}; 
        // now load json skeleton
        if(!app.loader.resources[(assetlayerNFT.nftId + expression)]) {
            app.loader.add((assetlayerNFT.nftId + expression), spineJson , spineLoaderOptions);
            app.loader.load(resourcesLoaded);
        } else {
            resourcesLoaded(app.loader, app.loader.resources);
        }
    
  
    }

    useEffect(()=>{
        if (nftLoaded && spine) {
            onLoaded(spine);
        }
    } ,[nftLoaded, spine]);

        return (
           <>
           {showAnimations && 
            <Box ref={animationContainer} 
                sx={{
                    position: 'absolute', 
                    top: 0, 
                    left: animationAlign !== 'right'?'-200px':undefined, 
                    right: animationAlign === 'right'?'-200px':undefined, 
                    width: '200px', 
                    height: container.current?.offsetHeight || 0,
                }}
                    
            >
                {animationButtons}
            </Box>}
            <Box sx={{width: '100%', height:'100%'}}>
                <Box sx={{}} ref={container}></Box>
            </Box>
           </>
    )
}
