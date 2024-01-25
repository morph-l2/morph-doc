import Log from 'web-sdk';

let userLang;
let pageInfoList;
let baseURL = "https://log.noxiaohao.com";

const webName = 'mph_web';

const brand = 'morphism';
const business1 = 'morphism';
const business2 = 'website';

const pathnames = {
  '/': 'docs_page',
}

const events = {
  // docs
  'docs_page': 'b5446',
}


export const log = ({
  page = 'docs_page',
}) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    userLang = navigator.language || navigator.userLanguage
  
    pageInfoList = [{
      path: '',
      curr_page: '/',
      brand,
      business1,
      business2,
      event_tracking: `${webName}_${page}`,
      event_tracking_id: `${events[page]}`,
      event_tracking_ext: {
        usr_language: userLang
      }
    }];
  
    return new Log({
      app_id: 'xyz.morphism.pc',
      app_name: webName,
      // ver: '',
      // uid: '',
    }, pageInfoList, {
      baseURL
    });
  }
}

export const websiteTabClick = ({
  event,
  page = 'docs_page',
}) => {
  if (typeof window === 'undefined') return;
  
  page = pathnames[location.pathname] || pathnames['/']
  
  try {
    log({
      page,
    })?.click({
      business1,
      business2,
      event_tracking: `${webName}_${event}`,
      event_tracking_id: events[event],
      event_tracking_ext: {
        user_language: userLang
      }
    });
  } catch (err) {
      console.log(`websiteTabClick ${event} ${events[event]}`, err)
  }
}
