const courseSettings = {
  language: "fi",
  name: "Web-palvelinohjelmointi Java syksy 2019",
  siteUrl: "https://web-palvelinohjelmointi-s19.mooc.fi",
  subtitle: "Opi tekemään verkossa toimivia sovelluksia",
  slug: "web-palvelinohjelmointi-java-2019",
  tmcCourse: "web-palvelinohjelmointi-java-19",
  quizzesId: "38240a7b-7e64-4202-91e2-91f6d46f6198",
  tmcOrganization: "mooc",
  bannerPath: "banner.svg",
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
    {
      title: "Usein kysytyt kysymykset",
      path: "/usein-kysytyt-kysymykset",
    },
    { separator: true, title: "Web-palvelinohjelmointi Java" },
  ],
  sidebarFuturePages: [], // { title: "Osa 14", tba: "19.4.2019" },
  splitCourses: true,
}

module.exports = {
  default: courseSettings,
}
