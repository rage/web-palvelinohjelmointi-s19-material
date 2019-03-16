---
path: '/osa-3/3-n-plus-1-kyselyn-ongelma'
title: 'N+1 kyselyn ongelma'
hidden: true
---


Tietokanta-abstraktioita tarjoavat kirjastot päättävät miten haettavaan olioon liittyvät viitteet haetaan. Käytössä on pääsääntöisesti kaksi vaihtehtoa. Ensimmäinen vaihtoehto on hakea viitatut oliot samalla kun viittaavaa oliota haetaan (Eager). Toinen vaihtoehto on hakea viitatut oliot vasta kun niitä pyydetään eksplisiittisesti esimerkiksi olion get-metodin kautta (Lazy).

Viitattujen olioiden lataaminen vasta niitä tarvittaessa on yleisesti ottaen hyvä idea, mutta sillä on myös kääntöpuolensa.

Pohditaan pankkijärjestelmäämme, missä henkilöllä voi olla monta tiliä, ja yhdellä tilillä voi olla monta omistajaa -- `@ManyToMany`.

Luodaan sovellukseen sivu, joka tulostaa jokaisen tilin yhteydessä tilin omistajien lukumäärän. Kontrollerin puolella toteutus on helppo -- haemme tilit tietokannasta ja lisäämme ne modeliin.

```java
model.addAttribute("tilit", tiliRepository.findAll());
return "tilit";
```

HTML-sivullakin toteutus on suhteellisen suoraviivainen.

```html
<h1>Tilit</h1>

<ul>
    <li th:each="tili: ${tilit}">
        <a th:href="@{/tilit/{id}(id=${tili.id})}">
            Tili: <span th:text="${tili.id}">tilin id</span>,
            Saldo: <span th:text="${tili.saldo}">saldo</span>,
            Omistajia <span th:text="${tili.omistajat.size()}">lukumäärä</span>
        </a>
    </li>
</ul>
```

Kun haemme kontrollerissa tilit, sovellus tekee yhden tietokantakyselyn. Kun tulostamme tiliin liittyvien omistajien lukumäärän, tulee omistajat hakea. Tämä tehdään tilikohtaisesti, joten kyselyitä tehdään yksi jokaista tiliä kohden. Tätä ongelmaa, missä näennäisesti yksinkertainen tiedon näyttäminen paisuu isoksi joukoksi tietokantakyselyitä kutsutaan N+1 -kyselyn ongelmaksi -- ongelmassa tehdään N-kyselyä alkuperäisen yhden kyselyn lisäksi.

Ongelman voi ratkaista useammalla tavalla. Ensimmäinen ratkaisu on poistaa N+1 -kyselyn ongelman aiheuttava osa sovelluksestamme -- kuinka tärkeää on näyttää tilin omistajien lukumäärä? Toinen ratkaisu on denormalisoida tietokantaa hieman, jolloin tauluun Tili lisättäisiin oma sarake omistajien lukumäärälle -- tämä vaatisi uuden sarakkeen tiedon ylläpidot automaattisesti. Kolmas ratkaisu on toteuttaa sivulle erillinen kysely, joka hakee sekä tilit että tilin omistajien lukumäärän -- tietokanta-abstraktio ei tiedä että haluamme vain omistajien lukumäärän, joten se yrittää hakea kaikki tiedot; yksinkertainen yhteenvetokysely ajaisi täysin saman asian. Neljäs vaihtoehto -- joka on tulossa yhä suositummaksi -- on käyttää ns. Entity Grapheja kyselyssä. Tästä lisää mm. osoitteessa <a href="https://www.baeldung.com/jpa-entity-graph" target="_blank">https://www.baeldung.com/jpa-entity-graph</a>.

<br/>

Neljännessä vaihtoehdossa kuvatun Entity Graphien avulla metodin `findAll` voisi korvata uudella toteutuksella, joka hakee tilien haun yhteydessä myös tilien omistajat. Tämä näyttäisi seuraavalta.

```java
public interface TiliRepository extends JpaRepository<Tili, Long> {

    @EntityGraph(attributePaths = {"omistajat"})
    List<Tili> findAll();
}
```

Teemaan voi tarkemmin syventyä Spring Data JPA-projektin <a href="https://docs.spring.io/spring-data/jpa/docs/current/reference/html/" target="_blank">dokumentaatiossa</a>.

<br/>

Kantamme tässä materiaalissa on kuitenkin se, ettei sovelluksen ennenaikaiseen optimointiin kannata juurikaan käyttää aikaa -- korjataan ongelmat sitä mukaa kun niitä kohdataan. <a href="https://en.wikipedia.org/wiki/Donald_Knuth" target="_blank">Knuthin</a> sanoin, *Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.*

<br/>


TODO: tehtävä


```

spring.jpa.show-sql=true
```




Jos kirjoja tarvitaan sekä ilman kirjoittajaa että kirjoittajan kanssa, on FetchType-parametrin asettaminen `EAGER`-tyyppiseksi yksi vastaus.



<programming-exercise name='Airports and aircrafts (2 osaa)'>


Jatkokehitetään tässä tehtävässä sovellusta lentokoneiden ja lentokenttien hallintaan. Projektissa on jo valmiina ohjelmisto, jossa voidaan lisätä ja poistaa lentokoneita. Tavoitteena on lisätä toiminnallisuus lentokoneiden kotikenttien asettamiseksi.


<h2>Tallennettavat: `Aircraft` ja `Airport`.</h2>

Lisää luokkaan `Aircraft` attribuutti `airport`, joka kuvaa lentokoneen kotikenttää, ja on tyyppiä `Airport`. Koska usealla lentokoneella voi olla sama kotikenttä, käytä attribuutille `airport` annotaatiota `@ManyToOne`. Lisää attribuutille myös `@JoinColumn`-annotaatio, jonka avulla kerrotaan että tämä attribuutti viittaa toiseen tauluun. Lisää luokalle myös oleelliset get- ja set-metodit.

Lisää seuraavaksi `Airport`-luokkaan attribuutti `aircrafts`, joka kuvaa kaikkia koneita, keiden kotikenttä kyseinen kenttä on, ja joka on tyyppiä `List&lt;Aircraft&gt;`. Koska yhdellä lentokentällä voi olla useita koneita, lisää attribuutille annotaatio `@OneToMany`. Koska luokan `Aircraft` attribuutti `airport` viittaa tähän luokkaan, aseta annotaatioon `@OneToMany` parametri `mappedBy="airport"`. Nyt luokka `Airport` tietää että attribuuttiin `aircrafts` tulee ladata kaikki `Aircraft`-oliot, jotka viittaavat juuri tähän kenttään.

Lisää lisäksi `Airport`-luokan `@OneToMany`-annotaatioon parametri `fetch = FetchType.EAGER`, jolloin lentokenttään liittyvät lentokoneet haetaan kyselyn yhteydessä.

Lisää lopuksi luokalle `Airport` oleelliset get- ja set-metodit.


<h2>Lentokentän asetus lentokoneelle</h2>

Lisää sovellukselle toiminnallisuus lentokentän lisäämiseen lentokoneelle. Käyttöliittymä sisältää jo tarvittavan toiminnallisuuden, joten käytännössä tässä tulee toteuttaa luokalle `AircraftController` metodi `String assignAirport`. Kun käyttäjä lisää lentokoneelle lentokenttää, käyttöliittymä lähettää POST-tyyppisen kyselyn osoitteeseen `/aircrafts/{aircraftId}/airports`, missä `aircraftId` on lentokoneen tietokantatunnus. Pyynnön mukana tulee lisäksi parametri `airportId`, joka sisältää lentokentän tietokantatunnuksen.


Toteuta metodi siten, että haet aluksi pyynnössä saatuja tunnuksia käyttäen lentokoneen ja lentokentän, tämän jälkeen asetat lentokoneelle lentokentän ja lentokentälle lentokoneen, ja lopuksi tallennat haetut oliot.

Ohjaa lopuksi pyyntö osoitteeseen `/aircrafts`

Kun olet valmis, lähetä sovellus TMC:lle tarkistettavaksi.


</programming-exercise>


