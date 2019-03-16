---
path: '/osa-3/3-n-plus-1-kyselyn-ongelma'
title: 'N+1 kyselyn ongelma'
hidden: true
---


Tietokanta-abstraktioita tarjoavat kirjastot päättävät miten haettavaan olioon liittyvät viitteet haetaan. Yksi vaihtoehto on hakea viitatut oliot automaattisesti kyselyn yhteydessä ("Eager"), toinen vaihtoehto taas on hakea viitatut oliot vasta kun niitä pyydetään eksplisiittisesti esimerkiksi get-metodin kautta ("Lazy").

Tyypillisesti one-to-many ja many-to-many -viitteet haetaan vasta niitä tarvittaessa, ja one-to-one ja many-to-one viitteet heti. Oletuskäyttäytymistä voi muuttaa `@ManyToOne`, `@OneToMany` ym annotaatioihin lisättävän <a href="http://docs.oracle.com/javaee/6/api/javax/persistence/FetchType.html" target="_blank">FetchType</a>-parametrin avulla.

<br/>

Alla olevassa esimerkissä ehdotamme, että henkilöön liittyvät tilit haetaan tietokannasta samalla kun henkilö haetaan.

```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<Tili> tilit = new ArrayList<>();

}
```

Springin käyttämä tietokanta-abstraktiokirjasto Hibernate toteuttaa tiedon hakemisen siten, että se luo tietokantaa kuvaavien luokkien get-metodeille metodit kapseloivat "Proxy"-metodit. Kun get-metodia kutsutaan, tarvittavat tiedot haetaan tietokannasta. Edellä kuvatun `FetchType`-parametrin avulla vaikutetaan tähän toimintaan.


## N+1 Kyselyn ongelma

Viitattujen olioiden lataaminen vasta niitä tarvittaessa on yleisesti ottaen hyvä idea, mutta sillä on myös kääntöpuolensa.

Pankkijärjestelmässämme yksittäiseen pankkiin liittyvät konttorit tulostetaan HTML-sivulla Thymeleafin avulla seuraavasti.

```html
Pankin konttorit:
<ul>
    <li th:each="konttori: ${pankki.konttorit}">
        <span th:text="${konttori.osoite}">Konttorin osoite</span>
    </li>
</ul>
```

- TÄSSÄ EI n+1 -kyselyn ongelmaa, sillä konttorit-kutsu selkeä

- TODO: esimerkki, missä ongelma esiintyy


```html
Pankin konttorit:
<ul>
    <li th:each="konttori: ${pankki.konttorit}">
        <span th:text="${konttori.pankki.nimi}">Konttorin nimi</span>
    </li>
</ul>
```

```

spring.jpa.show-sql=true
```


Pohditaan tilannetta, missä kirjalla voi olla monta kirjoittajaa, ja kirjoittajalla monta kirjaa -- `@ManyToMany`. Jos haemme tietokannasta listan kirjoja (1 kysely), ja haluamme tulostaa kirjoihin liittyvät kirjoittajat, tehdään jokaisen kirjan kohdalla erillinen kysely kyseisen kirjan kirjoittajille (n kyselyä). Tätä ongelmaa kutsutaan N+1 -kyselyn ongelmaksi.


Jos kirjoja tarvitaan sekä ilman kirjoittajaa että kirjoittajan kanssa, on FetchType-parametrin asettaminen `EAGER`-tyyppiseksi yksi vastaus. Tällöin kuitenkin osassa tapauksista haetaan ylimääräistä dataa tietokannasta. Toinen vaihtoehto on luoda erillinen kysely yhdelle vaihtoehdoista, ja lisätä kyselyyn vinkki (<a href="http://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-hints" target="_blank">Spring Data JPA, applying query hints</a>) kyselyn toivotusta toiminnallisuudesta.



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


