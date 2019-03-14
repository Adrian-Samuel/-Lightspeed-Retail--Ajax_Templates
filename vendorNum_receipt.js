document.addEventListener("DOMContentLoaded", function() {
        (async () => {
            const domain = window.location.host;
            const numbers = window.location.href.match(/\d{1,}/g);
            const RAD = numbers[0];
            const saleID = numbers[1];
            const domSales = document.querySelectorAll('table.sale.lines > tbody:nth-child(2) > tr> th > div:nth-child(1)');
            if (domSales.length > 0) {
                const firstRowDescription = document.querySelector('body > div > table.sale.lines > tbody:nth-child(1) > tr > th.description');
                firstRowDescription.insertAdjacentHTML('afterend', '<th style="white-space:nowrap">Vendor Num</th>');
            }

            const reqSale = await fetch(`https://${domain}/API/Account/${RAD}/DisplayTemplate/Sale/${saleID}.json`, {
                credentials: 'same-origin'
            });
            const getSale = await reqSale.json();

            let sales = getSale.Sale.SaleLines.SaleLine;
            if (!Array.isArray(getSale.Sale.SaleLines.SaleLine)) {
                sales = [getSale.Sale.SaleLines.SaleLine];
            }
            sales.forEach(async (item, idx) => {
                const itemNumber = item.itemID;
                if (itemNumber > 0) {
                    const reqItem = await fetch(`https://${domain}/API/Account/${RAD}/Item/${itemNumber}.json?load_relations=["ItemVendorNums"]`, {
                        credentials: 'same-origin'
                    });
                    const getItem = await reqItem.json();
                    console.log(JSON.stringify(getItem, null, 2), "with an index of ", idx )
                    if (getItem.Item.hasOwnProperty('ItemVendorNums')) {
                        let vendorNumbers = getItem.Item.ItemVendorNums.ItemVendorNum;
                        if (!Array.isArray(getItem.Item.ItemVendorNums.ItemVendorNum)) {
                            vendorNumbers = [getItem.Item.ItemVendorNums.ItemVendorNum];
                        }
                      
                        const theVendorNumber = vendorNumbers[0].value;
                        domSales[idx].parentNode.insertAdjacentHTML('afterend', `<td style="text-align:center"> ${theVendorNumber}</td>`);
                   

                    } else {
                       
                        domSales[idx].parentNode.insertAdjacentHTML('afterend', '<td> </td>');
                    }

                } else {
                    domSales[idx].parentNode.insertAdjacentHTML('afterend', '<td> </td>');
                }

            })

        })()

    });
