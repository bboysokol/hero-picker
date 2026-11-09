// ============================================================
//  KONFIGURACJA GRY - tu zmieniasz wszystkie teksty
// ============================================================
window.CONFIG = {
  // Jej imię (wyświetlane w grze)
  herName: "Ola",

  // Twój podpis (jak się do Ciebie zwraca)
  myName: "Piegus",

  // Tytuł karty przeglądarki
  pageTitle: "Dla Oli 💜",

  // ---- Etap 1: intro w stylu terminala ----
  introLines: [
    "> booting love.exe ...",
    "> ładowanie wspomnień... [██████████] 100%",
    "> wykryto użytkownika: Ola 💜",
    "> status: bardzo, bardzo kochana",
    "> uruchamiam grę napisaną specjalnie dla Ciebie...",
  ],

  // ---- Etap 2: logowanie ----
  login: {
    title: "Autoryzacja wymagana",
    subtitle: "Tylko jedna osoba na świecie zna to hasło.",
    label: "Jak mnie słodko nazywasz?",
    // akceptowane odpowiedzi (wielkość liter i polskie znaki nie mają znaczenia)
    answers: ["piegus", "piegusek", "piegusku", "pieguś"],
    // podpowiedzi pokazywane po kolejnych błędach
    hints: [
      "Hmm, nie wpuszczę. Jesteś na pewno moją dziewczyną? 🤨",
      "Podpowiedź #1: to słowo, którym mnie nazywasz, kiedy jesteś słodka 🥰",
      "Podpowiedź #2: ma coś wspólnego z kropeczkami na mojej buzi ☀️",
      "Podpowiedź #3: zaczyna się na „P”, a kończy na „-us” 😄",
    ],
    successMsg: "Hasło poprawne — witaj, kochanie 💜",
  },

  // ---- Etap 3: quiz ----
  // type: "choice" (wybór) albo "text" (wpisywanie)
  // correct: indeks poprawnej odpowiedzi (od 0) albo "all" - każda dobra
  quiz: [
    {
      type: "choice",
      question: "Ile razy dziennie o Tobie myślę?",
      options: ["Raz", "Dziesięć", "Sto", "Nie da się tego policzyć"],
      correct: 3,
      wrongMsg: "Za mało! Zdecydowanie za mało 😤",
      rightMsg: "Właśnie tak. Cały czas 💜",
    },
    {
      type: "text",
      question: "Co wspominasz najlepiej?",
      placeholder: "jedno słowo...",
      answers: ["morze", "nad morze", "nad morzem", "morza", "wyjazd nad morze", "baltyk", "plaza"],
      wrongMsg: "Hmm, pomyśl o naszym spontanicznym wyjeździe... 🌊",
      rightMsg: "Morze 🌊 Ten spontaniczny wyjazd nad morze to wyjazd, który zmienił wszystko 💜",
    },
    {
      type: "choice",
      question: "Gdybyśmy byli filmem, to byłby to...",
      options: ["Horror", "Nudny dokument", "Komedia romantyczna z happy endem", "Thriller"],
      correct: 2,
      wrongMsg: "Oj nie, spróbuj jeszcze raz 🙈",
      rightMsg: "I to taki, który chce się oglądać w kółko 🍿💜",
    },
    {
      type: "choice",
      question: "Co lubię w Tobie najbardziej?",
      options: ["Uśmiech", "Oczy", "Charakter", "Jak się śmiejesz"],
      correct: "all",
      rightMsg: "Podchwytliwe — wszystkie odpowiedzi są poprawne 💜",
    },
    {
      type: "text",
      question: "Uzupełnij: Kocham Cię najbardziej na całym ...",
      placeholder: "jedno słowo...",
      answers: ["swiecie", "świecie", "wszechswiecie", "wszechświecie"],
      wrongMsg: "Prawie! Chodzi o coś dużego 🌍",
      rightMsg: "Na całym świecie. I jeszcze trochę dalej 🌍💜",
    },
  ],

  // ---- Etap 4: minigra ----
  game: {
    title: "Naładuj miłość 💜",
    subtitle: "Stukaj w serduszka, zanim odlecą!",
    heartsToWin: 20,
    doneMsg: "Poziom miłości: przekroczono skalę! 🚀",
  },

  // ---- Etap 5: zdrapka ----
  scratch: {
    title: "Mam dla Ciebie sekret 🤫",
    subtitle: "Zdrap palcem, żeby odkryć",
    coverText: "zdrap mnie ✨",
    secret: "Jesteś najlepszym, co mi się w życiu przytrafiło. Każdy dzień z Tobą to mój ulubiony dzień. 💜",
  },

  // ---- Etap 6: pytanie finałowe ----
  question: {
    text: "Kochasz mnie?",
    yes: "Tak 💜",
    noTexts: [
      "Nie",
      "Na pewno?",
      "Przemyśl to 🥺",
      "Serio?!",
      "Ten przycisk nie działa",
      "Nie ma takiej opcji 🙃",
      "No weź...",
    ],
  },

  // ---- Finał ----
  finale: {
    notificationTitle: "Nowa wiadomość 💌",
    notificationText: "Piegus: Kocham Cię! 💜",
    headline: "Kocham Cię, Olu 💜",
    letter: [
      "Wiem, że zwykle piszę kod, a nie listy. Ale tym razem napisałem coś specjalnie dla Ciebie.",
      "Dziękuję, że jesteś. Za każdy uśmiech, każdą rozmowę do późna i za to, że przy Tobie wszystko jest prostsze.",
      "Z Tobą nawet zwykły dzień zamienia się w coś, co chcę zapamiętać na zawsze. Nie wyobrażam sobie, żeby było inaczej.",
    ],
    signature: "Na zawsze Twój, Piegus 💜",
    replay: "Zagraj jeszcze raz",
  },
};
