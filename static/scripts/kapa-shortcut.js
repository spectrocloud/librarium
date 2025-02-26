(function () {
  let k = window.Kapa;
  if (!k) {
    let i = function () {
      i.c(arguments);
    };
    i.q = [];
    i.c = function (args) {
      i.q.push(args);
    };
    window.Kapa = i;
  }
})();

document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "i") {
    event.preventDefault();

    // Get the shadow root of the Kapa widget
    const kapaContainer = document.querySelector("#kapa-widget-container");
    const shadowRoot = kapaContainer?.shadowRoot;

    if (!shadowRoot) return; // Exit if the shadow root is not found

    // Navigate inside the shadow DOM to find the modal
    const kapaPortal = shadowRoot.querySelector("#kapa-widget-portal");

    if (!kapaPortal) return; // Exit if the portal is not found

    // Now we can access the actual modal element
    const modal = kapaPortal.querySelector(".mantine-Modal-root"); // Adjust selector as needed

    if (modal && modal.children.length > 0) {
      // Modal is open → Close it
      window.Kapa("close");
    } else {
      // Modal is closed or not found → Open it
      window.Kapa("open");
    }
  }
});
