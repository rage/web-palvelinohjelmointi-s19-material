---
path: '/osa-2/3-tietokantojen-kasittely'
title: 'Tietokantojen käsittely ohjelmallisesti'
hidden: true
---

TODO: koko tietokantakertojen perusteisiin liittyvä sisältö pois?

Suurin osa web-sovelluksista tarvitsee tiedon tallentamis- ja hakutoiminnallisuutta. Tietoa voidaan tallentaa levylle tiedostoihin, tai sitä voidaan tallentaa erilaisiin tietokantaohjelmistoihin. Nämä tietokantaohjelmistot voivat sijaita erillisellä koneella web-sovelluksesta, tai ne voivat itsekin olla web-sovelluksia. Toteutusperiaatteista riippumatta näiden sovellusten ensisijainen tehtävä on varmistaa, ettei käytettävä tieto katoa.


Käytämme tällä kurssilla <a href="http://www.h2database.com/html/main.html" target="_blank">H2-tietokantamoottoria</a>, joka tarjoaa rajapinan SQL-kyselyiden tekemiseen. H2-tietokantamoottorin saa käyttöön lisäämällä projektin `pom.xml`-tiedostoon seuraavan riippuvuuden.


```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>1.4.196</version>
</dependency>
```


Tietokantaa käyttävä ohjelma sisältää tyypillisesti tietokantayhteyden luomisen, tietokantakyselyn tekemisen tietokannalle, sekä tietokannan palauttamien vastausten läpikäynnin. Javalla edellämainittu näyttää esimerkiksi seuraavalta -- alla oletamme, että käytössä on tietokantataulu "Book", jossa on sarakkeet "id" ja "name".


```java
// Open connection to database
Connection connection = DriverManager.getConnection("jdbc:h2:./database", "sa", "");

// Create query and retrieve result set
ResultSet resultSet = connection.createStatement().executeQuery("SELECT * FROM Book");

// Iterate through results
while (resultSet.next()) {
    String id = resultSet.getString("id");
    String name = resultSet.getString("name");

    System.out.println(id + "\t" + name);
}

// Close the resultset and the connection
resultSet.close();
connection.close();
```


Oleellisin tässä on luokka <a href="https://docs.oracle.com/javase/8/docs/api/java/sql/ResultSet.html" target="_blank">ResultSet</a>, joka tarjoaa pääsyn rivikohtaisiin tuloksiin. Kurssin <a href="http://tietokantojen-perusteet.github.io/" target="_blank">tietokantojen perusteet</a> oppimateriaali sisältää myös hieman tietoa ohjelmallisista tietokantakyselyistä.



<text-box variant='hint' name='Tietokantayhteyden luomisesta'>

Komento `DriverManager.getConnection("jdbc:h2:./database", "sa", "");` luo JDBC-yhteyden tietokantaan nimeltä "database". Käyttäjätunnuksena käytetään tunnusta "sa", jonka salasana on "".

Jos "database"-nimistä tietokantaa ei ole, luodaan se levyjärjestelmään projektin juureen. Tässä tapauksessa luodaan tiedosto `database.mv.db` sekä mahdollisesti `database.trace.db`. Tietokantayhteyden voi luoda myös muistiin ladattavaan tietokantaan, jolloin tietokantaa ei luoda levyjärjestelmään -- tällöin tietokannassa oleva tieto kuitenkin katoaa ohjelman sammutuksen yhteydessä.

Tarkempi opas H2-tietokannan tarjoamiin toimintoihin löytyy osoitteesta <a href="http://www.h2database.com/html/tutorial.html" target="_blank">http://www.h2database.com/html/tutorial.html</a>.


</text-box>

Tietokannalla on tyypillisesti skeema, joka määrittelee tietokantataulujen rakenteen. Rakenteen lisäksi tietokantatauluissa on dataa. Kun tietokantasovellus käynnistetään ensimmäistä kertaa, nämä tyypillisesti ladataan myös käyttöön. H2-tietokantamoottori tarjoaa tätä varten työvälineitä <a href="http://www.h2database.com/javadoc/org/h2/tools/RunScript.html" target="_blank">RunScript</a>-luokassa. Alla olevassa esimerkissä tietokantayhteyden avaamisen jälkeen yritetään lukea tekstitiedostoista `database-schema.sql` ja `database-import.sql` niiden sisältö tietokantaan.

Tiedosto `database-schema.sql` sisältää tietokantataulujen määrittelyt, ja tiedosto `database-import.sql` tietokantaan lisättävää tietoa. Järjestys on oleellinen -- jos tietokantataulujen määrittelyiden syöttämisessä tapahtuu virhe, ovat tietokantataulut olemassa. Tällöin tietoa ei myöskään ladata tietokantaan.


```java
// Open connection to database
Connection connection = DriverManager.getConnection("jdbc:h2:./database", "sa", "");

try {
    // If database has not yet been created, create it
    RunScript.execute(connection, new FileReader("database-schema.sql"));
    RunScript.execute(connection, new FileReader("database-import.sql"));
} catch (Throwable t) {
    System.out.println(t.getMessage());
}
// ...
```


<programming-exercise name='Hello Database'>

Käytössäsi on agenttien tietoja sisältävä tietokantataulu, joka on määritelty seuraavasti:


```sql
CREATE TABLE Agent (
    id varchar(9) PRIMARY KEY,
    name varchar(200)
);
```

Kirjoita ohjelma, joka tulostaa kaikki tietokannassa olevat agentit.

Tehtävässä ei ole testejä. Palauta tehtävä kun se toimii halutulla tavalla.

</programming-exercise>


<programming-exercise name='Hello Insert'>

Käytössäsi on edellisessä tehtävässä käytetty agenttien tietoja sisältävä tietokantataulu. Toteuta tässä tehtävässä tietokantaan lisäämistoiminnallisuus. Ohjelman tulee toimia seuraavasti:

<sample-output>

Agents in database:
Secret	Clank
Gecko	Gex
Robocod	James Pond
Fox	Sasha Nein

Add one:
What id? **Riddle**
What name? **Voldemort**

Agents in database:
Secret	Clank
Gecko	Gex
Robocod	James Pond
Fox	Sasha Nein
Riddle	Voldemort

</sample-output>

Seuraavalla käynnistyskerralla agentti Voldemort on tietokannassa heti sovelluksen käynnistyessä.


<sample-output>

Agents in database:
Secret	Clank
Gecko	Gex
Robocod	James Pond
Fox	Sasha Nein
Riddle	Voldemort

Add one:
What id? **Feather**
What name? **Major Tickle**

Agents in database:
Secret	Clank
Gecko	Gex
Robocod	James Pond
Fox	Sasha Nein
Riddle	Voldemort
Feather	Major Tickle

</sample-output>

Tehtävässä ei ole testejä. Palauta tehtävä kun se toimii halutulla tavalla.

</programming-exercise>

Edelliset tehtävät antavat vain pienen pintaraapaisun siihen teknologiaan, minkä päälle nykyaikaisten web-sovellusten käyttämät tietokantakirjastot rakentuvat. Vaikka web-sovelluksia voi toteuttaa ilman suurempaa tietämystä niihin liittyvistä taustateknologioista ja ratkaisuista, syventyminen teemaan kannattaa.



# Oliot ja relaatiotietokannat

Relaatiotietokantojen ja olio-ohjelmoinnin välimaastossa sijaitsee tarve olioiden muuntamiseen tietokantataulun riveiksi ja takaisin. Tähän tehtävään käytetään ORM (<a href="https://en.wikipedia.org/wiki/Object-relational_mapping" target="_blank">Object-relational mapping</a>) -ohjelmointitekniikkaa, jota varten löytyy merkittävä määrä valmiita työvälineitä sekä kirjastoja.

ORM-työvälineet tarjoavat ohjelmistokehittäjälle mm. toiminnallisuutta tietokantataulujen luomiseen määritellyistä luokista, jonka lisäksi ne helpottavat kyselyjen muodostamista ja hallinnoivat luokkien välisiä viittauksia. Tällöin ohjelmoijan vastuulle jää sovellukselle tarpeellisten kyselyiden toteuttaminen vain niiltä osin kun ORM-kehykset eivät niitä pysty automaattisesti luomaan.

Relaatiotietokantojen käsittelyyn Javalla löytyy joukko ORM-sovelluksia. Oracle/Sun standardoi olioiden tallentamisen relaatiotietokantoihin <a href="http://en.wikipedia.org/wiki/Java_Persistence_API" target="_blank">JPA</a> (*Java Persistence API*) -standardilla. JPA:n toteuttavat kirjastot (esim. <a href="http://www.hibernate.org/" target="_blank">Hibernate</a>) abstrahoivat relaatiotietokannan ja helpottavat kyselyjen tekemistä suoraan ohjelmakoodista.

Koska huomattava osa tietokantatoiminnallisuudesta on hyvin samankaltaista ("tallenna", "lataa", "poista", ...), voidaan perustoiminnallisuus piilottaa käytännössä kokonaan ohjelmoijalta. Tällöin ohjelmoijalle jää tehtäväksi usein vain sopivan rajapintaluokan määrittely. Esimerkiksi aiemmin nähdyn `Henkilo`-luokan tallentamistoiminnallisuuteen tarvitaan seuraavanlainen rajapinta.

TODO: katso flow, voi olla parempi että repo mainitaan vasta myöhemmin


```java
// pakkaus ja importit
public interface HenkiloRepository extends JpaRepository<Henkilo, Long> {
}
```

Kun rajapintaa käytetään, Spring osaa tuoda sopivan toteutuksen ohjelman käyttöön. Käytössä tulee olla Maven-riippuvuus Spring-projektin Data JPA -kirjastoon.

TODO: tähän dependency injectionista taas muistutus


```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>
```


## Luokan määrittely tallennettavaksi


JPA-standardin mukaan luokka tulee määritellä *entiteetiksi*, jotta siitä tehtyjä olioita voi tallentaa JPA:n avulla tietokantaan.

Jokaisella tietokantaan tallennettavalla luokalla tulee olla annotaatio `@Entity` sekä `@Id`-annotaatiolla merkattu attribuutti, joka toimii tietokantataulun ensisijaisena avaimena. JPA:ta käytettäessä `id`-attribuutti on usein numeerinen (`Long` tai `Integer`), mutta merkkijonojen käyttö on yleistymässä. Näiden lisäksi, luokan tulee toteuttaa `Serializable`-rajapinta.

Numeeriselle avainattribuutille voidaan lisäksi määritellä annotaatio `@GeneratedValue(strategy = GenerationType.AUTO)`, joka antaa id-kentän arvojen luomisen vastuun tietokannalle. Tietokantatauluun tallennettava luokka näyttää seuraavalta:


```java
// pakkaus

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Henkilo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String nimi;

    // getterit ja setterit
```

Tietokantaan luotavien sarakkeiden ja tietokantataulun nimiä voi muokata annotaatioiden `@Column` ja `@Table` avulla.


```java
// pakkaus

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Henkilo")
public class Henkilo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;
    @Column(name = "nimi")
    private String nimi;
    // getterit ja setterit
```


Ylläoleva konfiguraatio määrittelee luokasta `Henkilo` tietokantataulun nimeltä "Henkilo", jolla on sarakkeet "id" ja "nimi". Sarakkeiden tyypit päätellään muuttujien tyyppien perusteella.

Spring Data JPA:n <a href="http://docs.spring.io/autorepo/docs/spring-data-jpa/current/api/org/springframework/data/jpa/domain/AbstractPersistable.html" target="_blank">AbstractPersistable</a>-luokkaa käytettäessä ylläolevan luokan määrittely kutistuu hieman. Yläluokka AbstractPersistable määrittelee pääavaimen, jonka lisäksi luokka toteuttaa myös rajapinnan Serializable.


```java
// pakkaus ja importit

@Entity
@Table(name = "Henkilo")
public class Henkilo extends AbstractPersistable<Long> {

    @Column(name = "nimi")
    private String nimi;
    // getterit ja setterit
```

Jos tietokantataulun ja sarakkeiden annotaatioita ei eksplisiittisesti määritellä, niiden nimet päätellään luokan ja muuttujien nimistä.

```java
// pakkaus ja importit

@Entity
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
    // getterit ja setterit
```



### Rajapinta tallennettavan luokan käsittelyyn

Kun käytössämme on tietokantaan tallennettava luokka, voimme luoda tietokannan käsittelyyn käytettävän *rajapinnan*. Kutsutaan tätä rajapintaoliota nimellä `HenkiloRepository`.


```java
// pakkaus

import wad.domain.Henkilo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HenkiloRepository extends JpaRepository<Henkilo, Long> {

}
```

Rajapinta perii Spring Data-projektin `JpaRepository`-rajapinnan; samalla kerromme, että tallennettava olio on tyyppiä `Henkilo` ja että tallennettavan olion pääavain on tyyppiä `Long`. Tämä tyyppi on sama kuin aiemmin `AbstractPersistable`-luokan perinnässä parametriksi asetettu tyyppi. Spring osaa käynnistyessään etsiä mm. `JpaRepository`-rajapintaluokan periviä luokkia. Jos niitä löytyy, se luo niiden pohjalta tietokannan käsittelyyn sopivan olion sekä asettaa olion ohjelmoijan haluamiin muuttujiin.

TODO: DI ja IoC maininta


### Tietokanta-abstraktion tuominen kontrolleriin

Kun olemme luoneet rajapinnan `HenkiloRepository`, voimme lisätä sen kontrolleriluokkaan. Tämä tapahtuu määrittelemällä tietokanta-abstraktiota kuvaavan rajapinnan olio kontrollerin oliomuuttujaksi. Oliomuuttujalle asetetaan lisäksi annotaatio `@Autowired`, mikä kertoo Springille, että rajapintaan tulee asettaa olio.

TODO: lyhyesti autowired Palaamme annotaation @Autowired merkitykseen tarkemmin myöhemmin.


```java
// ...

@Controller
public class HenkiloController {

    @Autowired
    private HenkiloRepository henkiloRepository;

    // ...
}
```

Nyt tietokantaan pääsee käsiksi `HenkiloRepository`-olion kautta. Osoitteessa <a href="http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html" target="_blank">http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html</a> on JpaRepository-rajapinnan API-kuvaus, mistä löytyy rajapinnan tarjoamien metodien kuvauksia. Voimme esimerkiksi toteuttaa tietokannassa olevien olioiden listauksen sekä yksittäisen olion haun seuraavasti:

TODO: pathvariablet eivät vielä tuttuja

```java
// ...

@Controller
public class HenkiloController {

    @Autowired
    private HenkiloRepository henkiloRepository;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("list", henkiloRepository.findAll());
        return "henkilot"; // erillinen henkilot.html
    }

    @GetMapping("/{id}")
    public String findOne(Model model, @PathVariable Long id) {
        Henkilo henkilo = henkiloRepository.getOne(id);

        model.addAttribute("henkilo", henkilo);
        return "henkilo"; // erillinen henkilo.html
    }
}
```


Pääavaimella etsittäessä tulee löytyä korkeintaan yksi henkilö Spring Data JPA:n API käyttää osassa kyselyitä Java 8:n tarjoamaa <a href="https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html" target="_blank" norel>Optional</a>-luokkaa tämän rajoitteen varmistamiseen.


<programming-exercise name='Item Database'>

Tässä tehtävässä on valmiiksi toteutettuna tietokantatoiminnallisuus sekä esineiden noutaminen tietokannasta. Lisää sovellukseen toiminnallisuus, jonka avulla esineiden tallentaminen tietokantaan onnistuu valmiiksi määritellyllä lomakkeella.

Toteuta siis kontrolleriluokkaan sopiva metodi (tarkista parametrin tai parametrien nimet HTML-sivulta) ja hyödynnä rajapinnan ItemRepository tarjoamia metodeja.

Alla esimerkki sovelluksesta kun tietokantaan on lisätty muutama rivi:

<img class="browser-img" src="/img/2016-mooc/ex15.png"/>

</programming-exercise>


Sovellus luo oletuksena tehtäväpohjan juuripolkuun tietokantatiedostot database.mv.db ja database.trace.db. Jos haluat tyhjentää tietokannan, poista nämä tiedostot ja käynnistä sovellus uudestaan (tai, vaihtoehtoisesti, lisää ohjelmaan poistotoiminnallisuus..)



<programming-exercise name='Todo Database (2 osaa)'>

Luo tässä ensimmäisen osan TodoApplication-tehtävässä nähty tehtävien hallintaan tarkoitettu toiminnallisuus mutta siten, että tehtävät tallennetaan tietokantaan. Tässä entiteettiluokan nimeksi tulee asettaa `TodoItem` ja avaimen tyypin tulee olla `Long`.


```java
@Entity
public class TodoItem extends AbstractPersistable<Long> {
    ...
```

Noudata lisäksi tehtäväpohjassa annettujen HTML-sivujen rakennetta ja toiminnallisuutta.

Sovellus luo tehtäväpohjan juuripolkuun tietokantatiedostot database.mv.db ja database.trace.db. Tietokannan skeema alustetaan kuitenkin uudestaan jokaisen palvelimen käynnistyksen yhteydessä, joten voit hyvin muuttaa tietokantaan tallennettavan tiedon muotoa. Palaamme olemassaolevan tietokannan päivittämiseen myöhemmin kurssilla.

Tehtävä on kahden yksittäisen tehtävän arvoinen.

</programming-exercise>


##

TODO: tarkemmin JpaRepository-luokan tarjoamat toiminnallisuudet
