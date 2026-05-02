declare module '@env' {
  export const IPA_BASE: string
  export const SOCKET_URL: string
  export const API_TIMEOUT: string
  export const ENVIRONMENT: string

  // Auth
  export const LOGIN: string
  export const REGISTER: string
  export const CHANGE_PASSWORD: string
  export const OTP_AUTH: string
  export const FORGOT_PASSWORD: string
  export const RESET_PASSWORD: string
  export const REFRESH_TOKEN: string

  // User
  export const PROFILE_DETAILS: string
  export const CHANGE_PROFILE: string

  // Driver
  export const DRIVER_DETAILS: string
  export const PROFILE_UPDATE: string
  export const STATUS_DRIVER: string
  export const LOCATION_UPDATE: string
  export const IMAGE_UPLOAD: string
  export const IMAGE_DRIVER_PROFILE: string

  // Jobs
  export const ALL_JOBS: string
  export const JOB_DETAILS: string
  export const ACCEPT_JOBS: string
  export const START_JOBS: string
  export const CANCEL_JOBS: string
  export const COMPLETE_RIDE: string
  export const ACTIVE_JOBS_USER: string
  export const ACCEPT_ALL_JOBS: string
  export const COMPLETE_JOBS: string

  // Maps
  export const GOOGLE_MAPS_API_KEY: string
  export const IP_FIND: string

  // New
  export const RESEND_OTP: string
  export const AVAILABLE_JOBS: string
}
