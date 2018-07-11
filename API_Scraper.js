
// Selecting the element with the RAD number
let RAD = document.querySelector('body > div.cr-sidebar.no_print.js-sidebar > div.cr-sidebar__sub-header > div > div:nth-child(1) > div.cr-popover.cr-sidebar__popover.js-sidebar-popover > div.cr-popover__header > div:nth-child(2)');
// Getting RAD  number and converting it from a string to a number 
let rad = Number(RAD.innerHTML);
// Get the current URL
let url = window.location.href;
//Get the domain using regex (could also use window.location.hostname)
let fetch_url = url.replace(/(\b[\s\S]+.com\b)[\s\S]+/ig, "$1");
// First call to the API, replace "Item" with whatever endpoint you prefer
fetch(`${fetch_url}/API/Account/${rad}/Item.json`
    , {
        credentials: "same-origin"
    }).then((response)=> response.json())
    .then((data)=> {
        // Getting the pagination number ( because rate limit is 100)
     let loop_num = Math.round(Number(data["@attributes"].count)/100);
  let arr =[]; //Initialise a new array
     for(let i = 0; i < loop_num; i++) {
         // Loop through the offset until pages finish
        fetch(`${fetch_url}/API/Account/${rad}/Item.json?offset=${i*100}`
        , {
            credentials: "same-origin"
        }).then((response)=> response.json())
        .then((data)=> {
            
        console.log(data.Item);
        // Get values only of the Objects
        let itemData = Object.values(data.Item);
        //  dynamically merge the arrays into one (arr)
         arr.push(itemData);
       // store arrays into local storage
        window.localStorage.setItem("itemData", JSON.stringify(arr));
        
    // parse data
    let finalData = JSON.parse(localStorage.getItem('itemData'));
    
let finals = finalData[0]; // use first array as reference to merge
for(let i = 1; i < finalData.length; i++) {
    // loop through each array starting at finalData[1]
	array.prototype.push.apply(finals, finalData[i]);
}
// convert the result back into a string for processing
let str = JSON.stringify( finals);
// log data for copying from console
console.log(str);
        });
    }
    });

