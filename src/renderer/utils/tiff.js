var tiff = require('tiff.js');

function readFile(file) {
    // const tiffFile = file.dataTransfer.files[0];
    const tiffFile = file;
    console.log(file)
    const reader = new FileReader();
    reader.addEventListener("load", e => {
        const arrayBuffer = e.target.result
        const tiff = new Tiff({
            buffer: arrayBuffer
        })
        let width = tiff.width();
        let height = tiff.height();
        let pixels8 = new Int8Array(arrayBuffer);
        let pixels16 = new Int16Array(arrayBuffer);
        let data = { width, height, pixels8, pixels16 }
            // const canvas = tiff.toCanvas() // 使用canvas调此方法
        const imgData = tiff.toDataURL(); // 使用base64调此方法
        img.src = imgData;
        return data;
    })
    reader.readAsArrayBuffer(tiffFile);
}
export {
    readFile
}