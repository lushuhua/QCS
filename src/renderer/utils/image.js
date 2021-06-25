//var  THRESH_BINARY = require('opencv-wasm/opencv.js');
const { cv } = require('opencv-wasm')
    //const { THRESH_BINARY, morphologyDefaultBorderValue, Point, threshold, DCT_ROWS } = require('opencv-wasm/opencv.js');
    //const { Mat  } = require('opencv-wasm/opencv.js');
    //const {  THRESH_OTSU,  THRESH_TRIANGLE,  CONTOURS_MATCH_I1  }  = require('opencv-wasm/opencv.js');
    //6.3.1 x射线方形照射野的对称性
function cal_symmetry(rows, columns, pixel_data_16, pixel_data_8) {
    //6.3.1  Symmetry of square X-ray field
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lbs_index:left_Boundary_subscript_index
    var lbs_index;
    for (var i = 1; i < int_cy; i++) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            lbs_index = i;
            break;
        }
    }
    //rbs_index:right_Boundary_subscript_index
    var rbs_index;
    var rbs_init = columns - 1;
    for (var i = rbs_init; i > int_cy; i--) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            rbs_index = i;
            break;
        }
    }
    if (lbs_index == undefined || rbs_index == undefined) {
        return undefined;
    }
    //lmp_value:left_min_pixel_value
    var lmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = lbs_index; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < lmp_value) {
            lmp_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    //rmp_value:right_min_pixel_value
    var rmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < rbs_index; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < rmp_value) {
            rmp_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    //cd_value:center_dose_value
    var cd_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    //lcmD_value:left_center_min_D_value
    var lcmD_value = cd_value - lmp_value;
    //rcmD_value: right_center_min_D_value
    var rcmD_value = cd_value - rmp_value;
    //lfpd_value:left_fifty_percent_dose_value
    var lfpd_value = parseInt(lcmD_value / 2 + lmp_value);
    console.log(cd_value, 'left %50 dose value is ' + lfpd_value);
    // rfpd_value:right_fifty_percent_dose_value
    var rfpd_value = parseInt(rcmD_value / 2 + rmp_value);
    console.log(cd_value, 'right %50 dose value is ' + rfpd_value);
    //lfpd_index:left_fifty_percent_dose_index
    var lfpd_index;
    for (var i = lbs_index; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - lfpd_value) < 5) {
            lfpd_index = i;
            break;
        }
    }
    //rfpd_index:right_fifty_percent_dose_index
    var rfpd_index;
    for (var i = int_cy; i < rbs_index; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - rfpd_value) < 5) {
            rfpd_index = i;
            break;
        }
    }
    //Slb_index:Symmetry_left_boundary_index
    var Slf_index = parseInt(int_cy - ((int_cy - lfpd_index) * 0.8));
    //Srb_index:Symmetry_right_boundary_index
    var Srb_index = parseInt(((rfpd_index - int_cy) * 0.8) + int_cy);
    //Slb_distance:Symmetry_left_boundary_distance
    var Slb_distance = (int_cy - lfpd_index) * 0.8 * 0.4;
    //Srb_distance:Symmetry_right_boundary_distance
    var Srb_distance = (rfpd_index - int_cy) * 0.8 * 0.4;
    //SS_distance:Symmetry_Selected_distance
    var SS_distance = parseInt((Slb_distance < Srb_distance) ? Slb_distance : Srb_distance);
    console.log('SS_distance is ' + SS_distance);
    //SSl_index: Symmetry_Selected_left_index
    var SSl_index = parseInt(int_cy - SS_distance / 0.4);
    //SSr_index: Symmetry_Selected_right_index
    var SSr_index = parseInt(int_cy + SS_distance / 0.4);
    //ld_array:left_dose_array
    var ld_array = [];
    for (var i = SSl_index, j = 0; i < int_cy; i++, j++) {
        ld_array[j] = penumbra_mat.ushortAt(int_cx, i);
    }
    console.log("ld_array :");
    console.log(ld_array);
    //rd_array:right_dose_array
    var rd_array = [];
    for (var i = SSr_index, j = 0; i > int_cy; i--, j++) {
        rd_array[j] = penumbra_mat.ushortAt(int_cx, i);
    }
    console.log("rd_array :");
    console.log(rd_array);
    //S_array:Symmetry_array
    var S_array = [];
    var len = ld_array.length;
    for (var i = 0; i < len; i++) {
        S_array[i] = rd_array[i] / ld_array[i];
    }
    var max_Symmetry = S_array[0];
    console.log("original  max_Symmetry is " + max_Symmetry);
    for (var i = 1; i < len; i++) {
        if (S_array[i] > max_Symmetry) {
            max_Symmetry = S_array[i];
        }
    }
    if (max_Symmetry == undefined) {
        return undefined;
    }
    console.log("S_array");
    console.log(S_array);
    console.log("Slb_index,Srb_index is " + Slf_index, Srb_index);
    console.log("SSl_index,SSr_index is " + SSl_index, SSr_index);
    console.log("Slb_distance,Srb_distance is " + Slb_distance, Srb_distance);
    console.log("final max_Symmetry is " + max_Symmetry);
    return max_Symmetry;
}
//6.3.1 x射线方形照射野的均整度
function cal_uniformity(rows, columns, pixel_data_16, pixel_data_8, image_shape) {
    // 6.3.1 Uniformity of square X-ray irradiation field
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lbs_index:left_Boundary_subscript_index
    var lbs_index;
    for (var i = 1; i < int_cy; i++) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            lbs_index = i;
            break;
        }
    }
    //rbs_index:right_Boundary_subscript_index
    var rbs_index;
    var rbs_init = columns - 1;
    for (var i = rbs_init; i > int_cy; i--) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            rbs_index = i;
            break;
        }
    }
    if (lbs_index == undefined || rbs_index == undefined) {
        return undefined;
    }
    //max_dvx:max_dose_value_x
    var max_dvx = penumbra_mat.ushortAt(int_cx, half_int_cy + indent);
    //min_dvx:min_dose_value_x
    var min_dvx = penumbra_mat.ushortAt(int_cx, half_int_cy + indent);
    //max_dvy:max_dose_value_y
    var max_dvy = penumbra_mat.ushortAt(half_int_cx + indent, int_cy);
    //min_dvy:min_dose_value_y
    var min_dvy = penumbra_mat.ushortAt(half_int_cx + indent, int_cy);
    console.log('center value is ' + penumbra_mat.ushortAt(int_cx, int_cy + indent));
    console.log('original max_dose_value_x is ' + max_dvx);
    console.log('original min_dose_value_x is ' + min_dvx);
    console.log('original max_dose_value_y is ' + max_dvy);
    console.log('original min_dose_value_y is ' + min_dvy);
    console.log(penumbra_mat.ushortAt(int_cx, half_int_cy));
    var i_init = half_int_cy + indent;
    var i_end = int_cy + int_cy - half_int_cy - indent;
    for (var i = i_init; i < i_end; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) > max_dvx) {
            max_dvx = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    for (var i = i_init; i < i_end; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < min_dvx) {
            min_dvx = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    var m_init = half_int_cx + indent;
    var m_end = int_cx + int_cx - half_int_cx - indent;
    for (var i = m_init; i < m_end; i++) {
        if (penumbra_mat.ushortAt(i, int_cy) > max_dvy) {
            max_dvy = penumbra_mat.ushortAt(i, int_cy);
        }
    }
    for (var i = m_init; i < m_end; i++) {
        if (penumbra_mat.ushortAt(i, int_cy) < min_dvy) {
            min_dvy = penumbra_mat.ushortAt(i, int_cy);
        }
    }
    var Uniformity_x = max_dvx / min_dvx;
    var Uniformity_y = max_dvy / min_dvy;
    var Uniformity;
    /*   if (Uniformity_x > Uniformity_y) {
          Uniformity = Uniformity_x;
      } else {
          Uniformity = Uniformity_y;
      } */
    var Uniformity = (Uniformity_x > Uniformity_y) ? Uniformity_x : Uniformity_y;
    console.log('max_dose_value_x is ' + max_dvx);
    console.log('min_dose_value_x is ' + min_dvx);
    console.log('max_dose_value_y is ' + max_dvy);
    console.log('mix_dose_value_y is ' + min_dvy);
    console.log("uniformity_x is " + Uniformity_x);
    console.log("uniformity_y is " + Uniformity_y);
    console.log("uniformity is " + Uniformity);
    return Uniformity;
}
//6.4.2 辐射束轴在患者入射表面的位置指示
function cal_position_indication(rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape) {
    //6.4.2 Position indication of radiation beam axis on the patient's incident surface
    let first_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, first_pixel_data_16);
    let first_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    //fc_array:first_cal_array
    var fc_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        fc_array[i] = 65535 - first_pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
        if (first_pixel_data_8[i] > boundray_value) {
            first_pixel_data_8[i] = 0;
        }
    }
    //fbm_8:first_bin_mat_8
    let fbm_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    //fpm:first_penumbra_mat
    let fpm = cv.matFromArray(rows, columns, cv.CV_16UC1, fc_array);
    console.log("binarization");
    console.log(first_pixel_data_8);
    //f_contours:first_contours
    let f_contours = new cv.MatVector();
    //f_hierarchy:first_hierarchy
    let f_hierarchy = new cv.Mat();
    cv.findContours(fbm_8, f_contours, f_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let first_cnt = f_contours.get(0);
    let first_moments = cv.moments(first_cnt, false);
    let first_cx = first_moments.m10 / first_moments.m00;
    let first_cy = first_moments.m01 / first_moments.m00;
    console.log(first_cx, first_cy);
    //f_int_cx:first_int_cx
    let f_int_cx = parseInt(first_cx); //type conversion
    //f_int_cy:first_int_cy
    let f_int_cy = parseInt(first_cy);
    //flbs_index:first_left_Boundary_subscript_index
    var flbs_index;
    for (var i = 1; i < f_int_cy; i++) {
        if (first_mat_8.ucharAt(f_int_cx, i) < boundray_value) {
            flbs_index = i;
            break;
        }
    }
    //frbs_index:first_right_Boundary_subscript_index
    var frbs_index;
    var frbs_init = columns - 1;
    for (var i = frbs_init; i > f_int_cy; i--) {
        if (first_mat_8.ucharAt(f_int_cx, i) < boundray_value) {
            frbs_index = i;
            break;
        }
    }
    if (flbs_index == undefined || frbs_index == undefined) {
        return undefined;
    }
    //flmp_value:first_left_min_pixel_value
    var flmp_value = fpm.ushortAt(f_int_cx, f_int_cy);
    for (var i = flbs_index; i < f_int_cy; i++) {
        if (fpm.ushortAt(f_int_cx, i) < flmp_value) {
            flmp_value = fpm.ushortAt(f_int_cx, i);
        }
    }
    //frmp_value:first_right_min_pixel_value
    var frmp_value = fpm.ushortAt(f_int_cx, f_int_cy);
    for (var j = f_int_cy; j < frbs_index; j++) {
        if (fpm.ushortAt(f_int_cx, j) < frmp_value) {
            frmp_value = fpm.ushortAt(f_int_cx, j);
        }
    }
    //fcd_value:first_center_dose_value
    var fcd_value = parseInt(fpm.ushortAt(f_int_cx, f_int_cy));
    //flcmD_value:first_left_center_min_D_value
    var flcmD_value = fcd_value - flmp_value;
    //frcmD_value:first_right_center_min_D_value
    var frcmD_value = fcd_value - frmp_value;
    //flfpd_value:first_left_fifty_percent_dose_value
    var flfpd_value = parseInt(flcmD_value / 2 + flmp_value);
    console.log(fcd_value, 'first left %50 dose value is ' + flfpd_value);
    //frfpd_value:first_right_fifty_percent_dose_value
    var frfpd_value = parseInt(frcmD_value / 2 + frmp_value);
    console.log(fcd_value, 'first right %50 dose value is ' + frfpd_value);
    //flfpd_index:first_left_fifty_percent_dose_index
    var flfpd_index;
    for (var i = flbs_index; i < f_int_cy; i++) {
        if (Math.abs(fpm.ushortAt(f_int_cx, i) - flfpd_value) < 5) {
            flfpd_index = i;
            break;
        }
    }
    //frfpd_index:first_right_fifty_percent_dose_index
    var frfpd_index;
    for (var i = f_int_cy; i < frbs_index; i++) {
        if (Math.abs(fpm.ushortAt(f_int_cx, i) - frfpd_value) < 5) {
            frfpd_index = i;
            break;
        }
    }
    //ff_distance:first_fifty_distance
    var ff_distance = (frfpd_index - flfpd_index) * 0.4;
    //Iff_distance:ISO_first_fifty_distance
    var Iff_distance = ff_distance - 320;
    //IfD_distance:ISO_first_D_distance
    var IfD_distance = Iff_distance / 1.6;
    let second_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, second_pixel_data_16);
    let second_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    var second_cal_array = [];
    for (var i = 0; i < rc; i++) {
        second_cal_array[i] = 65535 - second_pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
        if (second_pixel_data_8[i] > boundray_value) {
            second_pixel_data_8[i] = 0;
        }
    }
    //sbm_8:second_bin_mat_8 
    let sbm_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    //spm:second_penumbra_mat
    let spm = cv.matFromArray(rows, columns, cv.CV_16UC1, second_cal_array);
    console.log("binarization");
    console.log(second_pixel_data_8);
    let second_contours = new cv.MatVector();
    let second_hierarchy = new cv.Mat();
    cv.findContours(sbm_8, second_contours, second_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let second_cnt = second_contours.get(0);
    let second_moments = cv.moments(second_cnt, false);
    let second_cx = second_moments.m10 / second_moments.m00;
    let second_cy = second_moments.m01 / second_moments.m00;
    console.log(second_cx, second_cy);
    //s_int_cx:second_int_cx
    let s_int_cx = parseInt(second_cx); //type conversion
    //s_int_cy:second_int_cy
    let s_int_cy = parseInt(second_cy);
    //slbs_index:second_left_Boundary_subscript_index
    var slbs_index;
    for (var i = 1; i < s_int_cy; i++) {
        if (second_mat_8.ucharAt(s_int_cx, i) < boundray_value) {
            slbs_index = i;
            break;
        }
    }
    //srbs_index:second_right_Boundary_subscript_index
    var srbs_index;
    var srbs_init = columns - 1;
    for (var i = srbs_init; i > s_int_cy; i--) {
        if (second_mat_8.ucharAt(s_int_cx, i) < boundray_value) {
            srbs_index = i;
            break;
        }
    }
    if (slbs_index == undefined || srbs_index == undefined) {
        return undefined;
    }
    //slmp_value:second_left_min_pixel_value
    var slmp_value = spm.ushortAt(s_int_cx, s_int_cy);
    for (var i = slbs_index; i < s_int_cy; i++) {
        if (spm.ushortAt(s_int_cx, i) < slmp_value) {
            slmp_value = spm.ushortAt(s_int_cx, i);
        }
    }
    //srmp_value:second_right_min_pixel_value
    var srmp_value = spm.ushortAt(s_int_cx, s_int_cy);
    for (var j = s_int_cy; j < srbs_index; j++) {
        if (spm.ushortAt(s_int_cx, j) < srmp_value) {
            srmp_value = spm.ushortAt(s_int_cx, j);
        }
    }
    //scs_value:second_center_dose_value
    var scs_value = parseInt(spm.ushortAt(s_int_cx, s_int_cy));
    //slcmD_value:second_left_center_min_D_value
    var slcmD_value = scs_value - slmp_value;
    //srcmD_value:second_right_center_min_D_value
    var srcmD_value = scs_value - srmp_value;
    //slfpd_value:second_left_fifty_percent_dose_value
    var slfpd_value = parseInt(slcmD_value / 2 + slmp_value);
    console.log(scs_value, 'second left %50 dose value is ' + slfpd_value);
    //srfpd_value:second_right_fifty_percent_dose_value
    var srfpd_value = parseInt(srcmD_value / 2 + srmp_value);
    console.log(scs_value, 'second right %50 dose value is ' + srfpd_value);
    //slfpd_index:second_left_fifty_percent_dose_index
    var slfpd_index;
    for (var i = slbs_index; i < s_int_cy; i++) {
        if (Math.abs(spm.ushortAt(s_int_cx, i) - slfpd_value) < 5) {
            slfpd_index = i;
            break;
        }
    }
    //srfpd_index:second_right_fifty_percent_dose_index
    var srfpd_index;
    for (var i = s_int_cy; i < srbs_index; i++) {
        if (Math.abs(spm.ushortAt(s_int_cx, i) - srfpd_value) < 5) {
            srfpd_index = i;
            break;
        }
    }
    //sf_distance:second_fifty_distance
    var sf_distance = (srfpd_index - slfpd_index) * 0.4;
    //Isf_distance:ISO_second_fifty_distance
    var Isf_distance = sf_distance - 320;
    //IsD_distance:ISO_second_D_distance
    var IsD_distance = Isf_distance / 1.6;
    //ID_distance:ISO_D_distance
    var ID_distance = Math.abs(IfD_distance - IsD_distance);
    console.log("first ISO_D_distance :" + IfD_distance + "second ISO_D_distance :" + IsD_distance);
    console.log("position indiciation :" + ID_distance);
    return ID_distance;
}
//6.6.2 旋转运动标尺的零刻度位置
function cal_scale_position(rows, columns, first_pixel_data_16, first_pixel_data_8, first_image_shape, second_pixel_data_16, second_pixel_data_8, second_image_shape) {
    //6.6.2 Zero scale position of rotary motion ruler
    let first_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, first_pixel_data_16);
    let first_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        if (first_pixel_data_8[i] > boundray_value) {
            first_pixel_data_8[i] = 0;
        }
    }
    //fbm_8:first_bin_mat_8
    let fbm_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    let first_contours = new cv.MatVector();
    let first_hierarchy = new cv.Mat();
    cv.findContours(fbm_8, first_contours, first_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let first_cnt = first_contours.get(0);
    let first_moments = cv.moments(first_cnt, false);
    let first_cx = first_moments.m10 / first_moments.m00;
    let first_cy = first_moments.m01 / first_moments.m00;
    //f_int_cx:first_int_cx
    let f_int_cx = parseInt(first_cx); //type conversion
    //f_int_cy:first_int_cy
    let f_int_cy = parseInt(first_cy);
    //fh_int_cx:irst_half_int_cx
    let fh_int_cx = parseInt(f_int_cx * 0.5);
    //fh_int_cy:first_half_int_cy
    let fh_int_cy = parseInt(f_int_cy * 0.5);
    //fi_distance:first_indent_distance
    let fi_distance = (first_image_shape / 10) * 1.2;
    let first_indent = Math.round(fi_distance / 0.4);
    console.log(f_int_cx, f_int_cy, fh_int_cx, fh_int_cy, first_indent);
    //calculate Boundary subscript
    //flbs_index:first_left_Boundary_subscript_index
    var flbs_index;
    for (var i = 1; i < f_int_cy; i++) {
        if (first_mat_8.ucharAt(f_int_cx, i) < boundray_value) {
            flbs_index = i;
            break;
        }
    }
    //frbs_index:first_right_Boundary_subscript_index
    var frbs_index;
    var frbs_init = columns - 1;
    for (var i = frbs_init; i > f_int_cy; i--) {
        if (first_mat_8.ucharAt(f_int_cx, i) < boundray_value) {
            frbs_index = i;
            break;
        }
    }
    if (flbs_index == undefined || frbs_index == undefined) {
        return undefined;
    }
    console.log('first left and right bounday index is ' + flbs_index, frbs_index);
    //fld_value:first_left_dose_value
    var fld_value = parseInt(first_mat_8.ucharAt(f_int_cx, f_int_cy) + first_mat_8.ucharAt(f_int_cx, flbs_index));
    //flhd_value:first_left_half_dose_value
    var flhd_value = parseInt(fld_value / 2);
    console.log(fld_value, 'left %50 dose value is ' + flhd_value);
    //frd_value:first_right_dose_value
    var frd_value = parseInt(first_mat_8.ucharAt(f_int_cx, f_int_cy) + first_mat_8.ucharAt(f_int_cx, frbs_index));
    //frhd_value:first_right_half_dose_value
    var frhd_value = parseInt(frd_value / 2);
    console.log(frd_value, 'right %50 dose value is ' + frhd_value);
    //fldv_index:first_left_dose_value_index
    var fldv_index;
    //frdv_index:first_right_dose_value_index
    var frdv_index;
    console.log('left index is ' + fldv_index);
    console.log('right index is ' + frdv_index);
    console.log(first_mat_8.data);
    for (var k = flbs_index; k < f_int_cy; k++) {
        if (Math.abs(first_mat_8.ucharAt(f_int_cx, k) - flhd_value) < 5) {
            fldv_index = k;
            break;
        }
    }
    console.log('left index is ' + fldv_index);
    for (var l = f_int_cy; l < frbs_index; l++) {
        if (Math.abs(first_mat_8.ucharAt(f_int_cx, l) - frhd_value) < 5) {
            frdv_index = l;
            break;
        }
    }
    console.log('right index is ' + frdv_index);
    //fhdv_distance:first_half_dose_value_distance
    var fhdv_distance = parseInt((frdv_index - fldv_index - 1) * 0.4);
    console.log('half_dose_value_distance is ' + fhdv_distance);
    //fD_distance：first_D_distance
    var fD_distance = fhdv_distance - 100;
    console.log("first D_distance is " + fD_distance);
    //  let second_mat_8=first_mat_8;
    let second_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, second_pixel_data_16);
    let second_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    for (var i = 0; i < rc; i++) {
        if (second_pixel_data_8[i] > boundray_value) {
            second_pixel_data_8[i] = 0;
        }
    }
    //sbm_8:second_bin_mat_8
    let sbm_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    let second_contours = new cv.MatVector();
    let second_hierarchy = new cv.Mat();
    cv.findContours(sbm_8, second_contours, second_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let second_cnt = second_contours.get(0);
    let second_moments = cv.moments(second_cnt, false);
    let second_cx = second_moments.m10 / second_moments.m00;
    let second_cy = second_moments.m01 / second_moments.m00;
    //s_int_cx:second_int_cx
    let s_int_cx = parseInt(second_cx); //type conversion
    //s_int_cy:second_int_cy
    let s_int_cy = parseInt(second_cy);
    //sh_int_cx:second_half_int_cx
    let sh_int_cx = parseInt(s_int_cx * 0.5);
    //sh_int_cy:second_half_int_cy
    let sh_int_cy = parseInt(s_int_cy * 0.5);
    //si_distance:second_indent_distance
    let si_distance = (second_image_shape / 10) * 1.2;
    let second_indent = Math.round(si_distance / 0.4);
    console.log(s_int_cx, s_int_cy, sh_int_cx, sh_int_cy, second_indent);
    //calculate Boundary subscript
    //slbs_index:second_left_Boundary_subscript_index
    var slbs_index;
    for (var i = 1; i < s_int_cy; i++) {
        if (second_mat_8.ucharAt(s_int_cx, i) < boundray_value) {
            slbs_index = i;
            break;
        }
    }
    //srbs_index:second_right_Boundary_subscript_index
    var srbs_index;
    var srbs_init = columns - 1;
    for (var i = srbs_init; i > s_int_cy; i--) {
        if (second_mat_8.ucharAt(s_int_cx, i) < boundray_value) {
            srbs_index = i;
            break;
        }
    }
    if (slbs_index == undefined || srbs_index == undefined) {
        return undefined;
    }
    console.log('second left and right bounday index is ' + slbs_index, srbs_index);
    //sld_value:second_left_dose_value
    var sld_value = parseInt(second_mat_8.ucharAt(s_int_cx, s_int_cy) + second_mat_8.ucharAt(s_int_cx, slbs_index));
    //slhd_value:second_left_half_dose_value
    var slhd_value = parseInt(sld_value / 2);
    console.log(sld_value, 'left %50 dose value is ' + slhd_value);
    //srd_value:second_right_dose_value
    var srd_value = parseInt(second_mat_8.ucharAt(s_int_cx, s_int_cy) + second_mat_8.ucharAt(s_int_cx, srbs_index));
    //srhd_value:second_right_half_dose_value
    var srhd_value = parseInt(srd_value / 2);
    console.log(frd_value, 'right %50 dose value is ' + srhd_value);
    //sldv_index:second_left_dose_value_index
    var sldv_index;
    //srdv_index:second_right_dose_value_index
    var srdv_index;
    for (var i = slbs_index; i < s_int_cy; i++) {
        if (Math.abs(second_mat_8.ucharAt(s_int_cx, i) - slhd_value) < 5) {
            sldv_index = i;
            break;
        }
    }
    console.log('left index is ' + sldv_index);
    for (var j = s_int_cy; j < srbs_index; j++) {
        if (Math.abs(second_mat_8.ucharAt(s_int_cx, j) - srhd_value) < 5) {
            srdv_index = j;
            break;
        }
    }
    console.log('right index is ' + srdv_index);
    //shdv_distance:second_half_dose_value_distance
    var shdv_distance = parseInt((srdv_index - sldv_index - 1) * 0.4);
    console.log('half_dose_value_distance is ' + shdv_distance);
    //sD_distance:second_D_distance
    var sD_distance = shdv_distance - 100;
    console.log("second D_value is " + sD_distance);
    var max_D_value;
    if (fD_distance > sD_distance) {
        max_D_value = fD_distance;
    } else {
        max_D_value = sD_distance;
    }
    console.log("two image max D_value is " + max_D_value);
    //fl_distance:first_left_distance
    var fl_distance = (f_int_cy - fldv_index) * 0.4;
    //sl_distance:second_left_distance
    var sl_distance = (s_int_cy - sldv_index) * 0.4;
    //fr_distance:first_right_distance
    var fr_distance = (frdv_index - f_int_cy) * 0.4;
    //sr_distance:second_right_distance
    var sr_distance = (srdv_index - s_int_cy) * 0.4;
    //tlD_distance:t_left_D_distance
    var tlD_distance = Math.abs(sl_distance - fl_distance);
    //trD_distance:t_right_D_distance
    var trD_distance = Math.abs(sr_distance - fr_distance);
    var ratio = tlD_distance / trD_distance;
    var angle = Math.asin(ratio);
    console.log(tlD_distance, trD_distance);
    console.log("ratio is " + ratio + "angle " + angle);
    return angle;
}
//6.3.3 照射野的半影
function cal_penumbra(rows, columns, pixel_data_16, pixel_data_8) {
    //6.3.3 Penumbra of radiation field
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lbs_index:left_Boundary_subscript_index
    var lbs_index;
    for (var i = 1; i < int_cy; i++) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            lbs_index = i;
            break;
        }
    }
    //rbs_index:right_Boundary_subscript_index
    var rbs_index;
    var rbs_init = columns - 1;
    for (var i = rbs_init; i > int_cy; i--) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            rbs_index = i;
            break;
        }
    }
    if (lbs_index == undefined || rbs_index == undefined) {
        return undefined;
    }
    console.log('pen_mat');
    console.log(penumbra_mat.data16U);
    //ld_value:left_dose_value
    var ld_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    console.log("value is  " + penumbra_mat.ushortAt(int_cx, int_cy));
    //lmp_value:left_min_pixel_value
    var lmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = lbs_index; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < lmp_value) {
            lmp_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    //rmp_value:right_min_pixel_value
    var rmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < rbs_index; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < rmp_value) {
            rmp_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    //lcmD_value:left_center_min_D_value
    var lcmD_value = ld_value - lmp_value;
    //rcmD_value:right_center_min_D_value
    var rcmD_value = ld_value - rmp_value;
    console.log("left_min_pixel_value is " + lmp_value);
    console.log("right_min_pixel_value is " + rmp_value);
    //ltpd_value:left_twenty_percent_dose_value
    var ltpd_value = parseInt(lcmD_value / 5 + lmp_value);
    //lepd_value:left_eighty_percent_dose_value
    var lepd_value = parseInt((lcmD_value * 0.8 + lmp_value));
    console.log(ld_value, 'left %20 dose value is ' + ltpd_value);
    console.log(ld_value, 'left %80 dose value is ' + lepd_value);
    //rd_value:right_dose_value
    var rd_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    //rtpd_value:right_twenty_percent_dose_value
    var rtpd_value = parseInt(rcmD_value / 5 + rmp_value);
    //repd_value:right_eighty_percent_dose_value
    var repd_value = parseInt((rcmD_value * 0.8 + rmp_value));
    console.log(rd_value, 'right %20 dose value is ' + rtpd_value);
    console.log(rd_value, 'right %80 dose value is ' + repd_value);
    //ltpd_index:left_twenty_percent_dose_index
    var ltpd_index;
    //rtpd_index:right_twenty_percent_dose_index
    var rtpd_index;
    //lepd_index:left_eighty_percent_dose_index
    var lepd_index;
    //repd_index:right_eighty_percent_dose_index
    var repd_index;
    for (var i = lbs_index; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - ltpd_value) < 5) {
            ltpd_index = i;
            break;
        }
    }
    for (var i = lbs_index; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - lepd_value) < 5) {
            lepd_index = i;
            break;
        }
    }
    console.log('left %20 index is ' + ltpd_index);
    console.log('left %80 index is ' + lepd_index);
    for (var j = int_cy; j < rbs_index; j++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, j) - rtpd_value) < 5) {
            rtpd_index = j;
            break;
        }
    }
    for (var j = int_cy; j < rbs_index; j++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, j) - repd_value) < 5) {
            repd_index = j;
            break;
        }
    }
    console.log('right %20 index is ' + rtpd_index);
    console.log('right %80 index is ' + repd_index);
    var left_Penumbra = (lepd_index - ltpd_index - 1) * 0.4;
    var right_Penumbra = (rtpd_index - repd_index - 1) * 0.4;
    var Penumbra = (left_Penumbra + right_Penumbra) / 2;
    console.log("left_penumbra,right_penumbra is " + left_Penumbra, right_Penumbra);
    console.log("penumbra is " + Penumbra);
    var RT_Image_SID = 160;
    //Il_Penumbra:ISO_left_Penumbra
    var Il_Penumbra = left_Penumbra / (RT_Image_SID / 100);
    //Ir_Penumbra:ISO_right_Penumbra
    var Ir_Penumbra = right_Penumbra / (RT_Image_SID / 100);
    var ISO_Penumbra1 = Penumbra / (RT_Image_SID / 100);
    var ISO_Penumbra2 = (Il_Penumbra + Ir_Penumbra) / 2;
    console.log("ISO left right and average1 average2 is " + Il_Penumbra, Ir_Penumbra, ISO_Penumbra1, ISO_Penumbra2);
    return ISO_Penumbra1;
}
//6.4.1 照射野的数字指示（单元限束）
function cal_unit_limiting(rows, columns, pixel_data_16, pixel_data_8) {
    //6.4.1 Digital indication of radiation field(Unit beam limiting)
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lbs_index:left_Boundary_subscript_index
    var lbs_index;
    for (var i = 1; i < int_cx; i++) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            lbs_index = i;
            break;
        }
    }
    //rbs_index:right_Boundary_subscript_index
    var rbs_index;
    var rbs_init = columns - 1;
    for (var i = rbs_init; i > int_cx; i--) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            rbs_index = i;
            break;
        }
    }
    if (lbs_index == undefined || rbs_index == undefined) {
        return undefined;
    }
    //ld_value:left_dose_value
    var ld_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    console.log("value is  " + penumbra_mat.ushortAt(int_cx, int_cy));
    //lmp_value:eft_min_pixel_value
    var lmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = lbs_index; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < lmp_value) {
            lmp_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    //rmp_value:right_min_pixel_value
    var rmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < rbs_index; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < rmp_value) {
            rmp_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    //lcmD_value:left_center_min_D_value
    var lcmD_value = ld_value - lmp_value;
    //rcmD_value:right_center_min_D_value
    var rcmD_value = ld_value - rmp_value;
    console.log("left_min_pixel_value is " + lmp_value);
    console.log("right_min_pixel_value is " + rmp_value);
    //lfpd_value:left_fifty_percent_dose_value
    var lfpd_value = parseInt(lcmD_value / 2 + lmp_value);
    console.log(ld_value, 'left %50 dose value is ' + lfpd_value);
    //rfpd_value:right_fifty_percent_dose_value
    var rfpd_value = parseInt(rcmD_value / 2 + rmp_value);
    console.log(ld_value, 'right %50 dose value is ' + rfpd_value);
    //lfpd_index:left_fifty_percent_dose_index
    var lfpd_index;
    for (var i = lbs_index; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - lfpd_value) < 5) {
            lfpd_index = i;
            break;
        }
    }
    //rfpd_index:right_fifty_percent_dose_index
    var rfpd_index;
    for (var i = int_cy; i < rbs_index; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - rfpd_value) < 5) {
            rfpd_index = i;
            break;
        }
    }
    //fpd_distance:fifty_percent_dose_distance
    var fpd_distance;
    fpd_distance = (rfpd_index - lfpd_index - 1) * 0.4;
    //Ifpd_distance:ISO_fifty_percent_dose_distance
    var Ifpd_distance;
    var RT_Image_SID = 160;
    Ifpd_distance = fpd_distance / (RT_Image_SID / 100);
    //IfpddD_value:ISO_fifty_percent_dose_distance_D_value
    var IfpddD_value;
    IfpddD_value = Math.abs(Ifpd_distance - 100);
    console.log("fifty_percent_dose_distance,ISO_fifty_percent_dose_distance,ISO_fifty_percent_dose_distance_D_value is " + fpd_distance, Ifpd_distance, IfpddD_value);
    console.log("unit limiting : " + IfpddD_value);
    return IfpddD_value;
}
//6.4.1 照射野的数字指示 （多元限束：10*10）
function cal_small_multiple_limiting(rows, columns, pixel_data_16, pixel_data_8, pairs_number) {
    //6.4.1 Digital indication of radiation field(multiple beam limiting :10*10  40 pairs/80 pairs)
    //cal 40 pairs
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lbs_index_x:left_Boundary_subscript_index_x
    var lbs_index_x;
    for (var i = 1; i < int_cx; i++) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            lbs_index_x = i;
            break;
        }
    }
    //rbs_index_x:right_Boundary_subscript_index_x
    var rbs_index_x;
    var rbs_init = columns - 1;
    for (var i = rbs_init; i > int_cx; i--) {
        if (mat_8.ucharAt(int_cy, i) < boundray_value) {
            rbs_index_x = i;
            break;
        }
    }
    if (lbs_index_x == undefined || rbs_index_x == undefined) {
        return undefined;
    }
    //ubs_index_y:up_Boundary_subscript_index_y
    var ubs_index_y;
    for (var i = 0; i < int_cx; i++) {
        if (mat_8.ucharAt(i, int_cy) < 140) {
            ubs_index_y = i;
            break;
        }
    }
    //dbs_index_y:down_Boundary_subscript_index_y
    var dbs_index_y;
    var dbs_init = rows - 1;
    for (var i = dbs_init; i > int_cx; i--) {
        if (mat_8.ucharAt(int_cx, i) < 140) {
            dbs_index_y = i;
            break;
        }
    }
    //cd_value:center_dose_value
    var cd_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    console.log("value is  " + penumbra_mat.ushortAt(int_cx, int_cy));
    //lmp_value:left_min_pixel_value
    var lmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = lbs_index_x; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < lmp_value) {
            lmp_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    //rmp_value:right_min_pixel_value
    var rmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < rbs_index_x; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < rmp_value) {
            rmp_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    //lcmD_value:left_center_min_D_value
    var lcmD_value = cd_value - lmp_value;
    //rcmD_value:right_center_min_D_value
    var rcmD_value = cd_value - rmp_value;
    console.log("left_min_pixel_value is " + lmp_value);
    console.log("right_min_pixel_value is " + rmp_value);
    //lfpd_value:left_fifty_percent_dose_value
    var lfpd_value = parseInt(lcmD_value / 2 + lmp_value);
    console.log(cd_value, 'left %50 dose value is ' + lfpd_value);
    //rfpd_value:right_fifty_percent_dose_value
    var rfpd_value = parseInt(rcmD_value / 2 + rmp_value);
    console.log(cd_value, 'right %50 dose value is ' + rfpd_value);
    if (pairs_number == 40) {
        //smG_spacing:small_multiple_Grating_spacing
        var smG_spacing = (10 * 1.6) / 2;
        //smGsi_number:small_multiple_Grating_spacing_index_number
        var smGsi_number = smG_spacing / 0.4;
        //smlfpdi_array:small_multiple_left_fifty_percent_dose_index_array
        var smlfpdi_array = [];
        for (var j = 1; j < 11; j++) {
            for (var i = lbs_index_x; i < int_cy; i++) {
                if (Math.abs(penumbra_mat.ushortAt(ubs_index_y + j * smGsi_number, i) - lfpd_value) < 5) {
                    smlfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("small_multiple_left_fifty_percent_dose_index_array");
        console.log(smlfpdi_array);
        //smrfpdi_array:small_multiple_right_fifty_percent_dose_index_array
        var smrfpdi_array = [];
        for (var j = 1; j < 11; j++) {
            for (var i = int_cy; i < rbs_index_x; i++) {
                if (Math.abs(penumbra_mat.ushortAt(ubs_index_y + j * smGsi_number, i) - rfpd_value) < 5) {
                    smrfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("small_multiple_right_fifty_percent_dose_index_array");
        console.log(smrfpdi_array);
        //smfpd_distance:small_multiple_fifty_percent_dose_distance
        var smfpd_distance = [];
        var smlfpdi_len = smlfpdi_array.length;
        for (var i = 1; i < smlfpdi_len; i++) {
            smfpd_distance[i] = Math.abs((smrfpdi_array[i] - smlfpdi_array[i]) * 0.4 - 160);
        }
        //smmfpddD_value:small_multiple_max_fifty_percent_dose_distance_D_value
        var smmfpddD_value = smfpd_distance[1];
        var smfpd_len = smfpd_distance.length;
        for (var i = 2; i < smfpd_len; i++) {
            if (smfpd_distance[i] > smmfpddD_value) {
                smmfpddD_value = smfpd_distance[i];
            }
        }
        //IsmmfpddD_value:ISO_small_multiple_max_fifty_percent_dose_distance_D_value
        var IsmmfpddD_value = smmfpddD_value / 1.6;
        console.log("small_multiple_max_fifty_percent_dose_distance_D_value is " + smmfpddD_value);
        console.log("ISO_small_multiple_max_fifty_percent_dose_distance_D_value is " + IsmmfpddD_value);
        return IsmmfpddD_value;
    }
    //cal 80 pairs
    else {
        //lmG_spacing:large_multiple_Grating_spacing
        var lmG_spacing = (10 * 0.8) / 2;
        //lmGsi_number:large_multiple_Grating_spacing_index_number
        var lmGsi_number = lmG_spacing / 0.4;
        //lmlfpdi_array:large_multiple_left_fifty_percent_dose_index_array
        var lmlfpdi_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = lbs_index_x; i < int_cy; i++) {
                if (Math.abs(penumbra_mat.ushortAt(ubs_index_y + j * lmGsi_number, i) - lfpd_value) < 5) {
                    lmlfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("large_multiple_left_fifty_percent_dose_index_array");
        console.log(lmlfpdi_array);
        //lmrfpdi_array:large_multiple_right_fifty_percent_dose_index_array
        var lmrfpdi_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = int_cy; i < rbs_index_x; i++) {
                if (Math.abs(penumbra_mat.ushortAt(ubs_index_y + j * lmGsi_number, i) - rfpd_value) < 5) {
                    lmrfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("large_multiple_right_fifty_percent_dose_index_array");
        console.log(lmrfpdi_array);
        //lmfpd_distance:large_multiple_fifty_percent_dose_distance
        var lmfpd_distance = [];
        var lmlfpdi_len = lmlfpdi_array.length;
        for (var i = 1; i < lmlfpdi_len; i++) {
            lmfpd_distance[i] = Math.abs((lmrfpdi_array[i] - lmlfpdi_array[i]) * 0.4 - 160);
        }
        //lmmfpddD_value:large_multiple_max_fifty_percent_dose_distance_D_value
        var lmmfpddD_value = lmfpd_distance[1];
        var lmfpd_len = lmfpd_distance.length;
        for (var i = 2; i < lmfpd_len; i++) {
            if (lmfpd_distance[i] > lmmfpddD_value) {
                lmmfpddD_value = lmfpd_distance[i];
            }
        }
        console.log("large_multiple_max_fifty_percent_dose_distance_D_value is " + lmmfpddD_value);
        //IlmmfpddD_value:ISO_large_multiple_max_fifty_percent_dose_distance_D_value
        var IlmmfpddD_value = lmmfpddD_value / 1.6;
        console.log("ISO_large_multiple_max_fifty_percent_dose_distance_D_value :" + IlmmfpddD_value);
        return IlmmfpddD_value;
    }
}
//6.4.1 照射野的数字指示 （多元限束：两张10*20）
function cal_large_muliiple_limiting(rows, columns, first_pixel_data_16, first_pixel_data_8, pairs_number, second_pixel_data_16, second_pixel_data_8) {
    //6.4.1 Digital indication of radiation field(multiple beam limiting :10*40  40 pairs/80 pairs )
    //cal 40 pairs
    let first_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, first_pixel_data_16);
    let first_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    var first_cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        first_cal_array[i] = 65535 - first_pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
        if (first_pixel_data_8[i] > boundray_value) {
            first_pixel_data_8[i] = 0;
        }
    }
    //fbm_8:first_bin_mat_8
    let fbm_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, first_pixel_data_8);
    //fpm:first_penumbra_mat
    let fpm = cv.matFromArray(rows, columns, cv.CV_16UC1, first_cal_array);
    console.log("binarization");
    console.log(first_pixel_data_8);
    let first_contours = new cv.MatVector();
    let first_hierarchy = new cv.Mat();
    cv.findContours(fbm_8, first_contours, first_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let first_cnt = first_contours.get(0);
    let first_moments = cv.moments(first_cnt, false);
    let first_cx = first_moments.m10 / first_moments.m00;
    let first_cy = first_moments.m01 / first_moments.m00;
    console.log(first_cx, first_cy);
    //f_int_cx:first_int_cx
    let f_int_cx = parseInt(first_cx); //type conversion
    //f_int_cy:first_int_cy
    let f_int_cy = parseInt(first_cy);
    //flbs_index_x:first_left_Boundary_subscript_index_x
    var flbs_index_x;
    for (var i = 1; i < f_int_cy; i++) {
        if (first_mat_8.ucharAt(f_int_cx, i) < boundray_value) {
            flbs_index_x = i;
            break;
        }
    }
    //frbs_index_x:first_right_Boundary_subscript_index_x
    var frbs_index_x;
    var frbs_init = columns - 1;
    for (var i = frbs_init; i > f_int_cy; i--) {
        if (first_mat_8.ucharAt(f_int_cx, i) < boundray_value) {
            frbs_index_x = i;
            break;
        }
    }
    //fubs_index_y:first_up_Boundary_subscript_index_y
    var fubs_index_y;
    for (var i = 0; i < f_int_cx; i++) {
        if (first_mat_8.ucharAt(i, f_int_cy) < boundray_value) {
            fubs_index_y = i;
            break;
        }
    }
    //fdbs_index_y:first_down_Boundary_subscript_index_y
    var fdbs_index_y;
    var fdbs_init = rows - 1;
    for (var i = fdbs_init; i > f_int_cx; i--) {
        if (first_mat_8.ucharAt(f_int_cx, i) < boundray_value) {
            fdbs_index_y = i;
            break;
        }
    }
    if (flbs_index_x == undefined || frbs_index_x == undefined) {
        return undefined;
    }
    //fld_value:first_left_dose_value
    var fld_value = parseInt(fpm.ushortAt(f_int_cx, f_int_cy));
    console.log("value is  " + fpm.ushortAt(f_int_cx, f_int_cy));
    //flmp_value:first_left_min_pixel_value
    var flmp_value = fpm.ushortAt(f_int_cx, f_int_cy);
    for (var i = flbs_index_x; i < f_int_cy; i++) {
        if (fpm.ushortAt(f_int_cx, i) < flmp_value) {
            flmp_value = fpm.ushortAt(f_int_cx, i);
        }
    }
    //frmp_value:first_right_min_pixel_value
    var frmp_value = fpm.ushortAt(f_int_cx, f_int_cy);
    for (var j = f_int_cy; j < frbs_index_x; j++) {
        if (fpm.ushortAt(f_int_cx, j) < frmp_value) {
            frmp_value = fpm.ushortAt(f_int_cx, j);
        }
    }
    //flcmD_value:first_left_center_min_D_value
    var flcmD_value = fld_value - flmp_value;
    //frcmD_value:first_right_center_min_D_value
    var frcmD_value = fld_value - frmp_value;
    console.log("first_left_min_pixel_value is " + flmp_value);
    console.log("first_right_min_pixel_value is " + frmp_value);
    //flfpd_value:first_left_fifty_percent_dose_value
    var flfpd_value = parseInt(flcmD_value / 2 + flmp_value);
    console.log(fld_value, 'first left %50 dose value is ' + flfpd_value);
    //frfpd_value:first_right_fifty_percent_dose_value
    var frfpd_value = parseInt(frcmD_value / 2 + frmp_value);
    console.log(fld_value, 'first right %50 dose value is ' + frfpd_value);
    let second_mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, second_pixel_data_16);
    let second_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    var second_cal_array = [];
    for (var i = 0; i < rc; i++) {
        second_cal_array[i] = 65535 - second_pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
        if (second_pixel_data_8[i] > boundray_value) {
            second_pixel_data_8[i] = 0;
        }
    }
    //sbm_8:second_bin_mat_8 
    let sbm_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, second_pixel_data_8);
    //spm:second_penumbra_mat
    let spm = cv.matFromArray(rows, columns, cv.CV_16UC1, second_cal_array);
    console.log("binarization");
    console.log(second_pixel_data_8);
    let second_contours = new cv.MatVector();
    let second_hierarchy = new cv.Mat();
    cv.findContours(sbm_8, second_contours, second_hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let second_cnt = second_contours.get(0);
    let second_moments = cv.moments(second_cnt, false);
    let second_cx = second_moments.m10 / second_moments.m00;
    let second_cy = second_moments.m01 / second_moments.m00;
    console.log(second_cx, second_cy);
    //s_int_cx:second_int_cx
    let s_int_cx = parseInt(second_cx); //type conversion
    //s_int_cy:second_int_cy
    let s_int_cy = parseInt(second_cy);
    //slbs_index_x: second_left_Boundary_subscript_index_x
    var slbs_index_x;
    for (var i = 1; i < s_int_cy; i++) {
        if (second_mat_8.ucharAt(s_int_cx, i) < boundray_value) {
            slbs_index_x = i;
            break;
        }
    }
    //srbs_index_x:second_right_Boundary_subscript_index_x
    var srbs_index_x;
    var srbs_init = columns - 1;
    for (var i = srbs_init; i > s_int_cy; i--) {
        if (second_mat_8.ucharAt(s_int_cx, i) < boundray_value) {
            srbs_index_x = i;
            break;
        }
    }
    if (slbs_index_x == undefined || srbs_index_x == undefined) {
        return undefined;
    }
    //subs_index_y:second_up_Boundary_subscript_index_y
    var subs_index_y;
    for (var i = 0; i < s_int_cx; i++) {
        if (second_mat_8.ucharAt(i, s_int_cy) < boundray_value) {
            subs_index_y = i;
            break;
        }
    }
    //sdbs_index_y:econd_down_Boundary_subscript_index_y
    var sdbs_index_y;
    var sdbs_init = rows - 1;
    for (var i = sdbs_init; i > s_int_cx; i--) {
        if (second_mat_8.ucharAt(s_int_cx, i) < boundray_value) {
            sdbs_index_y = i;
            break;
        }
    }
    //sld_value:second_left_dose_value
    var sld_value = parseInt(spm.ushortAt(s_int_cx, s_int_cy));
    console.log("value is  " + spm.ushortAt(s_int_cx, s_int_cy));
    //slmp_value:second_left_min_pixel_value
    var slmp_value = spm.ushortAt(s_int_cx, s_int_cy);
    for (var i = slbs_index_x; i < s_int_cy; i++) {
        if (spm.ushortAt(s_int_cx, i) < slmp_value) {
            slmp_value = spm.ushortAt(s_int_cx, i);
        }
    }
    //srmp_value:second_right_min_pixel_value
    var srmp_value = spm.ushortAt(s_int_cx, s_int_cy);
    for (var j = s_int_cy; j < srbs_index_x; j++) {
        if (spm.ushortAt(s_int_cx, j) < srmp_value) {
            srmp_value = spm.ushortAt(s_int_cx, j);
        }
    }
    //slcmD_value:second_left_center_min_D_value
    var slcmD_value = sld_value - slmp_value;
    //srcmD_value:second_right_center_min_D_value
    var srcmD_value = sld_value - srmp_value;
    console.log("second_left_min_pixel_value is " + slmp_value);
    console.log("second_right_min_pixel_value is " + srmp_value);
    //slfpd_value:second_left_fifty_percent_dose_value
    var slfpd_value = parseInt(slcmD_value / 2 + slmp_value);
    console.log(sld_value, 'second left %50 dose value is ' + slfpd_value);
    //srfpd_value:second_right_fifty_percent_dose_value
    var srfpd_value = parseInt(srcmD_value / 2 + srmp_value);
    console.log(sld_value, 'second right %50 dose value is ' + srfpd_value);
    if (pairs_number == 40) {
        //dfmG_spacing:double_first_multiple_Grating_spacing
        var dfmG_spacing = (10 * 1.6) / 2;
        //dfGsi_number:double_first_Grating_spacing_index_number
        var dfGsi_number = dfmG_spacing / 0.4;
        //dfmlfpdi_array:double_first_multiple_left_fifty_percent_dose_index_array
        var dfmlfpdi_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = flbs_index_x; i < f_int_cy; i++) {
                if (Math.abs(fpm.ushortAt(fubs_index_y + j * dfGsi_number, i) - flfpd_value) < 5) {
                    dfmlfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_left_fifty_percent_dose_index_array");
        console.log(dfmlfpdi_array);
        //dfmrfpdi_array:double_first_multiple_right_fifty_percent_dose_index_array
        var dfmrfpdi_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = f_int_cy; i < frbs_index_x; i++) {
                if (Math.abs(fpm.ushortAt(fubs_index_y + j * dfGsi_number, i) - frfpd_value) < 5) {
                    dfmrfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_right_fifty_percent_dose_index_array");
        console.log(dfmrfpdi_array);
        //dfmfpd_distance:double_first_multiple_fifty_percent_dose_distance
        var dfmfpd_distance = [];
        var dfmlfpdi_len = dfmlfpdi_array.length;
        for (var i = 1; i < dfmlfpdi_len; i++) {
            dfmfpd_distance[i] = Math.abs((dfmrfpdi_array[i] - dfmlfpdi_array[i]) * 0.4 - 160);
        }
        //dfmmfpddD_value:double_first_multiple_max_fifty_percent_dose_distance_D_value
        var dfmmfpddD_value = dfmfpd_distance[1];
        var dfmfpd_len = dfmfpd_distance.length;
        for (var i = 2; i < dfmfpd_len; i++) {
            if (dfmfpd_distance[i] >= dfmmfpddD_value) {
                dfmmfpddD_value = dfmfpd_distance[i];
            }
        }
        console.log("double_first_multiple_max_fifty_percent_dose_distance_D_value is " + dfmmfpddD_value);
        //dsmG_spacing:double_second_multiple_Grating_spacing
        var dsmG_spacing = (10 * 1.6) / 2;
        //dsGsi_number:double_second_Grating_spacing_index_number
        var dsGsi_number = dsmG_spacing / 0.4;
        //dsmlfpdi_array:double_second_multiple_left_fifty_percent_dose_index_array
        var dsmlfpdi_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = slbs_index_x; i < s_int_cy; i++) {
                if (Math.abs(spm.ushortAt(sdbs_index_y - j * dsGsi_number, i) - slfpd_value) < 5) {
                    dsmlfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_left_fifty_percent_dose_index_array");
        console.log(dsmlfpdi_array);
        //dsmrfpdi_array:double_second_multiple_right_fifty_percent_dose_index_array
        var dsmrfpdi_array = [];
        for (var j = 1; j < 21; j++) {
            for (var i = s_int_cy; i < srbs_index_x; i++) {
                if (Math.abs(spm.ushortAt(sdbs_index_y - j * dsGsi_number, i) - srfpd_value) < 5) {
                    dsmrfpdi_array[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_right_fifty_percent_dose_index_array");
        console.log(dsmrfpdi_array);
        //dsmfpd_distance:double_second_multiple_fifty_percent_dose_distance
        var dsmfpd_distance = [];
        var dsmlfpdi_len = dsmlfpdi_array.length;
        for (var i = 1; i < dsmlfpdi_len; i++) {
            dsmfpd_distance[i] = Math.abs((dsmrfpdi_array[i] - dsmlfpdi_array[i]) * 0.4 - 160);
        }
        //dsmmfpddD_value:double_second_multiple_max_fifty_percent_dose_distance_D_value
        var dsmmfpddD_value = dsmfpd_distance[1];
        var dsmfpd_len = dsmfpd_distance.length;
        for (var i = 2; i < dsmfpd_len; i++) {
            if (dsmfpd_distance[i] > dsmmfpddD_value) {
                dsmmfpddD_value = dsmfpd_distance[i];
            }
        }
        console.log("double_second_multiple_max_fifty_percent_dose_distance_D_value is " + dsmmfpddD_value);
        //dmmfpddD_value_s:double_multiple_max_fifty_percent_dose_distance_D_value_s
        var dmmfpddD_value_s = (dsmmfpddD_value > dfmmfpddD_value) ? dsmmfpddD_value : dfmmfpddD_value;
        console.log("double_multiple_max_fifty_percent_dose_distance_D_value_s is " + dmmfpddD_value_s);
        var NTD_D_value_s = dmmfpddD_value_s / (1.6 / 1.5);
        console.log("NTD_D_value is " + NTD_D_value_s);
        return NTD_D_value_s;
    }
    //80 pairs
    else {
        //dfmG_spacing_l:double_first_multiple_Grating_spacing_l
        var dfmG_spacing_l = (10 * 0.8) / 2;
        //dfGsi_number_l:double_first_Grating_spacing_index_number_l
        var dfGsi_number_l = dfmG_spacing_l / 0.4;
        //dfmlfpdi_array_l:double_first_multiple_left_fifty_percent_dose_index_array_l
        var dfmlfpdi_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = flbs_index_x; i < f_int_cy; i++) {
                if (Math.abs(fpm.ushortAt(fubs_index_y + j * dfGsi_number_l, i) - flfpd_value) < 5) {
                    dfmlfpdi_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_left_fifty_percent_dose_index_array_l");
        console.log(dfmlfpdi_array_l);
        //dfmrfpdi_array_l:double_first_multiple_right_fifty_percent_dose_index_array_l
        var dfmrfpdi_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = f_int_cy; i < frbs_index_x; i++) {
                if (Math.abs(fpm.ushortAt(fubs_index_y + j * dfGsi_number_l, i) - frfpd_value) < 5) {
                    dfmrfpdi_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_first_multiple_right_fifty_percent_dose_index_array_l");
        console.log(dfmrfpdi_array_l);
        //dfmfpd_distance_l:double_first_multiple_fifty_percent_dose_distance_l
        var dfmfpd_distance_l = [];
        var dfmlfpdi_l_len = dfmlfpdi_array_l.length;
        for (var i = 1; i < dfmlfpdi_l_len; i++) {
            dfmfpd_distance_l[i] = Math.abs((dfmrfpdi_array_l[i] - dfmlfpdi_array_l[i]) * 0.4 - 160);
        }
        //dfmmfpddD_value_l:double_first_multiple_max_fifty_percent_dose_distance_D_value_l
        var dfmmfpddD_value_l = dfmfpd_distance_l[1];
        var dfmfpd_l_len = dfmfpd_distance_l.length;
        for (var i = 2; i < dfmfpd_l_len; i++) {
            if (dfmfpd_distance_l[i] > dfmmfpddD_value_l) {
                dfmmfpddD_value_l = dfmfpd_distance_l[i];
            }
        }
        console.log("double_first_multiple_max_fifty_percent_dose_distance_D_value_l is " + dfmmfpddD_value_l);
        //dsmG_spacing_l:double_second_multiple_Grating_spacing_l
        var dsmG_spacing_l = (10 * 0.8) / 2;
        //dsGsi_number_l:double_second_Grating_spacing_index_number_l
        var dsGsi_number_l = dsmG_spacing_l / 0.4;
        //dsmlfpdi_array_l:double_second_multiple_left_fifty_percent_dose_index_array_l
        var dsmlfpdi_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = slbs_index_x; i < s_int_cy; i++) {
                if (Math.abs(spm.ushortAt(sdbs_index_y - j * dsGsi_number_l, i) - slfpd_value) < 5) {
                    dsmlfpdi_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_left_fifty_percent_dose_index_array_l");
        console.log(dsmlfpdi_array_l);
        //dsmrfpdi_array_l:double_second_multiple_right_fifty_percent_dose_index_array_l
        var dsmrfpdi_array_l = [];
        for (var j = 1; j < 41; j++) {
            for (var i = s_int_cy; i < srbs_index_x; i++) {
                if (Math.abs(spm.ushortAt(sdbs_index_y - j * dsGsi_number_l, i) - srfpd_value) < 5) {
                    dsmrfpdi_array_l[j] = i;
                    break;
                }
            }
        }
        console.log("double_second_multiple_right_fifty_percent_dose_index_array_l");
        console.log(dsmrfpdi_array_l);
        //dsmfpd_distance_l:double_second_multiple_fifty_percent_dose_distance_l
        var dsmfpd_distance_l = [];
        var dsmlfpdi_l_len = dsmlfpdi_array_l.length;
        for (var i = 1; i < dsmlfpdi_l_len; i++) {
            dsmfpd_distance_l[i] = Math.abs((dsmrfpdi_array_l[i] - dsmlfpdi_array_l[i]) * 0.4 - 160);
        }
        //dsmmfpddD_value_l:double_second_multiple_max_fifty_percent_dose_distance_D_value_l
        var dsmmfpddD_value_l = dsmfpd_distance_l[1];
        var dsmfpd_l_len = dsmfpd_distance_l.length;
        for (var i = 2; i < dsmfpd_l_len; i++) {
            if (dsmfpd_distance_l[i] > dsmmfpddD_value_l) {
                dsmmfpddD_value_l = dsmfpd_distance_l[i];
            }
        }
        console.log("double_second_multiple_max_fifty_percent_dose_distance_D_value_l is " + dsmmfpddD_value_l);
        //dmmfpddD_value_l:double_multiple_max_fifty_percent_dose_distance_D_value_l
        var dmmfpddD_value_l = (dsmmfpddD_value_l > dfmmfpddD_value_l) ? dsmmfpddD_value_l : dfmmfpddD_value_l;
        console.log("double_multiple_max_fifty_percent_dose_distance_D_value_l is " + dmmfpddD_value_l);
        //ND_value_l:NTD_D_value_
        var ND_value_l = dmmfpddD_value_l / (1.6 / 1.5);
        console.log("NTD_D_value is " + ND_value_l);
        return ND_value_l;
    }
}
//Calculate two point distance
function cal_point_distance(fx, fy, sx, sy, pixel_space) {
    var d_x = Math.abs(fx - sx);
    var square_x = Math.pow(d_x, 2);
    var d_y = Math.abs(fy - sy);
    console.log("d_x,d_y" + d_x + d_y);
    var square_y = Math.pow(d_y, 2);
    var square = square_x + square_y;
    var sqr = Math.floor(Math.sqrt(square));
    var dis = sqr * pixel_space;
    return dis;
}
//Function enumeration
var para_cate = {
    bed_pre: 1,
    offset: 2,
    position: 3
};
//Calculate the ball point
function cal_point(rows, columns, pixel_data_16, pixel_data_8, threshold, para) {
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    //var cal_array=[];
    console.log(pixel_data_8);
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        if (pixel_data_8[i] > threshold) {
            pixel_data_8[i] = 0;
        }
    }
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    let circles = new cv.Mat();
    switch (para) {
        case para_cate.bed_pre:
            cv.HoughCircles(mat_8, circles, cv.HOUGH_GRADIENT, 2.45, 100, 120, 100, 0, 200);
            console.log("6.7.1-6.7.3");
            break;
        case para_cate.offset:
            cv.HoughCircles(mat_8, circles, cv.HOUGH_GRADIENT, 2.5, 150, 120, 100, 0, 100);
            console.log("6.5.1");
            break;
        case para_cate.position:
            cv.HoughCircles(mat_8, circles, cv.HOUGH_GRADIENT, 1.90, 100, 50, 100, 0, 0);
            console.log("6.6.1");
            break;
        default:
            console.log("para is error");
            //return undefined;
    }
    let xx = Math.round(circles.data32F[0]);
    let yy = Math.round(circles.data32F[1]);
    if (xx == undefined || yy == undefined) {
        console.log("sphere point xx or yy undefined or not find!");
        return undefined;
    }
    return {
        x: xx,
        y: yy,
        circle: circles
    }
}
//Calculate image center point
function cal_center(rows, columns, pixel_data_16, pixel_data_8) {
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
        if (pixel_data_8[i] > boundray_value) {
            pixel_data_8[i] = 0;
        }
        /*    else{
            pixel_data_8[i]=1;
          }  */
    }
    let bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
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
    if (cx == undefined || cy == undefined) {
        console.log("image center cx or cy is undefined or not find!");
        return undefined;
    }
    return {
        x: int_cx,
        y: int_cy
    }
}
//6.5.1 辐射束轴相对于等中心点的偏移 651_1.dcm 与 651_3.dcm
function cal_offset(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, third_pixel_data_16, third_pixel_data_8) {
    //6.5.1 Offset of radiation beam axis relative to isocenter
    var threshold = 100;
    var obj1_cen = cal_center(rows, columns, first_pixel_data_16, first_pixel_data_8);
    var obj1_poi = cal_point(rows, columns, first_pixel_data_16, first_pixel_data_8, threshold, para_cate.offset);
    if (obj1_poi == undefined) {
        return undefined;
    }
    var pixel_space = 0.4;
    var obj1_dis = cal_point_distance(obj1_cen.x, obj1_cen.y, obj1_poi.x, obj1_poi.y, pixel_space);
    var obj2_cen = cal_center(rows, columns, second_pixel_data_16, second_pixel_data_8);
    var obj2_poi = cal_point(rows, columns, second_pixel_data_16, second_pixel_data_8, threshold, para_cate.offset);
    if (obj2_poi == undefined) {
        return undefined;
    }
    var obj2_dis = cal_point_distance(obj2_cen.x, obj2_cen.y, obj2_poi.x, obj2_poi.y, pixel_space);
    var obj3_cen = cal_center(rows, columns, third_pixel_data_16, third_pixel_data_8);
    var obj3_poi = cal_point(rows, columns, third_pixel_data_16, third_pixel_data_8, threshold, para_cate.offset);
    if (obj3_poi == undefined) {
        return undefined;
    }
    var obj3_dis = cal_point_distance(obj3_cen.x, obj3_cen.y, obj3_poi.x, obj3_poi.y, pixel_space);
    var dis_array = [];
    dis_array[0] = obj1_dis;
    dis_array[1] = obj2_dis;
    dis_array[2] = obj3_dis;
    var max_dis = dis_array[0];
    for (var i = 1; i < 3; i++) {
        if (dis_array[i] > max_dis) {
            max_dis = dis_array[i];
        }
    }
    var iso_dis = max_dis / 1.6;
    console.log("dis : " + max_dis + " iso_dis : " + iso_dis);
    /* var dst=cv.imread("./src/qcs_film/e001.tiff");
    console.log(dst.data8U);   */
    return iso_dis;
}
//6.6.1 旋转运动标尺的零刻度位置 661_4.dcm
function cal_photon_position(rows, columns, pixel_data_16, pixel_data_8) {
    //6.6.1 Zero scale position of rotary motion ruler
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
        if (pixel_data_8[i] > boundray_value) {
            pixel_data_8[i] = 0;
        }
        /*    else{
            pixel_data_8[i]=1;
          }  */
    }
    let bin_mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
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
    var threshold = 100;
    var obj = cal_point(rows, columns, pixel_data_16, pixel_data_8, threshold, para_cate.position);
    if (obj == undefined) {
        return undefined;
    }
    console.log("obj point: " + obj.x, obj.y);
    var pixel_space = 0.4;
    var dis = cal_point_distance(int_cx, int_cy, obj.x, obj.y, pixel_space);
    var ratio = dis / 160;
    var angle = Math.asin(ratio);
    console.log("angle :" + angle);
    return angle;
}
//6.7.1-6.7.3 治疗床的运动精度  
function cal_bed_precision(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8) {
    //6.7.1-6.7.3 Motion accuracy of treatment bed(6.7.1:vertical,6.7.2:transverse,6.7.3:around)
    var threshold1 = 100;
    let obj1 = cal_point(rows, columns, first_pixel_data_16, first_pixel_data_8, threshold1, para_cate.bed_pre);
    if (obj1 == undefined) {
        return undefined;
    }
    console.log("f_circles:");
    console.log(obj1.circle.data32F);
    console.log("fx,fy:" + obj1.x + "," + obj1.y);
    var threshold2 = 100;
    let obj2 = cal_point(rows, columns, second_pixel_data_16, second_pixel_data_8, threshold2, para_cate.bed_pre);
    if (obj2 == undefined) {
        return undefined;
    }
    console.log("s_circles:");
    console.log(obj2.circle.data32F);
    console.log("sx,sy:" + obj2.x + "," + obj2.y);
    /*    if(!Number.isNaN(obj2.x)){
           console.log("sx,sy:"+obj2.x+","+obj2.y);
       }
       else{
           console.log("aaaaaaaaa");
           threshold2=100;
           let obj2=cal_point(rows,columns,second_pixel_data_16,new_data_8,threshold2);
           console.log("sx,sy:"+obj2.x+","+obj2.y);
       }  */
    var pixel_space = 0.4;
    let dis = cal_point_distance(obj1.x, obj1.y, obj2.x, obj2.y, pixel_space);
    var iso_dis = dis / 1.6;
    console.log("dis : " + dis);
    console.log("iso_dis : " + iso_dis);
    return iso_dis
}
//Calculate single film symmetry
function cal_single_filmsym(rows, columns, pixel_data_16, pixel_data_8, percentage, pixel_space) {
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lbs_index:left_Boundary_subscript_index
    var lbs_index;
    for (var i = 1; i < int_cy; i++) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            lbs_index = i;
            break;
        }
    }
    //rbs_index:right_Boundary_subscript_index
    var rbs_index;
    var rbs_init = columns - 1;
    for (var i = rbs_init; i > int_cy; i--) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            rbs_index = i;
            break;
        }
    }
    if (lbs_index == undefined || rbs_index == undefined) {
        return undefined;
    }
    //lmp_value:left_min_pixel_value
    var lmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = lbs_index; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < lmp_value) {
            lmp_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    //rmp_value:right_min_pixel_value
    var rmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < rbs_index; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < rmp_value) {
            rmp_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    //cd_value:center_dose_value
    var cd_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    //lcmD_value:left_center_min_D_value
    var lcmD_value = cd_value - lmp_value;
    //rcmD_value: right_center_min_D_value
    var rcmD_value = cd_value - rmp_value;
    //lfpd_value:left_fifty_percent_dose_value
    var lfpd_value = parseInt(lcmD_value / 2 + lmp_value);
    console.log(cd_value, 'left %50 dose value is ' + lfpd_value);
    // rfpd_value:right_fifty_percent_dose_value
    var rfpd_value = parseInt(rcmD_value / 2 + rmp_value);
    console.log(cd_value, 'right %50 dose value is ' + rfpd_value);
    //lfpd_index:left_fifty_percent_dose_index
    var lfpd_index;
    for (var i = lbs_index; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - lfpd_value) < 5) {
            lfpd_index = i;
            break;
        }
    }
    //rfpd_index:right_fifty_percent_dose_index
    var rfpd_index;
    for (var i = int_cy; i < rbs_index; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - rfpd_value) < 5) {
            rfpd_index = i;
            break;
        }
    }
    //Slb_index:Symmetry_left_boundary_index
    var Slf_index = parseInt(int_cy - ((int_cy - lfpd_index) * percentage));
    //Srb_index:Symmetry_right_boundary_index
    var Srb_index = parseInt(((rfpd_index - int_cy) * percentage) + int_cy);
    //Slb_distance:Symmetry_left_boundary_distance
    var Slb_distance = (int_cy - lfpd_index) * percentage * pixel_space;
    //Srb_distance:Symmetry_right_boundary_distance
    var Srb_distance = (rfpd_index - int_cy) * percentage * pixel_space;
    //SS_distance:Symmetry_Selected_distance
    var SS_distance = parseInt((Slb_distance < Srb_distance) ? Slb_distance : Srb_distance);
    console.log('SS_distance is ' + SS_distance);
    //SSl_index: Symmetry_Selected_left_index
    var SSl_index = parseInt(int_cy - SS_distance / pixel_space);
    //SSr_index: Symmetry_Selected_right_index
    var SSr_index = parseInt(int_cy + SS_distance / pixel_space);
    //ld_array:left_dose_array
    var ld_array = [];
    for (var i = SSl_index, j = 0; i < int_cy; i++, j++) {
        ld_array[j] = penumbra_mat.ushortAt(int_cx, i);
    }
    console.log("ld_array :");
    console.log(ld_array);
    //rd_array:right_dose_array
    var rd_array = [];
    for (var i = SSr_index, j = 0; i > int_cy; i--, j++) {
        rd_array[j] = penumbra_mat.ushortAt(int_cx, i);
    }
    console.log("rd_array :");
    console.log(rd_array);
    //S_array:Symmetry_array
    var S_array = [];
    var ld_len = ld_array.length;
    for (var i = 0; i < ld_len; i++) {
        S_array[i] = rd_array[i] / ld_array[i];
    }
    var max_Symmetry = S_array[0];
    console.log("original  max_Symmetry is " + max_Symmetry);
    for (var i = 1; i < ld_len; i++) {
        if (S_array[i] > max_Symmetry) {
            max_Symmetry = S_array[i];
        }
    }
    if (max_Symmetry == undefined) {
        return undefined;
    }
    console.log("S_array");
    console.log(S_array);
    console.log("Slb_index,Srb_index is " + Slf_index, Srb_index);
    console.log("SSl_index,SSr_index is " + SSl_index, SSr_index);
    console.log("Slb_distance,Srb_distance is " + Slb_distance, Srb_distance);
    console.log("final max_Symmetry is " + max_Symmetry);
    return max_Symmetry;
}
//6.3.2 电子线照射野的对称性
function cal_film_symmetry(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution) {
    //6.3.2 The symmetry of the electron beam irradiation field
    var pixel_space = 25.4 / resolution;
    var sym1 = cal_single_filmsym(rows, columns, first_pixel_data_16, first_pixel_data_8, percentage, pixel_space);
    if (sym1 == undefined) {
        console.log("cal first film symmetry error!");
        return undefined;
    }
    var sym2 = cal_single_filmsym(rows, columns, second_pixel_data_16, second_pixel_data_8, percentage, pixel_space);
    if (sym2 == undefined) {
        console.log("cal second film symmetry error!");
        return undefined;
    }
    var sym = (sym1 > sym2) ? sym1 : sym2;
    console.log("sym : " + sym);
    return sym;
}
//Calculate single film distance
function cal_film_singdis(int_cx, int_cy, lfpd_index, rfpd_index, ufpd_index, dfpd_index, per, pixel_space) {
    //Slb_index:Symmetry_left_boundary_index
    var Slf_index = parseInt(int_cy - ((int_cy - lfpd_index) * per));
    //Srb_index:Symmetry_right_boundary_index
    var Srb_index = parseInt(((rfpd_index - int_cy) * per) + int_cy);
    //Slb_distance:Symmetry_left_boundary_distance
    var Slb_distance = (int_cy - lfpd_index) * per * pixel_space;
    //Srb_distance:Symmetry_right_boundary_distance
    var Srb_distance = (rfpd_index - int_cy) * per * pixel_space;
    //SSlr_distance:Symmetry_Selected_left_right_distance
    var SSlr_distance = parseInt((Slb_distance < Srb_distance) ? Slb_distance : Srb_distance);
    console.log('SSlr_distance is ' + SSlr_distance);
    //SSl_index: Symmetry_Selected_left_index
    var SSl_index = parseInt(int_cy - SSlr_distance / pixel_space);
    //SSr_index: Symmetry_Selected_right_index
    var SSr_index = parseInt(int_cy + SSlr_distance / pixel_space);
    //sel_distance: Symmetry_percent_left_distance
    var spl_distance = (SSl_index - lfpd_index) * pixel_space;
    //ser_distance:Symmetry_percent_right_distance
    var spr_distance = (rfpd_index - SSr_index) * pixel_space;
    var max_lrdis = (spl_distance > spr_distance) ? spl_distance : spr_distance;
    //Sub_index:Symmetry_up_boundary_index
    var Sub_index = parseInt(int_cx - ((int_cx - ufpd_index) * per));
    //Sdb_index:Symmetry_down_boundary_index
    var Sdb_index = parseInt(((dfpd_index - int_cx) * per) + int_cx);
    //Sub_distance:Symmetry_up_boundary_distance
    var Sub_distance = (int_cx - ufpd_index) * per * pixel_space;
    //Sdb_distance:Symmetry_down_boundary_distance
    var Sdb_distance = (dfpd_index - int_cx) * per * pixel_space;
    //SSud_distance:Symmetry_Selected_up_down_distance
    var SSud_distance = parseInt((Sub_distance < Sdb_distance) ? Sub_distance : Sdb_distance);
    console.log('SSud_distance is ' + SSud_distance);
    //SSu_index: Symmetry_Selected_up_index
    var SSu_index = parseInt(int_cx - SSud_distance / pixel_space);
    //SSd_index: Symmetry_Selected_down_index
    var SSd_index = parseInt(int_cx + SSud_distance / pixel_space);
    //seu_distance: Symmetry_percent_up_distance
    var seu_distance = (SSu_index - ufpd_index) * pixel_space;
    //sed_distance: Symmetry_percent_down_distance
    var sed_distance = (dfpd_index - SSd_index) * pixel_space;
    var max_dudis = (seu_distance > sed_distance) ? seu_distance : sed_distance;
    var dis = (max_lrdis > max_dudis) ? max_lrdis : max_dudis;
    console.log("film uniformity :" + dis);
    return dis;
}
//Calculate single film uniformity
function cal_single_filmunifo(rows, columns, pixel_data_16, pixel_data_8, percentage, pixel_space) {
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lbs_index:left_Boundary_subscript_index
    var lbs_index;
    for (var i = 1; i < int_cy; i++) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            lbs_index = i;
            break;
        }
    }
    //rbs_index:right_Boundary_subscript_index
    var rbs_index;
    var rbs_init = columns - 1;
    for (var i = rbs_init; i > int_cy; i--) {
        if (mat_8.ucharAt(int_cx, i) < boundray_value) {
            rbs_index = i;
            break;
        }
    }
    //ubs_index:up_Boundary_subscript_index
    var ubs_index;
    for (var i = 1; i < int_cx; i++) {
        if (mat_8.ucharAt(i, int_cy) < boundray_value) {
            ubs_index = i;
        }
    }
    //dbs_index:down_Boundary_subscript_index
    var dbs_index;
    var dbs_init = rows - 1;
    for (var i = dbs_init; i > int_cx; i--) {
        if (mat_8.uncharAt(i, int_cy) < boundray_value) {
            dbs_index = i;
        }
    }
    if (ubs_index == undefined || dbs_index == undefined) {
        console.log("ubs index or dbs index is undefined or not find!");
        return undefined;
    }
    if (lbs_index == undefined || rbs_index == undefined) {
        console.log("lbs index or rbs index is undefined or not find!");
        return undefined;
    }
    //lmp_value:left_min_pixel_value
    var lmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = lbs_index; i < int_cy; i++) {
        if (penumbra_mat.ushortAt(int_cx, i) < lmp_value) {
            lmp_value = penumbra_mat.ushortAt(int_cx, i);
        }
    }
    //rmp_value:right_min_pixel_value
    var rmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cy; j < rbs_index; j++) {
        if (penumbra_mat.ushortAt(int_cx, j) < rmp_value) {
            rmp_value = penumbra_mat.ushortAt(int_cx, j);
        }
    }
    //ump_value:up_min_pixel_value
    var ump_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var i = ubs_index; i < int_cx; i++) {
        if (penumbra_mat.ushortAt(i, int_cy) < ump_value) {
            ump_value = penumbra_mat.ushortAt(i, int_cy);
        }
    }
    //dmp_value:down_min_pixel_value
    var dmp_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (var j = int_cx; j < dbs_index; j++) {
        if (penumbra_mat.ushortAt(j, int_cy) < dmp_value) {
            dmp_value = penumbra_mat.ushortAt(j, int_cy);
        }
    }
    //cd_value:center_dose_value
    var cd_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    //lcmD_value:left_center_min_D_value
    var lcmD_value = cd_value - lmp_value;
    //rcmD_value: right_center_min_D_value
    var rcmD_value = cd_value - rmp_value;
    //lfpd_value:left_fifty_percent_dose_value
    var lfpd_value = parseInt(lcmD_value / 2 + lmp_value);
    console.log(cd_value, 'left %50 dose value is ' + lfpd_value);
    // rfpd_value:right_fifty_percent_dose_value
    var rfpd_value = parseInt(rcmD_value / 2 + rmp_value);
    console.log(cd_value, 'right %50 dose value is ' + rfpd_value);
    //ucmD_value:up_center_min_D_value
    var ucmD_value = cd_value - ump_value;
    //dcmD_value:down_center_min_D_value
    var dcmD_value = cd_value - dmp_value;
    //ufpd_value:up_fifty_percent_dose_value
    var ufpd_value = parseInt(ucmD_value / 2 + ump_value);
    console.log(cd_value, 'up %50 dose value is ' + ufpd_value);
    // dfpd_value:dwon_fifty_percent_dose_value
    var dfpd_value = parseInt(dcmD_value / 2 + dmp_value);
    console.log(cd_value, 'down %50 dose value is ' + dfpd_value);
    //lfpd_index:left_fifty_percent_dose_index
    var lfpd_index;
    for (var i = lbs_index; i < int_cy; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - lfpd_value) < 5) {
            lfpd_index = i;
            break;
        }
    }
    //rfpd_index:right_fifty_percent_dose_index
    var rfpd_index;
    for (var i = int_cy; i < rbs_index; i++) {
        if (Math.abs(penumbra_mat.ushortAt(int_cx, i) - rfpd_value) < 5) {
            rfpd_index = i;
            break;
        }
    }
    //ufpd_index:up_fifty_percent_dose_index
    var ufpd_index;
    for (var i = ubs_index; i < int_cx; i++) {
        if (Math.abs(penumbra_mat.ushortAt(i, int_cy) - ufpd_value) < 5) {
            ufpd_index = i;
            break;
        }
    }
    //dfpd_index:down_fifty_percent_dose_index
    var dfpd_index;
    for (var i = int_cx; i < dbs_index; i++) {
        if (Math.abs(penumbra_mat.ushortAt(i, int_cy) - dfpd_value) < 5) {
            dfpd_index = i;
            break;
        }
    }
    var per;
    if (percentage == 0.8) {
        var edis = cal_film_singdis(int_cx, int_cy, lfpd_index, rfpd_index, ufpd_index, dfpd_index, percentage, pixel_space);
        return edis;
    } else if (percentage == 0.9) {
        var ndis = cal_film_singdis(int_cx, int_cy, lfpd_index, rfpd_index, ufpd_index, dfpd_index, percentage, pixel_space);
        return ndis;
    } else {
        console.log("percentage is incorrect!");
        return undefined;
    }
}
//6.3.2 电子线照射野的均整度 （沿两主轴方向上的80%等剂量线 或 沿两主轴方向上的90%等剂量线)
function cal_film_axisunifo(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution) {
    //6.3.2  Uniformity of electron beam irradiation field (80% isodose line along two principal axes or 90% isodose line along two principal axes)
    var pixel_space = 25.4 / resolution;
    var fdis = cal_single_filmunifo(rows, columns, first_pixel_data_16, first_pixel_data_8, percentage, pixel_space);
    if (fdis == undefined) {
        console.log("cal first film axis uniformity error!");
        return undefined;
    }
    var sdis = cal_single_filmunifo(rows, columns, second_pixel_data_16, second_pixel_data_8, percentage, pixel_space);
    if (sdis == undefined) {
        console.log("cal second film axis uniformity error!");
        return undefined;
    }
    var dis = (fdis > sdis) ? fdis : sdis;
    return dis;
}
//Calculate main diagonal percentage dose point
function cal_film_mainp(int_cx, int_cy, lunpd_value, lub_dx, lub_dy, rdnpd_value, rdb_dx, rdb_dy) {
    var lunpd_dx;
    var lunpd_dy;
    //lunpd_dx:
    //lunpd_dy:left_up_ninety_percent_dose_point
    for (i = lub_dx, j = lub_dy; i < int_cx, j < int_cy; i++, j++) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - lunpd_value) < 5) {
            lunpd_dx = i;
            lunpd_dy = j;
            break;
        }
    }
    //rdnpd_dx:
    //rdnpd_dy:right_down_ninety_percent_dose_point
    var rdnpd_dx;
    var rdnpd_dy;
    for (i = int_cx, j = int_cy; i < rdb_dx, j < rdb_dy; i++, j++) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - rdnpd_value) < 5) {
            rdnpd_dx;
            rdnpd_dy;
            break;
        }
    }
    return {
        lunpd_x: lunpd_dx,
        lunpd_y: lunpd_dy,
        rdnpd_x: rdnpd_dx,
        rdnpd_y: rdnpd_dy
    }
}
//Calculate sub diagonal percentage dose point
function cal_film_subp(int_cx, int_cy, lfnpd_value, ldb_dx, ldb_dy, runpd_value, rub_dx, rub_dy) {
    var lfnpd_dx;
    var lfnpd_dy;
    //lfnpd_dx:
    //lfnpd_dy: left_down_ninety_percent_dose_point
    for (i = ldb_dx, ldb_dy; i < int_cx, j > int_cy; i++, j--) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - lfnpd_value) < 5) {
            lfnpd_dx = i;
            lfnpd_dy = j;
            break;
        }
    }
    //runpd_dx:
    //runpd_dy: right_up_ninety_percent_dose_point
    var runpd_dx;
    var runpd_dy;
    for (i = int_cx, j = int_cy; i < rub_dx, j > rub_dy; i++, j--) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - runpd_value) < 5) {
            runpd_dx = i;
            runpd_dy = j;
            break;
        }
    }
    return {
        lfnpd_x: lfnpd_dx,
        lfnpd_y: lfnpd_dy,
        runpd_x: runpd_dx,
        runpd_y: runpd_dy
    }
}
//Calculate single film diagnoal
function cal_film_diagsing(rows, columns, pixel_data_16, pixel_data_8, per, pixel_space) {
    let mat_16 = cv.matFromArray(rows, columns, cv.CV_16UC1, pixel_data_16);
    let mat_8 = cv.matFromArray(rows, columns, cv.CV_8UC1, pixel_data_8);
    var cal_array = [];
    var boundray_value = 200;
    var rc = rows * columns;
    for (var i = 0; i < rc; i++) {
        cal_array[i] = 65535 - pixel_data_8[i];
    }
    for (var i = 0; i < rc; i++) {
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
    //lub_dx:
    //lub_dy: Upper left half of main diagonal boundary point
    var lub_dx;
    var lub_dy;
    var i, j;
    for (i = int_cx, j = int_cy; i > 0, j > 0; i--, j--) {
        if (mat_8.ucharAt(i, j) > boundray_value) {
            lub_dx = i;
            lub_dy = j;
            break;
        }
    }
    if (lub_dx == undefined || lub_dy == undefined) {
        console.log("Upper left half of main diagonal boundary point is undefined or not find!");
        return undefined;
    }
    //rdb_dx:
    //rdb_dy: Down right half of main diagonal boundary point
    var rdb_dx;
    var rdb_dy;
    for (i = int_cx, j = int_cy; i < columns, j < rows; i++, j++) {
        if (mat_8.ucharAt(i, j) > boundray_value) {
            rdb_dx = i;
            rdb_dy = j;
            break;
        }
    }
    if (rdb_dx == undefined || rdb_dy == undefined) {
        console.log("Down left half of main diagonal boundary point is undefined or not find!");
        return undefined;
    }
    //ldb_dx:
    //ldb_dy: Down left half of sub diagonal boundary point
    var ldb_dx;
    var ldb_dy;
    for (i = int_cx, j = int_cy; i > 0, j < rows; i--, j++) {
        if (mat_8.ucharAt(i, j) > boundray_value) {
            ldb_dx = i;
            ldb_dy = j;
        }
    }
    if (ldb_dx == undefined || ldb_dy == undefined) {
        console.log("Down left half of sub diagonal boundary point is undefined or not find!");
        return undefined;
    }
    //rub_dx:
    //rub_dy:Upper right half of sub diagnoal boundary point
    var rub_dx;
    var rub_dy;
    for (i = int_cx, j = int_cy; i < columns, j > 0; i++, j--) {
        if (mat_8.uncharAt(i, j) > boundray_value) {
            rub_dx = i;
            rub_dy = j;
        }
    }
    if (rub_dx == undefined || rub_dy == undefined) {
        console.log("Upper right half of sub diagnoal boundary point is undefined or not find!");
        return undefined;
    }
    //lumin_value:left up main diagonal min_pixel_value
    var lumin_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (i = lub_dx, j = lub_dy; i < int_cx, j < int_cy; i++, j++) {
        if (penumbra_mat.ushortAt(i, j) < lumin_value) {
            lumin_value = penumbra_mat.ushortAt(i, j);
        }
    }
    //rdmin_value:right down main diagonal min_pixel_value
    var rdmin_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (i = int_cx, j = int_cy; i < rdb_dx, j < rdb_dy; i++, j++) {
        if (penumbra_mat.ushortAt(i, j) < rdmin_value) {
            rdmin_value = penumbra_mat.ushortAt(i, j);
        }
    }
    //ldmin_value:left down sub diagonal min_pixel_value
    var ldmin_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (i = ldb_dx, j = ldb_dy; i < int_cx, j > int_cy; i++, j--) {
        if (penumbra_mat.ushortAt(i, j) < ldmin_value) {
            ldmin_value = penumbra_mat.ushortAt(i, j);
        }
    }
    //rumin_value:right up sub diagonal min_pixel_value
    var rumin_value = penumbra_mat.ushortAt(int_cx, int_cy);
    for (i = int_cx, j = int_cy; i < rub_dx, j > rub_dy; i++, j--) {
        if (penumbra_mat.ushortAt(i, j) < rumin_value) {
            rumin_value = penumbra_mat.ushortAt(i, j);
        }
    }
    //cd_value:center_dose_value
    var cd_value = parseInt(penumbra_mat.ushortAt(int_cx, int_cy));
    //lumD_value:left_up_center_min_D_value
    var lumD_value = cd_value - lumin_value;
    //rdmD_value: right_down_center_min_D_value
    var rdmD_value = cd_value - rdmin_value;
    //lufpd_value:left_up_fifty_percent_dose_value
    var lufpd_value = parseInt(lumD_value / 2 + lumin_value);
    console.log(cd_value, 'left up %50 dose value is ' + lufpd_value);
    // rdfpd_value:right_down_fifty_percent_dose_value
    var rdfpd_value = parseInt(rdmD_value / 2 + rdmin_value);
    console.log(cd_value, 'right down %50 dose value is ' + rdfpd_value);
    //ldmD_value:left_down_center_min_D_value
    var ldmD_value = cd_value - ldmin_value;
    //rumD_value:down_center_min_D_value
    var rumD_value = cd_value - rumin_value;
    //lffpd_value:left_down_fifty_percent_dose_value
    var lffpd_value = parseInt(ldmD_value / 2 + ldmin_value);
    console.log(cd_value, 'left down  %50 dose value is ' + lffpd_value);
    // rufpd_value:right_up_fifty_percent_dose_value
    var rufpd_value = parseInt(rumD_value / 2 + rumin_value);
    console.log(cd_value, 'right up %50 dose value is ' + rufpd_value);
    var lufpd_dx;
    var lufpd_dy;
    //lufpd_dx:
    //lufpd_dy:left_up_fifty_percent_dose_point
    for (i = lub_dx, j = lub_dy; i < int_cx, j < int_cy; i++, j++) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - lufpd_value) < 5) {
            lufpd_dx = i;
            lufpd_dy = j;
            break;
        }
    }
    //rdfpd_dx:
    //rdfpd_dy:right_down_fifty_percent_dose_point
    var rdfpd_dx;
    var rdfpd_dy;
    for (i = int_cx, j = int_cy; i < rdb_dx, j < rdb_dy; i++, j++) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - rdfpd_value) < 5) {
            rdfpd_dx;
            rdfpd_dy;
            break;
        }
    }
    var lffpd_dx;
    var lffpd_dy;
    //lffpd_dx:
    //lffpd_dy: left_down_fifty_percent_dose_point
    for (i = ldb_dx, j = ldb_dy; i < int_cx, j > int_cy; i++, j--) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - lffpd_value) < 5) {
            lffpd_dx = i;
            lffpd_dy = j;
            break;
        }
    }
    //rufpd_dx:
    //rufpd_dy: right_up_fifty_percent_dose_point
    var rufpd_dx;
    var rufpd_dy;
    for (i = int_cx, j = int_cy; i < rub_dx, j > rub_dy; i++, j--) {
        if (Math.abs(penumbra_mat.ushortAt(i, j) - rufpd_value) < 5) {
            rufpd_dx = i;
            rufpd_dy = j;
            break;
        }
    }
    if (per == 0.9) {
        //lunpd_value:left_up_ninety_percent_dose_value
        var lunpd_value = parseInt(lumD_value * per + lumin_value);
        console.log(cd_value, 'left up %90 dose value is ' + lunpd_value);
        // rdnpd_value:right_down_ninety_percent_dose_value
        var rdnpd_value = parseInt(rdmD_value * per + rdmin_value);
        console.log(cd_value, 'right down %90 dose value is ' + rdnpd_value);
        //lfnpd_value:left_down_ninety_percent_dose_value
        var lfnpd_value = parseInt(ldmD_value * per + ldmin_value);
        console.log(cd_value, 'left down  %90 dose value is ' + lfnpd_value);
        // runpd_value:right_up_ninety_percent_dose_value
        var runpd_value = parseInt(rumD_value * per + rumin_value);
        console.log(cd_value, 'right up %90 dose value is ' + runpd_value);
        var enp1 = cal_film_mainp(int_cx, int_cy, lunpd_value, lub_dx, lub_dy, rdnpd_value, rdb_dx, rdb_dy);
        var ludis = cal_point_distance(lufpd_dx, lufpd_dy, enp1.lunpd_x, enp1.lunpd_y, pixel_space);
        var rddis = cal_point_distance(rdfpd_dx, rdfpd_dy, enp1.rdnpd_x, enp1.rdnpd_y, pixel_space);
        var edis1 = (ludis > rddis) ? ludis : rddis;
        var enp2 = cal_film_subp(int_cx, int_cy, lfnpd_value, ldb_dx, ldb_dy, runpd_value, rub_dx, rub_dy);
        var lfdis = cal_point_distance(lffpd_dx, lffpd_dy, enp2.lfnpd_x, enp2.lfnpd_y, pixel_space);
        var rudis = cal_point_distance(rufpd_dx, rufpd_dy, enp2.runpd_x, enp2.runpd_y, pixel_space);
        var edis2 = (lfdis > rudis) ? lfdis : rudis;
        var edis = (edis1 > edis2) ? edis1 : edis2;
        return edis;
    } else {
        console.log("percentage is error!");
        return undefined;
    }

}
//6.3.2 电子线照射野的均整度  (两对角线上90%等剂量线)
function cal_film_diagunifo(rows, columns, first_pixel_data_16, first_pixel_data_8, second_pixel_data_16, second_pixel_data_8, percentage, resolution) {
    //6.3.2  Uniformity of electron beam irradiation field (90% isodose line on two diagonal lines)
    var pixel_space = 25.4 / resolution;
    var fdis = cal_film_diagsing(rows, columns, first_pixel_data_16, first_pixel_data_8, percentage, pixel_space);
    if (fdis == undefined) {
        console.log("cal first film diag uniformity error!");
        return undefined;
    }
    var sdis = cal_film_diagsing(rows, columns, second_pixel_data_16, second_pixel_data_8, percentage, pixel_space);
    if (sdis == undefined) {
        console.log("cal second film diag uniformity error!");
        return undefined;
    }
    var dis = (fdis > sdis) ? fdis : sdis;
    return dis;
}
export {
    cal_symmetry,
    cal_uniformity,
    cal_position_indication,
    cal_scale_position,
    cal_penumbra,
    cal_unit_limiting,
    cal_small_multiple_limiting,
    cal_large_muliiple_limiting,
    cal_bed_precision,
    cal_photon_position,
    cal_offset,
    cal_film_axisunifo,
    cal_film_diagunifo,
    cal_film_symmetry
}