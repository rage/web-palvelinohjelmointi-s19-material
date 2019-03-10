import React from "react"

import Layout from "../templates/Layout"
import Banner from "../components/Banner"
import GatsbyLink from "gatsby-link"
import { Link } from "gatsby"
import { withLoginStateContext } from "../contexes/LoginStateContext"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core"
import Container from "../components/Container"

const IndexPage = () => (
  <Layout>
    <Banner />
    <Container>
      <section id="yleistä">
        <h1>Tietoa kurssista</h1>
        <p>
          Web-palvelinohjelmointi Java on Helsingin yliopiston kaikille avoin ja
          ilmainen web-palvelinohjelmoinnin perusteet opettava verkkokurssi.
          Kurssilla perehdytään web-sovellusten perusideoihin sekä niiden
          toteuttamiseen. Kurssin käyminen edellyttää kurssien Ohjelmoinnin
          perusteet (TKT10002), Ohjelmoinnin jatkokurssi (TKT10003) ja
          Tietokantojen perusteet (TKT10004) tuntemisen.
        </p>
      </section>

      <section id="sisältö-ja-aikataulu">
        <h2>Sisältö ja aikataulu</h2>

        <p>
          Kurssi koostuu seitsemästä tehtäväsarjasta, ohjelmointiprojektista
          sekä kokeesta.
        </p>

        <p>
          Kurssin laskennallinen työkuorma on noin 135 tuntia. Kunkin
          tehtäväsarjan tekemiseen kannattaa varata noin 12 tuntia, projektiin
          ja siihen liittyviin vertaisarviointeihin noin 40 tuntia, ja kokeeseen
          kertaamiseen noin 8 tuntia. Varaamme oikeuden aikataulun ja aiheiden
          muutoksiin.
        </p>

        <p>
          Kurssin sisältö tarkentuu kurssin edetessä. Tietoa kurssin
          aikatauluista sekä sisällöstä lisätään tälle sivulle kurssin
          aloituksen lähestyessä.
        </p>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aikataulu</TableCell>
              <TableCell>Julkaisu</TableCell>
              <TableCell>Deadline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Osa 1</TableCell>
              <TableCell>8.3.2019</TableCell>
              <TableCell>18.3.2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Osa 2</TableCell>
              <TableCell>15.3.2019</TableCell>
              <TableCell>25.3.2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Osa 3</TableCell>
              <TableCell>22.3.2019</TableCell>
              <TableCell>1.4.2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Osa 4</TableCell>
              <TableCell>29.3.2019</TableCell>
              <TableCell>8.4.2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Osa 5</TableCell>
              <TableCell>5.4.2019</TableCell>
              <TableCell>15.4.2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Osa 6</TableCell>
              <TableCell>12.4.2019</TableCell>
              <TableCell>29.4.2019</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Osa 7</TableCell>
              <TableCell>26.4.2019</TableCell>
              <TableCell>6.5.2019</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p>
          <b>
            Määräajat ovat aina maanantaisin. Määräaikojen kellonajat ovat aina
            23:59:00 – osan 1 tehtävät tulee palauttaa siis viimeistään
            18.3.2019 klo 23:59:00. Virallisena määräaikana käytetään
            tehtäväpalvelimen kelloa, joka on Suomen ajassa. Huomaa, että oman
            koneesi kello voi olla jäljessä tai edellä, joten älä jätä tehtävien
            tekemistä ja palauttamista viime hetkeen.
          </b>
        </p>
      </section>

      <section id="ilmoittautuminen">
        <h2>Ilmoittautuminen</h2>

        <p>Katso tarkemmin sivulta "Arvostelu ja kokeet".</p>
      </section>
    </Container>
  </Layout>
)

export default withLoginStateContext(IndexPage)
