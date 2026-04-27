function getRotationMatrixFromVector(rotationVector) {
    let q0;
    let q1 = rotationVector[0];
    let q2 = rotationVector[1];
    let q3 = rotationVector[2];

    if (rotationVector.length >= 4) {
        q0 = rotationVector[3];
    } else {
        let sq = 1.0 - q1 * q1 - q2 * q2 - q3 * q3;
        q0 = (sq > 0) ? Math.sqrt(sq) : 0;
    }

    let sq_q1 = 2.0 * q1 * q1;
    let sq_q2 = 2.0 * q2 * q2;
    let sq_q3 = 2.0 * q3 * q3;
    let q1_q2 = 2.0 * q1 * q2;
    let q3_q0 = 2.0 * q3 * q0;
    let q1_q3 = 2.0 * q1 * q3;
    let q2_q0 = 2.0 * q2 * q0;
    let q2_q3 = 2.0 * q2 * q3;
    let q1_q0 = 2.0 * q1 * q0;

    let R = new Float32Array(16);
    R[0] = 1.0 - sq_q2 - sq_q3;
    R[1] = q1_q2 - q3_q0;
    R[2] = q1_q3 + q2_q0;
    R[3] = 0.0;

    R[4] = q1_q2 + q3_q0;
    R[5] = 1.0 - sq_q1 - sq_q3;
    R[6] = q2_q3 - q1_q0;
    R[7] = 0.0;

    R[8] = q1_q3 - q2_q0;
    R[9] = q2_q3 + q1_q0;
    R[10] = 1.0 - sq_q1 - sq_q2;
    R[11] = 0.0;

    R[12] = 0.0;
    R[13] = 0.0;
    R[14] = 0.0;
    R[15] = 1.0;

    return R;
}