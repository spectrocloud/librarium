// (function () {
//   let k = window.Kapa;
//   if (!k) {
//     let i = function () {
//       i.c(arguments);
//     };
//     i.q = [];
//     i.c = function (args) {
//       i.q.push(args);
//     };
//     window.Kapa = i;
//   }
// })();

// document.addEventListener("keydown", function (event) {
//   if ((event.ctrlKey || event.metaKey) && event.key === "i") {
//     event.preventDefault();
//     console.log("Kapa shortcut triggered");
//     window.Kapa("open");
//   }
// });
