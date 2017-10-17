const vertexShader = 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
const fragmentShader = 'varying vec2 vUv;uniform vec3 color;uniform float time;void main() {gl_FragColor = mix(vec4(mod(vUv , 0.05) * 20.0, 1.0, 1.0),vec4(color, 1.0),sin(time));}';

AFRAME.registerShader('material-grid-glitch', {
    schema: {color: {type: 'color'}},
    /**
     * Creates a new THREE.ShaderMaterial using the two shaders defined
     * in vertex.glsl and fragment.glsl.
     */
    init: function () {
        console.log(this);

        const data = this.data;
        this.material  = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                color: { value: new THREE.Color(0xff0000) }
            },
            vertexShader,
            fragmentShader
        });
        this.applyToMesh();
        this.el.addEventListener('model-loaded', () => this.applyToMesh());
    },
    /**
     * Update the ShaderMaterial when component data changes.
     */
    update: function () {
        this.material.uniforms.color.value.set(0xff0000);
    },
    /**
     * Apply the material to the current entity.
     */
    applyToMesh: function() {
        const mesh = this.el.getObject3D('mesh');
        if (mesh) {
            console.log("material mesh");
            mesh.material = this.material;
        }
    },
    /**
     * On each frame, update the 'time' uniform in the shaders.
     */
    tick: function (t) {
        this.material.uniforms.time.value = t / 1000;
    }
})

AFRAME.registerShader('line-dashed', {
    schema: {
        dashSize: {default: 3},
        lineWidth: {default: 1}
    },
    /**
     * `init` used to initialize material. Called once.
     */
    init: function (data) {
        this.material = new THREE.LineDashedMaterial(data);
        this.update(data);  // `update()` currently not called after `init`. (#1834)
    },
    /**
     * `update` used to update the material. Called on initialization and when data updates.
     */
    update: function (data) {
        this.material.dashsize = data.dashsize;
        this.material.linewidth = data.linewidth;
    }
});

AFRAME.registerComponent('shader-updater', {
    schema: {

    },
    init: function () {

    },
    update: function (data) {

    },
    tick: function (t, dt) {
        this.el.components.material.material.uniforms.time.value = t / 1000;
    }
});