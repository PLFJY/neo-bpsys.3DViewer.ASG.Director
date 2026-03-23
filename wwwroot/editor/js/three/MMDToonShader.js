( function () {
	if ( typeof THREE === 'undefined' ) {
		console.error( 'THREE.MMDToonShader: THREE is not defined.' );
		return;
	}

	/**
	 * MMD Toon Shader
	 */
	// 检查 ShaderLib 是否准备好
	if ( ! THREE.ShaderLib || ! THREE.ShaderLib.phong || ! THREE.ShaderLib.toon || ! THREE.ShaderLib.matcap ) {
		console.error( 'THREE.MMDToonShader: Required ShaderLib components (phong, toon, matcap) are missing.' );
		// 提供一个极简的回退方案，防止 MMDLoader 崩溃
		THREE.MMDToonShader = {
			defines: {},
			uniforms: {},
			vertexShader: '',
			fragmentShader: ''
		};
		return;
	}

	const MMDToonShader = {
		defines: {
			TOON: true
		},
		uniforms: THREE.UniformsUtils.merge( [
			THREE.ShaderLib.phong.uniforms,
			{
				gradientMap: { value: null }
			}
		] ),
		vertexShader: THREE.ShaderLib.phong.vertexShader,
		fragmentShader: THREE.ShaderLib.phong.fragmentShader
	};

	THREE.MMDToonShader = MMDToonShader;
	console.log('THREE.MMDToonShader successfully initialized');

} )();
