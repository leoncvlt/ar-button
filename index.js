// constants to check for various platforms / AR subsytems support
// @see https://github.com/google/model-viewer/blob/master/packages/model-viewer/src/constants.ts
export const compat = {
  IS_MOBILE: (() => {
    const userAgent = navigator.userAgent || navigator.vendor || opera;
    let check = false;
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        userAgent.substr(0, 4)
      )
    ) {
      check = true;
    }
    return check;
  })(),

  IS_ANDROID: /android/i.test(navigator.userAgent),

  // Prior to iOS 13, detecting iOS Safari was relatively straight-forward.
  // As of iOS 13, Safari on iPad (in its default configuration) reports the same
  // user-agent string as Safari on desktop MacOS. Strictly speaking, we only care
  // about iOS for the purposes if selecting for cases where Quick Look is known
  // to be supported. However, for API correctness purposes, we must rely on
  // known, detectable signals to distinguish iOS Safari from MacOS Safari. At the
  // time of this writing, there are no non-iOS/iPadOS Apple devices with
  // multi-touch displays.
  // @see https://stackoverflow.com/questions/57765958/how-to-detect-ipad-and-ipad-os-version-in-ios-13-and-up
  // @see https://forums.developer.apple.com/thread/119186
  // @see https://github.com/google/model-viewer/issues/758
  IS_IOS:
    (/iPad|iPhone|iPod/.test(navigator.userAgent) && !MSStream) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),

  IS_AR_QUICKLOOK_CANDIDATE: (() => {
    const tempAnchor = document.createElement("a");
    return Boolean(
      tempAnchor.relList && tempAnchor.relList.supports && tempAnchor.relList.supports("ar")
    );
  })(),

  IS_SCENEVIEWER_CANDIDATE:
    /android/i.test(navigator.userAgent) &&
    !/firefox/i.test(navigator.userAgent) &&
    !/OculusBrowser/.test(navigator.userAgent),
};

export const activateAR = (props, listener) => {
  const anchor = document.createElement("a");
  const href = setupHref(props);
  if (compat.IS_AR_QUICKLOOK_CANDIDATE) {
    // quick look needs a <img> child to go directly to AR view
    anchor.appendChild(document.createElement("img"));
    anchor.rel = "ar";
  }
  anchor.setAttribute("href", href);
  anchor.click();
  if (listener && compat.IS_AR_QUICKLOOK_CANDIDATE) {
    anchor.addEventListener(
      "message",
      (event) => {
        if (event.data == "_apple_ar_quicklook_button_tapped") {
          button.dispatchEvent(new CustomEvent("quick-look-button-tapped"));
        }
      },
      false
    );
  }
};

const setupHref = (props) => {
  let href = "";
  if (compat.IS_AR_QUICKLOOK_CANDIDATE) {
    const {
      iosSrc,
      applePayButtonType,
      checkoutTitle,
      checkoutSubtitle,
      price,
      callToAction,
      customBanner,
      customHeight,
      noScale,
    } = props;

    href = `${iosSrc}#`;

    if (applePayButtonType) {
      href += `&applePayButtonType=${encodeURIComponent(applePayButtonType)}`;
    }
    if (checkoutTitle) {
      href += `&checkoutTitle=${encodeURIComponent(checkoutTitle)}`;
    }
    if (checkoutSubtitle) {
      href += `&checkoutSubtitle=${encodeURIComponent(checkoutSubtitle)}`;
    }
    if (price) {
      href += `&price=${encodeURIComponent(price)}`;
    }
    if (callToAction) {
      href += `&callToAction=${encodeURIComponent(callToAction)}`;
    }
    if (customBanner) {
      href += `&custom=${encodeURIComponent(customBanner)}`;
    }
    if (customHeight) {
      href += `&customHeight=${encodeURIComponent(customHeight)}`;
    }
    if (noScale != null) {
      href += `&allowsContentScaling=0`;
    }
  } else if (compat.IS_SCENEVIEWER_CANDIDATE) {
    const { src, title, fallbackUrl, link, noScale } = props;

    href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only`;
    if (title) {
      href += `&title=${encodeURIComponent(title)}`;
    }
    if (link) {
      href += `&link=${encodeURIComponent(link)}`;
    }
    if (noScale != null) {
      href += `&resizable=false`;
    }
    href +=
      `#Intent;scheme=https;` +
      `package=com.google.ar.core;` +
      `action=android.intent.action.VIEW;`;
    if (fallbackUrl) {
      href += `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};`;
    }
    href += `end;`;
  }
  return href;
};

export const setupButton = (button) => {
  // skip button if it was already initialized beforehand
  if (button.getAttribute("ar") != null) {
    return;
  }

  if (compat.IS_AR_QUICKLOOK_CANDIDATE) {
    // system supports AR via quick look (on ios this takes precedence on scene viewer)
    button.setAttribute("ar", "quick-look");
    button.dispatchEvent(new CustomEvent("initialized", { detail: "quick-look" }));
    button.addEventListener("click", () => {
      const iosSrc = button.getAttribute("ios-src");
      if (!iosSrc) {
        console.error("Invalid ios-src in <ar-button>: " + button);
        return;
      }

      const applePayButtonType = button.getAttribute("applepay-button-type");
      const checkoutTitle = button.getAttribute("checkout-title");
      const checkoutSubtitle = button.getAttribute("checkout-subtitle");
      const price = button.getAttribute("price");
      const callToAction = button.getAttribute("call-to-action");
      const customBanner = button.getAttribute("custom-banner");
      const customHeight = button.getAttribute("custom-height");
      const noScale = button.getAttribute("no-scale");

      activateAR({
        iosSrc,
        applePayButtonType,
        checkoutTitle,
        checkoutSubtitle,
        price,
        callToAction,
        customBanner,
        customHeight,
        noScale,
      });
    });
  } else if (compat.IS_SCENEVIEWER_CANDIDATE) {
    // system supports AR via scene viewer
    button.setAttribute("ar", "scene-viewer");
    button.dispatchEvent(new CustomEvent("initialized", { detail: "scene-viewer" }));
    button.addEventListener("click", () => {
      const src = button.getAttribute("src");
      if (!src) {
        console.error("Invalid src in <ar-button>: " + button);
        return;
      }

      const title = button.getAttribute("title");
      const fallbackUrl = button.getAttribute("fallback-url");
      const link = button.getAttribute("link");
      const noScale = button.getAttribute("no-scale");

      activateAR({ src, title, fallbackUrl, link, noScale });
    });
  } else {
    // No AR supported on current system, hide the button or sets a fallback url
    button.setAttribute("ar", "unsupported");
    button.dispatchEvent(new CustomEvent("initialized", { detail: "unsupported" }));
    if (button.getAttribute("show-if-unsupported") != null) {
      button.addEventListener("click", () => {
        const fallbackUrl = button.getAttribute("fallback-url");
        if (fallbackUrl) {
          activateAR({ fallbackUrl: encodeURIComponent(fallbackUrl) });
        }
      });
    } else {
      button.style.display = "none";
    }
  }
};

// go through all ar-button tags on the page and initialize them
const buttons = document.querySelectorAll("ar-button");
for (let i = 0; i < buttons.length; i++) {
  const button = buttons.item(i);
  setupButton(button);
}
