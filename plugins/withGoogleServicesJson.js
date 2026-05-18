const { withDangerousMod } = require('@expo/config-plugins')
const path = require('path')
const fs = require('fs')

const withGoogleServicesAndroid = (config) => {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const src = path.resolve(config.modRequest.projectRoot, 'google-services.json')
      const dest = path.resolve(config.modRequest.platformProjectRoot, 'app', 'google-services.json')
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
      }
      return config
    },
  ])
}

const withGoogleServicesIos = (config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const src = path.resolve(config.modRequest.projectRoot, 'GoogleService-Info.plist')
      const projectName = config.modRequest.projectName
      const dest = path.resolve(config.modRequest.platformProjectRoot, projectName, 'GoogleService-Info.plist')
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
      }
      return config
    },
  ])
}

const withGoogleServicesJson = (config) => {
  config = withGoogleServicesAndroid(config)
  config = withGoogleServicesIos(config)
  return config
}

module.exports = withGoogleServicesJson
