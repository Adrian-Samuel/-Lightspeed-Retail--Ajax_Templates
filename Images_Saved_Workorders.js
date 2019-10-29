/* Simple Demo script to show how to add saved workorder images on a workorder quote.
Add a script tag and insert code under the <div class="header"> tag in the workorder template 
*/

document.addEventListener("DOMContentLoaded", async () => {
    const domain = window.location.host;
    const [RAD, workorderID] = window.location.href.match(/\d+/g);
    const header = document.querySelector('h1');

    header.insertAdjacentHTML('afterend', `<div class="for_images" style="width: auto; height: auto;display: flex; align-items: center; justify-content: center;" ></div>`);
    const container = document.querySelector('.for_images');

    const workorderReq = await fetch(`https://${domain}/API/Account/${RAD}/Workorder/${workorderID}.json?load_relations=["Images"]`, {
        credentials: "same-origin"
    });
    const json = await workorderReq.json();
    const images = !Array.isArray(images) ? [json.Workorder.Images.WorkorderImage] : json.Workorder.Images.WorkorderImage

    images.foreach(image => container.insertAdjacentHTML('beforeend', `<img style="width: 500px;"src=${image.baseImageURL}${image.publicID}>`));

});
