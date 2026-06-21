import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

globalThis.FileReader = class FileReader {
    async readAsArrayBuffer(blob) {
        this.result = await blob.arrayBuffer();
        this.onloadend?.({ target: this });
    }

    async readAsDataURL(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
        this.onloadend?.({ target: this });
    }
};

const outputPaths = [
    "public/test_civilisation/assets/castle_of_consuegra_light.glb",
    "src/test_civilisation/assets/castle_of_consuegra_light.glb"
];

const scene = new THREE.Scene();

const materials = {
    stone: new THREE.MeshStandardMaterial({ color: 0xb8b0a3, roughness: 0.9 }),
    wall: new THREE.MeshStandardMaterial({ color: 0xd7d1c5, roughness: 0.86 }),
    warmStone: new THREE.MeshStandardMaterial({ color: 0xc58d64, roughness: 0.82 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x8f4f36, roughness: 0.78 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x8fa88b, roughness: 0.95 }),
    gate: new THREE.MeshStandardMaterial({ color: 0x4f392b, roughness: 0.8 }),
    path: new THREE.MeshStandardMaterial({ color: 0xb99c78, roughness: 0.9 })
};

function addBox(name, size, position, material) {
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
}

function addCylinder(name, radius, height, position, material, segments = 14) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
}

function addCone(name, radius, height, position, material, segments = 14) {
    const geometry = new THREE.ConeGeometry(radius, height, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
}

function addBattlements(prefix, startX, endX, z, y, count) {
    const step = (endX - startX) / Math.max(1, count - 1);
    for (let index = 0; index < count; index += 1) {
        addBox(
            `${prefix}_merlon_${index + 1}`,
            [0.16, 0.28, 0.18],
            [startX + step * index, y, z],
            materials.wall
        );
    }
}

function addTower(name, x, z) {
    addCylinder(`${name}_tower`, 0.38, 1.55, [x, 0.6, z], materials.wall);
    addCylinder(`${name}_top`, 0.43, 0.18, [x, 1.43, z], materials.warmStone);
    addCone(`${name}_roof`, 0.45, 0.48, [x, 1.76, z], materials.roof);
}

addBox("rocky_base", [4.8, 0.22, 3.55], [0, -0.11, 0], materials.grass);
addBox("main_courtyard", [3.05, 0.06, 1.95], [0, 0.04, 0.05], materials.path);

addBox("north_defensive_wall", [3.75, 0.72, 0.28], [0, 0.45, -1.25], materials.wall);
addBox("south_defensive_wall", [3.75, 0.72, 0.28], [0, 0.45, 1.25], materials.wall);
addBox("west_defensive_wall", [0.28, 0.72, 2.25], [-1.85, 0.45, 0], materials.wall);
addBox("east_defensive_wall", [0.28, 0.72, 2.25], [1.85, 0.45, 0], materials.wall);

addBattlements("north_wall", -1.62, 1.62, -1.42, 0.93, 13);
addBattlements("south_wall", -1.62, 1.62, 1.42, 0.93, 13);
addBattlements("west_wall", -1.85, -1.85, 0, 0.93, 1);
addBattlements("east_wall", 1.85, 1.85, 0, 0.93, 1);

addTower("north_west", -1.85, -1.25);
addTower("north_east", 1.85, -1.25);
addTower("south_west", -1.85, 1.25);
addTower("south_east", 1.85, 1.25);

addBox("main_keep", [0.84, 1.48, 0.78], [0, 0.84, -0.23], materials.stone);
addBox("keep_upper_room", [0.62, 0.6, 0.58], [0, 1.76, -0.23], materials.wall);
addCone("keep_roof", 0.55, 0.62, [0, 2.36, -0.23], materials.roof, 4).rotation.y =
    Math.PI / 4;

addBox("entrance_gate", [0.72, 0.62, 0.2], [0, 0.36, 1.42], materials.gate);
addBox("gate_arch_top", [0.88, 0.18, 0.26], [0, 0.77, 1.42], materials.warmStone);
addBox("inner_walkway", [0.55, 0.08, 1.45], [0, 0.08, 0.45], materials.path);

for (const [name, x, z] of [
    ["storage_room", -0.82, 0.48],
    ["guard_room", 0.82, 0.46],
    ["cistern", -0.58, -0.55]
]) {
    addBox(name, [0.55, 0.38, 0.48], [x, 0.25, z], materials.stone);
}

scene.traverse((object) => {
    if (object.isMesh) {
        object.geometry.computeVertexNormals();
    }
});

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, { binary: true });
const bytes = Buffer.from(glb);

for (const outputPath of outputPaths) {
    const absolutePath = resolve(outputPath);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, bytes);
    console.log(`${outputPath}: ${bytes.length} bytes`);
}
