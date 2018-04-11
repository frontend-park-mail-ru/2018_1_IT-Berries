export function addServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
      .then(() => {

        // console.log('sw registration on scope:', registration.scope);
      })
      .catch(() => {

        // console.error(err);
      });
  }
}