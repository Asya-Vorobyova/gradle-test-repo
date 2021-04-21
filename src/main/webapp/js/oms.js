function openNamedPopup(inURI, inName, inWidth, inHeight) {

    if (inWidth == 1280) {
        position = ",left=0,top=0,";
    } else {
        position = "";
    }

    window.open(inURI, '_blank', "width=" + inWidth + ",height=" + inHeight + position +
        "location=yes,menubar=yes,scrollbars=yes,resizable=yes");
    return false;
}