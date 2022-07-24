// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  TITLE: 'journal',
  AUTH_HOST: 'http://localhost:9004/v1/security',
  API_HOST: 'http://localhost:9005',
  USERS_BACKEND: {
    PASSWORD_CHANGE_ENDPOINT: `/api/users/password/change/`,
    PASSWORD_RESET_ENDPOINT: `/api/users/password/reset/`,
    PASSWORD_RESET_CONFIRM_ENDPOINT: `/api/users/password/reset/confirm/`,
    REGISTRATION_ENDPOINT: `/api/users/registration/`,
    USER_ENDPOINT: `/api/users/user/`,
    USER_PATCH_ENDPOINT: `/api/users/profile/`
  },
  ENABLE_AUTH: true,
  AUTH_BACKEND: {
    AUTH_PARAM: 'username', // email or username
    AUTH_FIELDS: {
      USERNAME_FIELD: {
        LABEL: 'Username',
        PLACE_HOLDER_TEXT: 'Username or phone number',
        INPUT_TYPE: 'text', // Other alternatives 'tel', 'email'
        ARIA_LABEL: '',
      }
    },
    AUTH_HEADER_PREFIX: 'Bearer',
    TOKEN: {
      default: false,
      AUTH_ENDPOINT: `/api/users/login/`,
    },
    JWT: {
      default: true,
      AUTH_LOGIN_ENDPOINT: `/login`,
      AUTH_REGISTER_ENDPOINT: `/user/registration`,
      AUTH_FORGOTPWD_ENDPOINT: `/password/reset/send/`,
      AUTH_VERIFICATION_ENDPOINT: `/api-token-verify/`,
      TOKEN_REFRESH_ENDPOINT: `/api/users/refresh_token/`
    },
    EXTRA_LOGIN_PARAMS: {
      client_id: '',
      grant_type: 'password'
    }
  },
  USERS_ENDPOINT: `/api/users/user/`,
  PAGINATION_TYPE: `link`, // Options 'limit_offset' / 'link' / 'page_number'
  PAGE_SIZE: 10
};

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
