var Tiff = require('tiff.js');

function readFile(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.addEventListener("load", e => {
            const arrayBuffer = e.target.result
            const tiff = new Tiff({
                buffer: arrayBuffer
            })
            console.log(tiff)
            let width = tiff.width();
            let height = tiff.height();
            let image = new Uint16Array(arrayBuffer);
            let Pixels = new Uint8Array(arrayBuffer);
            var x = tiff.getField(282);
            var y = tiff.getField(283)
            console.log(x, y)
            var res_x_int = new Int32Array(1);
            var res_y_int = new Int32Array(1);
            res_x_int[0] = x;
            res_y_int[0] = y;
            var res_x = new Float32Array(res_x_int.buffer);
            var res_y = new Float32Array(res_y_int.buffer);

            let canvas = tiff.toCanvas(); // 获取文件的DOM对象
            let ctx = canvas.getContext('2d'); // 创建canvas实例
            let imageData = ctx.getImageData(0, 0, width, height); // 获取文件的imageData
            let data = { imageData, Pixels, image, res_x, res_y };
            resolve(data);
        })
        reader.readAsArrayBuffer(file);
    })
}
export {
    readFile
}