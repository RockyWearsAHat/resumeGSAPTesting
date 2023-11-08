const cards = [
  document.getElementById("card1"),
  document.getElementById("card2"),
  document.getElementById("card3"),
  document.getElementById("card4"),
  document.getElementById("card5"),
];

const linkedSites = [
  "https://www.google.com/search?q=test",
  "https://www.google.com/search?q=123",
  "https://www.google.com/search?q=abc",
  "https://www.google.com/search?q=doremi",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
];

for (let i = 0; i < 5; i++) {
  cards[i].addEventListener("click", () => {
    const redirectCurrentWindow = window.confirm(
      `Would You Like To Open This Site In A New Tab?\n\nOK - Yes\nCancel - Redirect The Current Tab`
    );

    if (!redirectCurrentWindow) {
      window.location.replace(linkedSites[i]);
    } else {
      window.open(linkedSites[i]);
    }
  });
}
