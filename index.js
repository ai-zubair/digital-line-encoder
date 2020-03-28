const appBanner            =    document.getElementById('appBanner');
const nextButton           =    document.getElementById('nextButton');
const bannerText           =    document.getElementById('bannerText');
const signalLength         =    document.getElementById('signalLength');
const signalParams         =    document.getElementById('signalParams');
const signalParamsButton   =    document.getElementById('signalParamsButton');
const signalData           =    document.getElementById('signalData');
const signalDataButton     =    document.getElementById('signalDataButton');
const signalBitStream      =    document.getElementById('signalBitStream');
const encodingMonitor      =    document.getElementById('encodingMonitor');
const loaderWrapper        =    document.getElementById('loaderWrapper');
const loaderText           =    document.getElementById('loaderText');
const encoderWrapper       =    document.getElementById('encoderWrapper');
const encoderOutputs       =    document.getElementById('encoderOutputs');
const signalStream         =    document.getElementById('signalStream');
const signalStreamBits     =    document.getElementById('signalStreamBits');
const nrzlSignal           =    document.getElementById('NRZL');
const nrziSignal           =    document.getElementById('NRZI');
const rzSignal             =    document.getElementById('R2ZS');
const manchesterSignal     =    document.getElementById('MANC');
const differMancSignal     =    document.getElementById('DMAN');
const amiSignal            =    document.getElementById('AMIS');


/* service worker for offline GOOGLE FONT support */
navigator.serviceWorker.register('serviceWorker.js').then(serviceWorkerRegistration=>{
    console.log("Service worker registered!");
})


setTimeout(()=>{
    removeClass(appBanner,"hideAppBanner");
    addClass(appBanner,'showAppBanner');
    setTimeout(() => {
        textAnimator.decryptText(bannerText,'DIGITAL-LINE-ENCODER')
    }, 450); 
    setTimeout(()=>{
        removeClass(nextButton,'nextButtonHide')
        addClass(nextButton,'nextButtonShow')
    },2000) 
},1000)

document.addEventListener('click',(event)=>{
    if(event.target.className === 'viewCheckBoxes'){
        console.log("hit");
        // debugger;
        const clickedCheckBoxID = event.target.getAttribute('id');
        const encodingSchemeName = clickedCheckBoxID.substring(0,4);
        const encodingScheme = document.getElementById(encodingSchemeName);
        if(event.target.checked === true){
            encodingScheme.style.opacity = 0;
        }else{
            encodingScheme.style.opacity = 1;
        }
    }
})

nextButton.addEventListener('click',(event)=>{
    event.preventDefault();
    appBanner.style.transition = "all 1s ease"
    appBanner.style.transform = "translateX(-1300px)"
    removeClass(signalParams,'hide');
    addClass(signalParams,'show');
    setTimeout(() => {
        addClass(appBanner,'hide');
        signalParams.style.transform = "translateX(0px)"
    }, 500);
    setTimeout(() => {
        removeClass(signalParamsButton,'nextButtonHide')
        addClass(signalParamsButton,'nextButtonShow')
    }, 3000);
})

signalParams.addEventListener('submit',(event)=>{
    event.preventDefault();
    const signalBitLength = signalLength.value;
    if(isValidSignalLength(signalBitLength)){
        signalParams.style.transform = "translateX(-1300px)";
        removeClass(signalData,'hide');
        addClass(signalData,'showSignalData');
        createSignalBitInputs(signalBitStream,signalBitLength);
        setTimeout(() => {
            removeClass(signalParams,'show')
            addClass(signalParams,'hide');
            signalData.style.transform = "translateX(0px)"
        }, 500);
        setTimeout(() => {
            removeClass(signalDataButton,'nextButtonHide')
            addClass(signalDataButton,'nextButtonShow')
        }, 3000);
        
    }
})

let signalBitsGlobal;
signalData.addEventListener('submit',(event)=>{
    event.preventDefault();
    const signalBits = extractSignalBits(signalBitStream.childNodes);
    signalBitsGlobal = signalBits;
    if(isValidSignal(signalBits)){
        signalData.style.transform = "translateX(-1300px)";
        removeClass(encodingMonitor,'hide');
        setTimeout(() => {
            removeClass(signalData,'showSignalData');
            addClass(signalData,'hide');
            addClass(encodingMonitor,'showLoaderOnly');
            encodingMonitor.style.transform = "translateX(0px)"
            showMonitorLoaderStatuses();
        }, 500);
    }
})

function showMonitorLoaderStatuses(){
    const loaderStatuses = ["Checking Power Systems...","Validating Input Signals...","Cleaning Up Stale Data...","Initializing Encoders..."]
    for (let i = 0; i < loaderStatuses.length; i++) {
        setTimeout(()=>{
            loaderText.innerText = loaderStatuses[i];
        },(2*(i+1))*1000)
    }
    setTimeout(()=>{
        hideLoaderAndShowGrid();
    },11000)
}

function hideLoaderAndShowGrid(){
    removeClass(signalStream,'hide');
    addClass(signalStream,"signalStream");
    removeClass(loaderWrapper,"showLoader");
    addClass(loaderWrapper,"hide");
    removeClass(encodingMonitor,"showLoaderOnly");
    addClass(encoderWrapper,"showEncoderGrids");
    generateVerticalDashBars(encoderOutputs,signalBitsGlobal.length)
    generateHorizontalDashBars(encoderOutputs,6)
    generateHoriontalSeparators(encoderOutputs,5)
    for (let i = 0; i < signalBitsGlobal.length; i++) {
        const signalBit = document.createElement('div');
        signalBit.innerText = signalBitsGlobal[i];
        signalBit.className = 'indSignalBit';
        signalBit.style.flexBasis = `${(100/signalBitsGlobal.length)}%`;
        signalStreamBits.appendChild(signalBit);
        
    }
    setTimeout(() => {
        drawNRZLSignal(nrzlSignal,signalBitsGlobal);
    }, 1000);
    setTimeout(() => {
        drawNRZISignal(nrziSignal,signalBitsGlobal);
    }, 2500);
    setTimeout(() => {
        drawRZSignal(rzSignal,signalBitsGlobal);
    }, 4000);
    setTimeout(() => {
        drawManchesterSignal(manchesterSignal,signalBitsGlobal);
    }, 5500);
    setTimeout(() => {
        drawDiffManchesterSignal(differMancSignal,signalBitsGlobal);
    }, 7000);
    setTimeout(() => {
        drawAMISignal(amiSignal,signalBitsGlobal);
    }, 8500);
}

let signalVerticalOffset;
function generateHorizontalDashBars(container,totalEncodingSchemes){
    const eachEncoderHeight = Math.floor(container.offsetHeight/totalEncodingSchemes);
    const horizontalBarOffset = Math.floor(eachEncoderHeight/2);
    signalVerticalOffset = horizontalBarOffset;
    for (let i = 0; i < totalEncodingSchemes; i++) {
        const horizontalBar = document.createElement('hr');
        horizontalBar.className = 'encoderOutputHorizontalBars';
        horizontalBar.style.top = `${(2*i+1)*horizontalBarOffset+i}px`;
        container.appendChild(horizontalBar);
        
    }
}

let signalHorizontalOffset;
function generateVerticalDashBars(container,totalSignalBits){
    const containerWidth = container.offsetWidth;
    const verticalBarGap = Math.floor(containerWidth/totalSignalBits);
    signalHorizontalOffset = verticalBarGap;

    for (let i = 0; i < totalSignalBits-1; i++) {
        const verticalBar = document.createElement('hr');
        verticalBar.className = 'encoderOutputVerticalBars';
        verticalBar.style.left = `${i*verticalBarGap+verticalBarGap-11}px`; //-11px added to set the first vertical bar at 0,0 of the canvases and remove the signal h-line error
        container.appendChild(verticalBar);
        
    }
}

function generateHoriontalSeparators(container, separators){
    const separatorOffset = [2*signalVerticalOffset,4*signalVerticalOffset,6*signalVerticalOffset,8*signalVerticalOffset,10*signalVerticalOffset];
    for (let i = 0; i < separators; i++) {
        const horizontalSeparator = document.createElement('hr');
        horizontalSeparator.className = 'horizontalSeparator';
        horizontalSeparator.style.top = `${separatorOffset[i]+2*i}px`;
        container.appendChild(horizontalSeparator);
    }
}

function insertDigitalSignal(container,signalBits){

    const ctx = container.getContext('2d');
    setAttributes(container,{
        height: container.offsetHeight,
        width: container.offsetWidth
    })

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#33ff00';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();

    let xCord = 0;
    let yCord = 0;
    if( signalBits[0] === '1' ){
        yCord = 10;
        ctx.moveTo(xCord,yCord);
    }else{
        yCord = signalVerticalOffset;
        ctx.moveTo(xCord,yCord);
    }
    ctx.lineTo(xCord+signalHorizontalOffset,yCord);
    console.log(signalHorizontalOffset,signalVerticalOffset);
    xCord += signalHorizontalOffset;
    for (let i = 1; i < signalBits.length; i++) {
    
        if( signalBits[i-1] !== signalBits[i] ){   //draw a vertical line
            if( signalBits[i-1] === '0' && signalBits[i] === '1' ){
                ctx.lineTo(xCord,10);
                yCord = 10;
            }else{
                ctx.lineTo(xCord,signalVerticalOffset);
                yCord = signalVerticalOffset;
            }
        }
        
        ctx.lineTo(xCord+signalHorizontalOffset,yCord);
        xCord += signalHorizontalOffset;
    }
    ctx.stroke();
    
}

function drawNRZLSignal(container,signalBits){
    const ctx = container.getContext('2d');
    setAttributes(container,{
        height: container.offsetHeight,
        width: container.offsetWidth
    })

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#33ff00';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();

    let xCord = 0;
    let yCord = 0;
    if( signalBits[0] === '0' ){
        yCord = 10;
        ctx.moveTo(xCord,yCord);
    }else{
        yCord = 2*signalVerticalOffset-10;
        ctx.moveTo(xCord,yCord);
    }
    ctx.lineTo(xCord+signalHorizontalOffset,yCord);
    xCord += signalHorizontalOffset;
    for (let i = 1; i < signalBits.length; i++) {
    
        if( signalBits[i-1] !== signalBits[i] ){   //draw a vertical line
            if( signalBits[i-1] === '1' && signalBits[i] === '0' ){
                ctx.lineTo(xCord,10);
                yCord = 10;
            }else{
                ctx.lineTo(xCord,2*signalVerticalOffset-10);
                yCord = 2*signalVerticalOffset-10;
            }
        }
        
        ctx.lineTo(xCord+signalHorizontalOffset,yCord);
        xCord += signalHorizontalOffset;
    }
    ctx.stroke();

}

function drawNRZISignal(container,signalBits){
    const ctx = container.getContext('2d');
    setAttributes(container,{
        height: container.offsetHeight,
        width: container.offsetWidth
    })

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#33ff00';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    let xCord = 0;
    let yCord = 0;
    if( signalBits[0] === '0' ){
        yCord = 10;
        ctx.moveTo(xCord,yCord);
    }else{
        yCord = 10;
        ctx.moveTo(xCord,yCord);
        yCord = 2*signalVerticalOffset-10;
        ctx.lineTo(xCord,yCord);
    }
    ctx.lineTo(xCord+signalHorizontalOffset,yCord);
    xCord += signalHorizontalOffset;
    for (let i = 1; i < signalBits.length; i++) {
        if( signalBits[i] === '1' ){ //draw a vertical line
            if(yCord === 10){
                yCord = 2*signalVerticalOffset-10;
            }else{
                yCord = 10;
            }
            ctx.lineTo(xCord,yCord)
        }
        ctx.lineTo(xCord+signalHorizontalOffset,yCord);
        xCord += signalHorizontalOffset;
    }
    ctx.stroke();

}
function drawRZSignal(container,signalBits){
    const ctx = container.getContext('2d');
    setAttributes(container,{
        height: container.offsetHeight,
        width: container.offsetWidth
    })

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#33ff00';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    let xCord = 0;
    let yCord = 0;
    if( signalBits[0] === '0' ){
        yCord = 2*signalVerticalOffset-10;
        
    }else{
        yCord = 10;
        
    }
    ctx.moveTo(xCord,yCord);
    xCord += (signalHorizontalOffset/2);
    ctx.lineTo(xCord,yCord);
    yCord = signalVerticalOffset;
    ctx.lineTo(xCord,yCord);
    xCord += (signalHorizontalOffset/2);
    ctx.lineTo(xCord,yCord);
    for (let i = 1; i < signalBits.length; i++) {
        if( signalBits[i] === '1' ){ //draw a vertical line
            yCord = 10;
            ctx.lineTo(xCord,yCord);
        }else{
            yCord = 2*signalVerticalOffset-10;
            ctx.lineTo(xCord,yCord);
        }
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
        yCord = signalVerticalOffset;
        ctx.lineTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
    }
    ctx.stroke();

}
function drawManchesterSignal(container,signalBits){
    const ctx = container.getContext('2d');
    setAttributes(container,{
        height: container.offsetHeight,
        width: container.offsetWidth
    })

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#33ff00';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();

    let xCord = 0;
    let yCord = 0;
    
    if( signalBits[0] === '0' ){
        yCord = 10;
        ctx.moveTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
        yCord = 2*signalVerticalOffset-10;
        ctx.lineTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
    }else{
        yCord = 2*signalVerticalOffset-10;
        ctx.moveTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
        yCord = 10;
        ctx.lineTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
    }
    for (let i = 1; i < signalBits.length; i++) {
        if(signalBits[i] === '1'){ //go from -v to +v
            if(yCord = 10){
                yCord = 2*signalVerticalOffset-10;
                ctx.lineTo(xCord,yCord);
            }
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
            yCord = 10;
            ctx.lineTo(xCord,yCord);
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
        }else{ //go from +v to -v
            if(yCord = 2*signalVerticalOffset-10){
                yCord = 10;
                ctx.lineTo(xCord,yCord);
            }
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
            yCord = 2*signalVerticalOffset-10;
            ctx.lineTo(xCord,yCord);
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
        }
    }
    ctx.stroke();
    
}
function drawDiffManchesterSignal(container,signalBits){
    const ctx = container.getContext('2d');
    setAttributes(container,{
        height: container.offsetHeight,
        width: container.offsetWidth
    })

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#33ff00';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    let xCord = 0;
    let yCord = 0;
    if( signalBits[0] === '0' ){
        yCord = 10;
        ctx.moveTo(xCord,yCord);
        yCord = 2*signalVerticalOffset-10;
        ctx.lineTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
        yCord = 10;
        ctx.lineTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
    }else{
        yCord = 10;
        ctx.moveTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
        yCord = 2*signalVerticalOffset-10;
        ctx.lineTo(xCord,yCord);
        xCord += (signalHorizontalOffset/2);
        ctx.lineTo(xCord,yCord);
    }
    for (let i = 1; i < signalBits.length; i++) {
        if(signalBits[i] === '0'){  //level transition at bit end only in case next bit is 0
            if(yCord === 10){
                yCord = 2*signalVerticalOffset-10;
                ctx.lineTo(xCord,yCord);
            }else{
                yCord = 10;
                ctx.lineTo(xCord,yCord);
            }
        }
        if(yCord === 2*signalVerticalOffset-10){
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
            yCord = 10;
            ctx.lineTo(xCord,yCord);
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
        }else{
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
            yCord = 2*signalVerticalOffset-10;
            ctx.lineTo(xCord,yCord);
            xCord += (signalHorizontalOffset/2);
            ctx.lineTo(xCord,yCord);
        }
    }
    ctx.stroke();


}
function drawAMISignal(container,signalBits){
    const ctx = container.getContext('2d');
    setAttributes(container,{
        height: container.offsetHeight,
        width: container.offsetWidth
    })

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#33ff00';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    let xCord = 0;
    let yCord = 0;
    let previousSigLevelForBit1 = "low";

    if(signalBits[0] === '0'){
        yCord = signalVerticalOffset;
        ctx.moveTo(xCord,yCord);
        xCord += signalHorizontalOffset;
        ctx.lineTo(xCord,yCord);
    }else{
        yCord = 10;
        ctx.moveTo(xCord,yCord);
        xCord += signalHorizontalOffset;
        ctx.lineTo(xCord,yCord);
        yCord = signalVerticalOffset;
        ctx.lineTo(xCord,yCord);
        previousSigLevelForBit1 = "high";
    }   
    for (let i = 1; i < signalBits.length; i++) {
        if(signalBits[i] === '1'){
            if( previousSigLevelForBit1 === "high" ){
                yCord = 2*signalVerticalOffset-10;
                previousSigLevelForBit1 = "low"
            }else{
                yCord = 10;
                previousSigLevelForBit1 = "high";
            }
            ctx.lineTo(xCord,yCord);
            xCord += signalHorizontalOffset;
            ctx.lineTo(xCord,yCord);
            yCord = signalVerticalOffset;
            ctx.lineTo(xCord,yCord);
        }else{
            xCord += signalHorizontalOffset;
            ctx.lineTo(xCord,yCord);
        }

    }
    ctx.stroke();
}

function addClass(element, className){
    element.className += " "+className;
}

function removeClass(element, className){
    element.classList.toggle(className);
}

function extractSignalBits(bitFields){
    const signalBits = [];
    for (let i = 0; i < signalLength.value; i++) {
        signalBits[i] = bitFields[i].value;
    }
    return signalBits;
}

function isValidSignal(signalBits){
    for (let i = 0; i < signalBits.length; i++) {
        if( signalBits[i] === "" || signalBits[i] < 0 || signalBits[i] > 1 ){
            return false;
        }
    }
    return true;
}

function isValidSignalLength(length){
    return length >= 2 ? true : false;
}

function setAttributes(element, attributes){
    for (const attribName in attributes) {
        if(attributes[attribName] === 'boolean'){
            element.toggleAttribute(attribName);
        }else{
            element.setAttribute(attribName,attributes[attribName]);
        }
    }
}

function createSignalBitInputs( containerElement, totalInputs ){
    for (let i = 0; i < totalInputs; i++) {
        const bitInputNode = document.createElement('input');
        setAttributes(bitInputNode,{ 
            type: 'number',
            min: 0,
            max: 1,
            required:'boolean' ,
            maxlength : 1
        })
        containerElement.insertAdjacentElement('afterbegin',bitInputNode); 
    }
}
