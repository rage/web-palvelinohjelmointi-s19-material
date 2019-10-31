const courseSettings = {
  language: "fi",
  name: "Web-palvelinohjelmointi Java syksy 2019",
  siteUrl: "https://web-palvelinohjelmointi-s19.mooc.fi",
  subtitle: "Opi tekemään verkossa toimivia sovelluksia",
  slug: "web-palvelinohjelmointi-s19",
  tmcCourse: "web-palvelinohjelmointi-s19",
  quizzesId: "490d23d9-baa0-4daf-a505-c235f7dba170",
  tmcOrganization: "mooc",
  bannerPath: "banner.jpg",
  sidebarEntries: [
    {
      title: "Tietoa kurssista",
      path: "/",
    },
    {
      title: "Osaamistavoitteet",
      path: "/osaamistavoitteet",
    },
    {
      title: "Arvostelu ja kokeet",
      path: "/arvostelu-ja-kokeet",
    },
    { title: "Tukiväylät", path: "/tukivaylat" },
    // { title: "Projekti", path: "/projekti"},
    {
      title: "Usein kysytyt kysymykset",
      path: "/usein-kysytyt-kysymykset",
    },
    { separator: true, title: "Web-palvelinohjelmointi Java" },
  ],
  sidebarFuturePages: [
    { title: "Osa 3", tba: "08.11.19" },
    { title: "Osa 4", tba: "15.11.19" },
    { title: "Osa 5", tba: "22.11.19" },
    { title: "Osa 6", tba: "29.11.19" },
    { title: "Osa 7", tba: "06.12.19" },
  ],
  splitCourses: false,
}

module.exports = {
  default: courseSettings,
}
