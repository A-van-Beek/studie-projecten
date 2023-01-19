/*________________ overgenomen uit _____________________
https://www.horuskol.net/blog/2020-08-15/drag-and-drop-elements-on-touch-devices/

*/

let moving = null;

function pickup(event) {
    moving = event.target;

    moving.style.height = moving.clientHeight;
    moving.style.width = moving.clientWidth;
    moving.style.position = 'fixed';
	moving.style.zIndex = '-10';
}

function move(event) {
    if (moving) {
        if (event.clientX) {
            // mousemove
            moving.style.left = event.clientX - moving.clientWidth/2;
            moving.style.top = event.clientY - moving.clientHeight/2;
        } else {
            // touchmove - assuming a single touchpoint
            moving.style.left = event.changedTouches[0].clientX - moving.clientWidth/2;
            moving.style.top = event.changedTouches[0].clientY - moving.clientHeight/2;
        }
    }
}

function drop(event) {
    if (moving) {
        if (event.currentTarget.tagName !== 'HTML') {
            let target = null;
            if (event.clientX) {
                target = document.elementFromPoint(event.clientX, event.clientY);
            } else {
                target = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            }

            target.appendChild(moving);
        }

        // reset our element
        moving.style.left = '';
        moving.style.top = '';
        moving.style.height = '';
        moving.style.width = '';
        moving.style.position = '';
        moving.style.zIndex = '';

        moving = null;
    }
}