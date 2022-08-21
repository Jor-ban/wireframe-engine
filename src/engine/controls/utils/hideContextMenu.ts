export function hideContextMenu() {
    window.oncontextmenu = function (){
        return false;     // cancel default menu
    }
}