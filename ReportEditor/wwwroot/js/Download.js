function downLoadDataURIEncoded(exportingString, exportName, extension=".txt") {

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportingString);

    let downLoadAnchorNode = document.createElement('a');

    downLoadAnchorNode.setAttribute("href", dataStr);

    downLoadAnchorNode.setAttribute("download", exportName + extension);

    document.body.appendChild(downLoadAnchorNode);

    downLoadAnchorNode.click();

    downLoadAnchorNode.remove();
}

function downLoadDomDiv(exportingString, exportName, extension = ".xml") {

    let downLoadAnchorNode = document.createElement('a');

    downLoadAnchorNode.setAttribute("href", "data:text/json;charset=utf-8," + exportingString);

    downLoadAnchorNode.setAttribute("download", exportName + extension);

    document.body.appendChild(downLoadAnchorNode);

    downLoadAnchorNode.click();

    downLoadAnchorNode.remove();
}