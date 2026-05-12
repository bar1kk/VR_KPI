AFRAME.registerComponent('parametric-surface', {
    init: function () {
        const a = 5.0; 
        const b = 2.0; 
        const zSteps = 40;
        const betaSteps = 40;

        const vertices = [];
        const indices = [];

        for (let i = 0; i <= zSteps; i++) {
            let z = (i / zSteps) * a; 
            let r = (z * Math.sqrt(Math.max(0, z * (a - z)))) / b;

            for (let j = 0; j <= betaSteps; j++) {
                let beta = (j / betaSteps) * 2 * Math.PI;
                let x = r * Math.sin(beta);
                let y = r * Math.cos(beta);
                let zCentered = z - (a / 2.0);
                
                vertices.push(x, y, zCentered);
            }
        }

        for (let i = 0; i < zSteps; i++) {
            for (let j = 0; j < betaSteps; j++) {
                let p0 = i * (betaSteps + 1) + j;
                let p1 = p0 + 1;
                let p2 = (i + 1) * (betaSteps + 1) + j;
                let p3 = p2 + 1;

                indices.push(p0, p2, p1);
                indices.push(p1, p2, p3);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: 0x3498db,
            side: THREE.DoubleSide,
            roughness: 0.6,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);

        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
        mesh.add(wireframeMesh);

        mesh.scale.set(0.15, 0.15, 0.15);
        mesh.rotation.x = -Math.PI / 2;

        this.el.setObject3D('mesh', mesh);
    }
});