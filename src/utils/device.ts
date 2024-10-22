export function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileAgent = /android|iPhone|iPad|iPod/i.test(userAgent);
  const isMobileScreen = window.innerWidth <= 768;

  return isMobileAgent || isMobileScreen;
}
