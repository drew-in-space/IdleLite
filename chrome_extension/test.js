document.getElementById("test").addEventListener('click', () => {

    function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
        let difArray = []
        let lastXpArray = []
        let startTime = Date.now() + 0

        setInterval(() => {
        
            // all spans that have 'Current Exp' in them (tool tips)
            let spanArray = Array.prototype.slice.call(document.body.querySelectorAll('span')).filter(x => x.innerHTML.indexOf('Current Exp') !== -1)

            // go through each span, grab the current exp and run the xp/hr calc
            spanArray.forEach((x,i) => {
                let xp = new String(x.innerHTML.substr(13).replace(',','').replace(',','').replace(',','').replace(',','')) // sorry mom, something about regex being able to replace them all but me too lazy to look it up

                if(lastXpArray.length < i + 1 && lastXpArray.length != spanArray) {
                    lastXpArray.push(xp) // init data arrays if empty
                }

                if(difArray.length < i + 1 && difArray.length != spanArray) {
                    difArray.push(0)  // init data arrays if empty
                }

                let id = x.parentElement.id  // grab the name of the tooltip

                // grab dif in xp from last recording if there is some, then update the recording
                let currentDif = xp - lastXpArray[i]
                lastXpArray[i] = xp;
                difArray[i] = difArray[i] + currentDif
                //end;

                // if we're not getting exp, we dont care!
                if(difArray[i] == 0) {
                    return
                }
                //end;

                // calc xp per hour
                let timeDif = Date.now() - startTime
                let seconds = timeDif / 1000
                let expPerHour = ((difArray[i] / seconds) * 60 * 60)
                // end;

                // log made pretty with spacer string 
                let spacer =  new Array((20 - id.length)).join( ' ' )
                console.log(id + spacer + '| - xp / hour :: ' + expPerHour)
            })


        }, 1000)

        return document.body.innerHTML;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:')
        console.log(results[0]);
    });
});
