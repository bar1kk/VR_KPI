

function deg2rad(angle) {
    return angle * Math.PI / 180;
}

// p: an array of xyz vertex coords
// t: an array of uv tex coords
function Vertex(p,t)
{
    this.p = p;
    this.t = t;
    this.normal = [];
    this.triangles = [];
}

function Triangle(v0, v1, v2)
{
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.normal = [];
    this.tangent = [];
}

// Model Constructor function
function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iTexCoordsBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.count = 0;

    // Identifier of a diffuse texture
    this.idTextureDiffuse  = -1;

    this.BufferData = function(vertices, indices, texCoords) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iTexCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        this.count = indices.length;
    }

    this.Draw = function() {
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.idTextureDiffuse);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iTexCoordsBuffer);
        gl.vertexAttribPointer(shProgram.iAttribTexCoords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribTexCoords);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);

        //gl.drawArrays(gl.LINE_STRIP, 0, this.count);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }

    this.DrawWireframe = function() {

        for (let p=0; p<this.count; p+=3)                    // offset in bytes (UNSIGNED_SHORT is two bytes)
            gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, p*2);
    }
}

function CreateSurfaceData(data) {
    let vertices = [];
    let triangles = [];

    // Arbitrary constants for the formula
    const a = 5.0; 
    const b = 2.0; 
    
    const zSteps = 40;
    const betaSteps = 40;

    // 1. Generate vertices based on the parametric equations
    for (let i = 0; i <= zSteps; i++) {
        // Map i to the range [0, a]
        let z = (i / zSteps) * a; 
        
        // Calculate r(z) = z * sqrt(z * (a - z)) / b
        // Use Math.max to prevent negative numbers inside sqrt due to float precision
        let r = (z * Math.sqrt(Math.max(0, z * (a - z)))) / b;

        for (let j = 0; j <= betaSteps; j++) {
            let beta = (j / betaSteps) * 2 * Math.PI;
            
            // x(z, beta) and y(z, beta)
            let x = r * Math.sin(beta);
            let y = r * Math.cos(beta);

            // Shift Z to center the model for better rotation
            let zCentered = z - (a / 2.0);

            // Texture coordinates
            let u = j / betaSteps;
            let v = i / zSteps;

            vertices.push(new Vertex([x, y, zCentered], [u, v]));
        }
    }

    // 2. Generate triangles to form the polygons
    for (let i = 0; i < zSteps; i++) {
        for (let j = 0; j < betaSteps; j++) {
            let p0 = i * (betaSteps + 1) + j;
            let p1 = p0 + 1;
            let p2 = (i + 1) * (betaSteps + 1) + j;
            let p3 = p2 + 1;

            triangles.push(new Triangle(p0, p2, p1));
            triangles.push(new Triangle(p1, p2, p3));
        }
    }

    // 3. Populate the data arrays
    data.verticesF32 = new Float32Array(vertices.length * 3);
    data.texcoordsF32 = new Float32Array(vertices.length * 2);
    for (let i = 0; i < vertices.length; i++) {
        data.verticesF32[i * 3 + 0] = vertices[i].p[0];
        data.verticesF32[i * 3 + 1] = vertices[i].p[1];
        data.verticesF32[i * 3 + 2] = vertices[i].p[2];

        data.texcoordsF32[i * 2 + 0] = vertices[i].t[0];
        data.texcoordsF32[i * 2 + 1] = vertices[i].t[1];
    }

    data.indicesU16 = new Uint16Array(triangles.length * 3);
    for (let i = 0; i < triangles.length; i++) {
        data.indicesU16[i * 3 + 0] = triangles[i].v0;
        data.indicesU16[i * 3 + 1] = triangles[i].v1;
        data.indicesU16[i * 3 + 2] = triangles[i].v2;
    }
}