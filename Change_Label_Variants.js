/* Script to change the font of the text containing the size of any given label printed in Lightspeed */
(async () => {
    const domain = window.location.host;
    if (window.location.href.match(/\d{1,}\.html/g) != null) {
        const numbers = window.location.href.match(/\d+/g);
        const RAD = numbers[0];
        const itemID = numbers[1];
        let description = document.querySelector('.description');
        const req = await fetch(`https://${domain}/API/Account/${RAD}/Item/${itemID}.json?load_relations=all`, {
            credentials: "same-origin"
        });
        const results = await req.json();
        if (results.Item.hasOwnProperty('ItemAttributes')) {
            const arrayOfAttributes = results.Item.ItemAttributes.ItemAttributeSet.name.split('/');
            const indexOfSize = arrayOfAttributes.findIndex(x => x == "Size");
            const descriptionArr = results.Item.description.split(/\s/g);
            
            if (indexOfSize === 1) {
                const destructuredTitle = descriptionArr.reverse();
                const [size, ...restOfTitle] = destructuredTitle;
                const mainTitle = restOfTitle.reverse().join(' ');
                description.innerText = "";
                description.innerText = mainTitle;
                description.insertAdjacentHTML('afterend', `<span style="font-size: 12pt;">Size: ${size}</span>`);
            }
        }

    } else {
        //handle for multiple label template
        const descriptions = document.querySelectorAll('.description');
        const reqRAD = await fetch(`https://${domain}/API/Account.json`, {
            credentials: "same-origin"
        });
        const results = await reqRAD.json();
        const RAD = results.Account.accountID;
        const req = await fetch(`https://${domain}/API/Account/${RAD}/DisplayTemplate/Label.json`, {
            credentials: 'same-origin'
        });
        const resData = await req.json();
        // make sure to handle if there is only one label present

        const totalCopies = resData.Label.map(x => Number(x.copies)).reduce((acc, curr) => acc + curr, 0);
        const listofIDs = resData.Label.map(x => {
            return data = {
                itemID: x.itemID,
                labelID: x.labelID,
                copies: x.copies
            }
        });
        let printCount = 0;
        listofIDs.forEach(async (element,index) => {

            let eachLabel = await fetch(`https://${domain}/API/Account/${RAD}/Item/${element.itemID}.json?load_relations=all`, {
                credentials: 'same-origin'
            });
            let eachLabelRes = await eachLabel.json();
            console.log(eachLabelRes.Item); //

            const printedCopies = element.copies;
            console.log("printed copies is " + printedCopies);

            console.log(descriptions);

            for(let i = 0; i < printedCopies; i++) {
              
               if (results.Item.hasOwnProperty('ItemAttributes')) {
                const arrayOfAttributes = eachLabelRes.Item.ItemAttributes.ItemAttributeSet.name.split('/');
                const indexOfSize = arrayOfAttributes.findIndex(x => x == "Size");
                const descriptionArr = eachLabelRes.Item.description.split(/\s/g);

                if (indexOfSize === 1) {
                    const destructuredTitle = descriptionArr.reverse();
                    const [size, ...restOfTitle] = destructuredTitle;
                    const mainTitle = restOfTitle.reverse().join(' ');
                    descriptions[index + i].innerText = "";
                    descriptions[index + i].innerText = mainTitle;
                    descriptions[index + i].insertAdjacentHTML('afterend', `<span style="font-size: 12pt;">Size: ${size}</span>`);
                }
            }
                printCount++
            }
            console.log(`Final printcount for this item is ${printCount}`)

        });
 
    }
})()
