/* Rewrote Images on Receipt Script using Async/Await along with other functional methods */
(async () => {
    try {
        const numbers = window.location.href.match(/\d+/g);
        const RAD = numbers[0];
        const saleID = numbers[1];
        const domain = window.location.host;
        const visibleSales = document.querySelectorAll('.sale.lines tbody .description > div:nth-child(1)');
        const itemTitle = document.querySelector('.sale.lines th.description');
        itemTitle.insertAdjacentHTML('afterend', `<th> Images </th>`);
        const sleep = (time) => new Promise(res => setTimeout(res, time));


        let sale_request = await fetch(`https://${domain}/API/Account/${RAD}/DisplayTemplate/Sale/${saleID}.json`, {
            credentials: 'same-origin'
        })

        let sale_result = await sale_request.json();

        let saleList = sale_result.Sale.SaleLines.SaleLine;

        if (!Array.isArray(sale_result.Sale.SaleLines.SaleLine)) {
            saleList = [sale_result.Sale.SaleLines.SaleLine];
        }
        saleList.map(async (x, i) => {

            if (x.hasOwnProperty('Item')) {
                let itemID = x.Item.itemID;

                let image_request = await fetch(`https://${domain}/API/Account/${RAD}/Item/${itemID}/Image.json`, {
                    credentials: 'same-origin'
                });

                let image_result = await image_request.json();

                let itemImages = image_result.Image;
                if (image_result["@attributes"].count != 0) {

                    if (!Array.isArray(image_result.Image)) {
                        itemImages = [image_result.Image];
                    }

                    
                    visibleSales[i].parentElement.insertAdjacentHTML('afterend', `<td style="border-bottom: 1px solid black;"><img style="width: 100px; "src ="${itemImages[0].baseImageURL}${itemImages[0].publicID}"></td>`)

                } else {
                    visibleSales[i].parentElement.insertAdjacentHTML('afterend', `<td style="width: 100px; height: 100px; border-bottom: 1px solid black;" ></td>`)
                }
            } else {
                visibleSales[i].parentElement.insertAdjacentHTML('afterend', `<td style="width: 100px; height:100px; border-bottom: 1px solid black;"></td>`)
            }

        });
        await sleep(1000);
        window.print();


    } catch (err) {
        console.log(err);
    } 
})();
