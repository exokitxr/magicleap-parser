#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const _cleanType = s => s.replace(/\s+ML_CALL/, '');
const _cleanName = s => s.replace(/ML_CALL\s+/, '');
const _getJsType = type => {
  switch (type) {
    case 'bool':
      return 'Boolean';
    case 'uint32_t':
    case 'uint64_t':
    case 'int64_t':
    case 'uint16_t':
    case 'MLHandle':
    case 'MLFileInfo':
    case 'const MLFileInfo':
    case 'MLFileDescriptor':
    case 'MLDispatchErrorCode':
    case 'MLSurfaceFormat':
    case 'VkFormat':
    case 'MLIdentityError':
    case 'MLInvokeFuture':
    case 'MLLifecycleErrorCode':
    case 'MLLifecycleInitArg':
    case 'const MLLifecycleInitArg':
    case 'void':
    case 'MLDataArrayLockResult':
    case 'MLPlanesQueryResult':
    case 'MLSharedFileList':
    case 'MLTokenAgentError':
    case 'const MLAudioBufferFormat':
    case 'MLAudioError':
    case 'MLAudioBufferCallback':
    case 'MLAudioBufferFormat':
    case 'MLAudioBuffer':
    case 'MLCameraCaptureType':
    case 'MLCameraDeviceStatusCallbacks':
    case 'MLCameraCaptureCallbacks':
    case 'MLCameraError':
    case 'MLCameraOutput':
    case 'MLCameraResultExtras':
    case 'MLCameraMetadataColorCorrectionAberrationMode':
    case 'size_t':
    case 'MLCameraMetadataControlAEMode':
    case 'int32_t':
    case 'MLCameraMetadataRational':
    case 'MLCameraMetadataControlAELockAvailable':
    case 'MLCameraMetadataControlAWBMode':
    case 'MLCameraMetadataControlAWBLockAvailable':
    case 'float':
    case 'int64_t':
    case 'const int64_t':
    case 'MLCameraMetadataColorCorrectionMode':
    case 'MLCameraMetadataControlAEAntibandingMode':
    case 'MLCameraMetadataControlAELock':
    case 'MLCameraMetadataControlAWBLock':
    case 'const MLCameraMetadataColorCorrectionMode':
    case 'const MLCameraMetadataRational':
    case 'const float':
    case 'const MLCameraMetadataColorCorrectionAberrationMode':
    case 'const MLCameraMetadataControlAEAntibandingMode':
    case 'const int32_t':
    case 'const MLCameraMetadataControlAELock':
    case 'const MLCameraMetadataControlAEMode':
    case 'const MLCameraMetadataControlAWBLock':
    case 'const MLCameraMetadataControlAWBMode':
    case 'MLCameraMetadataControlAEState':
    case 'MLCameraMetadataControlAWBState':
    case 'MLControllerConfiguration':
    case 'MLControllerSystemState':
    case 'MLDataArrayDiff':
    case 'MLDataArrayHandle':
    case 'MLDataArray':
    case 'MLDispatchPacket':
    case 'const MLDispatchPacket':
    case 'MLEyeTrackingStaticData':
    case 'MLEyeTrackingState':
    case 'int':
    case 'const MLFoundObjectQueryFilter':
    case 'MLFoundObject':
    case 'MLUUID':
    case 'char':
    case 'MLFoundObjectProperty':
    case 'MLGestureData':
    case 'MLGestureStaticData':
    case 'MLGestureHandMasks':
    case 'const MLGestureConfiguration':
    case 'MLGestureConfiguration':
    case 'const MLGraphicsOptions':
    case 'const MLHandle':
    case 'MLStatus':
    case 'const MLSurfaceFormat':
    case 'const uint32_t':
    case 'const VkPhysicalDevice':
    case 'const VkDevice':
    case 'const VkFormat':
    case 'MLGraphicsFrameTimingHint':
    case 'MLGraphicsFrameParams':
    case 'const MLGraphicsFrameParams':
    case 'MLGraphicsVirtualCameraInfoArray':
    case 'MLGraphicsClipExtentsInfoArray':
    case 'MLGraphicsRenderTargetsInfo':
    case 'MLGraphicsClientPerformanceInfo':
    case 'MLHeadTrackingStaticData':
    case 'MLHeadTrackingState':
    case 'MLIdentityProfile':
    case 'const MLIdentityAttributeEnum':
    case 'const MLImageTrackerSettings':
    case 'MLImageTrackerSettings':
    case 'const MLImageTrackerTargetSettings':
    case 'const unsigned':
    case 'MLImageTrackerImageFormat':
    case 'MLImageTrackerTargetStaticData':
    case 'MLImageTrackerSettings':
    case 'MLImageTrackerTargetResult':
    case 'const MLInputConfiguration':
    case 'const MLInputControllerCallbacks':
    case 'MLInputControllerState':
    case 'uint8_t':
    case 'MLInputControllerFeedbackPatternVibe':
    case 'MLInputControllerFeedbackIntensity':
    case 'MLInputControllerFeedbackPatternLED':
    case 'MLInputControllerFeedbackColorLED':
    case 'MLInputControllerFeedbackEffectLED':
    case 'MLInputControllerFeedbackEffectSpeedLED':
    case 'const MLInputKeyboardCallbacks':
    case 'MLInputKeyboardState':
    case 'const MLLifecycleCallbacks':
    case 'MLLifecycleSelfInfo':
    case 'const MLLifecycleInitArgList':
    case 'MLLifecycleInitArgList':
    case 'MLLightingTrackingAmbientGlobalState':
    case 'MLLightingTrackingAmbientGridState':
    case 'MLLightingTrackingColorTemperatureState':
    case 'MLLogLevel':
    case 'MLMediaCodecCreation':
    case 'MLMediaCodecType':
    case 'MLMediaCodecCallbacks':
    case 'const uint8_t':
    case 'MLMediaCodecBufferInfo':
    case 'MLMediaCodecListCodecTypeFlag':
    case 'MLMediaCodecListQueryResults':
    case 'MLMediaCodecListCapabilityFlag':
    case 'const MLMediaDRMByteArray':
    case 'MLMediaDataSourceReadAt':
    case 'MLMediaDataSourceGetSize':
    case 'MLMediaDataSourceClose':
    case 'MLMediaDRMByteArray':
    case 'MLMediaDRMKeyValueArray':
    case 'MLMediaDRMByteArrayList':
    case 'MLMediaDRMRequestMessage':
    case 'const MLMediaDRMKeyValue':
    case 'MLMediaDRMEventListener':
    case 'MLMediaDRMErrorCode':
    case 'const MLMediaDRMKeyRequestInputParam':
    case 'MLMediaDRMProperty':
    case 'const MLMediaDRMCryptoInputParam':
    case 'const MLMediaDRMHMACInputParam':
    case 'const MLMediaDRMRSAInputParam':
    case 'MLMediaExtractorDRMSchemeInitData':
    case 'MLMediaExtractorSeekPostion':
    case 'MLMediaExtractorPSSHEntry':
    case 'MLMediaFormatKey':
    case 'MLMediaPlayerTrackType':
    case 'MLMediaPlayerOnFrameAvailableCallback':
    case 'MLMediaPlayerEventCallbacks':
    case 'MLMediaPlayerVideoScalingMode':
    case 'MLMediaStreamSourceOnBufferAvailable':
    case 'const MLMeshingSettings':
    case 'MLMeshingStaticData':
    case 'MLMusicServiceCallbacks':
    case 'MLMusicServiceShuffleState':
    case 'MLMusicServiceRepeatState':
    case 'MLMusicServiceStatus':
    case 'MLMusicServiceError':
    case 'MLMusicServicePlaybackState':
    case 'MLMusicServiceRepeatState':
    case 'MLMusicServiceShuffleState':
    case 'MLMusicServiceMetadata':
    case 'const MLOcclusionDepthBufferInfo':
    case 'MLPerceptionSettings':
    case 'MLSnapshot':
    case 'const MLPlanesQuery':
    case 'MLPlane':
    case 'MLPrivilegeID':
    case 'const MLRaycastQuery':
    case 'MLRaycastResult':
    case 'MLImage':
    case 'MLScreensWatchHistoryList':
    case 'MLScreensScreenInfoList':
    case 'MLScreensWatchHistoryEntry':
    case 'const MLImage':
    case 'const MLScreensWatchHistoryEntry':
    case 'const MLImage':
    case 'MLScreensWatchHistoryList':
    case 'MLImage':
    case 'MLScreensScreenInfoList':
    case 'const MLSharedFileList':
    case 'MLSharedFileErrorCode':
    case 'const MLSnapshot':
    case 'const MLCoordinateFrameUID':
    case 'MLTransform':
    case 'const MLTokenAgentClientCredentials':
    case 'onFilesPickedCb':
      return 'Number';
    case 'const char':
      return 'String';
    default:
      throw new Error('unknown type: ' + type);
  }
};
const _parseArgs = args => args.map(arg => {
  const match = arg.match(/^((?:const )?\S+(?:\s+\*+)?)\s+(.+)/);
  if (!match) {
    throw new Error('fail: ' + arg);
  }
  const type = _cleanType(match[1]);
  const name = match[2];
  // console.log('name', {type, name});
  return {
    type,
    name,
  };
});

const dir = process.argv[2];
if (dir && fs.lstatSync(dir).isDirectory(dir)) {
  const fns = [];

  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (/\.h$/.test(file)) {
      const s = fs.readFileSync(path.join(dir, file), 'utf8');
      const lines = s.split('\n');
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        if (!/\.\.\./.test(line)) {
          const match = line.match(/ML_API\s+((?:const )?\S+(?: \*+)?)\s+(.+?)\((.+)\);\s*$/);
          if (match) {
            try {
              const argStrings = match[3].split(/,\s+/);
              const type = _cleanType(match[1]);
              const name = _cleanName(match[2]);
              // console.log('parse type name args', {type, name, argStrings});
              const args = _parseArgs(argStrings);
              if (/\(/.test(type) || /ML_CALL/.test(type) || /ML_CALL/.test(name)) {
                console.warn({line, type, name});
                throw new Error('failed to gen');
              }
              fns.push({
                type,
                name,
                args,
              });
            } catch(err) {
              console.warn(line, err.stack);
            }
          }
        }
      }
    }
  }

  let result = '';
  // console.log('got fns', fns.length);
  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i];
    const {type, name, args} = fn;
    result += 'NAN_METHOD(' + name + ') {\n';
    for (let j = 0; j < args.length; j++) {
      const arg = args[j];
      const {type, name} = arg;
      const jsType = _getJsType(type);
      result += `  const ${type} ${name} = Nan::New<${jsType}>(info[${j}]);\n`;
    }
    result += '\n';
    result += `  ${name}(`;
    for (let j = 0; j < args.length; j++) {
      const arg = args[j];
      const {name} = arg;
      result += name;
      if (j !== (args.length - 1)) {
        result += ', ';
      }
    }
    result += `);\n`;
    result += '}\n\n';
  }

  // console.log(JSON.stringify(fns, null, 2));
  console.log(result);
} else {
  console.warn('usage: index.js <MLSDK headers directory>');
}
