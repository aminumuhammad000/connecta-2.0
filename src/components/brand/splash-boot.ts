export const SPLASH_SEEN_KEY = 'cn_splash_seen'

export const splashBootScript = `try{if(sessionStorage.getItem('${SPLASH_SEEN_KEY}'))document.documentElement.setAttribute('data-splash','off')}catch(e){}`
