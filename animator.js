const textAnimator = function(){
    let i = 0;
    let progress = 0;
    let textToWrite;
    let container;
    function decryptText(containerElement, textToAnimate){
        textToWrite = textToAnimate;
        container = containerElement;
        animateText()
    }

    function animateText(){ 
        setTimeout(function(){ 
            i++;
            let currentText = textToWrite.substr(0, i);
            currentText += getRandomChars(textToWrite.length - i);
        
        
            container.innerHTML = currentText;
            progress = i/textToWrite.length;
        
            if(progress < 1) {
            animateText()
            }
        }, 100);

    }
    let codingChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    function getRandomChars(howMany) {
        let result = '';
        
        for(let i=0; i<howMany; i++) {
        if(i % 5 == 0) {
            result += ' '
        } else {
            result += codingChars.charAt(Math.floor(Math.random() * codingChars.length));
        }
        }
        return result
    }
    return {
        decryptText
    }
}();