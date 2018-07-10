let makeButton  = document.body.insertAdjacentHTML('afterbegin', '<button> Click to Add Images </button>');
let btn = document.querySelector('button');
document.addEventListener("DOMContentLoaded", function(event) {



let title = document.querySelector('.receiptTypeTitle');
let titleText = title.innerHTML;
let SaleTest = /Sales Receipt/i;
if (SaleTest.test(titleText)) {
    btn.style.cssText="display: none;";
} else {
    btn.style.cssText="display: block; margin: 0 auto; position: relative; top: 20px;";


}

// window.onbeforeprint = function () {
//     btn.style.cssText="display:none";
// }

});

btn.addEventListener('click', function() {
  
    btn.style.cssText="display:none";
   

let items = document.querySelectorAll('table.sale.lines div:first-child'); // Select all the first children of the divs within the sale 
let firstTitle = document.querySelector('.description'); // Select the word description on the table headers
firstTitle.insertAdjacentHTML('afterend', '<th> Image Name</th>'); //Insert the word description on the table header

for(let i = 0; i < items.length; i++) { // a for loop looping though the length of items in the nodelist

    let str = window.location.href; // Getting the URL of the Sale
    let new_num = str.replace(/[\s\S]+?([\d]+)\.html[\s\S]+/ig, "$1"); //Regex to get the  SaleID from the URL
    fetch(`https://us.merchantos.com/API/Account/151203/DisplayTemplate/Sale/${new_num}.json`, {
        credentials: "same-origin"}) // Ensuring that I can have access to cross domain pages with my credentials
        .then((response) => response.json()) // bringing the response to JSON
        .then((data) => { // doing something with the response
            
            //this is for single images 

            if(items.length === 1) { // if the sale only has one item on the sale
                if(items[0].classList.contains("line_description")) {  // check if this singular item is an inventoried item    
                    if ( data.Sale.SaleLines.SaleLine.itemID == 0) { // if the saleItem is 0, then it has no image. Might need removal
                        let th = items[i].parentNode;
            th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"> I have no image </td>`);


                    } else { // otherwise if the SaleLine.itemID is not 0 then...

                        let theID = data.Sale.SaleLines.SaleLine.itemID; // store the saleLine.itemID in a variable
                    

                    fetch(`https://us.merchantos.com/API/Account/151203/Item/${theID}/Image.json`, { //insert the variable in a fetch API call
                        credentials: "same-origin"})
                        .then((response) => response.json())
                        .then((data) => {

                            let th = items[i].parentNode; // target the parent of the specific line in question (defined by the node list) and target the parent, which is the table head containing the description
                            if (typeof data.Image == "undefined") { // check if the item has an image
                                th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;">I don't have an image</td>`);
                            } else {
                                // if the item has an image check if it's a list of images (undefined) and if so ouput only the first image
                                if (typeof data.Image.baseImageURL == "undefined" && typeof data.Image.publicID == "undefined" )  {
                                    th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"><img style="width: 200px; height: 200px" src="https://res.cloudinary.com/lightspeed-retail/image/upload/${data.Image[0].publicID}"> </td>`);
                                } else {
                                    // otherwise if it's the only image (typeof is string, then insert that singular image that requires no index)
                                
                            
                            th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"><img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/lightspeed-retail/image/upload/${data.Image.publicID}"> </td>`);
                        }
                            }
                        });
                    
                    }

                } else { // otherwise this item isn't an inventoried item and can't have an image
                    let th = items[i].parentNode;
                    th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"> I have no image </td>`);
                }
            } else { // if there is more than one item on the sale
// this is for multiple images 
              
                if(items[i].classList.contains("line_description")) { // if the item, specified by the index of the loop has the class line description
                if ( data.Sale.SaleLines.SaleLine[i].itemID == 0) { // check the item doesn't have an itemID of 0
                    let th = items[i].parentNode; // target the table header (description) and insert this afterwards
            th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"> I have no image </td>`);
                } else {
                    // otherwise. store the saleID in a variable
                    let theID = data.Sale.SaleLines.SaleLine[i].itemID;
                    

                    fetch(`https://us.merchantos.com/API/Account/151203/Item/${theID}/Image.json`, { // insert that variable into the fetch API call for that specific image
                        credentials: "same-origin"})
                        .then((response) => response.json())
                        .then((data) => {

                            let th = items[i].parentNode;
                            // select the parent of the item, which is the table header (description)

                            
                            if (typeof data.Image == "undefined") {
                                th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;">I don't have an image </td>`);
                            } 
                            // if the item has no images, then say it has no images
                            
                            
                            
                            else {
                                    if (typeof data.Image.baseImageURL == "undefined" && typeof data.Image.publicID == "undefined") { // if the item has multiple images then insert the first one
                                        th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"><img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/lightspeed-retail/image/upload/${data.Image[0].publicID}"> </td>`);
                                    } else {

                                    
                            // if the item has only one image (i.e. typeof is a string) then insert that image
                            th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"><img style="width: 200px; height: 200px;" src="https://res.cloudinary.com/lightspeed-retail/image/upload/${data.Image.publicID}"> </td>`);
                        }
                        }
                        });


                    }






                } else { // if the item is not an inventory image, then output this (Can't have an image)
                    let th = items[i].parentNode;
                    th.insertAdjacentHTML('afterend',`<td style="border-bottom: 1px solid black; white-space: nowrap;"> I have no image </td>`);
                }
            

            }





        


        });
  


    }


});