//var  THRESH_BINARY = require('opencv-wasm/opencv.js');
const { cv } = require('opencv-wasm')
const { THRESH_BINARY } = require('opencv-wasm/opencv.js');
const { Mat  } = require('opencv-wasm/opencv.js');
const {  THRESH_OTSU,  THRESH_TRIANGLE,  CONTOURS_MATCH_I1  }  = require('opencv-wasm/opencv.js');

function cal_symmetry(rows, columns, pixel_data_16, pixel_data_8) {
    //6.3.1  Symmetry of square X-ray field
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rows * columns; i++) {
        if (pixel_data_8[i] > boundray_value) {
            pixel_data_8[i] = 0;
        }
        /*    else{
            pixel_data_8[i]=1;
          }  */
    }
    let bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    let penumbra_mat = cv.matFromArray(rows, columns, cv.CV_16UC1, cal_array);
    console.log("binarization");
    console.log(pixel_data_8);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(bin_mat_8, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let moments = cv.moments(cnt, false);
    let cx = moments.m10 / moments.m00;
    let cy = moments.m01 / moments.m00;
    console.log(cx, cy);
    let int_cx = parseInt(cx); //type conversion
    let int_cy = parseInt(cy);
    console.log(int_cx, int_cy);
    var left_Boundary_subscript_index_x;
    for (var i = 1; i < int_cy; i++) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > int_cy; i--) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            right_Boundary_subscript_index_x = i;
            break;
        }
    }
    var left_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < left_min_pixel_value) {
            left_min_pixel_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    var right_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < right_Boundary_subscript_index_x; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < right_min_pixel_value) {
            right_min_pixel_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    var left_dose_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    var left_center_min_D_value = left_dose_value - left_min_pixel_value;
    var right_center_min_D_value = left_dose_value - right_min_pixel_value;
    var left_fifty_percent_dose_value = parseInt(left_center_min_D_value / 2 + left_min_pixel_value);
    console.log(left_dose_value, 'left %50 dose value is ' + left_fifty_percent_dose_value);
    var right_fifty_percent_dose_value = parseInt(right_center_min_D_value / 2 + right_min_pixel_value);
    console.log(left_dose_value, 'right %50 dose value is ' + right_fifty_percent_dose_value);
    var left_fifty_percent_dose_index;
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - left_fifty_percent_dose_value) < 5) {
            left_fifty_percent_dose_index = i;
            break;
        }
    }
    var right_fifty_percent_dose_index;
    for (var i = int_cy; i < right_Boundary_subscript_index_x; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - right_fifty_percent_dose_value) < 5) {
            right_fifty_percent_dose_index = i;
            break;
        }
    }
    var Symmetry_left_boundary_index = parseInt(int_cy - ((int_cy - left_fifty_percent_dose_index) * 0.8));
    var Symmetry_right_boundary_index = parseInt(((right_fifty_percent_dose_index - int_cy) * 0.8) + int_cy);
    var Symmetry_left_boundary_distance = (int_cy - left_fifty_percent_dose_index) * 0.8 * 0.4;
    var Symmetry_right_boundary_distance = (right_fifty_percent_dose_index - int_cy) * 0.8 * 0.4;
    var Symmetry_Selected_distance = parseInt((Symmetry_left_boundary_distance < Symmetry_right_boundary_distance) ? Symmetry_left_boundary_distance : Symmetry_right_boundary_distance);
    console.log('Symmetry_Selected_distance is ' + Symmetry_Selected_distance);
    var Symmetry_Selected_left_index = parseInt(int_cy - Symmetry_Selected_distance / 0.4);
    var Symmetry_Selected_right_index = parseInt(int_cy + Symmetry_Selected_distance / 0.4);
    var left_dose_array = [];
    for (var i = Symmetry_Selected_left_index, j = 0; i < int_cy; i++, j++) {
        left_dose_array[j] = penumbra_mat.ushortAt(int_cx, i);
    }
    console.log("left_dose_array :");
    console.log(left_dose_array);
    var right_dose_array = [];
    for (var i = Symmetry_Selected_right_index, j = 0; i > int_cy; i--, j++) {
        right_dose_array[j] = penumbra_mat.ushortAt(int_cx, i);
    }
    console.log("right_dose_array :");
    console.log(right_dose_array);
    var Symmetry_array = [];
    for (var i = 0; i < left_dose_array.length; i++) {
        Symmetry_array[i] = right_dose_array[i] / left_dose_array[i];
    }
    var max_Symmetry = Symmetry_array[0];
    console.log("original  max_Symmetry is " + max_Symmetry);
    for (var i = 1; i < left_dose_array.length; i++) {
        if (Symmetry_array[i] > max_Symmetry) {
            max_Symmetry = Symmetry_array[i];
        }
    }
    console.log("final max_Symmetry is " + max_Symmetry);
    console.log("Symmetry_array");
    console.log(Symmetry_array);
    console.log("Symmetry_left_boundary_index,Symmetry_right_boundary_index is " + Symmetry_left_boundary_index, Symmetry_right_boundary_index);
    console.log("Symmetry_Selected_left_index,Symmetry_Selected_right_index is " + Symmetry_Selected_left_index, Symmetry_Selected_right_index);
    console.log("Symmetry_left_boundary_distance,Symmetry_right_boundary_distance is " + Symmetry_left_boundary_distance, Symmetry_right_boundary_distance);
    return max_Symmetry;
}

function cal_uniformity(rows, columns, pixel_data_16, pixel_data_8, image_shape) {
    // 6.3.1 Uniformity of square X-ray irradiation field
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rows * columns; i++) {
        if (pixel_data_8[i] > boundray_value) {
            pixel_data_8[i] = 0;
        }
    }
    let bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    let penumbra_mat = cv.matFromArray(rows, columns, cv.CV_16UC1, cal_array);
    console.log("binarization");
    console.log(pixel_data_8);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(bin_mat_8, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let moments = cv.moments(cnt, false);
    let cx = moments.m10 / moments.m00;
    let cy = moments.m01 / moments.m00;
    let int_cx = parseInt(cx); //type conversion
    let int_cy = parseInt(cy);
    let half_int_cx = parseInt(int_cx * 0.5);
    let half_int_cy = parseInt(int_cy * 0.5);
    let indent_distance = (image_shape / 10) * 1.2;
    let indent = Math.round(indent_distance / 0.4);
    var max_dose_value_x = penumbra_mat.ushortAt(int_cx, half_int_cy + indent);
    var min_dose_value_x = penumbra_mat.ushortAt(int_cx, half_int_cy + indent);
    var max_dose_value_y = penumbra_mat.ushortAt(half_int_cx + indent, int_cy);
    var min_dose_value_y = penumbra_mat.ushortAt(half_int_cx + indent, int_cy);
    console.log('center value is ' + penumbra_mat.ushortAt(int_cx, int_cy + indent));
    console.log('original max_dose_value_x is ' + max_dose_value_x);
    console.log('original min_dose_value_x is ' + min_dose_value_x);
    console.log('original max_dose_value_y is ' + max_dose_value_y);
    console.log('original min_dose_value_y is ' + min_dose_value_y);
    console.log(penumbra_mat.ushortAt(int_cx, half_int_cy));
    for (var i = half_int_cy + indent; i < int_cy + int_cy - half_int_cy - indent; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) > max_dose_value_x) {
            max_dose_value_x = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    for (var i = half_int_cy + indent; i < int_cy + int_cy - half_int_cy - indent; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < min_dose_value_x) {
            min_dose_value_x = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    for (var i = half_int_cx + indent; i < int_cx + int_cx - half_int_cx - indent; i++) {
        if (penumbra_mat.ushortAt(i, int_cy) > max_dose_value_y) {
            max_dose_value_y = penumbra_mat.ushortAt(i, int_cy);
        }
    }
    for (var i = half_int_cx + indent; i < int_cx + int_cx - half_int_cx - indent; i++) {
        if (penumbra_mat.ushortAt(i, int_cy) < min_dose_value_y) {
            min_dose_value_y = penumbra_mat.ushortAt(i, int_cy);
        }
    }
    var Uniformity_x = max_dose_value_x / min_dose_value_x;
    var Uniformity_y = max_dose_value_y / min_dose_value_y;
    var Uniformity;
    if (Uniformity_x > Uniformity_y) {
        Uniformity = Uniformity_x;
    } else {
        Uniformity = Uniformity_y;
    }
    console.log('max_dose_value_x is ' + max_dose_value_x);
    console.log('min_dose_value_x is ' + min_dose_value_x);
    console.log('max_dose_value_y is ' + max_dose_value_y);
    console.log('mix_dose_value_y is ' + min_dose_value_y);
    console.log("uniformity_x is " + Uniformity_x);
    console.log("uniformity_y is " + Uniformity_y);
    console.log("uniformity is " + Uniformity);
    return Uniformity;
}

function cal_position_indication(rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape) {
    //6.4.2 Position indication of radiation beam axis on the patient's incident surface
    console.log("first shape,second shape is " + first_image_shape, second_image_shape);
    let first_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, first_pixel_data_16);
    let first_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        if (first_pixel_data_8[i] > boundray_value) {
            first_pixel_data_8[i] = 0;
        }
    }
    let first_bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    let first_contours = new cv.MatVector();
    let first_hierarchy = new cv.Mat();
    cv.findContours(first_bin_mat_8, first_contours, first_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let first_cnt = first_contours.get(0);
    let first_moments = cv.moments(first_cnt, false);
    let first_cx = first_moments.m10 / first_moments.m00;
    let first_cy = first_moments.m01 / first_moments.m00;
    let first_int_cx = parseInt(first_cx); //type conversion
    let first_int_cy = parseInt(first_cy);
    let first_half_int_cx = parseInt(first_int_cx * 0.5);
    let first_half_int_cy = parseInt(first_int_cy * 0.5);
    let first_indent_distance = (first_image_shape / 10) * 1.2;
    let first_indent = Math.round(first_indent_distance / 0.4);
    console.log(first_int_cx, first_int_cy, first_half_int_cx, first_half_int_cy, first_indent);
    //calculate Boundary subscript
    var first_left_Boundary_subscript_index_x;
    for (var i = 1; i < first_int_cy; i++) {
        if (first_mat_8.ucharAt(first_int_cx, i) < boundray_value) {
            first_left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var first_right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > first_int_cy; i--) {
        if (first_mat_8.ucharAt(first_int_cx, i) < boundray_value) {
            first_right_Boundary_subscript_index_x = i;
            break;
        }
    }
    console.log('first left and right bounday index is ' + first_left_Boundary_subscript_index_x, first_right_Boundary_subscript_index_x);
    var first_left_dose_value = parseInt(first_mat_8.ucharAt(first_int_cx, first_int_cy) + first_mat_8.ucharAt(first_int_cx, first_left_Boundary_subscript_index_x));
    var first_left_half_dose_value = parseInt(first_left_dose_value / 2);
    console.log(first_left_dose_value, 'left %50 dose value is ' + first_left_half_dose_value);
    var first_right_dose_value = parseInt(first_mat_8.ucharAt(first_int_cx, first_int_cy) + first_mat_8.ucharAt(first_int_cx, first_right_Boundary_subscript_index_x));
    var first_right_half_dose_value = parseInt(first_right_dose_value / 2);
    console.log(first_right_dose_value, 'right %50 dose value is ' + first_right_half_dose_value);
    var first_left_dose_value_index;
    var first_right_dose_value_index;
    console.log('first left index is ' + first_left_dose_value_index);
    console.log('first right index is ' + first_right_dose_value_index);
    console.log(first_mat_8.data);
    for (var k = first_left_Boundary_subscript_index_x; k < first_int_cy; k++) {
        if (Math.abs(first_mat_8.ucharAt(first_int_cx, k) - first_left_half_dose_value) < 2) {
            first_left_dose_value_index = k;
            break;
        }
    }
    console.log('first left index is ' + first_left_dose_value_index);
    for (var l = first_int_cy; l < first_right_Boundary_subscript_index_x; l++) {
        if (Math.abs(first_mat_8.ucharAt(first_int_cx, l) - first_right_half_dose_value) < 2) {
            first_right_dose_value_index = l;
            break;
        }
    }
    console.log('first right index is ' + first_right_dose_value_index);
    var first_half_dose_value_distance = parseInt((first_right_dose_value_index - first_left_dose_value_index - 1) * 0.4);
    console.log('first half_dose_value_distance is ' + first_half_dose_value_distance);
    var first_D_value = first_half_dose_value_distance - 100;
    console.log("first D_value is " + first_D_value);
    let second_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, second_pixel_data_16);
    let second_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    for (var i = 0; i < rows * columns; i++) {
        if (second_pixel_data_8[i] > boundray_value) {
            second_pixel_data_8[i] = 0;
        }
    }
    let second_bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    let second_contours = new cv.MatVector();
    let second_hierarchy = new cv.Mat();
    cv.findContours(second_bin_mat_8, second_contours, second_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let second_cnt = second_contours.get(0);
    let second_moments = cv.moments(second_cnt, false);
    let second_cx = second_moments.m10 / second_moments.m00;
    let second_cy = second_moments.m01 / second_moments.m00;
    let second_int_cx = parseInt(second_cx); //type conversion
    let second_int_cy = parseInt(second_cy);
    let second_half_int_cx = parseInt(second_int_cx * 0.5);
    let second_half_int_cy = parseInt(second_int_cy * 0.5);
    let second_indent_distance = (second_image_shape / 10) * 1.2;
    let second_indent = Math.round(second_indent_distance / 0.4);
    console.log(second_int_cx, second_int_cy, second_half_int_cx, second_half_int_cy, second_indent);
    //calculate Boundary subscript
    var second_left_Boundary_subscript_index_x;
    for (var i = 1; i < second_int_cy; i++) {
        if (second_mat_8.ucharAt(second_int_cx, i) < boundray_value) {
            second_left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var second_right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > second_int_cy; i--) {
        if (second_mat_8.ucharAt(second_int_cx, i) < boundray_value) {
            second_right_Boundary_subscript_index_x = i;
            break;
        }
    }
    console.log('second left and right bounday index is ' + second_left_Boundary_subscript_index_x, second_right_Boundary_subscript_index_x);
    var second_left_dose_value = parseInt(second_mat_8.ucharAt(second_int_cx, second_int_cy) + second_mat_8.ucharAt(second_int_cx, second_left_Boundary_subscript_index_x));
    var second_left_half_dose_value = parseInt(second_left_dose_value / 2);
    console.log(second_left_dose_value, 'second left %50 dose value is ' + second_left_half_dose_value);
    var second_right_dose_value = parseInt(second_mat_8.ucharAt(second_int_cx, second_int_cy) + second_mat_8.ucharAt(second_int_cx, second_right_Boundary_subscript_index_x));
    var second_right_half_dose_value = parseInt(second_right_dose_value / 2);
    console.log(second_right_dose_value, 'second right %50 dose value is ' + second_right_half_dose_value);
    console.log(second_mat_8.data);
    var second_left_dose_value_index;
    var second_right_dose_value_index;
    console.log('second left index is ' + second_left_dose_value_index);
    console.log('seocnd right index is ' + second_right_dose_value_index);
    for (var i = second_left_Boundary_subscript_index_x; i < second_int_cy; i++) {
        if (Math.abs(second_mat_8.ucharAt(second_int_cx, i) - second_left_half_dose_value) < 5) {
            second_left_dose_value_index = i;
            break;
        }
    }
    console.log('second left index is ' + second_left_dose_value_index);
    for (var j = second_int_cy; j < second_right_Boundary_subscript_index_x; j++) {
        if (Math.abs(second_mat_8.ucharAt(second_int_cx, j) - second_right_half_dose_value) < 5) {
            second_right_dose_value_index = j;
            break;
        }
    }
    console.log('seocnd right index is ' + second_right_dose_value_index);
    var second_half_dose_value_distance = parseInt((second_right_dose_value_index - second_left_dose_value_index - 1) * 0.4);
    console.log('second half_dose_value_distance is ' + second_half_dose_value_distance);
    var second_D_value = second_half_dose_value_distance - 100;
    console.log("second D_value is " + second_D_value);
    var max_D_value;
    if (first_D_value > second_D_value) {
        max_D_value = first_D_value;
    } else {
        max_D_value = second_D_value;
    }
    console.log("two image max D_value is " + max_D_value);
    return max_D_value;
}

function cal_scale_position(rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape) {
    //6.6.2 Zero scale position of rotary motion ruler
    let first_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, first_pixel_data_16);
    let first_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        if (first_pixel_data_8[i] > boundray_value) {
            first_pixel_data_8[i] = 0;
        }
    }
    let first_bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    let first_contours = new cv.MatVector();
    let first_hierarchy = new cv.Mat();
    cv.findContours(first_bin_mat_8, first_contours, first_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let first_cnt = first_contours.get(0);
    let first_moments = cv.moments(first_cnt, false);
    let first_cx = first_moments.m10 / first_moments.m00;
    let first_cy = first_moments.m01 / first_moments.m00;
    let first_int_cx = parseInt(first_cx); //type conversion
    let first_int_cy = parseInt(first_cy);
    let first_half_int_cx = parseInt(first_int_cx * 0.5);
    let first_half_int_cy = parseInt(first_int_cy * 0.5);
    let first_indent_distance = (first_image_shape / 10) * 1.2;
    let first_indent = Math.round(first_indent_distance / 0.4);
    console.log(first_int_cx, first_int_cy, first_half_int_cx, first_half_int_cy, first_indent);
    //calculate Boundary subscript
    var first_left_Boundary_subscript_index_x;
    for (var i = 1; i < first_int_cy; i++) {
        if (first_mat_8.ucharAt(first_int_cx, i) < boundray_value) {
            first_left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var first_right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > first_int_cy; i--) {
        if (first_mat_8.ucharAt(first_int_cx, i) < boundray_value) {
            first_right_Boundary_subscript_index_x = i;
            break;
        }
    }
    console.log('first left and right bounday index is ' + first_left_Boundary_subscript_index_x, first_right_Boundary_subscript_index_x);
    var first_left_dose_value = parseInt(first_mat_8.ucharAt(first_int_cx, first_int_cy) + first_mat_8.ucharAt(first_int_cx, first_left_Boundary_subscript_index_x));
    var first_left_half_dose_value = parseInt(first_left_dose_value / 2);
    console.log(first_left_dose_value, 'left %50 dose value is ' + first_left_half_dose_value);
    var first_right_dose_value = parseInt(first_mat_8.ucharAt(first_int_cx, first_int_cy) + first_mat_8.ucharAt(first_int_cx, first_right_Boundary_subscript_index_x));
    var first_right_half_dose_value = parseInt(first_right_dose_value / 2);
    console.log(first_right_dose_value, 'right %50 dose value is ' + first_right_half_dose_value);
    var first_left_dose_value_index;
    var first_right_dose_value_index;
    console.log('left index is ' + first_left_dose_value_index);
    console.log('right index is ' + first_right_dose_value_index);
    console.log(first_mat_8.data);
    for (var k = first_left_Boundary_subscript_index_x; k < first_int_cy; k++) {
        if (Math.abs(first_mat_8.ucharAt(first_int_cx, k) - first_left_half_dose_value) < 5) {
            first_left_dose_value_index = k;
            break;
        }
    }
    console.log('left index is ' + first_left_dose_value_index);
    for (var l = first_int_cy; l < first_right_Boundary_subscript_index_x; l++) {
        if (Math.abs(first_mat_8.ucharAt(first_int_cx, l) - first_right_half_dose_value) < 5) {
            first_right_dose_value_index = l;
            break;
        }
    }
    console.log('right index is ' + first_right_dose_value_index);
    var first_half_dose_value_distance = parseInt((first_right_dose_value_index - first_left_dose_value_index - 1) * 0.4);
    console.log('half_dose_value_distance is ' + first_half_dose_value_distance);
    var first_D_value = first_half_dose_value_distance - 100;
    console.log("first D_value is " + first_D_value);
    //  let second_mat_8=first_mat_8;
    let second_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, second_pixel_data_16);
    let second_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    for (var i = 0; i < rows * columns; i++) {
        if (second_pixel_data_8[i] > boundray_value) {
            second_pixel_data_8[i] = 0;
        }
    }
    let second_bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    let second_contours = new cv.MatVector();
    let second_hierarchy = new cv.Mat();
    cv.findContours(second_bin_mat_8, second_contours, second_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let second_cnt = second_contours.get(0);
    let second_moments = cv.moments(second_cnt, false);
    let second_cx = second_moments.m10 / second_moments.m00;
    let second_cy = second_moments.m01 / second_moments.m00;
    let second_int_cx = parseInt(second_cx); //type conversion
    let second_int_cy = parseInt(second_cy);
    let second_half_int_cx = parseInt(second_int_cx * 0.5);
    let second_half_int_cy = parseInt(second_int_cy * 0.5);
    let second_indent_distance = (second_image_shape / 10) * 1.2;
    let second_indent = Math.round(second_indent_distance / 0.4);
    console.log(second_int_cx, second_int_cy, second_half_int_cx, second_half_int_cy, second_indent);
    //calculate Boundary subscript
    var second_left_Boundary_subscript_index_x;
    for (var i = 1; i < second_int_cy; i++) {
        if (second_mat_8.ucharAt(second_int_cx, i) < boundray_value) {
            second_left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var second_right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > second_int_cy; i--) {
        if (second_mat_8.ucharAt(second_int_cx, i) < boundray_value) {
            second_right_Boundary_subscript_index_x = i;
            break;
        }
    }
    console.log('second left and right bounday index is ' + second_left_Boundary_subscript_index_x, second_right_Boundary_subscript_index_x);
    var second_left_dose_value = parseInt(second_mat_8.ucharAt(second_int_cx, second_int_cy) + second_mat_8.ucharAt(second_int_cx, second_left_Boundary_subscript_index_x));
    var second_left_half_dose_value = parseInt(second_left_dose_value / 2);
    console.log(second_left_dose_value, 'left %50 dose value is ' + second_left_half_dose_value);
    var second_right_dose_value = parseInt(second_mat_8.ucharAt(second_int_cx, second_int_cy) + second_mat_8.ucharAt(second_int_cx, second_right_Boundary_subscript_index_x));
    var second_right_half_dose_value = parseInt(second_right_dose_value / 2);
    console.log(first_right_dose_value, 'right %50 dose value is ' + second_right_half_dose_value);
    var second_left_dose_value_index;
    var second_right_dose_value_index;
    for (var i = second_left_Boundary_subscript_index_x; i < second_int_cy; i++) {
        if (Math.abs(second_mat_8.ucharAt(second_int_cx, i) - second_left_half_dose_value) < 5) {
            second_left_dose_value_index = i;
            break;
        }
    }
    console.log('left index is ' + second_left_dose_value_index);
    for (var j = second_int_cy; j < second_right_Boundary_subscript_index_x; j++) {
        if (Math.abs(second_mat_8.ucharAt(second_int_cx, j) - second_right_half_dose_value) < 5) {
            second_right_dose_value_index = j;
            break;
        }
    }
    console.log('right index is ' + second_right_dose_value_index);
    var second_half_dose_value_distance = parseInt((second_right_dose_value_index - second_left_dose_value_index - 1) * 0.4);
    console.log('half_dose_value_distance is ' + second_half_dose_value_distance);
    var second_D_value = second_half_dose_value_distance - 100;
    console.log("second D_value is " + second_D_value);
    var max_D_value;
    if (first_D_value > second_D_value) {
        max_D_value = first_D_value;
    } else {
        max_D_value = second_D_value;
    }
    console.log("two image max D_value is " + max_D_value);
    var first_left_distance = (first_int_cy - first_left_dose_value_index) * 0.4;
    var second_left_distance = (second_int_cy - second_left_dose_value_index) * 0.4;
    var first_right_distance = (first_right_dose_value_index - first_int_cy) * 0.4;
    var second_right_distance = (second_right_dose_value_index - second_int_cy) * 0.4;
    var t_left_D_distance = Math.abs(second_left_distance - first_left_distance);
    var t_right_D_distance = Math.abs(second_right_distance - first_right_distance);
    var ratio = t_left_D_distance / t_right_D_distance;
    var angle = Math.asin(ratio);
    console.log(t_left_D_distance, t_right_D_distance);
    console.log("ratio is " + ratio + "angle " + angle);
    return angle;
}

function cal_penumbra(rows, columns, pixel_data_16, pixel_data_8) {
    //6.3.3 Penumbra of radiation field
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rows * columns; i++) {
        if (pixel_data_8[i] > boundray_value) {
            pixel_data_8[i] = 0;
        }
    }
    let bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    let penumbra_mat = cv.matFromArray(rows, columns, cv.CV_16UC1, cal_array);
    console.log("binarization");
    console.log(pixel_data_8);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(bin_mat_8, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let moments = cv.moments(cnt, false);
    let cx = moments.m10 / moments.m00;
    let cy = moments.m01 / moments.m00;
    console.log(cx, cy);
    let int_cx = parseInt(cx); //type conversion
    let int_cy = parseInt(cy);
    var left_Boundary_subscript_index_x;
    for (var i = 1; i < int_cy; i++) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > int_cy; i--) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            right_Boundary_subscript_index_x = i;
            break;
        }
    }
    console.log('pen_mat');
    console.log(penumbra_mat.data16U);
    var left_dose_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    console.log("value is  " + penumbra_mat.ushortAt(int_cx, int_cy));
    var left_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < left_min_pixel_value) {
            left_min_pixel_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    var right_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < right_Boundary_subscript_index_x; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < right_min_pixel_value) {
            right_min_pixel_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    var left_center_min_D_value = left_dose_value - left_min_pixel_value;
    var right_center_min_D_value = left_dose_value - right_min_pixel_value;
    console.log("left_min_pixel_value is " + left_min_pixel_value);
    console.log("right_min_pixel_value is " + right_min_pixel_value);
    var left_twenty_percent_dose_value = parseInt(left_center_min_D_value / 5 + left_min_pixel_value);
    var left_eighty_percent_dose_value = parseInt((left_center_min_D_value * 0.8 + left_min_pixel_value));
    console.log(left_dose_value, 'left %20 dose value is ' + left_twenty_percent_dose_value);
    console.log(left_dose_value, 'left %80 dose value is ' + left_eighty_percent_dose_value);
    var right_dose_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    var right_twenty_percent_dose_value = parseInt(right_center_min_D_value / 5 + right_min_pixel_value);
    var right_eighty_percent_dose_value = parseInt((right_center_min_D_value * 0.8 + right_min_pixel_value));
    console.log(right_dose_value, 'right %20 dose value is ' + right_twenty_percent_dose_value);
    console.log(right_dose_value, 'right %80 dose value is ' + right_eighty_percent_dose_value);
    var left_twenty_percent_dose_index;
    var right_twenty_percent_dose_index;
    var left_eighty_percent_dose_index;
    var right_eighty_percent_dose_index;
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - left_twenty_percent_dose_value) < 5) {
            left_twenty_percent_dose_index = i;
            break;
        }
    }
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - left_eighty_percent_dose_value) < 5) {
            left_eighty_percent_dose_index = i;
            break;
        }
    }
    console.log('left %20 index is ' + left_twenty_percent_dose_index);
    console.log('left %80 index is ' + left_eighty_percent_dose_index);
    for (var j = int_cy; j < right_Boundary_subscript_index_x; j++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, j) - right_twenty_percent_dose_value) < 5) {
            right_twenty_percent_dose_index = j;
            break;
        }
    }
    for (var j = int_cy; j < right_Boundary_subscript_index_x; j++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, j) - right_eighty_percent_dose_value) < 5) {
            right_eighty_percent_dose_index = j;
            break;
        }
    }
    console.log('right %20 index is ' + right_twenty_percent_dose_index);
    console.log('right %80 index is ' + right_eighty_percent_dose_index);
    var left_Penumbra = (left_eighty_percent_dose_index - left_twenty_percent_dose_index - 1) * 0.4;
    var right_Penumbra = (right_twenty_percent_dose_index - right_eighty_percent_dose_index - 1) * 0.4;
    var Penumbra = (left_Penumbra + right_Penumbra) / 2;
    console.log("left_penumbra,right_penumbra is " + left_Penumbra, right_Penumbra);
    console.log("penumbra is " + Penumbra);
    var RT_Image_SID = 160;
    var ISO_left_Penumbra = left_Penumbra / (RT_Image_SID / 100);
    var ISO_right_Penumbra = right_Penumbra / (RT_Image_SID / 100);
    var ISO_Penumbra1 = Penumbra / (RT_Image_SID / 100);
    var ISO_Penumbra2 = (ISO_left_Penumbra + ISO_right_Penumbra) / 2;
    console.log("ISO left right and average1 average2 is " + ISO_left_Penumbra, ISO_right_Penumbra, ISO_Penumbra1, ISO_Penumbra2);
    return ISO_Penumbra1;
}

function cal_unit_limiting(rows, columns, pixel_data_16, pixel_data_8) {
    //6.4.1 Digital indication of radiation field(Unit beam limiting)
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rows * columns; i++) {
        if (pixel_data_8[i] > boundray_value) {
            pixel_data_8[i] = 0;
        }
    }
    let bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    let penumbra_mat = cv.matFromArray(rows, columns, cv.CV_16UC1, cal_array);
    console.log("binarization");
    console.log(pixel_data_8);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(bin_mat_8, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let moments = cv.moments(cnt, false);
    let cx = moments.m10 / moments.m00;
    let cy = moments.m01 / moments.m00;
    console.log(cx, cy);
    let int_cx = parseInt(cx); //type conversion
    let int_cy = parseInt(cy);
    console.log(int_cx, int_cy);
    var left_Boundary_subscript_index_x;
    for (var i = 1; i < int_cx; i++) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > int_cx; i--) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            right_Boundary_subscript_index_x = i;
            break;
        }
    }
    var left_dose_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    console.log("value is  " + penumbra_mat.ushortAt(int_cx, int_cy));
    var left_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < left_min_pixel_value) {
            left_min_pixel_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    var right_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < right_Boundary_subscript_index_x; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < right_min_pixel_value) {
            right_min_pixel_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    var left_center_min_D_value = left_dose_value - left_min_pixel_value;
    var right_center_min_D_value = left_dose_value - right_min_pixel_value;
    console.log("left_min_pixel_value is " + left_min_pixel_value);
    console.log("right_min_pixel_value is " + right_min_pixel_value);
    var left_fifty_percent_dose_value = parseInt(left_center_min_D_value / 2 + left_min_pixel_value);
    console.log(left_dose_value, 'left %50 dose value is ' + left_fifty_percent_dose_value);
    var right_fifty_percent_dose_value = parseInt(right_center_min_D_value / 2 + right_min_pixel_value);
    console.log(left_dose_value, 'right %50 dose value is ' + right_fifty_percent_dose_value);
    var left_fifty_percent_dose_index;
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - left_fifty_percent_dose_value) < 5) {
            left_fifty_percent_dose_index = i;
            break;
        }
    }
    var right_fifty_percent_dose_index;
    for (var i = int_cy; i < right_Boundary_subscript_index_x; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - right_fifty_percent_dose_value) < 5) {
            right_fifty_percent_dose_index = i;
            break;
        }
    }
    var fifty_percent_dose_distance;
    fifty_percent_dose_distance = (right_fifty_percent_dose_index - left_fifty_percent_dose_index - 1) * 0.4;
    var ISO_fifty_percent_dose_distance;
    var RT_Image_SID = 160;
    ISO_fifty_percent_dose_distance = fifty_percent_dose_distance / (RT_Image_SID / 100);
    var ISO_fifty_percent_dose_distance_D_value;
    ISO_fifty_percent_dose_distance_D_value = ISO_fifty_percent_dose_distance - 100;
    console.log("fifty_percent_dose_distance,ISO_fifty_percent_dose_distance,ISO_fifty_percent_dose_distance_D_value is " + fifty_percent_dose_distance, ISO_fifty_percent_dose_distance, ISO_fifty_percent_dose_distance_D_value);
    return ISO_fifty_percent_dose_distance_D_value;
}

function cal_small_multiple_limiting(rows, columns, pixel_data_16, pixel_data_8, pairs_number) {
    //6.4.1 Digital indication of radiation field(multiple beam limiting :10*10  40 pairs/80 pairs)
    //cal 40 pairs
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rows * columns; i++) {
        if (pixel_data_8[i] > boundray_value) {
            pixel_data_8[i] = 0;
        }
    }
    let bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    let penumbra_mat = cv.matFromArray(rows, columns, cv.CV_16UC1, cal_array);
    console.log("binarization");
    console.log(pixel_data_8);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(bin_mat_8, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0);
    let moments = cv.moments(cnt, false);
    let cx = moments.m10 / moments.m00;
    let cy = moments.m01 / moments.m00;
    console.log(cx, cy);
    let int_cx = parseInt(cx); //type conversion
    let int_cy = parseInt(cy);
    var left_Boundary_subscript_index_x;
    for (var i = 1; i < int_cx; i++) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > int_cx; i--) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            right_Boundary_subscript_index_x = i;
            break;
        }
    }
    var up_Boundary_subscript_index_y;
    for (var i = 0; i < int_cx; i++) {
        if (mat_8.ucharAt(i, int_cy) < 140) {
            up_Boundary_subscript_index_y = i;
            break;
        }
    }
    var down_Boundary_subscript_index_y;
    for (var i = rows - 1; i > int_cx; i--) {
        if (mat_8.ucharAt(int_cx, i) < 140) {
            down_Boundary_subscript_index_y = i;
            break;
        }
    }
    var left_dose_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    console.log("value is  " + penumbra_mat.ushortAt(int_cx, int_cy));
    var left_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < left_min_pixel_value) {
            left_min_pixel_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    var right_min_pixel_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < right_Boundary_subscript_index_x; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < right_min_pixel_value) {
            right_min_pixel_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    var left_center_min_D_value = left_dose_value - left_min_pixel_value;
    var right_center_min_D_value = left_dose_value - right_min_pixel_value;
    console.log("left_min_pixel_value is " + left_min_pixel_value);
    console.log("right_min_pixel_value is " + right_min_pixel_value);
    var left_fifty_percent_dose_value = parseInt(left_center_min_D_value / 2 + left_min_pixel_value);
    console.log(left_dose_value, 'left %50 dose value is ' + left_fifty_percent_dose_value);
    var right_fifty_percent_dose_value = parseInt(right_center_min_D_value / 2 + right_min_pixel_value);
    console.log(left_dose_value, 'right %50 dose value is ' + right_fifty_percent_dose_value);
    if (pairs_number == 40) {
        var small_multiple_Grating_spacing = (10 * 1.6) / 2;
        var small_multiple_Grating_spacing_index_number = small_multiple_Grating_spacing / 0.4;
        var small_multiple_left_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 11; j++) {
            for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
                if (Math.abs(penumbra_mat.ushortAt(up_Boundary_subscript_index_y + j * small_multiple_Grating_spacing_index_number, i) - left_fifty_percent_dose_value) < 5) {
                    small_multiple_left_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("small_multiple_left_fifty_percent_dose_index_array");
        console.log(small_multiple_left_fifty_percent_dose_index_array);
        var small_multiple_right_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 11; j++) {
            for (var i = int_cy; i < right_Boundary_subscript_index_x; i++) {
                if (Math.abs(penumbra_mat.ushortAt(up_Boundary_subscript_index_y + j * small_multiple_Grating_spacing_index_number, i) - right_fifty_percent_dose_value) < 5) {
                    small_multiple_right_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("small_multiple_right_fifty_percent_dose_index_array");
        console.log(small_multiple_right_fifty_percent_dose_index_array);
        var small_multiple_fifty_percent_dose_distance = [];
        for (var i = 1; i < small_multiple_left_fifty_percent_dose_index_array.length; i++) {
            small_multiple_fifty_percent_dose_distance[i] = Math.abs((small_multiple_right_fifty_percent_dose_index_array[i] - small_multiple_left_fifty_percent_dose_index_array[i]) * 0.4 - 160);
        }
        var small_multiple_max_fifty_percent_dose_distance_D_value = small_multiple_fifty_percent_dose_distance[1];
        for (var i = 2; i < small_multiple_fifty_percent_dose_distance.length; i++) {
            if (small_multiple_fifty_percent_dose_distance[i] > small_multiple_max_fifty_percent_dose_distance_D_value) {
                small_multiple_max_fifty_percent_dose_distance_D_value = small_multiple_fifty_percent_dose_distance[i];
            }
        }
        var ISO_small_multiple_max_fifty_percent_dose_distance_D_value = small_multiple_max_fifty_percent_dose_distance_D_value / 1.6;
        console.log("small_multiple_max_fifty_percent_dose_distance_D_value is " + small_multiple_max_fifty_percent_dose_distance_D_value);
        return ISO_small_multiple_max_fifty_percent_dose_distance_D_value;
    }
    //cal 80 pairs
    else {
        var large_multiple_Grating_spacing = (10 * 0.8) / 2;
        var large_multiple_Grating_spacing_index_number = large_multiple_Grating_spacing / 0.4;
        var large_multiple_left_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
                if (Math.abs(penumbra_mat.ushortAt(up_Boundary_subscript_index_y + j * large_multiple_Grating_spacing_index_number, i) - left_fifty_percent_dose_value) < 5) {
                    large_multiple_left_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("large_multiple_left_fifty_percent_dose_index_array");
        console.log(large_multiple_left_fifty_percent_dose_index_array);
        var large_multiple_right_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = int_cy; i < right_Boundary_subscript_index_x; i++) {
                if (Math.abs(penumbra_mat.ushortAt(up_Boundary_subscript_index_y + j * large_multiple_Grating_spacing_index_number, i) - right_fifty_percent_dose_value) < 5) {
                    large_multiple_right_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("large_multiple_right_fifty_percent_dose_index_array");
        console.log(large_multiple_right_fifty_percent_dose_index_array);
        var large_multiple_fifty_percent_dose_distance = [];
        for (var i = 1; i < large_multiple_left_fifty_percent_dose_index_array.length; i++) {
            large_multiple_fifty_percent_dose_distance[i] = Math.abs((large_multiple_right_fifty_percent_dose_index_array[i] - large_multiple_left_fifty_percent_dose_index_array[i]) * 0.4 - 160);
        }
        var large_multiple_max_fifty_percent_dose_distance_D_value = large_multiple_fifty_percent_dose_distance[1];
        for (var i = 2; i < large_multiple_fifty_percent_dose_distance.length; i++) {
            if (large_multiple_fifty_percent_dose_distance[i] > large_multiple_max_fifty_percent_dose_distance_D_value) {
                large_multiple_max_fifty_percent_dose_distance_D_value = large_multiple_fifty_percent_dose_distance[i];
            }
        }
        console.log("large_multiple_max_fifty_percent_dose_distance_D_value is " + large_multiple_max_fifty_percent_dose_distance_D_value);
        var ISO_large_multiple_max_fifty_percent_dose_distance_D_value = large_multiple_max_fifty_percent_dose_distance_D_value / 1.6;
        return ISO_large_multiple_max_fifty_percent_dose_distance_D_value;
    }
}
//no check
function cal_large_muliiple_limiting(rows, columns, first_pixel_data_16, first_pixel_data_8, pairs_number, second_pixel_data_16, second_pixel_data_8) {
    //6.4.1 Digital indication of radiation field(multiple beam limiting :10*40  40 pairs/80 pairs )
    //cal 40 pairs
    let first_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, first_pixel_data_16);
    let first_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    var first_cal_array = [];
    var boundray_value = 200;
    for (var i = 0; i < rows * columns; i++) {
        first_cal_array[i] = 65535 - first_pixel_data_8[i];
    }
    for (var i = 0; i < rows * columns; i++) {
        if (first_pixel_data_8[i] > boundray_value) {
            first_pixel_data_8[i] = 0;
        }
    }
    let first_bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    let first_penumbra_mat = cv.matFromArray(rows, columns, cv.CV_16UC1, first_cal_array);
    console.log("binarization");
    console.log(first_pixel_data_8);
    let first_contours = new cv.MatVector();
    let first_hierarchy = new cv.Mat();
    cv.findContours(first_bin_mat_8, first_contours, first_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let first_cnt = first_contours.get(0);
    let first_moments = cv.moments(first_cnt, false);
    let first_cx = first_moments.m10 / first_moments.m00;
    let first_cy = first_moments.m01 / first_moments.m00;
    console.log(first_cx, first_cy);
    let first_int_cx = parseInt(first_cx); //type conversion
    let first_int_cy = parseInt(first_cy);
    var first_left_Boundary_subscript_index_x;
    for (var i = 1; i < first_int_cy; i++) {
        if (first_mat_8.ucharAt(first_int_cx, i) < boundray_value) {
            first_left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var first_right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > first_int_cy; i--) {
        if (first_mat_8.ucharAt(first_int_cx, i) < boundray_value) {
            first_right_Boundary_subscript_index_x = i;
            break;
        }
    }
    var first_up_Boundary_subscript_index_y;
    for (var i = 0; i < first_int_cx; i++) {
        if (first_mat_8.ucharAt(i, first_int_cy) < boundray_value) {
            first_up_Boundary_subscript_index_y = i;
            break;
        }
    }
    var first_down_Boundary_subscript_index_y;
    for (var i = rows - 1; i > first_int_cx; i--) {
        if (first_mat_8.ucharAt(first_int_cx, i) < boundray_value) {
            first_down_Boundary_subscript_index_y = i;
            break;
        }
    }
    var first_left_dose_value = parseInt(first_penumbra_mat.ushortAt(first_int_cx, first_int_cy));
    console.log("value is  " + first_penumbra_mat.ushortAt(first_int_cx, first_int_cy));
    var first_left_min_pixel_value = first_penumbra_mat.ushortAt(first_int_cx, first_int_cy);
    for (var i = first_left_Boundary_subscript_index_x; i < first_int_cy; i++) {
        if (first_penumbra_mat.ushortAt(first_int_cx, i) < first_left_min_pixel_value) {
            first_left_min_pixel_value = first_penumbra_mat.ushortAt(first_int_cx, i);
        }
    }
    var first_right_min_pixel_value = first_penumbra_mat.ushortAt(first_int_cx, first_int_cy);
    for (var j = first_int_cy; j < first_right_Boundary_subscript_index_x; j++) {
        if (first_penumbra_mat.ushortAt(first_int_cx, j) < first_right_min_pixel_value) {
            first_right_min_pixel_value = first_penumbra_mat.ushortAt(first_int_cx, j);
        }
    }
    var first_left_center_min_D_value = first_left_dose_value - first_left_min_pixel_value;
    var first_right_center_min_D_value = first_left_dose_value - first_right_min_pixel_value;
    console.log("first_left_min_pixel_value is " + first_left_min_pixel_value);
    console.log("first_right_min_pixel_value is " + first_right_min_pixel_value);
    var first_left_fifty_percent_dose_value = parseInt(first_left_center_min_D_value / 2 + first_left_min_pixel_value);
    console.log(first_left_dose_value, 'first left %50 dose value is ' + first_left_fifty_percent_dose_value);
    var first_right_fifty_percent_dose_value = parseInt(first_right_center_min_D_value / 2 + first_right_min_pixel_value);
    console.log(first_left_dose_value, 'first right %50 dose value is ' + first_right_fifty_percent_dose_value);
    let second_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, second_pixel_data_16);
    let second_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    var second_cal_array = [];
    for (var i = 0; i < rows * columns; i++) {
        second_cal_array[i] = 65535 - second_pixel_data_8[i];
    }
    for (var i = 0; i < rows * columns; i++) {
        if (second_pixel_data_8[i] > boundray_value) {
            second_pixel_data_8[i] = 0;
        }
    }
    let second_bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    let second_penumbra_mat = cv.matFromArray(rows, columns, cv.CV_16UC1, second_cal_array);
    console.log("binarization");
    console.log(second_pixel_data_8);
    let second_contours = new cv.MatVector();
    let second_hierarchy = new cv.Mat();
    cv.findContours(second_bin_mat_8, second_contours, second_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let second_cnt = second_contours.get(0);
    let second_moments = cv.moments(second_cnt, false);
    let second_cx = second_moments.m10 / second_moments.m00;
    let second_cy = second_moments.m01 / second_moments.m00;
    console.log(second_cx, second_cy);
    let second_int_cx = parseInt(second_cx); //type conversion
    let second_int_cy = parseInt(second_cy);
    var second_left_Boundary_subscript_index_x;
    for (var i = 1; i < second_int_cy; i++) {
        if (second_mat_8.ucharAt(second_int_cx, i) < boundray_value) {
            second_left_Boundary_subscript_index_x = i;
            break;
        }
    }
    var second_right_Boundary_subscript_index_x;
    for (var i = columns - 1; i > second_int_cy; i--) {
        if (second_mat_8.ucharAt(second_int_cx, i) < boundray_value) {
            second_right_Boundary_subscript_index_x = i;
            break;
        }
    }
    var second_up_Boundary_subscript_index_y;
    for (var i = 0; i < second_int_cx; i++) {
        if (second_mat_8.ucharAt(i, second_int_cy) < boundray_value) {
            second_up_Boundary_subscript_index_y = i;
            break;
        }
    }
    var second_down_Boundary_subscript_index_y;
    for (var i = rows - 1; i > second_int_cx; i--) {
        if (second_mat_8.ucharAt(second_int_cx, i) < boundray_value) {
            second_down_Boundary_subscript_index_y = i;
            break;
        }
    }
    var second_left_dose_value = parseInt(second_penumbra_mat.ushortAt(second_int_cx, second_int_cy));
    console.log("value is  " + second_penumbra_mat.ushortAt(second_int_cx, second_int_cy));
    var second_left_min_pixel_value = second_penumbra_mat.ushortAt(second_int_cx, second_int_cy);
    for (var i = second_left_Boundary_subscript_index_x; i < second_int_cy; i++) {
        if (second_penumbra_mat.ushortAt(second_int_cx, i) < second_left_min_pixel_value) {
            second_left_min_pixel_value = second_penumbra_mat.ushortAt(second_int_cx, i);
        }
    }
    var second_right_min_pixel_value = second_penumbra_mat.ushortAt(second_int_cx, second_int_cy);
    for (var j = second_int_cy; j < second_right_Boundary_subscript_index_x; j++) {
        if (second_penumbra_mat.ushortAt(second_int_cx, j) < second_right_min_pixel_value) {
            second_right_min_pixel_value = second_penumbra_mat.ushortAt(second_int_cx, j);
        }
    }
    var second_left_center_min_D_value = second_left_dose_value - second_left_min_pixel_value;
    var second_right_center_min_D_value = second_left_dose_value - second_right_min_pixel_value;
    console.log("second_left_min_pixel_value is " + second_left_min_pixel_value);
    console.log("second_right_min_pixel_value is " + second_right_min_pixel_value);
    var second_left_fifty_percent_dose_value = parseInt(second_left_center_min_D_value / 2 + second_left_min_pixel_value);
    console.log(second_left_dose_value, 'second left %50 dose value is ' + second_left_fifty_percent_dose_value);
    var second_right_fifty_percent_dose_value = parseInt(second_right_center_min_D_value / 2 + second_right_min_pixel_value);
    console.log(second_left_dose_value, 'second right %50 dose value is ' + second_right_fifty_percent_dose_value);
    if (pairs_number == 40) {
        var double_first_multiple_Grating_spacing = (10 * 1.6) / 2;
        var double_first_Grating_spacing_index_number = double_first_multiple_Grating_spacing / 0.4;
        var double_first_multiple_left_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = first_left_Boundary_subscript_index_x; i < first_int_cy; i++) {
                if (Math.abs(first_penumbra_mat.ushortAt(first_up_Boundary_subscript_index_y + j * double_first_Grating_spacing_index_number, i) - first_left_fifty_percent_dose_value) < 2) {
                    double_first_multiple_left_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_left_fifty_percent_dose_index_array");
        console.log(double_first_multiple_left_fifty_percent_dose_index_array);
        var double_first_multiple_right_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = int_cy; i < right_Boundary_subscript_index_x; i++) {
                if (Math.abs(penumbra_mat.ushortAt(first_up_Boundary_subscript_index_y + j * double_first_Grating_spacing_index_number, i) - first_right_fifty_percent_dose_value) < 2) {
                    double_first_multiple_right_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_right_fifty_percent_dose_index_array");
        console.log(double_first_multiple_right_fifty_percent_dose_index_array);
        var double_first_multiple_fifty_percent_dose_distance = [];
        for (var i = 1; i < double_first_multiple_left_fifty_percent_dose_index_array.length; i++) {
            double_first_multiple_fifty_percent_dose_distance[i] = Math.abs((double_first_multiple_right_fifty_percent_dose_index_array[i] - double_first_multiple_left_fifty_percent_dose_index_array[i]) * 0.4 - 160);
        }
        var double_first_multiple_max_fifty_percent_dose_distance_D_value = double_first_multiple_fifty_percent_dose_distance[1];
        for (var i = 2; i < double_first_multiple_fifty_percent_dose_distance.length; i++) {
            if (double_first_multiple_fifty_percent_dose_distance[i] >= double_first_multiple_max_fifty_percent_dose_distance_D_value) {
                double_first_multiple_max_fifty_percent_dose_distance_D_value = double_first_multiple_fifty_percent_dose_distance[i];
            }
        }
        console.log("double_first_multiple_max_fifty_percent_dose_distance_D_value is " + double_first_multiple_max_fifty_percent_dose_distance_D_value);
        var double_second_multiple_Grating_spacing = (10 * 1.6) / 2;
        var double_second_Grating_spacing_index_number = double_second_multiple_Grating_spacing / 0.4;
        var double_second_multiple_left_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = left_Boundary_subscript_index_x; i < int_cy; i++) {
                if (Math.abs(penumbra_mat.ushortAt(second_up_Boundary_subscript_index_y + j * double_second_Grating_spacing_index_number, i) - second_left_fifty_percent_dose_value) < 2) {
                    double_second_multiple_left_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_left_fifty_percent_dose_index_array");
        console.log(double_second_multiple_left_fifty_percent_dose_index_array);
        var double_second_multiple_right_fifty_percent_dose_index_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = int_cy; i < right_Boundary_subscript_index_x; i++) {
                if (Math.abs(penumbra_mat.ushortAt(second_up_Boundary_subscript_index_y + j * double_second_Grating_spacing_index_number, i) - second_right_fifty_percent_dose_value) < 2) {
                    double_second_multiple_right_fifty_percent_dose_index_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_right_fifty_percent_dose_index_array");
        console.log(double_second_multiple_right_fifty_percent_dose_index_array);
        var double_second_multiple_fifty_percent_dose_distance = [];
        for (var i = 1; i < double_second_multiple_left_fifty_percent_dose_index_array.length; i++) {
            double_second_multiple_fifty_percent_dose_distance[i] = Math.abs((double_second_multiple_right_fifty_percent_dose_index_array[i] - double_second_multiple_left_fifty_percent_dose_index_array[i]) * 0.4 - 160);
        }
        var double_second_multiple_max_fifty_percent_dose_distance_D_value = double_second_multiple_fifty_percent_dose_distance[1];
        for (var i = 2; i < double_second_multiple_fifty_percent_dose_distance.length; i++) {
            if (double_second_multiple_fifty_percent_dose_distance[i] > double_second_multiple_max_fifty_percent_dose_distance_D_value) {
                double_second_multiple_max_fifty_percent_dose_distance_D_value = double_second_multiple_fifty_percent_dose_distance[i];
            }
        }
        console.log("double_second_multiple_max_fifty_percent_dose_distance_D_value is " + double_second_multiple_max_fifty_percent_dose_distance_D_value);
        var double_multiple_max_fifty_percent_dose_distance_D_value_s = (double_second_multiple_max_fifty_percent_dose_distance_D_value > double_first_multiple_max_fifty_percent_dose_distance_D_value) ? double_second_multiple_max_fifty_percent_dose_distance_D_value : double_first_multiple_max_fifty_percent_dose_distance_D_value;
        console.log("double_multiple_max_fifty_percent_dose_distance_D_value_s is " + double_multiple_max_fifty_percent_dose_distance_D_value_s);
        return double_multiple_max_fifty_percent_dose_distance_D_value_s;
    }
    //80 pairs
    else {
        var double_first_multiple_Grating_spacing_l = (10 * 0.8) / 2;
        var double_first_Grating_spacing_index_number_l = double_first_multiple_Grating_spacing_l / 0.4;
        var double_first_multiple_left_fifty_percent_dose_index_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = first_left_Boundary_subscript_index_x; i < first_int_cy; i++) {
                if (Math.abs(first_penumbra_mat.ushortAt(first_up_Boundary_subscript_index_y + j * double_first_Grating_spacing_index_number_l, i) - first_left_fifty_percent_dose_value) < 2) {
                    double_first_multiple_left_fifty_percent_dose_index_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_left_fifty_percent_dose_index_array_l");
        console.log(double_first_multiple_left_fifty_percent_dose_index_array_l);
        var double_first_multiple_right_fifty_percent_dose_index_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = first_int_cy; i < first_right_Boundary_subscript_index_x; i++) {
                if (Math.abs(first_penumbra_mat.ushortAt(first_up_Boundary_subscript_index_y + j * double_first_Grating_spacing_index_number_l, i) - first_right_fifty_percent_dose_value) < 2) {
                    double_first_multiple_right_fifty_percent_dose_index_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_right_fifty_percent_dose_index_array_l");
        console.log(double_first_multiple_right_fifty_percent_dose_index_array_l);
        var double_first_multiple_fifty_percent_dose_distance_l = [];
        for (var i = 1; i < double_first_multiple_left_fifty_percent_dose_index_array_l.length; i++) {
            double_first_multiple_fifty_percent_dose_distance_l[i] = Math.abs((double_first_multiple_right_fifty_percent_dose_index_array_l[i] - double_first_multiple_left_fifty_percent_dose_index_array_l[i]) * 0.4 - 160);
        }
        var double_first_multiple_max_fifty_percent_dose_distance_D_value_l = double_first_multiple_fifty_percent_dose_distance_l[1];
        for (var i = 2; i < double_first_multiple_fifty_percent_dose_distance_l.length; i++) {
            if (double_first_multiple_fifty_percent_dose_distance_l[i] > double_first_multiple_max_fifty_percent_dose_distance_D_value_l) {
                double_first_multiple_max_fifty_percent_dose_distance_D_value_l = double_first_multiple_fifty_percent_dose_distance_l[i];
            }
        }
        console.log("double_first_multiple_max_fifty_percent_dose_distance_D_value_l is " + double_first_multiple_max_fifty_percent_dose_distance_D_value_l);
        var double_second_multiple_Grating_spacing_l = (10 * 0.8) / 2;
        var double_second_Grating_spacing_index_number_l = double_second_multiple_Grating_spacing_l / 0.4;
        var double_second_multiple_left_fifty_percent_dose_index_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = second_left_Boundary_subscript_index_x; i < second_int_cy; i++) {
                if (Math.abs(second_penumbra_mat.ushortAt(second_up_Boundary_subscript_index_y + j * double_second_Grating_spacing_index_number_l, i) - second_left_fifty_percent_dose_value) < 2) {
                    double_second_multiple_left_fifty_percent_dose_index_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_left_fifty_percent_dose_index_array_l");
        console.log(double_second_multiple_left_fifty_percent_dose_index_array_l);
        var double_second_multiple_right_fifty_percent_dose_index_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = second_int_cy; i < second_right_Boundary_subscript_index_x; i++) {
                if (Math.abs(second_penumbra_mat.ushortAt(second_up_Boundary_subscript_index_y + j * double_second_Grating_spacing_index_number_l, i) - second_right_fifty_percent_dose_value) < 2) {
                    double_second_multiple_right_fifty_percent_dose_index_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_right_fifty_percent_dose_index_array_l");
        console.log(double_second_multiple_right_fifty_percent_dose_index_array_l);
        var double_second_multiple_fifty_percent_dose_distance_l = [];
        for (var i = 1; i < double_second_multiple_left_fifty_percent_dose_index_array_l.length; i++) {
            double_second_multiple_fifty_percent_dose_distance_l[i] = Math.abs((double_second_multiple_right_fifty_percent_dose_index_array_l[i] - double_second_multiple_left_fifty_percent_dose_index_array_l[i]) * 0.4 - 160);
        }
        var double_second_multiple_max_fifty_percent_dose_distance_D_value_l = double_second_multiple_fifty_percent_dose_distance_l[1];
        for (var i = 2; i < double_second_multiple_fifty_percent_dose_distance_l.length; i++) {
            if (double_second_multiple_fifty_percent_dose_distance_l[i] > double_second_multiple_max_fifty_percent_dose_distance_D_value_l) {
                double_second_multiple_max_fifty_percent_dose_distance_D_value_l = double_second_multiple_fifty_percent_dose_distance_l[i];
            }
        }
        console.log("double_second_multiple_max_fifty_percent_dose_distance_D_value_l is " + double_second_multiple_max_fifty_percent_dose_distance_D_value_l);
        var double_multiple_max_fifty_percent_dose_distance_D_value_l = (double_second_multiple_max_fifty_percent_dose_distance_D_value_l > double_first_multiple_max_fifty_percent_dose_distance_D_value_l) ? double_second_multiple_max_fifty_percent_dose_distance_D_value_l : double_first_multiple_max_fifty_percent_dose_distance_D_value_l;
        console.log("double_multiple_max_fifty_percent_dose_distance_D_value_l is " + double_multiple_max_fifty_percent_dose_distance_D_value_l);
        return double_multiple_max_fifty_percent_dose_distance_D_value_l;
    }
}
export {
    cal_symmetry,
    cal_uniformity,
    cal_position_indication,
    cal_scale_position,
    cal_penumbra,
    cal_unit_limiting,
    cal_small_multiple_limiting,
    cal_large_muliiple_limiting
}
//  export {
//     cal_symmetry,cal_uniformity,cal_position_indication
//   }

//exports = module.exports = {cal_symmetry};