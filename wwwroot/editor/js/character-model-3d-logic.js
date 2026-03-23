; (function () {
  const runtimeQuery = new URLSearchParams(window.location.search || '')
  const isHostedEditorWindow = runtimeQuery.get('host') === 'webview'
  const SLOT_CONFIGS = [
    { key: 'scene', label: '场景', roleType: 'scene', index: -1 },
    { key: 'light1', label: '光源1', roleType: 'light', index: 0 },
    { key: 'video1', label: '视频屏幕', roleType: 'video', index: 0 },
    { key: 'camera1', label: '摄像头屏幕', roleType: 'camera', index: 0 },
    { key: 'custom1', label: '自定义模型', roleType: 'custom', index: 0 },
    { key: 'survivor1', label: '求生者1', roleType: 'survivor', index: 0 },
    { key: 'survivor2', label: '求生者2', roleType: 'survivor', index: 1 },
    { key: 'survivor3', label: '求生者3', roleType: 'survivor', index: 2 },
    { key: 'survivor4', label: '求生者4', roleType: 'survivor', index: 3 },
    { key: 'hunter', label: '监管者', roleType: 'hunter', index: 0 }
  ]
  const CAMERA_EVENT_OPTIONS = [
    { key: 'survivor1', label: '求生者选了1个' },
    { key: 'survivor2', label: '求生者选了2个' },
    { key: 'survivor3', label: '求生者选了3个' },
    { key: 'survivor4', label: '求生者选了4个' },
    { key: 'hunterSelected', label: '监管者选了' },
    { key: 'banUpdated', label: '新增ban位/全局ban' }
  ]
  const ENVIRONMENT_PRESETS = {
    duskCinema: {
      label: '电影感黄昏',
      skyTop: '#ffaf73',
      skyBottom: '#463053',
      fogColor: '#403042',
      fogDensity: 0.0084,
      fogNear: 28,
      fogFar: 240,
      ambientColor: '#ffd8b6',
      ambientIntensity: 0.66,
      hemiSkyColor: '#ffc694',
      hemiGroundColor: '#3f3148',
      hemiIntensity: 0.4,
      keyColor: '#ffd5aa',
      keyIntensity: 1.72,
      keyPos: { x: 10, y: 18, z: 8 },
      fillColor: '#91b6ff',
      fillIntensity: 0.54,
      fillPos: { x: -12, y: 7, z: -9 },
      shadowOpacity: 0.34
    },
    cyberpunkNight: {
      label: '赛博朋克夜景',
      skyTop: '#3245a1',
      skyBottom: '#27133d',
      fogColor: '#21122f',
      fogDensity: 0.0108,
      fogNear: 20,
      fogFar: 196,
      ambientColor: '#8eb2ff',
      ambientIntensity: 0.48,
      hemiSkyColor: '#58d5ff',
      hemiGroundColor: '#271438',
      hemiIntensity: 0.5,
      keyColor: '#ff73d8',
      keyIntensity: 1.48,
      keyPos: { x: 8, y: 13, z: 9 },
      fillColor: '#6ee8ff',
      fillIntensity: 0.78,
      fillPos: { x: -10, y: 6, z: -7 },
      shadowOpacity: 0.3
    },
    horrorNight: {
      label: '恐怖风夜晚',
      skyTop: '#1d3440',
      skyBottom: '#0d1117',
      fogColor: '#0f171d',
      fogDensity: 0.0135,
      fogNear: 16,
      fogFar: 132,
      ambientColor: '#748f88',
      ambientIntensity: 0.34,
      hemiSkyColor: '#4d6770',
      hemiGroundColor: '#0f1417',
      hemiIntensity: 0.34,
      keyColor: '#afd5c9',
      keyIntensity: 1.02,
      keyPos: { x: 4, y: 10, z: 5 },
      fillColor: '#415969',
      fillIntensity: 0.34,
      fillPos: { x: -6, y: 4, z: -6 },
      shadowOpacity: 0.4
    },
    sunnyDaylight: {
      label: '晴空日光',
      skyTop: '#88cdfd',
      skyBottom: '#edf7ff',
      fogColor: '#ddeeff',
      fogDensity: 0.0038,
      fogNear: 42,
      fogFar: 340,
      ambientColor: '#ffffff',
      ambientIntensity: 0.82,
      hemiSkyColor: '#b2ddff',
      hemiGroundColor: '#ddd5c7',
      hemiIntensity: 0.54,
      keyColor: '#fff2de',
      keyIntensity: 1.86,
      keyPos: { x: 12, y: 22, z: 10 },
      fillColor: '#d8e9ff',
      fillIntensity: 0.78,
      fillPos: { x: -13, y: 9, z: -8 },
      shadowOpacity: 0.24
    },
    studioHighKey: {
      label: '棚拍高调光',
      skyTop: '#eef3ff',
      skyBottom: '#fbfcff',
      fogColor: '#edf2ff',
      fogDensity: 0.0035,
      fogNear: 44,
      fogFar: 360,
      ambientColor: '#ffffff',
      ambientIntensity: 0.9,
      hemiSkyColor: '#ffffff',
      hemiGroundColor: '#eceff7',
      hemiIntensity: 0.62,
      keyColor: '#fff8ed',
      keyIntensity: 1.92,
      keyPos: { x: 11, y: 19, z: 8 },
      fillColor: '#edf4ff',
      fillIntensity: 0.92,
      fillPos: { x: -11, y: 8, z: -8 },
      shadowOpacity: 0.18
    },
    goldenNoon: {
      label: '暖阳正午',
      skyTop: '#9fd0ff',
      skyBottom: '#ffe8ba',
      fogColor: '#fde7b0',
      fogDensity: 0.0048,
      fogNear: 34,
      fogFar: 300,
      ambientColor: '#ffe2ac',
      ambientIntensity: 0.86,
      hemiSkyColor: '#a9d9ff',
      hemiGroundColor: '#f3db9f',
      hemiIntensity: 0.56,
      keyColor: '#ffe4a3',
      keyIntensity: 1.94,
      keyPos: { x: 10, y: 21, z: 9 },
      fillColor: '#ffd6ab',
      fillIntensity: 0.82,
      fillPos: { x: -12, y: 8, z: -7 },
      shadowOpacity: 0.24
    },
    cloudyStage: {
      label: '柔光阴天',
      skyTop: '#aebccc',
      skyBottom: '#dce5ee',
      fogColor: '#cbd5df',
      fogDensity: 0.0056,
      fogNear: 32,
      fogFar: 250,
      ambientColor: '#f2f6fb',
      ambientIntensity: 0.72,
      hemiSkyColor: '#cad7e3',
      hemiGroundColor: '#b7b7ae',
      hemiIntensity: 0.5,
      keyColor: '#f5f5f0',
      keyIntensity: 1.42,
      keyPos: { x: 9, y: 17, z: 8 },
      fillColor: '#d7e1ea',
      fillIntensity: 0.74,
      fillPos: { x: -10, y: 7, z: -7 },
      shadowOpacity: 0.22
    },
    moonlitBlue: {
      label: '月夜蓝调',
      skyTop: '#5f7bb3',
      skyBottom: '#1e2941',
      fogColor: '#253248',
      fogDensity: 0.0088,
      fogNear: 24,
      fogFar: 220,
      ambientColor: '#b2c5e8',
      ambientIntensity: 0.46,
      hemiSkyColor: '#7f99ca',
      hemiGroundColor: '#202633',
      hemiIntensity: 0.4,
      keyColor: '#d3e2ff',
      keyIntensity: 1.28,
      keyPos: { x: 7, y: 15, z: 9 },
      fillColor: '#6f8fb9',
      fillIntensity: 0.5,
      fillPos: { x: -9, y: 6, z: -8 },
      shadowOpacity: 0.3
    },
    sunsetRose: {
      label: '玫瑰晚霞',
      skyTop: '#ff9eb2',
      skyBottom: '#5a3558',
      fogColor: '#5e4056',
      fogDensity: 0.0078,
      fogNear: 26,
      fogFar: 236,
      ambientColor: '#ffd6d7',
      ambientIntensity: 0.64,
      hemiSkyColor: '#ffb3bf',
      hemiGroundColor: '#5a3d51',
      hemiIntensity: 0.42,
      keyColor: '#ffd8c6',
      keyIntensity: 1.66,
      keyPos: { x: 10, y: 18, z: 6 },
      fillColor: '#a5b7ff',
      fillIntensity: 0.48,
      fillPos: { x: -12, y: 6, z: -8 },
      shadowOpacity: 0.31
    },
    mistyMorning: {
      label: '薄雾清晨',
      skyTop: '#b8d3df',
      skyBottom: '#f2ede2',
      fogColor: '#d9e1dc',
      fogDensity: 0.0068,
      fogNear: 22,
      fogFar: 210,
      ambientColor: '#f7f3ea',
      ambientIntensity: 0.74,
      hemiSkyColor: '#c6dce7',
      hemiGroundColor: '#d9d0c2',
      hemiIntensity: 0.52,
      keyColor: '#fff2da',
      keyIntensity: 1.58,
      keyPos: { x: 9, y: 18, z: 7 },
      fillColor: '#dce7ef',
      fillIntensity: 0.62,
      fillPos: { x: -11, y: 7, z: -7 },
      shadowOpacity: 0.2
    }
  }
  const QUALITY_PRESETS = {
    low: { label: '低', pixelRatio: 1.0, shadowMap: 1024, shadowRadius: 0.75, exposure: 0.98, contrast: 1.0, cinemaOverlay: 0.0, rim: 0.03, bounce: 0.02 },
    medium: { label: '中', pixelRatio: 1.25, shadowMap: 1536, shadowRadius: 0.95, exposure: 1.0, contrast: 1.03, cinemaOverlay: 0.0, rim: 0.06, bounce: 0.04 },
    high: { label: '高', pixelRatio: 1.6, shadowMap: 2048, shadowRadius: 1.15, exposure: 1.02, contrast: 1.06, cinemaOverlay: 0.0, rim: 0.12, bounce: 0.08 },
    cinematic: { label: '电影级', pixelRatio: 1.9, shadowMap: 3072, shadowRadius: 1.5, exposure: 1.06, contrast: 1.12, cinemaOverlay: 0.5, rim: 0.22, bounce: 0.14 },
    ultra: { label: '超清细节', pixelRatio: 2.2, shadowMap: 4096, shadowRadius: 1.85, exposure: 1.08, contrast: 1.15, cinemaOverlay: 0.28, rim: 0.28, bounce: 0.18 }
  }
  const WEATHER_PRESETS = {
    clear: {
      label: '关闭',
      rain: false,
      wind: false,
      lightning: false,
      rainCount: 0,
      rainSpeed: 0,
      rainLength: 0.9,
      rainDriftX: 0,
      rainDriftZ: 0,
      overlayOpacity: 0,
      windOverlayOpacity: 0,
      ambientMultiplier: 1,
      hemiMultiplier: 1,
      keyMultiplier: 1,
      fillMultiplier: 1,
      exposureMultiplier: 1,
      swayAmplitude: 0,
      swayPitch: 0,
      swayYaw: 0,
      windScrollSpeed: 0,
      windParticleCount: 0,
      windParticleSpeed: 0
    },
    thunderstorm: {
      label: '雷雨天',
      rain: true,
      wind: false,
      lightning: true,
      rainCount: 760,
      rainSpeed: 22,
      rainLength: 1.3,
      rainDriftX: 0.1,
      rainDriftZ: 0.02,
      overlayOpacity: 0.24,
      windOverlayOpacity: 0.04,
      ambientMultiplier: 0.76,
      hemiMultiplier: 0.72,
      keyMultiplier: 0.84,
      fillMultiplier: 0.82,
      exposureMultiplier: 0.92,
      swayAmplitude: 0,
      swayPitch: 0,
      swayYaw: 0,
      windScrollSpeed: 0.12,
      windParticleCount: 0,
      windParticleSpeed: 0
    },
    windy: {
      label: '刮风天',
      rain: false,
      wind: true,
      lightning: false,
      rainCount: 0,
      rainSpeed: 0,
      rainLength: 0.9,
      rainDriftX: 0,
      rainDriftZ: 0,
      overlayOpacity: 0.1,
      windOverlayOpacity: 0.24,
      ambientMultiplier: 0.94,
      hemiMultiplier: 0.92,
      keyMultiplier: 0.96,
      fillMultiplier: 0.94,
      exposureMultiplier: 0.97,
      swayAmplitude: 0.042,
      swayPitch: 0.012,
      swayYaw: 0.018,
      windScrollSpeed: 0.88,
      windParticleCount: 180,
      windParticleSpeed: 5.6
    },
    stormWindy: {
      label: '刮风雷雨天',
      rain: true,
      wind: true,
      lightning: true,
      rainCount: 1100,
      rainSpeed: 28,
      rainLength: 1.55,
      rainDriftX: 0.42,
      rainDriftZ: 0.08,
      overlayOpacity: 0.3,
      windOverlayOpacity: 0.32,
      ambientMultiplier: 0.68,
      hemiMultiplier: 0.64,
      keyMultiplier: 0.78,
      fillMultiplier: 0.76,
      exposureMultiplier: 0.88,
      swayAmplitude: 0.06,
      swayPitch: 0.018,
      swayYaw: 0.026,
      windScrollSpeed: 1.22,
      windParticleCount: 260,
      windParticleSpeed: 8.2
    }
  }

  const ADVANCED_RENDER_DEFAULT = {
    antialiasEnabled: true,
    lightTextureEnabled: true,
    exposure: 1,
    contrast: 1,
    saturation: 1,
    renderScale: 1,
    shadowMapBoost: 1,
    shadowRadiusBoost: 1,
    shadowBias: -0.00012,
    shadowNormalBias: 0.01,
    ambientBoost: 1,
    hemiBoost: 1,
    keyBoost: 1,
    fillBoost: 1,
    rimBoost: 1,
    bounceBoost: 1
  }

  const CAMERA_EASING_PRESETS = {
    smooth: { label: '平滑默认', type: 'smooth' },
    easeIn: { label: '慢入', type: 'cubic-bezier', bezier: { x1: 0.42, y1: 0, x2: 1, y2: 1 } },
    easeOut: { label: '快出', type: 'cubic-bezier', bezier: { x1: 0, y1: 0, x2: 0.58, y2: 1 } },
    easeInOut: { label: '慢入慢出', type: 'cubic-bezier', bezier: { x1: 0.42, y1: 0, x2: 0.58, y2: 1 } },
    sharpInOut: { label: '强烈加减速', type: 'cubic-bezier', bezier: { x1: 0.7, y1: 0, x2: 0.3, y2: 1 } },
    custom: { label: '自定义贝塞尔', type: 'custom' }
  }

  const DEFAULT_CAMERA_EASING = {
    preset: 'smooth',
    bezier: { x1: 0.2, y1: 0, x2: 0.2, y2: 1 }
  }

  const DEFAULT_LAYOUT = {
    mode: 'edit',
    toolbarCollapsed: false,
    advancedRender: deepClone(ADVANCED_RENDER_DEFAULT),
    transparentBackground: true,
    environmentPreset: 'duskCinema',
    qualityPreset: 'high',
    weatherPreset: 'clear',
    weather: {
      windIntensity: 1.35,
      audioEnabled: true,
      audioVolume: 0.65
    },
    maxFps: 60,
    droneMode: false,
    fogEnabled: true,
    fogStrength: 1,
    shadowStrength: 0.45,
    entranceEffect: 'fade',
    entranceParticle: {
      path: ''
    },
    stylizedRender: {
      toonEnabled: false,
      toonSteps: 3,
      outlineEnabled: true,
      outlineThickness: 0.004,
      outlineColor: '#000000',
      outlineAlpha: 1
    },
    survivorScale: 1,
    hunterScale: 1.1,
    roleScaleOverrides: {},
    videoScreen: {
      path: '',
      loop: true,
      muted: true,
      width: 2.2,
      height: 1.2
    },
    cameraScreen: {
      enabled: false,
      deviceId: '',
      muted: true,
      mirrored: true,
      width: 2.2,
      height: 1.2
    },
    customModelPath: '',
    scene: {
      modelPath: '',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    },
    slots: {
      light1: { position: { x: 0, y: 4.2, z: 3.2 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      video1: { position: { x: 0, y: 1.4, z: -1.8 }, rotation: { x: 0, y: 180, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      camera1: { position: { x: 2.8, y: 1.4, z: -1.8 }, rotation: { x: 0, y: 180, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      custom1: { position: { x: 0, y: 0, z: 2.0 }, rotation: { x: 0, y: 180, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      survivor1: { position: { x: -2.4, y: 0, z: 0.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      survivor2: { position: { x: -0.8, y: 0, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      survivor3: { position: { x: 0.8, y: 0, z: 1.0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      survivor4: { position: { x: 2.4, y: 0, z: 0.8 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      hunter: { position: { x: 0, y: 0, z: -2.2 }, rotation: { x: 0, y: 180, z: 0 }, scale: { x: 1.1, y: 1.1, z: 1.1 } }
    },
    lights: {
      light1: {
        color: '#fff1d6',
        intensity: 2.4,
        distance: 0,
        decay: 2
      }
    },
    camera: {
      position: { x: 0, y: 2, z: 8 },
      target: { x: 0, y: 1, z: 0 },
      fov: 45
    },
    cameraTransitionMs: 900,
    cameraEasing: deepClone(DEFAULT_CAMERA_EASING),
    cameraKeyframes: {
      survivor1: null,
      survivor2: null,
      survivor3: null,
      survivor4: null,
      hunterSelected: null,
      banUpdated: null
    }
  }

  const state = {
    bp: {
      survivors: [null, null, null, null],
      hunter: null,
      hunterBannedSurvivors: [],
      survivorBannedHunters: [],
      globalBannedSurvivors: [],
      globalBannedHunters: []
    },
    officialModelMap: {},
    layout: deepClone(DEFAULT_LAYOUT),
    selectedSlot: 'survivor1',
    slotModelPaths: {},
    slotDisplayNames: {},
    roleModelPathCache: {},
    bpSelectionState: {
      survivorCount: 0,
      hunterSelected: false,
      roundBanCount: 0,
      globalBanCount: 0
    },
    cameraDevices: [],
    virtualCameraMode: {
      enabled: false,
      savedFrame: null,
      savedTransitionMs: null
    }
  }

  let THREE = null
  let renderer = null
  let rendererAntialiasEnabled = true
  let scene = null
  let camera = null
  let root = null
  let grid = null
  let axes = null
  let skyDome = null
  let shadowGround = null
  let blobShadowTexture = null
  const sceneLights = {
    ambient: null,
    key: null,
    fill: null,
    hemi: null,
    rim: null,
    bounce: null
  }
  let gltfLoader = null
  let objLoader = null
  let mtlLoader = null
  const slotRuntime = new Map()
  const mixers = new Map()
  const lightRigs = new Map()
  let rafId = 0
  let clock = null
  let outlineEffect = null
  let saveTimer = null
  let cameraCurveDragHandle = ''
  let cameraTransition = null
  let fpsAccum = 0
  let fpsFrames = 0
  let fpsLast = 0
  let frameLimiterLastAt = 0
  let bpRoleSyncRunning = false
  let bpRoleSyncPending = false
  let pendingCameraEventKey = ''
  const CAMERA_EPSILON_RADIUS = 1e-6
  const CAMERA_MIN_FOV = 12
  const CAMERA_MAX_FOV = 80
  const DEFAULT_CAMERA_FOV = 45
  const VIRTUAL_CAMERA_STAGE_FOV = 14
  const CAMERA_ZOOM_FACTOR = 0.00105
  const activeEntranceEffects = []
  const pendingEntranceEffects = new Set()
  const activeParticleBursts = []
  const toonGradientMapCache = new Map()
  const entranceParticleAsset = {
    path: '',
    scene: null,
    animations: [],
    loadingPromise: null
  }
  const weatherRuntime = {
    group: null,
    rain: null,
    rainCount: 0,
    rainPositions: null,
    rainSeed: null,
    windDust: null,
    windDustCount: 0,
    windDustPositions: null,
    windDustSeed: null,
    configKey: 'clear',
    time: 0,
    flashStrength: 0,
    lightningCooldown: 2.8,
    lightningPulseTimer: 0,
    pendingFlash: 0,
    windScroll: 0
  }
  const weatherAudio = {
    context: null,
    masterGain: null,
    windGain: null,
    rainGain: null,
    noiseBuffer: null,
    rainNoiseBuffer: null,
    windSource: null,
    rainSource: null,
    windLowpass: null,
    windHighpass: null,
    windBodyGain: null,
    rainHighpass: null,
    rainLowpass: null,
    unlocked: false,
    unlockBound: false
  }

  const orbit = {
    target: { x: 0, y: 1, z: 0 },
    desiredTarget: { x: 0, y: 1, z: 0 },
    yaw: 0,
    desiredYaw: 0,
    pitch: 0.18,
    desiredPitch: 0.18,
    radius: 8,
    desiredRadius: 8,
    smoothing: 0.2,
    dragging: false,
    panning: false,
    lastX: 0,
    lastY: 0
  }
  const cameraMoveState = {
    dir: '',
    activeBtn: null
  }
  const cameraKeyboardState = {
    pressed: new Set(),
    dirty: false
  }

  const dom = {
    toolbar: document.getElementById('toolbar'),
    toolbarBody: document.getElementById('toolbarBody'),
    toolbarCollapseBtn: document.getElementById('toolbarCollapseBtn'),
    renderRoot: document.getElementById('renderRoot'),
    fogOverlay: document.getElementById('fogOverlay'),
    cinemaOverlay: document.getElementById('cinemaOverlay'),
    weatherOverlay: document.getElementById('weatherOverlay'),
    weatherWindOverlay: document.getElementById('weatherWindOverlay'),
    weatherFlashOverlay: document.getElementById('weatherFlashOverlay'),
    fpsBadge: document.getElementById('fpsBadge'),
    statusBar: document.getElementById('statusBar'),
    modeToggleBtn: document.getElementById('modeToggleBtn'),
    sceneImportBtn: document.getElementById('sceneImportBtn'),
    sceneClearBtn: document.getElementById('sceneClearBtn'),
    videoImportBtn: document.getElementById('videoImportBtn'),
    videoClearBtn: document.getElementById('videoClearBtn'),
    videoLoopEnabled: document.getElementById('videoLoopEnabled'),
    videoMuted: document.getElementById('videoMuted'),
    videoWidth: document.getElementById('videoWidth'),
    videoHeight: document.getElementById('videoHeight'),
    applyVideoSettingsBtn: document.getElementById('applyVideoSettingsBtn'),
    cameraDeviceSelect: document.getElementById('cameraDeviceSelect'),
    cameraRefreshDevicesBtn: document.getElementById('cameraRefreshDevicesBtn'),
    cameraStartBtn: document.getElementById('cameraStartBtn'),
    cameraStopBtn: document.getElementById('cameraStopBtn'),
    virtualCameraModeToggleBtn: document.getElementById('virtualCameraModeToggleBtn'),
    cameraMuted: document.getElementById('cameraMuted'),
    cameraMirrored: document.getElementById('cameraMirrored'),
    cameraWidth: document.getElementById('cameraWidth'),
    cameraHeight: document.getElementById('cameraHeight'),
    applyCameraSettingsBtn: document.getElementById('applyCameraSettingsBtn'),
    cameraStatus: document.getElementById('cameraStatus'),
    virtualCameraModeStatus: document.getElementById('virtualCameraModeStatus'),
    slotTabs: document.getElementById('slotTabs'),
    customModelImportBtn: document.getElementById('customModelImportBtn'),
    customModelClearBtn: document.getElementById('customModelClearBtn'),
    focusSelectedBtn: document.getElementById('focusSelectedBtn'),
    posX: document.getElementById('posX'),
    posY: document.getElementById('posY'),
    posZ: document.getElementById('posZ'),
    rotX: document.getElementById('rotX'),
    rotY: document.getElementById('rotY'),
    rotZ: document.getElementById('rotZ'),
    uniScale: document.getElementById('uniScale'),
    applyTransformBtn: document.getElementById('applyTransformBtn'),
    openRoleScaleModalBtn: document.getElementById('openRoleScaleModalBtn'),
    roleScaleModal: document.getElementById('roleScaleModal'),
    closeRoleScaleModalBtn: document.getElementById('closeRoleScaleModalBtn'),
    roleScaleRoleSelect: document.getElementById('roleScaleRoleSelect'),
    roleScaleModalEmpty: document.getElementById('roleScaleModalEmpty'),
    roleScaleModalFields: document.getElementById('roleScaleModalFields'),
    roleScaleValue: document.getElementById('roleScaleValue'),
    roleScaleBaseValue: document.getElementById('roleScaleBaseValue'),
    roleScaleEffectiveValue: document.getElementById('roleScaleEffectiveValue'),
    roleScaleRoleInfo: document.getElementById('roleScaleRoleInfo'),
    applyRoleScaleBtn: document.getElementById('applyRoleScaleBtn'),
    resetRoleScaleBtn: document.getElementById('resetRoleScaleBtn'),
    cameraEventSelect: document.getElementById('cameraEventSelect'),
    saveCameraKeyframeBtn: document.getElementById('saveCameraKeyframeBtn'),
    previewCameraKeyframeBtn: document.getElementById('previewCameraKeyframeBtn'),
    clearCameraKeyframeBtn: document.getElementById('clearCameraKeyframeBtn'),
    cameraTransitionMs: document.getElementById('cameraTransitionMs'),
    cameraEasingPreset: document.getElementById('cameraEasingPreset'),
    openCameraCurveModalBtn: document.getElementById('openCameraCurveModalBtn'),
    cameraBezierX1: document.getElementById('cameraBezierX1'),
    cameraBezierY1: document.getElementById('cameraBezierY1'),
    cameraBezierX2: document.getElementById('cameraBezierX2'),
    cameraBezierY2: document.getElementById('cameraBezierY2'),
    cameraCurveSummary: document.getElementById('cameraCurveSummary'),
    cameraCurveModal: document.getElementById('cameraCurveModal'),
    closeCameraCurveModalBtn: document.getElementById('closeCameraCurveModalBtn'),
    cameraCurveModalPreset: document.getElementById('cameraCurveModalPreset'),
    cameraCurveCanvas: document.getElementById('cameraCurveCanvas'),
    cameraCurveResetBtn: document.getElementById('cameraCurveResetBtn'),
    cameraCurveHint: document.getElementById('cameraCurveHint'),
    applyCameraCurveBtn: document.getElementById('applyCameraCurveBtn'),
    previewCameraCurveBtn: document.getElementById('previewCameraCurveBtn'),
    cameraEventInfo: document.getElementById('cameraEventInfo')
    , environmentPresetSelect: document.getElementById('environmentPresetSelect')
    , renderQualitySelect: document.getElementById('renderQualitySelect')
    , applyEnvironmentPresetBtn: document.getElementById('applyEnvironmentPresetBtn')
    , fogEnabled: document.getElementById('fogEnabled')
    , fogStrength: document.getElementById('fogStrength')
    , shadowStrength: document.getElementById('shadowStrength')
    , droneModeEnabled: document.getElementById('droneModeEnabled')
    , maxFps: document.getElementById('maxFps')
    , weatherPresetSelect: document.getElementById('weatherPresetSelect')
    , applyWeatherPresetBtn: document.getElementById('applyWeatherPresetBtn')
    , weatherPresetInfo: document.getElementById('weatherPresetInfo')
    , weatherWindIntensity: document.getElementById('weatherWindIntensity')
    , weatherAudioEnabled: document.getElementById('weatherAudioEnabled')
    , weatherAudioVolume: document.getElementById('weatherAudioVolume')
    , applyWeatherSettingsBtn: document.getElementById('applyWeatherSettingsBtn')
    , entranceEffectSelect: document.getElementById('entranceEffectSelect')
    , particleImportBtn: document.getElementById('particleImportBtn')
    , particleClearBtn: document.getElementById('particleClearBtn')
    , particleFileInfo: document.getElementById('particleFileInfo')
    , stylizedToonEnabled: document.getElementById('stylizedToonEnabled')
    , stylizedToonSteps: document.getElementById('stylizedToonSteps')
    , stylizedOutlineEnabled: document.getElementById('stylizedOutlineEnabled')
    , stylizedOutlineThickness: document.getElementById('stylizedOutlineThickness')
    , stylizedOutlineColor: document.getElementById('stylizedOutlineColor')
    , stylizedOutlineAlpha: document.getElementById('stylizedOutlineAlpha')
    , cameraMoveStep: document.getElementById('cameraMoveStep')
    , cameraMoveButtons: Array.from(document.querySelectorAll('[data-cam-move]'))
    , lightColor: document.getElementById('lightColor')
    , lightIntensity: document.getElementById('lightIntensity')
    , applyLightBtn: document.getElementById('applyLightBtn')
    , advExposure: document.getElementById('advExposure')
    , advAntialiasEnabled: document.getElementById('advAntialiasEnabled')
    , advContrast: document.getElementById('advContrast')
    , advSaturation: document.getElementById('advSaturation')
    , advRenderScale: document.getElementById('advRenderScale')
    , advShadowMapBoost: document.getElementById('advShadowMapBoost')
    , advShadowRadius: document.getElementById('advShadowRadius')
    , advShadowBias: document.getElementById('advShadowBias')
    , advShadowNormalBias: document.getElementById('advShadowNormalBias')
    , advAmbientBoost: document.getElementById('advAmbientBoost')
    , advLightTextureEnabled: document.getElementById('advLightTextureEnabled')
    , advHemiBoost: document.getElementById('advHemiBoost')
    , advKeyBoost: document.getElementById('advKeyBoost')
    , advFillBoost: document.getElementById('advFillBoost')
    , advRimBoost: document.getElementById('advRimBoost')
    , advBounceBoost: document.getElementById('advBounceBoost')
    , applyAdvancedRenderBtn: document.getElementById('applyAdvancedRenderBtn')
    , resetAdvancedRenderBtn: document.getElementById('resetAdvancedRenderBtn')
  }

  function deepClone(v) {
    return JSON.parse(JSON.stringify(v))
  }

  function setStatus(text) {
    if (dom.statusBar) dom.statusBar.textContent = text || ''
  }

  function showModelLoadErrorDialog(detail) {
    try {
      const d = (detail && typeof detail === 'object') ? detail : {}
      const slotText = d.slotLabel || d.slot || '-'
      const errorText = d.errorMessage || '-'
      const lines = [
        '模型加载失败',
        `槽位: ${slotText}`,
        `路径: ${d.modelPath || '-'}`,
        `URL: ${d.resolvedUrl || '-'}`,
        `扩展名: ${d.ext || '-'}`,
        `错误: ${errorText}`
      ]
      if (d.errorStack) {
        const stack = String(d.errorStack).split('\n').slice(0, 6).join('\n')
        lines.push(`堆栈:\n${stack}`)
      }

      // 静默错误：不弹窗打断用户，仅写状态栏和控制台
      const joined = lines.join('\n')
      const lower = joined.toLowerCase()
      const likelyMissingAsset = lower.includes('file-not-found')
        || lower.includes('failed to fetch')
        || lower.includes('not found')
        || lower.includes('err_file_not_found')
        || lower.includes('empty-path')
        || lower.includes('invalid-url')
      if (likelyMissingAsset) {
        setStatus(`模型资源不存在: ${slotText}`)
        console.warn('[CharacterModel3D] 模型缺失(已静默):', d)
      } else {
        setStatus(`模型加载失败: ${slotText}`)
        console.error('[CharacterModel3D] 模型加载失败(已静默):', d)
      }
    } catch (e) {
      console.error('[CharacterModel3D] 弹出错误对话框失败:', e)
    }
  }

  function asNumber(value, fallback = 0) {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
  }

  function clampCameraFov(value, fallback = DEFAULT_CAMERA_FOV) {
    const safeFallback = Math.max(CAMERA_MIN_FOV, Math.min(CAMERA_MAX_FOV, asNumber(fallback, DEFAULT_CAMERA_FOV)))
    return Math.max(CAMERA_MIN_FOV, Math.min(CAMERA_MAX_FOV, asNumber(value, safeFallback)))
  }

  function getViewportAspect() {
    const w = dom.renderRoot?.clientWidth || window.innerWidth || 1920
    const h = dom.renderRoot?.clientHeight || window.innerHeight || 1080
    return Math.max(0.1, w / Math.max(1, h))
  }

  function clampCameraAspect(value, fallback = null) {
    const safeFallback = Math.max(0.1, asNumber(fallback, getViewportAspect()))
    return Math.max(0.1, asNumber(value, safeFallback))
  }

  function ensureVec3(input, fallback = { x: 0, y: 0, z: 0 }) {
    const src = (input && typeof input === 'object') ? input : {}
    return {
      x: asNumber(src.x, fallback.x),
      y: asNumber(src.y, fallback.y),
      z: asNumber(src.z, fallback.z)
    }
  }

  function normalizeCameraKeyframe(input, fallback = null) {
    if (!input || typeof input !== 'object') return fallback
    const baseFallback = fallback && typeof fallback === 'object'
      ? fallback
      : { position: { x: 0, y: 2, z: 8 }, target: { x: 0, y: 1, z: 0 }, fov: DEFAULT_CAMERA_FOV }
    return {
      position: ensureVec3(input.position, baseFallback.position),
      target: ensureVec3(input.target, baseFallback.target),
      fov: clampCameraFov(input.fov, baseFallback.fov)
    }
  }

  function normalizeRoleScaleOverrides(input) {
    const source = (input && typeof input === 'object') ? input : {}
    const out = {}
    Object.keys(source).forEach((key) => {
      const roleName = sanitizeRoleName(key)
      const scale = Math.max(0.001, asNumber(source[key], NaN))
      if (!roleName || !Number.isFinite(scale) || Math.abs(scale - 1) < 1e-6) return
      out[roleName] = scale
    })
    return out
  }

  function normalizeCameraEasing(input) {
    const source = (input && typeof input === 'object') ? input : {}
    const preset = typeof source.preset === 'string' && Object.prototype.hasOwnProperty.call(CAMERA_EASING_PRESETS, source.preset)
      ? source.preset
      : DEFAULT_CAMERA_EASING.preset
    const bezierInput = (source.bezier && typeof source.bezier === 'object') ? source.bezier : {}
    return {
      preset,
      bezier: {
        x1: Math.max(0, Math.min(1, asNumber(bezierInput.x1, DEFAULT_CAMERA_EASING.bezier.x1))),
        y1: Math.max(0, Math.min(1, asNumber(bezierInput.y1, DEFAULT_CAMERA_EASING.bezier.y1))),
        x2: Math.max(0, Math.min(1, asNumber(bezierInput.x2, DEFAULT_CAMERA_EASING.bezier.x2))),
        y2: Math.max(0, Math.min(1, asNumber(bezierInput.y2, DEFAULT_CAMERA_EASING.bezier.y2)))
      }
    }
  }

  function isRoleSlotKey(key) {
    return key === 'hunter' || (typeof key === 'string' && key.startsWith('survivor'))
  }

  function getRoleNameForSlot(key) {
    return sanitizeRoleName(state.slotDisplayNames?.[key] || '')
  }

  function getRoleScaleOverride(roleName) {
    const normalized = sanitizeRoleName(roleName)
    if (!normalized) return 1
    return Math.max(0.001, asNumber(state.layout?.roleScaleOverrides?.[normalized], 1))
  }

  function getRoleScaleMultiplierForSlot(key) {
    if (!isRoleSlotKey(key)) return 1
    return getRoleScaleOverride(getRoleNameForSlot(key))
  }

  function getBaseUniformScaleForSlot(key, transform) {
    const s = ensureVec3(transform?.scale, { x: 1, y: 1, z: 1 })
    if (key.startsWith('survivor')) {
      return Math.max(0.001, asNumber(state.layout?.survivorScale, asNumber(s.x, asNumber(s.y, asNumber(s.z, 1)))))
    }
    if (key === 'hunter') {
      return Math.max(0.001, asNumber(state.layout?.hunterScale, asNumber(s.x, asNumber(s.y, asNumber(s.z, 1)))))
    }
    return Math.max(0.001, asNumber(s.x, asNumber(s.y, asNumber(s.z, 1))))
  }

  function normalizeLayout(raw) {
    const base = (raw && typeof raw === 'object') ? raw : {}
    const out = deepClone(DEFAULT_LAYOUT)
    out.mode = base.mode === 'render' ? 'render' : 'edit'
    out.toolbarCollapsed = !!base.toolbarCollapsed
    out.advancedRender = deepClone(ADVANCED_RENDER_DEFAULT)
    const adv = (base?.advancedRender && typeof base.advancedRender === 'object') ? base.advancedRender : {}
    out.advancedRender.antialiasEnabled = adv.antialiasEnabled !== false
    out.advancedRender.lightTextureEnabled = adv.lightTextureEnabled !== false
    out.advancedRender.exposure = Math.max(0.6, Math.min(2.2, asNumber(adv.exposure, ADVANCED_RENDER_DEFAULT.exposure)))
    out.advancedRender.contrast = Math.max(0.8, Math.min(1.6, asNumber(adv.contrast, ADVANCED_RENDER_DEFAULT.contrast)))
    out.advancedRender.saturation = Math.max(0.7, Math.min(1.8, asNumber(adv.saturation, ADVANCED_RENDER_DEFAULT.saturation)))
    out.advancedRender.renderScale = Math.max(0.7, Math.min(2, asNumber(adv.renderScale, ADVANCED_RENDER_DEFAULT.renderScale)))
    out.advancedRender.shadowMapBoost = Math.max(0.5, Math.min(2, asNumber(adv.shadowMapBoost, ADVANCED_RENDER_DEFAULT.shadowMapBoost)))
    out.advancedRender.shadowRadiusBoost = Math.max(0.5, Math.min(2.5, asNumber(adv.shadowRadiusBoost, ADVANCED_RENDER_DEFAULT.shadowRadiusBoost)))
    out.advancedRender.shadowBias = Math.max(-0.001, Math.min(0.001, asNumber(adv.shadowBias, ADVANCED_RENDER_DEFAULT.shadowBias)))
    out.advancedRender.shadowNormalBias = Math.max(0, Math.min(0.1, asNumber(adv.shadowNormalBias, ADVANCED_RENDER_DEFAULT.shadowNormalBias)))
    out.advancedRender.ambientBoost = Math.max(0, Math.min(3, asNumber(adv.ambientBoost, ADVANCED_RENDER_DEFAULT.ambientBoost)))
    out.advancedRender.hemiBoost = Math.max(0, Math.min(3, asNumber(adv.hemiBoost, ADVANCED_RENDER_DEFAULT.hemiBoost)))
    out.advancedRender.keyBoost = Math.max(0, Math.min(3, asNumber(adv.keyBoost, ADVANCED_RENDER_DEFAULT.keyBoost)))
    out.advancedRender.fillBoost = Math.max(0, Math.min(3, asNumber(adv.fillBoost, ADVANCED_RENDER_DEFAULT.fillBoost)))
    out.advancedRender.rimBoost = Math.max(0, Math.min(3, asNumber(adv.rimBoost, ADVANCED_RENDER_DEFAULT.rimBoost)))
    out.advancedRender.bounceBoost = Math.max(0, Math.min(3, asNumber(adv.bounceBoost, ADVANCED_RENDER_DEFAULT.bounceBoost)))
    out.transparentBackground = base.transparentBackground !== false
    out.environmentPreset = (typeof base.environmentPreset === 'string' && ENVIRONMENT_PRESETS[base.environmentPreset])
      ? base.environmentPreset
      : 'duskCinema'
    out.qualityPreset = (typeof base.qualityPreset === 'string' && QUALITY_PRESETS[base.qualityPreset])
      ? base.qualityPreset
      : 'high'
    out.weatherPreset = (typeof base.weatherPreset === 'string' && WEATHER_PRESETS[base.weatherPreset])
      ? base.weatherPreset
      : 'clear'
    out.weather = {
      windIntensity: Math.max(0, Math.min(3, asNumber(base?.weather?.windIntensity, DEFAULT_LAYOUT.weather.windIntensity))),
      audioEnabled: base?.weather?.audioEnabled !== false,
      audioVolume: Math.max(0, Math.min(1, asNumber(base?.weather?.audioVolume, DEFAULT_LAYOUT.weather.audioVolume)))
    }
    out.maxFps = Math.max(10, Math.min(240, Math.round(asNumber(base.maxFps, 60))))
    out.droneMode = !!base.droneMode
    out.fogEnabled = base.fogEnabled !== false
    out.fogStrength = Math.max(0, Math.min(3, asNumber(base.fogStrength, 1)))
    out.shadowStrength = Math.max(0, Math.min(1, asNumber(base.shadowStrength, 0.45)))
    out.entranceEffect = (base.entranceEffect === 'none'
      || base.entranceEffect === 'flameDissolve'
      || base.entranceEffect === 'cardStorm'
      || base.entranceEffect === 'spotlightRush'
      || base.entranceEffect === 'prismBloom'
      || base.entranceEffect === 'mistReveal')
      ? base.entranceEffect
      : 'fade'
    out.entranceParticle = {
      path: (typeof base?.entranceParticle?.path === 'string') ? base.entranceParticle.path : ''
    }
    out.stylizedRender = {
      toonEnabled: !!base?.stylizedRender?.toonEnabled,
      toonSteps: Math.max(2, Math.min(5, Math.round(asNumber(base?.stylizedRender?.toonSteps, 3)))),
      outlineEnabled: base?.stylizedRender?.outlineEnabled !== false,
      outlineThickness: Math.max(0.0005, Math.min(0.03, asNumber(base?.stylizedRender?.outlineThickness, 0.004))),
      outlineColor: (typeof base?.stylizedRender?.outlineColor === 'string' && base.stylizedRender.outlineColor) ? base.stylizedRender.outlineColor : '#000000',
      outlineAlpha: Math.max(0, Math.min(1, asNumber(base?.stylizedRender?.outlineAlpha, 1)))
    }
    out.survivorScale = Math.max(0.001, asNumber(base?.survivorScale, 1))
    out.hunterScale = Math.max(0.001, asNumber(base?.hunterScale, out.slots.hunter.scale.x))
    out.roleScaleOverrides = normalizeRoleScaleOverrides(base?.roleScaleOverrides)
    out.videoScreen.path = typeof base?.videoScreen?.path === 'string' ? base.videoScreen.path : ''
    out.videoScreen.loop = base?.videoScreen?.loop !== false
    out.videoScreen.muted = base?.videoScreen?.muted !== false
    out.videoScreen.width = Math.max(0.1, asNumber(base?.videoScreen?.width, out.videoScreen.width))
    out.videoScreen.height = Math.max(0.1, asNumber(base?.videoScreen?.height, out.videoScreen.height))
    out.cameraScreen.enabled = !!base?.cameraScreen?.enabled
    out.cameraScreen.deviceId = typeof base?.cameraScreen?.deviceId === 'string' ? base.cameraScreen.deviceId : ''
    out.cameraScreen.muted = base?.cameraScreen?.muted !== false
    out.cameraScreen.mirrored = base?.cameraScreen?.mirrored !== false
    out.cameraScreen.width = Math.max(0.1, asNumber(base?.cameraScreen?.width, out.cameraScreen.width))
    out.cameraScreen.height = Math.max(0.1, asNumber(base?.cameraScreen?.height, out.cameraScreen.height))
    out.customModelPath = typeof base?.customModelPath === 'string' ? base.customModelPath : ''
    out.scene.modelPath = typeof base?.scene?.modelPath === 'string' ? base.scene.modelPath : ''
    out.scene.position = ensureVec3(base?.scene?.position, out.scene.position)
    out.scene.rotation = ensureVec3(base?.scene?.rotation, out.scene.rotation)
    out.scene.scale = ensureVec3(base?.scene?.scale, out.scene.scale)
    for (const cfg of SLOT_CONFIGS) {
      if (cfg.key === 'scene') continue
      const fallback = out.slots[cfg.key]
      const rawScale = ensureVec3(base?.slots?.[cfg.key]?.scale, fallback.scale)
      const uniform = Math.max(0.001, asNumber(rawScale.x, asNumber(rawScale.y, asNumber(rawScale.z, 1))))
      out.slots[cfg.key] = {
        position: ensureVec3(base?.slots?.[cfg.key]?.position, fallback.position),
        rotation: ensureVec3(base?.slots?.[cfg.key]?.rotation, fallback.rotation),
        scale: { x: uniform, y: uniform, z: uniform }
      }
    }
    for (let i = 1; i <= 4; i++) {
      const key = `survivor${i}`
      out.slots[key].scale = { x: out.survivorScale, y: out.survivorScale, z: out.survivorScale }
    }
    out.slots.hunter.scale = { x: out.hunterScale, y: out.hunterScale, z: out.hunterScale }
    out.lights = deepClone(DEFAULT_LAYOUT.lights)
    out.lights.light1.color = typeof base?.lights?.light1?.color === 'string' ? base.lights.light1.color : out.lights.light1.color
    out.lights.light1.intensity = Math.max(0, asNumber(base?.lights?.light1?.intensity, out.lights.light1.intensity))
    out.lights.light1.distance = Math.max(0, asNumber(base?.lights?.light1?.distance, out.lights.light1.distance))
    out.lights.light1.decay = Math.max(0, asNumber(base?.lights?.light1?.decay, out.lights.light1.decay))
    out.camera.position = ensureVec3(base?.camera?.position, out.camera.position)
    out.camera.target = ensureVec3(base?.camera?.target, out.camera.target)
    out.camera.fov = clampCameraFov(base?.camera?.fov, out.camera.fov)
    out.cameraTransitionMs = Math.max(50, Math.min(10000, asNumber(base?.cameraTransitionMs, out.cameraTransitionMs)))
    out.cameraEasing = normalizeCameraEasing(base?.cameraEasing)
    out.cameraKeyframes = deepClone(DEFAULT_LAYOUT.cameraKeyframes)
    for (const eventCfg of CAMERA_EVENT_OPTIONS) {
      out.cameraKeyframes[eventCfg.key] = normalizeCameraKeyframe(base?.cameraKeyframes?.[eventCfg.key], null)
    }
    return out
  }

  function toRadians(deg) {
    return (asNumber(deg, 0) * Math.PI) / 180
  }

  function toDegrees(rad) {
    return (asNumber(rad, 0) * 180) / Math.PI
  }

  function normalizeFileUrl(value) {
    if (!value) return ''
    const src = String(value)
    if (/^(https?:|file:|data:)/i.test(src)) return src
    if (src.startsWith('/official-models/')) return `file://${encodeURI(src)}`
    if (/^[a-zA-Z]:[\\/]/.test(src)) {
      const normalized = src.replace(/\\/g, '/')
      return `file:///${encodeURI(normalized)}`
    }
    if (src.startsWith('\\\\')) {
      return `file:${encodeURI(src.replace(/\\/g, '/'))}`
    }
    return src
  }

  function toLocalFilePath(value) {
    const src = String(value || '').trim()
    if (!src) return ''
    if (/^[a-zA-Z]:[\\/]/.test(src) || src.startsWith('\\\\')) return src
    if (!/^file:/i.test(src)) return ''
    try {
      const u = new URL(src)
      if (u.protocol !== 'file:') return ''
      let out = decodeURIComponent(u.pathname || '')
      if (/^\/[a-zA-Z]:/.test(out)) out = out.slice(1)
      out = out.replace(/\//g, '\\')
      if (u.host) {
        const p = out.startsWith('\\') ? out : `\\${out}`
        return `\\\\${u.host}${p}`
      }
      return out
    } catch {
      return ''
    }
  }

  function base64ToArrayBuffer(base64Value) {
    const cleaned = String(base64Value || '').replace(/^data:[^,]*,/, '')
    const binary = atob(cleaned)
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
    return bytes.buffer
  }

  async function tryLoadGltfViaIpc(modelPath, onLoaded, onError) {
    if (!window.electronAPI || typeof window.electronAPI.readBinaryFile !== 'function') return false
    const localPath = toLocalFilePath(modelPath) || (/^[a-zA-Z]:[\\/]/.test(String(modelPath || '')) || String(modelPath || '').startsWith('\\\\') ? String(modelPath || '') : '')
    if (!localPath) return false
    try {
      const readRes = await window.electronAPI.readBinaryFile(localPath)
      if (!readRes || !readRes.success || !readRes.base64) {
        onError(new Error(readRes?.error || 'read-binary-file-failed'))
        return true
      }
      const arrayBuffer = base64ToArrayBuffer(readRes.base64)
      const basePath = String(readRes.basePathUrl || '')
      gltfLoader.parse(arrayBuffer, basePath, (gltf) => {
        const obj = gltf && gltf.scene ? gltf.scene : null
        onLoaded(obj, (gltf && Array.isArray(gltf.animations)) ? gltf.animations : [])
      }, onError)
      return true
    } catch (error) {
      onError(error)
      return true
    }
  }

  async function loadScript(src) {
    return new Promise((resolve) => {
      const s = document.createElement('script')
      s.src = src
      s.async = false
      s.onload = () => resolve(true)
      s.onerror = () => resolve(false)
      document.head.appendChild(s)
    })
  }

  async function ensureThreeRuntime() {
    if (window.THREE && window.THREE.GLTFLoader && window.THREE.OBJLoader && window.THREE.MTLLoader && window.THREE.OutlineEffect) {
      THREE = window.THREE
      return true
    }
    const coreOk = await loadScript('./js/three/three.min.js')
    if (!coreOk) return false
    const gltfOk = await loadScript('./js/three/GLTFLoader.js')
    if (!gltfOk) return false
    const objOk = await loadScript('./js/three/OBJLoader.js')
    if (!objOk) return false
    const mtlOk = await loadScript('./js/three/MTLLoader.js')
    if (!mtlOk) return false
    const outlineOk = await loadScript('./js/three/OutlineEffect.js')
    if (!outlineOk) return false
    THREE = window.THREE
    return !!(THREE && THREE.GLTFLoader && THREE.OBJLoader && THREE.MTLLoader && THREE.OutlineEffect)
  }

  function buildRendererRuntime() {
    if (!THREE || !camera || !dom.renderRoot) return
    const width = dom.renderRoot.clientWidth || window.innerWidth || 1920
    const height = dom.renderRoot.clientHeight || window.innerHeight || 1080
    const antialiasEnabled = state.layout?.advancedRender?.antialiasEnabled !== false
    const nextRenderer = new THREE.WebGLRenderer({
      antialias: antialiasEnabled,
      alpha: true,
      powerPreference: 'high-performance'
    })
    nextRenderer.outputEncoding = THREE.sRGBEncoding
    nextRenderer.toneMapping = THREE.ACESFilmicToneMapping
    nextRenderer.toneMappingExposure = 1.02
    nextRenderer.physicallyCorrectLights = true
    nextRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    nextRenderer.setSize(width, height)
    nextRenderer.shadowMap.enabled = false

    const prevRenderer = renderer
    renderer = nextRenderer
    rendererAntialiasEnabled = antialiasEnabled
    outlineEffect = new THREE.OutlineEffect(renderer, {
      defaultThickness: 0.004,
      defaultColor: [0, 0, 0],
      defaultAlpha: 1
    })
    dom.renderRoot.innerHTML = ''
    dom.renderRoot.appendChild(renderer.domElement)
    if (prevRenderer && typeof prevRenderer.dispose === 'function') {
      try { prevRenderer.dispose() } catch { }
    }
  }

  function createSceneGraph() {
    scene = new THREE.Scene()
    const initW = dom.renderRoot.clientWidth || window.innerWidth || 1920
    const initH = dom.renderRoot.clientHeight || window.innerHeight || 1080
    camera = new THREE.PerspectiveCamera(45, initW / Math.max(1, initH), 0.1, 5000)
    buildRendererRuntime()
    camera.updateProjectionMatrix()

    sceneLights.ambient = new THREE.AmbientLight(0xffffff, 0.46)
    scene.add(sceneLights.ambient)

    sceneLights.hemi = new THREE.HemisphereLight(0xffc38a, 0x201020, 0.2)
    scene.add(sceneLights.hemi)

    sceneLights.key = new THREE.DirectionalLight(0xffffff, 1.35)
    sceneLights.key.position.set(6, 14, 10)
    sceneLights.key.castShadow = false
    sceneLights.key.shadow.mapSize.set(3072, 3072)
    sceneLights.key.shadow.camera.near = 0.5
    sceneLights.key.shadow.camera.far = 160
    sceneLights.key.shadow.camera.left = -12
    sceneLights.key.shadow.camera.right = 12
    sceneLights.key.shadow.camera.top = 12
    sceneLights.key.shadow.camera.bottom = -12
    sceneLights.key.shadow.radius = 1.2
    sceneLights.key.shadow.bias = -0.00012
    sceneLights.key.shadow.normalBias = 0.01
    scene.add(sceneLights.key.target)
    scene.add(sceneLights.key)

    sceneLights.fill = new THREE.DirectionalLight(0x9fc5ff, 0.3)
    sceneLights.fill.position.set(-10, 8, -6)
    scene.add(sceneLights.fill)

    sceneLights.rim = new THREE.DirectionalLight(0xffb36a, 0.18)
    sceneLights.rim.position.set(-6, 6, 8)
    scene.add(sceneLights.rim)

    sceneLights.bounce = new THREE.DirectionalLight(0x6f8fff, 0.12)
    sceneLights.bounce.position.set(4, 1.5, -4)
    scene.add(sceneLights.bounce)

    grid = new THREE.GridHelper(24, 24, 0x4caf50, 0x2d3552)
    grid.position.y = 0
    scene.add(grid)

    axes = new THREE.AxesHelper(2.2)
    scene.add(axes)

    root = new THREE.Group()
    scene.add(root)

    weatherRuntime.group = new THREE.Group()
    weatherRuntime.group.name = 'weather'
    scene.add(weatherRuntime.group)

    // 阴影接收地面：无场景地面时也能看到角色落影
    shadowGround = new THREE.Mesh(
      new THREE.PlaneGeometry(280, 280),
      new THREE.ShadowMaterial({ opacity: 0.24 })
    )
    shadowGround.rotation.x = -Math.PI / 2
    shadowGround.position.y = 0
    shadowGround.receiveShadow = false
    shadowGround.visible = false
    scene.add(shadowGround)

    // 天空穹顶：通过渐变营造天空氛围
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTopColor: { value: new THREE.Color('#ff9e5e') },
        uBottomColor: { value: new THREE.Color('#2a1630') },
        uOffset: { value: 42.0 },
        uExponent: { value: 0.72 }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform float uOffset;
        uniform float uExponent;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos + vec3(0.0, uOffset, 0.0)).y;
          float t = pow(max(h, 0.0), uExponent);
          vec3 col = mix(uBottomColor, uTopColor, t);
          gl_FragColor = vec4(col, 1.0);
        }
      `
    })
    skyDome = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 18), skyMat)
    scene.add(skyDome)

    for (const cfg of SLOT_CONFIGS) {
      const group = new THREE.Group()
      group.name = cfg.key
      root.add(group)
      slotRuntime.set(cfg.key, {
        key: cfg.key,
        cfg,
        group,
        model: null,
        blobShadow: null,
        modelPath: '',
        loadingPath: '',
        loadSeq: 0,
        videoElement: null,
        videoTexture: null
      })
      if (cfg.roleType === 'light') {
        attachLightRig(cfg.key, group)
      }
    }

    gltfLoader = new THREE.GLTFLoader()
    objLoader = new THREE.OBJLoader()
    mtlLoader = new THREE.MTLLoader()
    clock = new THREE.Clock()
    applyRenderQualityPreset(state.layout?.qualityPreset || 'high', false)
  }

  function updateKeyLightShadowFrustum() {
    if (!sceneLights.key || !sceneLights.key.shadow || !sceneLights.key.shadow.camera) return
    const keys = ['survivor1', 'survivor2', 'survivor3', 'survivor4', 'hunter']
    let minX = Infinity
    let maxX = -Infinity
    let minZ = Infinity
    let maxZ = -Infinity
    let found = false
    for (const key of keys) {
      const runtime = slotRuntime.get(key)
      if (!runtime || !runtime.group || !runtime.model || !runtime.model.parent) continue
      const p = runtime.group.position
      if (!Number.isFinite(p.x) || !Number.isFinite(p.z)) continue
      found = true
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
      if (p.z < minZ) minZ = p.z
      if (p.z > maxZ) maxZ = p.z
    }
    if (!found) {
      minX = -4
      maxX = 4
      minZ = -4
      maxZ = 4
    }
    const cx = (minX + maxX) * 0.5
    const cz = (minZ + maxZ) * 0.5
    const spanX = Math.max(4, maxX - minX)
    const spanZ = Math.max(4, maxZ - minZ)
    const half = Math.max(6, Math.min(20, Math.max(spanX, spanZ) * 0.8 + 3))

    sceneLights.key.target.position.set(cx, 0.5, cz)
    sceneLights.key.target.updateMatrixWorld()
    const cam = sceneLights.key.shadow.camera
    cam.left = -half
    cam.right = half
    cam.top = half
    cam.bottom = -half
    cam.updateProjectionMatrix()
  }

  function getPathExt(pathValue) {
    try {
      const clean = String(pathValue || '').split('?')[0].split('#')[0]
      const m = clean.match(/\.([a-zA-Z0-9]+)$/)
      return m ? `.${m[1].toLowerCase()}` : ''
    } catch {
      return ''
    }
  }

  function isVideoExt(ext) {
    return ext === '.mp4' || ext === '.webm' || ext === '.ogg' || ext === '.mov' || ext === '.m4v'
  }

  function replacePathExt(pathValue, newExtWithDot) {
    const src = String(pathValue || '')
    const qIndex = src.indexOf('?')
    const hIndex = src.indexOf('#')
    const cut = [qIndex, hIndex].filter(i => i >= 0).reduce((a, b) => Math.min(a, b), src.length)
    const base = src.slice(0, cut)
    const tail = src.slice(cut)
    return base.replace(/\.[^.\\/]+$/, newExtWithDot) + tail
  }

  function loadObjModelWithOptionalMtl(objUrl, onSuccess, onError) {
    const tryPlainObj = () => {
      objLoader.load(objUrl, (obj) => onSuccess(obj), undefined, (err) => onError(err))
    }
    const mtlUrl = replacePathExt(objUrl, '.mtl')
    mtlLoader.load(mtlUrl, (materials) => {
      try {
        if (materials && typeof materials.preload === 'function') materials.preload()
      } catch { }
      objLoader.setMaterials(materials || null)
      objLoader.load(objUrl, (obj) => onSuccess(obj), undefined, () => {
        objLoader.setMaterials(null)
        tryPlainObj()
      })
    }, undefined, () => {
      objLoader.setMaterials(null)
      tryPlainObj()
    })
  }

  function attachLightRig(key, group) {
    const light = new THREE.PointLight(0xfff1d6, 2.4, 0, 2)
    light.castShadow = false
    group.add(light)

    const bulbGeo = new THREE.SphereGeometry(0.12, 20, 16)
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff1d6 })
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat)
    group.add(bulbMesh)

    const haloGeo = new THREE.SphereGeometry(0.22, 18, 14)
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xfff1d6, transparent: true, opacity: 0.28 })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    group.add(haloMesh)

    lightRigs.set(key, { light, bulbMesh, haloMesh })
    applyLightSettings(key)
  }

  function applyLightSettings(key = 'light1') {
    const rig = lightRigs.get(key)
    if (!rig || !state.layout?.lights?.[key]) return
    const cfg = state.layout.lights[key]
    const intensity = Math.max(0, asNumber(cfg.intensity, 2.4))
    // physicallyCorrectLights 开启后，PointLight 需要更高量级，保持旧 UI 手感
    const intensityScale = (renderer && renderer.physicallyCorrectLights) ? 180 : 1
    const color = (typeof cfg.color === 'string' && cfg.color) ? cfg.color : '#fff1d6'
    const distance = Math.max(0, asNumber(cfg.distance, 0))
    const decay = Math.max(0, asNumber(cfg.decay, 2))

    rig.light.color.set(color)
    rig.light.intensity = intensity * intensityScale
    rig.light.distance = distance
    rig.light.decay = decay
    rig.bulbMesh.material.color.set(color)
    rig.haloMesh.material.color.set(color)
    rig.haloMesh.material.opacity = Math.min(0.45, 0.1 + intensity * 0.08)
  }

  function syncLightInputs() {
    const cfg = state.layout?.lights?.light1
    if (!cfg) return
    if (dom.lightColor) dom.lightColor.value = cfg.color || '#fff1d6'
    if (dom.lightIntensity) dom.lightIntensity.value = String(asNumber(cfg.intensity, 2.4))
  }

  function applyRenderQualityPreset(qualityKey, shouldSave = true) {
    const key = (typeof qualityKey === 'string' && QUALITY_PRESETS[qualityKey]) ? qualityKey : 'high'
    const q = QUALITY_PRESETS[key]
    state.layout.qualityPreset = key

    if (sceneLights.rim) sceneLights.rim.userData.__asgBaseIntensity = q.rim
    if (sceneLights.bounce) sceneLights.bounce.userData.__asgBaseIntensity = q.bounce
    if (dom.cinemaOverlay) dom.cinemaOverlay.style.opacity = String(q.cinemaOverlay)

    if (dom.renderQualitySelect) dom.renderQualitySelect.value = key
    applyAdvancedRenderSettings(false)
    if (shouldSave) scheduleSaveLayout()
  }

  function syncAdvancedRenderInputs() {
    const adv = state.layout?.advancedRender || ADVANCED_RENDER_DEFAULT
    if (dom.advAntialiasEnabled) dom.advAntialiasEnabled.checked = adv.antialiasEnabled !== false
    if (dom.advLightTextureEnabled) dom.advLightTextureEnabled.checked = adv.lightTextureEnabled !== false
    if (dom.advExposure) dom.advExposure.value = String(adv.exposure.toFixed(2))
    if (dom.advContrast) dom.advContrast.value = String(adv.contrast.toFixed(2))
    if (dom.advSaturation) dom.advSaturation.value = String(adv.saturation.toFixed(2))
    if (dom.advRenderScale) dom.advRenderScale.value = String(Math.max(0.7, Math.min(2, asNumber(adv.renderScale, 1))))
    if (dom.advShadowMapBoost) dom.advShadowMapBoost.value = String(adv.shadowMapBoost.toFixed(2))
    if (dom.advShadowRadius) dom.advShadowRadius.value = String(adv.shadowRadiusBoost.toFixed(2))
    if (dom.advShadowBias) dom.advShadowBias.value = String(adv.shadowBias.toFixed(5))
    if (dom.advShadowNormalBias) dom.advShadowNormalBias.value = String(adv.shadowNormalBias.toFixed(3))
    if (dom.advAmbientBoost) dom.advAmbientBoost.value = String(adv.ambientBoost.toFixed(2))
    if (dom.advHemiBoost) dom.advHemiBoost.value = String(adv.hemiBoost.toFixed(2))
    if (dom.advKeyBoost) dom.advKeyBoost.value = String(adv.keyBoost.toFixed(2))
    if (dom.advFillBoost) dom.advFillBoost.value = String(adv.fillBoost.toFixed(2))
    if (dom.advRimBoost) dom.advRimBoost.value = String(adv.rimBoost.toFixed(2))
    if (dom.advBounceBoost) dom.advBounceBoost.value = String(adv.bounceBoost.toFixed(2))
  }

  function readAdvancedRenderFromInputs() {
    if (!state.layout.advancedRender) state.layout.advancedRender = deepClone(ADVANCED_RENDER_DEFAULT)
    const adv = state.layout.advancedRender
    adv.antialiasEnabled = dom.advAntialiasEnabled ? !!dom.advAntialiasEnabled.checked : true
    adv.lightTextureEnabled = dom.advLightTextureEnabled ? !!dom.advLightTextureEnabled.checked : true
    adv.exposure = Math.max(0.6, Math.min(2.2, asNumber(dom.advExposure?.value, adv.exposure)))
    adv.contrast = Math.max(0.8, Math.min(1.6, asNumber(dom.advContrast?.value, adv.contrast)))
    adv.saturation = Math.max(0.7, Math.min(1.8, asNumber(dom.advSaturation?.value, adv.saturation)))
    adv.renderScale = Math.max(0.7, Math.min(2, asNumber(dom.advRenderScale?.value, adv.renderScale)))
    adv.shadowMapBoost = Math.max(0.5, Math.min(2, asNumber(dom.advShadowMapBoost?.value, adv.shadowMapBoost)))
    adv.shadowRadiusBoost = Math.max(0.5, Math.min(2.5, asNumber(dom.advShadowRadius?.value, adv.shadowRadiusBoost)))
    adv.shadowBias = Math.max(-0.001, Math.min(0.001, asNumber(dom.advShadowBias?.value, adv.shadowBias)))
    adv.shadowNormalBias = Math.max(0, Math.min(0.1, asNumber(dom.advShadowNormalBias?.value, adv.shadowNormalBias)))
    adv.ambientBoost = Math.max(0, Math.min(3, asNumber(dom.advAmbientBoost?.value, adv.ambientBoost)))
    adv.hemiBoost = Math.max(0, Math.min(3, asNumber(dom.advHemiBoost?.value, adv.hemiBoost)))
    adv.keyBoost = Math.max(0, Math.min(3, asNumber(dom.advKeyBoost?.value, adv.keyBoost)))
    adv.fillBoost = Math.max(0, Math.min(3, asNumber(dom.advFillBoost?.value, adv.fillBoost)))
    adv.rimBoost = Math.max(0, Math.min(3, asNumber(dom.advRimBoost?.value, adv.rimBoost)))
    adv.bounceBoost = Math.max(0, Math.min(3, asNumber(dom.advBounceBoost?.value, adv.bounceBoost)))
  }

  function applyAdvancedRenderSettings(shouldSave = true, syncFromInputs = true) {
    if (syncFromInputs) readAdvancedRenderFromInputs()
    const adv = state.layout.advancedRender
    const q = QUALITY_PRESETS[state.layout.qualityPreset || 'high'] || QUALITY_PRESETS.high
    const useStylizedLightTexture = adv.lightTextureEnabled !== false

    if (!renderer || rendererAntialiasEnabled !== (adv.antialiasEnabled !== false)) {
      buildRendererRuntime()
    }
    if (renderer) {
      const scaledRatio = Math.min((window.devicePixelRatio || 1) * adv.renderScale, q.pixelRatio * adv.renderScale)
      renderer.setPixelRatio(Math.max(0.7, Math.min(3, scaledRatio)))
      const w = dom.renderRoot?.clientWidth || window.innerWidth || 1920
      const h = dom.renderRoot?.clientHeight || window.innerHeight || 1080
      renderer.setSize(w, h)
      renderer.toneMappingExposure = q.exposure * adv.exposure
      renderer.shadowMap.enabled = false
    }
    if (sceneLights.key) {
      const mapSize = Math.max(1024, Math.min(8192, Math.round(q.shadowMap * adv.shadowMapBoost)))
      sceneLights.key.shadow.mapSize.set(mapSize, mapSize)
      sceneLights.key.shadow.radius = Math.max(0.1, q.shadowRadius * adv.shadowRadiusBoost)
      sceneLights.key.shadow.bias = adv.shadowBias
      sceneLights.key.shadow.normalBias = adv.shadowNormalBias
      sceneLights.key.castShadow = false
      sceneLights.key.shadow.needsUpdate = true
    }
    if (sceneLights.ambient) {
      const base = asNumber(sceneLights.ambient.userData?.__asgBaseIntensity, sceneLights.ambient.intensity)
      sceneLights.ambient.intensity = Math.max(0, base * adv.ambientBoost)
    }
    if (sceneLights.hemi) {
      const base = asNumber(sceneLights.hemi.userData?.__asgBaseIntensity, sceneLights.hemi.intensity)
      sceneLights.hemi.intensity = Math.max(0, base * adv.hemiBoost)
    }
    if (sceneLights.key) {
      const base = asNumber(sceneLights.key.userData?.__asgBaseIntensity, sceneLights.key.intensity)
      sceneLights.key.intensity = Math.max(0, base * adv.keyBoost)
    }
    if (sceneLights.fill) {
      const base = asNumber(sceneLights.fill.userData?.__asgBaseIntensity, sceneLights.fill.intensity)
      sceneLights.fill.intensity = Math.max(0, base * adv.fillBoost)
    }
    if (sceneLights.rim) {
      const base = asNumber(sceneLights.rim.userData?.__asgBaseIntensity, sceneLights.rim.intensity)
      sceneLights.rim.intensity = useStylizedLightTexture ? Math.max(0, base * adv.rimBoost) : 0
    }
    if (sceneLights.bounce) {
      const base = asNumber(sceneLights.bounce.userData?.__asgBaseIntensity, sceneLights.bounce.intensity)
      sceneLights.bounce.intensity = useStylizedLightTexture ? Math.max(0, base * adv.bounceBoost) : 0
    }
    if (dom.cinemaOverlay) {
      dom.cinemaOverlay.style.opacity = useStylizedLightTexture
        ? String(q.cinemaOverlay)
        : '0'
    }
    if (dom.renderRoot) {
      if (useStylizedLightTexture) {
        const contrast = Math.max(0.8, Math.min(1.8, q.contrast * adv.contrast))
        const saturationBase = state.layout.qualityPreset === 'cinematic' ? 1.06 : 1
        const saturation = Math.max(0.6, Math.min(2.5, saturationBase * adv.saturation))
        dom.renderRoot.style.filter = `contrast(${contrast}) saturate(${saturation})`
      } else {
        dom.renderRoot.style.filter = 'none'
      }
    }

    syncAdvancedRenderInputs()
    applyStylizedRenderSettings(false)
    if (shouldSave) scheduleSaveLayout()
  }

  function getWeatherPresetConfig(presetKey = state.layout?.weatherPreset) {
    const key = (typeof presetKey === 'string' && WEATHER_PRESETS[presetKey]) ? presetKey : 'clear'
    return WEATHER_PRESETS[key]
  }

  function getWeatherSettings() {
    const src = (state.layout?.weather && typeof state.layout.weather === 'object') ? state.layout.weather : {}
    return {
      windIntensity: Math.max(0, Math.min(3, asNumber(src.windIntensity, DEFAULT_LAYOUT.weather.windIntensity))),
      audioEnabled: src.audioEnabled !== false,
      audioVolume: Math.max(0, Math.min(1, asNumber(src.audioVolume, DEFAULT_LAYOUT.weather.audioVolume)))
    }
  }

  function ensureWeatherSettings() {
    const normalized = getWeatherSettings()
    state.layout.weather = {
      windIntensity: normalized.windIntensity,
      audioEnabled: normalized.audioEnabled,
      audioVolume: normalized.audioVolume
    }
    return state.layout.weather
  }

  function getWeatherEffectiveConfig(presetKey = state.layout?.weatherPreset) {
    const base = getWeatherPresetConfig(presetKey)
    const settings = getWeatherSettings()
    const windFactor = Math.max(0, settings.windIntensity)
    return {
      ...base,
      windIntensity: windFactor,
      overlayOpacity: base.overlayOpacity,
      windOverlayOpacity: base.wind ? Math.min(0.6, base.windOverlayOpacity * (0.6 + windFactor * 0.52)) : 0,
      swayAmplitude: base.swayAmplitude * (0.55 + windFactor * 0.8),
      swayPitch: base.swayPitch * (0.55 + windFactor * 0.8),
      swayYaw: base.swayYaw * (0.55 + windFactor * 0.8),
      windScrollSpeed: base.windScrollSpeed * (0.5 + windFactor * 0.7),
      windParticleCount: Math.round(base.windParticleCount * (0.45 + windFactor * 0.78)),
      windParticleSpeed: base.windParticleSpeed * (0.5 + windFactor * 0.75),
      rainDriftX: base.rainDriftX * (base.wind ? (0.72 + windFactor * 0.62) : 1),
      rainDriftZ: base.rainDriftZ * (base.wind ? (0.72 + windFactor * 0.62) : 1)
    }
  }

  function syncWeatherInputs() {
    const config = getWeatherPresetConfig(state.layout?.weatherPreset)
    const settings = ensureWeatherSettings()
    if (dom.weatherPresetSelect) dom.weatherPresetSelect.value = state.layout?.weatherPreset || 'clear'
    if (dom.weatherWindIntensity) dom.weatherWindIntensity.value = String(settings.windIntensity.toFixed(2))
    if (dom.weatherAudioEnabled) dom.weatherAudioEnabled.checked = settings.audioEnabled !== false
    if (dom.weatherAudioVolume) dom.weatherAudioVolume.value = String(settings.audioVolume.toFixed(2))
    if (dom.weatherPresetInfo) dom.weatherPresetInfo.textContent = `天气: ${config.label}`
  }

  function applyWeatherSettingsFromInputs(shouldSave = true) {
    const next = ensureWeatherSettings()
    next.windIntensity = Math.max(0, Math.min(3, asNumber(dom.weatherWindIntensity?.value, next.windIntensity)))
    next.audioEnabled = dom.weatherAudioEnabled ? !!dom.weatherAudioEnabled.checked : next.audioEnabled !== false
    next.audioVolume = Math.max(0, Math.min(1, asNumber(dom.weatherAudioVolume?.value, next.audioVolume)))
    syncWeatherInputs()
    applyWeatherPreset(state.layout?.weatherPreset || 'clear', false)
    if (shouldSave) scheduleSaveLayout()
  }

  function createWeatherNoiseBuffer(ctx, mode = 'wind') {
    const duration = 2.4
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate)
    const channel = buffer.getChannelData(0)
    if (mode === 'rain') {
      let previous = 0
      for (let i = 0; i < channel.length; i++) {
        const white = Math.random() * 2 - 1
        const bright = previous * 0.18 + white * 0.82
        previous = bright
        channel[i] = Math.max(-1, Math.min(1, bright * 0.75))
      }
      return buffer
    }

    let brown = 0
    for (let i = 0; i < channel.length; i++) {
      const white = Math.random() * 2 - 1
      brown = (brown + white * 0.14) / 1.02
      const pinkish = brown * 0.82 + white * 0.12
      channel[i] = Math.max(-1, Math.min(1, pinkish))
    }
    return buffer
  }

  function ensureWeatherAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    if (weatherAudio.context) return weatherAudio.context
    try {
      const ctx = new AudioCtx()
      const masterGain = ctx.createGain()
      const windGain = ctx.createGain()
      const rainGain = ctx.createGain()
      masterGain.gain.value = 0
      windGain.gain.value = 0
      rainGain.gain.value = 0
      windGain.connect(masterGain)
      rainGain.connect(masterGain)
      masterGain.connect(ctx.destination)

      weatherAudio.context = ctx
      weatherAudio.masterGain = masterGain
      weatherAudio.windGain = windGain
      weatherAudio.rainGain = rainGain
      weatherAudio.noiseBuffer = createWeatherNoiseBuffer(ctx, 'wind')
      weatherAudio.rainNoiseBuffer = createWeatherNoiseBuffer(ctx, 'rain')
      return ctx
    } catch (error) {
      console.warn('[CharacterModel3D] 创建天气音效上下文失败:', error)
      return null
    }
  }

  function createLoopingWeatherNoise(kind) {
    const ctx = ensureWeatherAudioContext()
    if (!ctx || !weatherAudio.noiseBuffer) return null

    const source = ctx.createBufferSource()
    source.buffer = kind === 'rain' ? (weatherAudio.rainNoiseBuffer || weatherAudio.noiseBuffer) : weatherAudio.noiseBuffer
    source.loop = true

    if (kind === 'wind') {
      const highpass = ctx.createBiquadFilter()
      const lowpass = ctx.createBiquadFilter()
      const bodyGain = ctx.createGain()
      highpass.type = 'highpass'
      highpass.frequency.value = 42
      lowpass.type = 'lowpass'
      lowpass.frequency.value = 260
      lowpass.Q.value = 0.2
      bodyGain.gain.value = 0.82
      source.playbackRate.value = 0.48
      source.connect(highpass)
      highpass.connect(lowpass)
      lowpass.connect(bodyGain)
      bodyGain.connect(weatherAudio.windGain)
      weatherAudio.windHighpass = highpass
      weatherAudio.windLowpass = lowpass
      weatherAudio.windBodyGain = bodyGain
    } else {
      const highpass = ctx.createBiquadFilter()
      const lowpass = ctx.createBiquadFilter()
      highpass.type = 'highpass'
      highpass.frequency.value = 980
      lowpass.type = 'lowpass'
      lowpass.frequency.value = 5200
      lowpass.Q.value = 0.18
      source.playbackRate.value = 1.08
      source.connect(highpass)
      highpass.connect(lowpass)
      lowpass.connect(weatherAudio.rainGain)
      weatherAudio.rainHighpass = highpass
      weatherAudio.rainLowpass = lowpass
    }

    source.start()
    return source
  }

  function ensureWeatherAudioSources() {
    const ctx = ensureWeatherAudioContext()
    if (!ctx) return
    if (!weatherAudio.windSource) weatherAudio.windSource = createLoopingWeatherNoise('wind')
    if (!weatherAudio.rainSource) weatherAudio.rainSource = createLoopingWeatherNoise('rain')
  }

  function resumeWeatherAudio() {
    const ctx = ensureWeatherAudioContext()
    if (!ctx) return
    ensureWeatherAudioSources()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    weatherAudio.unlocked = true
  }

  function primeWeatherAudioUnlock() {
    if (weatherAudio.unlockBound) return
    const unlock = () => {
      resumeWeatherAudio()
      window.removeEventListener('pointerdown', unlock, true)
      window.removeEventListener('keydown', unlock, true)
      weatherAudio.unlockBound = false
    }
    weatherAudio.unlockBound = true
    window.addEventListener('pointerdown', unlock, true)
    window.addEventListener('keydown', unlock, true)
  }

  function updateWeatherAudioState(immediate = false) {
    const ctx = ensureWeatherAudioContext()
    if (!ctx || !weatherAudio.masterGain || !weatherAudio.windGain || !weatherAudio.rainGain) return

    const config = getWeatherEffectiveConfig(state.layout?.weatherPreset)
    const settings = ensureWeatherSettings()
    const enabled = settings.audioEnabled !== false && state.layout?.weatherPreset !== 'clear'
    const masterTarget = enabled ? settings.audioVolume : 0
    const windTarget = enabled && config.wind ? Math.min(0.2, 0.014 + settings.audioVolume * (0.042 + config.windIntensity * 0.03)) : 0
    const rainTarget = enabled && config.rain ? Math.min(0.38, 0.06 + settings.audioVolume * (config.wind ? 0.18 : 0.22)) : 0
    const now = ctx.currentTime
    const ramp = immediate ? 0.01 : 0.22

    ensureWeatherAudioSources()
    if (enabled) resumeWeatherAudio()
    else primeWeatherAudioUnlock()

    weatherAudio.masterGain.gain.cancelScheduledValues(now)
    weatherAudio.windGain.gain.cancelScheduledValues(now)
    weatherAudio.rainGain.gain.cancelScheduledValues(now)
    weatherAudio.masterGain.gain.linearRampToValueAtTime(masterTarget, now + ramp)
    weatherAudio.windGain.gain.linearRampToValueAtTime(windTarget, now + ramp)
    weatherAudio.rainGain.gain.linearRampToValueAtTime(rainTarget, now + ramp)

    const gust = 0.86 + Math.sin(weatherRuntime.time * 0.46) * 0.16 + Math.sin(weatherRuntime.time * 0.19 + 1.2) * 0.08
    if (weatherAudio.windLowpass) {
      weatherAudio.windLowpass.frequency.setTargetAtTime(
        enabled && config.wind ? (180 + config.windIntensity * 70 + gust * 35) : 220,
        now,
        immediate ? 0.01 : 0.28
      )
    }
    if (weatherAudio.windHighpass) {
      weatherAudio.windHighpass.frequency.setTargetAtTime(
        enabled && config.wind ? (34 + config.windIntensity * 8) : 42,
        now,
        immediate ? 0.01 : 0.32
      )
    }
    if (weatherAudio.windBodyGain) {
      weatherAudio.windBodyGain.gain.setTargetAtTime(
        enabled && config.wind ? (0.78 + gust * 0.12) : 0.8,
        now,
        immediate ? 0.01 : 0.25
      )
    }
    if (weatherAudio.rainHighpass) {
      weatherAudio.rainHighpass.frequency.setTargetAtTime(
        enabled && config.rain ? (860 + Math.min(180, config.windIntensity * 70)) : 980,
        now,
        immediate ? 0.01 : 0.24
      )
    }
    if (weatherAudio.rainLowpass) {
      weatherAudio.rainLowpass.frequency.setTargetAtTime(
        enabled && config.rain ? 4600 : 5200,
        now,
        immediate ? 0.01 : 0.24
      )
    }
  }

  function playWeatherThunderSound(intensity = 1) {
    const ctx = ensureWeatherAudioContext()
    const settings = ensureWeatherSettings()
    if (!ctx || !settings.audioEnabled || state.layout?.weatherPreset === 'clear') return
    ensureWeatherAudioSources()
    resumeWeatherAudio()

    const startAt = ctx.currentTime + 0.09 + Math.random() * 0.16
    const peak = Math.max(0.045, Math.min(0.22, settings.audioVolume * 0.28 * intensity))

    const sourceA = ctx.createBufferSource()
    const sourceB = ctx.createBufferSource()
    sourceA.buffer = weatherAudio.noiseBuffer
    sourceB.buffer = weatherAudio.noiseBuffer

    const lowpassA = ctx.createBiquadFilter()
    const lowpassB = ctx.createBiquadFilter()
    const gainA = ctx.createGain()
    const gainB = ctx.createGain()

    lowpassA.type = 'lowpass'
    lowpassA.frequency.value = 190
    lowpassB.type = 'lowpass'
    lowpassB.frequency.value = 110

    gainA.gain.value = 0.0001
    gainB.gain.value = 0.0001

    sourceA.playbackRate.value = 0.31 + Math.random() * 0.04
    sourceB.playbackRate.value = 0.18 + Math.random() * 0.03

    sourceA.connect(lowpassA)
    lowpassA.connect(gainA)
    gainA.connect(weatherAudio.masterGain)

    sourceB.connect(lowpassB)
    lowpassB.connect(gainB)
    gainB.connect(weatherAudio.masterGain)

    gainA.gain.setValueAtTime(0.0001, startAt)
    gainA.gain.exponentialRampToValueAtTime(peak, startAt + 0.07)
    gainA.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * 0.42), startAt + 0.75)
    gainA.gain.exponentialRampToValueAtTime(0.0001, startAt + 2.8)

    gainB.gain.setValueAtTime(0.0001, startAt + 0.18)
    gainB.gain.exponentialRampToValueAtTime(peak * 0.52, startAt + 0.34)
    gainB.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * 0.18), startAt + 1.6)
    gainB.gain.exponentialRampToValueAtTime(0.0001, startAt + 3.8)

    sourceA.start(startAt)
    sourceB.start(startAt + 0.08)
    sourceA.stop(startAt + 3.1)
    sourceB.stop(startAt + 4.0)
  }

  function disposeWeatherRain() {
    if (weatherRuntime.rain && weatherRuntime.group) {
      weatherRuntime.group.remove(weatherRuntime.rain)
    }
    if (weatherRuntime.rain?.geometry) {
      try { weatherRuntime.rain.geometry.dispose() } catch { }
    }
    if (weatherRuntime.rain?.material) {
      try { weatherRuntime.rain.material.dispose() } catch { }
    }
    weatherRuntime.rain = null
    weatherRuntime.rainCount = 0
    weatherRuntime.rainPositions = null
    weatherRuntime.rainSeed = null
  }

  function disposeWeatherWind() {
    if (weatherRuntime.windDust && weatherRuntime.group) {
      weatherRuntime.group.remove(weatherRuntime.windDust)
    }
    if (weatherRuntime.windDust?.geometry) {
      try { weatherRuntime.windDust.geometry.dispose() } catch { }
    }
    if (weatherRuntime.windDust?.material) {
      try { weatherRuntime.windDust.material.dispose() } catch { }
    }
    weatherRuntime.windDust = null
    weatherRuntime.windDustCount = 0
    weatherRuntime.windDustPositions = null
    weatherRuntime.windDustSeed = null
  }

  function writeWeatherRainSegment(positions, index, x, y, z, config) {
    const base = index * 6
    positions[base] = x
    positions[base + 1] = y
    positions[base + 2] = z
    positions[base + 3] = x - config.rainDriftX * config.rainLength
    positions[base + 4] = y - config.rainLength
    positions[base + 5] = z - config.rainDriftZ * config.rainLength
  }

  function rebuildWeatherRain(config) {
    if (!weatherRuntime.group || !THREE) return
    if (!config.rain || config.rainCount <= 0) {
      disposeWeatherRain()
      weatherRuntime.configKey = state.layout?.weatherPreset || 'clear'
      return
    }
    if (weatherRuntime.rain && weatherRuntime.rainCount === config.rainCount && weatherRuntime.configKey === (state.layout?.weatherPreset || 'clear')) {
      if (weatherRuntime.rain.material) {
        weatherRuntime.rain.material.opacity = config.wind ? 0.32 : 0.26
      }
      return
    }

    disposeWeatherRain()

    const count = Math.max(64, Math.min(2400, Math.round(asNumber(config.rainCount, 0))))
    const positions = new Float32Array(count * 6)
    const seed = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      const base = i * 4
      const x = (Math.random() - 0.5) * 28
      const y = 0.6 + Math.random() * 18
      const z = (Math.random() - 0.5) * 28
      seed[base] = x
      seed[base + 1] = y
      seed[base + 2] = z
      seed[base + 3] = 0.82 + Math.random() * 0.36
      writeWeatherRainSegment(positions, i, x, y, z, config)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.LineBasicMaterial({
      color: 0xbfdcff,
      transparent: true,
      opacity: config.wind ? 0.32 : 0.26,
      depthWrite: false
    })

    const rain = new THREE.LineSegments(geometry, material)
    rain.frustumCulled = false
    rain.renderOrder = 2
    weatherRuntime.group.add(rain)
    weatherRuntime.rain = rain
    weatherRuntime.rainCount = count
    weatherRuntime.rainPositions = positions
    weatherRuntime.rainSeed = seed
    weatherRuntime.configKey = state.layout?.weatherPreset || 'clear'
  }

  function rebuildWeatherWind(config) {
    if (!weatherRuntime.group || !THREE) return
    if (!config.wind || config.windParticleCount <= 0) {
      disposeWeatherWind()
      return
    }
    if (weatherRuntime.windDust && weatherRuntime.windDustCount === config.windParticleCount && weatherRuntime.configKey === (state.layout?.weatherPreset || 'clear')) {
      return
    }

    disposeWeatherWind()

    const count = Math.max(40, Math.min(800, Math.round(asNumber(config.windParticleCount, 0))))
    const positions = new Float32Array(count * 3)
    const seed = new Float32Array(count * 5)
    for (let i = 0; i < count; i++) {
      const p = i * 3
      const s = i * 5
      const x = (Math.random() - 0.5) * 28
      const y = 0.35 + Math.random() * 7.5
      const z = (Math.random() - 0.5) * 22
      positions[p] = x
      positions[p + 1] = y
      positions[p + 2] = z
      seed[s] = x
      seed[s + 1] = y
      seed[s + 2] = z
      seed[s + 3] = 0.8 + Math.random() * 0.7
      seed[s + 4] = Math.random() * Math.PI * 2
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xdfeaf3,
      size: config.windParticleSpeed > 7 ? 0.18 : 0.14,
      sizeAttenuation: true,
      transparent: true,
      opacity: config.windParticleSpeed > 7 ? 0.22 : 0.16,
      depthWrite: false
    })

    const windDust = new THREE.Points(geometry, material)
    windDust.frustumCulled = false
    windDust.renderOrder = 3
    weatherRuntime.group.add(windDust)
    weatherRuntime.windDust = windDust
    weatherRuntime.windDustCount = count
    weatherRuntime.windDustPositions = positions
    weatherRuntime.windDustSeed = seed
  }

  function applyWeatherLightingState(flashStrength = weatherRuntime.flashStrength) {
    const config = getWeatherEffectiveConfig(state.layout?.weatherPreset)
    const adv = state.layout?.advancedRender || ADVANCED_RENDER_DEFAULT
    const q = QUALITY_PRESETS[state.layout?.qualityPreset || 'high'] || QUALITY_PRESETS.high
    const flash = Math.max(0, Math.min(1, asNumber(flashStrength, 0)))
    const useStylizedLightTexture = adv.lightTextureEnabled !== false

    if (renderer) {
      renderer.toneMappingExposure = q.exposure * adv.exposure * config.exposureMultiplier * (1 + flash * 0.72)
    }
    if (sceneLights.ambient) {
      const base = asNumber(sceneLights.ambient.userData?.__asgBaseIntensity, sceneLights.ambient.intensity)
      sceneLights.ambient.intensity = Math.max(0, base * adv.ambientBoost * config.ambientMultiplier * (1 + flash * 0.34))
    }
    if (sceneLights.hemi) {
      const base = asNumber(sceneLights.hemi.userData?.__asgBaseIntensity, sceneLights.hemi.intensity)
      sceneLights.hemi.intensity = Math.max(0, base * adv.hemiBoost * config.hemiMultiplier * (1 + flash * 0.26))
    }
    if (sceneLights.key) {
      const base = asNumber(sceneLights.key.userData?.__asgBaseIntensity, sceneLights.key.intensity)
      sceneLights.key.intensity = Math.max(0, base * adv.keyBoost * config.keyMultiplier * (1 + flash * 0.84))
    }
    if (sceneLights.fill) {
      const base = asNumber(sceneLights.fill.userData?.__asgBaseIntensity, sceneLights.fill.intensity)
      sceneLights.fill.intensity = Math.max(0, base * adv.fillBoost * config.fillMultiplier * (1 + flash * 0.45))
    }
    if (sceneLights.rim) {
      const base = asNumber(sceneLights.rim.userData?.__asgBaseIntensity, sceneLights.rim.intensity)
      sceneLights.rim.intensity = useStylizedLightTexture
        ? Math.max(0, base * adv.rimBoost * config.keyMultiplier * (1 + flash * 0.18))
        : 0
    }
    if (sceneLights.bounce) {
      const base = asNumber(sceneLights.bounce.userData?.__asgBaseIntensity, sceneLights.bounce.intensity)
      sceneLights.bounce.intensity = useStylizedLightTexture
        ? Math.max(0, base * adv.bounceBoost * config.fillMultiplier * (1 + flash * 0.12))
        : 0
    }
  }

  function updateWeatherOverlays(config, time = 0) {
    const gustPulse = config.wind ? (0.86 + Math.sin(time * 2.1) * 0.12 + Math.sin(time * 0.63 + 1.4) * 0.08) : 0
    if (dom.weatherOverlay) {
      dom.weatherOverlay.style.opacity = String(Math.max(0, config.overlayOpacity).toFixed(3))
    }
    if (dom.weatherWindOverlay) {
      dom.weatherWindOverlay.style.opacity = String(Math.max(0, config.windOverlayOpacity * Math.max(0.18, gustPulse)).toFixed(3))
      dom.weatherWindOverlay.style.backgroundPosition = `${(-weatherRuntime.windScroll * 84).toFixed(1)}px ${(-weatherRuntime.windScroll * 10).toFixed(1)}px, ${(-weatherRuntime.windScroll * 52).toFixed(1)}px ${(weatherRuntime.windScroll * 8).toFixed(1)}px, ${(-weatherRuntime.windScroll * 66).toFixed(1)}px ${(weatherRuntime.windScroll * 5).toFixed(1)}px, 0px 0px`
    }
    if (dom.weatherFlashOverlay) {
      dom.weatherFlashOverlay.style.opacity = String(Math.max(0, Math.pow(weatherRuntime.flashStrength, 1.15) * 0.88).toFixed(3))
    }
  }

  function updateWeatherRain(config, dt) {
    if (!weatherRuntime.rain || !weatherRuntime.rainPositions || !weatherRuntime.rainSeed) return
    const positions = weatherRuntime.rainPositions
    const seed = weatherRuntime.rainSeed
    const count = weatherRuntime.rainCount
    const minY = 0.25
    const maxY = 18.5
    const halfX = 15
    const halfZ = 15
    const xDrift = config.rainDriftX * dt * 3.2
    const zDrift = config.rainDriftZ * dt * 3.2

    for (let i = 0; i < count; i++) {
      const base = i * 4
      let x = seed[base]
      let y = seed[base + 1]
      let z = seed[base + 2]
      const speedMul = seed[base + 3]

      x += xDrift * speedMul
      y -= config.rainSpeed * dt * speedMul
      z += zDrift * speedMul

      if (y < minY || x < -halfX - 2 || x > halfX + 2 || z < -halfZ - 2 || z > halfZ + 2) {
        x = (Math.random() - 0.5) * halfX * 2
        y = maxY + Math.random() * 4
        z = (Math.random() - 0.5) * halfZ * 2
        seed[base + 3] = 0.82 + Math.random() * 0.36
      }

      seed[base] = x
      seed[base + 1] = y
      seed[base + 2] = z
      writeWeatherRainSegment(positions, i, x, y, z, config)
    }

    weatherRuntime.rain.geometry.attributes.position.needsUpdate = true
  }

  function updateWeatherWind(config, dt, time = weatherRuntime.time) {
    if (!weatherRuntime.windDust || !weatherRuntime.windDustPositions || !weatherRuntime.windDustSeed) return
    const positions = weatherRuntime.windDustPositions
    const seed = weatherRuntime.windDustSeed
    const count = weatherRuntime.windDustCount
    const halfX = 16
    const halfZ = 12
    const speed = Math.max(0, asNumber(config.windParticleSpeed, 0))

    for (let i = 0; i < count; i++) {
      const p = i * 3
      const s = i * 5
      let x = positions[p]
      let y = positions[p + 1]
      let z = positions[p + 2]
      const speedMul = seed[s + 3]
      const phase = seed[s + 4]

      x += dt * speed * speedMul
      y = seed[s + 1] + Math.sin(time * 1.8 + phase) * 0.18
      z = seed[s + 2] + Math.cos(time * 1.35 + phase) * 0.45

      if (x > halfX + 3) {
        x = -halfX - Math.random() * 3
        seed[s + 1] = 0.35 + Math.random() * 7.5
        seed[s + 2] = (Math.random() - 0.5) * halfZ * 2
        seed[s + 3] = 0.8 + Math.random() * 0.7
        y = seed[s + 1]
        z = seed[s + 2]
      }

      positions[p] = x
      positions[p + 1] = y
      positions[p + 2] = z
    }

    weatherRuntime.windDust.geometry.attributes.position.needsUpdate = true
  }

  function updateWeatherAffectedGroups(config, time = 0) {
    const keys = ['survivor1', 'survivor2', 'survivor3', 'survivor4', 'hunter', 'custom1']
    for (let i = 0; i < keys.length; i++) {
      const runtime = slotRuntime.get(keys[i])
      if (!runtime || !runtime.group) continue
      const base = runtime.weatherBaseRotation || {
        x: runtime.group.rotation.x,
        y: runtime.group.rotation.y,
        z: runtime.group.rotation.z
      }
      runtime.group.rotation.x = base.x
      runtime.group.rotation.y = base.y
      runtime.group.rotation.z = base.z
    }
  }

  function triggerLightningFlash() {
    weatherRuntime.flashStrength = 1
    weatherRuntime.pendingFlash = Math.random() < 0.52 ? (0.28 + Math.random() * 0.26) : 0
    weatherRuntime.lightningPulseTimer = weatherRuntime.pendingFlash > 0 ? (0.07 + Math.random() * 0.08) : 0
    weatherRuntime.lightningCooldown = 2.8 + Math.random() * 5.4
    playWeatherThunderSound(0.9 + Math.random() * 0.3)
  }

  function applyWeatherPreset(presetKey, shouldSave = true) {
    const key = (typeof presetKey === 'string' && WEATHER_PRESETS[presetKey]) ? presetKey : 'clear'
    state.layout.weatherPreset = key
    const baseConfig = WEATHER_PRESETS[key]
    const config = getWeatherEffectiveConfig(key)
    if (!baseConfig.lightning) {
      weatherRuntime.flashStrength = 0
      weatherRuntime.pendingFlash = 0
      weatherRuntime.lightningPulseTimer = 0
      weatherRuntime.lightningCooldown = 2.8
    }
    rebuildWeatherRain(config)
    rebuildWeatherWind(config)
    syncWeatherInputs()
    applyWeatherLightingState(0)
    updateWeatherAffectedGroups(config, weatherRuntime.time)
    updateWeatherOverlays(config, weatherRuntime.time)
    updateWeatherAudioState(true)
    if (shouldSave) scheduleSaveLayout()
  }

  function updateWeatherEffects(dt) {
    const config = getWeatherEffectiveConfig(state.layout?.weatherPreset)
    weatherRuntime.time += dt
    weatherRuntime.windScroll += dt * config.windScrollSpeed

    if (config.lightning) {
      weatherRuntime.lightningCooldown -= dt
      if (weatherRuntime.lightningPulseTimer > 0) {
        weatherRuntime.lightningPulseTimer -= dt
        if (weatherRuntime.lightningPulseTimer <= 0 && weatherRuntime.pendingFlash > 0) {
          weatherRuntime.flashStrength = Math.max(weatherRuntime.flashStrength, weatherRuntime.pendingFlash)
          weatherRuntime.pendingFlash = 0
        }
      }
      if (weatherRuntime.lightningCooldown <= 0) {
        triggerLightningFlash()
      }
    } else {
      weatherRuntime.lightningCooldown = 2.8
      weatherRuntime.lightningPulseTimer = 0
      weatherRuntime.pendingFlash = 0
      weatherRuntime.flashStrength = 0
    }

    if (weatherRuntime.flashStrength > 0) {
      weatherRuntime.flashStrength = Math.max(0, weatherRuntime.flashStrength - dt * 4.4)
    }

    updateWeatherRain(config, dt)
    updateWeatherWind(config, dt, weatherRuntime.time)
    updateWeatherAffectedGroups(config, weatherRuntime.time)
    applyWeatherLightingState(weatherRuntime.flashStrength)
    updateWeatherOverlays(config, weatherRuntime.time)
    updateWeatherAudioState(false)
  }

  function getToonGradientMap(steps = 3) {
    const n = Math.max(2, Math.min(5, Math.round(asNumber(steps, 3))))
    if (toonGradientMapCache.has(n)) return toonGradientMapCache.get(n)
    const data = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      data[i] = Math.round((i / Math.max(1, n - 1)) * 255)
    }
    const tex = new THREE.DataTexture(data, n, 1, THREE.LuminanceFormat)
    tex.magFilter = THREE.NearestFilter
    tex.minFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    tex.needsUpdate = true
    toonGradientMapCache.set(n, tex)
    return tex
  }

  function buildToonMaterialFrom(sourceMat, steps = 3) {
    if (!sourceMat) return sourceMat
    const toonMat = new THREE.MeshToonMaterial({
      color: sourceMat.color ? sourceMat.color.clone() : new THREE.Color(0xffffff),
      map: sourceMat.map || null,
      alphaMap: sourceMat.alphaMap || null,
      emissive: sourceMat.emissive ? sourceMat.emissive.clone() : new THREE.Color(0x000000),
      emissiveMap: sourceMat.emissiveMap || null,
      emissiveIntensity: Number.isFinite(sourceMat.emissiveIntensity) ? sourceMat.emissiveIntensity : 1,
      normalMap: sourceMat.normalMap || null,
      normalScale: sourceMat.normalScale ? sourceMat.normalScale.clone() : undefined,
      roughnessMap: sourceMat.roughnessMap || null,
      metalnessMap: sourceMat.metalnessMap || null,
      aoMap: sourceMat.aoMap || null,
      aoMapIntensity: Number.isFinite(sourceMat.aoMapIntensity) ? sourceMat.aoMapIntensity : 1,
      transparent: !!sourceMat.transparent,
      opacity: Number.isFinite(sourceMat.opacity) ? sourceMat.opacity : 1,
      side: sourceMat.side,
      depthWrite: sourceMat.depthWrite !== false,
      depthTest: sourceMat.depthTest !== false
    })
    toonMat.gradientMap = getToonGradientMap(steps)
    toonMat.skinning = !!sourceMat.skinning
    toonMat.morphTargets = !!sourceMat.morphTargets
    toonMat.morphNormals = !!sourceMat.morphNormals
    return toonMat
  }

  function applyStylizedOutlineToMaterial(material, roleType) {
    if (!material) return
    if (!material.userData) material.userData = {}
    if (roleType === 'scene') {
      material.userData.outlineParameters = {
        color: [0, 0, 0],
        alpha: 0,
        visible: false
      }
      return
    }
    const cfg = state.layout?.stylizedRender || DEFAULT_LAYOUT.stylizedRender
    const color = new THREE.Color(cfg.outlineColor || '#000000')
    material.userData.outlineParameters = {
      color: [color.r, color.g, color.b],
      alpha: Math.max(0, Math.min(1, asNumber(cfg.outlineAlpha, 1))),
      visible: cfg.outlineEnabled !== false
    }
  }

  function getOutlineDistanceScale() {
    if (!camera || !orbit || !orbit.target) return 1
    const dx = asNumber(camera.position.x, 0) - asNumber(orbit.target.x, 0)
    const dy = asNumber(camera.position.y, 0) - asNumber(orbit.target.y, 0)
    const dz = asNumber(camera.position.z, 0) - asNumber(orbit.target.z, 0)
    const dist = Math.max(0.001, Math.sqrt(dx * dx + dy * dy + dz * dz))
    const reference = 8
    // 距离越远，适当减小厚度，保持视觉宽度稳定
    return Math.max(0.3, Math.min(2.2, reference / dist))
  }

  function updateOutlineEffectThickness() {
    if (!outlineEffect) return
    const cfg = state.layout?.stylizedRender || DEFAULT_LAYOUT.stylizedRender
    const base = Math.max(0.0005, Math.min(0.03, asNumber(cfg.outlineThickness, 0.004)))
    outlineEffect.defaultThickness = base * getOutlineDistanceScale()
  }

  function applyStylizedToObject(obj, roleType = '') {
    if (!obj || !state.layout?.stylizedRender) return
    const cfg = state.layout.stylizedRender
    obj.traverse((node) => {
      if (!node || !node.isMesh || !node.material) return
      if (!node.userData) node.userData = {}
      if (!node.userData.__asgBaseMaterial) {
        node.userData.__asgBaseMaterial = node.material
      }
      if (!cfg.toonEnabled) {
        node.material = node.userData.__asgBaseMaterial
        const mats = Array.isArray(node.material) ? node.material : [node.material]
        mats.forEach((m) => applyStylizedOutlineToMaterial(m, roleType))
        return
      }
      if (roleType === 'scene') {
        // 场景模型保持原始 PBR 材质，避免描边与三渲二导致发黑
        node.material = node.userData.__asgBaseMaterial
        const mats = Array.isArray(node.material) ? node.material : [node.material]
        mats.forEach((m) => applyStylizedOutlineToMaterial(m, roleType))
        return
      }
      const base = node.userData.__asgBaseMaterial
      const mats = Array.isArray(base) ? base : [base]
      const toonMats = mats.map((m) => buildToonMaterialFrom(m, cfg.toonSteps))
      node.material = Array.isArray(base) ? toonMats : toonMats[0]
      const applied = Array.isArray(node.material) ? node.material : [node.material]
      applied.forEach((m) => applyStylizedOutlineToMaterial(m, roleType))
    })
  }

  function applyStylizedToAllModels() {
    for (const runtime of slotRuntime.values()) {
      if (!runtime || !runtime.model) continue
      if (runtime.cfg?.roleType === 'light' || runtime.cfg?.roleType === 'video' || runtime.cfg?.roleType === 'camera') continue
      applyStylizedToObject(runtime.model, runtime.cfg?.roleType || '')
    }
  }


  function syncStylizedRenderInputs() {
    const cfg = state.layout?.stylizedRender || DEFAULT_LAYOUT.stylizedRender
    if (dom.stylizedToonEnabled) dom.stylizedToonEnabled.checked = !!cfg.toonEnabled
    if (dom.stylizedToonSteps) dom.stylizedToonSteps.value = String(Math.max(2, Math.min(5, Math.round(asNumber(cfg.toonSteps, 3)))))
    if (dom.stylizedOutlineEnabled) dom.stylizedOutlineEnabled.checked = cfg.outlineEnabled !== false
    if (dom.stylizedOutlineThickness) dom.stylizedOutlineThickness.value = String(Math.max(0.0005, Math.min(0.03, asNumber(cfg.outlineThickness, 0.004))))
    if (dom.stylizedOutlineColor) dom.stylizedOutlineColor.value = (typeof cfg.outlineColor === 'string' && cfg.outlineColor) ? cfg.outlineColor : '#000000'
    if (dom.stylizedOutlineAlpha) dom.stylizedOutlineAlpha.value = String(Math.max(0, Math.min(1, asNumber(cfg.outlineAlpha, 1))))
  }

  function applyStylizedRenderSettings(shouldSave = true) {
    if (!state.layout.stylizedRender) state.layout.stylizedRender = deepClone(DEFAULT_LAYOUT.stylizedRender)
    const cfg = state.layout.stylizedRender
    cfg.toonEnabled = !!cfg.toonEnabled
    cfg.toonSteps = Math.max(2, Math.min(5, Math.round(asNumber(cfg.toonSteps, 3))))
    cfg.outlineEnabled = cfg.outlineEnabled !== false
    cfg.outlineThickness = Math.max(0.0005, Math.min(0.03, asNumber(cfg.outlineThickness, 0.004)))
    cfg.outlineColor = (typeof cfg.outlineColor === 'string' && cfg.outlineColor) ? cfg.outlineColor : '#000000'
    cfg.outlineAlpha = Math.max(0, Math.min(1, asNumber(cfg.outlineAlpha, 1)))
    if (outlineEffect) {
      try {
        const c = new THREE.Color(cfg.outlineColor)
        outlineEffect.defaultColor = [c.r, c.g, c.b]
        outlineEffect.defaultAlpha = cfg.outlineAlpha
        updateOutlineEffectThickness()
      } catch { }
    }
    applyStylizedToAllModels()
    syncStylizedRenderInputs()
    if (shouldSave) scheduleSaveLayout()
  }

  function applyEnvironmentPreset(presetKey, shouldSave = true) {
    const key = (presetKey && ENVIRONMENT_PRESETS[presetKey]) ? presetKey : 'duskCinema'
    const preset = ENVIRONMENT_PRESETS[key]
    state.layout.environmentPreset = key

    if (sceneLights.ambient) {
      sceneLights.ambient.color.set(preset.ambientColor)
      sceneLights.ambient.intensity = preset.ambientIntensity
      sceneLights.ambient.userData.__asgBaseIntensity = preset.ambientIntensity
    }
    if (sceneLights.hemi) {
      sceneLights.hemi.color.set(preset.hemiSkyColor)
      sceneLights.hemi.groundColor.set(preset.hemiGroundColor)
      sceneLights.hemi.intensity = preset.hemiIntensity
      sceneLights.hemi.userData.__asgBaseIntensity = preset.hemiIntensity
    }
    if (sceneLights.key) {
      sceneLights.key.color.set(preset.keyColor)
      sceneLights.key.intensity = preset.keyIntensity
      sceneLights.key.position.set(preset.keyPos.x, preset.keyPos.y, preset.keyPos.z)
      sceneLights.key.userData.__asgBaseIntensity = preset.keyIntensity
    }
    if (sceneLights.fill) {
      sceneLights.fill.color.set(preset.fillColor)
      sceneLights.fill.intensity = preset.fillIntensity
      sceneLights.fill.position.set(preset.fillPos.x, preset.fillPos.y, preset.fillPos.z)
      sceneLights.fill.userData.__asgBaseIntensity = preset.fillIntensity
    }
    if (sceneLights.rim) {
      sceneLights.rim.color.set(preset.keyColor)
      sceneLights.rim.position.set(-preset.keyPos.x * 0.55, Math.max(4, preset.keyPos.y * 0.45), preset.keyPos.z * 0.75)
    }
    if (sceneLights.bounce) {
      sceneLights.bounce.color.set(preset.fillColor)
      sceneLights.bounce.position.set(-preset.fillPos.x * 0.35, 1.5, -preset.fillPos.z * 0.35)
    }
    if (skyDome && skyDome.material && skyDome.material.uniforms) {
      skyDome.material.uniforms.uTopColor.value.set(preset.skyTop)
      skyDome.material.uniforms.uBottomColor.value.set(preset.skyBottom)
    }
    if (scene) {
      scene.background = new THREE.Color(preset.skyBottom)
      const fogStrength = Math.max(0, Math.min(3, asNumber(state.layout.fogStrength, 1)))
      const strength01 = Math.max(0, Math.min(1, fogStrength / 3))
      const near = Math.max(0.2, preset.fogNear * (1 - 0.85 * strength01))
      const far = Math.max(near + 2, preset.fogFar * (1 - 0.88 * strength01))
      scene.fog = state.layout.fogEnabled ? new THREE.Fog(preset.fogColor, near, far) : null
    }
    if (dom.fogOverlay) {
      const fogStrength = Math.max(0, Math.min(3, asNumber(state.layout.fogStrength, 1)))
      const strength01 = Math.max(0, Math.min(1, fogStrength / 3))
      const alpha = state.layout.fogEnabled ? (0.03 + Math.pow(strength01, 0.82) * 0.36) : 0
      dom.fogOverlay.style.backgroundColor = preset.fogColor
      dom.fogOverlay.style.opacity = String(alpha.toFixed(3))
    }
    if (shadowGround && shadowGround.material) {
      const strength = Math.max(0, Math.min(1, asNumber(state.layout.shadowStrength, preset.shadowOpacity)))
      shadowGround.material.opacity = strength
    }
    for (const cfg of SLOT_CONFIGS) {
      if (cfg.roleType === 'survivor' || cfg.roleType === 'hunter') {
        updateBlobShadowForSlot(cfg.key)
      }
    }
    if (dom.environmentPresetSelect) dom.environmentPresetSelect.value = key
    if (dom.fogEnabled) dom.fogEnabled.checked = !!state.layout.fogEnabled
    if (dom.fogStrength) dom.fogStrength.value = String(Math.max(0, Math.min(3, asNumber(state.layout.fogStrength, 1))).toFixed(2))
    if (dom.shadowStrength) dom.shadowStrength.value = String(Math.max(0, Math.min(1, asNumber(state.layout.shadowStrength, preset.shadowOpacity))).toFixed(2))
    if (dom.droneModeEnabled) dom.droneModeEnabled.checked = !!state.layout.droneMode
    if (dom.renderQualitySelect) dom.renderQualitySelect.value = state.layout.qualityPreset || 'high'
    applyAdvancedRenderSettings(false, false)
    applyWeatherLightingState(weatherRuntime.flashStrength)
    if (shouldSave) scheduleSaveLayout()
  }

  function applyOrbitFromLayout() {
    const cam = state.layout.camera
    orbit.target = { ...cam.target }
    orbit.desiredTarget = { ...cam.target }
    const dx = cam.position.x - cam.target.x
    const dy = cam.position.y - cam.target.y
    const dz = cam.position.z - cam.target.z
    orbit.radius = Math.max(CAMERA_EPSILON_RADIUS, Math.sqrt(dx * dx + dy * dy + dz * dz))
    orbit.yaw = Math.atan2(dx, dz)
    orbit.pitch = Math.asin(Math.max(-0.99, Math.min(0.99, dy / Math.max(0.0001, orbit.radius))))
    orbit.desiredRadius = orbit.radius
    orbit.desiredYaw = orbit.yaw
    orbit.desiredPitch = orbit.pitch
    if (camera) {
      camera.fov = clampCameraFov(cam.fov, DEFAULT_CAMERA_FOV)
      camera.aspect = clampCameraAspect(camera.aspect, getViewportAspect())
      camera.updateProjectionMatrix()
    }
    updateCameraFromOrbit(true)
  }

  function updateCameraFromOrbit(force = false) {
    const lerpK = force ? 1 : orbit.smoothing
    orbit.yaw += (orbit.desiredYaw - orbit.yaw) * lerpK
    orbit.pitch += (orbit.desiredPitch - orbit.pitch) * lerpK
    orbit.radius += (orbit.desiredRadius - orbit.radius) * lerpK
    orbit.target.x += (orbit.desiredTarget.x - orbit.target.x) * lerpK
    orbit.target.y += (orbit.desiredTarget.y - orbit.target.y) * lerpK
    orbit.target.z += (orbit.desiredTarget.z - orbit.target.z) * lerpK

    const cosPitch = Math.cos(orbit.pitch)
    let x = orbit.target.x + orbit.radius * Math.sin(orbit.yaw) * cosPitch
    let y = orbit.target.y + orbit.radius * Math.sin(orbit.pitch)
    let z = orbit.target.z + orbit.radius * Math.cos(orbit.yaw) * cosPitch
    let tx = orbit.target.x
    let ty = orbit.target.y
    let tz = orbit.target.z

    if (state.layout?.droneMode) {
      const t = performance.now() * 0.001
      x += Math.sin(t * 0.37 + 1.2) * 0.03 + Math.sin(t * 1.13 + 2.7) * 0.012
      y += Math.sin(t * 0.29 + 0.4) * 0.018 + Math.sin(t * 0.91 + 5.1) * 0.008
      z += Math.sin(t * 0.41 + 3.3) * 0.026 + Math.sin(t * 1.27 + 0.8) * 0.010
      tx += Math.sin(t * 0.55 + 2.1) * 0.015
      ty += Math.sin(t * 0.47 + 4.7) * 0.010
      tz += Math.sin(t * 0.61 + 1.9) * 0.015
    }

    camera.position.set(x, y, z)
    camera.lookAt(tx, ty, tz)
  }

  function getBaseCameraPositionFromOrbit() {
    const cosPitch = Math.cos(orbit.pitch)
    return {
      x: orbit.target.x + orbit.radius * Math.sin(orbit.yaw) * cosPitch,
      y: orbit.target.y + orbit.radius * Math.sin(orbit.pitch),
      z: orbit.target.z + orbit.radius * Math.cos(orbit.yaw) * cosPitch
    }
  }

  function saveCameraToLayout() {
    state.layout.camera = captureCurrentCameraLayout()
    scheduleSaveLayout()
  }

  function captureCurrentCameraLayout() {
    const basePos = getBaseCameraPositionFromOrbit()
    return {
      position: {
        x: basePos.x,
        y: basePos.y,
        z: basePos.z
      },
      target: {
        x: orbit.target.x,
        y: orbit.target.y,
        z: orbit.target.z
      },
      fov: clampCameraFov(camera?.fov, state.layout?.camera?.fov || DEFAULT_CAMERA_FOV)
    }
  }

  function getCameraMoveStep() {
    const raw = asNumber(dom.cameraMoveStep ? dom.cameraMoveStep.value : 0.25, 0.25)
    return Math.max(0.001, raw)
  }

  function isCameraMoveKey(key) {
    return key === 'w' || key === 'a' || key === 's' || key === 'd' || key === 'q' || key === 'e'
  }

  function hasActiveCameraKeyboardMove() {
    for (const key of cameraKeyboardState.pressed) {
      if (isCameraMoveKey(key)) return true
    }
    return false
  }

  function applyCameraKeyboardInput(dt) {
    if (!camera || !THREE || cameraTransition) return
    if (!hasActiveCameraKeyboardMove()) return

    const keys = cameraKeyboardState.pressed
    const shiftDown = keys.has('shift')
    const moveStep = getCameraMoveStep() * Math.max(0.0001, dt * 5.2)
    const rotateStep = Math.max(0.0001, dt * 1.9)
    let changed = false

    if (shiftDown) {
      if (keys.has('a')) { orbit.desiredYaw += rotateStep; changed = true }
      if (keys.has('d')) { orbit.desiredYaw -= rotateStep; changed = true }
      if (keys.has('w')) { orbit.desiredPitch += rotateStep; changed = true }
      if (keys.has('s')) { orbit.desiredPitch -= rotateStep; changed = true }
      orbit.desiredPitch = Math.max(-1.4, Math.min(1.4, orbit.desiredPitch))
      orbit.yaw = orbit.desiredYaw
      orbit.pitch = orbit.desiredPitch
    } else {
      const forward = new THREE.Vector3()
      camera.getWorldDirection(forward).normalize()
      const up = new THREE.Vector3().copy(camera.up).normalize()
      const right = new THREE.Vector3().crossVectors(forward, up).normalize()
      const delta = new THREE.Vector3()
      if (keys.has('w')) delta.add(forward)
      if (keys.has('s')) delta.addScaledVector(forward, -1)
      if (keys.has('a')) delta.addScaledVector(right, -1)
      if (keys.has('d')) delta.add(right)
      if (keys.has('q')) delta.addScaledVector(up, -1)
      if (keys.has('e')) delta.add(up)
      if (delta.lengthSq() > 0) {
        delta.normalize().multiplyScalar(moveStep)
        orbit.desiredTarget.x += delta.x
        orbit.desiredTarget.y += delta.y
        orbit.desiredTarget.z += delta.z
        orbit.target.x += delta.x
        orbit.target.y += delta.y
        orbit.target.z += delta.z
        changed = true
      }
    }

    if (changed) {
      cancelCameraTransition()
      cameraKeyboardState.dirty = true
    }
  }

  function moveCameraByDirection(dir, scale = 1, immediate = false, shouldSave = false) {
    if (!camera || !dir) return
    cancelCameraTransition()
    const step = getCameraMoveStep() * Math.max(0.0001, scale)
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward).normalize()
    const up = new THREE.Vector3().copy(camera.up).normalize()
    const right = new THREE.Vector3().crossVectors(forward, up).normalize()
    const delta = new THREE.Vector3()

    if (dir === 'forward') delta.addScaledVector(forward, step)
    else if (dir === 'back') delta.addScaledVector(forward, -step)
    else if (dir === 'left') delta.addScaledVector(right, -step)
    else if (dir === 'right') delta.addScaledVector(right, step)
    else if (dir === 'up') delta.addScaledVector(up, step)
    else if (dir === 'down') delta.addScaledVector(up, -step)
    else return

    orbit.desiredTarget.x += delta.x
    orbit.desiredTarget.y += delta.y
    orbit.desiredTarget.z += delta.z
    if (immediate) {
      orbit.target.x += delta.x
      orbit.target.y += delta.y
      orbit.target.z += delta.z
      updateCameraFromOrbit(true)
    }
    if (shouldSave) saveCameraToLayout()
  }

  function stopCameraMoveHold() {
    if (cameraMoveState.activeBtn) {
      cameraMoveState.activeBtn.classList.remove('active')
    }
    cameraMoveState.activeBtn = null
    cameraMoveState.dir = ''
    saveCameraToLayout()
  }

  function countSelectedSurvivors(list) {
    if (!Array.isArray(list)) return 0
    return list.filter(v => typeof v === 'string' && v.trim()).length
  }

  function countNamedEntries(list) {
    if (!Array.isArray(list)) return 0
    return list.filter(v => typeof v === 'string' && v.trim()).length
  }

  function isHunterSelected(value) {
    return typeof value === 'string' && value.trim().length > 0
  }

  function readBpSnapshot(input) {
    const source = (input && typeof input === 'object') ? input : {}
    const round = (source.currentRoundData && typeof source.currentRoundData === 'object') ? source.currentRoundData : {}
    const survivors = Array.isArray(source.survivors)
      ? source.survivors
      : (Array.isArray(round.selectedSurvivors) ? round.selectedSurvivors : [null, null, null, null])
    const hunter = (typeof source.hunter === 'string' && source.hunter)
      ? source.hunter
      : (round.selectedHunter || null)
    const hunterBannedSurvivors = Array.isArray(source.hunterBannedSurvivors)
      ? source.hunterBannedSurvivors
      : (Array.isArray(round.hunterBannedSurvivors) ? round.hunterBannedSurvivors : [])
    const survivorBannedHunters = Array.isArray(source.survivorBannedHunters)
      ? source.survivorBannedHunters
      : (Array.isArray(round.survivorBannedHunters) ? round.survivorBannedHunters : [])
    const globalBannedSurvivors = Array.isArray(source.globalBannedSurvivors) ? source.globalBannedSurvivors : []
    const globalBannedHunters = Array.isArray(source.globalBannedHunters) ? source.globalBannedHunters : []
    return {
      survivors: Array.isArray(survivors) ? survivors.slice(0, 4) : [null, null, null, null],
      hunter: hunter || null,
      hunterBannedSurvivors: hunterBannedSurvivors.slice(),
      survivorBannedHunters: survivorBannedHunters.slice(),
      globalBannedSurvivors: globalBannedSurvivors.slice(),
      globalBannedHunters: globalBannedHunters.slice()
    }
  }

  function applyBpSnapshotToState(snapshot) {
    const next = snapshot && typeof snapshot === 'object' ? snapshot : readBpSnapshot(null)
    state.bp.survivors = Array.isArray(next.survivors) ? next.survivors.slice(0, 4) : [null, null, null, null]
    while (state.bp.survivors.length < 4) state.bp.survivors.push(null)
    state.bp.hunter = next.hunter || null
    state.bp.hunterBannedSurvivors = Array.isArray(next.hunterBannedSurvivors) ? next.hunterBannedSurvivors.slice() : []
    state.bp.survivorBannedHunters = Array.isArray(next.survivorBannedHunters) ? next.survivorBannedHunters.slice() : []
    state.bp.globalBannedSurvivors = Array.isArray(next.globalBannedSurvivors) ? next.globalBannedSurvivors.slice() : []
    state.bp.globalBannedHunters = Array.isArray(next.globalBannedHunters) ? next.globalBannedHunters.slice() : []
    return {
      survivorCount: countSelectedSurvivors(state.bp.survivors),
      hunterSelected: isHunterSelected(state.bp.hunter),
      roundBanCount: countNamedEntries(state.bp.hunterBannedSurvivors) + countNamedEntries(state.bp.survivorBannedHunters),
      globalBanCount: countNamedEntries(state.bp.globalBannedSurvivors) + countNamedEntries(state.bp.globalBannedHunters)
    }
  }

  function cancelCameraTransition() {
    cameraTransition = null
  }

  function normalizeAngleRad(value) {
    let v = value
    while (v > Math.PI) v -= Math.PI * 2
    while (v < -Math.PI) v += Math.PI * 2
    return v
  }

  function lerpAngleRad(from, to, t) {
    const delta = normalizeAngleRad(to - from)
    return from + delta * t
  }

  function cubicBezierCoord(t, a1, a2) {
    const omt = 1 - t
    return 3 * omt * omt * t * a1 + 3 * omt * t * t * a2 + t * t * t
  }

  function cubicBezierCoordDerivative(t, a1, a2) {
    const omt = 1 - t
    return 3 * omt * omt * a1 + 6 * omt * t * (a2 - a1) + 3 * t * t * (1 - a2)
  }

  function sampleUnitBezier(x1, y1, x2, y2, progress) {
    const target = Math.max(0, Math.min(1, asNumber(progress, 0)))
    let t = target
    for (let i = 0; i < 6; i++) {
      const x = cubicBezierCoord(t, x1, x2) - target
      const d = cubicBezierCoordDerivative(t, x1, x2)
      if (Math.abs(d) < 1e-6) break
      t = Math.max(0, Math.min(1, t - x / d))
    }
    return Math.max(0, Math.min(1, cubicBezierCoord(t, y1, y2)))
  }

  function easeInOutSmootherStep(t) {
    const x = Math.max(0, Math.min(1, asNumber(t, 0)))
    return x * x * x * (x * (x * 6 - 15) + 10)
  }

  function evaluateCameraEasing(progress, easingConfig = null) {
    const x = Math.max(0, Math.min(1, asNumber(progress, 0)))
    const cfg = normalizeCameraEasing(easingConfig || state.layout?.cameraEasing || DEFAULT_CAMERA_EASING)
    if (cfg.preset === 'smooth') return easeInOutSmootherStep(x)
    const presetCfg = CAMERA_EASING_PRESETS[cfg.preset] || CAMERA_EASING_PRESETS.smooth
    const bezier = cfg.preset === 'custom'
      ? cfg.bezier
      : (presetCfg.bezier || DEFAULT_CAMERA_EASING.bezier)
    return sampleUnitBezier(
      Math.max(0, Math.min(1, asNumber(bezier.x1, DEFAULT_CAMERA_EASING.bezier.x1))),
      asNumber(bezier.y1, DEFAULT_CAMERA_EASING.bezier.y1),
      Math.max(0, Math.min(1, asNumber(bezier.x2, DEFAULT_CAMERA_EASING.bezier.x2))),
      asNumber(bezier.y2, DEFAULT_CAMERA_EASING.bezier.y2),
      x
    )
  }

  function getCameraCurveSummaryText() {
    const cfg = normalizeCameraEasing(state.layout?.cameraEasing)
    const presetLabel = CAMERA_EASING_PRESETS[cfg.preset]?.label || '平滑默认'
    if (cfg.preset !== 'custom') return presetLabel
    return `${presetLabel} (${cfg.bezier.x1.toFixed(2)}, ${cfg.bezier.y1.toFixed(2)}, ${cfg.bezier.x2.toFixed(2)}, ${cfg.bezier.y2.toFixed(2)})`
  }

  function isCameraCurveModalOpen() {
    return !!dom.cameraCurveModal?.classList.contains('open')
  }

  function drawCameraCurveEditor() {
    const canvas = dom.cameraCurveCanvas
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const nextWidth = Math.max(320, Math.round(rect.width * dpr))
    const nextHeight = Math.max(220, Math.round(rect.height * dpr))
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth
      canvas.height = nextHeight
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const width = canvas.width
    const height = canvas.height
    const pad = 34
    const plotW = width - pad * 2
    const plotH = height - pad * 2
    const cfg = normalizeCameraEasing(state.layout?.cameraEasing)
    const x1 = cfg.bezier.x1
    const y1 = cfg.bezier.y1
    const x2 = cfg.bezier.x2
    const y2 = cfg.bezier.y2
    const toPx = (x, y) => ({
      x: pad + x * plotW,
      y: pad + (1 - y) * plotH
    })
    const start = toPx(0, 0)
    const end = toPx(1, 1)
    const p1 = toPx(x1, y1)
    const p2 = toPx(x2, y2)

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#101827'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const gx = pad + (plotW / 4) * i
      const gy = pad + (plotH / 4) * i
      ctx.beginPath()
      ctx.moveTo(gx, pad)
      ctx.lineTo(gx, height - pad)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(pad, gy)
      ctx.lineTo(width - pad, gy)
      ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(129,188,255,0.35)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()

    ctx.strokeStyle = '#8fd5ff'
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let i = 0; i <= 80; i++) {
      const t = i / 80
      const y = evaluateCameraEasing(t, cfg)
      const pt = {
        x: pad + t * plotW,
        y: pad + (1 - y) * plotH
      }
      if (i === 0) ctx.moveTo(pt.x, pt.y)
      else ctx.lineTo(pt.x, pt.y)
    }
    ctx.stroke()

    const drawHandle = (pt, color, label) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#eaf6ff'
      ctx.font = '12px "Microsoft YaHei UI", sans-serif'
      ctx.fillText(label, pt.x + 10, pt.y - 10)
    }
    drawHandle(p1, '#ffd166', 'P1')
    drawHandle(p2, '#ff8fab', 'P2')
  }

  function syncCameraCurveUi() {
    const cameraEasing = normalizeCameraEasing(state.layout?.cameraEasing)
    if (dom.cameraEasingPreset) dom.cameraEasingPreset.value = cameraEasing.preset
    if (dom.cameraCurveModalPreset) dom.cameraCurveModalPreset.value = cameraEasing.preset
    if (dom.cameraBezierX1) dom.cameraBezierX1.value = String(cameraEasing.bezier.x1.toFixed(2))
    if (dom.cameraBezierY1) dom.cameraBezierY1.value = String(cameraEasing.bezier.y1.toFixed(2))
    if (dom.cameraBezierX2) dom.cameraBezierX2.value = String(cameraEasing.bezier.x2.toFixed(2))
    if (dom.cameraBezierY2) dom.cameraBezierY2.value = String(cameraEasing.bezier.y2.toFixed(2))
    const bezierDisabled = cameraEasing.preset !== 'custom'
    ;[dom.cameraBezierX1, dom.cameraBezierY1, dom.cameraBezierX2, dom.cameraBezierY2].forEach((input) => {
      if (!input) return
      input.disabled = bezierDisabled
    })
    if (dom.cameraCurveHint) {
      dom.cameraCurveHint.textContent = bezierDisabled
        ? '当前为预设曲线。直接拖动画布控制点会自动切换到“自定义贝塞尔”。'
        : '拖动 P1 / P2 控制点，或直接修改右侧数值。'
    }
    if (dom.cameraCurveSummary) dom.cameraCurveSummary.textContent = getCameraCurveSummaryText()
    if (isCameraCurveModalOpen()) drawCameraCurveEditor()
  }

  function openCameraCurveModal() {
    if (!dom.cameraCurveModal) return
    dom.cameraCurveModal.classList.add('open')
    dom.cameraCurveModal.setAttribute('aria-hidden', 'false')
    if (dom.cameraCurveCanvas) {
      window.setTimeout(() => drawCameraCurveEditor(), 0)
    }
    syncCameraCurveUi()
  }

  function closeCameraCurveModal() {
    if (!dom.cameraCurveModal) return
    dom.cameraCurveModal.classList.remove('open')
    dom.cameraCurveModal.setAttribute('aria-hidden', 'true')
    cameraCurveDragHandle = ''
  }

  function resetCustomCameraCurve() {
    state.layout.cameraEasing = normalizeCameraEasing({
      preset: 'custom',
      bezier: DEFAULT_CAMERA_EASING.bezier
    })
    syncCameraCurveUi()
    scheduleSaveLayout()
  }

  function updateCameraCurveFromCanvasPointer(clientX, clientY) {
    if (!cameraCurveDragHandle || !dom.cameraCurveCanvas) return
    const rect = dom.cameraCurveCanvas.getBoundingClientRect()
    const pad = 34
    const plotW = rect.width - pad * 2
    const plotH = rect.height - pad * 2
    const px = Math.max(pad, Math.min(rect.width - pad, clientX - rect.left))
    const py = Math.max(pad, Math.min(rect.height - pad, clientY - rect.top))
    const x = (px - pad) / Math.max(1, plotW)
    const y = 1 - ((py - pad) / Math.max(1, plotH))
    const easing = normalizeCameraEasing(state.layout?.cameraEasing)
    easing.preset = 'custom'
    if (cameraCurveDragHandle === 'p1') {
      easing.bezier.x1 = Math.max(0, Math.min(1, x))
      easing.bezier.y1 = Math.max(0, Math.min(1, y))
    } else if (cameraCurveDragHandle === 'p2') {
      easing.bezier.x2 = Math.max(0, Math.min(1, x))
      easing.bezier.y2 = Math.max(0, Math.min(1, y))
    }
    state.layout.cameraEasing = easing
    syncCameraCurveUi()
  }

  function detectCameraCurveHandle(clientX, clientY) {
    if (!dom.cameraCurveCanvas) return ''
    const rect = dom.cameraCurveCanvas.getBoundingClientRect()
    const pad = 34
    const plotW = rect.width - pad * 2
    const plotH = rect.height - pad * 2
    const easing = normalizeCameraEasing(state.layout?.cameraEasing)
    const toPx = (x, y) => ({
      x: rect.left + pad + x * plotW,
      y: rect.top + pad + (1 - y) * plotH
    })
    const points = {
      p1: toPx(easing.bezier.x1, easing.bezier.y1),
      p2: toPx(easing.bezier.x2, easing.bezier.y2)
    }
    const threshold = 22
    for (const [key, point] of Object.entries(points)) {
      const dx = clientX - point.x
      const dy = clientY - point.y
      if ((dx * dx + dy * dy) <= threshold * threshold) return key
    }
    const p1Dist = Math.hypot(clientX - points.p1.x, clientY - points.p1.y)
    const p2Dist = Math.hypot(clientX - points.p2.x, clientY - points.p2.y)
    return p1Dist <= p2Dist ? 'p1' : 'p2'
  }

  function captureCurrentCameraFrame() {
    const fallbackCamera = state.layout?.camera || DEFAULT_LAYOUT.camera
    return {
      position: camera
        ? { x: camera.position.x, y: camera.position.y, z: camera.position.z }
        : ensureVec3(fallbackCamera.position, DEFAULT_LAYOUT.camera.position),
      target: ensureVec3(orbit?.target, fallbackCamera.target || DEFAULT_LAYOUT.camera.target),
      fov: clampCameraFov(camera?.fov, fallbackCamera.fov || DEFAULT_CAMERA_FOV)
    }
  }

  function buildOrbitStateFromFrame(frame) {
    const target = ensureVec3(frame?.target, state.layout.camera.target)
    const position = ensureVec3(frame?.position, state.layout.camera.position)
    const dx = position.x - target.x
    const dy = position.y - target.y
    const dz = position.z - target.z
    const radius = Math.max(CAMERA_EPSILON_RADIUS, Math.sqrt(dx * dx + dy * dy + dz * dz))
    return {
      target,
      radius,
      yaw: Math.atan2(dx, dz),
      pitch: Math.asin(Math.max(-0.99, Math.min(0.99, dy / Math.max(0.0001, radius))))
    }
  }

  function startCameraTransition(targetFrame, durationMs, reason = '') {
    if (!camera || !targetFrame) return
    const duration = Math.max(50, Math.min(10000, asNumber(durationMs, 900)))
    const easing = normalizeCameraEasing(state.layout?.cameraEasing)
    camera.aspect = clampCameraAspect(getViewportAspect(), getViewportAspect())
    camera.updateProjectionMatrix()
    const fromFrame = captureCurrentCameraFrame()
    const toFrame = normalizeCameraKeyframe(targetFrame, {
      position: state.layout?.camera?.position || DEFAULT_LAYOUT.camera.position,
      target: state.layout?.camera?.target || DEFAULT_LAYOUT.camera.target,
      fov: state.layout?.camera?.fov || DEFAULT_LAYOUT.camera.fov
    })
    const fromState = buildOrbitStateFromFrame(fromFrame)
    const toState = buildOrbitStateFromFrame(toFrame)
    if (pendingEntranceEffects.size) {
      pendingEntranceEffects.forEach((rootModel) => {
        if (rootModel) rootModel.visible = false
      })
    }
    cameraTransition = {
      startAt: performance.now(),
      duration,
      fromTarget: { ...fromState.target },
      fromYaw: fromState.yaw,
      fromPitch: fromState.pitch,
      fromRadius: fromState.radius,
      fromFov: fromFrame.fov,
      toTarget: { ...toState.target },
      toYaw: toState.yaw,
      toPitch: toState.pitch,
      toRadius: toState.radius,
      toFov: toFrame.fov,
      easing,
      reason
    }
  }

  function updateCameraTransition() {
    if (!cameraTransition || !camera) return
    const now = performance.now()
    const t = Math.max(0, Math.min(1, (now - cameraTransition.startAt) / Math.max(1, cameraTransition.duration)))
    const eased = evaluateCameraEasing(t, cameraTransition.easing)

    orbit.target = {
      x: cameraTransition.fromTarget.x + (cameraTransition.toTarget.x - cameraTransition.fromTarget.x) * eased,
      y: cameraTransition.fromTarget.y + (cameraTransition.toTarget.y - cameraTransition.fromTarget.y) * eased,
      z: cameraTransition.fromTarget.z + (cameraTransition.toTarget.z - cameraTransition.fromTarget.z) * eased
    }
    orbit.desiredTarget = { ...orbit.target }
    orbit.radius = Math.max(CAMERA_EPSILON_RADIUS, cameraTransition.fromRadius + (cameraTransition.toRadius - cameraTransition.fromRadius) * eased)
    orbit.yaw = lerpAngleRad(cameraTransition.fromYaw, cameraTransition.toYaw, eased)
    orbit.pitch = cameraTransition.fromPitch + (cameraTransition.toPitch - cameraTransition.fromPitch) * eased
    orbit.desiredRadius = orbit.radius
    orbit.desiredYaw = orbit.yaw
    orbit.desiredPitch = orbit.pitch
    camera.fov = clampCameraFov(
      cameraTransition.fromFov + (cameraTransition.toFov - cameraTransition.fromFov) * eased,
      DEFAULT_CAMERA_FOV
    )
    camera.aspect = clampCameraAspect(getViewportAspect(), getViewportAspect())
    camera.updateProjectionMatrix()
    updateCameraFromOrbit(true)

    if (t >= 1) {
      const reason = cameraTransition.reason
      cameraTransition = null
      saveCameraToLayout()
      flushPendingEntranceEffects()
      if (reason) setStatus(`镜头已切换: ${reason}`)
    }
  }

  function enqueueEntranceEffect(modelRoot) {
    if (!modelRoot) return
    if (cameraTransition) {
      modelRoot.visible = false
      pendingEntranceEffects.add(modelRoot)
      return
    }
    startEntranceEffect(modelRoot)
  }

  function flushPendingEntranceEffects() {
    if (!pendingEntranceEffects.size) return
    const roots = Array.from(pendingEntranceEffects)
    pendingEntranceEffects.clear()
    roots.forEach((rootModel) => {
      if (rootModel && rootModel.parent) startEntranceEffect(rootModel)
    })
  }

  function getSelectedCameraEventKey() {
    const key = dom.cameraEventSelect ? String(dom.cameraEventSelect.value || '') : ''
    return CAMERA_EVENT_OPTIONS.some(item => item.key === key) ? key : CAMERA_EVENT_OPTIONS[0].key
  }

  function syncCameraEditorInputs() {
    if (dom.cameraTransitionMs) {
      dom.cameraTransitionMs.value = String(Math.max(50, Math.min(10000, asNumber(state.layout.cameraTransitionMs, 900))))
    }
    syncCameraCurveUi()
    if (dom.entranceEffectSelect) {
      dom.entranceEffectSelect.value = state.layout?.entranceEffect || 'fade'
    }
    const eventKey = getSelectedCameraEventKey()
    const frame = state.layout?.cameraKeyframes?.[eventKey]
    if (!dom.cameraEventInfo) return
    if (frame && frame.position && frame.target) {
      dom.cameraEventInfo.textContent = '已录制'
    } else {
      dom.cameraEventInfo.textContent = '未录制'
    }
  }

  function saveCurrentCameraAsKeyframe() {
    const eventKey = getSelectedCameraEventKey()
    if (!state.layout.cameraKeyframes) state.layout.cameraKeyframes = deepClone(DEFAULT_LAYOUT.cameraKeyframes)
    state.layout.cameraKeyframes[eventKey] = {
      position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
      target: { x: orbit.target.x, y: orbit.target.y, z: orbit.target.z },
      fov: clampCameraFov(camera?.fov, state.layout?.camera?.fov || DEFAULT_CAMERA_FOV)
    }
    syncCameraEditorInputs()
    scheduleSaveLayout()
    const eventLabel = CAMERA_EVENT_OPTIONS.find(item => item.key === eventKey)?.label || eventKey
    setStatus(`已记录关键帧: ${eventLabel}`)
  }

  function clearSelectedCameraKeyframe() {
    const eventKey = getSelectedCameraEventKey()
    if (!state.layout.cameraKeyframes) state.layout.cameraKeyframes = deepClone(DEFAULT_LAYOUT.cameraKeyframes)
    state.layout.cameraKeyframes[eventKey] = null
    syncCameraEditorInputs()
    scheduleSaveLayout()
    const eventLabel = CAMERA_EVENT_OPTIONS.find(item => item.key === eventKey)?.label || eventKey
    setStatus(`已清除关键帧: ${eventLabel}`)
  }

  function previewSelectedCameraKeyframe() {
    const eventKey = getSelectedCameraEventKey()
    const frame = state.layout?.cameraKeyframes?.[eventKey]
    if (!frame) {
      setStatus('该事件尚未录制关键帧')
      return
    }
    const duration = Math.max(50, Math.min(10000, asNumber(dom.cameraTransitionMs ? dom.cameraTransitionMs.value : state.layout.cameraTransitionMs, state.layout.cameraTransitionMs)))
    state.layout.cameraTransitionMs = duration
    startCameraTransition(frame, duration, `预览 ${CAMERA_EVENT_OPTIONS.find(item => item.key === eventKey)?.label || eventKey}`)
  }

  function applyCameraEasingFromInputs(shouldSave = true) {
    const presetSource = (dom.cameraCurveModalPreset?.value || dom.cameraEasingPreset?.value || '')
    const preset = Object.prototype.hasOwnProperty.call(CAMERA_EASING_PRESETS, presetSource)
      ? presetSource
      : DEFAULT_CAMERA_EASING.preset
    state.layout.cameraEasing = normalizeCameraEasing({
      preset,
      bezier: {
        x1: asNumber(dom.cameraBezierX1?.value, DEFAULT_CAMERA_EASING.bezier.x1),
        y1: asNumber(dom.cameraBezierY1?.value, DEFAULT_CAMERA_EASING.bezier.y1),
        x2: asNumber(dom.cameraBezierX2?.value, DEFAULT_CAMERA_EASING.bezier.x2),
        y2: asNumber(dom.cameraBezierY2?.value, DEFAULT_CAMERA_EASING.bezier.y2)
      }
    })
    syncCameraCurveUi()
    if (shouldSave) scheduleSaveLayout()
  }

  function triggerCameraEvent(eventKey) {
    const frame = state.layout?.cameraKeyframes?.[eventKey]
    if (!frame) return
    const eventLabel = CAMERA_EVENT_OPTIONS.find(item => item.key === eventKey)?.label || eventKey
    let duration = state.layout.cameraTransitionMs
    if (state.virtualCameraMode?.enabled) {
      duration = Math.max(820, Math.min(2400, Math.round(duration * 1.22)))
    }
    startCameraTransition(frame, duration, eventLabel)
  }

  function requestCameraEvent(eventKey) {
    if (!eventKey) return
    if (bpRoleSyncRunning) {
      pendingCameraEventKey = eventKey
      return
    }
    triggerCameraEvent(eventKey)
  }

  function flushPendingCameraEvent() {
    if (!pendingCameraEventKey) return
    const key = pendingCameraEventKey
    pendingCameraEventKey = ''
    triggerCameraEvent(key)
  }

  function applyTransformToGroup(key, transform) {
    const runtime = slotRuntime.get(key)
    if (!runtime || !runtime.group) return
    const t = transform || {}
    const p = ensureVec3(t.position, { x: 0, y: 0, z: 0 })
    const r = ensureVec3(t.rotation, { x: 0, y: 0, z: 0 })
    const s = ensureVec3(t.scale, { x: 1, y: 1, z: 1 })
    runtime.group.position.set(p.x, p.y, p.z)
    runtime.group.rotation.set(toRadians(r.x), toRadians(r.y), toRadians(r.z))
    runtime.weatherBaseRotation = {
      x: toRadians(r.x),
      y: toRadians(r.y),
      z: toRadians(r.z)
    }
    if (key === 'scene') {
      runtime.group.scale.set(s.x, s.y, s.z)
    } else if (key === 'light1') {
      runtime.group.scale.set(1, 1, 1)
    } else {
      const uniform = getBaseUniformScaleForSlot(key, t)
      const effectiveUniform = uniform * getRoleScaleMultiplierForSlot(key)
      runtime.group.scale.set(effectiveUniform, effectiveUniform, effectiveUniform)
    }
    if (runtime.blobShadow) updateBlobShadowForSlot(key)
  }

  function removeModelFromSlot(key) {
    const runtime = slotRuntime.get(key)
    if (!runtime || !runtime.group) return
    if (runtime.model) pendingEntranceEffects.delete(runtime.model)
    stopEntranceEffectsForRoot(runtime.model)
    stopParticleEffectsForRoot(runtime.model)
    if (runtime.videoElement) {
      try {
        runtime.videoElement.pause()
        runtime.videoElement.removeAttribute('src')
        runtime.videoElement.load()
      } catch { }
    }
    if (runtime.videoTexture && typeof runtime.videoTexture.dispose === 'function') {
      try { runtime.videoTexture.dispose() } catch { }
    }
    if (runtime.mediaStream && typeof runtime.mediaStream.getTracks === 'function') {
      try {
        runtime.mediaStream.getTracks().forEach((track) => {
          try { track.stop() } catch { }
        })
      } catch { }
    }
    runtime.videoElement = null
    runtime.videoTexture = null
    runtime.mediaStream = null
    removeBlobShadowForSlot(key)
    while (runtime.group.children.length) {
      const child = runtime.group.children.pop()
      disposeObject(child)
    }
    runtime.model = null
    runtime.modelPath = ''
    if (mixers.has(key)) mixers.delete(key)
    if (runtime.cfg?.roleType === 'survivor') {
      refreshPuppeteerModelScaleFix()
    }
  }

  function updateVideoScreenGeometry(runtime) {
    if (!runtime || !runtime.model || !runtime.model.isMesh) return
    const w = Math.max(0.1, asNumber(state.layout?.videoScreen?.width, 2.2))
    const h = Math.max(0.1, asNumber(state.layout?.videoScreen?.height, 1.2))
    const oldGeo = runtime.model.geometry
    runtime.model.geometry = new THREE.PlaneGeometry(w, h, 1, 1)
    if (oldGeo && typeof oldGeo.dispose === 'function') {
      try { oldGeo.dispose() } catch { }
    }
  }

  function applyVideoScreenSettingsToRuntime(runtime) {
    if (!runtime || !runtime.videoElement) return
    const cfg = state.layout?.videoScreen || DEFAULT_LAYOUT.videoScreen
    runtime.videoElement.loop = cfg.loop !== false
    runtime.videoElement.muted = cfg.muted !== false
    runtime.videoElement.defaultMuted = runtime.videoElement.muted
    runtime.videoElement.volume = runtime.videoElement.muted ? 0 : 1
    updateVideoScreenGeometry(runtime)
  }

  function disposeObject(obj) {
    if (!obj) return
    obj.traverse((node) => {
      if (node.geometry && typeof node.geometry.dispose === 'function') {
        node.geometry.dispose()
      }
      if (node.material) {
        const mats = Array.isArray(node.material) ? node.material : [node.material]
        mats.forEach((mat) => {
          if (mat && typeof mat.dispose === 'function') mat.dispose()
        })
      }
    })
    if (obj.parent) obj.parent.remove(obj)
  }

  function materialAllowsShadow(mat) {
    if (!mat) return false
    const opacity = Number.isFinite(mat.opacity) ? mat.opacity : 1
    if (mat.visible === false) return false
    if (opacity <= 0.02) return false
    if (mat.transparent && opacity < 0.35) return false
    return true
  }

  function prepareModelForShadows(obj, roleType = '') {
    if (!obj) return
    const isCharacterLike = roleType === 'survivor' || roleType === 'hunter' || roleType === 'custom'
    obj.traverse((node) => {
      if (!node || !node.isMesh) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      const allowShadow = materials.some((mat) => materialAllowsShadow(mat))
      if (!allowShadow) {
        node.castShadow = false
        node.receiveShadow = false
        return
      }
      node.castShadow = !isCharacterLike
      node.receiveShadow = !isCharacterLike
    })
  }

  function getBlobShadowTexture() {
    if (blobShadowTexture || !THREE) return blobShadowTexture
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(0,0,0,0.58)')
    gradient.addColorStop(0.45, 'rgba(0,0,0,0.32)')
    gradient.addColorStop(0.8, 'rgba(0,0,0,0.10)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.clearRect(0, 0, 128, 128)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    blobShadowTexture = new THREE.CanvasTexture(canvas)
    blobShadowTexture.needsUpdate = true
    return blobShadowTexture
  }

  function isCharacterRoleType(roleType = '') {
    return roleType === 'survivor' || roleType === 'hunter'
  }

  function removeBlobShadowForSlot(key) {
    const runtime = slotRuntime.get(key)
    if (!runtime?.blobShadow) return
    const shadow = runtime.blobShadow
    runtime.blobShadow = null
    if (shadow.parent) shadow.parent.remove(shadow)
    if (shadow.geometry && typeof shadow.geometry.dispose === 'function') {
      try { shadow.geometry.dispose() } catch { }
    }
    if (shadow.material && typeof shadow.material.dispose === 'function') {
      try { shadow.material.dispose() } catch { }
    }
  }

  function updateBlobShadowForSlot(key) {
    const runtime = slotRuntime.get(key)
    if (!runtime || !runtime.group || !runtime.model || !isCharacterRoleType(runtime.cfg?.roleType || '')) {
      removeBlobShadowForSlot(key)
      return
    }
    const tex = getBlobShadowTexture()
    if (!tex) return
    let shadow = runtime.blobShadow
    if (!shadow) {
      shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: Math.max(0.16, Math.min(0.42, asNumber(state.layout?.shadowStrength, 0.45) * 0.7)),
          depthWrite: false,
          toneMapped: false
        })
      )
      shadow.rotation.x = -Math.PI / 2
      shadow.renderOrder = 1
      shadow.castShadow = false
      shadow.receiveShadow = false
      runtime.group.add(shadow)
      runtime.blobShadow = shadow
    }

    runtime.model.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(runtime.model)
    if (!Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) {
      shadow.visible = false
      return
    }
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const localCenter = runtime.group.worldToLocal(center.clone())
    const groupScaleX = Math.max(0.001, Math.abs(asNumber(runtime.group.scale.x, 1)))
    const groupScaleY = Math.max(0.001, Math.abs(asNumber(runtime.group.scale.y, 1)))
    const groupScaleZ = Math.max(0.001, Math.abs(asNumber(runtime.group.scale.z, 1)))
    const localWidth = size.x / groupScaleX
    const localHeight = size.y / groupScaleY
    const localDepth = size.z / groupScaleZ
    const width = Math.max(0.55, Math.min(3.8, localWidth * 0.72))
    const depth = Math.max(0.45, Math.min(3.2, localDepth * 0.68))
    shadow.visible = true
    shadow.position.set(localCenter.x, Math.max(0.01, localCenter.y - localHeight * 0.5 + 0.02), localCenter.z)
    shadow.scale.set(width, depth, 1)
    shadow.material.opacity = Math.max(0.14, Math.min(0.4, asNumber(state.layout?.shadowStrength, 0.45) * 0.68))
  }

  function isPuppeteerRoleName(name) {
    const text = String(name || '').trim().toLowerCase()
    return text === '木偶师' || text === 'puppeteer'
  }

  function isPuppeteerRuntime(runtime, roleName = '') {
    const roleText = String(roleName || '').trim().toLowerCase()
    const pathText = String(runtime?.modelPath || '').trim().toLowerCase()
    if (isPuppeteerRoleName(roleText)) return true
    return roleText.includes('木偶师')
      || roleText.includes('puppeteer')
      || pathText.includes('木偶师')
      || pathText.includes('puppeteer')
      || pathText.includes('bugoushi')
      || pathText.includes('muou')
  }

  function getObjectWorldHeight(obj) {
    if (!obj || !THREE) return 0
    obj.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(obj)
    if (!Number.isFinite(box.min.y) || !Number.isFinite(box.max.y)) return 0
    return Math.max(0, box.max.y - box.min.y)
  }

  function getUniformScaleValue(obj) {
    if (!obj) return 0
    const scale = obj.scale ? obj.scale : obj
    if (!scale) return 0
    return Math.max(
      Math.abs(asNumber(scale.x, 0)),
      Math.abs(asNumber(scale.y, 0)),
      Math.abs(asNumber(scale.z, 0))
    )
  }

  function buildSurvivorScaleDebug(runtime, roleName, extra = {}) {
    const model = runtime?.model || null
    const fullHeight = getObjectWorldHeight(model)
    const primaryBox = getPuppeteerPrimaryBox(model)
    const primaryHeight = primaryBox ? Math.max(0, primaryBox.getSize(new THREE.Vector3()).y) : 0
    const rootScale = getUniformScaleValue(model)
    return {
      slot: runtime?.key || '',
      role: roleName || '',
      modelPath: runtime?.modelPath || '',
      detectedAsPuppeteer: isPuppeteerRuntime(runtime, roleName),
      fullHeight: Number(fullHeight.toFixed(4)),
      primaryHeight: Number(primaryHeight.toFixed(4)),
      rootScale: Number(rootScale.toFixed(4)),
      modelScale: model ? {
        x: Number(model.scale.x.toFixed(4)),
        y: Number(model.scale.y.toFixed(4)),
        z: Number(model.scale.z.toFixed(4))
      } : null,
      groupScale: runtime?.group ? {
        x: Number(runtime.group.scale.x.toFixed(4)),
        y: Number(runtime.group.scale.y.toFixed(4)),
        z: Number(runtime.group.scale.z.toFixed(4))
      } : null,
      ...extra
    }
  }

  function getPuppeteerPrimaryBox(model) {
    if (!model || !THREE) return null
    const includeBox = new THREE.Box3()
    let hasInclude = false
    model.updateMatrixWorld(true)
    model.traverse((node) => {
      if (!node || !node.isMesh) return
      const name = String(node.name || '').toLowerCase()
      if (!name) return
      const include = name.includes('_body') || name.includes('_head')
      const exclude = name.includes('puppet') || name.includes('dart')
      if (!include || exclude) return
      const meshBox = new THREE.Box3().setFromObject(node)
      if (!Number.isFinite(meshBox.min.x) || !Number.isFinite(meshBox.max.x)) return
      if (!hasInclude) {
        includeBox.copy(meshBox)
        hasInclude = true
      } else {
        includeBox.union(meshBox)
      }
    })
    return hasInclude ? includeBox : null
  }

  function getGenericSurvivorPrimaryHeight(model) {
    if (!model || !THREE) return 0
    const includeBox = new THREE.Box3()
    let hasInclude = false
    let fallbackHeight = 0
    model.updateMatrixWorld(true)
    model.traverse((node) => {
      if (!node || !node.isMesh) return
      const meshBox = new THREE.Box3().setFromObject(node)
      if (!Number.isFinite(meshBox.min.x) || !Number.isFinite(meshBox.max.x)) return
      const size = meshBox.getSize(new THREE.Vector3())
      const h = Math.max(0, size.y)
      if (h > fallbackHeight) fallbackHeight = h
      const name = String(node.name || '').toLowerCase()
      if (name.includes('weapon') || name.includes('prop') || name.includes('dart')) return
      if (h < 0.05) return
      if (!hasInclude) {
        includeBox.copy(meshBox)
        hasInclude = true
      } else {
        includeBox.union(meshBox)
      }
    })
    if (hasInclude) {
      return Math.max(0, includeBox.getSize(new THREE.Vector3()).y)
    }
    return fallbackHeight
  }

  function refreshPuppeteerModelScaleFix() {
    if (!THREE) return
    const survivorRuntimes = []
    for (let i = 1; i <= 4; i++) {
      const key = `survivor${i}`
      const runtime = slotRuntime.get(key)
      if (runtime && runtime.model) survivorRuntimes.push(runtime)
    }
    if (!survivorRuntimes.length) return

    const referenceHeights = []
    const referenceRootScales = []
    survivorRuntimes.forEach((runtime) => {
      const roleName = state.slotDisplayNames[runtime.key] || ''
      if (isPuppeteerRuntime(runtime, roleName)) return
      const h = getGenericSurvivorPrimaryHeight(runtime.model)
      if (h > 0.15 && h < 2.5) referenceHeights.push(h)
      const rootScale = getUniformScaleValue(runtime.model)
      if (rootScale > 0.005 && rootScale < 1) referenceRootScales.push(rootScale)
    })
    const fallbackReferenceHeight = 0.72
    const fallbackReferenceRootScale = 0.032
    referenceHeights.sort((a, b) => a - b)
    referenceRootScales.sort((a, b) => a - b)
    const targetHeight = referenceHeights.length
      ? referenceHeights[Math.floor(referenceHeights.length / 2)]
      : fallbackReferenceHeight
    const targetRootScale = referenceRootScales.length
      ? referenceRootScales[Math.floor(referenceRootScales.length / 2)]
      : fallbackReferenceRootScale

    console.log('[CharacterModel3D][PuppeteerFix] reference survivor heights =', referenceHeights.map(v => Number(v.toFixed(4))))
    console.log('[CharacterModel3D][PuppeteerFix] target reference height =', Number(targetHeight.toFixed(4)))
    console.log('[CharacterModel3D][PuppeteerFix] reference survivor root scales =', referenceRootScales.map(v => Number(v.toFixed(4))))
    console.log('[CharacterModel3D][PuppeteerFix] target root scale =', Number(targetRootScale.toFixed(4)))

    survivorRuntimes.forEach((runtime) => {
      const roleName = state.slotDisplayNames[runtime.key] || ''
      const model = runtime.model
      if (!model) return
      if (!model.userData) model.userData = {}
      const baseScale = model.userData.__asgBaseScale && typeof model.userData.__asgBaseScale.clone === 'function'
        ? model.userData.__asgBaseScale
        : model.scale.clone()
      model.userData.__asgBaseScale = baseScale.clone()

      if (!isPuppeteerRuntime(runtime, roleName)) {
        model.scale.copy(baseScale)
        model.updateMatrixWorld(true)
        return
      }

      const baseRootScale = Math.max(0, getUniformScaleValue(baseScale))
      if (!(baseRootScale > 1e-6)) {
        console.warn('[CharacterModel3D][PuppeteerFix] invalid base root scale for', buildSurvivorScaleDebug(runtime, roleName))
        model.scale.copy(baseScale)
        model.updateMatrixWorld(true)
        setStatus(`木偶师特判失败: ${runtime.key} 根缩放无效`)
        return
      }

      const ratioRaw = targetRootScale / baseRootScale
      const ratio = Math.max(0.35, Math.min(1.15, ratioRaw))
      model.scale.copy(baseScale).multiplyScalar(ratio)
      model.updateMatrixWorld(true)
      const debugInfo = buildSurvivorScaleDebug(runtime, roleName, {
        targetHeight: Number(targetHeight.toFixed(4)),
        targetRootScale: Number(targetRootScale.toFixed(4)),
        baseRootScale: Number(baseRootScale.toFixed(4)),
        ratioRaw: Number(ratioRaw.toFixed(4)),
        ratioApplied: Number(ratio.toFixed(4))
      })
      console.warn('[CharacterModel3D][PuppeteerFix] applied', debugInfo)
      setStatus(`木偶师缩放: ${runtime.key} 根缩放 ${debugInfo.baseRootScale} -> 目标 ${debugInfo.targetRootScale} 倍率 ${debugInfo.ratioApplied}`)
    })
  }

  function stopEntranceEffectsForRoot(modelRoot) {
    if (!modelRoot || !activeEntranceEffects.length) return
    for (let i = activeEntranceEffects.length - 1; i >= 0; i--) {
      const fx = activeEntranceEffects[i]
      if (fx.modelRoot !== modelRoot) continue
      restoreEntranceTransform(fx)
      if (fx.transientGroup) {
        disposeTransientObject(fx.transientGroup)
        fx.transientGroup = null
      }
      if (Array.isArray(fx.entries)) {
        fx.entries.forEach((entry) => {
          if (entry.node && entry.node.isMesh) {
            if (typeof entry.originalCastShadow === 'boolean') {
              entry.node.castShadow = entry.originalCastShadow
            }
            if (typeof entry.originalReceiveShadow === 'boolean') {
              entry.node.receiveShadow = entry.originalReceiveShadow
            }
          }
          entry.materials.forEach((mat) => {
            if (!mat) return
            if (fx.type === 'flameDissolve') {
              if (mat.userData?.__asgDissolveUniforms) {
                mat.userData.__asgDissolveUniforms.uProgress.value = 1
              }
              if ('emissiveIntensity' in mat && Number.isFinite(mat.emissiveIntensity)) {
                mat.emissiveIntensity = Number.isFinite(mat.userData?.__entranceOriginalEmissiveIntensity)
                  ? mat.userData.__entranceOriginalEmissiveIntensity
                  : 1
              }
            }
            if (Number.isFinite(mat.userData?.__entranceOriginalOpacity)) {
              mat.opacity = mat.userData.__entranceOriginalOpacity
            }
            if (typeof mat.userData?.__entranceOriginalTransparent === 'boolean') {
              mat.transparent = mat.userData.__entranceOriginalTransparent
            }
            if (typeof mat.userData?.__entranceOriginalDepthWrite === 'boolean') {
              mat.depthWrite = mat.userData.__entranceOriginalDepthWrite
            }
            mat.needsUpdate = true
          })
        })
      }
      activeEntranceEffects.splice(i, 1)
    }
  }

  function syncEntranceParticleUi() {
    if (!dom.particleFileInfo) return
    const path = String(state.layout?.entranceParticle?.path || '').trim()
    if (!path) {
      dom.particleFileInfo.textContent = '粒子: 未配置'
      return
    }
    const shortName = path.split(/[\\/]/).pop() || path
    dom.particleFileInfo.textContent = `粒子: ${shortName}`
  }

  async function ensureEntranceParticleAsset(path) {
    const nextPath = String(path || '').trim()
    if (!nextPath) return { success: false, error: 'empty-path' }
    if (entranceParticleAsset.path === nextPath && entranceParticleAsset.scene) {
      return { success: true }
    }
    if (entranceParticleAsset.path === nextPath && entranceParticleAsset.loadingPromise) {
      return entranceParticleAsset.loadingPromise
    }
    const resolvedUrl = normalizeFileUrl(nextPath)
    if (!resolvedUrl) return { success: false, error: 'invalid-url' }

    entranceParticleAsset.path = nextPath
    entranceParticleAsset.scene = null
    entranceParticleAsset.animations = []
    entranceParticleAsset.loadingPromise = new Promise((resolve) => {
      gltfLoader.load(resolvedUrl, (gltf) => {
        const particleScene = gltf && gltf.scene ? gltf.scene : null
        if (!particleScene) {
          resolve({ success: false, error: 'particle-scene-empty' })
          return
        }
        entranceParticleAsset.scene = particleScene
        entranceParticleAsset.animations = Array.isArray(gltf.animations) ? gltf.animations : []
        resolve({ success: true })
      }, undefined, (error) => {
        resolve({ success: false, error: error?.message || String(error || 'particle-load-failed') })
      })
    }).finally(() => {
      entranceParticleAsset.loadingPromise = null
    })

    return entranceParticleAsset.loadingPromise
  }

  function disposeTransientObject(node) {
    if (!node) return
    if (node.parent) node.parent.remove(node)
    node.traverse?.((child) => {
      if (child && child.geometry && typeof child.geometry.dispose === 'function') {
        try { child.geometry.dispose() } catch { }
      }
      const material = child?.material
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          if (mat && typeof mat.dispose === 'function') {
            try { mat.dispose() } catch { }
          }
        })
      } else if (material && typeof material.dispose === 'function') {
        try { material.dispose() } catch { }
      }
    })
  }

  function restoreEntranceTransform(fx) {
    if (!fx?.modelRoot || !fx?.modelTransformBase) return
    const base = fx.modelTransformBase
    fx.modelRoot.position.copy(base.position)
    fx.modelRoot.scale.copy(base.scale)
    fx.modelRoot.rotation.copy(base.rotation)
  }

  function getEntranceEffectBounds(modelRoot) {
    const box = new THREE.Box3().setFromObject(modelRoot)
    const centerWorld = new THREE.Vector3()
    const size = new THREE.Vector3()
    if (!Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) {
      return {
        centerLocal: new THREE.Vector3(0, 1, 0),
        width: 1.4,
        height: 2.2,
        depth: 1.2,
        radius: 1.2
      }
    }
    box.getCenter(centerWorld)
    box.getSize(size)
    const centerLocal = modelRoot.worldToLocal(centerWorld.clone())
    return {
      centerLocal,
      width: Math.max(0.8, size.x),
      height: Math.max(1.2, size.y),
      depth: Math.max(0.8, size.z),
      radius: Math.max(0.8, size.length() * 0.22)
    }
  }

  function createEntranceTransientGroup(modelRoot, boundsInfo) {
    const group = new THREE.Group()
    group.position.copy(boundsInfo.centerLocal)
    modelRoot.add(group)
    return group
  }

  function createCardStormTransient(modelRoot, boundsInfo) {
    const group = createEntranceTransientGroup(modelRoot, boundsInfo)
    const cards = []
    const colors = ['#fef3c7', '#dbeafe', '#fbcfe8', '#e9d5ff', '#ffffff']
    for (let i = 0; i < 26; i++) {
      const w = 0.15 + Math.random() * 0.08
      const h = w * (1.35 + Math.random() * 0.35)
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      )
      mesh.renderOrder = 5
      group.add(mesh)
      const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.25
      const radius = boundsInfo.radius * (1.6 + Math.random() * 1.2)
      cards.push({
        mesh,
        start: new THREE.Vector3(
          Math.cos(angle) * radius,
          (Math.random() - 0.2) * boundsInfo.height * 1.1,
          Math.sin(angle) * radius * 0.6
        ),
        end: new THREE.Vector3(
          (Math.random() - 0.5) * boundsInfo.width * 0.36,
          (Math.random() - 0.05) * boundsInfo.height * 0.42,
          (Math.random() - 0.5) * boundsInfo.depth * 0.36
        ),
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 20
        ),
        offset: Math.random() * 0.22
      })
    }
    return { group, cards }
  }

  function createSpotlightRushTransient(modelRoot, boundsInfo) {
    const group = createEntranceTransientGroup(modelRoot, boundsInfo)
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(boundsInfo.radius * 0.08, boundsInfo.radius * 0.72, boundsInfo.height * 1.9, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: '#fff5cf',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
    beam.position.y = boundsInfo.height * 0.48
    group.add(beam)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(boundsInfo.radius * 0.95, Math.max(0.03, boundsInfo.radius * 0.08), 16, 48),
      new THREE.MeshBasicMaterial({
        color: '#fdf2b8',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    const streaks = []
    for (let i = 0; i < 4; i++) {
      const streak = new THREE.Mesh(
        new THREE.PlaneGeometry(boundsInfo.radius * 0.34, boundsInfo.height * 1.75),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#fff9dd' : '#d8e8ff',
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      )
      streak.position.y = boundsInfo.height * 0.44
      streak.rotation.y = (Math.PI / 4) * i
      group.add(streak)
      streaks.push(streak)
    }
    return { group, beam, ring, streaks }
  }

  function createPrismBloomTransient(modelRoot, boundsInfo) {
    const group = createEntranceTransientGroup(modelRoot, boundsInfo)
    const shards = []
    const colors = ['#9bd6ff', '#ffe3a8', '#ffc7f2']
    for (let i = 0; i < 18; i++) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12 + Math.random() * 0.14, 0.42 + Math.random() * 0.2),
        new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      )
      group.add(mesh)
      const angle = (i / 18) * Math.PI * 2
      shards.push({
        mesh,
        start: new THREE.Vector3(
          Math.cos(angle) * boundsInfo.radius * (0.18 + Math.random() * 0.24),
          (Math.random() - 0.5) * boundsInfo.height * 0.3,
          Math.sin(angle) * boundsInfo.radius * (0.18 + Math.random() * 0.24)
        ),
        end: new THREE.Vector3(
          Math.cos(angle) * boundsInfo.radius * (1.25 + Math.random() * 0.7),
          (Math.random() - 0.1) * boundsInfo.height * 1.05,
          Math.sin(angle) * boundsInfo.radius * (0.9 + Math.random() * 0.55)
        ),
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 16
        )
      })
    }
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(boundsInfo.radius * 0.36, boundsInfo.radius * 0.66, 48),
      new THREE.MeshBasicMaterial({
        color: '#d8f1ff',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
    ring.rotation.x = Math.PI / 2
    group.add(ring)
    return { group, shards, ring }
  }

  function createMistRevealTransient(modelRoot, boundsInfo) {
    const group = createEntranceTransientGroup(modelRoot, boundsInfo)
    const plumes = []
    const palette = ['#f4f8fb', '#d6e4ef', '#e8eef6', '#cfdce8']
    for (let i = 0; i < 18; i++) {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(
          boundsInfo.radius * (0.92 + Math.random() * 0.78),
          boundsInfo.height * (0.62 + Math.random() * 0.46)
        ),
        new THREE.MeshBasicMaterial({
          color: palette[i % palette.length],
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      )
      mesh.renderOrder = 4
      group.add(mesh)
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.28
      plumes.push({
        mesh,
        angle,
        radius: boundsInfo.radius * (0.28 + Math.random() * 0.52),
        lift: boundsInfo.height * (0.22 + Math.random() * 0.52),
        drift: (Math.random() - 0.5) * boundsInfo.radius * 0.44,
        yaw: (Math.random() - 0.5) * 0.72
      })
    }

    const groundMist = new THREE.Mesh(
      new THREE.CircleGeometry(boundsInfo.radius * 1.5, 56),
      new THREE.MeshBasicMaterial({
        color: '#dfe9f2',
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    )
    groundMist.rotation.x = -Math.PI / 2
    groundMist.position.y = -boundsInfo.height * 0.48
    group.add(groundMist)

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(boundsInfo.radius * 0.5, boundsInfo.radius * 1.18, 48),
      new THREE.MeshBasicMaterial({
        color: '#f7fbff',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
    halo.rotation.x = -Math.PI / 2
    halo.position.y = -boundsInfo.height * 0.45
    group.add(halo)

    return { group, plumes, groundMist, halo }
  }

  function stopParticleEffectsForRoot(modelRoot) {
    if (!modelRoot || !activeParticleBursts.length) return
    for (let i = activeParticleBursts.length - 1; i >= 0; i--) {
      const burst = activeParticleBursts[i]
      if (burst.modelRoot !== modelRoot) continue
      if (burst.node && burst.node.parent) {
        burst.node.parent.remove(burst.node)
      }
      activeParticleBursts.splice(i, 1)
    }
  }

  async function playEntranceParticleForModel(modelRoot) {
    const path = String(state.layout?.entranceParticle?.path || '').trim()
    if (!modelRoot || !path || !gltfLoader) return
    const loaded = await ensureEntranceParticleAsset(path)
    if (!loaded || !loaded.success || !entranceParticleAsset.scene) return

    const burstNode = entranceParticleAsset.scene.clone(true)
    if (!burstNode) return
    burstNode.position.set(0, 0, 0)
    burstNode.rotation.set(0, 0, 0)
    burstNode.scale.set(1, 1, 1)
    modelRoot.add(burstNode)

    let mixer = null
    let durationMs = 2200
    if (entranceParticleAsset.animations && entranceParticleAsset.animations.length) {
      mixer = new THREE.AnimationMixer(burstNode)
      let maxDuration = 0
      entranceParticleAsset.animations.forEach((clip) => {
        try {
          const action = mixer.clipAction(clip)
          action.reset()
          action.setLoop(THREE.LoopOnce, 1)
          action.clampWhenFinished = true
          action.play()
          if (Number.isFinite(clip.duration)) {
            maxDuration = Math.max(maxDuration, clip.duration)
          }
        } catch { }
      })
      if (maxDuration > 0) durationMs = Math.max(600, maxDuration * 1000)
    }

    activeParticleBursts.push({
      modelRoot,
      node: burstNode,
      mixer,
      startedAt: performance.now(),
      durationMs
    })
  }

  function updateParticleBursts(dt) {
    if (!activeParticleBursts.length) return
    const now = performance.now()
    for (let i = activeParticleBursts.length - 1; i >= 0; i--) {
      const burst = activeParticleBursts[i]
      if (burst.mixer) {
        try { burst.mixer.update(dt) } catch { }
      }
      const finished = (now - burst.startedAt) >= burst.durationMs
      const detached = !burst.node || !burst.node.parent
      if (!finished && !detached) continue
      if (burst.node && burst.node.parent) burst.node.parent.remove(burst.node)
      activeParticleBursts.splice(i, 1)
    }
  }

  function attachDissolveShader(mat, minY, maxY) {
    if (!mat) return
    if (!mat.userData) mat.userData = {}
    const uniforms = {
      uProgress: { value: 0 },
      uMinY: { value: minY },
      uMaxY: { value: Math.max(minY + 0.0001, maxY) },
      uNoiseAmp: { value: 0.1 },
      uEdgeWidth: { value: 0.075 }
    }
    mat.userData.__asgDissolveUniforms = uniforms
    const prevOnBeforeCompile = mat.onBeforeCompile
    const prevCacheKey = mat.customProgramCacheKey ? mat.customProgramCacheKey.bind(mat) : null
    mat.onBeforeCompile = (shader) => {
      if (typeof prevOnBeforeCompile === 'function') prevOnBeforeCompile(shader)
      shader.uniforms.uAsgProgress = uniforms.uProgress
      shader.uniforms.uAsgMinY = uniforms.uMinY
      shader.uniforms.uAsgMaxY = uniforms.uMaxY
      shader.uniforms.uAsgNoiseAmp = uniforms.uNoiseAmp
      shader.uniforms.uAsgEdgeWidth = uniforms.uEdgeWidth

      if (!shader.vertexShader.includes('varying float vAsgWorldY;')) {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `#include <common>
varying float vAsgWorldY;
varying vec3 vAsgWorldPos;`
        )
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
vec4 asgWorldPos = modelMatrix * vec4(transformed, 1.0);
vAsgWorldY = asgWorldPos.y;
vAsgWorldPos = asgWorldPos.xyz;`
        )
      }

      if (!shader.fragmentShader.includes('uniform float uAsgProgress;')) {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `#include <common>
varying float vAsgWorldY;
varying vec3 vAsgWorldPos;
uniform float uAsgProgress;
uniform float uAsgMinY;
uniform float uAsgMaxY;
uniform float uAsgNoiseAmp;
uniform float uAsgEdgeWidth;
float asgHash21(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}`
        )
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <alphatest_fragment>',
          `float asgSpan = max(0.0001, uAsgMaxY - uAsgMinY);
float asgH = clamp((vAsgWorldY - uAsgMinY) / asgSpan, 0.0, 1.0);
float asgN = asgHash21(vAsgWorldPos.xz * 2.8 + vec2(asgH * 3.1, asgH * 1.7));
float asgCut = uAsgProgress + (asgN - 0.5) * uAsgNoiseAmp;
if (asgH > asgCut) discard;
float asgEdge = 1.0 - smoothstep(0.0, uAsgEdgeWidth, abs(asgH - asgCut));
diffuseColor.rgb += vec3(1.0, 0.36, 0.07) * asgEdge * 0.95;
diffuseColor.rgb += vec3(1.0, 0.82, 0.25) * asgEdge * 0.28;
#include <alphatest_fragment>`
        )
      }
      mat.userData.__asgDissolveShader = shader
    }
    mat.customProgramCacheKey = () => {
      const base = prevCacheKey ? prevCacheKey() : ''
      return `${base}|asg-dissolve-v3`
    }
    mat.needsUpdate = true
  }

  function startEntranceEffect(modelRoot) {
    if (!modelRoot) return
    modelRoot.visible = true
    stopEntranceEffectsForRoot(modelRoot)
    const effectType = state.layout?.entranceEffect || 'fade'
    if (effectType !== 'none') {
      void playEntranceParticleForModel(modelRoot)
    }
    if (effectType === 'none') return
    const materialEntries = []
    let fx = null
    let box = null
    const modelTransformBase = {
      position: modelRoot.position.clone(),
      scale: modelRoot.scale.clone(),
      rotation: modelRoot.rotation.clone()
    }

    if (effectType === 'flameDissolve') {
      box = new THREE.Box3().setFromObject(modelRoot)
      if (!Number.isFinite(box.min.y) || !Number.isFinite(box.max.y)) return
      fx = {
        type: effectType,
        modelRoot,
        minY: box.min.y - 0.18,
        maxY: box.max.y + 0.18,
        startedAt: performance.now(),
        durationMs: 2200,
        modelTransformBase
      }
    } else {
      const boundsInfo = getEntranceEffectBounds(modelRoot)
      let transientData = null
      if (effectType === 'cardStorm') {
        transientData = createCardStormTransient(modelRoot, boundsInfo)
      } else if (effectType === 'spotlightRush') {
        transientData = createSpotlightRushTransient(modelRoot, boundsInfo)
      } else if (effectType === 'prismBloom') {
        transientData = createPrismBloomTransient(modelRoot, boundsInfo)
      } else if (effectType === 'mistReveal') {
        transientData = createMistRevealTransient(modelRoot, boundsInfo)
      }
      fx = {
        type: effectType,
        entries: materialEntries,
        modelRoot,
        startedAt: performance.now(),
        durationMs: effectType === 'spotlightRush' ? 1450 : effectType === 'cardStorm' ? 1850 : effectType === 'prismBloom' ? 1700 : effectType === 'mistReveal' ? 2100 : 1500,
        modelTransformBase,
        boundsInfo,
        transientGroup: transientData?.group || null,
        transientData
      }
    }

    modelRoot.traverse((node) => {
      if (!node || !node.isMesh) return
      const originalMaterial = node.material
      const materials = Array.isArray(originalMaterial)
        ? originalMaterial.map((mat) => (mat && typeof mat.clone === 'function' ? mat.clone() : mat))
        : [(originalMaterial && typeof originalMaterial.clone === 'function') ? originalMaterial.clone() : originalMaterial]
      node.material = Array.isArray(originalMaterial) ? materials : materials[0]
      materials.forEach((mat) => {
        if (!mat) return
        if (!mat.userData) mat.userData = {}
        mat.userData.__entranceOriginalOpacity = Number.isFinite(mat.opacity) ? mat.opacity : 1
        mat.userData.__entranceOriginalTransparent = !!mat.transparent
        mat.userData.__entranceOriginalDepthWrite = mat.depthWrite !== false
        if (effectType === 'flameDissolve') {
          mat.transparent = true
          mat.depthWrite = true
          mat.opacity = Number.isFinite(mat.userData.__entranceOriginalOpacity) ? mat.userData.__entranceOriginalOpacity : 1
          attachDissolveShader(mat, fx.minY, fx.maxY)
          if ('emissiveIntensity' in mat && Number.isFinite(mat.emissiveIntensity)) {
            mat.userData.__entranceOriginalEmissiveIntensity = mat.emissiveIntensity
          }
        } else {
          mat.transparent = true
          mat.opacity = 0.01
          mat.depthWrite = mat.userData.__entranceOriginalDepthWrite
        }
        mat.needsUpdate = true
      })
      materialEntries.push({
        node,
        materials,
        originalCastShadow: !!node.castShadow,
        originalReceiveShadow: !!node.receiveShadow
      })
      node.castShadow = false
      node.receiveShadow = false
    })
    if (!materialEntries.length) {
      restoreEntranceTransform(fx)
      if (fx.transientGroup) disposeTransientObject(fx.transientGroup)
      return
    }
    fx.entries = materialEntries
    activeEntranceEffects.push(fx)
  }

  function updateEntranceEffects() {
    if (!activeEntranceEffects.length) return
    const now = performance.now()
    for (let i = activeEntranceEffects.length - 1; i >= 0; i--) {
      const fx = activeEntranceEffects[i]
      const t = Math.max(0, Math.min(1, (now - fx.startedAt) / fx.durationMs))
      const eased = 1 - Math.pow(1 - t, 3)
      if (fx.type === 'flameDissolve') {
        fx.entries.forEach((entry) => {
          entry.materials.forEach((mat) => {
            if (!mat) return
            if (mat.userData?.__asgDissolveUniforms) {
              mat.userData.__asgDissolveUniforms.uProgress.value = eased
            }
          })
        })
      } else {
        const baseScaleValue = getUniformScaleValue(fx.modelTransformBase?.scale || fx.modelRoot.scale)
        const pulse = Math.sin(Math.min(1, t) * Math.PI) * 0.045
        let introScale = 0.86 + eased * 0.14
        let lift = 0
        if (fx.type === 'cardStorm') {
          introScale = 0.8 + eased * 0.2 + pulse * 0.35
          lift = (1 - eased) * (fx.boundsInfo?.height || 1.8) * 0.12
        } else if (fx.type === 'spotlightRush') {
          introScale = 0.74 + eased * 0.26 + pulse * 0.22
          lift = (1 - eased) * (fx.boundsInfo?.height || 1.8) * 0.18
        } else if (fx.type === 'prismBloom') {
          introScale = 0.82 + eased * 0.18 + pulse * 0.28
          lift = (1 - eased) * (fx.boundsInfo?.height || 1.8) * 0.08
        } else if (fx.type === 'mistReveal') {
          introScale = 0.92 + eased * 0.08 + pulse * 0.08
          lift = (1 - eased) * (fx.boundsInfo?.height || 1.8) * 0.06
        }
        if (fx.modelTransformBase) {
          fx.modelRoot.scale.copy(fx.modelTransformBase.scale)
          fx.modelRoot.scale.multiplyScalar(baseScaleValue > 1e-6 ? introScale : 1)
          fx.modelRoot.position.copy(fx.modelTransformBase.position)
          fx.modelRoot.position.y += lift
          fx.modelRoot.rotation.copy(fx.modelTransformBase.rotation)
        }

        if (fx.type === 'cardStorm' && fx.transientData?.cards) {
          fx.transientData.cards.forEach((card) => {
            const localT = THREE.MathUtils.clamp((t - card.offset) / Math.max(0.18, 1 - card.offset * 0.7), 0, 1)
            const softT = localT * localT * (3 - 2 * localT)
            card.mesh.position.lerpVectors(card.start, card.end, softT)
            card.mesh.rotation.x = card.spin.x * localT
            card.mesh.rotation.y = card.spin.y * localT + softT * Math.PI * 1.2
            card.mesh.rotation.z = card.spin.z * localT
            const opacity = Math.sin(localT * Math.PI) * 0.95
            card.mesh.material.opacity = opacity
            const scale = 0.72 + (1 - softT) * 0.6
            card.mesh.scale.setScalar(scale)
          })
          if (fx.transientGroup) {
            fx.transientGroup.rotation.y = (1 - eased) * 0.55
          }
        } else if (fx.type === 'spotlightRush' && fx.transientData) {
          const beamEase = THREE.MathUtils.clamp(t / 0.42, 0, 1)
          const beamFade = 1 - THREE.MathUtils.clamp((t - 0.45) / 0.55, 0, 1)
          if (fx.transientData.beam) {
            fx.transientData.beam.material.opacity = beamEase * beamFade * 0.55
            fx.transientData.beam.scale.setScalar(0.78 + beamEase * 0.45)
          }
          if (fx.transientData.ring) {
            const ringScale = 0.4 + eased * 1.2
            fx.transientData.ring.material.opacity = Math.sin(Math.min(1, t) * Math.PI) * 0.8
            fx.transientData.ring.scale.setScalar(ringScale)
            fx.transientData.ring.rotation.z = eased * 1.8
          }
          if (Array.isArray(fx.transientData.streaks)) {
            fx.transientData.streaks.forEach((streak, index) => {
              const streakWave = Math.sin(t * Math.PI * 2 + index * 0.85)
              streak.material.opacity = beamFade * 0.28 + Math.max(0, streakWave) * 0.08
              streak.scale.x = 0.9 + eased * 0.75
              streak.scale.y = 0.68 + beamEase * 0.42
            })
          }
        } else if (fx.type === 'prismBloom' && fx.transientData) {
          if (Array.isArray(fx.transientData.shards)) {
            fx.transientData.shards.forEach((shard, index) => {
              const shardDelay = index * 0.015
              const localT = THREE.MathUtils.clamp((t - shardDelay) / 0.84, 0, 1)
              const softT = localT * localT * (3 - 2 * localT)
              shard.mesh.position.lerpVectors(shard.start, shard.end, softT)
              shard.mesh.rotation.x = shard.spin.x * localT
              shard.mesh.rotation.y = shard.spin.y * localT
              shard.mesh.rotation.z = shard.spin.z * localT
              shard.mesh.material.opacity = Math.sin(localT * Math.PI) * 0.72
              const scale = 0.8 + Math.sin(localT * Math.PI) * 0.36
              shard.mesh.scale.setScalar(scale)
            })
          }
          if (fx.transientData.ring) {
            fx.transientData.ring.material.opacity = Math.sin(Math.min(1, t) * Math.PI) * 0.65
            fx.transientData.ring.scale.setScalar(0.55 + eased * 1.35)
          }
          if (fx.transientGroup) {
            fx.transientGroup.rotation.y = eased * 0.9
          }
        } else if (fx.type === 'mistReveal' && fx.transientData) {
          const fogRise = THREE.MathUtils.clamp(t / 0.62, 0, 1)
          const fogFade = 1 - THREE.MathUtils.clamp((t - 0.58) / 0.42, 0, 1)
          if (Array.isArray(fx.transientData.plumes)) {
            fx.transientData.plumes.forEach((plume, index) => {
              const wobble = Math.sin(t * Math.PI * 2.4 + index * 0.7) * 0.11
              const spread = 0.22 + fogRise * 1.08
              plume.mesh.position.set(
                Math.cos(plume.angle) * plume.radius * spread + plume.drift * t,
                -((fx.boundsInfo?.height || 1.8) * 0.34) + plume.lift * fogRise,
                Math.sin(plume.angle) * plume.radius * spread
              )
              plume.mesh.rotation.y = plume.angle + Math.PI * 0.5 + plume.yaw + wobble
              plume.mesh.rotation.x = 0.18 + wobble * 0.45
              plume.mesh.scale.setScalar(1.08 + fogRise * 0.72)
              plume.mesh.material.opacity = (0.34 + Math.max(0, Math.sin(t * Math.PI * 1.1 + index * 0.3)) * 0.22) * fogFade
            })
          }
          if (fx.transientData.groundMist) {
            fx.transientData.groundMist.material.opacity = Math.sin(Math.min(1, t) * Math.PI) * 0.5
            fx.transientData.groundMist.scale.setScalar(0.95 + fogRise * 1.02)
          }
          if (fx.transientData.halo) {
            fx.transientData.halo.material.opacity = Math.max(0, Math.sin(t * Math.PI * 1.05)) * 0.24
            fx.transientData.halo.scale.setScalar(0.95 + eased * 1.08)
          }
          if (fx.transientGroup) {
            fx.transientGroup.rotation.y = (1 - eased) * 0.28
          }
        }

        fx.entries.forEach((entry) => {
          entry.materials.forEach((mat) => {
            if (!mat) return
            const baseOpacity = Number.isFinite(mat.userData?.__entranceOriginalOpacity)
              ? mat.userData.__entranceOriginalOpacity
              : 1
            const reveal = fx.type === 'spotlightRush'
              ? THREE.MathUtils.clamp((t - 0.1) / 0.72, 0, 1)
              : fx.type === 'cardStorm'
                ? THREE.MathUtils.clamp((t - 0.06) / 0.68, 0, 1)
                : fx.type === 'prismBloom'
                  ? THREE.MathUtils.clamp((t - 0.04) / 0.7, 0, 1)
                  : fx.type === 'mistReveal'
                    ? THREE.MathUtils.clamp((t - 0.24) / 0.58, 0, 1)
                  : eased
            const revealEase = reveal * reveal * (3 - 2 * reveal)
            mat.opacity = Math.max(0.01, revealEase * baseOpacity)
          })
        })
      }
      if (t >= 1) {
        restoreEntranceTransform(fx)
        if (fx.transientGroup) {
          disposeTransientObject(fx.transientGroup)
          fx.transientGroup = null
        }
        fx.entries.forEach((entry) => {
          if (entry.node && entry.node.isMesh) {
            if (typeof entry.originalCastShadow === 'boolean') {
              entry.node.castShadow = entry.originalCastShadow
            }
            if (typeof entry.originalReceiveShadow === 'boolean') {
              entry.node.receiveShadow = entry.originalReceiveShadow
            }
          }
          entry.materials.forEach((mat) => {
            if (!mat) return
            if (fx.type === 'flameDissolve') {
              if (mat.userData?.__asgDissolveUniforms) {
                mat.userData.__asgDissolveUniforms.uProgress.value = 1
              }
              if ('emissiveIntensity' in mat && Number.isFinite(mat.emissiveIntensity)) {
                mat.emissiveIntensity = Number.isFinite(mat.userData?.__entranceOriginalEmissiveIntensity)
                  ? mat.userData.__entranceOriginalEmissiveIntensity
                  : 1
              }
            } else {
              mat.opacity = Number.isFinite(mat.userData?.__entranceOriginalOpacity)
                ? mat.userData.__entranceOriginalOpacity
                : 1
            }
            mat.transparent = !!mat.userData?.__entranceOriginalTransparent
            mat.depthWrite = mat.userData?.__entranceOriginalDepthWrite !== false
            mat.needsUpdate = true
          })
        })
        activeEntranceEffects.splice(i, 1)
      }
    }
  }

  async function loadVideoScreenForSlot(key, videoPath, resolvedUrl) {
    const runtime = slotRuntime.get(key)
    if (!runtime) return { success: false, error: 'slot-not-found' }
    removeModelFromSlot(key)
    runtime.modelPath = videoPath
    const video = document.createElement('video')
    video.src = resolvedUrl
    video.crossOrigin = 'anonymous'
    video.preload = 'auto'
    video.playsInline = true
    video.autoplay = true
    video.loop = state.layout?.videoScreen?.loop !== false
    video.muted = state.layout?.videoScreen?.muted !== false
    video.defaultMuted = video.muted
    video.volume = video.muted ? 0 : 1
    video.load()

    const ready = await new Promise((resolve) => {
      let done = false
      const finish = (ok, err) => {
        if (done) return
        done = true
        try { video.removeEventListener('loadeddata', onLoaded) } catch { }
        try { video.removeEventListener('error', onError) } catch { }
        clearTimeout(timer)
        resolve({ ok, err })
      }
      const onLoaded = () => finish(true, null)
      const onError = () => {
        const mediaErr = video.error
        const msg = mediaErr ? `视频解码失败(code=${mediaErr.code})` : '视频加载失败'
        finish(false, new Error(msg))
      }
      const timer = setTimeout(() => finish(false, new Error('视频加载超时')), 10000)
      video.addEventListener('loadeddata', onLoaded, { once: true })
      video.addEventListener('error', onError, { once: true })
    })
    if (!ready.ok) {
      try {
        video.pause()
        video.removeAttribute('src')
        video.load()
      } catch { }
      return { success: false, error: ready.err?.message || 'video-load-failed' }
    }

    const texture = new THREE.VideoTexture(video)
    if ('colorSpace' in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace
    else if ('encoding' in texture && THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false

    const w = Math.max(0.1, asNumber(state.layout?.videoScreen?.width, 2.2))
    const h = Math.max(0.1, asNumber(state.layout?.videoScreen?.height, 1.2))
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h, 1, 1),
      new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.45,
        side: THREE.DoubleSide,
        roughness: 0.92,
        metalness: 0.0
      })
    )
    mesh.castShadow = false
    mesh.receiveShadow = true

    runtime.videoElement = video
    runtime.videoTexture = texture
    runtime.model = mesh
    runtime.group.add(mesh)
    applyVideoScreenSettingsToRuntime(runtime)

    try {
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => { })
      }
    } catch { }
    return { success: true }
  }


  async function loadModelForSlot(key, modelPath) {
    const runtime = slotRuntime.get(key)
    if (!runtime) return
    const nextPath = modelPath ? String(modelPath).trim() : ''
    if (!nextPath) {
      removeModelFromSlot(key)
      return { success: true, cleared: true }
    }
    if (runtime.modelPath === nextPath && runtime.model) return
    if (runtime.loadingPath === nextPath) return

    removeModelFromSlot(key)
    runtime.modelPath = nextPath
    runtime.loadingPath = nextPath
    runtime.loadSeq = (runtime.loadSeq || 0) + 1
    const seq = runtime.loadSeq
    const url = normalizeFileUrl(nextPath)
    if (!url) return { success: false, error: 'invalid-url' }
    const ext = getPathExt(nextPath)
    if (runtime.cfg?.roleType === 'video' || isVideoExt(ext)) {
      const result = await loadVideoScreenForSlot(key, nextPath, url)
      runtime.loadingPath = ''
      if (result && result.success) {
        setStatus(`加载完成: ${runtime.cfg.label}`)
      } else {
        setStatus(`加载失败: ${runtime.cfg.label}`)
        showModelLoadErrorDialog({
          slot: key,
          slotLabel: runtime?.cfg?.label || key,
          modelPath: modelPath || '',
          resolvedUrl: url || '',
          ext: ext || '',
          errorMessage: result?.error || '视频加载失败'
        })
      }
      return result
    }

    const shortPath = String(modelPath).split(/[\\/]/).slice(-2).join('/')
    setStatus(`加载模型: ${runtime.cfg.label} (${shortPath})`)
    const onLoadedObject = (obj, animations = []) => {
      if (runtime.loadSeq !== seq) {
        try { if (obj) disposeObject(obj) } catch { }
        return { success: false, stale: true }
      }
      if (!obj) {
        runtime.loadingPath = ''
        setStatus(`模型无效: ${runtime.cfg.label}`)
        return { success: false, error: 'invalid-object' }
      }
      // 再次清空，保证同槽位始终只保留 1 个实例
      removeModelFromSlot(key)
      runtime.modelPath = nextPath
      runtime.model = obj
      prepareModelForShadows(obj, runtime.cfg?.roleType || '')
      applyStylizedToObject(obj, runtime.cfg?.roleType || '')
      runtime.group.add(obj)
      updateBlobShadowForSlot(key)
      if (runtime.cfg?.roleType === 'survivor') {
        const roleName = state.slotDisplayNames[key] || ''
        console.warn('[CharacterModel3D][ModelLoad] survivor loaded', buildSurvivorScaleDebug(runtime, roleName, {
          phase: 'loaded'
        }))
      }
      if (runtime.cfg?.roleType === 'survivor') {
        refreshPuppeteerModelScaleFix()
      }
      if (Array.isArray(animations) && animations.length) {
        const mixer = new THREE.AnimationMixer(obj)
        animations.forEach((clip) => {
          try { mixer.clipAction(clip).play() } catch { }
        })
        mixers.set(key, mixer)
      }
      if (runtime.cfg && (runtime.cfg.roleType === 'survivor' || runtime.cfg.roleType === 'hunter')) {
        enqueueEntranceEffect(obj)
      }
      runtime.loadingPath = ''
      setStatus(`加载完成: ${runtime.cfg.label}`)
      return { success: true }
    }
    const onError = (error) => {
      if (runtime.loadSeq !== seq) return
      runtime.loadingPath = ''
      setStatus(`加载失败: ${runtime.cfg.label}`)
      const detail = {
        slot: key,
        slotLabel: runtime?.cfg?.label || key,
        modelPath: modelPath || '',
        resolvedUrl: url || '',
        ext: ext || '',
        errorMessage: (error && (error.message || error.type || error.target?.statusText)) || String(error),
        errorStack: error && error.stack ? error.stack : '',
        rawError: error
      }
      console.error('[CharacterModel3D] 模型加载失败(详细):', detail)
      showModelLoadErrorDialog(detail)
    }

    return await new Promise((resolve) => {
      const doneLoaded = (obj, animations = []) => resolve(onLoadedObject(obj, animations))
      const doneError = (err) => {
        onError(err)
        resolve({ success: false, error: err?.message || String(err) })
      }

      if (ext === '.obj') {
        loadObjModelWithOptionalMtl(url, (obj) => doneLoaded(obj, []), doneError)
        return
      }

      ; (async () => {
        const handledByIpc = await tryLoadGltfViaIpc(nextPath, doneLoaded, doneError)
        if (handledByIpc) return
        gltfLoader.load(url, (gltf) => {
          const obj = gltf && gltf.scene ? gltf.scene : null
          doneLoaded(obj, (gltf && Array.isArray(gltf.animations)) ? gltf.animations : [])
        }, undefined, doneError)
      })()
    })
  }

  function sanitizeRoleName(name) {
    if (!name || typeof name !== 'string') return ''
    return name.replace(/["'“”‘’]/g, '').trim()
  }

  async function findOfficialModel(roleName) {
    if (!roleName) return ''
    const clean = sanitizeRoleName(roleName)
    const cacheKey = clean || roleName
    if (Object.prototype.hasOwnProperty.call(state.roleModelPathCache, cacheKey) && state.roleModelPathCache[cacheKey]) {
      const cached = String(state.roleModelPathCache[cacheKey] || '').trim()
      // 仅直接复用本地路径；旧 http 缓存会继续走本地解析以避免拉取失败
      if (cached && !/^https?:\/\//i.test(cached)) return cached
    }

    // 1) 强制优先从本机 official-models 目录解析
    try {
      if (window.electronAPI && window.electronAPI.invoke) {
        const res = await window.electronAPI.invoke('localBp:getOfficialModelLocalPath', roleName)
        const localPath = (res && res.success && typeof res.path === 'string') ? res.path.trim() : ''
        const httpUrl = (res && res.success && typeof res.httpUrl === 'string') ? res.httpUrl.trim() : ''
        // 始终优先本地绝对路径，避免依赖本地 HTTP 服务监听地址
        const resolved = localPath || httpUrl
        if (resolved) {
          state.roleModelPathCache[cacheKey] = resolved
          return resolved
        }
      }
    } catch (error) {
      console.warn('[CharacterModel3D] 获取本地官方模型失败:', roleName, error)
    }

    // 2) 不回落到远程 URL，避免网络导致加载不稳定
    return ''
  }

  async function updateRoleModelsByBp() {
    const survivors = Array.isArray(state.bp.survivors) ? state.bp.survivors : [null, null, null, null]
    const survivorModelPromises = []
    for (let i = 0; i < 4; i++) {
      const roleName = survivors[i] || ''
      survivorModelPromises.push(findOfficialModel(roleName))
    }
    const survivorModels = await Promise.all(survivorModelPromises)
    for (let i = 0; i < 4; i++) {
      const roleName = survivors[i] || ''
      const slotKey = `survivor${i + 1}`
      state.slotDisplayNames[slotKey] = roleName || ''
      applyTransformToGroup(slotKey, state.layout.slots[slotKey])
      const modelPath = survivorModels[i] || ''
      state.slotModelPaths[slotKey] = modelPath || ''
      if (roleName && !modelPath) {
        setStatus(`未命中本地模型: ${slotKey} -> ${roleName}`)
      }
      await loadModelForSlot(slotKey, modelPath)
      await new Promise((r) => setTimeout(r, 0))
    }
    const hunterName = state.bp.hunter || ''
    state.slotDisplayNames.hunter = hunterName || ''
    applyTransformToGroup('hunter', state.layout.slots.hunter)
    const hunterModel = await findOfficialModel(hunterName)
    state.slotModelPaths.hunter = hunterModel || ''
    if (hunterName && !hunterModel) {
      setStatus(`未命中本地模型: hunter -> ${hunterName}`)
    }
    await loadModelForSlot('hunter', hunterModel)
    renderSlotTabs()
    syncRoleScaleModal(false)
  }

  async function runBpRoleSyncLoop() {
    if (bpRoleSyncRunning) {
      bpRoleSyncPending = true
      return
    }
    bpRoleSyncRunning = true
    try {
      do {
        bpRoleSyncPending = false
        await updateRoleModelsByBp()
      } while (bpRoleSyncPending)
    } finally {
      bpRoleSyncRunning = false
      flushPendingCameraEvent()
    }
  }

  function snapshotTransformFromGroup(key) {
    const runtime = slotRuntime.get(key)
    if (!runtime || !runtime.group) return
    const g = runtime.group
    const baseRotation = runtime.weatherBaseRotation || { x: g.rotation.x, y: g.rotation.y, z: g.rotation.z }
    if (key === 'scene') {
      state.layout.scene.position = { x: g.position.x, y: g.position.y, z: g.position.z }
      state.layout.scene.rotation = { x: toDegrees(g.rotation.x), y: toDegrees(g.rotation.y), z: toDegrees(g.rotation.z) }
      state.layout.scene.scale = { x: g.scale.x, y: g.scale.y, z: g.scale.z }
      return
    }
    if (!state.layout.slots[key]) state.layout.slots[key] = {}
    const effectiveUniform = Math.max(0.001, asNumber(g.scale.x, 1))
    const uniform = isRoleSlotKey(key)
      ? Math.max(0.001, effectiveUniform / Math.max(0.001, getRoleScaleMultiplierForSlot(key)))
      : effectiveUniform
    if (key.startsWith('survivor')) {
      state.layout.survivorScale = uniform
      for (let i = 1; i <= 4; i++) {
        const slotKey = `survivor${i}`
        if (!state.layout.slots[slotKey]) state.layout.slots[slotKey] = {}
        state.layout.slots[slotKey].scale = { x: uniform, y: uniform, z: uniform }
        if (slotKey !== key) applyTransformToGroup(slotKey, state.layout.slots[slotKey])
      }
    } else if (key === 'hunter') {
      state.layout.hunterScale = uniform
    }
    state.layout.slots[key].position = { x: g.position.x, y: g.position.y, z: g.position.z }
    state.layout.slots[key].rotation = { x: toDegrees(baseRotation.x), y: toDegrees(baseRotation.y), z: toDegrees(baseRotation.z) }
    state.layout.slots[key].scale = { x: uniform, y: uniform, z: uniform }
  }

  function getSelectedTransform() {
    if (state.selectedSlot === 'scene') {
      return state.layout.scene
    }
    return state.layout.slots[state.selectedSlot]
  }

  function buildFocusFrameForSlot(slotKey) {
    const runtime = slotRuntime.get(slotKey)
    if (!runtime || !runtime.group) return null
    const target = new THREE.Vector3()
    runtime.group.getWorldPosition(target)
    let boundsRadius = 0.55

    if (runtime.model) {
      const box = new THREE.Box3().setFromObject(runtime.model)
      if (Number.isFinite(box.min.x) && Number.isFinite(box.max.x)) {
        const sphere = box.getBoundingSphere(new THREE.Sphere())
        if (sphere && Number.isFinite(sphere.radius) && sphere.radius > 0) {
          target.copy(sphere.center)
          boundsRadius = Math.max(0.25, sphere.radius)
        }
      }
    }

    if (runtime.cfg?.roleType === 'scene') boundsRadius = Math.max(boundsRadius, 3.2)
    if (runtime.cfg?.roleType === 'light') boundsRadius = Math.max(boundsRadius, 0.45)
    if (runtime.cfg?.roleType === 'video' || runtime.cfg?.roleType === 'camera') boundsRadius = Math.max(boundsRadius, 0.9)

    const vfov = THREE.MathUtils.degToRad(Math.max(20, Math.min(120, asNumber(camera?.fov, 45))))
    const aspect = Math.max(0.1, asNumber(camera?.aspect, 16 / 9))
    const hfov = 2 * Math.atan(Math.tan(vfov * 0.5) * aspect)
    const effectiveFov = Math.max(0.14, Math.min(vfov, hfov))
    let focusRadius = (boundsRadius / Math.sin(effectiveFov * 0.5)) * 1.18
    focusRadius = Math.max(1.8, Math.min(220, focusRadius))

    if (runtime.cfg?.roleType === 'light') focusRadius = Math.max(2.2, Math.min(5.5, focusRadius))
    if (runtime.cfg?.roleType === 'video' || runtime.cfg?.roleType === 'camera') focusRadius = Math.max(2.8, Math.min(9.5, focusRadius))

    const cosPitch = Math.cos(orbit.pitch)
    const position = {
      x: target.x + focusRadius * Math.sin(orbit.yaw) * cosPitch,
      y: target.y + focusRadius * Math.sin(orbit.pitch),
      z: target.z + focusRadius * Math.cos(orbit.yaw) * cosPitch
    }
    return {
      position,
      target: { x: target.x, y: target.y, z: target.z }
    }
  }

  function focusCameraOnSelectedSlot() {
    const slotKey = state.selectedSlot || 'survivor1'
    const frame = buildFocusFrameForSlot(slotKey)
    if (!frame) {
      setStatus('当前组件无法对焦')
      return
    }
    const label = SLOT_CONFIGS.find(item => item.key === slotKey)?.label || slotKey
    startCameraTransition(frame, 420, `对焦 ${label}`)
  }

  function getRoleScaleEntries() {
    const map = new Map()
    SLOT_CONFIGS.forEach((cfg) => {
      if (cfg.roleType !== 'survivor' && cfg.roleType !== 'hunter') return
      const roleName = getRoleNameForSlot(cfg.key)
      if (!roleName) return
      const existing = map.get(roleName)
      if (existing) {
        existing.slots.push(cfg.key)
        existing.slotLabels.push(cfg.label)
        return
      }
      map.set(roleName, {
        roleName,
        slots: [cfg.key],
        slotLabels: [cfg.label]
      })
    })
    return Array.from(map.values())
  }

  function getPreferredRoleScaleEntry(entries) {
    const list = Array.isArray(entries) ? entries : []
    if (!list.length) return null
    const currentValue = sanitizeRoleName(dom.roleScaleRoleSelect?.value || '')
    if (currentValue) {
      const matchByCurrent = list.find(entry => entry.roleName === currentValue)
      if (matchByCurrent) return matchByCurrent
    }
    const selectedRoleName = getRoleNameForSlot(state.selectedSlot)
    if (selectedRoleName) {
      const matchBySlot = list.find(entry => entry.roleName === selectedRoleName)
      if (matchBySlot) return matchBySlot
    }
    return list[0]
  }

  function getPrimarySlotForRoleScaleEntry(entry) {
    if (!entry || !Array.isArray(entry.slots) || !entry.slots.length) return ''
    if (entry.slots.includes(state.selectedSlot)) return state.selectedSlot
    return entry.slots[0]
  }

  function isRoleScaleModalOpen() {
    return !!dom.roleScaleModal?.classList.contains('open')
  }

  function syncRoleScaleModal(preferSelectedSlot = false) {
    if (!dom.roleScaleRoleSelect || !dom.roleScaleModalEmpty || !dom.roleScaleModalFields) return
    const entries = getRoleScaleEntries()
    const selectedRoleName = preferSelectedSlot ? getRoleNameForSlot(state.selectedSlot) : ''
    const preferred = selectedRoleName
      ? entries.find(entry => entry.roleName === selectedRoleName) || getPreferredRoleScaleEntry(entries)
      : getPreferredRoleScaleEntry(entries)

    dom.roleScaleRoleSelect.innerHTML = entries.map((entry) => {
      const selected = preferred && preferred.roleName === entry.roleName ? ' selected' : ''
      return `<option value="${entry.roleName}"${selected}>${entry.roleName} (${entry.slotLabels.join(' / ')})</option>`
    }).join('')

    const activeEntry = preferred || null
    const hasEntry = !!activeEntry
    dom.roleScaleRoleSelect.disabled = !hasEntry
    dom.roleScaleModalEmpty.style.display = hasEntry ? 'none' : 'block'
    dom.roleScaleModalFields.style.display = hasEntry ? 'block' : 'none'
    if (dom.applyRoleScaleBtn) dom.applyRoleScaleBtn.disabled = !hasEntry
    if (dom.resetRoleScaleBtn) dom.resetRoleScaleBtn.disabled = !hasEntry

    if (!hasEntry) {
      if (dom.roleScaleValue) dom.roleScaleValue.value = '1.000'
      if (dom.roleScaleBaseValue) dom.roleScaleBaseValue.value = '0.000'
      if (dom.roleScaleEffectiveValue) dom.roleScaleEffectiveValue.value = '0.000'
      if (dom.roleScaleRoleInfo) dom.roleScaleRoleInfo.textContent = ''
      return
    }

    const primarySlot = getPrimarySlotForRoleScaleEntry(activeEntry)
    const baseScale = Math.max(0.001, asNumber(state.layout?.slots?.[primarySlot]?.scale?.x,
      primarySlot === 'hunter' ? state.layout?.hunterScale : state.layout?.survivorScale))
    const roleScale = getRoleScaleOverride(activeEntry.roleName)
    const effectiveScale = baseScale * roleScale
    if (dom.roleScaleValue) dom.roleScaleValue.value = roleScale.toFixed(3)
    if (dom.roleScaleBaseValue) dom.roleScaleBaseValue.value = baseScale.toFixed(3)
    if (dom.roleScaleEffectiveValue) dom.roleScaleEffectiveValue.value = effectiveScale.toFixed(3)
    if (dom.roleScaleRoleInfo) {
      const path = state.slotModelPaths?.[primarySlot] || '未找到本地模型路径'
      dom.roleScaleRoleInfo.textContent = [
        `影响角色: ${activeEntry.roleName}`,
        `影响槽位: ${activeEntry.slotLabels.join(' / ')}`,
        `参考槽位: ${SLOT_CONFIGS.find(item => item.key === primarySlot)?.label || primarySlot}`,
        `模型路径: ${path}`
      ].join('\n')
    }
  }

  function openRoleScaleModal() {
    syncRoleScaleModal(true)
    if (!dom.roleScaleModal) return
    dom.roleScaleModal.classList.add('open')
    dom.roleScaleModal.setAttribute('aria-hidden', 'false')
    if (dom.roleScaleValue && dom.roleScaleModalFields?.style.display !== 'none') {
      window.setTimeout(() => {
        try { dom.roleScaleValue.focus() } catch { }
      }, 0)
    }
  }

  function closeRoleScaleModal() {
    if (!dom.roleScaleModal) return
    dom.roleScaleModal.classList.remove('open')
    dom.roleScaleModal.setAttribute('aria-hidden', 'true')
  }

  function closeAnyOpenModal() {
    closeRoleScaleModal()
    closeCameraCurveModal()
  }

  function applyRoleScaleOverrideToRole(roleName) {
    const normalized = sanitizeRoleName(roleName)
    if (!normalized) return
    SLOT_CONFIGS.forEach((cfg) => {
      if (!isRoleSlotKey(cfg.key)) return
      if (getRoleNameForSlot(cfg.key) !== normalized) return
      applyTransformToGroup(cfg.key, state.layout.slots[cfg.key])
    })
    updateKeyLightShadowFrustum()
  }

  function applyRoleScaleFromModal() {
    const roleName = sanitizeRoleName(dom.roleScaleRoleSelect?.value || '')
    if (!roleName) {
      setStatus('当前没有可设置的角色')
      return
    }
    const nextScale = Math.max(0.001, asNumber(dom.roleScaleValue?.value, 1))
    if (!state.layout.roleScaleOverrides || typeof state.layout.roleScaleOverrides !== 'object') {
      state.layout.roleScaleOverrides = {}
    }
    if (Math.abs(nextScale - 1) < 1e-6) {
      delete state.layout.roleScaleOverrides[roleName]
    } else {
      state.layout.roleScaleOverrides[roleName] = nextScale
    }
    applyRoleScaleOverrideToRole(roleName)
    syncTransformInputs()
    syncRoleScaleModal(false)
    scheduleSaveLayout()
    setStatus(`已更新角色专属缩放: ${roleName} × ${nextScale.toFixed(3)}`)
  }

  function resetRoleScaleFromModal() {
    const roleName = sanitizeRoleName(dom.roleScaleRoleSelect?.value || '')
    if (!roleName) {
      setStatus('当前没有可重置的角色')
      return
    }
    if (state.layout.roleScaleOverrides && typeof state.layout.roleScaleOverrides === 'object') {
      delete state.layout.roleScaleOverrides[roleName]
    }
    applyRoleScaleOverrideToRole(roleName)
    syncTransformInputs()
    syncRoleScaleModal(false)
    scheduleSaveLayout()
    setStatus(`已清除角色专属缩放: ${roleName}`)
  }

  function syncTransformInputs() {
    const tr = getSelectedTransform()
    if (!tr) return
    dom.posX.value = asNumber(tr.position?.x, 0).toFixed(3)
    dom.posY.value = asNumber(tr.position?.y, 0).toFixed(3)
    dom.posZ.value = asNumber(tr.position?.z, 0).toFixed(3)
    dom.rotX.value = asNumber(tr.rotation?.x, 0).toFixed(1)
    dom.rotY.value = asNumber(tr.rotation?.y, 0).toFixed(1)
    dom.rotZ.value = asNumber(tr.rotation?.z, 0).toFixed(1)
    if (state.selectedSlot === 'light1') {
      dom.uniScale.value = '1.000'
      dom.uniScale.disabled = true
    } else {
      dom.uniScale.disabled = false
      if (state.selectedSlot.startsWith('survivor')) {
        dom.uniScale.value = asNumber(state.layout?.survivorScale, asNumber(tr.scale?.x, 1)).toFixed(3)
      } else if (state.selectedSlot === 'hunter') {
        dom.uniScale.value = asNumber(state.layout?.hunterScale, asNumber(tr.scale?.x, 1)).toFixed(3)
      } else {
        dom.uniScale.value = asNumber(tr.scale?.x, 1).toFixed(3)
      }
    }
  }

  function applyInputsToSelectedTransform() {
    const uniformScale = Math.max(0.001, asNumber(dom.uniScale.value, 1))
    const tr = {
      position: {
        x: asNumber(dom.posX.value, 0),
        y: asNumber(dom.posY.value, 0),
        z: asNumber(dom.posZ.value, 0)
      },
      rotation: {
        x: asNumber(dom.rotX.value, 0),
        y: asNumber(dom.rotY.value, 0),
        z: asNumber(dom.rotZ.value, 0)
      },
      scale: {
        x: uniformScale,
        y: uniformScale,
        z: uniformScale
      }
    }
    if (state.selectedSlot === 'light1') {
      tr.scale = { x: 1, y: 1, z: 1 }
    }
    if (state.selectedSlot === 'scene') {
      state.layout.scene = { ...state.layout.scene, ...tr }
    } else if (state.selectedSlot.startsWith('survivor')) {
      state.layout.survivorScale = uniformScale
      for (let i = 1; i <= 4; i++) {
        const slotKey = `survivor${i}`
        const prev = state.layout.slots[slotKey] || {}
        const slotTr = {
          ...prev,
          scale: { x: uniformScale, y: uniformScale, z: uniformScale }
        }
        if (slotKey === state.selectedSlot) {
          slotTr.position = tr.position
          slotTr.rotation = tr.rotation
        }
        state.layout.slots[slotKey] = slotTr
        applyTransformToGroup(slotKey, slotTr)
      }
      if (isRoleScaleModalOpen()) syncRoleScaleModal(false)
      scheduleSaveLayout()
      return
    } else if (state.selectedSlot === 'hunter') {
      state.layout.hunterScale = uniformScale
      state.layout.slots.hunter = { ...state.layout.slots.hunter, ...tr, scale: { x: uniformScale, y: uniformScale, z: uniformScale } }
    } else {
      state.layout.slots[state.selectedSlot] = { ...state.layout.slots[state.selectedSlot], ...tr }
    }
    applyTransformToGroup(state.selectedSlot, tr)
    if (state.selectedSlot === 'camera1' && state.virtualCameraMode?.enabled) {
      refreshVirtualCameraStageFrame(220, '更新虚拟摄像机位置')
    }
    if (isRoleScaleModalOpen()) syncRoleScaleModal(false)
    scheduleSaveLayout()
  }

  function renderSlotTabs() {
    const html = SLOT_CONFIGS.map((cfg) => {
      let tail = ''
      if (cfg.roleType === 'survivor' || cfg.roleType === 'hunter') {
        const name = state.slotDisplayNames[cfg.key]
        tail = name ? ` · ${name}` : ''
      }
      const active = cfg.key === state.selectedSlot ? 'active' : ''
      return `<button class="slot-tab ${active}" data-slot="${cfg.key}">${cfg.label}${tail}</button>`
    }).join('')
    dom.slotTabs.innerHTML = html
    dom.slotTabs.querySelectorAll('.slot-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedSlot = btn.dataset.slot || 'survivor1'
        renderSlotTabs()
        syncTransformInputs()
        if (isRoleScaleModalOpen()) syncRoleScaleModal(true)
      })
    })
  }

  function applyLayoutToScene() {
    applyTransformToGroup('scene', state.layout.scene)
    for (const cfg of SLOT_CONFIGS) {
      if (cfg.key === 'scene') continue
      applyTransformToGroup(cfg.key, state.layout.slots[cfg.key])
    }
    applyLightSettings('light1')
    applyEnvironmentPreset(state.layout.environmentPreset, false)
    applyRenderQualityPreset(state.layout.qualityPreset || 'high', false)
    applyWeatherPreset(state.layout.weatherPreset || 'clear', false)
    updateKeyLightShadowFrustum()
    applyMode(state.layout.mode, false)
    applyToolbarCollapsed(state.layout.toolbarCollapsed, false)
    applyAdvancedRenderSettings(false, false)
    applyOrbitFromLayout()
    renderSlotTabs()
    syncTransformInputs()
    syncRoleScaleModal(false)
    syncLightInputs()
    syncVideoInputs()
    syncCameraInputs()
    syncCameraEditorInputs()
    syncEntranceParticleUi()
    syncWeatherInputs()
    syncStylizedRenderInputs()
    syncAdvancedRenderInputs()
    if (dom.maxFps) dom.maxFps.value = String(Math.max(10, Math.min(240, asNumber(state.layout.maxFps, 60))))
  }

  function applyMode(mode, shouldSave = true) {
    const next = mode === 'render' ? 'render' : 'edit'
    state.layout.mode = next
    document.body.classList.toggle('render-mode', next === 'render')
    document.body.classList.toggle('edit-mode', next === 'edit')
    if (next !== 'edit') closeAnyOpenModal()
    if (grid) grid.visible = next === 'edit'
    if (axes) axes.visible = next === 'edit'
    if (dom.modeToggleBtn) {
      dom.modeToggleBtn.textContent = next === 'edit' ? '切换到渲染模式 (F2)' : '切换到编辑模式 (F2)'
    }
    if (shouldSave) scheduleSaveLayout()
  }

  function applyToolbarCollapsed(collapsed, shouldSave = true) {
    const next = !!collapsed
    state.layout.toolbarCollapsed = next
    if (dom.toolbar) dom.toolbar.classList.toggle('collapsed', next)
    if (dom.toolbarCollapseBtn) {
      dom.toolbarCollapseBtn.textContent = next ? '展开面板' : '收起面板'
      dom.toolbarCollapseBtn.setAttribute('aria-expanded', next ? 'false' : 'true')
    }
    if (shouldSave) scheduleSaveLayout()
  }

  function collectPersistLayout() {
    return deepClone(state.layout)
  }

  function scheduleSaveLayout() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(async () => {
      const payload = collectPersistLayout()
      try {
        if (window.electronAPI && window.electronAPI.invoke) {
          await window.electronAPI.invoke('localBp:saveCharacterModel3DLayout', payload)
        }
      } catch (error) {
        console.error('[CharacterModel3D] 保存布局失败:', error)
      }
    }, 160)
  }

  async function importAssetForPack(sourcePath, copyMode = 'auto') {
    const raw = String(sourcePath || '').trim()
    if (!raw) return ''
    if (!window.electronAPI || typeof window.electronAPI.importBundledAsset !== 'function') return raw
    try {
      const res = await window.electronAPI.importBundledAsset(raw, { copyMode })
      if (res && res.success && typeof res.path === 'string' && res.path.trim()) {
        if (res.copied) {
          const modeText = res.mode === 'folder' ? '文件夹模式' : '单文件模式'
          setStatus(`已归档模型资源 (${modeText})`)
        }
        return res.path.trim()
      }
    } catch (error) {
      console.warn('[CharacterModel3D] 归档模型资源失败，继续使用原路径:', error)
    }
    return raw
  }

  async function importSceneModel() {
    let selectedPath = ''
    try {
      if (window.electronAPI && window.electronAPI.selectFileWithFilter) {
        const result = await window.electronAPI.selectFileWithFilter({
          filters: [{ name: '3D场景', extensions: ['gltf', 'glb', 'obj'] }]
        })
        if (result && result.success && result.path) {
          selectedPath = result.path
        }
      }
    } catch (error) {
      console.error('[CharacterModel3D] 选择场景文件失败:', error)
    }
    if (!selectedPath) {
      const input = window.prompt('请输入场景模型路径(URL 或本地路径):', state.layout.scene.modelPath || '')
      if (!input) return
      selectedPath = input.trim()
    }
    if (!selectedPath) return
    selectedPath = await importAssetForPack(selectedPath, 'auto')
    state.layout.scene.modelPath = selectedPath
    await loadModelForSlot('scene', selectedPath)
    scheduleSaveLayout()
  }

  function syncVideoInputs() {
    const cfg = state.layout?.videoScreen || DEFAULT_LAYOUT.videoScreen
    if (dom.videoLoopEnabled) dom.videoLoopEnabled.checked = cfg.loop !== false
    if (dom.videoMuted) dom.videoMuted.checked = cfg.muted !== false
    if (dom.videoWidth) dom.videoWidth.value = String(Math.max(0.1, asNumber(cfg.width, 2.2)).toFixed(2))
    if (dom.videoHeight) dom.videoHeight.value = String(Math.max(0.1, asNumber(cfg.height, 1.2)).toFixed(2))
  }

  function setCameraStatus(text) {
    if (dom.cameraStatus) dom.cameraStatus.textContent = text || ''
  }

  function setVirtualCameraModeStatus(text) {
    if (dom.virtualCameraModeStatus) dom.virtualCameraModeStatus.textContent = text || ''
  }

  function isCameraScreenRunning() {
    const runtime = slotRuntime.get('camera1')
    return !!(runtime && runtime.mediaStream && runtime.model)
  }

  function buildVirtualCameraStageFrame() {
    const runtime = slotRuntime.get('camera1')
    if (!runtime || !runtime.group || !runtime.model || !THREE || !camera) return null

    const anchor = runtime.model || runtime.group
    const target = new THREE.Vector3()
    anchor.getWorldPosition(target)

    const worldQuat = new THREE.Quaternion()
    anchor.getWorldQuaternion(worldQuat)

    const worldScale = new THREE.Vector3(1, 1, 1)
    anchor.getWorldScale(worldScale)

    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuat).normalize()
    if (!Number.isFinite(normal.x) || !Number.isFinite(normal.y) || !Number.isFinite(normal.z) || normal.lengthSq() < 1e-6) {
      normal.copy(camera.position).sub(target).normalize()
    }

    const cfg = state.layout?.cameraScreen || DEFAULT_LAYOUT.cameraScreen
    const screenWidth = Math.max(0.1, asNumber(cfg.width, 2.2) * Math.max(0.001, Math.abs(worldScale.x)))
    const screenHeight = Math.max(0.1, asNumber(cfg.height, 1.2) * Math.max(0.001, Math.abs(worldScale.y)))
    const fov = VIRTUAL_CAMERA_STAGE_FOV
    const aspect = getViewportAspect()
    const vFovRad = THREE.MathUtils.degToRad(fov)
    const hFovRad = 2 * Math.atan(Math.tan(vFovRad * 0.5) * aspect)
    const fitDistanceByWidth = (screenWidth * 0.5) / Math.max(0.001, Math.tan(hFovRad * 0.5))
    const fitDistanceByHeight = (screenHeight * 0.5) / Math.max(0.001, Math.tan(vFovRad * 0.5))
    const distance = Math.max(0.8, Math.max(fitDistanceByWidth, fitDistanceByHeight))

    const positionA = target.clone().addScaledVector(normal, distance)
    const positionB = target.clone().addScaledVector(normal, -distance)
    const position = positionA.distanceTo(camera.position) <= positionB.distanceTo(camera.position)
      ? positionA
      : positionB

    return {
      position: { x: position.x, y: position.y, z: position.z },
      target: { x: target.x, y: target.y, z: target.z },
      fov
    }
  }

  function syncVirtualCameraModeUi() {
    const enabled = !!state.virtualCameraMode?.enabled
    if (dom.virtualCameraModeToggleBtn) {
      dom.virtualCameraModeToggleBtn.textContent = enabled ? '关闭虚拟摄像机主镜头 (F6)' : '启用虚拟摄像机主镜头 (F6)'
      dom.virtualCameraModeToggleBtn.classList.toggle('active-mode', enabled)
    }
    setVirtualCameraModeStatus(enabled ? '演播模式: 已开启（近2D正视）' : '演播模式: 关闭')
  }

  function restoreCameraFromVirtualMode() {
    const vm = state.virtualCameraMode
    if (!vm) return
    if (Number.isFinite(vm.savedTransitionMs)) {
      state.layout.cameraTransitionMs = Math.max(50, Math.min(10000, vm.savedTransitionMs))
      if (dom.cameraTransitionMs) dom.cameraTransitionMs.value = String(state.layout.cameraTransitionMs)
    }
    if (vm.savedFrame) {
      startCameraTransition(vm.savedFrame, 540, '退出演播模式')
    }
    vm.savedFrame = null
    vm.savedTransitionMs = null
  }

  function refreshVirtualCameraStageFrame(durationMs = 260, reason = '更新虚拟摄像机机位') {
    if (!state.virtualCameraMode?.enabled) return
    const frame = buildVirtualCameraStageFrame()
    if (!frame) return
    startCameraTransition(frame, durationMs, reason)
  }

  function syncCameraProjectionToMode() {
    if (!camera) return
    camera.aspect = clampCameraAspect(getViewportAspect(), getViewportAspect())
    camera.updateProjectionMatrix()
  }

  function exitVirtualCameraModeForAutoCut(reason = '') {
    if (!state.virtualCameraMode?.enabled) return
    state.virtualCameraMode.enabled = false
    if (state.virtualCameraMode) {
      state.virtualCameraMode.savedFrame = null
      state.virtualCameraMode.savedTransitionMs = null
    }
    syncCameraProjectionToMode()
    syncVirtualCameraModeUi()
    scheduleSaveLayout()
    if (reason) setStatus(reason)
  }

  function enableVirtualCameraMode() {
    if (!isCameraScreenRunning()) {
      setCameraStatus('摄像头: 请先启动摄像头后再启用演播模式')
      return
    }
    const frame = buildVirtualCameraStageFrame()
    if (!frame) {
      setCameraStatus('摄像头: 无法定位摄像头屏幕位置')
      return
    }
    if (!state.virtualCameraMode) {
      state.virtualCameraMode = {
        enabled: false,
        savedFrame: null,
        savedTransitionMs: null
      }
    }
    const vm = state.virtualCameraMode
    if (!vm.enabled) {
      vm.savedFrame = captureCurrentCameraFrame()
      vm.savedTransitionMs = state.layout.cameraTransitionMs
    }

    vm.enabled = true
    startCameraTransition(frame, 760, '虚拟摄像机演播模式')
    setStatus('演播模式已开启：主镜头切到虚拟摄像机，当前构图为近2D正视')
    syncVirtualCameraModeUi()
    scheduleSaveLayout()
  }

  function disableVirtualCameraMode() {
    if (!state.virtualCameraMode?.enabled) {
      syncVirtualCameraModeUi()
      return
    }
    state.virtualCameraMode.enabled = false
    restoreCameraFromVirtualMode()
    syncVirtualCameraModeUi()
    setStatus('演播模式已关闭')
    scheduleSaveLayout()
  }

  function toggleVirtualCameraMode() {
    if (state.virtualCameraMode?.enabled) {
      disableVirtualCameraMode()
    } else {
      enableVirtualCameraMode()
    }
  }

  function updateCameraScreenGeometry(runtime) {
    if (!runtime || !runtime.model || !runtime.model.isMesh) return
    const w = Math.max(0.1, asNumber(state.layout?.cameraScreen?.width, 2.2))
    const h = Math.max(0.1, asNumber(state.layout?.cameraScreen?.height, 1.2))
    const oldGeo = runtime.model.geometry
    runtime.model.geometry = new THREE.PlaneGeometry(w, h, 1, 1)
    if (oldGeo && typeof oldGeo.dispose === 'function') {
      try { oldGeo.dispose() } catch { }
    }
  }

  function applyCameraScreenSettingsToRuntime(runtime) {
    if (!runtime || !runtime.videoElement) return
    const cfg = state.layout?.cameraScreen || DEFAULT_LAYOUT.cameraScreen
    runtime.videoElement.muted = cfg.muted !== false
    runtime.videoElement.defaultMuted = runtime.videoElement.muted
    runtime.videoElement.volume = runtime.videoElement.muted ? 0 : 1
    if (runtime.videoTexture) {
      runtime.videoTexture.wrapS = THREE.ClampToEdgeWrapping
      runtime.videoTexture.repeat.x = cfg.mirrored !== false ? -1 : 1
      runtime.videoTexture.repeat.y = 1
      runtime.videoTexture.offset.x = cfg.mirrored !== false ? 1 : 0
      runtime.videoTexture.offset.y = 0
      runtime.videoTexture.needsUpdate = true
    }
    updateCameraScreenGeometry(runtime)
  }

  function syncCameraInputs() {
    const cfg = state.layout?.cameraScreen || DEFAULT_LAYOUT.cameraScreen
    if (dom.cameraMuted) dom.cameraMuted.checked = cfg.muted !== false
    if (dom.cameraMirrored) dom.cameraMirrored.checked = cfg.mirrored !== false
    if (dom.cameraWidth) dom.cameraWidth.value = String(Math.max(0.1, asNumber(cfg.width, 2.2)).toFixed(2))
    if (dom.cameraHeight) dom.cameraHeight.value = String(Math.max(0.1, asNumber(cfg.height, 1.2)).toFixed(2))

    const runtime = slotRuntime.get('camera1')
    const running = !!(runtime && runtime.mediaStream)
    if (dom.cameraStartBtn) dom.cameraStartBtn.disabled = running
    if (dom.cameraStopBtn) dom.cameraStopBtn.disabled = !running
    if (dom.virtualCameraModeToggleBtn) dom.virtualCameraModeToggleBtn.disabled = !running
    if (!running) {
      setCameraStatus('摄像头: 未启动')
      if (state.virtualCameraMode?.enabled) {
        disableVirtualCameraMode()
      }
    }
    syncVirtualCameraModeUi()
  }

  function renderCameraDeviceOptions(preferredId = '') {
    if (!dom.cameraDeviceSelect) return
    const devices = Array.isArray(state.cameraDevices) ? state.cameraDevices : []
    const options = []
    if (!devices.length) {
      options.push('<option value="">未检测到摄像头设备</option>')
    } else {
      options.push('<option value="">系统默认摄像头</option>')
      for (const item of devices) {
        const id = String(item.deviceId || '')
        const label = String(item.label || '').trim() || `摄像头(${id.slice(0, 8) || '未命名'})`
        options.push(`<option value="${id}">${label}</option>`)
      }
    }
    dom.cameraDeviceSelect.innerHTML = options.join('')

    const targetId = String(preferredId || state.layout?.cameraScreen?.deviceId || '').trim()
    if (targetId && devices.some(d => String(d.deviceId || '') === targetId)) {
      dom.cameraDeviceSelect.value = targetId
    } else {
      dom.cameraDeviceSelect.value = ''
      if (state.layout?.cameraScreen) state.layout.cameraScreen.deviceId = ''
    }
  }

  async function refreshCameraDevices(requestPermission = false) {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
      setCameraStatus('摄像头: 当前环境不支持媒体设备枚举')
      return
    }

    try {
      if (requestPermission && typeof navigator.mediaDevices.getUserMedia === 'function') {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (tempStream && typeof tempStream.getTracks === 'function') {
          tempStream.getTracks().forEach((track) => {
            try { track.stop() } catch { }
          })
        }
      }

      const list = await navigator.mediaDevices.enumerateDevices()
      state.cameraDevices = Array.isArray(list)
        ? list.filter(item => item && item.kind === 'videoinput')
        : []
      renderCameraDeviceOptions()
      if (state.cameraDevices.length) {
        setCameraStatus(`摄像头: 已发现 ${state.cameraDevices.length} 个设备`)
      } else {
        setCameraStatus('摄像头: 未发现设备（可先点击启动授权）')
      }
    } catch (error) {
      console.error('[CharacterModel3D] 刷新摄像头设备失败:', error)
      setCameraStatus(`摄像头: 读取设备失败 (${error?.message || 'unknown'})`)
      state.cameraDevices = []
      renderCameraDeviceOptions()
    }
  }

  async function loadCameraScreenForSlot(key, stream) {
    const runtime = slotRuntime.get(key)
    if (!runtime) return { success: false, error: 'slot-not-found' }
    removeModelFromSlot(key)

    const video = document.createElement('video')
    video.srcObject = stream
    video.crossOrigin = 'anonymous'
    video.preload = 'auto'
    video.playsInline = true
    video.autoplay = true
    video.muted = state.layout?.cameraScreen?.muted !== false
    video.defaultMuted = video.muted
    video.volume = video.muted ? 0 : 1

    const ready = await new Promise((resolve) => {
      let done = false
      const finish = (ok, err) => {
        if (done) return
        done = true
        try { video.removeEventListener('loadedmetadata', onLoaded) } catch { }
        try { video.removeEventListener('error', onError) } catch { }
        clearTimeout(timer)
        resolve({ ok, err })
      }
      const onLoaded = () => finish(true, null)
      const onError = () => finish(false, new Error('摄像头视频流加载失败'))
      const timer = setTimeout(() => finish(false, new Error('摄像头启动超时')), 10000)
      video.addEventListener('loadedmetadata', onLoaded, { once: true })
      video.addEventListener('error', onError, { once: true })
    })

    if (!ready.ok) {
      try {
        if (stream && typeof stream.getTracks === 'function') {
          stream.getTracks().forEach((track) => {
            try { track.stop() } catch { }
          })
        }
      } catch { }
      return { success: false, error: ready.err?.message || 'camera-load-failed' }
    }

    const texture = new THREE.VideoTexture(video)
    if ('colorSpace' in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace
    else if ('encoding' in texture && THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false

    const w = Math.max(0.1, asNumber(state.layout?.cameraScreen?.width, 2.2))
    const h = Math.max(0.1, asNumber(state.layout?.cameraScreen?.height, 1.2))
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h, 1, 1),
      new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.45,
        side: THREE.DoubleSide,
        roughness: 0.92,
        metalness: 0.0
      })
    )
    mesh.castShadow = false
    mesh.receiveShadow = true

    runtime.videoElement = video
    runtime.videoTexture = texture
    runtime.mediaStream = stream
    runtime.model = mesh
    runtime.modelPath = 'camera://live'
    runtime.group.add(mesh)
    applyCameraScreenSettingsToRuntime(runtime)

    try {
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => { })
    } catch { }
    return { success: true }
  }

  async function startCameraScreen() {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setCameraStatus('摄像头: 当前环境不支持 getUserMedia')
      return
    }
    if (!state.layout.cameraScreen) state.layout.cameraScreen = deepClone(DEFAULT_LAYOUT.cameraScreen)

    const selectedDeviceId = String(dom.cameraDeviceSelect ? dom.cameraDeviceSelect.value : state.layout.cameraScreen.deviceId || '').trim()
    state.layout.cameraScreen.deviceId = selectedDeviceId
    const constraints = {
      video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
      audio: false
    }

    try {
      setCameraStatus('摄像头: 启动中...')
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      const result = await loadCameraScreenForSlot('camera1', stream)
      if (!result || !result.success) {
        setCameraStatus(`摄像头: 启动失败 (${result?.error || 'unknown'})`)
        return
      }
      state.layout.cameraScreen.enabled = true
      syncCameraInputs()
      scheduleSaveLayout()
      setStatus('摄像头屏幕已启动')
      setCameraStatus('摄像头: 运行中')
      await refreshCameraDevices(false)
      if (dom.cameraDeviceSelect && dom.cameraDeviceSelect.value) {
        state.layout.cameraScreen.deviceId = dom.cameraDeviceSelect.value
      }
    } catch (error) {
      console.error('[CharacterModel3D] 启动摄像头失败:', error)
      const msg = error?.name === 'NotAllowedError'
        ? '权限被拒绝'
        : (error?.name === 'NotFoundError' ? '未找到设备' : (error?.message || 'unknown'))
      setCameraStatus(`摄像头: 启动失败 (${msg})`)
    }
  }

  function stopCameraScreen(shouldSave = true) {
    removeModelFromSlot('camera1')
    if (!state.layout.cameraScreen) state.layout.cameraScreen = deepClone(DEFAULT_LAYOUT.cameraScreen)
    state.layout.cameraScreen.enabled = false
    if (state.virtualCameraMode?.enabled) {
      state.virtualCameraMode.enabled = false
      restoreCameraFromVirtualMode()
    }
    syncCameraInputs()
    setCameraStatus('摄像头: 已停止')
    if (shouldSave) scheduleSaveLayout()
  }

  function applyCameraSettingsFromInputs() {
    if (!state.layout.cameraScreen) state.layout.cameraScreen = deepClone(DEFAULT_LAYOUT.cameraScreen)
    state.layout.cameraScreen.muted = dom.cameraMuted ? !!dom.cameraMuted.checked : true
    state.layout.cameraScreen.mirrored = dom.cameraMirrored ? !!dom.cameraMirrored.checked : true
    state.layout.cameraScreen.width = Math.max(0.1, asNumber(dom.cameraWidth ? dom.cameraWidth.value : 2.2, 2.2))
    state.layout.cameraScreen.height = Math.max(0.1, asNumber(dom.cameraHeight ? dom.cameraHeight.value : 1.2, 1.2))
    state.layout.cameraScreen.deviceId = String(dom.cameraDeviceSelect ? dom.cameraDeviceSelect.value : state.layout.cameraScreen.deviceId || '').trim()
    const runtime = slotRuntime.get('camera1')
    if (runtime && runtime.model) applyCameraScreenSettingsToRuntime(runtime)
    if (runtime && runtime.model && state.virtualCameraMode?.enabled) {
      refreshVirtualCameraStageFrame(220, '更新虚拟摄像机画幅')
    }
    syncCameraInputs()
    scheduleSaveLayout()
  }

  function applyVideoSettingsFromInputs() {
    if (!state.layout.videoScreen) state.layout.videoScreen = deepClone(DEFAULT_LAYOUT.videoScreen)
    state.layout.videoScreen.loop = dom.videoLoopEnabled ? !!dom.videoLoopEnabled.checked : true
    state.layout.videoScreen.muted = dom.videoMuted ? !!dom.videoMuted.checked : true
    state.layout.videoScreen.width = Math.max(0.1, asNumber(dom.videoWidth ? dom.videoWidth.value : 2.2, 2.2))
    state.layout.videoScreen.height = Math.max(0.1, asNumber(dom.videoHeight ? dom.videoHeight.value : 1.2, 1.2))
    const runtime = slotRuntime.get('video1')
    if (runtime && runtime.model) applyVideoScreenSettingsToRuntime(runtime)
    syncVideoInputs()
    scheduleSaveLayout()
  }

  async function importVideoScreen() {
    let selectedPath = ''
    try {
      if (window.electronAPI && window.electronAPI.selectFileWithFilter) {
        const result = await window.electronAPI.selectFileWithFilter({
          filters: [{ name: '视频文件', extensions: ['mp4', 'webm', 'ogg', 'mov', 'm4v'] }]
        })
        if (result && result.success && result.path) {
          selectedPath = result.path
        }
      }
    } catch (error) {
      console.error('[CharacterModel3D] 选择视频文件失败:', error)
    }
    if (!selectedPath) {
      const input = window.prompt('请输入视频路径(URL 或本地路径):', state.layout?.videoScreen?.path || '')
      if (!input) return
      selectedPath = input.trim()
    }
    if (!selectedPath) return
    selectedPath = await importAssetForPack(selectedPath, 'single')
    if (!state.layout.videoScreen) state.layout.videoScreen = deepClone(DEFAULT_LAYOUT.videoScreen)
    state.layout.videoScreen.path = selectedPath
    const result = await loadModelForSlot('video1', selectedPath)
    if (result && result.success) {
      state.selectedSlot = 'video1'
      renderSlotTabs()
      syncTransformInputs()
    }
    syncVideoInputs()
    scheduleSaveLayout()
  }

  function clearVideoScreen() {
    if (!state.layout.videoScreen) state.layout.videoScreen = deepClone(DEFAULT_LAYOUT.videoScreen)
    state.layout.videoScreen.path = ''
    removeModelFromSlot('video1')
    scheduleSaveLayout()
  }

  async function clearSceneModel() {
    state.layout.scene.modelPath = ''
    removeModelFromSlot('scene')
    scheduleSaveLayout()
  }

  async function importCustomModel() {
    let selectedPath = ''
    try {
      if (window.electronAPI && window.electronAPI.selectFileWithFilter) {
        const result = await window.electronAPI.selectFileWithFilter({
          filters: [{ name: '3D模型', extensions: ['gltf', 'glb', 'obj'] }]
        })
        if (result && result.success && result.path) selectedPath = result.path
      }
    } catch (error) {
      console.error('[CharacterModel3D] 选择所选槽位模型失败:', error)
    }
    if (!selectedPath) {
      const input = window.prompt('请输入模型路径(URL 或本地路径):', '')
      if (!input) return
      selectedPath = input.trim()
    }
    if (!selectedPath) return
    selectedPath = await importAssetForPack(selectedPath, 'auto')
    state.layout.customModelPath = selectedPath
    state.slotModelPaths.custom1 = selectedPath
    await loadModelForSlot('custom1', selectedPath)
    state.selectedSlot = 'custom1'
    renderSlotTabs()
    syncTransformInputs()
    scheduleSaveLayout()
    setStatus('已导入自定义模型')
  }

  async function clearCustomModel() {
    state.layout.customModelPath = ''
    state.slotModelPaths.custom1 = ''
    await loadModelForSlot('custom1', '')
    scheduleSaveLayout()
    setStatus('已清除自定义模型')
  }

  async function importEntranceParticle() {
    let selectedPath = ''
    try {
      if (window.electronAPI && window.electronAPI.selectFileWithFilter) {
        const result = await window.electronAPI.selectFileWithFilter({
          filters: [{ name: '粒子特效(GLTF/GLB)', extensions: ['gltf', 'glb'] }]
        })
        if (result && result.success && result.path) selectedPath = result.path
      }
    } catch (error) {
      console.error('[CharacterModel3D] 选择粒子特效失败:', error)
    }
    if (!selectedPath) {
      const input = window.prompt('请输入粒子特效路径(GLTF/GLB，URL 或本地路径):', state.layout?.entranceParticle?.path || '')
      if (!input) return
      selectedPath = input.trim()
    }
    if (!selectedPath) return
    const ext = getPathExt(selectedPath)
    if (ext !== '.gltf' && ext !== '.glb') {
      window.alert('当前仅支持 GLTF/GLB 粒子特效文件')
      return
    }
    selectedPath = await importAssetForPack(selectedPath, 'auto')
    const loadResult = await ensureEntranceParticleAsset(selectedPath)
    if (!loadResult || !loadResult.success) {
      window.alert(`粒子特效加载失败: ${loadResult?.error || 'unknown-error'}`)
      return
    }
    if (!state.layout.entranceParticle) state.layout.entranceParticle = { path: '' }
    state.layout.entranceParticle.path = selectedPath
    syncEntranceParticleUi()
    scheduleSaveLayout()
    setStatus('已导入出场粒子特效')
  }

  function clearEntranceParticle() {
    if (!state.layout.entranceParticle) state.layout.entranceParticle = { path: '' }
    state.layout.entranceParticle.path = ''
    entranceParticleAsset.path = ''
    entranceParticleAsset.scene = null
    entranceParticleAsset.animations = []
    entranceParticleAsset.loadingPromise = null
    for (let i = activeParticleBursts.length - 1; i >= 0; i--) {
      const burst = activeParticleBursts[i]
      if (burst.node && burst.node.parent) burst.node.parent.remove(burst.node)
      activeParticleBursts.splice(i, 1)
    }
    syncEntranceParticleUi()
    scheduleSaveLayout()
    setStatus('已清除出场粒子特效')
  }

  function bindUiEvents() {
    if (dom.toolbarCollapseBtn) {
      dom.toolbarCollapseBtn.addEventListener('click', () => {
        applyToolbarCollapsed(!state.layout.toolbarCollapsed, true)
      })
    }
    dom.modeToggleBtn.addEventListener('click', () => {
      applyMode(state.layout.mode === 'edit' ? 'render' : 'edit')
    })
    dom.sceneImportBtn.addEventListener('click', importSceneModel)
    dom.sceneClearBtn.addEventListener('click', clearSceneModel)
    if (dom.customModelImportBtn) dom.customModelImportBtn.addEventListener('click', importCustomModel)
    if (dom.customModelClearBtn) dom.customModelClearBtn.addEventListener('click', clearCustomModel)
    if (dom.particleImportBtn) dom.particleImportBtn.addEventListener('click', importEntranceParticle)
    if (dom.particleClearBtn) dom.particleClearBtn.addEventListener('click', clearEntranceParticle)
    if (dom.videoImportBtn) dom.videoImportBtn.addEventListener('click', importVideoScreen)
    if (dom.videoClearBtn) dom.videoClearBtn.addEventListener('click', clearVideoScreen)
    if (dom.applyVideoSettingsBtn) dom.applyVideoSettingsBtn.addEventListener('click', applyVideoSettingsFromInputs)
    if (dom.cameraRefreshDevicesBtn) dom.cameraRefreshDevicesBtn.addEventListener('click', () => { void refreshCameraDevices(true) })
    if (dom.cameraStartBtn) dom.cameraStartBtn.addEventListener('click', () => { void startCameraScreen() })
    if (dom.cameraStopBtn) dom.cameraStopBtn.addEventListener('click', () => stopCameraScreen(true))
    if (dom.virtualCameraModeToggleBtn) dom.virtualCameraModeToggleBtn.addEventListener('click', toggleVirtualCameraMode)
    if (dom.applyCameraSettingsBtn) dom.applyCameraSettingsBtn.addEventListener('click', applyCameraSettingsFromInputs)
    if (dom.cameraDeviceSelect) {
      dom.cameraDeviceSelect.addEventListener('change', () => {
        if (!state.layout.cameraScreen) state.layout.cameraScreen = deepClone(DEFAULT_LAYOUT.cameraScreen)
        state.layout.cameraScreen.deviceId = String(dom.cameraDeviceSelect.value || '').trim()
        scheduleSaveLayout()
      })
    }
    dom.applyTransformBtn.addEventListener('click', applyInputsToSelectedTransform)
    if (dom.openRoleScaleModalBtn) dom.openRoleScaleModalBtn.addEventListener('click', openRoleScaleModal)
    if (dom.closeRoleScaleModalBtn) dom.closeRoleScaleModalBtn.addEventListener('click', closeRoleScaleModal)
    if (dom.openCameraCurveModalBtn) dom.openCameraCurveModalBtn.addEventListener('click', openCameraCurveModal)
    if (dom.closeCameraCurveModalBtn) dom.closeCameraCurveModalBtn.addEventListener('click', closeCameraCurveModal)
    if (dom.roleScaleRoleSelect) {
      dom.roleScaleRoleSelect.addEventListener('change', () => {
        syncRoleScaleModal(false)
      })
    }
    if (dom.applyRoleScaleBtn) dom.applyRoleScaleBtn.addEventListener('click', applyRoleScaleFromModal)
    if (dom.resetRoleScaleBtn) dom.resetRoleScaleBtn.addEventListener('click', resetRoleScaleFromModal)
    if (dom.roleScaleModal) {
      dom.roleScaleModal.addEventListener('click', (e) => {
        if (e.target === dom.roleScaleModal) closeRoleScaleModal()
      })
    }
    if (dom.cameraCurveModal) {
      dom.cameraCurveModal.addEventListener('click', (e) => {
        if (e.target === dom.cameraCurveModal) closeCameraCurveModal()
      })
    }
    if (dom.focusSelectedBtn) dom.focusSelectedBtn.addEventListener('click', focusCameraOnSelectedSlot)
    if (dom.cameraEventSelect) {
      dom.cameraEventSelect.addEventListener('change', () => {
        syncCameraEditorInputs()
      })
    }
    if (dom.saveCameraKeyframeBtn) dom.saveCameraKeyframeBtn.addEventListener('click', saveCurrentCameraAsKeyframe)
    if (dom.previewCameraKeyframeBtn) dom.previewCameraKeyframeBtn.addEventListener('click', previewSelectedCameraKeyframe)
    if (dom.clearCameraKeyframeBtn) dom.clearCameraKeyframeBtn.addEventListener('click', clearSelectedCameraKeyframe)
    if (dom.cameraTransitionMs) {
      dom.cameraTransitionMs.addEventListener('change', () => {
        state.layout.cameraTransitionMs = Math.max(50, Math.min(10000, asNumber(dom.cameraTransitionMs.value, 900)))
        dom.cameraTransitionMs.value = String(state.layout.cameraTransitionMs)
        scheduleSaveLayout()
      })
    }
    if (dom.cameraEasingPreset) {
      dom.cameraEasingPreset.addEventListener('change', () => {
        applyCameraEasingFromInputs(true)
        const preset = CAMERA_EASING_PRESETS[state.layout?.cameraEasing?.preset || DEFAULT_CAMERA_EASING.preset]
        setStatus(`镜头曲线: ${preset?.label || '平滑默认'}`)
      })
    }
    if (dom.cameraCurveModalPreset) {
      dom.cameraCurveModalPreset.addEventListener('change', () => {
        applyCameraEasingFromInputs(true)
        drawCameraCurveEditor()
      })
    }
    ;[dom.cameraBezierX1, dom.cameraBezierY1, dom.cameraBezierX2, dom.cameraBezierY2].forEach((input) => {
      if (!input) return
      input.addEventListener('change', () => {
        applyCameraEasingFromInputs(true)
        setStatus('已更新自定义镜头曲线')
      })
    })
    if (dom.cameraCurveResetBtn) {
      dom.cameraCurveResetBtn.addEventListener('click', () => {
        resetCustomCameraCurve()
        setStatus('已重置自定义镜头曲线')
      })
    }
    if (dom.applyCameraCurveBtn) {
      dom.applyCameraCurveBtn.addEventListener('click', () => {
        applyCameraEasingFromInputs(true)
        setStatus(`镜头曲线已应用: ${getCameraCurveSummaryText()}`)
      })
    }
    if (dom.previewCameraCurveBtn) {
      dom.previewCameraCurveBtn.addEventListener('click', () => {
        applyCameraEasingFromInputs(false)
        previewSelectedCameraKeyframe()
      })
    }
    if (dom.cameraCurveCanvas) {
      dom.cameraCurveCanvas.addEventListener('pointerdown', (e) => {
        if (state.layout?.cameraEasing?.preset !== 'custom') return
        const handle = detectCameraCurveHandle(e.clientX, e.clientY)
        if (!handle) return
        cameraCurveDragHandle = handle
        try { dom.cameraCurveCanvas.setPointerCapture(e.pointerId) } catch { }
      })
      dom.cameraCurveCanvas.addEventListener('pointermove', (e) => {
        if (!cameraCurveDragHandle) return
        updateCameraCurveFromCanvasPointer(e.clientX, e.clientY)
      })
      dom.cameraCurveCanvas.addEventListener('pointerup', (e) => {
        if (!cameraCurveDragHandle) return
        updateCameraCurveFromCanvasPointer(e.clientX, e.clientY)
        cameraCurveDragHandle = ''
        scheduleSaveLayout()
      })
      dom.cameraCurveCanvas.addEventListener('pointercancel', () => {
        cameraCurveDragHandle = ''
      })
    }
    if (dom.applyEnvironmentPresetBtn) {
      dom.applyEnvironmentPresetBtn.addEventListener('click', () => {
        const next = dom.environmentPresetSelect ? dom.environmentPresetSelect.value : state.layout.environmentPreset
        applyEnvironmentPreset(next, true)
      })
    }
    if (dom.environmentPresetSelect) {
      dom.environmentPresetSelect.addEventListener('change', () => {
        applyEnvironmentPreset(dom.environmentPresetSelect.value, true)
      })
    }
    if (dom.applyWeatherPresetBtn) {
      dom.applyWeatherPresetBtn.addEventListener('click', () => {
        const next = dom.weatherPresetSelect ? dom.weatherPresetSelect.value : state.layout.weatherPreset
        applyWeatherPreset(next, true)
        setStatus(`天气已切换: ${WEATHER_PRESETS[state.layout.weatherPreset || 'clear']?.label || state.layout.weatherPreset}`)
      })
    }
    if (dom.weatherPresetSelect) {
      dom.weatherPresetSelect.addEventListener('change', () => {
        applyWeatherPreset(dom.weatherPresetSelect.value, true)
        setStatus(`天气已切换: ${WEATHER_PRESETS[state.layout.weatherPreset || 'clear']?.label || state.layout.weatherPreset}`)
      })
    }
    if (dom.applyWeatherSettingsBtn) {
      dom.applyWeatherSettingsBtn.addEventListener('click', () => {
        applyWeatherSettingsFromInputs(true)
        setStatus('已应用天气强度与音效参数')
      })
    }
    if (dom.weatherWindIntensity) {
      dom.weatherWindIntensity.addEventListener('change', () => {
        applyWeatherSettingsFromInputs(true)
      })
    }
    if (dom.weatherAudioEnabled) {
      dom.weatherAudioEnabled.addEventListener('change', () => {
        applyWeatherSettingsFromInputs(true)
      })
    }
    if (dom.weatherAudioVolume) {
      dom.weatherAudioVolume.addEventListener('change', () => {
        applyWeatherSettingsFromInputs(true)
      })
    }
    if (dom.renderQualitySelect) {
      dom.renderQualitySelect.addEventListener('change', () => {
        applyRenderQualityPreset(dom.renderQualitySelect.value, true)
        setStatus(`画质: ${QUALITY_PRESETS[state.layout.qualityPreset || 'high']?.label || state.layout.qualityPreset}`)
      })
    }
    if (dom.fogEnabled) {
      dom.fogEnabled.addEventListener('change', () => {
        state.layout.fogEnabled = !!dom.fogEnabled.checked
        applyEnvironmentPreset(state.layout.environmentPreset, true)
        setStatus(`雾化效果滤镜: ${state.layout.fogEnabled ? '开启' : '关闭'}`)
      })
    }
    if (dom.fogStrength) {
      dom.fogStrength.addEventListener('change', () => {
        state.layout.fogStrength = Math.max(0, Math.min(3, asNumber(dom.fogStrength.value, 1)))
        dom.fogStrength.value = state.layout.fogStrength.toFixed(2)
        applyEnvironmentPreset(state.layout.environmentPreset, true)
        setStatus(`雾化强度: ${state.layout.fogStrength.toFixed(2)}`)
      })
    }
    if (dom.shadowStrength) {
      dom.shadowStrength.addEventListener('change', () => {
        state.layout.shadowStrength = Math.max(0, Math.min(1, asNumber(dom.shadowStrength.value, 0.45)))
        dom.shadowStrength.value = state.layout.shadowStrength.toFixed(2)
        applyEnvironmentPreset(state.layout.environmentPreset, true)
      })
    }
    if (dom.droneModeEnabled) {
      dom.droneModeEnabled.addEventListener('change', () => {
        state.layout.droneMode = !!dom.droneModeEnabled.checked
        setStatus(`无人机模式: ${state.layout.droneMode ? '开启' : '关闭'}`)
        scheduleSaveLayout()
      })
    }
    if (dom.maxFps) {
      dom.maxFps.addEventListener('change', () => {
        state.layout.maxFps = Math.max(10, Math.min(240, Math.round(asNumber(dom.maxFps.value, 60))))
        dom.maxFps.value = String(state.layout.maxFps)
        scheduleSaveLayout()
      })
    }
    if (dom.entranceEffectSelect) {
      dom.entranceEffectSelect.addEventListener('change', () => {
        const next = dom.entranceEffectSelect.value
        state.layout.entranceEffect = (
          next === 'none'
          || next === 'flameDissolve'
          || next === 'cardStorm'
          || next === 'spotlightRush'
          || next === 'prismBloom'
          || next === 'mistReveal'
        ) ? next : 'fade'
        scheduleSaveLayout()
      })
    }
    if (dom.stylizedToonEnabled) {
      dom.stylizedToonEnabled.addEventListener('change', () => {
        if (!state.layout.stylizedRender) state.layout.stylizedRender = deepClone(DEFAULT_LAYOUT.stylizedRender)
        state.layout.stylizedRender.toonEnabled = !!dom.stylizedToonEnabled.checked
        applyStylizedRenderSettings(true)
      })
    }
    if (dom.stylizedToonSteps) {
      dom.stylizedToonSteps.addEventListener('change', () => {
        if (!state.layout.stylizedRender) state.layout.stylizedRender = deepClone(DEFAULT_LAYOUT.stylizedRender)
        state.layout.stylizedRender.toonSteps = Math.max(2, Math.min(5, Math.round(asNumber(dom.stylizedToonSteps.value, 3))))
        applyStylizedRenderSettings(true)
      })
    }
    if (dom.stylizedOutlineEnabled) {
      dom.stylizedOutlineEnabled.addEventListener('change', () => {
        if (!state.layout.stylizedRender) state.layout.stylizedRender = deepClone(DEFAULT_LAYOUT.stylizedRender)
        state.layout.stylizedRender.outlineEnabled = !!dom.stylizedOutlineEnabled.checked
        applyStylizedRenderSettings(true)
      })
    }
    if (dom.stylizedOutlineThickness) {
      dom.stylizedOutlineThickness.addEventListener('change', () => {
        if (!state.layout.stylizedRender) state.layout.stylizedRender = deepClone(DEFAULT_LAYOUT.stylizedRender)
        state.layout.stylizedRender.outlineThickness = Math.max(0.0005, Math.min(0.03, asNumber(dom.stylizedOutlineThickness.value, 0.004)))
        applyStylizedRenderSettings(true)
      })
    }
    if (dom.stylizedOutlineColor) {
      dom.stylizedOutlineColor.addEventListener('change', () => {
        if (!state.layout.stylizedRender) state.layout.stylizedRender = deepClone(DEFAULT_LAYOUT.stylizedRender)
        state.layout.stylizedRender.outlineColor = dom.stylizedOutlineColor.value || '#000000'
        applyStylizedRenderSettings(true)
      })
    }
    if (dom.stylizedOutlineAlpha) {
      dom.stylizedOutlineAlpha.addEventListener('change', () => {
        if (!state.layout.stylizedRender) state.layout.stylizedRender = deepClone(DEFAULT_LAYOUT.stylizedRender)
        state.layout.stylizedRender.outlineAlpha = Math.max(0, Math.min(1, asNumber(dom.stylizedOutlineAlpha.value, 1)))
        applyStylizedRenderSettings(true)
      })
    }
    if (dom.cameraMoveStep) {
      dom.cameraMoveStep.addEventListener('change', () => {
        const next = getCameraMoveStep()
        dom.cameraMoveStep.value = String(next)
      })
    }
    if (Array.isArray(dom.cameraMoveButtons)) {
      dom.cameraMoveButtons.forEach((btn) => {
        const dir = String(btn.dataset.camMove || '').trim()
        if (!dir) return
        btn.addEventListener('click', (e) => {
          e.preventDefault()
          moveCameraByDirection(dir, 1, true, true)
        })
        btn.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return
          e.preventDefault()
          if (cameraMoveState.activeBtn && cameraMoveState.activeBtn !== btn) {
            cameraMoveState.activeBtn.classList.remove('active')
          }
          cameraMoveState.activeBtn = btn
          cameraMoveState.dir = dir
          btn.classList.add('active')
        })
        btn.addEventListener('pointerup', stopCameraMoveHold)
        btn.addEventListener('pointercancel', stopCameraMoveHold)
      })
      window.addEventListener('pointerup', stopCameraMoveHold)
      window.addEventListener('blur', stopCameraMoveHold)
    }
    if (dom.applyLightBtn) {
      dom.applyLightBtn.addEventListener('click', () => {
        if (!state.layout.lights) state.layout.lights = deepClone(DEFAULT_LAYOUT.lights)
        if (!state.layout.lights.light1) state.layout.lights.light1 = deepClone(DEFAULT_LAYOUT.lights.light1)
        state.layout.lights.light1.color = (dom.lightColor && dom.lightColor.value) ? dom.lightColor.value : '#fff1d6'
        state.layout.lights.light1.intensity = Math.max(0, asNumber(dom.lightIntensity ? dom.lightIntensity.value : 2.4, 2.4))
        applyLightSettings('light1')
        scheduleSaveLayout()
      })
    }
    if (dom.applyAdvancedRenderBtn) {
      dom.applyAdvancedRenderBtn.addEventListener('click', () => {
        applyAdvancedRenderSettings(true, true)
        setStatus('已应用高级光效与渲染精度参数')
      })
    }
    if (dom.resetAdvancedRenderBtn) {
      dom.resetAdvancedRenderBtn.addEventListener('click', () => {
        state.layout.advancedRender = deepClone(ADVANCED_RENDER_DEFAULT)
        syncAdvancedRenderInputs()
        applyAdvancedRenderSettings(true, false)
        setStatus('已恢复高级参数默认值')
      })
    }
    if (dom.advAntialiasEnabled) {
      dom.advAntialiasEnabled.addEventListener('change', () => {
        if (!state.layout.advancedRender) state.layout.advancedRender = deepClone(ADVANCED_RENDER_DEFAULT)
        state.layout.advancedRender.antialiasEnabled = !!dom.advAntialiasEnabled.checked
        applyAdvancedRenderSettings(true, false)
        setStatus(`抗锯齿: ${state.layout.advancedRender.antialiasEnabled ? '开启' : '关闭'}`)
      })
    }
    if (dom.advRenderScale) {
      dom.advRenderScale.addEventListener('change', () => {
        if (!state.layout.advancedRender) state.layout.advancedRender = deepClone(ADVANCED_RENDER_DEFAULT)
        state.layout.advancedRender.renderScale = Math.max(0.7, Math.min(2, asNumber(dom.advRenderScale.value, 1)))
        applyAdvancedRenderSettings(true, false)
        setStatus(`渲染分辨率: ${Math.round(state.layout.advancedRender.renderScale * 100)}%`)
      })
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isCameraCurveModalOpen()) {
        e.preventDefault()
        closeCameraCurveModal()
        return
      }
      if (e.key === 'Escape' && isRoleScaleModalOpen()) {
        e.preventDefault()
        closeRoleScaleModal()
        return
      }
      if (e.key === 'F2') {
        e.preventDefault()
        applyMode(state.layout.mode === 'edit' ? 'render' : 'edit')
        return
      }
      const tag = (document.activeElement && document.activeElement.tagName || '').toUpperCase()
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'F6') {
        e.preventDefault()
        toggleVirtualCameraMode()
        return
      }
      if (state.layout.mode !== 'edit') return
      const key = String(e.key || '').toLowerCase()
      if (key === 'shift' || isCameraMoveKey(key)) {
        cameraKeyboardState.pressed.add(key)
        cancelCameraTransition()
        e.preventDefault()
        return
      }

      const runtime = slotRuntime.get(state.selectedSlot)
      if (!runtime || !runtime.group) return
      const step = e.shiftKey ? 0.2 : 0.05
      let changed = true

      if (e.key === 'ArrowUp') runtime.group.position.z -= step
      else if (e.key === 'ArrowDown') runtime.group.position.z += step
      else if (e.key === 'ArrowLeft') runtime.group.position.x -= step
      else if (e.key === 'ArrowRight') runtime.group.position.x += step
      else if (e.key === 'PageUp') runtime.group.position.y += step
      else if (e.key === 'PageDown') runtime.group.position.y -= step
      else changed = false

      if (!changed) return
      e.preventDefault()
      snapshotTransformFromGroup(state.selectedSlot)
      syncTransformInputs()
      scheduleSaveLayout()
    }, true)

    window.addEventListener('keyup', (e) => {
      const key = String(e.key || '').toLowerCase()
      if (key !== 'shift' && !isCameraMoveKey(key)) return
      cameraKeyboardState.pressed.delete(key)
      if (!hasActiveCameraKeyboardMove() && cameraKeyboardState.dirty) {
        cameraKeyboardState.dirty = false
        saveCameraToLayout()
      }
    }, true)

    window.addEventListener('blur', () => {
      if (cameraKeyboardState.dirty) {
        cameraKeyboardState.dirty = false
        saveCameraToLayout()
      }
      cameraKeyboardState.pressed.clear()
    })
    if (navigator.mediaDevices && typeof navigator.mediaDevices.addEventListener === 'function') {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        void refreshCameraDevices(false)
      })
    }

    window.addEventListener('resize', () => {
      if (!renderer || !camera) return
      const w = dom.renderRoot.clientWidth || window.innerWidth
      const h = dom.renderRoot.clientHeight || window.innerHeight
      renderer.setSize(w, h)
      syncCameraProjectionToMode()
      if (state.virtualCameraMode?.enabled) {
        refreshVirtualCameraStageFrame(120, '窗口尺寸变化')
      }
      if (isCameraCurveModalOpen()) drawCameraCurveEditor()
    })

    dom.renderRoot.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    })

    dom.renderRoot.addEventListener('mousedown', (e) => {
      if (state.layout.mode !== 'edit') return
      // 左键旋转；右键或 Shift+左键 平移
      if (e.button === 0 && !e.shiftKey) {
        orbit.dragging = true
        orbit.panning = false
      } else if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
        orbit.panning = true
        orbit.dragging = false
      } else {
        return
      }
      cancelCameraTransition()
      stopCameraMoveHold()
      orbit.lastX = e.clientX
      orbit.lastY = e.clientY
      e.preventDefault()
    })

    window.addEventListener('mouseup', () => {
      if (!orbit.dragging && !orbit.panning) return
      orbit.dragging = false
      orbit.panning = false
      saveCameraToLayout()
    })

    window.addEventListener('mousemove', (e) => {
      if ((!orbit.dragging && !orbit.panning) || state.layout.mode !== 'edit') return
      const dx = e.clientX - orbit.lastX
      const dy = e.clientY - orbit.lastY
      orbit.lastX = e.clientX
      orbit.lastY = e.clientY
      if (orbit.panning) {
        const panScale = Math.max(0.001, orbit.desiredRadius * 0.0016)
        const forward = new THREE.Vector3()
        camera.getWorldDirection(forward)
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()
        const up = new THREE.Vector3().copy(camera.up).normalize()
        orbit.desiredTarget.x += (-dx * panScale * right.x) + (dy * panScale * up.x)
        orbit.desiredTarget.y += (-dx * panScale * right.y) + (dy * panScale * up.y)
        orbit.desiredTarget.z += (-dx * panScale * right.z) + (dy * panScale * up.z)
      } else {
        orbit.desiredYaw -= dx * 0.0048
        orbit.desiredPitch -= dy * 0.0044
      }
    })

    dom.renderRoot.addEventListener('wheel', (e) => {
      if (state.layout.mode !== 'edit') return
      e.preventDefault()
      cancelCameraTransition()
      const zoomFactor = Math.exp(e.deltaY * CAMERA_ZOOM_FACTOR)
      const baseRadius = Number.isFinite(orbit.desiredRadius) && orbit.desiredRadius > CAMERA_EPSILON_RADIUS
        ? orbit.desiredRadius
        : (Number.isFinite(orbit.radius) && orbit.radius > CAMERA_EPSILON_RADIUS ? orbit.radius : 1)
      orbit.desiredRadius = Math.max(CAMERA_EPSILON_RADIUS, baseRadius * zoomFactor)
      saveCameraToLayout()
    }, { passive: false })
  }

  function renderLoop() {
    rafId = requestAnimationFrame(renderLoop)
    const now = performance.now()
    const maxFps = Math.max(10, Math.min(240, asNumber(state.layout?.maxFps, 60)))
    const minFrameMs = 1000 / maxFps
    if (frameLimiterLastAt > 0 && (now - frameLimiterLastAt) < minFrameMs) {
      return
    }
    frameLimiterLastAt = now
    const dt = clock.getDelta()
    fpsAccum += dt
    fpsFrames += 1
    if (fpsAccum >= 0.4) {
      fpsLast = Math.round(fpsFrames / Math.max(0.0001, fpsAccum))
      fpsAccum = 0
      fpsFrames = 0
      if (dom.fpsBadge) dom.fpsBadge.textContent = `FPS: ${fpsLast}`
    }
    for (const mixer of mixers.values()) {
      try { mixer.update(dt) } catch { }
    }
    updateEntranceEffects()
    updateParticleBursts(dt)
    updateWeatherEffects(dt)
    if (cameraMoveState.dir && !cameraTransition) {
      moveCameraByDirection(cameraMoveState.dir, dt * 5.2, false, false)
    }
    applyCameraKeyboardInput(dt)
    if (cameraTransition) {
      updateCameraTransition()
    } else {
      updateCameraFromOrbit(false)
    }
    updateKeyLightShadowFrustum()
    if (renderer && scene && camera) {
      const sr = state.layout?.stylizedRender || DEFAULT_LAYOUT.stylizedRender
      if (sr.outlineEnabled && outlineEffect) {
        updateOutlineEffectThickness()
        outlineEffect.render(scene, camera)
      } else {
        renderer.render(scene, camera)
      }
    }
  }

  async function loadOfficialModelMap() {
    try {
      if (window.electronAPI && window.electronAPI.getOfficialModelMap) {
        const map = await window.electronAPI.getOfficialModelMap()
        state.officialModelMap = map && typeof map === 'object' ? map : {}
        return
      }
    } catch (error) {
      console.warn('[CharacterModel3D] 获取官方模型映射失败:', error)
    }
    state.officialModelMap = {}
  }

  function applyIncomingBpState(nextState) {
    if (!nextState || typeof nextState !== 'object') return
    const prevSurvivorCount = state.bpSelectionState.survivorCount || 0
    const prevHunterSelected = !!state.bpSelectionState.hunterSelected
    const prevRoundBanCount = state.bpSelectionState.roundBanCount || 0
    const prevGlobalBanCount = state.bpSelectionState.globalBanCount || 0
    const snapshot = readBpSnapshot(nextState)
    const nextSelectionState = applyBpSnapshotToState(snapshot)
    const nextSurvivorCount = nextSelectionState.survivorCount
    const nextHunterSelected = nextSelectionState.hunterSelected
    const nextRoundBanCount = nextSelectionState.roundBanCount
    const nextGlobalBanCount = nextSelectionState.globalBanCount
    state.bpSelectionState = nextSelectionState

    const hasAnyBpCameraSignal = nextSurvivorCount > 0 || nextHunterSelected || nextRoundBanCount > 0 || nextGlobalBanCount > 0

    if (!hasAnyBpCameraSignal) {
      // 布局保存也会触发本地 BP 状态广播；这里不能粗暴打断手动镜头过渡，
      // 否则像“虚拟摄像机主镜头”这种非 BP 驱动切镜会在 0.1~0.2s 后被取消。
      pendingCameraEventKey = ''
    } else {
      let cameraEventKey = ''
      if (nextSurvivorCount > prevSurvivorCount) {
        cameraEventKey = `survivor${Math.min(nextSurvivorCount, 4)}`
      }
      if (!prevHunterSelected && nextHunterSelected) {
        cameraEventKey = 'hunterSelected'
      }
      if (nextRoundBanCount > prevRoundBanCount || nextGlobalBanCount > prevGlobalBanCount) {
        cameraEventKey = 'banUpdated'
      }
      if (cameraEventKey) {
        if (state.virtualCameraMode?.enabled) {
          exitVirtualCameraModeForAutoCut('检测到 BP 选人/ban 事件，已自动退出虚拟摄像机主镜头')
        }
        requestCameraEvent(cameraEventKey)
      }
    }

    // 注意：这里不覆盖本窗口相机/布局，避免切换视角后被回退。
    // 只做 BP 角色同步。
    runBpRoleSyncLoop()
  }

  async function loadInitialState() {
    if (!window.electronAPI || !window.electronAPI.invoke) {
      applyLayoutToScene()
      return
    }
    try {
      const result = await window.electronAPI.invoke('localBp:getState')
      if (result && result.success && result.data) {
        const data = result.data
        state.layout = normalizeLayout(data.characterModel3DLayout)
        state.bpSelectionState = applyBpSnapshotToState(readBpSnapshot(data))
      }
    } catch (error) {
      console.error('[CharacterModel3D] 读取初始状态失败:', error)
    }
    applyLayoutToScene()
    if (state.layout.scene.modelPath) {
      await loadModelForSlot('scene', state.layout.scene.modelPath)
    }
    if (state.layout?.videoScreen?.path) {
      await loadModelForSlot('video1', state.layout.videoScreen.path)
    }
    if (state.layout?.cameraScreen?.enabled) {
      await startCameraScreen()
    }
    if (state.layout?.customModelPath) {
      await loadModelForSlot('custom1', state.layout.customModelPath)
    }
    if (state.layout?.entranceParticle?.path) {
      const loaded = await ensureEntranceParticleAsset(state.layout.entranceParticle.path)
      if (!loaded || !loaded.success) {
        console.warn('[CharacterModel3D] 初始粒子资源预加载失败:', loaded?.error || 'unknown')
      }
    }
    await updateRoleModelsByBp()
  }

  async function applyIncomingLayout(nextLayout) {
    const prevLayout = deepClone(state.layout)
    const preservedCamera = isHostedEditorWindow ? captureCurrentCameraLayout() : null
    state.layout = normalizeLayout(nextLayout)
    if (preservedCamera) {
      state.layout.camera = preservedCamera
    }
    applyLayoutToScene()

    if ((prevLayout?.scene?.modelPath || '') !== (state.layout?.scene?.modelPath || '')) {
      await loadModelForSlot('scene', state.layout?.scene?.modelPath || '')
    }
    if ((prevLayout?.videoScreen?.path || '') !== (state.layout?.videoScreen?.path || '')) {
      await loadModelForSlot('video1', state.layout?.videoScreen?.path || '')
    }

    if (state.layout?.cameraScreen?.enabled && !prevLayout?.cameraScreen?.enabled) {
      await startCameraScreen()
    } else if (!state.layout?.cameraScreen?.enabled && prevLayout?.cameraScreen?.enabled) {
      stopCameraScreen(false)
    }

    if ((prevLayout?.customModelPath || '') !== (state.layout?.customModelPath || '')) {
      await loadModelForSlot('custom1', state.layout?.customModelPath || '')
    }

    const prevParticlePath = prevLayout?.entranceParticle?.path || ''
    const nextParticlePath = state.layout?.entranceParticle?.path || ''
    if (prevParticlePath !== nextParticlePath) {
      if (nextParticlePath) {
        const loaded = await ensureEntranceParticleAsset(nextParticlePath)
        if (!loaded || !loaded.success) {
          setStatus(`粒子资源加载失败: ${loaded?.error || 'unknown'}`)
        }
      } else {
        entranceParticleAsset.path = ''
        entranceParticleAsset.scene = null
        entranceParticleAsset.animations = []
        entranceParticleAsset.loadingPromise = null
      }
    }
    syncEntranceParticleUi()
  }

  function bindRealtimeBpSync() {
    if (window.electronAPI && window.electronAPI.onUpdateData) {
      window.electronAPI.onUpdateData((packet) => {
        if (!packet || typeof packet !== 'object') return
        if (packet.type === 'state' && packet.state) {
          setStatus('收到BP同步，正在刷新模型...')
          applyIncomingBpState(packet.state)
          return
        }
        if (packet.type === 'layout' && packet.layout) {
          setStatus('收到布局同步，正在刷新场景...')
          void applyIncomingLayout(packet.layout)
          return
        }
        if (packet.type === 'cameraEvent' && packet.key) {
          if (state.virtualCameraMode?.enabled) {
            exitVirtualCameraModeForAutoCut('收到引导切镜事件，已自动退出虚拟摄像机主镜头')
          }
          requestCameraEvent(packet.key)
        }
      })
    }
    if (window.electronAPI && window.electronAPI.onLocalBpStateUpdate) {
      window.electronAPI.onLocalBpStateUpdate((nextState) => {
        if (!nextState || typeof nextState !== 'object') return
        setStatus('收到本地BP状态更新，正在刷新模型...')
        applyIncomingBpState(nextState)
      })
    }
  }

  async function init() {
    setStatus('加载 three.js...')
    const ok = await ensureThreeRuntime()
    if (!ok) {
      setStatus('three.js 初始化失败')
      return
    }
    createSceneGraph()
    bindUiEvents()
    primeWeatherAudioUnlock()
    await refreshCameraDevices(false)
    await loadOfficialModelMap()
    await loadInitialState()
    bindRealtimeBpSync()
    renderLoop()
    setStatus('就绪')
  }

  init()
})()
