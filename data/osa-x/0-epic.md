---
path: '/osa-x/0-epic'
title: 'Epic'
hidden: true
---


# part 1


<text-box variant='hint' name='Ensimmäisen osan tavoitteet' } do %>


    Tuntee pinnallisesti Spring Boot -sovelluskehyksen ja osaa luoda pyyntöihin reagoivan web-sovelluksen. Osaa muodostaa Thymeleaf-kirjastoa käyttäen template-sivuja, joita käytetään näkymien luontiin. Ymmärtää käsitteet polku, kontrolleri, pyynnön parametri ja polkumuuttuja. Tuntee POST/Redirect/GET-suunnittelumallin, ja osaa luoda em. suunnittelumallia seuraavan sovelluksen. Osaa käsitellä olioita ja kokoelmia osana sovellusta.



</text-box>

#
  Johdanto web-sovelluksiin



  Web-sovellukset koostuvat selain- ja palvelinpuolesta. Käyttäjän koneella toimii selainohjelmisto (esim. <a href="http://chrome.google.com" target="_blank">Google Chrome</a>), jonka kautta käyttäjä tekee pyyntöjä verkossa sijaitsevalle palvelimelle. Kun palvelin vastaanottaa pyynnön, se käsittelee pyynnön ja rakentaa vastauksen. Vastaus voi sisältää esimerkiksi web-sivun HTML-koodia tai jossain muussa muodossa olevaa tietoa.


<figure>
  <img src="/img/pyynto.png"/>

  <figcaption>
    Web-sovellusten käyttäminen: (1) käyttäjä klikkaa linkkiä, (2) selain tekee pyynnön palvelimelle, (3) palvelin käsittelee pyynnön ja rakentaa vastauksen, (4) selaimen tekemään pyyntöön palautetaan vastaus, (5) vastauksen näyttäminen käyttäjälle -- ei tässä kuvassa.
  </figcaption>
</figure>


  Selainohjelmointiin ja käyttöliittymäpuoleen keskityttäessä painotetaan rakenteen, ulkoasun ja toiminnallisuuden erottamista toisistaan. Karkeasti voidaan sanoa, että selaimessa näkyvän sivun sisältö ja rakenne määritellään <a href="http://en.wikipedia.org/wiki/HTML" target="_blank">HTML</a>-tiedostoilla, ulkoasu <a href="http://en.wikipedia.org/wiki/CSS" target="_blank">CSS</a>-tiedostoilla ja toiminnallisuus <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>-tiedostoilla.



  Palvelinpuolen toiminnallisuutta toteutettaessa keskitytään tyypillisesti selainohjelmiston tarvitsevan "APIn" suunnitteluun ja toteutukseen, sivujen muodostamiseen selainohjelmistoa varten, datan tallentamiseen ja käsittelyyn, sekä sellaisten laskentaoperaatioiden toteuttamiseen, joita selainohjelmistossa ei kannata tai voida tehdä.




# part 2


<text-box variant='hint' name='Toisen osan tavoitteet' } do %>


    Tuntee käsitteet URI, DNS, HTTP ja HTML. Osaa kertoa HTTP-protokollan tasolla palvelimelle lähetettävän GET ja POST-tyyppisen pyynnön rakenteen ja sisällön. Osaa kertoa HTTP-protokollan tasolla palvelimelta palautuvan vastauksen rakenteen. Tuntee menetelmiä tietokantojen ohjelmalliseen käsittelyyn. Tuntee käsitteen ORM ja osaa hyödyntää Javan ja Spring Bootin tietokanta-abstraktiota tiedon käsittelyyn. Käsittelee useampia tietokantatauluja sisältäviä sovelluksia ja tietää miten viitteet tietokantataulujen välillä määritellään. Osaa käsitellä transaktioita ohjelmallisesti. Tuntee N+1 kyselyn ongelman.


</text-box>





##
  Omien kyselyiden toteuttaminen



  Spring Data JPA ei tarjoa kaikkia kyselyitä valmiiksi. Uudet kyselyt, erityisesti attribuuttien perusteella tapahtuvat kyselyt, tulee määritellä erikseen. Laajennetaan aiemmin määriteltyä rajapintaa `HenkiloRepository` siten, että sillä on metodi `List&lt;Henkilo&gt; findByNimi(String nimi)` -- eli hae henkilöt, joilla on tietty nimi.


```java
// pakkaus

import org.springframework.data.repository.JpaRepository;

public interface HenkiloRepository extends JpaRepository&lt;Henkilo, Long&gt; {
    List&lt;Henkilo&gt; findByNimi(String nimi);
}
```


  Ylläoleva esimerkki on esimerkki kyselystä, johon ei tarvitse erillistä toteutusta. Koska tietokantataululla on valmis sarake nimi, arvaa Spring Data JPA että kysely olisi muotoa `SELECT * FROM Henkilo WHERE nimi = :nimi` ja luo sen valmiiksi. Lisää Spring Data JPA:n kyselyistä löytyy sen <a href="http://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.query-creation" target="_blank">dokumentaatiosta</a>.


<text-box variant='hint' name='Kyselyt Java Persistence Apin kautta' } do %>


    Java Persistence APIn kautta tehdyt kyselyt eivät ole natiivia SQL:ää, vaan seuraavat JPQL-määritelmää (Java Persistence Query Language), joka kuitenkin muistuttaa SQL:ää. JPQL-kielestä löytyy lisää tietoa osoitteesta <a href="http://docs.oracle.com/javaee/6/tutorial/doc/bnbtg.html" target="_blank">http://docs.oracle.com/javaee/6/tutorial/doc/bnbtg.html</a>.


<% end %>


  Tehdään toinen esimerkki, jossa joudumme oikeasti luomaan oman kyselyn. Lisätään rajapinnalle `HenkiloRepository` metodi `findJackBauer`, joka suorittaa kyselyn `"SELECT h FROM Henkilo h WHERE h.nimi = 'Jack Bauer'"`.


```java
// pakkaus

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.JpaRepository;

public interface HenkiloRepository extends JpaRepository&lt;Henkilo, Long&gt; {
    List&lt;Henkilo&gt; findByNimi(String nimi);
    @Query("SELECT h FROM Henkilo h WHERE h.nimi = 'Jack Bauer'")
    Henkilo findJackBauer();
}```


  Käytössämme on nyt myös metodi `findJackBauer`, joka suorittaa `@Query`-annotaatiossa määritellyn kyselyn. Tarkempi kuvaus kyselyiden määrittelystä osana rajapintaa löytyy Spring Data JPAn <a href="http://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.at-query" target="_blank">dokumentaatiosta</a>.





# part 3


<text-box variant='hint' name='Kolmannen osan tavoitteet' } do %>


    Osaa käsitellä eri muodossa olevaa tietoa. Osaa järjestää ja rajata tietokannasta haettavaa tietoa. Tuntee käsitteen mediatyyppi. Tietää miten binäärimuotoista tietoa käsitellään web-sovelluksissa. Tuntee käsitteen tilattomuus. Tietää mitä evästeet ovat ja mihin niitä käytetään. Tuntee evästeisiin liittyviä oleellisia lakiteknisia asioita.


<% end %>


#
  Lombok ja "Boilerplaten" vähentäminen



  Javan tietokohteita kuvaavat luokat tarvitsevat oletuksena konstruktoreita sekä gettereitä ja settereitä. Thymeleaf hyödyntää luokan get-metodeja HTML-sivuja täydentäessä. Spring Data JPA taas käyttää parametritonta konstruktoria sekä attribuuttien arvojen asettamiseen käytettäviä set-metodeja.



  Hyvin yksinkertainenkin luokka -- kuten alla oleva tapahtumaa kuvaava `Event` -- sisältää paljon ohjelmakoodia.


```java
  public class Event {

      private String name;

      public Event() {
      }

      public Event(String name) {
          this.name = name;
      }

      public String getName() {
          return this.name;
      }

      public void setName(String name) {
          this.name = name;
      }
  }
```


  Suurin osa ohjelmakoodista on oleellista vallitsevien käytänteiden takia -- esimerkiksi Thymeleafin ja Spring Data JPA tarvitsee getterit ja setterit -- mutta samalla epäoleellista. Edellä kuvattujen luokkien sekä niiden attribuuttien määrän lisääntyessä projekteissa tulee olemaan lopulta satoja ellei tuhansia rivejä "turhahkoa" lähdekoodia.



  <a href="https://projectlombok.org/" target="_blank" norel>Lombok</a> on kirjasto, joka on suunniteltu vähentämään projekteissa esiintyvien toisteisten konstruktorien, getterien ja setterien määrää. Lombokin saa projektin käyttöön lisäämällä projektin `pom.xml`-tiedostoon lombok-riippuvuuden.



  Jos käytössäsi on NetBeansin sijaan IntelliJ Idea ohjelmointiympäristö joudut edellisen lisäksi asentamaan 'Lombok Plugin' liitännäisen. Ohjeet tähän löydät <a href="https://projectlombok.org/setup/intellij" target="_blank" norel>täältä</a>. Liitännäisen asentamisen jälkeen voit asetuksista (Build, Execute, Deployment > Compiler > Annotation Processors) laittaa rastin kohtaan "Enable Annotation processing" jonka jälkeen Lombok annotaatioiden pitäisi toimia.


```xml
  &lt;dependency&gt;
    &lt;groupId&gt;org.projectlombok&lt;/groupId&gt;
    &lt;artifactId&gt;lombok&lt;/artifactId&gt;
    &lt;optional&gt;true&lt;/optional&gt;
  &lt;/dependency&gt;
```


  Projekti tarjoaa mahdollisuuden gettereiden ja settereiden luomiseen lennossa. Ohjelmoijan näkökulmasta edellä kuvattu luokka `Event` toimii täysin samalla tavalla, jos konstruktorit ja metodit poistetaan ja luokkaan lisätään muutama annotaatio.



```java
  import lombok.AllArgsConstructor;
  import lombok.Data;
  import lombok.NoArgsConstructor;

  @NoArgsConstructor
  @AllArgsConstructor
  @Data
  public class Event {

      private String name;

  }
```


  Edellä käytetyt annotaatiot toimivat seuraavasti: Annotaatio `@NoArgsConstructor` luo luokalle parametrittoman konstruktorin, annotaatio `@AllArgsConstructor` luo luokalle kaikki attribuutit sisältävän konstruktorin, ja annotaatio `@Data` luo attribuuteille getterit ja setterit.


<img src="/img/lombok.gif" />


  Lombok toimii yhdessä myös `@Entity`-annotaation kanssa. Alla `Event`-luokasta on tehty tietokantaan tallennettava.


```java
  import javax.persistence.Entity;
  import lombok.AllArgsConstructor;
  import lombok.Data;
  import lombok.NoArgsConstructor;
  import org.springframework.data.jpa.domain.AbstractPersistable;

  @Entity
  @NoArgsConstructor
  @AllArgsConstructor
  @Data
  public class Event extends AbstractPersistable&lt;Long&gt; {

      private String name;

  }
```


<programming-exercise name='Jobs' } do %>


    Tehtäväpohjassa on sovellus tehtävien hallintaan. Tutustu ohjelmaan ja muokkaa entiteettiluokkaa tai luokkia siten, että ne hyödyntävät Lombokia. Tehtävän testit eivät tarkastele Lombokin käyttöönottoa, eli tarkasta toiminnallisuus itse.


<% end %>


#
  Tiedon tallentamista ja hakemista



  Jatketaan tietokannassa olevan tiedon hakemisen ja tallentamisen parissa. Edellisessä osassa tutuksi tullut Spring Data JPA tarjoaa merkittävän määrän tietokantakyselyiden logiikkaa valmiina, mikä vähentää tarvetta rutiininomaisten tietokantakyselyiden kirjoittamiseen.



  Tietokantakyselyt saa näkyville palvelimen logeihin lisäämällä sovelluksen kansioon `src/main/resources` tiedoston `application.properties` -- eli projektin konfiguraatiotiedoston -- ja lisäämällä konfiguraatiotiedostoon rivin `spring.jpa.show-sql=true`.


<pre>
spring.jpa.show-sql=true
</pre>


##
  Ajan tallentaminen



  Tietoon liittyy usein aikamääreitä. Esimerkiksi kirjalla on julkaisupäivämäärä, henkilöllä on syntymäpäivä, elokuvalla on näytösaika jne. Javan kahdeksannessa versiossa julkaistiin <a href="https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html" target="_blank" norel>uusia ajan käsittelyyn tarkoitettuja luokkia</a>. Luokkaa <a href="https://docs.oracle.com/javase/8/docs/api/java/time/LocalDate.html" target="_blank" norel>LocalDate</a> käytetään vuoden, kuukauden ja päivämäärän tallentamiseen. Luokka <a href="https://docs.oracle.com/javase/8/docs/api/java/time/LocalDateTime.html" target="_blank" norel>LocalDateTime</a> mahdollistaa taas vuoden, kuukauden ja päivämäärän lisäksi tuntien, minuuttien, sekuntien ja millisekuntien tallentamisen.


```java
  import java.time.LocalDate;
  import java.time.LocalDateTime;

  public class Demo {

      public static void main(String[] args) {
          System.out.println(LocalDate.now());
          System.out.println(LocalDateTime.now());
      }
  }

```

<sample-output>
  2017-10-15
  2017-10-15T22:11:10.433
<% end %>


  Luokkia voi käyttää suoraan entiteettien oliomuuttujina. Alla on määritelty henkilöä kuvaava entiteetti. Henkilöllä on pääavain (id), nimi, ja syntymäpäivä.


```java
  import java.time.LocalDate;
  import javax.persistence.Entity;
  import lombok.AllArgsConstructor;
  import lombok.Data;
  import lombok.NoArgsConstructor;
  import org.springframework.data.jpa.domain.AbstractPersistable;

  @Entity
  @NoArgsConstructor
  @AllArgsConstructor
  @Data
  public class Person extends AbstractPersistable&lt;Long&gt; {

      private String name;
      private LocalDate birthday;

  }
```


  Sovelluksen käynnistyessä tietokantaan luodaan -- kun käytössä on H2-tietokannanhallintajärjestelmä  -- seuraavanlainen tietokantataulu. Syntymäpäivää kuvaava sarake `birthday` luodaan <a href="http://www.h2database.com/html/datatypes.html#date_type" target="_blank" norel>date</a>-tyyppisenä sarakkeena.


```sql
  CREATE TABLE PERSON (
      id bigint not null,
      birthday date,
      name varchar(255),
      primary key (id)
  )
<% end %>



  Aikamääreiden lähettäminen onnistuu myös sovelluksesta palvelimelle. Tällöin kontrollerin metodissa tulee määritellä menetelmä aikaa kuvaavan merkkijonon muuntamiseen aikamääreeksi. Muunto merkkijonosta aikamääreeksi onnistuu `DateTimeFormat`-annotaation avulla. Annotaatiolle annetaan parametrina tiedon muoto, alla <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/format/annotation/DateTimeFormat.ISO.html#DATE" target="_blank" norel>DateTimeFormat.ISO.DATE</a>.


```sql
public String create(@RequestParam String name,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthday) {
...
<% end %>


  Edellä oleva muoto DateTimeFormat.ISO.DATE olettaa, että päivämäärä lähetetään palvelimelle muodossa `yyyy-MM-dd`. Tässä on ensin vuosi (4 numeroa), sitten viiva, sitten kuukausi (2 numeroa), sitten viiva, ja lopulta päivä (2 numeroa). Tämä muoto liittyy <a href="https://tools.ietf.org/html/rfc3339#section-5.6" target="_blank">RFC3339-spesifikaatioon</a>, joka määrittelee muodon, mitä päivämäärissä <em>pitäisi</em> käyttää kun tietoa lähetetään palvelimelle. Spesifikaation takia voimme olettaa (tai toivoa), että esimerkiksi HTML:n <a href="https://www.w3.org/TR/html-markup/input.date.html" target="_blank">date</a>-elementtiin syötettävä päivämäärä lähetetään palvelimelle em. muodossa.



  HTML-lomake, jolla henkilö voidaan luoda, on melko suoraviivainen.


```sql
  &lt;form th:action="@{/persons}" method="POST"&gt;
    &lt;input name="name" type="text"/&gt;&lt;br/&gt;
    &lt;input name="birthday" type="date"/&gt;&lt;br/&gt;
    &lt;input type="submit"/&gt;
  &lt;/form&gt;
<% end %>


<text-box variant='hint' name='Aikavyöhykkeen asettaminen' } do %>


    Web-sovellukset voivat sijaita käytännössä lähes millä tahansa aikavyöhykkeellä. Sovellus käyttää oletuksena palvelimen asetuksissa asetettua aikavyöhykettä. Sovelluksen aikavyöhykkeen muutaminen onnistuu sekä ohjelmallisesti että käynnistyksen yhteydessä. Ohjelmallisesti aikavyöhyke asetetaan TimeZone-luokan metodilla `setDefault` -- tästä esimerkki alla.


  ```java
  import java.util.TimeZone;
  import javax.annotation.PostConstruct;
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;

  @SpringBootApplication
  public class DemoApplication {

      @PostConstruct
      public void started() {
          TimeZone.setDefault(TimeZone.getTimeZone("GMT"));
      }

      public static void main(String[] args) {
          SpringApplication.run(DemoApplication.class, args);
      }
  }
  ```



    Käynnistyksen yhteydessä aikavyöhyke annetaan sovellukselle parametrina komentoriviltä. Kun sovellus on paketoitu (Clean & Build), sen voi käynnistää komentoriviltä. Sovellus löytyy projektin kansiosta `target`.


  <pre>
$ java -Duser.timezone=GMT -jar target/<em>sovellus</em>.jar
  </pre>


    Saat kansion target poistettua Clean-komennolla. Kansio kannattaa poistaa, sillä se sisältää kaikki sovelluksen ajamiseeen tarvittavat kirjastot.


<% end %>






##
  Tietokantamigraatiot



  Ohjelmistojen kehityksessä tulee vastaan tyypillisesti tilanne, missä tuotantokäytössä olevaa tietokantaskeemaa tulee muuntaa. Koska käytössä oleva tietokantaversio voi poiketa ohjelmistokehittäjän koneesta riippuen -- joku saattaa työstää uutta versiota, jollain toisella voi olla työn alla korjaukset vanhempaan versioon -- tarvitaa myös tietokantamuutosten automatisointiin välineitä. Tähän käytetään esimerkiksi <a href="https://flywaydb.org/" target="_blank">Flyway</a>-kirjastoa, josta molemmista löytyy myös <a href="http://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html" target="_blank">Spring Boot</a>-ohjeet.



  Käytännössä tietokantamigraatiot toteutetaan niin, että tietokannasta pidetään yllä tietokantataulujen muutos- ja muokkauskomennot sisältäviä versiokohtaisia tiedostoja. Käytössä olevaan tietokantaan on määritelty esimerkiksi taulu, jossa on tieto tämänhetkisestä versiosta. Jos käynnistettävässä sovelluksessa on uudempia muutoksia, ajetaan niihin liittyvät komennot tietokantaan ja tietokantaan merkitty versio päivittyy.



#
  HTTP-protokollan tilattomuus ja evästeet



  HTTP on tilaton protokolla. Tämä tarkoittaa sitä, että jokainen pyyntö on erillinen kokonaisuus, joka ei liity aiempiin pyyntöihin. Suunnittelupäätöksen taustalla oli ajatus siitä, että verkkosivulle ladattava sisältö voi sijaita useammalla eri palvelimella. Jos HTTP ottaisi kantaa käyttäjän tilaan, tulisi myös hajautettujen ratkaisujen tilan ylläpitoon ottaa kantaa -- tämä olisi myös ollut melko tehotonta (<a href="https://www.w3.org/Protocols/HTTP/HTTP2.html" target="_blank">Basic HTTP as defined in 1992</a>). Päätös tilattomuudesta oli alunperin hyvä: suurin osa verkkoliikenteestä liittyy muuttumattoman sisällön hakemiseen, palvelinten ei tarvitse varata resursseja käyttäjän tilan ylläpitämiseen, ja palvelinten ja selainohjelmistojen toteuttajien ei tarvinnut toteuttaa mekanismeja käyttäjien tilan ylläpitämiseen.



  Käyttäjän tunnistamiseen pyyntöjen välillä on kuitenkin tarvetta. Esimerkiksi verkkokaupat ja muut käyttäjän kirjautumista vaativat palvelut tarvitsevat tavan käyttäjän tunnistamiseen. Klassinen -- mutta huono -- tapa kiertää HTTP:n tilattomuus on ollut säilyttää GET-muotoisessa osoitteessa parametreja, joiden perusteella asiakas voidaan tunnistaa palvelinsovelluksessa. Tämä ei kuitenkaan ole suositeltavaa, sillä osoitteessa olevia parametreja voi muokata käsin, ja ne saattavat jättää sovellukseen ylimääräisiä tietoturva-aukkoja.



<text-box variant='hint' name='Case: GET-parametri tunnistautumiseen' } do %>


    Eräässä järjestelmässä -- onneksi jo vuosia sitten -- verkkokaupan toiminnallisuus oli toteutettu siten, että GET-parametrina säilytettiin numeerista ostoskorin identifioivaa tunnusta. Käyttäjäkohtaisuus oli toteutettu palvelinpuolella siten, että tietyllä GET-parametrilla näytettiin aina tietyn käyttäjän ostoskori. Uusien tuotteiden lisääminen ostoskoriin onnistui helposti, sillä pyynnöissä oli aina mukana ostoskorin tunnistava GET-parametri. Ostoskorit oli valitettavasti identifioitu juoksevalla numerosarjalla. Henkilöllä 1 oli ostoskori 1, henkilöllä 2 ostoskori 2 jne..



    Koska käytännössä kuka tahansa pääsi katsomaan kenen tahansa ostoskoria vain osoitteessa olevaa numeroa vaihtamalla, olivat ostoskorien sisällöt välillä hyvin mielenkiintoisia.


<% end %>


  HTTP-protokollan tilattomuus ei pakota palvelinohjelmistoja tilattomuuteen. Palvelimella tilaa pidetään yllä jollain tavalla tekniikalla, joka ei näy HTTP-protokollaan asti. Yleisin tekniikka tilattomuuden kiertämiseen on evästeiden käyttö.



##
  HTTP ja evästeet



  Merkittävä osa verkkosovelluksista sisältää käyttäjäkohtaista toiminnallisuutta, jonka toteuttamiseen sovelluksella täytyy olla jonkinlainen tieto käyttäjästä sekä mahdollisesti käyttäjän tilasta. HTTP/1.1 tarjoaa mahdollisuuden tilallisten verkkosovellusten toteuttamiseen evästeiden (<em>cookies</em>) avulla.



  Kun palvelin asettaa pyynnön vastaukseen evästeen, tulee selaimen jatkossa lähettää evästetieto jatkossa aina palvelimelle. Tämä tapahtuu automaattisesti selaimen toimesta. Evästeitä käytetään istuntojen (<em>session</em>) ylläpitämiseen: istuntojen avulla pidetään kirjaa käyttäjästä useampien pyyntöjen yli.



  Evästeet toteutetaan HTTP-protokollan otsakkeiden avulla. Kun käyttäjä tekee pyynnön palvelimelle, ja palvelimella halutaan asettaa käyttäjälle eväste, palauttaa palvelun vastauksen mukana otsakkeen `Set-Cookie`, jossa määritellään käyttäjäkohtainen evästetunnus. Set-Cookie voi olla esimerkiksi seuraavan näköinen:


<pre>
Set-Cookie: SESS57a5819a77579dfb1a1466ccceee22a0=0hr0aa2ogdfgkelogg; Max-Age=3600; Domain=".helsinki.fi"
</pre>


  Ylläoleva palvelimelta lähetetty vastaus ilmoittaa pyytää selainta tallettamaan evästeen. Selaimen tulee jatkossa lisätä eväste `SESS57a5819a77579dfb1a1466ccceee22a0=0hr0aa2ogdfgkelogg` jokaiseen `helsinki.fi`-osoitteeseen. Eväste on voimassa tunnin, eli selain ja palvelin voi unohtaa sen tunnin kuluttua sen asettamisesta. Tarkempi syntaksi evästeen asettamiselle on seuraava:


<pre>
Set-Cookie: nimi=arvo [; Comment=kommentti] [; Max-Age=elinaika sekunteina]
                      [; Expires=parasta ennen paiva] [; Path=polku tai polunosa jossa eväste voimassa]
                      [; Domain=palvelimen osoite (URL) tai osoitteen osa jossa eväste voimassa]
                      [; Secure (jos määritelty, eväste lähetetään vain salatun yhteyden kanssa)]
                      [; Version=evästeen versio]
</pre>



  Evästeet tallennetaan selaimen sisäiseen evästerekisteriin, josta niitä haetaan aina kun käyttäjä tekee selaimella kyselyn. Evästeet lähetetään palvelimelle jokaisen viestin yhteydessä `Cookie`-otsakkeessa.


<pre>
Cookie: SESS57a5819a77579dfb1a1466ccceee22a0=0hr0aa2ogdfgkelogg
</pre>


  Evästeiden nimet ja arvot ovat yleensä monimutkaisia ja satunnaisesti luotuja niiden yksilöllisyyden takaamiseksi. Samaan palvelinosoitteeseen voi liittyä useampia evästeitä. Yleisesti ottaen evästeet ovat sekä hyödyllisiä että haitallisia: niiden avulla voidaan luoda yksiöityjä käyttökokemuksia tarjoavia sovelluksia, mutta niitä voidaan käyttää myös käyttäjien seurantaan ympäri verkkoa.


<text-box variant='hint' name='Evästeet hs.fi -palvelussa' } do %>


    Painamalla F12 tai valitsemalla Tools -> Developer tools, pääset tutkimaan sivun lataamiseen ja sisältöön liittyvää statistiikkaa. Lisäneuvoja löytyy <a href="https://developers.google.com/web/tools/chrome-devtools/" target="_blank">Google Developers</a> -sivustolta.



    Avaa developer tools, ja mene osoitteeseen <a href="http://www.hs.fi" target="_blank">http://www.hs.fi</a>. Valitsemalla developer toolsien välilehden `Resources`, löydät valikon erilaisista sivuun liittyvistä resursseista. Avaa `Cookies` ja valitse vaihtoehto `www.hs.fi`. Kuinka moni palvelu pitää sinusta kirjaa kun menet Helsingin sanomien sivuille?

<% end %>



##
  Evästeet ja istunnot



  Kun selain lähettää palvelimelle pyynnön yhteydessä evästeen, palvelin etsii evästeen perusteella käynnissä olevaa istuntoa eli sessiota. Jos sessio löytyy, annetaan siihen liittyvät tiedot sovelluksen käyttöön käyttäjän pyynnön käsittelyä varten. Jos sessiota taas ei löydy, voidaan selaimelle palauttaa uusi eväste ja aloittaa uusi sessio, jolloin session tiedot löytyvät jatkossa palvelimelta.



  Javassa sessioiden käsittelyyn löytyy <a href="http://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpSession.html" target="_blank">HttpSession</a>-luokka, joka tarjoaa välineet sessio- ja käyttäjäkohtaisen tiedon tallentamiseen. Oleellisimmat luokan metodit ovat `public void setAttribute(String name, Object value)`, joka tallentaa sessioon arvon, sekä `public Object getAttribute(String name)`, jonka avulla kyseinen arvo löytyy.



  Session saa yksinkertaisimmillaan käyttöön lisäämällä sen kontrollerimetodin parametriksi. Tällöin Spring liittää metodiin parametrin automaattisesti. Alla on kuvattuna sovellus, joka pitää sessiokohtaista kirjaa käyttäjien tekemistä pyynnöistä.


```java
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class VisitCountController {

    @GetMapping("*")
    @ResponseBody
    public String count(HttpSession session) {
        int visits = 0;
        if (session.getAttribute("count") != null) {
            visits = (int) session.getAttribute("count");
        }

        visits++;
        session.setAttribute("count", visits);

        return "Visits: " + visits;
    }
}
```



  Kun käyttäjä tekee ensimmäistä kertaa pyynnön sovellukseen, palauttaa sovellus merkkijonon "Visits: 1". Vastauksen yhteydessä palautetaan myös eväste. Kun käyttäjä tekee seuraavan kerran pyynnön sovellukseen, lähettää selain pyynnön yhteydessä myös evästeen palvelimelle, jolloin palvelin osaa tunnistaa käyttäjän ja hakee oikean istunnon tiedot -- vastaukseksi palautuu lopulta merkkijono "Visits: 2".




<programming-exercise name='Hello Session' } do %>


    Toteuta sovellus, joka palauttaa käyttäjälle merkkijonon "Hello there!" jos käyttäjä ei ole ennen vieraillut sovelluksessa. Jos käyttäjä on vieraillut sovelluksessa aiemmin, tulee sovelluksen palauttaa käyttäjälle merkkijono "Hello again!".


<% end %>



<text-box variant='hint' name='Evästeiden ja istuntojen testaaminen selaimella' } do %>


    Istuntojen toiminnallisuuden testaaminen selaimella onnistuu näppärästi selainten tarjoaman anonyymitoiminnallisuuden avulla. Esimerkiksi Chromessa voi valita "New incognito window", mikä avaa käyttöön selainikkunan, missä ei aluksi ole lainkaan vanhoja evästeitä muistissa. Kun palvelimelle tehdään pyyntö, tallentuu vastauksen yhteydessä palautettava eväste selaimen muistiin vain siksi aikaa kun anonyymi-ikkuna on auki.



    Session pituus riippuu esimerkiksi palvelimen asetuksista `session timeout` ja siitä, että salliiko käyttäjä evästeiden käytön.


<% end %>


  HttpSession-olioon pääsee käsiksi myös muualla sovelluksessa, ja sen voi injektoida esimerkiksi palveluun `@Autowired`-annotaation avulla. Edellinen kontrolleriin toteutettu toiminnallisuus voitaisiin tehdä myös palvelussa.


```java
// importit

@Service
public class CountService {

    @Autowired
    private HttpSession session;

    public int incrementAndCount() {
        int count = 0;
        if (session.getAttribute("count") != null) {
            count = (int) session.getAttribute("count");
        }

        count++;
        session.setAttribute("count", count);
        return count;
    }
}
```


  Nyt kontrollerin koodi olisi kevyempi:


```java
// importit

@Controller
public class VisitCountController {

    @Autowired
    private CountService countService;

    @RequestMapping("*")
    @ResponseBody
    public String count() {
        return "Visits: " + countService.incrementAndCount();
    }
}
```

<programming-exercise name='Reload Heroes' } do %>


    Reload Heroes -sovellus pitää kirjaa käyttäjän tekemistä sivun uudelleenlatauksista. Kun käyttäjä saapuu sovellukseen ensimmäistä kertaa, hänelle luodaan satunnainen käyttäjätunnus ja hänen vierailujen määrä asetetaan yhteen. Jokaisen uudelleenvierailun yhteydessä käyttäjän vierailujen määrä kasvaa yhdellä.



    Täydennä luokan `ReloadStatusController` metodin reload toimintaa seuraavasti.



    -
      Metodin tulee palauttaa model-attribuuttina "scores" viisi eniten uudelleenlatauksia tehnyttä käyttäjää suuruusjärjestyksessä. Listan ensimmäisellä sijalla on eniten uudelleenlatauksia tehnyt henkilö, toisella sijalla toiseksi eniten jne.


    -
      Metodin tulee lisäksi palauttaa pyynnön tehneeseen henkilöön liittyvä ReloadStatus-olio modelin attribuuttina status. Jos käyttäjä ei ole tehnyt yhtäkään pyyntöä aiemmin, tulee käyttäjälle luoda uusi tunnus sekä alustaa uudelleenlatausten määrä yhteen. Jos taas käyttäjä on tehnyt pyyntöjä aiemmin, tulee käyttäjän tekemien pyyntöjen määrää kasvattaa yhdellä. Tieto pyyntöjen määrästä tulee myös tallentaa tietokantaan.




    Voit testata sovelluksen toimintaa selaimen anonyymitilassa. Anonyymitilassa selain ei lähetä normaalitilassa kertyneitä evästeitä palvelimelle.


<% end %>




<text-box variant='hint' name='Milloin sessioita kannattaa käyttää?' } do %>

  Muutamia faktoja sessioista:


    -
      Sessio häviää kun käyttäjä poistaa selaimesta evästeet.

    -
      Sessio häviää kun evästeen elinikä kuluu loppuun.

    -
      Jokaisessa päätelaitteessa on tyypillisesti oma sessio: jos palvelua käytetään kännykällä ja padilla, kummallakin on omat evästeet. <em>Tämä on nykyään muuttumassa, esimerkiksi jotkut Googlen tuotteet pitävät kirjaa evästeistä myös laitteiden yli.
      </em>

    -
      Käyttäjä voi estää evästeiden käytön selaimen asetuksista.




    Sessioiden käyttö on näppärää sellaisen tiedon tallentamiseen mikä saakin kadota. Jos tiedon säilyvyys on oleellista sovelluksen toiminnan kannalta, kannattaa se tallentaa esimerkiksi tietokantaan.


<% end %>


  Springin annotaatio `@Autowired` luo oletuksena yhden ilmentymän luokasta, joka asetetaan `@Autowired`-annotaatiolla määriteltyyn luokkaan. Tarvittavien komponenttien luomista voidaan kontrolloida erillisen `@Scope`-annotaation avulla, mikä mahdollistaa ilmentymien luonnin esimerkiksi sessiokohtaisesti. Seuraavassa on esimerkki ostoskorista, joka on sessiokohtainen ja jokaiselle käyttäjälle oma. Annotaatio `@Component` on luokan toiminnalle oleellinen -- sen avulla Spring tietää, että luokka tulee ladata @Autowired-annotaatioon liittyvän toiminnallisuuden löydettäväksi.


```java
// importit

@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class ShoppingCart implements Serializable {

    private Map&lt;Item, Integer&gt; items;

    public ShoppingCart() {
        this.items = new HashMap&lt;&gt;();
    }

    public Map&lt;Item, Integer&gt; getItems() {
        return items;
    }

    public void setItems(Map&lt;Item, Integer&gt; items) {
        this.items = items;
    }

    public boolean isEmpty() {
        return items == null || items.isEmpty();
    }
}
```


  Ylläolevasta komponentista luotavat ilmentymät ovat elossa vain käyttäjän session ajan, eli sen aikaa kun käyttäjän eväste on elossa. Ylläolevasta ostoskorista saa lisättyä ilmentymän sovellukseen aivan kuten muistakin komponenteista, eli `@Autowired`-annotaatiolla.



<text-box variant='hint' name='Mikä ihmeen proxymode?' } do %>


    Tarkempaa tietoa em. annotaatiosta löytyy <a href="http://docs.spring.io/spring/docs/current/spring-framework-reference/html/beans.html#beans-factory-scopes-other-injection" target="_blank">Springin dokumentaatiosta</a>.


<% end %>



<programming-exercise name='EuroShopper (3 osaa)' } do %>


    Tässä tehtävässä toteutetaan verkkokauppaan ostoskoritoiminnallisuus.


  <h2>Ostoskori</h2>


    Luo pakkaukseen `wad.domain` luokka `ShoppingCart`, joka tarjoaa seuraavat toiminnallisuudet.



    -
      Metodi `getItems()` palauttaa `Map&lt;Item, Long&gt;`-tyyppisen olion, joka sisältää ostoskorissa olevien tuotteiden tuotekohtaisen lukumäärän.


    -
      Metodi `addToCart(Item item)` lisää ostoskoriin yhden kappaleen `Item`-tyyppistä esinettä.


    -
      Metodi `removeFromCart(Item item)` poistaa ostoskorista yhden kappaleen `Item`-tyyppistä esinettä. Jos lukumäärä laskee nollaan, `getItems()`-metodin ei tule sisältää enää kyseistä tuotetta.




  <h2>Kontrolleri ostoskorille</h2>


    Tee ostoskorista sessiokohtainen, eli eri käyttäjien tulee saada eri ostoskori käyttöönsä. Annotaatiosta `Scope` on tässä hyötyä.



    Luo projektiin sopiva kontrolleri, joka tarjoaa seuraavat osoitteet ja toiminnallisuudet.



    -
      GET /cart asettaa model-olion "items"-nimiseen attribuuttiin ostoskorin sisällön (aiempi `getItems()`). Pyynnön vastauksena käyttäjälle näytetään sivu, joka luodaan polussa `/src/main/resources/templates/cart.html` olevasta näkymästä.


    -
      POST /cart/items/{id} lisää ostoskoriin yhden {id}-tunnuksella tietokannasta löytyvän Item-olion. Pyyntö ohjataan osoitteeseen `/cart`.


    -
      DELETE /cart/items/{id} poistaa ostoskorista yhden {id}-tunnuksella tietokannasta löytyvän Item-olion. Pyyntö ohjataan osoitteeseen `/cart`.



  <h2>Tilauksen tekeminen</h2>


    Muokkaa luokkaa `wad.controller.OrderController` siten, että tilaus tallennetaan tietokantaan. Tutustu luokkiin `Order` ja `OrderItem` ennen toteutusta. Varmista että esimerkiksi `OrderItem` viittaa oikeaan tietokantatauluun.



    Kun tilaus on tehty, tyhjennä ostoskori.


<% end %>

##
  Lakiteknisiä asioita evästeisiin liittyen



  Euroopan komissio on säätänyt yksityisyydensuojaan liittyvän lain, joka määrää kertomaan käyttäjille evästeiden käytöstä. Käytännössä käyttäjältä tulee pyytää lupaa minkä tahansa sisällön tallentamiseen hänen koneelleen (<a href="http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=CELEX:32002L0058:EN:HTML" target="_blank">ePrivacy directive, Article 5, kohta (3)</a>). Myöhemmin säädetty <a href="http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=CELEX:32002L0058:EN:HTML" target="_blank">tarkennus</a> tarkentaa määritelmää myös evästeiden käytön kohdalla.


<aside>

    (25) However, such devices, for instance so-called "cookies", can be a legitimate and useful tool, for example, in analysing the effectiveness of website design and advertising, and in verifying the identity of users engaged in on-line transactions. Where such devices, for instance cookies, are intended for a legitimate purpose, such as to facilitate the provision of information society services, their use should be allowed on condition that users are provided with clear and precise information in accordance with Directive 95/46/EC about the purposes of cookies or similar devices so as to ensure that users are made aware of information being placed on the terminal equipment they are using. Users should have the opportunity to refuse to have a cookie or similar device stored on their terminal equipment. This is particularly important where users other than the original user have access to the terminal equipment and thereby to any data containing privacy-sensitive information stored on such equipment. Information and the right to refuse may be offered once for the use of various devices to be installed on the user's terminal equipment during the same connection and also covering any further use that may be made of those devices during subsequent connections. The methods for giving information, offering a right to refuse or requesting consent should be made as user-friendly as possible. Access to specific website content may still be made conditional on the well-informed acceptance of a cookie or similar device, if it is used for a legitimate purpose.


</aside>


  Lisätietoa mm. osoitteessa <a href="http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2009:337:0011:0036:EN:PDF" target="_blank">http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2009:337:0011:0036:EN:PDF</a>, <a href="http://ec.europa.eu/justice/data-protection/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf" target="_blank">http://ec.europa.eu/justice/data-protection/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf</a> sekä <a href="http://finlex.fi/fi/laki/ajantasa/2014/20140917#L24P205" target="_blank">http://finlex.fi/fi/laki/ajantasa/2014/20140917#L24P205</a>.



# part 4


<text-box variant='hint' name='Neljännen osan tavoitteet' } do %>


    Osaa jakaa sovelluksen osia sovelluksen sisäisiksi palveluiksi ("Service"). Ymmärtää tarpeen web-sovellusten kehitysprosessin automatisoinnille sekä web-sovellusten jatkuvalle inkrementaaliselle kehitykselle. Ymmärtää versionhallintapalvelun (esim. Github), sovelluksen testejä suorittavan integraatiopalvelun (esim. Travis CI) sekä testi- ja tuotantoympäristön (esim. Heroku) yhteistyön.


<% end %>


#
  Sovelluksen rakenne ja pyynnön kulku sovelluksessa



  Web-sovellusten suunnittelussa noudatetaan useita arkkitehtuurimalleja. Tyypillisimpiä näistä ovat MVC-arkkitehtuuri sekä kerrosarkkitehtuuri. Kummassakin perusperiaatteena on vastuiden jako selkeisiin osakokonaisuuksiin.



##
  MVC-arkkitehtuuri
<% end %>


  MVC-arkkitehtuurin tavoitteena on käyttöliittymän erottaminen sovelluksen toiminnasta siten, että käyttöliittymät eivät sisällä sovelluksen toiminnan kannalta tärkeää sovelluslogiikkaa. MVC-arkkitehtuurissa ohjelmisto jaetaan kolmeen osaan: malliin (<em>model</em>, tiedon tallennus- ja hakutoiminnallisuus), näkymään (<em>view</em>, käyttöliittymän ulkoasu ja tiedon esitystapa) ja käsittelijään (<em>controller</em>, käyttäjältä saatujen käskyjen käsittely sekä sovelluslogiikka).



  MVC-malli yhdistetään tyypillisesti työpöytäsovelluksiin, missä käsittelijä voi olla jatkuvassa yhteydessä näkymään ja malliin. Tällöin käyttäjän yksittäinen toiminta käyttöliittymässä -- esimerkiksi tekstikentän tiedon päivitys -- liittyy tapahtumankäsittelijään, joka ohjaa tiedon malliin liittyvälle ohjelmakoodille, jonka tehtävänä on päivittää sovellukseen liittyvää tietoa tarvittaessa. Tapahtumankäsittelijä mahdollisesti sisältää myös ohjelmakoodia, joka pyytää muunnosta käyttöliittymässä.



  Web-sovelluksissa käsittelijän ohjelmakoodia suoritetaan vain kun selain lähettää palvelimelle pyynnön. Ohjelmakoodissa haetaan esimerkiksi tietokannasta tietoa, joka ohjataan näkymän luontiin tarkoitetulle sovelluksen osalle. Kun näkymä on luotu, palautetaan se pyynnön tehneelle selaimelle. Spring-sovelluksissa kontrollereissa näkyvä `Model` viittaa tietoon, jota käytetään näkymän luomisessa -- se ei kuitenkaan vastaa MVC-mallin termiä model, joka liittyy kattavammin koko tietokantatoiminnallisuuteen.



<figure>
  <img src="/img/mvc.png"/>
  <figcaption>
    MVC-mallissa käyttäjän pyyntö ohjautuu kontrollerille, joka sisältää sovelluslogiikkaa. Kontrolleri kutsuu pyynnöstä riippuen mallin toiminnallisuuksia ja hakee sieltä esimerkiksi tietoa. Tämän jälkeen pyyntö ohjataan näkymän luomisesta vastuulle olevalle komponentilla ja näkymä luodaan. Lopulta näkymä palautetaan vastauksena käyttäjän tekemälle pyynnölle.
  </figcaption>
</figure>


  MVC-mallista on useita hyötyjä. Käyttöliittymien (näkymien) suunnittelu ja toteutus voidaan eriyttää sovelluslogiikan toteuttamisesta, jolloin niitä voidaan työstää rinnakkain. Samalla ohjelmakoodi selkenee, sillä eri komponenttien vastuut ovat eriteltyjä -- näkymät eivät sisällä sovelluslogiikkaa, kontrollerin tehtävänä on käsitellä pyynnöt ja ohjata niitä eteenpäin, ja mallin vastuulla on tietoon liittyvät operaatiot. Tämän lisäksi sovellukseen voidaan luoda useampia käyttöliittymiä, joista jokainen käyttää samaa sovelluslogiikkaa, ja pyynnön kulku sovelluksessa selkiytyy.




##
  Kerrosarkkitehtuuri



  Kun sovellus jaetaan selkeisiin vastuualueisiin, selkeytyy myös pyynnön kulku sovelluksessa. Kerrosarkkitehtuuria noudattamalla pyritään tilanteeseen, missä sovellus on jaettu itsenäisiin kerroksiin, jotka toimivat vuorovaikutuksessa muiden kerrosten kanssa. Käyttöliittymäkerros sisältää näkymät (esim. Thymeleafin html-sivut) sekä mahdollisen logiikan tiedon näyttämiseen (esim tägit html-sivuilla). Käyttöliittymä näkyy käyttäjän selaimessa, ja käyttäjän selain tekee palvelimelle pyyntöjä käyttöliittymässä tehtyjen klikkausten ja muiden toimintojen pohjalta. Palvelimella toimivan sovelluksen kontrollerikerros ottaa vastaan nämä pyynnöt, ja ohjaa ne eteenpäin sovelluksen sisällä.



  Spring-sovellusten yhteydessä kerrosarkkitehtuurilla tarkoitetaan yleisesti ottaen seuraavaa jakoa:



  - Käyttöliittymäkerros
  - Kontrollerikerros
  - Sovelluslogiikka ja palvelut
  - Tallennuslogiikka (tietokanta-abstraktio ja tietokantapalvelut)



  Kerrosarkkitehtuuria noudattaessa ylempi kerros hyödyntää alemman kerroksen tarjoamia toiminnallisuuksia, mutta alempi kerros ei hyödynnä ylempien kerrosten tarjoamia palveluita. Puhtaassa kerrosarkkitehtuurissa kaikki kerrokset ovat olemassa, ja kutsut eivät ohita kerroksia ylhäältä alaspäin kulkiessaan. Tällä kurssilla noudatamme avointa kerrosarkkitehtuuria, missä kerrosten ohittaminen on sallittua -- jos sovelluksen ylläpidettävyys ja rakenne ei sitä kiellä, voi myös Repository-rajapinnan toteuttavat oliot sisällyttää kontrollereihin.


<figure>
  <img src="/img/layers.png"/>
  <figcaption>
    Kerrosarkkitehtuurissa sovelluksen vastuut jaetaan kerroksittain. Näkymäkerros sisältää käyttöliittymät, joista voidaan tehdä pyyntöjä kontrollerille. Kontrolleri käsittelee palveluita, jotka ovat yhteydessä tallennuslogiikkaan. Tiedon tallentamiseen käytettäviä entiteettejä sekä muita luokkia (esim "view objects") käytetään kaikilla kerroksilla.
  </figcaption>
</figure>


###
  Kontrollerikerros



  Kontrollerien ensisijaisena vastuuna on pyyntöjen kuuntelu, pyyntöjen ohjaaminen sopiville palveluille, sekä tuotetun tiedon ohjaaminen oikealle näkymälle tai näkymän generoivalle komponentille.



  Jotta palveluille ei ohjata epäoleellista dataa, esimerkiksi huonoja arvoja sisältäviä parametreja, on kontrolleritason vastuulla myös pyynnössä olevien parametrien validointi.



  Kontrollerikerroksen luokissa käytetään annotaatiota `@Controller`, ja luokkien metodit, jotka vastaanottavat pyyntöjä annotoidaan esimerkiksi `@GetMapping`- ja `@PostMapping`-annotaatioilla.



###
  Palvelukerros



  Palvelukerros tarjoaa kontrollerikerrokselle palveluita, joita kontrollerikerros voi käyttää. Palvelut voivat esimerkiksi abstrahoida kolmannen osapuolen tarjoamia komponentteja tai rajapintoja, tai sisältää toiminnallisuutta, jonka toteuttaminen kontrollerissa ei ole järkevää esimerkiksi sovelluksen ylläpidettävyyden kannalta.



  Palvelukerroksen luokat merkitään annotaatiolla `@Service` tai `@Component`. Tämä annotaatio tarkoittaa käytännössä sitä, että sovelluksen käynnistyessä luokasta tehdään olio, joka ladataan sovelluksen muistiin. Tämän jälkeen jokaiseen luotavaan olioon, jonka luokassa on `@Autowired`-annotaatiolla merkitty oliomuuttuja, sisällytetään muistiin ladattu olio.



  Tarkastellaan toisella viikolla ollutta tehtävää Bank Transfer sekä sen erästä mahdollista ratkaisua. Tehtävässä tavoitteena oli luoda sovellus, joka voi tehdä tilisiirron parametreina annettujen tilien välillä. Eräs ratkaisu on seuraavanlainen.


```java
@Controller
public class BankingController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("accounts", this.accountRepository.findAll());
        return "index";
    }

    @PostMapping("/")
    public String transfer(@RequestParam String from, @RequestParam String to,
                           @RequestParam Integer amount) {
        Account accountFrom = this.accountRepository.findByIban(from);
        Account accountTo = this.accountRepository.findByIban(to);

        accountFrom.setBalance(accountFrom.getBalance() - amount);
        accountTo.setBalance(accountTo.getBalance() + amount);

        this.accountRepository.save(accountFrom);
        this.accountRepository.save(accountTo);

        return "redirect:/";
    }
}
```


  Yllä olevassa esimerkissä kontrolleri on jo melko raskas. Eräs vaihtoehto on luoda erillinen luokka `BankingService`, jolle määritellään metodi transfer. Metodi saa parametrina kaksi tiliä sekä summan.



```java
@Service
public class BankingService {

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public void transfer(String from, String to, Integer amount) {
        Account accountFrom = this.accountRepository.findByIban(from);
        Account accountTo = this.accountRepository.findByIban(to);

        accountFrom.setBalance(accountFrom.getBalance() - amount);
        accountTo.setBalance(accountTo.getBalance() + amount);
    }
}
```


  Nyt Controller-luokan toiminnallisuus kevenee hieman.


```java
@Controller
public class BankingController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BankingService bankingService;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("accounts", this.accountRepository.findAll());
        return "index";
    }

    @PostMapping("/")
    public String transfer(@RequestParam String from, @RequestParam String to,
                           @RequestParam Integer amount) {
        this.bankingService.transfer(from, to, amount);
        return "redirect:/";
    }
}
```


  Yllä kontrolleriluokan metodi transfer on selkeä ja sen vastuulla on vain pyynnön vastaanottaminen sekä tehtävien delegointi. Jatkossa myös muut tilisiirtoa mahdollisesti tarvitsevat sovelluksen osat voivat hyödyntää suoraan BankingService-luokassa määriteltyä metodia.



###
  Tallennuslogiikka



  Tallennuslogiikkakerros sisältää tietokannan käyttöön liittyvät oleelliset oliot. Pankki saattaisi tarvita esimerkiksi Tilitapahtumiin liittyvää tallennuslogiikkaa. Täällä olisi esimerkiksi `Repository`-rajapinnat, jotka perivät rajapinnan `JpaRepository`.



###
  Tietoa sisältävät oliot



  Tiedon esittämiseen liittyvät oliot elävät kerrosarkkitehtuurissa kerrosten sivulla. Esimerkiksi entiteettejä voidaan käsitellä tallennuslogiikkakerroksella (tiedon tallennus), palvelukerroksella (tiedon käsittely), kontrollerikerroksella (tiedon lisääminen Model-olioon) sekä näkymäkerroksella (Model-olion käyttäminen näkymän luomiseen.



  Sovellusten kehittämisessä näkee välillä myös jaon useampaan erilaiseen tietoa sisältävään oliotyyppiin. Entiteettejä käytetään tietokantatoiminnallisuudessa, mutta välillä näkymien käsittelyyn palautettavat oliot pidetään erillisinä entiteeteistä. Tähän ei ole oikeastaan yhtä oikeaa tapaa: lähestymistapa valitaan tyypillisesti ohjelmistokehitystiimin kesken.





<programming-exercise name='Refactoring' } do %>


    Tehtäväpohjassa on sovellus, joka hakee vitsejä verkkopalvelusta. Sovelluksessa on myös toiminnallisuus vitsien hyvyyden äänestämiseen. Muokkaa sovellusta siten, että vitsien äänestystoiminnallisuus eriytetään omaan Service-luokkaan, jolloin mm. luokan JokeController vastuualueet selkeytyvät.



<% end %>


#
  Konfiguraatioprofiilit



  Ohjelmistotuotannossa jokaisella ohjelmistokehittäjällä on oma ympäristö, missä sovellusta voi kehittää ja testata. Sovelluksen lähdekoodi sijaitsee versionhallintapalvelussa, ja sovelluksen toiminta ei ole riippuvainen työympäristöstä -- sovelluksen siirtämisen koneelta toiselle ei lähtökohtaisesti pitäisi vaatia muutoksia ohjelman lähdekoodiin. Samanlaista joustavuutta odotetaan myös silloin kun sovelluksesta julkaistaan uusi versio käyttäjille.



  Sovelluksen julkaisun eli esimerkiksi tuotantopalvelimelle siirtämisen ei tule vaatia muutoksia sovelluksen lähdekoodiin. Kun sovellus on julkisessa käytössä, sillä on tyypillisesti ainakin usein eri tietokantaosoite kuin sovelluskehitysvaiheessa, mahdollisesti eri tietokannanhallintajärjestelmä, sekä todennäköisiä erilaisia salasanoihin ja ohjelman tuottamiin tulostuksiin (logeihin) liittyviä asetuksia.



  Tarvitsemme siis tavan olennaisten asetusten määrittelyyn ympäristökohtaisesti.



  Spring-projekteissa konfiguraatiotiedostot sijaitsevat tyypillisesti kansiossa `src/main/resources/`. Spring etsii kansiosta tiedostoa nimeltä `application.properties`, johon ohjelmistokehittäjä voi määritellä sovelluksen käynnistyksen yhteydessä käytettäviä asetuksia. Asetustiedosto voi sisältää esimerkiksi tietokantaan liittyviä asetuksia:


<pre>
spring.datasource.driverClassName=tietokanta-ajuri
spring.datasource.url=jdbc-osoite
spring.jpa.show-sql=true
</pre>


  Ensimmäiset kaksi kertovat tietokannanhallintajärjestelmän käyttämän ajurin sekä osoitteen, kolmas pyytää sovellusta kirjoittamaan tietokantakyselyt lokiin.



  Lista tyypillisistä asetuksista löytyy osoitteesta <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html" target="_blank">https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html</a>.



  Käytettävän profiilin ja konfiguraatiotiedoston vaihtaminen toteutetaan tyypillisesti ympäristömuuttujan avulla. Ympäristömuuttuja (`SPRING_PROFILES_ACTIVE`) kertoo käytettävän profiilin. Ympäristömuuttujan voi antaa myös sovellukselle parametrina sovellusta käynnistettäessä (`java ... -Dspring.profiles.active=arvo ...`).



  Jos käytössä on aktiivista profiilia kuvaava ympäristömuuttuja, etsii Spring oletuskonfiguraatiotiedoston (`application.properties`) lisäksi myös <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-profile-specific-properties" target="_blank">aktiiviseen profiiliin liittyvää konfiguraatiotiedostoa</a>. Jos aktiivisena profiilina on `production`, etsitään myös konfiguraatiotiedostoa `application-production.properties`. Konfiguraatioprofiili voisi esimerkiksi sisältää tietoa käytettävästä tietokanta-ajurista sekä tietokannan osoitteesta.




#
  Sovelluksen siirtäminen pilvipalveluun




  Tutustutaan seuraavaksi sovelluksen siirtämiseen <a href="https://www.heroku.com/" target="_blank">Heroku</a>-pilvipalveluun. Heroku on palvelu, joka tarjoaa rajoitetun (ja ilmaisen) sijoituspaikan vähän resursseja kuluttaville sovelluksille. Toisin kuin aiemmin toteuttamiemme sovellusten tietokanta, Herokun käyttämä tietokannanhallintajärjestelmä on erillinen sovelluksesta, jolloin tietokantaan tallennetut tiedot pysyvät tietokannassa vaikka sovellus sammuisi välillä.



  Seuraa ensin osoitteessa <a href="https://devcenter.heroku.com/articles/deploying-spring-boot-apps-to-heroku" target="_blank">https://devcenter.heroku.com/articles/deploying-spring-boot-apps-to-heroku</a> olevaa opasta Spring Boot -sovelluksen käytöstä Herokussa ja luo ensimmäinen pilvessä sijaitseva Heroku-sovelluksesi.



  Jotta saisimme oman tietokantaa käyttävän sovelluksen Herokuun, tarvitsemme ajurin Herokun käyttämään PostgreSQL-tietokannanhallintajärjestelmään. Tämän saa käyttöön lisäämällä projektin `pom.xml`-tiedostoon seuraavan riippuvuuden.


```xml
&lt;dependency&gt;
    &lt;groupId&gt;org.postgresql&lt;/groupId&gt;
    &lt;artifactId&gt;postgresql&lt;/artifactId&gt;
&lt;/dependency&gt;
```


  Luodaan seuraavaksi konfiguraatiotiedosto, jolla määrittelemme sovelluksen käyttöön PostgreSQL-kielen sekä pyydämme tietokantakyselyitä näkyville. Seuraava sisältö tulee tiedostoon `src/main/resources/application-production.properties`. Alla määritellyt parametrit kuten `${JDBC_DATABASE_URL}` tulevat Herokulta automaattisesti sovelluksen käynnistyksen yhteydessä.


<pre>
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.url=${JDBC_DATABASE_URL}
spring.datasource.jdbcUrl=${JDBC_DATABASE_URL}
spring.datasource.username=${JDBC_DATABASE_USERNAME}
spring.datasource.password=${JDBC_DATABASE_PASSWORD}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.generate-ddl=true
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
</pre>


  Luodaan tämän jälkeen profiili tuotantokäyttöä varten. Profiili noudattaa Herokun opasta osoitteessa <a href="https://devcenter.heroku.com/articles/connecting-to-relational-databases-on-heroku-with-java" target="_blank">https://devcenter.heroku.com/articles/connecting-to-relational-databases-on-heroku-with-java</a>, mutta on käytössä vain profiililla `production`. Tämän avulla sovellus muuntaa Herokun antaman tietokantaosoitteen sovelluksen käyttöön.


```java
// pakkaus

@Configuration
@Profile("production")
public class ProductionProfile {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }
}
```


  Luodaan lopulta vielä erillinen `Procfile`-tiedosto, jonka perusteella Heroku osaa käynnistää sovelluksen. Procfile-tiedoston sisältö on seuraava:


<pre>
web: java $JAVA_OPTS -Dspring.profiles.active=production -Dserver.port=$PORT -jar target/*.jar
</pre>


  Tämän jälkeen sovelluksen siirtäminen tuotantoon onnistuu alkuperäisiä Herokun ohjeita noudattamalla.




  Heroku määrittelee sovellukselle käynnistysparametrit sekä portin, jonka lisäksi määrittelemme aktiiviseksi profiiliksi tuotantoprofiilin. Kun sovellus siirretään herokuun, se käyttää Herokun tietokantaa. Toisaalta, kun sovellusta kehitetään paikallisesti, käytössä on testitietokanta -- ihan näppärää.




  Voit kokeilla ReloadHeroes-sovellusta osoitteessa <a href="https://still-beyond-90359.herokuapp.com/" target="_blank">https://still-beyond-90359.herokuapp.com/</a>.


<text-box variant='hint' name='PostgreSQL ja Heroku' } do %>


    Jos Herokun PostgreSQL ei lähde edellä kuvatulla esimerkillä käyntiin, tarkasta vielä, että sovellukseen on lisätty Herokussa tietokannanhallintajärjestelmä. Tämä löytyy Herokusta sovelluksen Resources-välilehdeltä kohdasta Add-ons.


<% end %>


#
  Sovellusten testaaminen



  Sovellusten testaaminen helpottaa sekä kehitystyötä että tulevaa ylläpitotyötä. Testaaminen voidaan karkeasti jakaa kolmeen osaan: yksikkötestaukseen, integraatiotestaukseen ja järjestelmätestaukseen. Tämän lisäksi on mm. myös käytettävyys- ja tietoturvatestaus, joita emme tässä käsittele tarkemmin.



  Yksikkötestauksessa tarkastellaan sovellukseen kuuluvia yksittäisiä komponentteja ja varmistetaan että niiden tarjoamat rajapinnat toimivat tarkoitetulla tavalla. Integraatiotestauksessa pyritään varmistamaan, että komponentit toimivat yhdessä kuten niiden pitäisi. Järjestelmätestauksessa varmistetaan, että järjestelmä toimii vaatimusten mukaan järjestelmän käyttäjille tarjotun rajapinnan (esim. selain) kautta.



##
  Yksikkötestaus



  Yksikkötestauksella tarkoitetaan lähdekoodiin kuuluvien yksittäisten osien testausta. Termi yksikkö viittaa ohjelman pienimpiin mahdollisiin testattaviin toiminnallisuuksiin, kuten olion tarjoamiin metodeihin. Seuratessamme <a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank">single responsibility principle</a>ä, jokaisella oliolla ja metodilla on yksi selkeä vastuu, jota voi myös testata. Testaus tapahtuu yleensä testausohjelmistokehyksen avulla, jolloin luodut testit voidaan suorittaa automaattisesti. Yleisin Javalla käytettävä testauskehys on JUnit, jonka saa käyttöön lisäämällä siihen liittyvän riippuvuuden `pom.xml`-tiedostoon.


<pre class="sh_xml">
&lt;dependency&gt;
    &lt;groupId&gt;junit&lt;/groupId&gt;
    &lt;artifactId&gt;junit&lt;/artifactId&gt;
&lt;/dependency&gt;
</pre>


  Yksittäisen riippuvuuden määre `scope` kertoo milloin riippuvuutta tarvitaan. Määrittelemällä `scope`-elementin arvoksi `test` on riippuvuudet käytössä vain testejä ajettaessa. Uusia testiluokkia voi luoda NetBeansissa valitsemalla New -&gt; Other -&gt; JUnit -&gt; JUnit Test. Tämän jälkeen NetBeans kysyy testiluokalle nimeä ja pakkausta. Huomaa että lähdekoodit ja testikoodit päätyvät erillisiin kansioihin -- juurin näin sen pitääkin olla. Kun testiluokka on luotu, on projektin rakenne kutakuinkin seuraavanlainen.


<pre>
.
|-- pom.xml
`-- src
    |-- main
    |   |-- java
    |   |   `-- wad
    |   |       `-- ... oman projektin koodit
    |   |-- resources
    |           `-- ... resurssit, mm. konfiguraatio ja thymeleafin templatet
    |
    `-- test
        `-- java
            `-- wad
                `-- ... testikoodit!
</pre>


  Tehtäväpohjissa JUnit-testikirjasto on valmiina mukana. Yksikkötestauksesta JUnit-kirjaston avulla löytyy pieni opas kurssin <a href="https://github.com/mluukkai/OTM2015/wiki/JUnit-ohje" target="_blank">Ohjelmistotekniikan menetelmät</a> sivuilta.



##
  Integraatiotestaus



  Spring tarjoaa `spring-test`-kirjaston, jonka avulla JUnit-kirjasto saa `@Autowired`-annotaatiot toimimaan. Tämän kautta pääsemme tilanteeseen, missä voimme injektoida testimetodille esimerkiksi repository-rajapinnan toteuttavan olion sekä testata sen tarjoamien metodien toimintaa. Testattava palvelu voi hyödyntää muita komponentteja, jolloin testauksen kohteena on kokonaisuuden toiminta yhdessä.



  Spring test-komponentista on olemassa Spring Boot -projekti, jonka voimme ottaa käyttöömme lisäämällä seuraavan riippuvuuden pom.xml-tiedostoon. Käytetyn riippuvuuden versio liittyy Spring Boot -projektin versioon, eikä sitä tarvitse määritellä tarkemmin.


```xml
&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;
  &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
```


  Yksittäisten palvelujen testaamisessa tarvitsemme testiluokkien alkuun kaksi annotaatiota. Annotaatio `@RunWith(SpringRunner.class)` kertoo että käytämme Springiä yksikkötestien ajamiseen ja annotaatio `@SpringBootTest` lataa sovelluksen osat käyttöön.



  Alla on esimerkkinä testiluokka, johon injektoidaan automaattisesti `BankingService`-olio sekä `AccountRepository`-rajapinnan toteuttama repository-olio.


```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {

    @Autowired
    private BankingService bankingService;

    @Autowired
    private AccountRepository accountRepository;

    // ... testit jne
}
```


  Käynnistämällä Springin osana testejä, saamme käyttöömme oliokontekstin, jonka avulla voimme asettaa testattavat oliot testiluokkiin testaamista varten. Testattavien olioiden riippuvuudet asetetaan myös automaattisesti, eli jos `BankingService` sisältää muita komponentteja, on ne myös automaattisesti asetettu.



  Voimme ylläolevalla lähestymistavalla testata myös sitä, että sovelluksemme eri osat toimivat yhteen toivotusti. Oletetaan, että käytössämme on aiemmin esitelty luokka `BankingService`, joka tarjoaa metodin `transfer`. Metodin pitäisi siirtää annettu summan kahden tilin välillä. Tämän lisäksi käytössämme on `AccountRepository`, jonka avulla voimme hakea tietokannasta tietoa tilien nimien perusteella.



  Kummatkin toteutukset voidaan injektoida testiluokkaan. Alla oleva testi tarkastaa, että luokan `BankingService` toteutus toimii toivotulla tavalla.


```java
// importit

@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {

    @Autowired
    private BankingService bankingService;

    @Autowired
    private AccountRepository accountRepository;

    @Test
    public void testBankTransfer() {
        Account first = new Account();
        first.setBalance(200);
        first.setIban("first");
        Account second = new Account();
        second.setIban("second");
        second.setBalance(0);

        accontRepository.save(first);
        accontRepository.save(second);

        bankingService.transfer("first", "second", 200);

        assertEquals(0, accountRepository.findByIban("first").getBalance());
        assertEquals(200, accountRepository.findByIban("second").getBalance());
    }

    // ja muita testejä
}
```


  Yllä oleva testi testaa vain tilisiirron onnistumista. Se ei kuitenkaan tarkasta esimerkiksi sivuvaikutuksia. Auki jäävät muunmuassa kysymykset: siirtääkö palvelu rahaa jollekin toiselle tilille? Mitä käy jos tilillä ei ole rahaa?



##
  Järjestelmätestaus



  Järjestelmätestauksessa pyritään varmistamaan, että järjestelmä toimii toivotulla tavalla. Järjestelmää testataan saman rajapinnan kautta, kuin mitä sen loppukäyttäjät käyttävät. Järjestelmätestaukseen on monenlaisia työkaluja, joista käsittelemme tässä kahta. Tutustumme ensin integraatiotestauksessa käytetyn `spring-test`-komponenttiin järjestelmätason testaustoiminnallisuuteen, jonka jälkeen tutustumme harjoitustehtävän kautta `Selenium` ja `FluentLenium` -kirjastoihin.


###
  MockMvc




  Springin tarjoama `spring-test` tarjoaa tuen järjestelmätestaamiseen. Annotaatiolla `@SpringBootTest` testeillä on käytössä myös web-sovelluksen konteksti, jonka avulla voidaan luoda <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/web/servlet/MockMvc.html" target="_blank">MockMvc</a>-olio. MockMvc-oliolla pystymme tekemään pyyntöjä sovelluksen tarjoamiin osoitteisiin, tarkistelemaan pyyntöjen onnistumista, sekä tarkastelemaan vastauksena saatua dataa.



  Alla oleva esimerkki käynnistää sovelluksen ja tekee kolme GET-pyyntöä osoitteeseen `/messages`. Ensimmäinen pyyntö liittyy testiin, missä varmistetaan että vastaus on sisältää statuskoodin `200` eli "OK", toinen pyyntö liittyy testiin joka varmistaa että vastauksen tyyppi on JSON-muotoista dataa, ja kolmas pyyntö tarkistaa että vastauksessa on merkkijono "Awesome". Alun `setUp`-metodi luo `MockMvc`-olion injektoidun palveinkontekstin perusteella.


```java
// muut importit

// mm. mockMvc:n get- ja post-metodit
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MessagesTest {

    @Autowired
    private WebApplicationContext webAppContext;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webAppContext).build();
    }

    @Test
    public void statusOk() throws Exception {
        mockMvc.perform(get("/messages"))
                .andExpect(status().isOk());
    }


    @Test
    public void responseTypeApplicationJson() throws Exception {
        mockMvc.perform(get("/messages"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void responseContainsTextAwesome() throws Exception {
        MvcResult res = mockMvc.perform(get("/messages"))
                .andReturn();

        String content = res.getResponse().getContentAsString();
        Assert.assertTrue(content.contains("Awesome"));
    }
}
```


  Voit myös testata modeliin asetettujen attribuuttien olemassaoloa ja oikeellisuutta. Olemassaolon voi tarkistaa `model()`-metodin kautta, ja `MvcResult`-olion kautta pääsee käsiksi modelin sisältöön.


```java
    @Test
    public void modelHasAttributeMessages() throws Exception {
        mockMvc.perform(get("/messages"))
                .andExpect(model().attributeExists("messages"));
    }

    @Test
    public void messagesCorrect() throws Exception {
        MvcResult res = mockMvc.perform(get("/messages"))
                .andReturn();

        // oletetaan, että kontrolleri asettaa kokoelman Message-tyyppisiä olioita
        // modeliin

        Collection&lt;Message&gt; messages = (Collection) res.getModelAndView().getModel().get("messages");

        // tarkista kokoelma
    }
```


  MockMvc:n avulla voi testata käytännössä suurinta osaa palvelinsovellusten toiminnallisuudesta, mutta samalla se tarjoaa pääsyn samaan rajapintaan kuin mitä selain käsitteelee.




<programming-exercise name='Airports and Airplanes Redux' } do %>


    Muistamme edellisestä osiosta tehtävän, missä tehtiin sovellus lentokoneiden ja lentokenttien hallintaan. Tässä tehtävässä harjoitellaan hieman sekä integraatio- että järjestelmätestausta.



    Huom! Tässä tehtävässä ei ole automaattisia testejä, joilla testattaisiin kirjoittamiasi testejä. Palauttaessasi tehtävän olet tarkistanut, että kirjoittamasi testit toimivat kuten tehtävänannossa on kuvattu.


  <h2>AirportServiceTest</h2>


    Sovellusessa on luokka `AirportService`, mikä sijaitsee pakkauksessa `wad.service`. Sille ei kuitenkaan ole yhtäkään testiä :(



    Lisää testikansioon (`Test Packages`) pakkaus `wad.service`, ja luo sinne luokka `AirportServiceTest`.



    Lisää luokalle tarvittavat annotaatiot sekä oliomuuttujat, ja toteuta luokalle testimetodit, joiden avulla testataan että haluttu lentokone todellakin lisätään lentokentälle. Haluat ainakin tietää että:



    -
      Kun lentokone on lisätty lentokentälle, tietokannasta samalla tunnuksella haettavalla lentokoneella on asetettu lentokenttä, ja se on juuri se lentokenttä mihin kone on lisätty.

    -
      Kun lentokone on lisätty lentokentälle, lentokentältä löytyy myös kyseinen kone.

    -
      Kun lentokone on lisätty yhdelle lentokentälle, se ei ole muilla lentokentillä.

    -
      Lentokoneen lisääminen samalle lentokentälle useasti ei johda siihen, että lentokenttä sisältää saman koneen monta kertaa.




    Aina kun lisäät yksittäisen testin, voit ajaa testit klikkaamalla projektia oikealla hiirennapilla ja valitsemalla "Test".



  <h2>AircraftControllerTest</h2>


    Luo testikansioon pakkaus `wad.controller` ja lisää sinne luokka `AircraftControllerTest`. Lisää luokkaan tarvittavat määrittelyt, jotta voit käyttää `MockMvc`-komponenttia testeissä.



    Tee seuraavat testit:



    - Kun osoitteeseen `/aircrafts` tehdään GET-pyyntö, vastauksen status on 200 (ok) ja vastauksen model-oliossa on parametrit `aircrafts` ja `airports`.
    - Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "HA-LOL", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen erillinen kysely tietokantaan esim. `AircraftRepository`:n avulla, ja varmista, että tietokannasta löytyy lentokone, jonka nimi on `HA-LOL`.
    - Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "XP-55", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen GET-pyyntö osoitteeseen `/aircrafts`, ja tarkista että pyynnön vastauksena saatavan `model`-olion sisältämässä `"aircrafts"`-listassa on juuri luotu lentokone.



    Tässäkin tehtävässä, aina kun lisäät yksittäisen testin, voit ajaa testit klikkaamalla projektia oikealla hiirennapilla ja valitsemalla "Test".


<% end %>



###
  FluentLenium



  MockMvc:n lisäksi järjestelmätestaukseen käytetään melko paljon käyttöliittymän testaamiseen tarkoitettua <a href="http://www.seleniumhq.org/" target="_blank">Selenium</a>ia ja siihen liittyviä lisäosia kuten <a href="https://github.com/FluentLenium/FluentLenium" target="_blank">FluentLenium</a>. Käytännössä edellämainitut ovat web-selaimen toimintojen automatisointiin tarkoitettuja välineitä, jotka antavat sovelluskehittäjälle mahdollisuuden käydä läpi sovelluksen käyttöliittymää ohjelmallisesti.



  Lisätään FluentLenium-kirjaston vaatimat riippuvuudet, oletetaan että testit kirjoitetaan JUnit-testikirjaston avulla (FluentLenium tarjoaa myös muita vaihtoehtoja).


```xml
&lt;dependency&gt;
    &lt;groupId&gt;org.fluentlenium&lt;/groupId&gt;
    &lt;artifactId&gt;fluentlenium-core&lt;/artifactId&gt;
    &lt;version&gt;3.4.1&lt;/version&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.fluentlenium&lt;/groupId&gt;
    &lt;artifactId&gt;fluentlenium-junit&lt;/artifactId&gt;
    &lt;version&gt;3.4.1&lt;/version&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.fluentlenium&lt;/groupId&gt;
    &lt;artifactId&gt;fluentlenium-assertj&lt;/artifactId&gt;
    &lt;version&gt;3.4.1&lt;/version&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.seleniumhq.selenium&lt;/groupId&gt;
    &lt;artifactId&gt;htmlunit-driver&lt;/artifactId&gt;
&lt;/dependency&gt;
```


  Ajatellaan loppukäyttäjän haluamaa toiminnallisuutta "Käyttäjä voi ilmoittautua oppitunnille". Järjestelmä tarjoaa sivun, jonka ensimmäinen linkki vie ilmoittautumissivulle. Ilmoittautumissivulla tulee olla tietty otsikko -- varmistamme, että olemme oikealla sivulla. Tämän lisäksi ilmoiuttautumissivulla on lomakekenttä, jonka attribuutin <em>id</em> arvo on "name". Jos kentällä on attribuutti <em>id</em>, voidaan se valita kirjoittamalla "#kentannimi". Täytetään kenttään arvo "Bob" ja lähetetään lomake. Tämän jälkeen sivulla tulee olla teksti "Ilmoittautuminen onnistui!".


```java
// importit

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ElokuvatietokantaTest extends FluentTest {

    @LocalServerPort
    private Integer port;

    @Test
    public void canSignUp() {
        goTo("http://localhost:" + port);

        find("a").first().click();
        assertEquals("Ilmoittautuminen", window().title());

        find("#name").fill().with("Bob");
        find("form").first().submit();

        assertTrue(pageSource().contains("Ilmoittautuminen onnistui!"));
    }
// ...
```



  Yllä annotaatio `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)` käynnistää palvelimen integraatiotestausta satunnaisessa portissa, joka saadaan muuttujaan `port` annotaation `@LocalServerPort` avulla.



  Yllä menemme ensin paikalliseen osoitteeseen `http://localhost:<em>portti</em>`, missä portin numero on satunnaisesti valittu -- surffaamme siis haluttuun osoitteeseen. Haemme tämän jälkeen ensimmäisen linkin, eli `a`-elementin sivulta, ja klikkaamme sitä. Tämän jälkeen tarkistamme, että sivun otsake on `Ilmoittautuminen`. Tätä seuraa kentän, jonka id on "name" täyttäminen "Bob"-merkkijonolla, jonka jälkeen lomake lähetetään. Kun lomake on lähetetty, haetaan sivun lähdekoodista tekstiä "Ilmoittautuminen onnistui!". Jos tekstiä ei löydy, testi epäonnistuu.



  FluentLenium-kirjastoon liittyvää dokumentaatiota löytyy osoitteesta <a href="http://www.fluentlenium.org/" target="_blank">http://www.fluentlenium.org/</a>, jonka lisäksi googlesta löytyy apua seuraavaan tehtävään.




<programming-exercise name='Movie Database Redux' } do %>


    Muistamme toisesta osiosta myös tehtävän, missä tehtiin sovellus elokuvien ja näyttelijöiden hallintaan. Tässä tehtävässä harjoitellaan hieman järjestelmätestausta FluentLeniumin avulla. Tehtävässä ei ole automaattisia testejä, sillä sinun tehtävänä on toteuttaa ne.


  <h2>Näyttelijän lisääminen ja poistaminen</h2>


    Luo testikansioon `wad.selenium` testiluokka `ActorTest`, johon asetat Selenium-testaamiseen tarvittavat komponentit.



    Toteuta testi, jolla varmistetaan että käyttäjän lisääminen ja poistaminen onnistuu. Testin tulee toimia seuraavasti:


1. Menee näyttelijäsivulle
2. Tarkistaa ettei sivulla ole tekstiä "Van Damme"
3. Etsii kentän jonka id on "name", asettaa kenttään tekstin "Van Damme", ja lähettää lomakkeeseen liittyvän lomakkeen.
4. Tarkistaa että sivulla on teksti "Van Damme"
5. Klikkaa "Van Damme"en liittyvää poista-nappia
6. Tarkistaa että sivulla ei ole tekstiä "Van Damme"




    Toteuta seuraavaksi testi, joka tekee seuraavat askeleet:


1. Menee näyttelijäsivulle
2. Tarkistaa ettei sivulla ole tekstiä "Van Damme"
3. Tarkistaa ettei sivulla ole tekstiä "Chuck Norris"
4. Etsii kentän jonka id on "name", asettaa kenttään tekstin "Chuck Norris", ja lähettää lomakkeeseen liittyvän lomakkeen.
5. Tarkistaa ettei sivulla ole tekstiä "Van Damme"
6. Tarkistaa että sivulla on teksti "Chuck Norris"
7. Etsii kentän jonka id on "name", asettaa kenttään tekstin "Van Damme", ja lähettää lomakkeeseen liittyvän lomakkeen.
8. Tarkistaa että sivulla on teksti "Van Damme"
9. Tarkistaa että sivulla on teksti "Chuck Norris"
10. Klikkaa "Van Damme"en liittyvää poista-nappia
11. Klikkaa henkilön "Chuck Norris" poista-nappia
12. Tarkistaa ettei sivulla ole tekstiä "Van Damme"
13. Tarkistaa eteti sivulla ole tekstiä "Chuck Norris"




  <h2>Elokuvan lisääminen ja näyttelijän lisääminen elokuvaan</h2>


    Luo testikansioon `wad.selenium` testiluokka `MovieTest`, johon asetat Selenium-testaamiseen tarvittavat komponentit.



    Toteuta seuraavat askeleet


1. Mene elokuvasivulle
2. Tarkista että sivulla ei ole tekstiä "Bloodsport"
3. Tarkista että sivulla ei ole tekstiä "Van Damme"
4. Etsi kenttä jonka id on "name" ja lisää siihen arvo "Bloodsport"
5. Etsi kenttä jonka id on "lengthInMinutes" ja lisää siihen arvo "92"
6. Lähetä kenttään liittyvä lomake
7. Tarkista että sivulla on teksti "Bloodsport"
8. Tarkista että sivulla ei ole tekstiä "Van Damme"
9. Mene näyttelijäsivulle
10. Tarkista ettei sivulla ole tekstiä "Van Damme"
11. Etsi kenttä jonka id on "name", aseta kenttään teksti "Van Damme", ja lähetä lomake.
12. Tarkistaa että sivulla on teksti "Van Damme"
13. Etsi linkki, jossa on teksti "Van Damme" ja klikkaa siitä.
14. Etsi nappi, jonka id on "add-to-movie", ja klikkaa sitä.
15. Mene elokuvasivulle
16. Tarkista että sivulla on teksti "Bloodsport"
17. Tarkista että sivulla on teksti "Van Damme"




    Suorita taas testit klikkaamalla projektia oikealla hiirennäppäimellä ja valitsemalla `Test`.


<% end %>


##
  Konfiguraatioprofiilit ja testaaminen




  Testien ajamisessa voidaan käyttää myös konfiguraatioprofiileja. Kun sovellukselle on määritelty erilaisia profiileja, esimerkiksi kirjautumiseen liittyvät konfiguraatiot, voidaan tietty profiili aktivoida testeissä. Testin aktivointi tapahtuu annotaation <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/context/ActiveProfiles.html" target="_blank">ActiveProfiles</a> avulla.



  Alla olevassa esimerkissä testiluokan testit suoritetaan siten, että käytössä on profiiliin "test" liittyvä konfiguraatio, eli se konfiguraatio, joka on määritelty annotaatiolla `@Profile("test")` (tai `@Profile(values = {"test", "muita"})` jos halutaan että samaa konfiguraatiota käytetään useammassa profiilissa.


```java
@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("dev")
public class ApplicationTest {
    // ...
```



#
  Tyypillinen ohjelmistokehitysprosessi



  Ohjelmiston elinkaareen kuuluu vaatimusmäärittely, suunnittelu, toteutus, testaus, sekä ylläpito ja jatkokehitys. Vaatimusmäärittelyyn kuuluu ohjelmistoon liittyvien toiveiden ja vaatimusten kartoitus, jota seuraa suunnittelu, missä pohditaan miten vaatimukset toteutetaan. Toteutusvaihe sisältää ohjelmointia sekä sovelluksen elinympäristöön liittyvien komponenttien yhteensovittamista. Testaukseen kuuluu sovelluksen testaus niin automaattisesti kuin manuaalisesti. Kun ohjelmisto tai sen osa on toiminnassa, tulee elinkaaren osaksi myös käytössä olevasta ohjelmistosta löytyvien virheiden korjaaminen sekä uusien ominaisuuksien kehittäminen.



  Ohjelmointiin ja ohjelmistojen kehitykseen liittyy jatkuva etsiminen ja kokeileminen. Ongelmat pyritään ratkaisemaan kokeilemalla vaihtoehtoja kunnes ongelmaan löytyy sopiva ratkaisu. Jos ongelma on osittain tuttu, on tarkasteltavia vaihtoehtoja vähemmän, ja jos ongelma on tuttu, on siihen tyypillisesti ainakin yksi valmis ratkaisumalli. Tämän hetken suosituimmat ohjelmistokehitysmenetelmät (ketterät menetelmät kuten Scrum ja Kanban) ohjaavat työn läpinäkyvyyteen, oman työskentelyn kehittämiseen sekä siihen, että muiden osallistuminen ohjelmistokehitykseen on helppoa.



##
  Ohjelmistoon liittyvät toiveet ja vaatimukset



  Ohjelmistoon liittyvistä toiveista ja vaatimuksista keskustellaan asiakkaan ja käyttäjien kanssa, ja ne kirjataan muistiin. Vaatimukset kirjataan usein lyhyessä tarinamuodossa, joka kerrotaan uutta toiminnallisuutta toivovan henkilön näkökulmasta: "As a (käyttäjän tyyppi) I want (tavoite) so that (syy)." -- esimerkiksi "As a user I want to be able to view the messages so that I can see what others have written". Vaatimuksia kirjattaessa saadaan kuva ohjelmistolta toivotusta toiminnallisuudesta, jonka jälkeen toiminnallisuuksia voidaan järjestää tärkeysjärjestykseen.



  Toiminnallisuuksien tärkeysjärjestykseen asettaminen tapahtuu yhdessä asiakkaan ja käyttäjien kanssa. Kun toiminnallisuudet ovat kutakuinkin tärkeysjärjestyksessä, valitaan niistä muutama kerrallaan työstettäväksi. Samalla varmistetaan asiakkaan kanssa, että ohjelmistokehittäjät ja asiakas ymmärtävät toiveen samalla tavalla. Kun toiminnallisuus on valmis, toiminnallisuus näytetään asiakkaalle ja asiakas pääsee kertomaan uusia toiminnallisuustoiveita sekä mahdollisesti uudelleenjärjestelemään vaatimusten tärkeysjärjestystä.



  Vaatimuksia ja toiveita, sekä niiden kulkemista projektin eri vaiheissa voidaan käsitellä esimerkiksi <a href="https://trello.com/" target="_blank">Trello</a>:n avulla. <a href="https://www.youtube.com/watch?v=7najSDZcn-U" target="_blank">Ohje Trellon käyttöön</a>.




##
  Versionhallinta



  Ohjelmiston lähdekoodin ja dokumentaatio tallennetaan keskitetysti versionhallintaan, mistä kuka tahansa voi hakea ohjelmistosta uusimman version sekä lähettää sinne uudemman päivitetyn version. Käytännössä jokaisella ohjelmistokehittäjällä on oma hiekkalaatikko, jossa ohjelmistoon voi tehdä muutoksia vaikuttamatta muiden tekemään työhön. Jokaisella ohjelmistokehittäjällä on yleensä samat tai samankaltaiset työkalut (ohjelmointiympäristö, ...), mikä helpottaa muiden kehittäjien auttamista.



  Kun ohjelmistokehittäjä valitsee vaatimuksen työstettäväksi, hän tyypillisesti hakee projektin versionhallinnasta projektin uusimman version, sekä lähtee toteuttamaan uutta vaatimusta. Kun vaatimukseen liittyvä osa tai komponentti on valmis sekä testattu paikallisesti (automaattiset testit on olemassa, toimii ohjelmistokehittäjän koneella), lähetetään uusi versio versionhallintapalvelimelle.



  Versionhallintapalvelin sisältää myös mahdollisesti useampia versioita projektista. Esimerkiksi git-mahdollistaa ns. branchien käyttämisen, jolloin uusia ominaisuuksia voidaan toteuttaa erillään "päähaarasta". Kun uusi ominaisuus on valmis, voidaan se lisätä päähaaraan. Versionhallinnassa olevia koodeja voidaan myös tägätä julkaisuversioiksi.



  Yleisin versionhallintatyökalu on <a href="https://en.wikipedia.org/wiki/Git_(software)" target="_blank">Git</a>, joka on käytössä <a href="https://github.com/" target="_blank">Github</a>issa. <a href="https://guides.github.com/activities/hello-world/" target="_blank">Ensiaskeleet Githubin käyttöön</a>.




##
  Jatkuva integraatio



  Versionhallintapalvelin on tyypillisesti kytketty integraatiopalvelimeen, jonka tehtävänä on suorittaa ohjelmistoon liittyvät testit jokaisen muutoksen yhteydessä sekä tuottaa niistä mahdollisesti erilaisia raportteja. Integraatiopalvelin kuuntelee käytännössä versionhallintajärjestelmässä tapahtuvia muutoksia, ja hakee uusimman lähdekoodiversion muutoksen yhteydessä.



  Kun testit ajetaan sekä paikallisella kehityskoneella että erillisellä integraatiokoneella ohjelmistosta huomataan virheitä, jotka eivät tule esille muutoksen tehneen kehittäjän paikallisella koneella (esimerkiksi erilainen käyttöjärjestelmä, selain, ...). On myös mahdollista että ohjelmistosta ei noudeta kaikkia sen osia -- ohjelmisto voi koostua useista komponenteista --  jolloin kaikkien vaikutusten testaaminen paikallisesti on mahdotonta. Jos testit eivät mene läpi integraatiokoneella, korjataan muutokset mahdollisimman nopeasti.



  Työkaluja automaattiseen kääntämiseen ja jatkuvaan integrointiin ovat esimerkiksi <a href="https://travis-ci.org" target="_blank">Travis</a> ja <a href="https://coveralls.io" target="_blank">Coveralls</a>. Travis varmistaa että viimeisin lähdekoodiversio kääntyy ja että testit menevät läpi, ja Coveralls tarjoaa välineitä testikattavuuden ja projektin historian tarkasteluun -- tässä hyödyksi on esimerkiksi <a href="https://github.com/cobertura/cobertura" target="_blank">Cobertura</a>. Kummatkin ovat ilmaisia käyttää kun projektin lähdekoodi on avointa -- kumpikin tarjoaa myös suoran Github-tuen.



  Travisin käyttöönottoon vaaditaan käytännössä se, että projekti on esimerkiksi Githubissa ja että sen juurikansiossa on travisin konfiguraatiotiedosto `.travis.yml`. Yksinkertaisimmillaan konfiguraatiotiedosto sisältää vain käytetyn ohjelmointikielen -- travis osaa esimerkiksi päätellä projektin tyypin `pom.xml`-tiedoston pohjalta. <a href="https://docs.travis-ci.com/user/getting-started/" target="_blank">Ohje Traviksen käyttöönottoon</a>.




##
  Nopeasti näytille



  Kun uusi vaatimus tai sen osa on saatu valmiiksi, kannattaa viedä palvelimelle palautteen saamista varten. On tyypillistä, että ohjelmistolle on ainakin <em>Staging</em>- ja <em>Tuotanto</em>-palvelimet. Staging-palvelin on lähes identtinen ympäristö tuotantoympäristöön verrattuna. Staging (usein myös QA)-ympäristöön kopioidaan ajoittain tuotantoympäristön data, ja se toimii viimeisenä testaus- ja validointipaikkana (Quality assurance) ennen tuotantoon siirtoa. QA-ympäristöä käytetään myös demo- ja harjoitteluympäristönä. Kun QA-ympäristössä oleva sovellus on päätetty toimivaksi, siirretään sovellus tuotantoympäristöön.



  Tuotantoympäristö voi olla yksittäinen palvelin, tai se saattaa olla joukko palvelimia, joihin uusin muutos viedään hiljalleen. Tuotantoympäristö on tyypillisesti erillään muista ympäristöistä mahdollisten virheiden minimoimiseksi.



  Käytännössä versioiden päivitys tuotantoon tapahtuu usein automaattisesti. Esimerkiksi ohjelmistoon liittyvä Travis-konfiguraatio voidaan määritellä niin, että jos kaikki testit menevät läpi integraatiopalvelimella, siirretään ohjelmisto <a href="https://docs.travis-ci.com/user/deployment/heroku" target="_blank">automaattisesti tuotantoon</a>. Esimerkiksi Herokussa sijaitsevaan sovellukseen muutokset voidaan hakea automaattisesti Githubista (<a href="https://devcenter.heroku.com/articles/github-integration" target="_blank">ohje</a>).



  Kannattaa vielä lukea aiheesta <a href="http://felippepuhle.com.br/getting-started-with-spring-boot-travis-and-heroku/" target="_blank">blogikirjoitus</a>.



<programming-exercise name='Alive!' } do %>


    Tehtäväpohjassa on yksinkertainen sovellus, joka mahdollistaa esineiden lisäämisen ja listaamisen. Tässä tehtävässä harjoittelet sovelluksen siirtämistä Githubiin, Travisiin ja Herokuun. Joutunet tekemään aika selvittelyä tehtävää ratkoessa.



  <h2>Github</h2>


    Jos käytössäsi ei ole Github tunnusta, luo se nyt. Lisää tämän jälkeen tehtävän koodit githubiin (huom! älä siirrä target-kansiota!).



    Kun sovelluksen lähdekoodit ovat oman tunnuksesi alla Githubissa, muokkaa luokan AliveApplication metodia `public static String githubUrl` siten, että se palauttaa sovelluksen Github-osoitteen.


  <h2>Travis</h2>


    Luo tämän jälkeen Travis-tunnus ja lisää projekti Travis-palveluun. Traviksen tulee ajaa sovelluksen testit aina kun sovelluksen uusi versio lisätään Githubiin.



    Kun github-travis -integraatio toimii, muokkaa luokan AliveApplication metodia `public static String travisUrl` siten, että se palauttaa sovelluksen Travis-osoitteen.


  <h2>Heroku</h2>


    Luo lopulta Heroku-tunnus ja vie sovellus Herokuun. Sovelluksen tulee olla kytkettynä Travis-palveluun. Jos sovelluksen testit menevät läpi Travis-palvelussa kun uusi versio lisätään Githubiin, tulee sovelluksen uusi versio viedä myös Herokuun.



    Kun github-travis-heroku -integraatio toimii, muokkaa luokan AliveApplication metodia `public static String herokuUrl` siten, että se palauttaa sovelluksen Heroku-osoitteen.


<% end %>


# part 5


<text-box variant='hint' name='Viidennen osan tavoitteet' } do %>


    Ymmärtää REST-arkkitehtuurimallin perusperiaatteet. Osaa toteuttaa palvelun, joka tarjoaa dataa REST-muotoisen rajapinnan yli. Osaa toteuttaa palvelun, joka hyödyntää REST-rajapintaa. Tietää, että Javascript-koodia voi suorittaa selaimessa käyttäjän koneella. Osaa tehdä selainohjelmistosta Javascript-pyynnön palvelimelle. Osaa päivittää näkymää Javascript-pyynnön vastauksen perusteella.


<% end %>


#
  REST-Arkkitehtuurimalli




  REST (<a href="http://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank">representational state transfer</a>) on ohjelmointirajapintojen toteuttamiseen tarkoitettu arkkitehtuurimalli (tai tyyli). REST-malli määrittelee sovellukset tietoa käsittelevien osien (komponentit), tietokohteiden (resurssit), sekä näiden yhteyksien kautta.



  Tietoa käsittelevät osat ovat selainohjelmisto, palvelinohjelmisto, ym. Resurssit ovat sovelluksen käsitteitä (henkilöt, kirjat, laskentaprosessit, laskentatulokset -- käytännössä mikä tahansa voi olla resurssi) sekä niitä yksilöiviä osoitteita. Resurssikokoelmat ovat löydettävissä ja navigoitavissa: resurssikokoelma voi löytyä esimerkiksi osoitteesta `/persons`, `/books`, `/processes` tai `/results`. Yksittäisille resursseille määritellään uniikit osoitteet (esimerkiksi `/persons/1`), ja niillä on myös esitysmuoto (esimerkiksi HTML, JSON tai XML); dataa voi tyypillisesti lähettää ja vastaanottaa samassa muodossa.



  Resursseja ja tietoa käsittelevien osien yhteys perustuu tyypillisesti asiakas-palvelin -malliin, missä asiakas tekee pyynnön ja palvelin kuuntelee ja käsittelee vastaanottamiaan pyyntöjä sekä vastaa niihin.



<text-box variant='hint' name='Principled Design of the Modern Web Architecture' } do %>


    Tutustu Roy T. Fieldingin ja Richard N. Taylorin artikkeliin <a href="https://www.ics.uci.edu/~fielding/pubs/webarch_icse2000.pdf" target="_blank">"Principled Design of the Modern Web Architecture"</a>, jossa REST määritellään sekä Fieldingin väitöskirjan <a href="http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm" target="_blank">viidenteen lukuun</a>. Vaikka emme tässä kappaleessa täytä kaikkia REST-rajapintoihin liittyviä vaatimuksia -- ainakaan aluksi -- on Roy Fielding sitä mieltä, että <a href="http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven" target="_blank">oleellista on mahdollisuus resurssien välillä navigointiin</a>.



    <em>"A truly RESTful API looks like hypertext. Every addressable unit of information carries an address, either explicitly (e.g., link and id attributes) or implicitly (e.g., derived from the media type definition and representation structure). Query results are represented by a list of links with summary information, not by arrays of object representations (query is not a substitute for identification of resources)."
    </em>


<% end %>


##
  REST-rajapinnat web-sovelluksissa



  HTTP-protokollan yli käsiteltävillä REST-rajapinnoilla on tyypillisesti seuraavat ominaisuudet:



  -
    Juuriosoite resurssien käsittelyyn (esimerkiksi `/books`)

  -
    Resurssien esitysmuodon määrittelevä mediatyyppi (esimerkiksi `HTML`, `JSON`, ...), joka kertoo asiakkaalle miten resurssiin liittyvä data tulee käsitellä.

  -
    Resursseja voidaan käsitellä HTTP-protokollan metodeilla (GET, POST, DELETE, ..)




  Kirjojen käsittelyyn ja muokkaamiseen määriteltävä rajapinta voisi olla esimerkiksi seuraavanlainen:



  -
    GET osoitteeseen `/books` palauttaa kaikkien kirjojen tiedot.

  -
    GET osoitteeseen `/books/{id}`, missä `{id}` on yksittäisen kirjan yksilöivä tunniste, palauttaa kyseisen kirjan tiedot.

  -
    PUT osoitteeseen `/books/{id}`, missä `{id}` on yksittäisen kirjan yksilöivä tunniste, muokkaa kyseisen kirjan tietoja. Kirjan uudet tiedot lähetetään osana pyyntöä.

  -
    DELETE osoitteeseen `/books/{id}` poistaa kirjan tietyllä tunnuksella.

  -
    POST osoitteeseen `/books` luo uuden kirjan pyynnössä lähetettävän datan pohjalta.




  Osoitteissa käytetään tyypillisesti substantiivejä -- ei `books?id={id}` vaan `/books/{id}`. HTTP-pyynnön tyyppi määrittelee operaation. DELETE-tyyppisellä pyynnöllä poistetaan, POST-tyyppisellä pyynnöllä lisätään, PUT-tyyppisellä pyynnöllä päivitetään, ja GET-tyyppisellä pyynnöllä haetaan tietoja.



  Datan muoto on toteuttajan päätettävissä. Tällä hetkellä eräs suosituista datamuodoista on <a href="http://en.wikipedia.org/wiki/JSON" target="_blank">JSON</a>, sillä sen käyttäminen osana selainohjelmistoja on suoraviivaista JavaScriptin kautta. Myös palvelinohjelmistot tukevat olioiden muuttamista JSON-muotoon.



  Oletetaan että edelläkuvattu kirjojen käsittelyyn tarkoitettu rajapinta käsittelee JSON-muotoista dataa. Kirjaa kuvaava luokka on seuraavanlainen:


```java
// pakkaus ja importit

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Book extends AbstractPersistable&lt;Long&gt; {
    private String name;
}
```


  Kun luokasta on tehty olio, jonka `id`-muuttujan arvo on `2` ja nimi `"Harry Potter and the Chamber of Secrets"`, on sen JSON-esitys (esimerkiksi) seuraavanlainen:


<pre>
{
  "id":2,
  "name":"Harry Potter and the Chamber of Secrets"
}
</pre>


  JSON-notaatio määrittelee olion alkavalla aaltosululla `{`, jota seuraa oliomuuttujien nimet ja niiden arvot. Lopulta olio päätetään sulkevaan aaltosulkuun `}`. Oliomuuttujien nimet ovat hipsuissa `&quot;` sillä ne käsitellään merkkijonoina. Muuttujien arvot ovat arvon tyypistä riippuen hipsuissa. Tarkempi kuvaus JSON-notaatiosta löytyy sivulta <a href="http://json.org/" target="_blank">json.org</a>.



  Pyynnön rungossa lähetettävän JSON-muotoisen datan muuntaminen olioksi tapahtuu annotaation <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestBody.html" target="_blank">@RequestBody</a> avulla. Annotaatio @RequestBody edeltää kontrollerimetodin parametrina olevaa oliota, johon JSON-muotoisen datan arvot halutaan asettaa.


```java
    @PostMapping("/books")
    public String postBook(@RequestBody Book book) {
        bookRepository.save(book);
        return "redirect:/books";
    }
```


  Vastauksen saa lähetettyä käyttäjälle JSON-muodossa lisäämällä pyyntöä käsittelevään metodiin annotaatio <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/ResponseBody.html" target="_blank">@ResponseBody</a>. Annotaatio @ResponseBody pyytää Spring-sovelluskehystä asettamaan palvelimen tuottaman datan selaimelle lähetettävän vastauksen runkoon. Jos vastaus on olio, muutetaan se (oletuksena) automaattisesti JSON-muotoiseksi vastaukseksi.


```java
    @GetMapping("/books/{id}")
    @ResponseBody
    public Book getBook(@PathVariable Long id) {
        return bookRepository.getOne(id);
    }
```


  Alla oleva esimerkki sekä tallentaa olion tietokantaan, että palauttaa tietokantaan tallennetun olion pääavaimineen.


```java
    @PostMapping("/books")
    @ResponseBody
    public Book postBook(@RequestBody Book book) {
        return bookRepository.save(book);
    }
```


  Palvelulle voi nyt lähettää JSON-muotoista dataa; vastaus on myös JSON-muotoinen, mutta luotavaan kirjaan on liitetty tietokantaan tallennuksen yhteydessä saatava kirjan yksilöivä tunnus.



  Voimme lisätä annotaatioille `@GetMapping`, `@PostMapping`, jne lisätietoa metodin käsittelemästä datasta. Attribuutti `consumes` kertoo minkälaista dataa metodin kuuntelema osoite hyväksyy. Metodi voidaan rajoittaa vastaanottamaan JSON-muotoista dataa merkkijonolla `"application/json"`. Vastaavasti metodille voidaan lisätä tietoa datasta, jota se tuottaa. Attribuutti `produces` kertoo tuotettavan datatyypin. Alla määritelty metodi sekä vastaanottaa että tuottaa JSON-muotoista dataa.


```java
    @PostMapping(path="/books", consumes="application/json", produces="application/json")
    @ResponseBody
    public Book postBook(@RequestBody Book book) {
        return bookStorage.create(book);
    }
```


  Jos toteutat omaa REST-rajapintaa, kannattanee määritellä kontrolleriluokan annotaatioksi `@RestController`. Tämä asettaa jokaisen luokan metodiin annotaation `@ResponseBody` sekä sopivan datatyypin -- tässä tapauksessa "application/json".



  Toteutetaan seuraavaksi kaikki tarvitut metodit kirjojen tallentamiseen. Kontrolleri hyödyntää erillistä luokkaa, joka tallentaa kirjaolioita tietokantaan ja tarjoaa tuen aiemmin määrittelemiemme books-osoitteiden ja pyyntöjen käsittelyyn -- PUT-metodi on jätetty omaa kokeilua varten.



```java
// importit

@RestController
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/books")
    public List&lt;Book&gt; getBooks() {
        return bookRepository.findAll();
    }

    @GetMapping("/books/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookRepository.getOne(id);
    }

    @DeleteMapping("/books/{id}")
    public Book deleteBook(@PathVariable Long id) {
        return bookRepository.deleteById(id);
    }

    @PostMapping("/books")
    public Book postBook(@RequestBody Book book) {
        return bookRepository.save(book);
    }
}
```

<text-box variant='hint' name='Apuvälineitä rajapinnan tarjoavan sovelluksen testaamiseen' } do %>


    Avoimen rajapinnan kolmannen osapuolen ohjelmistoille tarjoavat palvelinohjelmistot eivät aina sisällä erillistä käyttöliittymää. Niiden testaaminen tapahtuu sekä automaattisilla testeillä, että erilaisilla selainohjelmistoilla. Yksi hyvin hyödyllinen apuväline on Postman, jonka saa <a href="https://www.getpostman.com" target="_blank" norel>työpöytäsovelluksena</a> ja <a href="https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop" target="_blank" norel>Chromen liitännäisenä</a>.



    Postmanin hyödyntäminen on erittäin suositeltavaa -- kannattaa katsoa sen johdatusvideo, joka löytyy Postmanin sivulta. Katso myös <a href="https://www.youtube.com/watch?v=7YcW25PHnAA" target="_blank">RESTiä käsittelevä</a> Youtube-video, missä Postmania käytetään hieman.

<% end %>


<programming-exercise name='ScoreService (2 osaa)' } do %>


    Tässä tehtävässä toteutetaan pelitulospalvelu, joka tarjoaa REST-rajapinnan pelien ja tuloksien käsittelyyn. <strong>Huom! Kaikki syötteet ja vasteet ovat JSON-muotoisia olioita.</strong> Tehtäväpohjassa on toteutettu valmiiksi luokat `Game` ja `Score` sekä käytännölliset `Repository`-rajapinnat.


  <h2>GameController</h2>


    Pelejä käsitellään luokan `Game` avulla.




    Toteuta pakkaukseen `wad.controller` luokka `GameController`, joka tarjoaa REST-rajapinnan pelien käsittelyyn:




    -
      POST `/games` luo uuden pelin sille annetun pelin tiedoilla ja palauttaa luodun pelin tiedot. (Huom. vieläkin! Pyynnön <strong>rungossa</strong> oleva data on aina JSON-muotoista. Vastaukset tulee myös palauttaa JSON-muotoisina.)

    -
      GET `/games` listaa kaikki talletetut pelit.

    -
      GET `/games/{name}` palauttaa yksittäisen pelin tiedot <strong>pelin nimen perusteella</strong>.

    -
      DELETE `/games/{name}` poistaa nimen mukaisen pelin. Palauttaa poistetun pelin tiedot.



  <h2>ScoreController</h2>


    Jokaiselle pelille voidaan tallettaa pelikohtaisia tuloksia (luokka `Score`). Jokainen pistetulos kuuluu tietylle pelille, ja tulokseen liittyy aina pistetulos `points` numerona sekä pelaajan nimimerkki `nickname`.



    Toteuta luokka `wad.controller.ScoreController`, joka tarjoaa REST-rajapinnan tuloksien käsittelyyn:



    -
      POST `/games/{name}/scores` luo uuden tuloksen pelille `name` ja asettaa tulokseen pelin tiedot. Tuloksen tiedot lähetetään kyselyn rungossa.

    -
      GET `/games/{name}/scores` listaa pelin `name` tulokset.

    -
      GET `/games/{name}/scores/{id}` palauttaa tunnuksella `id` löytyvän tuloksen `name`-nimiselle pelille.

    -
      DELETE `/games/{name}/scores/{id}` poistaa avaimen `id` mukaisen tuloksen peliltä `name` (pelin tietoja ei tule pyynnön rungossa). Palauttaa poistetun tuloksen tiedot.



<% end %>


##
  Valmiin palvelun käyttäminen



  Toisen sovelluksen tarjoamaan REST-rajapintaan pääsee kätevästi käsiksi <a href="http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html" target="blank">RestTemplate</a>-luokan avulla. Voimme luoda oman komponentin kirjojen hakemiseen.


```java
// importit

@Service
public class BookService {

    private RestTemplate restTemplate;

    public BookService() {
        this.restTemplate = new RestTemplate();
    }

    // tänne luokan tarjoamat palvelut
}
```


  Alla on kuvattuna RestTemplaten käyttö tiedon hakemiseen, päivittämiseen, poistaamiseen ja lisäämiseen. Esimerkeissä merkkijono <em>osoite</em> vastaa palvelimen osoitetta, esimerkiksi `http://www.google.com`.



  -
    GET osoitteeseen <em>/books</em> palauttaa kaikkien kirjojen tiedot <em>tai</em> osajoukon kirjojen tiedoista -- riippuen toteutuksesta.

  ```java
// kirjojen hakeminen
List&lt;Book&gt; books = restTemplate.getForObject("<em>osoite</em>/books", List.class);
  <% end %>

  -
    GET osoitteeseen <em>/books/{id}</em>, missä {id} on yksittäisen kirjan yksilöivä tunniste, palauttaa kyseisen kirjan tiedot.

  ```java
// tunnuksella 5 määritellyn kirjan hakeminen
Book book = restTemplate.getForObject("<em>osoite</em>/books/{id}", Book.class, 5);
  ```

  -
    PUT osoitteeseen <em>/books/{id}</em>, missä {id} on yksittäisen kirjan yksilöivä tunniste, muokkaa kyseisen kirjan tietoja tai lisää kirjan kyseiselle tunnukselle (toteutuksesta riippuen, lisäystä ei aina toteutettu). Kirjan tiedot lähetetään pyynnön rungossa.

  ```java
// tunnuksella 5 määritellyn kirjan hakeminen
Book book = restTemplate.getForObject("<em>osoite</em>/books/{id}", Book.class, 5);
book.setName(book.getName() + " - DO NOT BUY!");

// kirjan tietojen muokkaaminen
restTemplate.put("<em>osoite</em>/books/{id}", book, 5);
```

  -
    DELETE osoitteeseen <em>/books/{id}</em> poistaa kirjan tietyllä tunnuksella.


  ```java
 // tunnuksella 32 määritellyn kirjan poistaminen
restTemplate.delete("<em>osoite</em>/books/{id}", 32);
  ```

  -
    POST osoitteeseen <em>/books</em> luo uuden kirjan pyynnön rungossa lähetettävän datan pohjalta. Palvelun vastuulla on päättää kirjalle tunnus.


  ```java
Book book = new Book();
book.setName("Harry Potter and the Goblet of Fire");

// uuden kirjan lisääminen
book = restTemplate.postForObject("<em>osoite</em>/books", book, Book.class);
```



  Usein sovellukset hyödyntävät kolmannen osapuolen tarjoamaa palvelua omien toiminnallisuuksiensa toteuttamiseen. Harjoitellaan tätä seuraavaksi.



<programming-exercise name='GameRater' } do %>


    Palvelu <em>GameRater</em> lisää aiempaan tulospalveluun mahdollisuuden arvostella yksittäisiä pelejä antamalla niille numeroarvosanan 0-5. Arvostelu tehdään kuitenkin erilliseen palveluun, emmekä siis laajenna edellistä palvelua suoraan.



    <em>GameRater</em>-palvelun tulee käyttää <em>ScoreService</em>-palvelun REST-rajapintaa, jonka avulla se tarjoaa samanlaisen rajapinnan pelien ja tulosten käsittelyyn. Ainoastaan pelien arvostelut käsitellään ja talletetaan tässä palvelussa! Arvosteluihin käytettävä entiteetti `Rating` ja siihen liittyvät palveluluokat on valmiina tehtäväpohjassa.



    <strong>Huom!</strong> Joudut tutkimaan tehtäväpohjassa annettua koodia, jotta voit hyödyntää sitä. Joudut myös lukemaan tehtävän <em>ScoreService</em> kuvausta tämän tehtävän toteutuksessa.



    <strong>Huom!</strong> Valmis <em>ScoreService</em>-palvelu löytyy osoitteesta `http://wepa-scoreservice-heroku.herokuapp.com/games`, joten voit tehdä tämän tehtävän täysin riippumatta tulospalvelu-tehtävästä.



    Ja asiaan..



    Tee luokka `wad.service.GameRestClient`, joka toteuttaa rajapinnan `GameService`. Luokan tulee käyttää <em>ScoreService</em>-palvelua kaikissa rajapinnan määrittelemissä toiminnoissa. REST-rajapinnan käyttö onnistuu Springin `RestTemplate`-luokan avulla.



    <strong>Huom!</strong> `GameRestClient`-luokan `setUri`-metodi ottaa parametriksi yllä annetun URL-osoitteen valmiiseen <em>ScoreService</em>-palveluun.



    Luo luokka `wad.controller.GameController`, joka tarjoaa <strong>täsmälleen samanlaisen</strong> JSON/REST-rajapinnan kuin <em>Tulospalvelu</em>-palvelun `GameController`, mutta siten, että jokainen toiminto käyttää valmista <em>ScoreService</em>-palvelua rajapinnan `GameService` kautta.



    <strong>Huom!</strong> Muista asettaa `GameService`-rajapinnan kautta URL-osoite valmiiseen `http://wepa-scoreservice-heroku.herokuapp.com/games`-osoitteeseen ohjelman käynnistyessä, esimerkiksi controller-luokan `@PostConstruct`-metodissa.



  <h2>RatingController</h2>


    Jokaiselle pelille voidaan tallettaa pelikohtaisia arvosteluja entiteetin `Rating` avulla. Arvosteluun liittyy numeroarvosana `rating` (0-5).



    Arvostelut liittyvät peleihin, jotka on talletettu eri palveluun, joten entiteetin `Rating` viittaus peliin täytyy tallettaa suoraan avaimena. Koska peleihin viitataan REST-rajapinnassa pelin nimellä, talletetaan jokaiseen `Rating`-entiteettiin pelin nimi attribuuttiin `gameName`. Tämän attribuutin avulla voidaan siis löytää arvosteluja pelin nimen perusteella.



    Toteuta luokka `wad.controller.RatingController`, joka tarjoaa REST-rajapinnan arvostelujen käsittelyyn:



    -
      `POST /games/{name}/ratings` luo uuden arvostelun pelille `name` - ainoa vastaanotettava attribuutti on `rating`

    -
      `GET /games/{name}/ratings` listaa talletetut arvostelut pelille `name`

    -
      `GET /games/{name}/ratings/{id}` palauttaa yksittäisen arvostelun tiedot pelin nimen `name` ja avaimen `id` perusteella




    <em>Jos osoitteessa <a href="http://wepa-scoreservice-heroku.herokuapp.com/games" target="_blank">http://wepa-scoreservice-heroku.herokuapp.com/games</a> olevan palvelun tietokanta on "täynnä", voi tietokannan tyhjentää tekemällä kutsun osoitteeseen `http://wepa-scoreservice-heroku.herokuapp.com/games`.
    </em>


<% end %>


##
  REST-toteutuksen kypsyystasot



  Martin Fowler käsittelee artikkelissaan <a href="http://martinfowler.com/articles/richardsonMaturityModel.html" target="_blank">Richardson Maturity Model</a> REST-rajapintojen kypsyyttä. Richardson Maturity Model (RMM) jaottelee REST-toteutuksen kolmeen tasoon, joista kukin tarkentaa toteutusta.



  Aloituspiste on tason 0 palvelut, joita ei pidetä REST-palveluina. Näissä palveluissa HTTP-protokollaa käytetään lähinnä väylänä viestien lähettämiseen ja vastaanottamiseen, ja HTTP-protokollan käyttötapaan ei juurikaan oteta kantaa. Esimerkki tason 0 palvelusta on yksittäinen kontrollerimetodi, joka päättelee toteutettavan toiminnallisuuden pyynnössä olevan sisällön perusteella.



  Tason 1 palvelut käsittelevät palveluita resursseina. Resurssit kuvataan palvelun osoitteena (esimerkiksi `/books`-resurssi sisältää kirjoja), ja resursseja voidaan hakea tunnisteiden perusteella (esim. `/books/nimi`). Edelliseen tasoon verrattuna käytössä on nyt konkreettisia resursseja; olio-ohjelmoijan kannalta näitä voidaan pitää myös olioina joilla on tila.



  Tasolla 2 resurssien käsittelyyn käytetään kuvaavia HTTP-pyyntötyyppejä. Esimerkiksi resurssin pyyntö tapahtuu GET-metodilla, ja resurssin tilan muokkaaminen esimerkiksi PUT, POST, tai DELETE-metodilla. Näiden lisäksi palvelun vastaukset kuvaavat tapahtuneita toimintoja. Esimerkiksi jos palvelu luo resurssin, vastauksen tulee olla statuskoodi `201`, joka viestittää selaimelle resurssin luomisen onnistumisesta. Oleellista tällä tasolla on pyyntötyyppien erottaminen sen perusteella että muokkaavatko ne palvelimen dataa vai ei (GET vs. muut).



  Kolmas taso sisältää tasot 1 ja 2, mutta lisää käyttäjälle mahdollisuuden ymmärtää palvelun tarjoama toiminnallisuus palvelimen vastausten perusteella. Webissä huomiota herättänyt termi <a href="https://weblogs.java.net/blog/mkarg/archive/2010/02/14/what-hateoas-actually-means" target="_blank">HATEOAS</a> käytännössä määrittelee miten web-resursseja tulisi löytää webistä.



  Roy Fielding kokee vain tason 3 sovelluksen oikeana REST-sovelluksena. Ohjelmistosuunnittelun näkökulmasta jokainen taso parantaa sovelluksen ylläpidettävyyttä -- <em>Level 1 tackles the question of handling complexity by using divide and conquer, breaking a large service endpoint down into multiple resources; Level 2 introduces a standard set of verbs so that we handle similar situations in the same way, removing unnecessary variation; Level 3 introduces discoverability, providing a way of making a protocol more self-documenting.</em> (<a href="http://martinfowler.com/articles/richardsonMaturityModel.html" target="_blank">lähde</a>)



  <em>
    Huom! Sovellusta suunniteltaessa ja toteuttaessa ei tule olettaa että RMM-tason 3 sovellus olisi parempi kuin RMM-tason 2 sovellus. Sovellus voi olla huono riippumatta toteutetusta REST-rajapinnan muodosta -- jossain tapauksissa rajapintaa ei oikeasti edes tarvita; asiakkaan tarpeet ja toiveet määräävät mitä sovelluskehittäjän kannattaa tehdä.
  </em>



##
  Spring Data REST



  Spring-sovelluskehys sisältää projektin <a href="http://projects.spring.io/spring-data-rest/" target="_blank">Spring Data REST</a>, minkä avulla REST-palveluiden tekeminen helpottuu hieman. Lisäämällä projektin `pom.xml`-konfiguraatioon riippuvuus `spring-boot-starter-data-rest` saamme Spring Boot-paketoidun version kyseisestä projektista käyttöömme.


```xml
&lt;dependency&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-data-rest&lt;/artifactId&gt;
&lt;/dependency&gt;
```


  Nyt Repository-luokkamme tarjoavat automaattisesti REST-rajapinnan, jonka kautta resursseihin pääsee käsiksi. REST-rajapinta luodaan oletuksena sovelluksen juureen, ja tehdään luomalla monikko domain-olioista. Esimerkiksi, jos käytössä on luokka `Book`, sekä sille määritelty `BookRepository`, joka perii Spring Data JPA:n rajapinnan, generoidaan rajapinnan `/books` alle toiminnallisuus kirja-olioiden muokkaamiseen.



  Usein sovelluksemme kuitenkin toimivat jo palvelun juuripalvelussa, ja haluemme tarjota rajapinnan erillisessä osoitteesssa. Spring Data REST-projektin konfiguraatiota voi muokata erillisen `RepositoryRestMvcConfiguration`-luokan kautta. Alla olevassa esimerkissä REST-rajapinta luodaan osoitteen `/api/v1`-alle. Annotaatio `@Component` kertoo Springille että luokka tulee ladata käyttöön käynnistysvaiheessa; rajapinta kertoo mistä luokasta on kyse.


```java
// pakkaus ja importit

@Component
public class CustomizedRestMvcConfiguration extends RepositoryRestConfigurerAdapter {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.setBasePath("/api/v1");
    }
}
```


  Nyt jos sovelluksessa on entiteetti `Book` sekä siihen sopiva `BookRepository`, on Spring Data REST-rajapinta osoitteessa `/api/v1/books`.



  Käytännössä sovelluksen kehittäjä ei kuitenkaan halua kaikkia HTTP-protokollan metodeja kaikkien käyttöön. Käytössä olevien metodien rajaaminen onnistuu käytettävää `Repository`-rajapintaa muokkaamalla. Alla olevassa esimerkissä `BookRepository`-rajapinnan olioita ei pysty poistamaan automaattisesti luodun REST-rajapinnan yli.


```java
// pakkaus
import wad.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RestResource;

public interface BookRepository extends JpaRepository&lt;Message, Long&gt; {

    @RestResource(exported = false)
    @Override
    public void delete(Long id);

}
```


##
  Spring Data REST ja RestTemplate



  Spring Data RESTin avulla luotavien rajapintojen hyödyntäminen onnistuu RestTemplaten avulla. Esimerkiksi yllä luotavasta rajapinnasta voidaan hakea `Resource`-olioita, jotka sisältävät kirjoja. RestTemplaten metodin `<a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html#exchange-java.lang.String-org.springframework.http.HttpMethod-org.springframework.http.HttpEntity-java.lang.Class-java.lang.Object...-" target="_blank">exchange</a>` palauttaa vastausentiteetin, mikä sisältää hakemamme olion tiedot. Kyselyn mukana annettava `ParameterizedTypeReference` taas kertoo minkälaiseksi olioksi vastaus tulee muuntaa.


```java
RestTemplate restTemplate = new RestTemplate();
ResponseEntity&lt;Resource&lt;Book&gt;&gt; response =
    restTemplate.exchange("<em>osoite</em>/books/1", // osoite
                  HttpMethod.GET, // metodi
                  null, // pyynnön runko; tässä tyhjä
                  new ParameterizedTypeReference&lt;Resource&lt;Book&gt;&gt;() {}); // vastaustyyppi

if (response.getStatusCode() == HttpStatus.OK) {
    Resource&lt;Book&gt; resource = response.getBody();
    Book book = resource.getContent();
}
```


<text-box variant='hint' name='Avoin data' } do %>


    Verkko on täynnä avoimia (ja osittain avoimia) ohjelmointirajapintoja, jotka odottavat niiden hyödyntämistä. Tällaisia kokoelmia löytyy muunmuassa osoitteista <a href="https://www.avoindata.fi/fi" target="_blank">https://www.avoindata.fi/fi</a>, <a href="https://data.europa.eu/euodp/en/home" target="_blank">https://data.europa.eu/euodp/en/home</a>, <a href="https://index.okfn.org/dataset/" target="_blank">https://index.okfn.org/dataset/</a>, <a href="https://github.com/toddmotto/public-apis" target="_blank">https://github.com/toddmotto/public-apis</a>, jne.


<% end %>


##
  CORS: Rajoitettu pääsy resursseihin



  Palvelinohjelmiston tarjoamiin tietoihin kuten kuviin ja videoihin pääsee käsiksi lähes mistä tahansa palvelusta. Palvelinohjelmiston toiminnallisuus voi rakentua toisen palvelun päälle. On myös mahdollista toteuttaa sovelluksia siten, että ne koostuvat pääosin selainpuolen kirjastoista, jotka hakevat tietoa palvelimilta.



  Selainpuolella Javascriptin avulla tehdyt pyynnöt ovat oletuksena rajoitettuja. Jos palvelimelle ei määritellä erillistä <a href="https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-cors" target="_blank">CORS</a>-tukea, eivät sovelluksen osoitteen ulkopuolelta tehdyt Javascript pyynnöt onnistu. Käytännössä siis, jos käyttäjä on sivulla `hs.fi`, selaimessa toimiva Javascript-ohjelmisto voi tehdä pyyntöjä vain osoitteeseen `hs.fi`.



  Palvelinohjelmistot määrittelevät voiko niihin tehdä pyyntöjä myös palvelimen osoitteen ulkopuolelta ("Cross-Origin Resource Sharing"-tuki). Yksinkertaisimmillaan CORS-tuen saa lisättyä palvelinohjelmistoon lisäämällä kontrollerimetodille annotaatio `@CrossOrigin`. Annotaatiolle määritellään osoitteet, joissa sijaitsevista osoitteista pyyntöjä saa tehdä.


```java
    @CrossOrigin(origins = "/**")
    @GetMapping("/books")
    @ResponseBody
    public List&lt;Book&gt; getBooks() {
        return bookRepository.findAll();
    }
```


  Koko sovelluksen tasolla vastaavan määrittelyn voi tehdä erillisen konfiguraatiotiedoston avulla.


```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
	registry.addMapping("/**");
    }
}
```


  Nyt sovellukseen voi tehdä Javascript-pyynnön missä tahansa sijaitsevasta sovelluksesta.




#
  Selainohjelmistot



  Tutustutaan seuraavaksi selainpuolen toiminnallisuuden peruspalasiin.


##
  Web-sivujen rakenne



  Web-sivut määritellään HTML-kielen avulla. Yksittäinen HTML-dokumentti koostuu sisäkkäin ja peräkkäin olevista elementeistä, jotka määrittelevät sivun rakenteen sekä sivun sisältävän tekstin. Rakenteen määrittelevät elementit erotellaan pienempi kuin (&lt;) ja suurempi kuin (&gt;) -merkeillä. Elementti avataan elementin nimen sisältävällä pienempi kuin -merkillä alkavalla ja suurempi kuin -merkkiin loppuvalla merkkijonolla, esim. `&lt;html&gt;`, ja suljetaan merkkijonolla jossa elementin pienempi kuin -merkin jälkeen on vinoviiva, esim `&lt;/html&gt;`. Yksittäisen elementin sisälle voi laittaa muita elementtejä.



  Tyypillisen HTML-dokumentin runko näyttää seuraavalta. Kun klikkaat allaolevassa `iframe`-elementissä `Result`-tekstiä, näet HTML-sivun, ja kun painat `HTML`-tekstiä, näet HTML-koodin. Klikkaamalla elementin oikeassa ylälaidassa olevasta <em>Edit in JSFiddle</em>-linkistä, pääset muokkaamaan elementtiä suoraan JSFiddlessä.


<iframe width="100%" height="250" src="https://jsfiddle.net/e3tuhyLz/embedded/html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


  &nbsp;



  Yllä olevassa HTML-dokumentissa on dokumentin tyypin kertova erikoiselementti `&lt;!DOCTYPE html&gt;`, joka kertoo dokumentin olevan HTML-sivu. Tätä seuraa elementti `&lt;html&gt;`, joka aloittaa HTML-dokumentin. Elementti `&lt;html&gt;` sisältää yleensä kaksi elementtiä, elementit `&lt;head&gt;` ja `&lt;body&gt;`. Elementti `&lt;head&gt;` sisältää sivun otsaketiedot, eli esimerkiksi sivun käyttämän merkistön `&lt;meta charset="utf-8" /&gt;` ja otsikon `&lt;title&gt;`. Elementti `&lt;body&gt;` sisältää selaimessa näytettävän sivun rungon. Ylläolevalla sivulla on ensimmäisen tason otsake-elementti `h1` (<em>header 1</em>) ja tekstielementti `p` (<em>paragraph</em>).



  Elementit voivat sisältää <em>tekstisolmun</em>. Esimerkiksi yllä olevat elementit `title`, `h1` ja `p` kukin sisältävät tekstisolmun eli tekstiä. Tekstisolmulle ei ole erillistä elementtiä tai määrettä, vaan se näkyy käyttäjälle sivulla olevana tekstinä.



  Puhe tekstisolmuista antaa viitettä jonkinlaisesta puurakenteesta. HTML-dokumentit ovat rakenteellisia dokumentteja, joiden rakenne on usein helppo ymmärtää puumaisena kaaviona. Ylläolevan web-sivun voi esittää esimerkiksi seuraavanlaisena puuna.


<pre>
                   html

               /          \

             /              \

          head              body

        /       \         /      \

     meta       title     h1      p

                 :        :       :

              tekstiä  tekstiä tekstiä
</pre>


  Koska HTML-dokumentti on rakenteellinen dokumentti, on elementtien sulkemisjärjestyksellä väliä. Elementit tulee sulkea samassa järjestyksessä kuin ne on avattu. Esimerkiksi, järjestys `&lt;body&gt;&lt;p&gt;whoa, minttutee!&lt/body&gt;&lt;/p&gt;` on väärä, kun taas järjestys `&lt;body&gt;&lt;p&gt;whoa, minttutee!&lt;/p&gt;&lt/body&gt;` on oikea.



  Kaikki elementit eivät kuitenkaan sisällä tekstisolmua, eikä niitä suljeta erikseen. Yksi näistä poikkeuksista on <a href="http://www.w3schools.com/tags/tag_link.asp" target="_blank">link</a>-elementti.



  Kun selaimet lataavat HTML-dokumenttia ja muodostavat sen perusteella muistissa säilytettävää puuta, ne käyvät sen läpi ylhäältä alas, vasemmalta oikealle. Kun selain kohtaa elementin, se luo sille uuden solmun. Seuraavista elementeistä luodut solmut menevät aiemmin luodun solmun alle kunnes aiemmin kohdattu elementti suljetaan. Aina kun elementti suljetaan, puussa palataan ylöspäin edelliselle tasolle.



##
  Elementit, attribuutit, nimet ja luokat



  Elementit voivat sisältää attribuutteja, joilla voi olla yksi tai useampi arvo. Edellä nähdyssä HTML-dokumentissa elementille `meta` on määritelty erillinen attribuutti `charset`, joka kertoo dokumentissa käytettävän merkistön: "utf-8". Vastaavasti tiedon syöttämiseen käytettävien lomakkeiden `input` ym. kentissä käyttämämme attribuutti `name` määrittelee nimen, jota käytetään palvelimelle lähetettävän kentän sisällön tunnistamisessa.



  Muita yleisesti käytettäviä attribuuttityyppejä ovat `id`, joka määrittelee elementille uniikin tunnisteen sekä `class`, jonka avulla elementille voidaan määritellä tyyppiluokitus. Uudehkossa HTML5-määritelmässä elementit voivat sisältää myös `data`-attribuutteja, joiden toiminnallisuutta ei ole ennalta määritelty, ja joita käytetään tyypillisesti sovelluksen toiminnallisuuden takaamiseksi.



  Kun elementtejä haetaan id-attribuutin perusteella, vastaukseksi pitäisi tulla tyypillisesti vain yksi elementti, mutta class-attribuutin perusteella hakuvastauksia voi olla useampi.



<text-box variant='hint' name='Lista attribuuteista' } do %>


    W3Schools-sivusto sisältää hyvän yhteenvedon käytössä olevista attribuuteista: <a href="http://www.w3schools.com/tags/ref_attributes.asp" target="_blank">http://www.w3schools.com/tags/ref_attributes.asp</a>. Lisätietoa data-attribuuteista löytyy osoitteesta <a href="http://www.w3schools.com/tags/att_global_data.asp" target="_blank">http://www.w3schools.com/tags/att_global_data.asp</a>.


<% end %>



##
  Javascript



  Siinä missä HTML on kieli web-sivujen rakenteen ja sisällön luomiseen, JavaScript on kieli dynaamisen toiminnan lisäämiselle. JavaScript on ohjelmakoodia, jota suoritetaan komento kerrallaan -- ylhäältä alas, vasemmalta oikealle.



  JavaScript-koodi suoritetaan käyttäjän omassa selaimessa. Samalla on hyvä kuitenkin mainita, että nykyään myös palvelinohjelmistoja ohjelmoidaan Javascriptillä -- tästä esimerkkinä <a href="https://nodejs.org/en/" target="_blank" norel>NodeJs</a>.



  JavaScript-tiedoston pääte on yleensä `.js` ja siihen viitataan elementillä `script`. Elementillä `script` on attribuutti `src`, jolla kerrotaan lähdekooditiedoston sijainti. Kun lisäämme Javascript-koodia web-projektiimme, lisätään se tyypillisesti kansion `src/main/resources/public/javascript/` alle. Kansiossa `public` olevat tiedostot siirtyvät suoraan näkyville web-maailmaan, joten niitä ei tarvitse käsitellä erikseen esimerkiksi Thymeleaf-moottorin toimesta.



  Jos lähdekoodi on kansiossa `javascript` olevassa tiedostossa `code.js`, käytetään `script`-elementtiä seuraavasti: `&lt;script th:src="@{/javascript/code.js}"&gt;&lt;/script&gt;`.



  Yleinen käytänne JavaScript-lähdekoodien sivulle lisäämiseen on lisätä ne sivun loppuun juuri ennen `body`-elementin sulkemista. Tämä johtuu mm. siitä, että selain lähtee hakemaan JavaScript-tiedostoa kun se kohtaa sen määrittelyn HTML-dokumentissa, jolloin kaikki muut toiminnot odottavat latausta. Jos lähdekooditiedosto ladataan vasta sivun lopussa, käyttäjälle <em>näytetään</em> sivun sisältöä jo ennen Javascript-lähdekoodin latautumista, sillä selaimet usein näyttävät sivua käyttäjälle sitä mukaa kun se latautuu. Tällä luodaan tunne nopeammin reagoivista ja latautuvista sivuista.


<text-box variant='hint' name='Määre defer siirtää lataamisen sivun loppuun' } do %>


    Nykyään `script`-elementille voi lisätä määreen `defer`, jonka olemassaolo kertoo että elementin `src`-attribuutin määrittelemä tiedosto tulee suorittaa vasta kun html-sivu on käsitelty.


  ```xml
...
&lt;script th:src="@{/javascript/code.js}" defer&gt;&lt;/script&gt;
...
  ```


    Defer-määre on kuitenkin uudehko lisä, eikä se toimi kaikissa selaimissa. <a href="http://www.w3schools.com/tags/att_script_defer.asp" target="_blank">Lisätietoa täältä...</a>


<% end %>



  Luodaan kansioon `javascript` lähdekooditiedosto `code.js`. Tiedostossa `code.js` on funktio `sayHello`. Funktio luo ponnahdusikkunan, missä on teksti "hello there".



```java
function sayHello() {
    alert("hello there");
}
```


  HTML-dokumentti, jossa lähdekooditiedosto ladataan, näyttää seuraavalta. Attribuutille `onclick` määritellään elementin klikkauksen yhteydessä suoritettava koodi.


```xml
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8" &gt;
        &lt;title&gt;Sivun otsikko (näkyy selaimen palkissa)&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;header&gt;
            &lt;h1&gt;Sivulla näkyvä otsikko&lt;/h1&gt;
        &lt;/header&gt;

        &lt;article&gt;
            &lt;p&gt;Sivuilla näytettävä normaali teksti on p-elementin sisällä. Alla on nappi,
            jota painamalla kutsutaan funktiota "sayHello".&lt;/p&gt;
            &lt;input type="button" value="Tervehdi" onclick="sayHello();" /&gt;
        &lt;/article&gt;

        &lt;!-- ladataan JavaScript-koodit tiedoston lopussa! --&gt;
        &lt;script th:src="@{javascript/code.js}"&gt;&lt;/script&gt;

    &lt;/body&gt;
&lt;/html&gt;
```


  Alla sama JSFiddlessä -- siellä kuitenkin `code.js` samassa kansiossa HTML-tiedoston kanssa:


<iframe width="100%" height="200" src="//jsfiddle.net/7ntuqtmL/5/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


<text-box variant='hint' name='Javascript-oppaita' } do %>


    Jos Javascript ei ole ennalta tuttu kieli, kannattaa tutustua W3Schools-sivuston tarjoamaan <a href="http://www.w3schools.com/js/" target="_blank">Javascript-oppaaseen</a> sekä kurssin <a href="https://web-selainohjelmointi.github.io/" target="_blank">Web-selainohjelmointi</a> (jo hieman hapantuneeseen) materiaaliin.


<% end %>


##
  Sivujen rakenteen muokkaaminen Javascriptin avulla



  JavaScriptiä käytetään ennenkaikkea dynaamisen toiminnallisuuden lisäämiseksi web-sivuille. Esimerkiksi web-sivuilla oleviin elementteihin tulee pystyä asettamaan arvoja, ja niitä tulee myös pystyä hakemaan. JavaScriptissä pääsee käsiksi dokumentissa oleviin elementteihin komennolla `document.getElementById("tunnus")`, joka palauttaa elementin, jonka `id`-attribuutti on "tunnus". Muita attribuutti- ja elementtityyppejä pääsee käsittelemään esimerkiksi <a href="http://www.w3schools.com/jsref/met_document_queryselector.asp" target="_blank">querySelector</a>-metodin avulla.



  Alla on tekstikenttä, jonka HTML-koodi on `&lt;input type="text" id="tekstikentta"/&gt;`. Kentän tunnus on siis `tekstikentta`. Jos haluamme päästä käsiksi elementtiin, jonka tunnus on "tekstikentta", käytämme komentoa `document.getElementById("tekstikentta")`. Tekstikenttäelementillä on attribuutti `value`, joka voidaan tulostaa.


<iframe width="100%" height="200" src="//jsfiddle.net/zL0beedq/10/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


  Tekstikentälle voidaan asettaa arvo kuten muillekin muuttujille. Alla olevassa esimerkissä haetaan edellisen esimerkin tekstikenttä, ja asetetaan sille arvo `5`.


<iframe width="100%" height="200" src="//jsfiddle.net/zL0beedq/11/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


  Tehdään vielä ohjelma, joka kysyy käyttäjältä syötettä, ja asettaa sen yllä olevan tekstikentän arvoksi.


<iframe width="100%" height="200" src="//jsfiddle.net/zL0beedq/12/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



###
  Arvon asettaminen osaksi tekstiä



  Yllä tekstikentälle asetettiin arvo sen `value`-attribuuttiin. Kaikilla elementeillä ei ole `value`-attribuuttia, vaan joillain näytetään niiden elementin <em>sisällä</em> oleva arvo. Elementin sisälle asetetaan arvo muuttujaan liittyvällä attribuutilla `innerHTML`.



  Alla olevassa esimerkissä sivulla on tekstielementti, jossa ei ole lainkaan sisältöä. Jos tekstielementtiin lisätään sisältöä, tulee se näkyville.


<iframe width="100%" height="200" src="//jsfiddle.net/zL0beedq/16/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


  Vastaavasti tekstin keskelle -- sisäelementtiin -- voi asettaa arvoja. Elementti `span` sopii tähän hyvin.


<iframe width="100%" height="200" src="//jsfiddle.net/zL0beedq/17/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



###
  Case: Laskin



  Luodaan laskin. Laskimella on kaksi toiminnallisuutta: pluslasku ja kertolasku. Luodaan ensin laskimelle javascriptkoodi, joka on tiedostossa `laskin.js`. Javascript-koodissa oletetaan, että on olemassa `input`-tyyppiset elementit tunnuksilla "eka" ja "toka" sekä `span`-tyyppinen elementti tunnuksella "tulos". Funktiossa `plus` haetaan elementtien "eka" ja "toka" arvot, ja asetetaan pluslaskun summa elementin "tulos" arvoksi. Kertolaskussa tehdään lähes sama, mutta tulokseen asetetaan kertolaskun tulos. Koodissa on myös apufunktio, jota käytetään sekä arvojen hakemiseen annetuilla tunnuksilla merkityistä kentistä että näiden haettujen arvojen muuttamiseen numeroiksi.


```java
function haeNumero(tunnus) {
    return parseInt(document.getElementById(tunnus).value);
}

function asetaTulos(tulos) {
    document.getElementById("tulos").innerHTML = tulos;
}

function plus() {
    asetaTulos(haeNumero("eka") + haeNumero("toka"));
}

function kerto() {
    asetaTulos(haeNumero("eka") * haeNumero("toka"));
}
```


  Laskimen käyttämä HTML-dokumentti näyttää seuraavalta:


```xml
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8" &gt;
        &lt;title&gt;Laskin&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;header&gt;
            &lt;h1&gt;Plus- ja Kertolaskin&lt;/h1&gt;
        &lt;/header&gt;

        &lt;section&gt;
            &lt;p&gt;
                &lt;input type="text" id="eka" value="0" /&gt;
                &lt;input type="text" id="toka" value="0" /&gt;
            &lt;/p&gt;

            &lt;p&gt;
                &lt;input type="button" value="+" onclick="plus();" /&gt;
                &lt;input type="button" value="*" onclick="kerto();" /&gt;
            &lt;/p&gt;


            &lt;p&gt;Laskimen antama vastaus: &lt;span id="tulos"&gt;&lt/span&gt;&lt;/p&gt;
        &lt;/section&gt;

        &lt;script src="javascript/laskin.js"&gt;&lt;/script&gt;
    &lt;/body&gt;
&lt;/html&gt;
```


  Kokonaisuudessaan laskin näyttää seuraavalta:


<iframe width="100%" height="300" src="//jsfiddle.net/o8u0fk36/2/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

&nbsp;


<programming-exercise name='Calculator' } do %>


    Toteuta edellisen esimerkin perusteella laskin, jossa on plus-, miinus-, kerto- ja jakolaskutoiminnallisuus. Keskity vain selainpuolen toiminnallisuuteen: älä muokkaa palvelinpuolen toiminnallisuutta. Varmista myös, että sivu on käytettävä ilman erillistä ohjetekstiä, eli että käyttämäsi napit ja tekstit kertovat käyttäjälle kaiken oleellisen.



    Tehtävään ei ole TMC:ssä testejä -- kun sovellus toimii oikein, lähetä se palvelimelle.


<% end %>


###
  Elementtien valinta



  Käytimme `getElementById`-kutsua tietyn elementin hakemiseen. Kaikki sivun elementit voi taas hakea esimerkiksi `getElementsByTagName("*")`-kutsulla. Molemmat ovat kuitenkin hieman kömpelöjä jos tiedämme mitä haluamme hakea.



  W3C DOM-määrittely sisältää myös paremman ohjelmointirajapinnan elementtien läpikäyntiin. <a href="http://www.w3.org/TR/selectors-api/" target="_blank">Selectors API</a> sisältää mm. `querySelector`-kutsun, jolla saadaan CSS-valitsinten kaltainen kyselytoiminnallisuus.



  Selector APIn tarjoamien `querySelector` (yksittäisen osuman haku) ja `querySelectorAll` (kaikkien osumien haku) -komentojen avulla kyselyn rajoittaminen vain `header`-elementissä oleviin `a`-elementteihin on helppoa.


```java
var linkit = document.querySelectorAll("nav a");
// linkit-muuttuja sisältää nyt kaikki a-elementit, jotka ovat nav-elementin sisällä
```


  Vastaavasti `header`-elementin sisällä olevat linkit voi hakea seuraavanlaisella kyselyllä.


```java
var linkit = document.querySelectorAll("header a");
// linkit-muuttuja sisältää nyt kaikki a-elementit, jotka ovat header-elementin sisällä
```

###
  Elementtien lisääminen



  HTML-dokumenttiin lisätään uusia elementtejä `document`-olion `createElement`-metodilla. Esimerkiksi alla luodaan `p`-elementti (tekstisolmu; `createTextNode`), joka asetetaan muuttujaan `tekstiElementti`. Tämän jälkeen luodaan tekstisolmu, joka sisältää tekstin "o-hai". Lopulta tekstisolmun lisätään tekstielementtiin.


```java
var tekstiElementti = document.createElement("p");
var tekstiSolmu = document.createTextNode("o-hai");

tekstiElementti.appendChild(tekstiSolmu);
```


  Ylläoleva esimerkki ei luonnollisesti muuta HTML-dokumentin rakennetta sillä uutta elementtiä ei lisätä osaksi HTML-dokumenttia. Olemassaoleviin elementteihin voidaan lisätä sisältöä elementin `appendChild`-metodilla. Alla olevan tekstialue sisältää `article`-elementin, jonka tunnus on `dom-esim-3`. Voimme lisätä siihen elementtejä elementin `appendChild`-metodilla.


```java
var tekstiElementti = document.createElement("p");
var tekstiSolmu = document.createTextNode("o-noes!");

tekstiElementti.appendChild(tekstiSolmu);

var alue = document.getElementById("dom-esim-3");
alue.appendChild(tekstiElementti);
```


  Artikkelielementin sekä sen sisältämien tekstielementtien lisääminen onnistuu vastaavasti. Alla olevassa esimerkissä käytössämme on seuraavanlainen `section`-elementti.


```xml
&lt;!-- .. dokumentin alkuosa .. --&gt;
    &lt;section id="osio"&gt;&lt;/section&gt;
&lt;!-- .. dokumentin loppuosa .. --&gt;
```


  Uusien artikkelien lisääminen onnistuu helposti aiemmin näkemällämme `createElement`-metodilla.


```java
var artikkeli = document.createElement("article");

var teksti1 = document.createElement("p");
teksti1.appendChild(document.createTextNode("Lorem ipsum... 1"));
artikkeli.appendChild(teksti1);

var teksti2 = document.createElement("p");
teksti2.appendChild(document.createTextNode("Lorem ipsum... 2"));
artikkeli.appendChild(teksti2);

document.getElementById("osio").appendChild(artikkeli);
```


  Alla olevassa esimerkissä elementtejä lisätään yksitellen. Mukana on myös laskuri, joka pitää kirjaa elementtien lukumäärästä.


<iframe width="100%" height="300" src="//jsfiddle.net/tus22m5y/1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


##
  jQuery



  <a href="http://jquery.com/" target="_blank">jQuery</a> on JavaScript-kirjasto, jonka tavoitteena on helpottaa selainohjelmistojen toteutusta. Se tarjoaa apuvälineitä mm. DOM-puun muokkaamiseen, tapahtumien käsittelyyn sekä palvelimelle tehtävien kyselyiden toteuttamiseen, ja sen avulla toteutettu toiminnallisuus toimii myös useimmissa selaimissa.



  Uusimman jQuery-version saa ladattua <a href="http://jquery.com/download/" target="_blank">täältä</a>. Käytännössä jQuery on JavaScript-tiedosto, joka ladataan sivun latautuessa. Tiedoston voi asettaa esimerkiksi `head`-elementin sisään, tai ennen omia lähdekooditiedostoja.


```xml
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8" /&gt;
        &lt;title&gt;Selaimen palkissa ja suosikeissa näkyvä otsikko&lt;/title&gt;
     &lt;/head&gt;
    &lt;body&gt;

        &lt;!-- sivun sisältö --&gt;

        &lt;script src="https://code.jquery.com/jquery-3.1.0.min.js"&gt;&lt;/script&gt;
        &lt;script src="javascript/koodi.js"&gt;&lt;/script&gt;
    &lt;/body&gt;
&lt;/html&gt;
```


###
  Valitsimet



  Käytimme edellisissä osioissa valmiita JavaScriptin DOM-toiminnallisuuksia. Elementtien etsimiseen on käytetty mm. `getElementById`-kutsua. JQuery käyttää <a href="http://sizzlejs.com/" target="_blank">Sizzle</a>-kirjastoa elementtien valinnan helpottamiseen. Esimerkiksi elementti, jonka attribuutin "id" arvo on "nimi", löytyy seuraavalla komennolla.


```java
var elementti = $("#nimi");
```


  Kyselyt ovat muotoa`$("<em>kysely</em>")`. Jos elementtia haetaan `id`-attribuutin perusteella, lisätään kyselyn alkuun risuaita. Jos elementtiä haetaan luokan (`class`) perusteella, lisätään kyselyn alkuun piste. Jos taas elementtiä halutaan hakea esimerkiksi nimen perusteella, muodostetaan kysely sekä elementin että attribuutin kautta, esim. `$("input[name=nimi]")` palauttaa kaikki input-tyyppiset elementit, joissa `name`-attribuutin arvo on `nimi`.



<text-box variant='hint' name='jQueryn valitsimet' } do %>


    Tarkempi kuvaus jQueryn valitsimista löytyy osoitteesta <a href="http://api.jquery.com/category/selectors/" target="_blank">http://api.jquery.com/category/selectors/</a>.


<% end %>


###
  Elementtien lisääminen



  JQuery tekee elementtien lisäämisestä hieman suoraviivaisempaa. Voimme kutsun `document.createElement` sijaan määritellä elementin tyypin sanomalla `$("&lt;article /&gt;");`. Myös tekstielementin luominen on hieman helpompaa: `$("&lt;p/&gt;").text("test");`. Aiempi koodimme:


```java
var artikkeli = document.createElement("article");

var teksti1 = document.createElement("p");
teksti1.appendChild(document.createTextNode("Lorem ipsum... 1"));
artikkeli.appendChild(teksti1);

var teksti2 = document.createElement("p");
teksti2.appendChild(document.createTextNode("Lorem ipsum... 2"));
artikkeli.appendChild(teksti2);

document.getElementById("osio").appendChild(artikkeli);
```


  Voidaan kirjoittaa myös hieman suoraviivaisemmin:


```java
var artikkeli = $("&lt;article/&gt;");

var teksti1 = $("&lt;p/&gt;");
teksti1.text("Lorem ipsum... 1");
artikkeli.append(teksti1);

var teksti2 = $("&lt;p/&gt;");
teksti2.text("Lorem ipsum... 2");
artikkeli.append(teksti2);

$("#osio").append(artikkeli);
```



<text-box variant='hint' name='DOM-puun muokkaus' } do %>


    Tarkempi kuvaus operaatioista DOM-puun muokkaamiseen löytyy osoitteesta <a href="http://api.jquery.com/category/Manipulation/" target="_blank">http://api.jquery.com/category/Manipulation/</a>.


<% end %>


###
  Tapahtumien käsittely



  JQuery rakentaa JavaScriptin valmiiden komponenttien päälle, joten sillä on toiminnallisuus myös tapahtumankäsittelijöiden rekisteröimiseen sivun komponenteille. Eräs hyvin hyödyllinen tapahtumankäsittelijä liittyy sivun latautumiseen: komennolla `$(document).ready(function() {});` voidaan määritellä funktion runko, joka suoritetaan kun sivun latautuminen on valmis.



  Kun sivun latautuminen on valmis, voimme olla varmoja siitä, että sivulla on kaikki siihen kuuluvat elementit. Tällöin on näppärää tehdä myös kyselyjä palvelimelle. Jos haluaisimme että id-attribuutin arvolla "osio" määriteltyyn elementtiin lisättäisiin kaksi tekstielementtiä sisältävä artikkelielementti kun sivu on latautunut, olisi tarvittava Javascript-koodi seuraavanlainen:


```java
$(document).ready(function() {
  var artikkeli = $("&lt;article/&gt;");

  var teksti1 = $("&lt;p/&gt;");
  teksti1.text("Lorem ipsum... 1");
  artikkeli.append(teksti1);

  var teksti2 = $("&lt;p/&gt;");
  teksti2.text("Lorem ipsum... 2");
  artikkeli.append(teksti2);

  $("#osio").append(artikkeli);
});
```


<iframe width="100%" height="300" src="//jsfiddle.net/1epmnrd2/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



<text-box variant='hint' name='JSON' } do %>


    JSON, eli `JavaScript Object Notation`, on tiedon esitysmuoto. Olion määrittely alkaa aaltosululla `{`, jota seuraa muuttujan nimi ja sille annettava arvo. Arvon asetus oliomuuttujalle tapahtuu kaksoispisteellä, esimerkiksi `nimi: "Arvo"`. Useampia muuttujia voi määritellä pilkulla eroteltuna. Olion määrittely lopetetaan sulkevaan aaltosulkuun `}`.


  ```java
var olio = {nimi: "Arvo", tieto: 2000};
  ```


    Olion muuttujiin pääsee käsiksi piste-notaatiolla. Esimerkiksi `olio`-olion muuttuja `nimi` löytyy komennolla `olio.nimi`.


  ```java
var olio = {nimi: "Arvo", tieto: 2000};
alert(olio.nimi);
  ```


    Myös uusien oliomuuttujien lisääminen on suoraviivaista. Uuden muuttujan lisääminen tapahtuu myös pistenotaatiolla -- harrastuksen lisääminen tapahtuu `olio`-oliolle sanomalla `olio.harrastus = "koodaus";`.


  ```java
var olio = {nimi: "Arvo", tieto: 2000};
alert(olio.nimi);
olio.harrastus = "koodaus";
alert(olio.harrastus);
  ```


    Olioiden rakennetta ei siis ole lyöty ennalta lukkoon.


<% end %>


##
  Kyselyt palvelimelle



  JQuery tarjoaa myös tuen kyselyjen tekemiseen erilliselle palvelinkomponentille.



  Kyselyt hoituvat kätevästi JQueryn `<a href="http://api.jquery.com/jQuery.getJSON/" target="_blank">$.getJSON</a>`-funktiolla. Alla olevassa esimerkissä haemme <a href="http://www.icndb.com/" target="_blank">ICNDb.com</a>ista oleellista dataa.



  Kyselyn palauttama data ohjataan `$.getJSON`-funktion toisena parametrina määriteltävään funktioon. Alla olevassa esimerkissä kutsumme vain `alert`-komentoa kaikelle palautettavalle datalle.


```java
$.getJSON("http://api.icndb.com/jokes/random/5",
    function(data) {
        alert(data);
    }
);
```


  Ylläoleva esimerkki tulostaa vastaukset konsoliin -- huomaa, että jQuery muuntaa merkkijonomuotoiset vastaukset automaattisesti JSON-olioksi. Käytetään JQueryn `each`-komentoa listassa olevien elementtien iterointiin. Komennolle `each` voi antaa parametrina iteroitavan listan, sekä funktion, jota kutsutaan jokaisella listassa olevalla oliolla.


```java
$.getJSON("http://api.icndb.com/jokes/random/5",
    function(data) {
        $.each(data.value, function(i, item) {
            alert(i);
            alert(item);
            alert("-----");
        });
    }
);
```


  Nyt ylläoleva komento tulostaa vastauksen value-kentässä olevat oliot yksitellen. Oletetaan, että käytössämme on elementti, jonka tunnus on "vitsit". JQuery tarjoaa myös mahdollisuuden nopeaan tekstielementtien luontiin komennolla `$("&lt;p/&gt")`. Elementteihin voi asettaa tekstin `text`-komennolla, ja elementin voi lisätä tietyllä tunnuksella määriteltyyn elementtiin komennolla `appendTo("#<em>tunnus</em>")`.


```java
$.getJSON("http://api.icndb.com/jokes/random/5",
    function(data) {
        $.each(data.value, function(i, item) {
            $("&lt;p/&gt;").text(item.joke).appendTo("#vitsit");
        });
    }
);
```


##
  Tiedon lähettäminen palvelimelle



  Jos tiedämme, että palvelu palauttaa JSON-dataa, voimme käyttää yllä käsiteltyä lähestymistapaa. Esimerkiksi viestien noutaminen Chat-chat -tehtävän viestipalvelimelta onnistuu seuraavalla komennolla. Tässä tapauksessa lisäämme jokaiseen viestiin liittyvän `message`-attribuutin "vitsit"-tunnuksella määriteltyyn elementtiin. Osoitteessa <a href="http://bad.herokuapp.com/app/messages" target="_blank">http://bad.herokuapp.com/app/messages</a> on valmiina viestejä tarjoava sovellus.


```java
$.getJSON("http://bad.herokuapp.com/app/messages", function(data) {
    $.each(data, function(i, item) {
        $("&lt;p/&gt;").text(item.message).appendTo("#vitsit");
    });
});
```


  Yllä oleva komento on lyhenne alla määritellystä komennosta.


```java
$.ajax({
    url: "http://bad.herokuapp.com/app/messages",
    dataType: 'json',
    success: parseMessages
});

function parseMessages(messages) {
    $.each(messages, function(i, item) {
        $("&lt;p/&gt;").text(item.message).appendTo("#vitsit");
    });
}
```


  Komennolle `<a href="http://api.jquery.com/jQuery.ajax/" target="_blank">$.ajax</a>` voi lisätä myös dataa, mitä lähetetään palvelimelle. Esimerkiksi seuraavalla komennolla lähetetään osoitteeseen `http://bad.herokuapp.com/app/in` olio, jonka sisällä on attribuutit `name` ja `details`. Lähetettävän datan tyyppi asetetaan attribuutilla `contentType`, alla ilmoitamme että data on json-muotoista, ja että se käyttää utf-8 -merkistöä.


```java
var dataToSend = JSON.stringify({
        name: "bob",
        details: "i'm ted"
    });

$.ajax({
    url: "http://bad.herokuapp.com/app/in",
    dataType: 'json',
    contentType:'application/json; charset=utf-8',
    type: 'post',
    data: dataToSend
});
```


  Pyynnössä voi sekä lähettää että vastaanottaa dataa. Attribuutin `success` asettaminen ylläolevaan pyyntöön aiheuttaa success-attribuutin arvona olevan funktion kutsun kun pyyntö on onnistunut.



<programming-exercise name='Tasks' } do %>


    Tehtävään on hahmoteltu tehtävien hallintaan tarkoitetun sovelluksen palvelinpuolen toiminnallisuutta. Lisää sovellukseen selainpuolen toiminnallisuus, joka mahdollistaa tehtävien lisäämisen sivulle Javascriptin avulla. Uusien tehtävien lisäämisen ei siis pidä aiheuttaa sivun uudelleenlatausta, vaan uusi tehtävä tulee lähettää palvelimelle Javascript-pyyntönä.



    Kun saat sovelluksen toimimaan, mieti myös sen käytettävyyttä. Sovellukselle ei ole automaattisia testejä.


<% end %>





##
  Tyylitiedostot



  Olet ehkäpä huomannut, että tähän mennessä tekemämme web-sovellukset eivät ole kovin kaunista katsottavaa. Kurssilla pääpaino on palvelinpään toiminnallisuuden toteuttamisessa, joten emme jatkossakaan keskity sivustojen ulkoasuun. Sivujen ulkoasun muokkaaminen on kuitenkin melko suoraviivaista. Verkosta löytyy iso kasa oppaita sivun ulkoasun määrittelyyn -- <a href="http://www.w3schools.com/css/" target="_blank">tässä yksi</a>.



  Ulkoasun määrittelyssä käytetään usein apuna valmista <a href="http://getbootstrap.com/" target="_blank">Twitter Bootstrap</a> -kirjastoa. Ulkoasun määrittely tapahtuu lisäämällä sivun `head`-osioon oleelliset kirjastot -- tässä kirjastot haetaan <a href="https://www.bootstrapcdn.com/" target="_blank">https://www.bootstrapcdn.com/</a>-palvelusta, joka tarjoaa kirjastojen ylläpito- ja latauspalvelun, jonka lisäksi elementteihin voi lisätä luokkamäärittelyjä, jotka kertovat niiden tyyleistä.



  Alla on esimerkki HTML-sivusta, jossa Twitter Bootstrap on otettu käyttöön. Sivulla on lisäksi määritelty `body`-elementin luokaksi (class) "container", mikä tekee sivusta päätelaitteen leveyteen reagoivan. Elementillä `table` oleva luokka "table" lisää elementtiin tyylittelyn. Erilaisiin Twitter Bootstrapin tyyleihin voi tutustua tarkemmin <a href="http://getbootstrap.com/css/" target="_blank">täällä</a>.


```xml
&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"&gt;
    &lt;head&gt;
        &lt;title&gt;Blank&lt;/title&gt;
        &lt;link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"/&gt;
        &lt;link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css"/&gt;
        &lt;script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"&gt;&lt;/script&gt;
    &lt;/head&gt;

    &lt;body class="container"&gt;

        &lt;table class="table"&gt;
            &lt;tr&gt;
                &lt;th&gt;An&lt;/th&gt;
                &lt;th&gt;important&lt;/th&gt;
                &lt;th&gt;header&lt;/th&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;More&lt;/td&gt;
                &lt;td&gt;important&lt;/td&gt;
                &lt;td&gt;text&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;More&lt;/td&gt;
                &lt;td&gt;important&lt;/td&gt;
                &lt;td&gt;text&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;More&lt;/td&gt;
                &lt;td&gt;important&lt;/td&gt;
                &lt;td&gt;text&lt;/td&gt;
            &lt;/tr&gt;
            &lt;tr&gt;
                &lt;td&gt;More&lt;/td&gt;
                &lt;td&gt;important&lt;/td&gt;
                &lt;td&gt;text&lt;/td&gt;
            &lt;/tr&gt;
        &lt;/table&gt;

    &lt;/body&gt;
&lt;/html&gt;
```

<programming-exercise name='Hello CSS' } do %>


    Tässä tehtävässä tavoitteena on lähinnä kokeilla sovelluksessa olevaa sivua ilman tyylitiedostoja sekä tyylitiedostojen kanssa. Käynnistä palvelin ja katso miltä juuripolussa toimiva sovellus näyttää.



    Sammuta tämän jälkeen palvelin ja muokkaa sovellukseen liittyvää `index.html`-tiedostoa siten, että poistat kommenttimerkit `head`-elementissä olevien Twitter Bootstrap -kirjaston linkkien ympäriltä. Käynnistä tämän jälkeen palvelin uudestaan ja katso miltä sivu tämän jälkeen näyttää. Oleellista tässä on se, että sivun ulkoasun muuttamiseen tarvittiin käytännössä vain tyylitiedostojen lisääminen.



    Tehtävässä ei ole testejä -- voit palauttaa sen kun olet kokeillut ylläolevaa muutosta.


<% end %>


# part 6


<text-box variant='hint' name='Kuudennen osan tavoitteet' } do %>


    Osaa selittää autentikaation ja autorisaation erot. Osaa luoda sovelluksen, joka pyytää käyttäjää kirjautumaan. Osaa määritellä kirjautumista vaativia polkuja ja metodeja, sekä piilottaa näkymän osia erilaisilta käyttäjäryhmiltä. Tuntee tapoja tiedon validointiin ja osaa validoida lomakedataa. Tietää web-sovellusten tyypillisimmät haavoittuvuudet sekä niihin vaikuttavat tekijät (OWASP). Välttää tyypillisimmät haavoittuvuudet omassa ohjelmistossaan.


<% end %>



#
  Autentikaatio ja autorisaatio



  Autentikaatiolla tarkoitetaan käyttäjän tunnistamista esimerkiksi kirjautumisen yhteydessä, ja autorisaatiolla tarkoitetaan käyttäjän oikeuksien varmistamista käyttäjän haluamiin toimintoihin.



  Tunnistautumis- ja kirjautumistoiminnallisuus rakennetaan evästeiden avulla. Jos käyttäjällä ei ole evästettä, mikä liittyy kirjautuneen käyttäjän sessioon, hänet ohjataan kirjautumissivulle. Kirjautumisen yhteydessä käyttäjään liittyvään evästeeseen lisätään tieto siitä, että käyttäjä on kirjautunut -- tämän jälkeen sovellus tietää, että käyttäjä on kirjautunut.



  Kirjautumissivuja ja -palveluita on kirjoitettu useita, ja sellainen löytyy lähes jokaisesta web-sovelluskehyksestä. Myös Spring-sovelluskehyksessä löytyy oma projekti kirjautumistoiminnallisuuden toteuttamiseen. Käytämme seuraavaksi <a href="http://projects.spring.io/spring-security/" target="_blank">Spring Security</a> -projektia. Sen saa käyttöön lisäämällä Spring Boot -projektin `pom.xml`-tiedostoon seuraavan riippuvuuden.


```xml
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-security&lt;/artifactId&gt;
&lt;/dependency&gt;
```


  Komponentti tuo käyttöömme komponentin, joka tarkastelee pyyntöjä ennen kuin pyynnöt ohjataan kontrollerien metodeille. Jos käyttäjän tulee olla kirjautunut päästäkseen haluamaansa osoitteeseen, komponentti ohjaa pyynnön tarvittaessa erilliselle kirjautumisivulle.



<text-box variant='hint' name='Mistä käyttäjätunnus ja salasana?' } do %>


    Jos Spring Security -komponentin ottaa käyttöön, mutta ei luo siihen liittyvää konfiguraatiota, ovat oletuksena kaikki polut salattu. Käyttäjätunnus on oletuksena `user`, salasana löytyy sovelluksen käynnistyksen yhteydessä tulostuvista viesteistä.



    Oletussalasanan voi asettaa konfiguraatiotiedostossa. Alla olevalla esimerkillä käyttäjätunnukseksi tulisi `user` ja salasanaksi `saippuakauppias`.


  <pre>
security.user.password=saippuakauppias
  </pre>


    Salasanan lisääminen julkiseen versionhallintaan ei ole kuitenkaan hyvä idea. Salasanan voi asettaa myös tuotantoympäristön ympäristömuuttujien avulla. Esimerkiksi Herokun ympäristömuuttujien asettamiseen löytyy opas osoitteesta <a href="https://devcenter.heroku.com/articles/config-vars" target="_blank" norel>https://devcenter.heroku.com/articles/config-vars</a>. Esimerkiksi ympäristömuuttujan `MYPASSWORD` saa käyttöön seuraavalla tavalla.


  <pre>
security.user.password=${MYPASSWORD}
  </pre>

<% end %>


##
  Tunnusten ja salattavien sivujen määrittely



  Kirjautumista varten luodaan erillinen konfiguraatiotiedosto, jossa määritellään sovellukseen liittyvät salattavat sivut. Oletuskonfiguraatiolla pääsy estetään käytännössä kaikkiin sovelluksen resursseihin, ja ohjelmoijan tulee kertoa ne resurssit, joihin käyttäjillä on pääsy.



  Luodaan oma konfiguraatiotiedosto `SecurityConfiguration`, joka sisältää sovelluksemme tietoturvakonfiguraation. Huom! Konfiguraatiotiedostoja kannattaa luoda useampia -- ainakin yksi tuotantokäyttöön ja yksi sovelluksen kehittämiseen tarkoitetulle hiekkalaatikolle. Kun konfiguraatiotiedostoja alkaa olla useampia, kannattaa ne lisätä erilliseen pakkaukseen.


```java
// pakkaus

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Ei päästetä käyttäjää mihinkään sovelluksen resurssiin ilman
        // kirjautumista. Tarjotaan kuitenkin lomake kirjautumiseen, mihin
        // pääsee vapaasti. Tämän lisäksi uloskirjautumiseen tarjotaan
        // mahdollisuus kaikille.
        http.authorizeRequests()
                .anyRequest().authenticated().and()
                .formLogin().permitAll().and()
                .logout().permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        // käyttäjällä jack, jonka salasana on bauer, on rooli USER
        auth.inMemoryAuthentication()
                .withUser("jack").password("bauer").roles("USER");
    }
}
```


  Yllä oleva tietoturvakonfiguraatio koostuu kahdesta osasta. Ensimmäisessä osassa `configure(HttpSecurity http)` määritellään sovelluksen osoitteet, joihin on pääsy kielletty tai pääsy sallittu. Toisessa osassa `public void configureGlobal(AuthenticationManagerBuilder auth)` taas määritellään  -- tässä tapauksessa -- käytössä olevat käyttäjätunnukset ja salasanat. Käyttäjälle tulee määritellä rooli -- yllä oletuksena on `USER`.



  Kun määritellään osoitteita, joihin käyttäjä pääsee käsiksi, on hyvä varmistaa, että määrittelyssä on mukana lause `anyRequest().authenticated()` -- tämä käytännössä johtaa tilanteeseen, missä kaikki osoitteet, joita ei ole erikseen määritelty, vaatii kirjautumista. Voimme määritellä osoitteita, jotka eivät vaadi kirjautumista seuraavasti:


```java
    // ..
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/free").permitAll()
                .antMatchers("/access").permitAll()
                .antMatchers("/to/*").permitAll()
                .anyRequest().authenticated().and()
                .formLogin().permitAll().and()
                .logout().permitAll();
    }
    // ..
```


  Ylläolevassa esimerkissä osoitteisiin `/free` ja `/access` ei tarvitse kirjautumista. Tämän lisäksi kaikki osoitteet polun `/to/` alla on kaikkien käytettävissä. Loput osoitteet on kaikilta kielletty. Komento `formLogin().permitAll()` määrittelee sivun käyttöön kirjautumissivun, johon annetaan kaikille pääsy, jonka lisäksi komento `logout().permitAll()` antaa kaikille pääsyn uloskirjautumistoiminnallisuuteen.



<programming-exercise name='Hello Authentication' } do %>


    Tehtävässä on sovellus viestien näyttämiseen. Tehtävänäsi on lisätä siihen salaustoiminnallisuus -- kenenkään muun kuin käyttäjän "maxwell_smart" ei tule päästä viesteihin käsiksi. Aseta Maxwellin salasanaksi "kenkapuhelin".


<% end %>



  Käyttäjätunnukset tallennetaan tyypillisesti tietokantaan, mistä ne voi tarvittaessa hakea. Salasanoja ei tule tallentaa sellaisenaan, sillä ne <a href="http://www.forbes.com/sites/thomasbrewster/2015/10/28/000webhost-database-leak/" target="_blank">voivat</a> <a href="https://techcrunch.com/2016/06/08/twitter-hack/" target="_blank">joskus</a> <a href="http://www.theregister.co.uk/2016/06/16/verticalscope_breach/" target="_blank">päätyä</a> <a href="https://en.wikipedia.org/wiki/2012_LinkedIn_hack" target="_blank">vääriin</a> <a href="http://www.independent.co.uk/life-style/gadgets-and-tech/news/gmail-hotmail-yahoo-email-passwords-stolen-hacked-hackers-russia-a7014711.html" target="_blank">käsiin</a>. Palaamme salasanojen tallentamismuotoon myöhemmin, nyt tutustumme vain siihen liittyvään tekniikkaan.



<text-box variant='hint' name='Klassinen erhe: USER' } do %>


    SQL-kielen spesifikaatiota heikosti tunteva aloitteleva web-ohjelmoija tekee usein `USER`-nimisen entiteetin tai attribuutin. Sana <em>user</em> on kuitenkin varattu SQL-spesifikaatiossa, joten sitä ei voi käyttää..


<% end %>



  Käyttäjätunnuksen ja salasanan noutamista varten luomme käyttäjälle entiteetin sekä sopivan repository-toteutuksen. Tarvitsemme lisäksi oman <a href="https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/core/userdetails/UserDetailsService.html" target="_blank">UserDetailsService</a>-rajapinnan toteutuksen, jota käytetään käyttäjän hakemiseen tietokannasta. Allaolevassa esimerkissä rajapinta on toteutettu siten, että tietokannasta haetaan käyttäjää. Jos käyttäjä löytyy, luomme siitä <a href="https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/core/userdetails/User.html" target="_blank">User</a>-olion, jonka palvelu palauttaa.


```java
// importit

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException("No such user: " + username);
        }

        return new org.springframework.security.core.userdetails.User(
                account.getUsername(),
                account.getPassword(),
                true,
                true,
                true,
                true,
                Arrays.asList(new SimpleGrantedAuthority("USER")));
    }
}
```


  Kun oma UserDetailsService-luokka on toteutettu, voimme ottaa sen käyttöön SecurityConfiguration-luokassa.


```java
// ..

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // mahdollistetaan h2-konsolin käyttö
        http.csrf().disable();
        http.headers().frameOptions().sameOrigin();

        http.authorizeRequests()
                .antMatchers("/h2-console/*").permitAll()
                .anyRequest().authenticated();
        http.formLogin()
                .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```


  Edellisessä esimerkissä salasanojen tallentamisessa käytetään <a href="https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html" target="_blank">BCrypt</a>-algoritmia, joka rakentaa merkkijonomuotoisesta salasanasta hajautusarvon. Tällöin tietokantaan tallennettujen salasanojen vuoto ei ole täysi kriisi, vaikka ei siltikään toivottavaa.



<programming-exercise name='Hello Db Authentication' } do %>


    Tehtävän ohjelmakoodiin on toteutettu käyttäjät tunnistava sovellus, joka tallentaa käyttäjien salasanat tietokantaan. Tutustu sovelluksen ohjelmakoodiin ja lisää `DefaultController`-luokassa olevaa ohjelmakoodia mukaillen sovellukseen toinen käyttäjä, jonka salasana on myös "smart".



    Käy tämän jälkeen tarkastelemassa sovelluksen tietokantaa osoitteessa `http://localhost:8080/h2-console` (aseta JDBC URL -kentän arvoksi `jdbc:h2:mem:testdb`). Vaikka lisäämäsi käyttäjän salasana on myös "smart" pitäisi tietokannassa olevien hajautusarvojen olla erilaiset.



    Tehtävässä ei ole testejä.


<% end %>


  Kun käyttäjä on kirjautuneena, saa häneen liittyvän käyttäjätunnuksen ns. tietoturvakontekstista.


```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
```


<text-box variant='hint' name='Uloskirjautuminen' } do %>


    Pohdi: Käyttäjä voi uloskirjautua tekemällä POST-pyynnön sovelluksen osoitteeseen `/logout`. Miksi tavallinen GET-pyyntö ei riitä? Minkälaisia rajoitteita ja määreitä HTTP-protokollan GET-pyyntöihin liittyi?


<% end %>


  Autentikaation tarpeen voi määritellä myös pyyntökohtaisesti. Alla olevassa esimerkissä GET-tyyppiset pyynnöt ovat sallittuja juuriosoitteeseen, mutta POST-tyyppiset pyynnöt juuriosoitteeseen eivät ole sallittuja.



```java
  @Override
  protected void configure(HttpSecurity http) throws Exception {
      // mahdollistetaan h2-konsolin käyttö
      http.csrf().disable();
      http.headers().frameOptions().sameOrigin();

      http.authorizeRequests()
          .antMatchers("/h2-console/*").permitAll()
          .antMatchers(HttpMethod.GET, "/").permitAll()
          .antMatchers(HttpMethod.POST, "/").authenticated()
          .anyRequest().authenticated();
      http.formLogin()
          .permitAll();
  }
```


<programming-exercise name='Reservations' } do %>


    Tehtävänäsi on täydentää kesken jäänyttä varaussovellusta siten, että kaikki käyttäjät näkevät varaukset, mutta vain kirjautuneet käyttäjät pääsevät lisäämään varauksia.



    Kun käyttäjä tekee pyynnön sovelluksen juuripolkuun `/reservations`, tulee hänen nähdä varaussivu. Allaolevassa esimerkissä tietokannassa ei ole varauksia, mutta jos niitä on, tulee ne listata kohdan Current reservations alla.


  <img src="/img/2016-mooc/ex38-emptylist.png" class="browser-img"/>


    Jos kirjautumaton käyttäjä yrittää tehdä varauksen, hänet ohjataan kirjautumissivulle.


  <img src="/img/2016-mooc/ex38-login.png" class="browser-img"/>


    Kun kirjautuminen onnistuu, voi käyttäjä tehdä varauksia.


  <img src="/img/2016-mooc/ex38-reservations.png" class="browser-img"/>


    Sovelluksen tulee kirjautumis- ja varaustoiminnallisuuden lisäksi myös varmistaa, että varaukset eivät mene päällekkäin.



    Luokassa `DefaultController` luodaan muutamia testikäyttäjiä, joita voi (esimerkiksi) käyttää sovelluksen testauksessa. Tarvitset ainakin:



    - Palvelun käyttäjän tunnistautumiseen, jolla täydennät luokkaa SecurityConfiguration
    - Tavan aikaleimojen käsittelyyn (kertaa materiaalin kolmas osa)
    - Kontrollerin varausten käsittelyyn ja tekemiseen


<% end %>


##
  Käyttäjien roolit



  Käyttäjillä on usein erilaisia oikeuksia sovelluksessa. Verkkokaupassa kaikki voivat listata tuotteita sekä lisätä tuotteita ostoskoriin, mutta vain tunnistautuneet käyttäjät voivat tehdä tilauksia. Tunnistautuneista käyttäjistä vain osa, esimerkiksi kaupan työntekijät, voivat tehdä muokkauksia tuotteisiin.



  Tällaisen toiminnan toteuttamiseen käytetään oikeuksia, joiden lisääminen vaatii muutamia muokkauksia aiempaan kirjautumistoiminnallisuuteemme. Aiemmin näkemässämme luokassa `CustomUserDetailsService` noudettiin käyttäjä seuraavasti:


```java
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException("No such user: " + username);
        }

        return new org.springframework.security.core.userdetails.User(
                account.getUsername(),
                account.getPassword(),
                true,
                true,
                true,
                true,
                Arrays.asList(new SimpleGrantedAuthority("USER")));
    }
```


  Palautettavan `User`-olion luomiseen liittyy lista oikeuksia. Yllä käyttäjälle on määritelty oikeus `USER`, mutta oikeuksia voisi olla myös useampi. Seuraava esimerkki palauttaa käyttäjän "USER" ja "ADMIN" -oikeuksilla.


```java
        return new org.springframework.security.core.userdetails.User(
                account.getUsername(),
                account.getPassword(),
                true,
                true,
                true,
                true,
                Arrays.asList(new SimpleGrantedAuthority("USER"), new SimpleGrantedAuthority("ADMIN")));
```


  Oikeuksia käytetään käytettävissä olevien polkujen rajaamisessa. Voimme rajata luokassa `SecurityConfiguration` osan poluista esimerkiksi vain käyttäjille, joilla on `ADMIN`-oikeus. Alla olevassa esimerkissä kaikki käyttäjät saavat tehdä GET-pyynnön sovelluksen juuripolkuun. Vain `ADMIN`-käyttäjät pääsevät polkuun `/clients`, jonka lisäksi muille sivuille tarvitaan kirjautuminen (mikä tahansa oikeus). Kuka tahansa pääsee kirjautumislomakkeeseen käsiksi.


```java
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(HttpMethod.GET, "/").permitAll()
                .antMatchers("/clients").hasAnyAuthority("ADMIN")
                .anyRequest().authenticated();
        http.formLogin()
                .permitAll();
    }
```


  Oikeuksia varten määritellään tyypillisesti erillinen tietokantataulu, ja käyttäjällä voi olla useampia oikeuksia.




<programming-exercise name='Only for the Selected' } do %>


    Sovelluksessa on toteutettuna käyttäjienhallinta tällä hetkellä siten, että käyttäjillä ei ole erillisiä oikeuksia. Muokkaa sovellusta ja lisää sovellukseen käyttäjäkohtaiset oikeudet. Suojaa tämän jälkeen sovelluksen polut seuraavasti:



    - Kuka tahansa saa nähdä polusta `/happypath` palautetun tiedon
    - Vain USER tai ADMIN -käyttäjät saavat nähdä polusta `/secretpath` palautetun tiedon
    - Vain ADMIN-käyttäjät saavat nähdä polusta `/adminpath` palautetun tiedon


  Lisää sovellukseen myös seuraavat käyttäjät:

  <table class="table">
    <tr>
      <th>Käyttäjätunnus</th>
      <th>Salasana</th>
      <th>Oikeudet</th>
    </tr>
    <tr>
      <td>larry</td>
      <td>larry</td>
      <td>USER</td>
    </tr>
    <tr>
      <td>moe</td>
      <td>moe</td>
      <td>USER ja ADMIN</td>
    </tr>
    <tr>
      <td>curly</td>
      <td>curly</td>
      <td>ADMIN</td>
    </tr>
  </table>

<% end %>


<text-box variant='hint' name='Käyttäjän luominen' } do %>


    Käyttäjien luominen tapahtuu sovelluksissa tyypillisesti erillisen "rekisteröidy"-sivun kautta. Tämä on sivu, missä muutkin sivut, ja tallentaa tietoa tietokantaan normaalisti. Käyttäjän salasanan luomisessa tosin hyödynnetään esimerkiksi BCrypt-salausta.


<% end %>


###
  Muutama sana salasanoista



  Salasanoja ei tule tallentaa selväkielisenä tietokantaan. Salasanoja ei tule -- myöskään -- tallentaa salattuna tietokantaan ilman, että niihin on lisätty erillinen "suola", eli satunnainen merkkijono, joka tekee salasanasta hieman vaikeammin tunnistettavan.



  Vuonna 2010 tehty tutkimus vihjasi, että noin 75&#37; ihmisistä käyttää samaa salasanaa sähköpostissa ja sosiaalisen median palveluissa. Jos käyttäjän sosiaalisen median salasana vuodetaan selkokielisenä, on siis mahdollista, että samalla myös hänen salasana esimerkiksi Facebookiin tai Google Driveen on päätynyt julkiseksi tiedoksi. Jos ilman "suolausta" salattu salasana vuodetaan, voi se mahdollisesti löytyä verkossa olevista valmiista salasanalistoista, mitkä sisältävät salasana-salaus -pareja. <a href="http://wpengine.com/unmasked/" target="_blank">Jostain syystä salasanat ovat myös usein ennustettavissa.</a>



  Suolan lisääminen salasanaan ei auta tilanteissa, missä salasanat ovat ennustettavissa, koska salasanojen koneellinen läpikäynti on melko nopeaa. Salausmenetelmänä kannattaakin käyttää sekä salasanan suolausta, että algoritmia, joka on hidas laskea. Eräs tällainen on jo valmiiksi Springin kautta käyttämämme <a href="https://en.wikipedia.org/wiki/Bcrypt" target="_blank">BCrypt</a>-algoritmi.



<figure>

  <img src="http://imgs.xkcd.com/comics/password_strength.png">

  <figcaption>https://xkcd.com/936/ -- xkcd: Password strength. </figcaption>

</figure>


<text-box variant='hint' name='Käyttäjän luominen' } do %>


    Käyttäjien luominen tapahtuu sovelluksissa tyypillisesti erillisen "rekisteröidy"-sivun kautta. Tämä on sivu, missä muutkin sivut, ja tallentaa tietoa tietokantaan normaalisti. Käyttäjän salasanan luomisessa tosin hyödynnetään esimerkiksi BCrypt-algoritmia.


<% end %>


##
  Tunnusten ja salattavien sivujen määrittely




  Tutustuimme edellä käyttäjän tunnistamiseen eli autentikointiin. Autentikoinnin lisäksi sovelluksissa on tärkeää varmistaa, että käyttäjä saa tehdä asioita, joita hän yrittää tehdä: autorisointi. Jos käyttäjän tunnistaminen toimii mutta sovellus ei tarkista oikeuksia tarkemmin, on mahdollista päätyä esimerkiksi tilanteeseen, missä <a href="http://www.telegraph.co.uk/technology/facebook/10251869/Mark-Zuckerberg-Facebook-profile-page-hacked.html" target="_blank">käyttäjä pääsee tekemään epätoivottuja asioita</a>.




###
  Näkymätason autorisointi



  Määrittelimme aiemmin oikeuksia sovelluksen polkuihin liittyen. Tämä ei kuitenkaan aina riitä, vaan käyttöliitymissä halutaan usein rajoittaa toiminta esimerkiksi käyttäjäroolien perusteella. Thymeleaf-projektiin löytyy liitännäinen, jonka avulla voimme lisätä tarkistuksia HTML-sivuille. Liitännäisen saa käyttöön lisäämällä seuraavan riippuvuuden `pom.xml`-tiedostoon.



```xml
&lt;dependency&gt;
    &lt;groupId&gt;org.thymeleaf.extras&lt;/groupId&gt;
    &lt;artifactId&gt;thymeleaf-extras-springsecurity4&lt;/artifactId&gt;
&lt;/dependency&gt;
```


  Kun näkymiien `html`-elementtiin lisätään `sec:`-nimiavaruuden määrittely, voidaan sivulle määritellä elementtejä, joiden sisältö näytetään vain esimerkiksi tietyllä roolilla kirjautuneelle käyttäjälle. Seuraavassa esimerkissä teksti "salaisuus" näkyy vain käyttäjälle, jolla on rooli "ADMIN".


```xml
&lt;html xmlns="http://www.w3.org/1999/xhtml"
    xmlns:th="http://www.thymeleaf.org"
    xmlns:sec="http://www.springframework.org/security/tags"&gt;

...
&lt;div sec:authorize="hasAuthority('ADMIN')"&gt;
    &lt;p&gt;salaisuus&lt;/p&gt;
&lt;/div&gt;
...
```


  Attribuutilla `sec:authorize` määritellään säännöt, joita tarkistuksessa käytetään. Attribuutille käy mm. arvot `isAuthenticated()`, `hasAuthority('...')` ja `hasAnyAuthority('...')`. Lisää sääntöjä löytyy Spring Securityn <a href="http://docs.spring.io/spring-security/site/docs/current/reference/html/el-access.html" target="_blank">dokumentaatiosta</a>.



<text-box variant='hint' name='Näkymän muutokset liittyvät käytettävyyteen' } do %>


    Edellä lisätty toiminnallisuus liittyy sovelluksen käytettävyyteen. Vaikka linkkiä ei näytettäisi osana sivua, kuka tahansa voi muokata sivun rakennetta selaimellaan. Tällöin pyynnön voi myös tehdä osoitteeseen, jota sivulla ei aluksi näy.



    Tämä pätee oikeastaan kaikkeen selainpuolen toiminnallisuuteen. Web-sivuilla Javascriptin avulla toteutettu dynaaminen toiminnallisuus on hyödyllistä käytettävyyden kannalta, mutta se ei millään tavalla takaa, että sovellus olisi turvallinen käyttää. Tietoturva toteutetaan suurelta osin palvelinpäässä.


<% end %>


###
  Metoditason autorisointi



  Pelkän näkymätason autorisoinnin ongelmana on se, että usein toimintaa halutaan rajoittaa tarkemmin -- esimerkiksi siten, että tietyt operaatiot (esim. poisto tai lisäys) mahdollistetaan vain tietyille käyttäjille tai käyttäjien oikeuksille. Käyttöliittymän näkymää rajoittamalla ei voida rajoittaa käyttäjän tekemiä pyyntöjä, sillä pyynnöt voidaan tehdä myös "käyttöliittymän ohi" esimerkiksi Postmanin avulla.



  Saamme sovellukseemme käyttöön myös metoditason autorisoinnin. Lisäämällä tietoturvakonfiguraatiotiedostoon luokkatason annotaation `@EnableGlobalMethodSecurity(securedEnabled = true, proxyTargetClass = true)`, Spring Security etsii metodeja, joissa käytetään sopivia annotaatioita ja suojaa ne. Suojaus tapahtuu käytännössä siten, että metodeihin luodaan proxy-metodit; aina kun metodia kutsutaan, kutsutaan ensin tietoturvakomponenttia, joka tarkistaa onko käyttäjä kirjautunut.



  Kun konfiguraatiotiedostoon on lisätty annotaatio, on käytössämme muunmuassa annotaatio <a href="http://docs.spring.io/spring-security/site/docs/current/reference/html/jc.html#jc-method" target="_blank">@Secured</a>. Alla olevassa esimerkissä `post`-metodin käyttöön vaaditaan "ADMIN"-oikeudet.


```java
    @Secured("ADMIN")
    @PostMapping("/posts")
    public String post() {
        // ..
        return "redirect:/posts";
    }
```



<programming-exercise name='Hidden fields' } do %>


    Tehtävässä on hahmoteltu viestien näyttämiseen tarkoitettua sovellusta.



    Luo sovellukseen tietoturvakonfiguraatio, missä määritellään kaksi käyttäjää. Ensimmäisellä käyttäjällä "user", jonka salasana on "password" on "USER"-oikeus. Toisella käyttäjällä "postman", jonka salasana on "pat", on "POSTER"-oikeus.



    Muokkaa näkymää `messages.html` siten, että vain käyttäjät, joilla on "POSTER"-oikeus näkee lomakkeen, jolla voi lisätä uusia viestejä.



    Muokkaa lisäksi konfiguraatiota siten, että käyttäjä voi kirjautua ulos osoitteesta `/logout`. Voit käyttää seuraavaa koodia (joutunet lisäämään konfiguraatioon muutakin..).


  ```java
http.formLogin()
    .permitAll()
    .and()
    .logout()
    .logoutUrl("/logout")
    .logoutSuccessUrl("/login");
  ```


    Lisää tämän jälkeen sovellukseen metoditason suojaus millä rajoitat POST-pyyntöjen tekemisen osoitteeseen `/message` vain käyttäjille, joilla on "POSTER"-oikeus. Vaikka testit päästäisivät sinut läpi jo ennen tämän toteutusta, tee se silti.


<% end %>


  Käyttäjän identiteetin varmistaminen vaatii käyttäjälistan, joka taas yleensä ottaen tarkoittaa käyttäjän rekisteröintiä jonkinlaiseen palveluun. Käyttäjän rekisteröitymisen vaatiminen heti sovellusta käynnistettäessä voi rajoittaa käyttäjien määrää huomattavasti, joten rekisteröitymistä kannattaa pyytää vasta kun siihen on tarve.



  Erillinen rekisteröityminen ja uuden salasanan keksiminen ei ole aina tarpeen. Web-sovelluksille on käytössä useita kolmannen osapuolen tarjoamia keskitettyjä identiteetinhallintapalveluita. Esimerkiksi <a href="http://oauth.net/2/" target="_blank">OAuth2</a>:n avulla sovelluskehittäjä voi antaa käyttäjilleen mahdollisuuden käyttää jo olemassaolevia tunnuksia. Myös erilaiset sosiaalisen median palveluihin perustuvat autentikointimekanismit ovat yleistyneet viime aikoina.



  Merkittävään osaan näistä löytyy myös Spring-komponentit. Esimerkiki Facebookin käyttäminen kirjautumisessa on melko suoraviivaista -- aiheeseen löytyy opas mm. osoitteesta <a href="http://www.baeldung.com/facebook-authentication-with-spring-security-and-social" target="_blank" norel>http://www.baeldung.com/facebook-authentication-with-spring-security-and-social</a>.


##
  Profiilit ja käyttäjät



  Kuten aiemmin kurssilla opimme, osa Springin konfiguraatiosta tapahtuu ohjelmallisesti. Esimerkiksi tietoturvaan liittyvät asetukset, esimerkiksi aiemmin näkemämme `SecurityConfiguration`-luokka, määritellään usein ohjelmallisesti. Haluamme kuitenkin luoda tilanteen, missä tuotannossa on eri asetukset kuin kehityksessä.



  Tämä onnistuu `@Profile`-annotaation avulla, jonka kautta voimme asettaa tietyt luokat tai metodit käyttöön vain kun `@Profile`-annotaatiossa määritelty profiili on käytössä. Esimerkiksi aiemmin luomamme `SecurityConfiguration`-luokka voidaan määritellä tuotantokäyttöön seuraavasti:


```java
// importit

@Profile("production")
@Configuration
@EnableWebSecurity
public class ProductionSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().authenticated();
        http.formLogin()
                .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```


  Voimme luoda erillisen tietoturvaprofiilin, jota käytetään oletuksena sovelluskehityksessä. Oletusprofiili määritellään merkkijonolla `default`.


```java
// importit

@Profile("default")
@Configuration
@EnableWebSecurity
public class DefaultSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // sallitaan h2-konsolin käyttö
        http.csrf().disable();
        http.headers().frameOptions().sameOrigin();

        http.authorizeRequests()
                .antMatchers("/h2-console/*").permitAll()
                .anyRequest().authenticated();
        http.formLogin()
                .permitAll();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("jack").password("bauer").roles("USER");
    }
}
```


  Nyt tuotantoympäristössä käyttäjät noudetaan tietokannasta, mutta kehitysympäristössä on erillinen testikäyttäjä. Jos profiilia ei ole erikseen määritelty, käytetään oletusprofiilia (default).





#
  Syötteiden validointi



  Lomakkeiden ja lähetettävän datan validointi eli oikeellisuuden tarkistaminen on tärkeää. Ensimmäinen askel -- jonka olemme jo ottaneet -- on tallennettavan datan esittäminen ohjelmaan liittyvien käsitteiden kautta. Olemme käyttäneet datan tallentamisessa olioita, joihin on määritelty sopivat kenttien tyypit. Tämä helpottaa työtämme jo hieman: esimerkiksi numerokenttiin ei saa asetettua merkkijonoja. Käyttämämme Spring Bootin mukana tulee <a href="http://hibernate.org/" target="_blank">Hibernate</a>-projektin komponentti, joka tarjoaa validointitoiminnallisuuden.



  Validaatiosääntöjen määrittely tapahtuu annotaatioilla. Muokataan alla määriteltyä luokkaa `Person` siten, että henkilöllä tulee olla henkilötunnus, nimi ja sähköpostiosoite.



```java
// pakkaus, importit, annotaatiot
public class Person {

    private String socialSecurityNumber;
    private String name;
    private String email;

}
```


  Sovitaan että henkilötunnus ei saa koskaan olla tyhjä ja sen tulee olla tasan 11 merkkiä pitkä. Nimen tulee olla vähintään 5 merkkiä pitkä, ja korkeintaan 30 merkkiä pitkä, ja sähköpostiosoitteen tulee olla validi sähköpostiosoite. Annotaatio `@NotEmpty` varmistaa ettei annotoitu attribuutti ole tyhjä -- lisätään se kaikkiin kenttiin. Annotaatiolla `@Size` voidaan määritellä pituusrajoitteita muuttujalle, ja annotaatiolla `@Email` varmistetaan, että attribuutin arvo on varmasti sähköpostiosoite. Annotaatiot löytyvät pakkauksesta `javax.validation.constraints`.



```java
// pakkaus, importit, annotaatiot
public class Person {

    @NotEmpty
    @Size(min = 11, max = 11)
    private String socialSecurityNumber;

    @NotEmpty
    @Size(min = 5, max = 30)
    private String name;

    @NotEmpty
    @Email
    private String email;
}
```


##
  Olion validointi kontrollerissa



  Kontrollerimetodit validoivat olion jos kontrollerimetodissa olevalle `@ModelAttribute`-annotaatiolla merkatulle oliolle on asetettu myös annotaatio `@Valid` (`javax.validation.Valid`).


```java
    @PostMapping("/persons")
    public String create(@Valid @ModelAttribute Person person) {
        // .. esimerkiksi tallennus ja uudelleenohjaus
  }
```


  Spring validoi olion pyynnön vastaanottamisen yhteydessä, mutta validointivirheet eivät ole kovin kaunista luettavaa. Yllä olevalla kontrollerimetodilla virheellisen nimen kohdalla saamme hieman kaoottisen ilmoituksen.


<sample-output>
Whitelabel Error Page

This application has no explicit mapping for /error, so you are seeing this as a fallback.

  <em>aika</em>
There was an unexpected error (type=Bad Request, status=400).
Validation failed for object='person'. Error count: 1
<% end %>


  Virheelle täytyy selvästi tehdä jotain..




##
  Validointivirheiden käsittely




  Validointivirheet aiheuttavat poikkeuksen, joka näkyy ylläolevana virheviestinä, jos niitä ei erikseen käsitellä. Validointivirheiden käsittely tapahtuu luokan `BindingResult` avulla, joka toimii validointivirheiden tallennuspaikkana. Luokan `BindingResult` kautta voimme käsitellä virheitä. `BindingResult`-olio kuvaa aina yksittäisen olion luomisen ja validoinnin onnistumista, ja se tulee asettaa heti validoitavan olion jälkeen. Seuraavassa esimerkki kontrollerista, jossa validoinnin tulos lisätään automaattisesti `BindingResult`-olioon.


```java
    @PostMapping("/persons")
    public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            // validoinnissa virheitä: virheiden käsittely
        }

        // muu toteutus
    }
```


  Ylläolevassa esimerkissä kaikki validointivirheet tallennetaan `BindingResult`-olioon. Oliolla on metodi `hasErrors`, jonka perusteella päätämme jatketaanko pyynnön prosessointia vai ei. Yleinen muoto lomakedataa tallentaville kontrollereille on seuraavanlainen:


```java
    @PostMapping("/persons")
    public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return "lomakesivu";
        }

        // .. esimerkiksi tallennus

        return "redirect:/index";
    }
```


  Yllä oletetaan että lomake lähetettiin näkymästä <em>"lomakesivu"</em>: käytännössä validoinnin epäonnistuminen johtaa nyt siihen, että pyyntö ohjataan takaisin lomakesivulle.




##
  Thymeleaf-lomakkeet ja BindingResult



  Lomakkeiden validointivirheet saadaan käyttäjän näkyville Thymeleafin avulla. Lomakkeet määritellään kuten normaalit HTML-lomakkeet, mutta niihin lisätään muutama apuväline. Lomakkeen attribuutti `th:object` kertoo olion, johon lomakkeen kentät tulee pyrkiä liittämään (huom! tämän tulee olla määriteltynä myös lomakkeen palauttavassa kontrollerimetodissa -- palaamme tähän kohta). Sitä käytetään yhdessä kontrolleriluokan `ModelAttribute`-annotaation kanssa. Lomakkeen kentät määritellään attribuutin `th:field` avulla, jossa oleva `*{arvo}` liitetään lomakkeeseen liittyvään olioon. Oleellisin virheviestin näkymisen kannalta on kuitenkin attribuuttiyhdistelmä `th:if="${#fields.hasErrors('arvo')}" th:errors="*{arvo}"`, joka näyttää virheviestin jos sellainen on olemassa.



  Luodaan lomake aiemmin nähdyn `Person`-olion luomiseen.



```xml
&lt;form action="#" th:action="@{/persons}" th:object="${person}" method="POST"&gt;
    &lt;table&gt;
        &lt;tr&gt;
            &lt;td&gt;SSN: &lt;/td&gt;
            &lt;td&gt;&lt;input type="text" th:field="*{socialSecurityNumber}" /&gt;&lt;/td&gt;
            &lt;td th:if="${#fields.hasErrors('socialSecurityNumber')}" th:errors="*{socialSecurityNumber}"&gt;SSN Virheviesti&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;Name: &lt;/td&gt;
            &lt;td&gt;&lt;input type="text" th:field="*{name}" /&gt;&lt;/td&gt;
            &lt;td th:if="${#fields.hasErrors('name')}" th:errors="*{name}"&gt;Name Virheviesti&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;Email: &lt;/td&gt;
            &lt;td&gt;&lt;input type="text" th:field="*{email}" /&gt;&lt;/td&gt;
            &lt;td th:if="${#fields.hasErrors('email')}" th:errors="*{email}"&gt;Email Virheviesti&lt;/td&gt;
        &lt;/tr&gt;
        &lt;tr&gt;
            &lt;td&gt;&lt;button type="submit"&gt;Submit&lt;/button&gt;&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/table&gt;
&lt;/form&gt;
```


  Yllä oleva lomake lähettää lomakkeen tiedot osoitteessa `&lt;sovellus&gt;/persons` olevalle kontrollerimetodille. Lomakkeelle tullessa tarvitsemme erillisen tiedon käytössä olevasta oliosta. Alla on näytetty sekä kontrollerimetodi, joka ohjaa GET-pyynnöt lomakkeeseen, että kontrollerimetodi, joka käsittelee POST-tyyppiset pyynnöt. Huomaa erityisesti `@ModelAttribute`-annotaatio kummassakin metodissa. Metodissa `view` olion nimi on `person`, joka vastaa lomakkeessa olevaa `th:object`-attribuuttia. Tämän avulla lomake tietää, mitä oliota käsitellään -- jos nimet poikkeavat toisistaan, lomakkeen näyttäminen antaa virheen <em>Neither BindingResult nor plain target object for bean name ...</em>.


```java
    @GetMapping("/persons")
    public String view(@ModelAttribute Person person) {
        return "lomake";
    }

    @PostMapping("/persons")
    public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return "lomake";
        }

        // .. tallennus ja uudelleenohjaus
    }
```


  Jos lomakkeella lähetetyissä kentissä on virheitä, virheet tallentuvat `BindingResult`-olioon. Tarkistamme kontrollerimetodissa `create` ensin virheiden olemassaolon -- jos virheitä on, palataan takaisin lomakkeeseen. Tällöin validointivirheet tuodaan lomakkeen käyttöön `BindingResult`-oliosta, jonka lomakkeen kentät täytetään `@ModelAttribute`-annotaatiolla merkitystä oliosta. Huomaa että virheet ovat pyyntökohtaisia, ja uudelleenohjauspyyntö kadottaa virheet.



  <strong>Huom!</strong> Springin lomakkeita käytettäessä lomakesivut haluavat käyttöönsä olion, johon data kytketään jo sivua ladattaessa. Yllä lisäsimme pyyntöön `Person`-olion seuraavasti:


```java
    @GetMapping("/persons")
    public String view(@ModelAttribute Person person) {
        return "lomake";
    }
```


  Toinen vaihtoehto on luoda kontrolleriluokkaan erillinen metodi, jonka sisältämä arvo lisätään automaattisesti pyyntöön. Tällöin lomakkeen näyttävä kontrollerimetodi ei tarvitse erikseen ModelAttribute-parametria. Toteutus olisi esimerkiksi seuraavanlainen:


```java
    @ModelAttribute
    private Person getPerson() {
        return new Person();
    }

    @GetMapping("/persons")
    public String view() {
        return "lomake";
    }

    @PostMapping("/person")
    public String create(@Valid @ModelAttribute Person person, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return "lomake";
        }

        // .. tallennus ja uudelleenohjaus
    }
```

Thymeleafin avulla tehdyistä lomakkeista ja niiden yhteistyöstä Springin kanssa löytyy lisää osoitteesta <a href="http://www.thymeleaf.org/doc/tutorials/2.1/thymeleafspring.html#creating-a-form" target="_blank">http://www.thymeleaf.org/doc/tutorials/2.1/thymeleafspring.html#creating-a-form</a>.



##
  Validointi ja entiteetit



  Vaikka edellisessä esimerkissä käyttämäämme `Person`-luokkaa ei oltu merkitty `@Entity`-annotaatiolla -- eli se ei ollut tallennettavissa JPAn avulla tietokantaan -- mikään ei estä meitä lisäämästä sille `@Entity`-annotaatiota. Toisaalta, lomakkeet voivat usein sisältää tietoa, joka liittyy useaan eri talletettavaan olioon. Tällöin voi luoda erillisen lomakkeen tietoihin liittyvän <em>lomakeolio</em>, jonka pohjalta luodaan tietokantaan tallennettavat oliot kunhan validointi onnistuu. Erilliseen lomakeobjektiin voi täyttää myös kannasta haettavia listoja ym. ennalta.



  Kun validointisäännöt määritellään entiteetille, tapahtuu validointi kontrollerin lisäksi myös tietokantatallennusten yhteydessä.



<programming-exercise name='Registration' } do %>


    Tehtävän mukana tulee sovellus, jota käytetään ilmoittatumiseen. Tällä hetkellä käyttäjä voi ilmoittautua juhliin oikeastaan minkälaisilla tiedoilla tahansa. Tehtävänäsi on toteuttaa parametreille seuraavanlainen validointi:


* Nimen (`name`) tulee olla vähintään 4 merkkiä pitkä ja enintään 30 merkkiä pitkä.
* Osoitteen (`address`) tulee olla vähintään 4 merkkiä pitkä ja enintään 50 merkkiä pitkä.
* Sähköpostiosoitteen (`email`) tulee olla validi sähköpostiosoite.




    Tehtäväpohjan mukana tuleviin sivuihin on toteutettu valmiiksi lomake. Tehtävänäsi on toteuttaa validointitoiminnallisuus pakkauksessa `wad.domain` olevaan luokkaan `Registration`.



    Jos yksikin tarkastuksista epäonnistuu, tulee käyttäjälle näyttää rekisteröitymislomake uudelleen. Muista lisätä kontrolleriin validoitavalle parametrille annotaatio `@Valid`. Virheviestien ei tule näkyä vastauksessa jos lomakkeessa ei ole virhettä. Käyttöliittymä on tehtävässä valmiina.


<% end %>




#
  Muutama sana tietoturvasta



  Tutustutaan lyhyesti web-sovellusten tietoturvaan liittyviin teemoihin. Aloita katsomalla Juhani Erosen ARTTech-seminaari aiheesta <a href="https://www.youtube.com/watch?v=-51nIz8pz08" target="_blank">Your privacy is protected by .. what exactly?</a>. Aiheeseen syvennytään tarkemmin tietoturvakursseilla.



##
  Suojattu verkkoyhteys



  Kommunikointi selaimen ja palvelimen välillä halutaan salata käytännössä aina. HTTPS on käytännössä HTTP-pyyntöjen tekemistä SSL (tai TLS)-salauksella höystettynä. HTTPS mahdollistaa sekä käytetyn palvelun verifioinnin sertifikaattien avulla että lähetetyn ja vastaanotetun tiedon salauksen.



  HTTPS-pyynnöissä asiakas ja palvelin sopivat käytettävästä salausmekanismista ennen varsinaista kommunikaatiota. Käytännössä selain ottaa ensiksi yhteyden palvelimen HTTPS-pyyntöjä kuuntelevaan porttiin (yleensä 443), lähettäen palvelimelle listan selaimella käytössä olevista salausmekanismeista. Palvelin valitsee näistä parhaiten sille sopivan (käytännössä vahvimman) salausmekanismin, ja lähettää takaisin salaustunnisteen (palvelimen nimi, sertifikaatti, julkinen salausavain). Selain ottaa mahdollisesti yhteyttä sertifikaatin tarjoajaan -- joka on kolmas osapuoli -- ja tarkistaa onko sertifikaatti kunnossa.



  Selain lähettää tämän jälkeen palvelimelle salauksessa käytettävän satunnaisluvun palvelimen lähettämällä salausavaimella salattuna. Palvelin purkaa viestin ja saa haltuunsa selaimen haluaman satunnaisluvun. Viesti voidaan nyt lähettää salattuna satunnaislukua ja julkista salausavainta käyttäen.



  Käytännössä kaikki web-palvelimet tarjoavat HTTPS-toiminnallisuuden valmiina, joskin se täytyy ottaa palvelimilla käyttöön. Esimerkiksi Herokussa HTTPS on oletuksena käytössä sovelluksissa -- aiemmin mahdollisesti tekemääsi sovellukseen pääsee käsiksi siis myös osoitteen `https://sovelluksen-nimi.herokuapp.com` kautta. Tämä ei kuitenkaan estä käyttäjiä tekemästä pyyntöjä sovellukselle ilman HTTPS-yhteyttä -- jos haluat, että käyttäjien tulee tehdä kaikki pyynnöt HTTPS-yhteyden yli, lisää tuotantokonfiguraatioon seuraava rivi.


<pre>
security.require-ssl=true
</pre>



<text-box variant='hint' name='Muutama sana turvallisesta verkkoyhteydestä' } do %>


    Jos yhteys selaimen ja sovelluksen välissä on kunnossa, on tilanne melko hyvä. Tässä välissä on hyvä kuitenkin mainita myös avointen verkkoyhteyksien käytöstä.



    Jos selaimen käyttäjä käyttää sovellusta avoimen (salasanattoman) langattoman verkkoyhteyden kautta, voi lähetettyjä viestejä kuunnella (ja muokata) käytännössä kuka tahansa. Avoimissa verkoissa käyttöjärjestelmä kirjautuu siihen verkkoon, jonka signaali on vahvin. Jos ilkeämielinen henkilö rakentaa samannimisen verkon ja saa verkkoyhteyden signaalin vahvemmaksi kuin olemassaolevassa verkossa, ottaa käyttäjän käyttöjärjestelmä automaattisesti yhteyden ilkeämielisen henkilön verkkoon. Tällöin ilkeämielinen henkilö voi myös kuunnella verkkoliikennettä halutessaan.



    Tähän liittyvä hieman humoristinen esitys <a href="https://www.youtube.com/watch?v=rJ5jILY1vlw" target="_blank">DEF CON</a>-konferenssissa.


<% end %>



##
  Tyypillisimpiä tietoturvauhkia



OWASP (<em>Open Web Application Security Project</em>) on verkkosovellusten tietoturvaan keskittynyt kansainvälinen järjestö, jonka tavoitteena on tiedottaa tietoturvariskeistä ja sitä kautta edesauttaa turvallisten web-sovellusten kehitystä. OWASP-yhteisö pitää myös yllä listaa merkittävimmistä web-tietoturvariskeistä. Vuoden 2013 lista on seuraava:

TODO: päivitä

1. Injection -- sovellukseen jääneet aukot, jotka mahdollistavat esimerkiksi SQL-injektioiden tekemisen.<br/>
2. Broken Authentication and Session Management -- autentikaatio esimerkiksi siten, että evästeisiin on helppo päästä käsiksi tai siten, että tieto autentikaatiosta kulkee osoitteessa.<br/>
3. Cross-Site Scripting (XSS) -- Mahdollisuus syöttää sivulle Javascript-koodia esimerkiksi tekstikentän kautta. Tämä mahdollistaa mm. toisella koneella  olevan Javascript-koodin suorittamisen, tai lomaketietojen lähettämisen kolmannen osapuolen palveluun. <br/>
4. Insecure Direct Object References -- mahdollisuus päästä käsiksi esimerkiksi palvelimella sijaitseviin tiedostoihin muokkaamalla polkua tai lähettämällä palvelimelle sopivaa dataa. Yksinkertaisin kokeilu lienee `../`-merkkijonon kokeilemista sovelluksen polussa.<br/>
5. Security Misconfiguration -- huonosti tehdyt tietoturvakonfiguraatiot.<br/>
6. Sensitive Data Exposure -- yhteyksien tulee olla suojattu.<br/>
7. Missing Function Level Access Control -- autorisaatiota ei tapahdu metoditasolla.<br/>
8. Cross-Site Request Forgery (CSRF) -- sovelluksessa XSS-aukko, joka mahdollistaa epätoivotun pyynnön lähettämisen toiselle palvelimelle. Lomakkeisiin voidaan myös määritellä <a href="http://docs.spring.io/spring-security/site/docs/current/reference/html/csrf.html" target="_blank">erillinen otsaketieto</a>, joka on uniikki ja luodaan sivun latauksen yhteydessä.<br/>
9. Using Components with Known Vulnerabilities -- sovelluksessa käytetään osia, joissa on tunnettuja tietoturvariskejä. <br/>
10. Unvalidated Redirects and Forwards -- älä käytä parametreja uudelleenohjauksissa. Riskinä on väärien parametrien syöttäminen ja sitä kautta epätoivottuun tietoon pääseminen.<br/>



  Tutustu listaan tarkemmin osoitteessa <a href="https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project">https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project</a>. He tarjoavat dokumentaatiossaan kuvaukset riskeistä, sekä esimerkkejä hyökkäyksistä; <a href="https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet" target="_blank">Tässä</a> esimerkki XSS-filtterien kiertämisestä.



<text-box variant='hint' name='Palvelinten fyysinen tietoturva' } do %>


    Tietoturvaan keskityttäessä on hyvä muistaa myös fyysinen tietoturva. Jos palvelinsaliin pääsee helposti, voi kuka tahansa kävellä sinne ja ottaa palvelimen kainaloonsa. Tällöin sovellukseen toteutetun tietoturvan hyöty on melko pieni.


<% end %>


# part 7


<text-box variant='hint' name='Seitsemännen osan tavoitteet' } do %>


    Tuntee menetelmiä sovellusten skaalaamiseen isoille käyttäjäjoukoille. Ymmärtää reaktiivisen ohjelmoinnin perusteet ja osaa tehdä yksinkertaisen palvelinohjelmiston reaktiivisella ohjelmointiparadigmalla.


<% end %>



#
  Skaalautuvat sovellukset



  Kun sovellukseen liittyvä liikenne ja tiedon määrä kasvaa niin isoksi, että sovelluksen käyttö takkuilee, tulee asialle tehdä jotain.



<text-box variant='hint' name='Hitausongelmat' } do %>


    Sovelluksen hitausongelmat liittyvät usein konfiguraatio-ongelmiin. Tyypillisiä ongelmia ovat esimerkiksi toistuvat tietokantakyselyt tauluihin, joiden kenttiin ei ole määritelty hakuoperaatioita tehostavia indeksejä. Yksittäisen käyttäjän etsiminen tietokantataulusta nimen perusteella vaatii pahimmassa tapauksessa kaikkien rivien läpikäynnin ilman indeksien käyttöä; indeksillä haku tehostuu merkittävästi.



    Sovelluksen ongelmakohdat löytyvät usein sovelluksen toimintaa profiloimalla. Spring-sovellusten profilointi onnistuu esimerkiksi <a href="https://www.appdynamics.com/java/spring/" target="_blank">AppDynamicsin</a> ja <a href="https://www.yourkit.com/" target="_blank">YourKit</a>in avulla. Spring Boot-projekteihin voi lisätää myös <a href="https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready" target="_blank">Actuator</a>-komponentin, jonka avulla <a href="http://kielczewski.eu/2015/01/application-metrics-with-spring-boot-actuator/" target="_blank">sovellukseen voi lisätä tilastojen keruutoiminnallisuutta</a>.


<% end %>



  Olettaen, että sovelluksen konfiguraatio on kunnossa, sovelluksen skaalautumiseen on useampia lähtökohtia: (1) olemassaolevien resurssien käytön tehostaminen esimerkiksi välimuistitoteutusten ja palvelintehon kasvattamisen avulla, (2) resurssien määrän kasvattaminen esimerkiksi uusia palvelimia hankkimalla, (3) toiminnallisuuden jakaminen pienempiin vastuualueisiin ja palveluihin sekä näiden määrän kasvattaminen.



  Sovellukset eivät tyypillisesti skaalaudu lineaarisesti ja skaalautumiseen liittyy paljon muutakin kuin resurssien lisääminen. Jos yksi palvelin pystyy käsittelemään tuhat pyyntöä sekunnissa, emme voi olettaa, että kahdeksan palvelinta pystyy käsittelemään kahdeksantuhatta pyyntöä sekunnissa.



  Tehoon vaikuttavat myös muut käytetyt komponentit sekä verkkokapasiteetti eikä skaalautumiseen ole olemassa yhtä oikeaa lähestymistapaa. Joskus tehokkaamman palvelimen hankkiminen on nopeampaa ja kustannustehokkaampaa kuin sovelluksen muokkaaminen -- esimerkiksi hitaasti toimiva tietokanta tehostuu tyypillisesti huomattavasti lisäämällä käytössä olevaa muistia, joskus taas käytetyn tietokantakomponentin vaihtaminen tehostaa sovellusta merkittävästi.



  Oleellista sovelluskehityksen kannalta on kuitenkin lähestyä ongelmaa pragmaattisesti ja optimoida käytettyjä henkilöresursseja; jos sovellus ei tule olemaan laajassa käytössä, ei sen skaalautumista kannata pitää tärkeimpänä sovelluksen ominaisuutena. Samalla on hyvä pitää mielessä ohjelmistokehitystyön kustannus -- kuukausipalkalla sivukuluineen saa ostettua useita palvelimia.




##
  Palvelinpuolen välimuistit



  Tyypillisissä palvelinohjelmistoissa huomattava osa kyselyistä on GET-tyyppisiä pyyntöjä. GET-tyyppiset pyynnöt hakevat tietoa mutta eivät muokkaa palvelimella olevaa dataa. Esimerkiksi tietokannasta dataa hakevat GET-tyyppiset pyynnöt luovat yhteyden tietokantasovellukseen, josta data haetaan. Jos näitä pyyntöjä on useita, eikä tietokannassa oleva data juurikaan muutu, kannattaa turhat tietokantakyselyt karsia.



  Spring Bootia käytettäessä palvelimessa käytettävän <a href="http://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-caching.html" target="_blank">välimuistin konfigurointi</a> tapahtuu lisäämällä konfiguraatiotiedostoon annotaatio `@EnableCaching`. Oman välimuistitoteutuksen toteuttaminen tapahtuu luomalla <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/cache/CacheManager.html" target="_blank">CacheManager</a>-rajapinnan toteuttava luokka sovellukseen. Jos taas omaa välimuistitoteutusta ei tee, etsii sovellus käynnistyessään välimuistitoteutusten (<a href="http://www.ehcache.org/" target="_blank">Ehcache</a>, <a href="https://hazelcast.com/" target="_blank">Hazelcast</a>, <a href="http://www.couchbase.com/" target="_blank">Couchbase</a>...) konfiguraatiotiedostoja. Jos näitä ei löydy, välimuistina käytetään yksinkertaista hajautustaulua.



  Kun välimuisti on konfiguroitu, voimme lisätä välimuistitoiminnallisuuden palvelumetodeille `@Cacheable`-annotaation avulla. Alla olevassa esimerkissä metodin `read` palauttama tulos asetetaan välimuistiin.


```java
@Service
public class MyService {

    @Autowired
    private MyRepository myRepository;

    @Cacheable("my-cache-key")
    public My read(Long id) {
        return myRepository.findOne(id);
    }

    // ...```


  Käytännössä annotaatio `@Cacheable` luo metodille `read` proxy-metodin, joka ensin tarkistaa onko haettavaa tulosta välimuistissa -- proxy-metodit ovat käytössä vain jos metodia kutsutaan luokan ulkopuolelta. Jos tulos on välimuistissa, palautetaan se sieltä, muuten tulos haetaan tietokannasta ja se tallennetaan välimuistiin. Metodin parametrina annettavia arvoja hyödynnetään välimuistin avaimen toteuttamisessa, eli jokaista haettavaa oliota kohden voidaan luoda oma tietue välimuistiin. Tässä kohtaa on hyvä tutustua Springin <a href="http://docs.spring.io/spring/docs/current/spring-framework-reference/html/cache.html" target="_blank">cache</a>-dokumentaatioon.



  <em>
    Huomaa, että Springin kontrollerimetodit palauttavat näkymän nimen -- kontrollerimetodien palauttamien arvojen cachettaminen ei ole toivottua..
  </em>



  Välimuistitoteutuksen vastuulla ei ole pitää kirjaa tietokantaan tehtävistä muutoksista, jolloin välimuistin tyhjentäminen muutoksen yhteydessä on sovelluskehittäjän vastuulla. Dataa muuttavat metodit tulee annotoida sopivasti annotaatiolla `@CacheEvict`, jotta välimuistista poistetaan muuttuneet tiedot.




<programming-exercise name='Weather Service' } do %>


    Kumpulan kampuksella majaileva ilmatieteen laitos kaipailee pientä viritystä omaan sääpalveluunsa. Tällä hetkellä palvelussa on toiminnallisuus sijaintien hakemiseen ja lisäämiseen. Ilmatieteen laitos on lisäksi toteuttanut säähavaintojen lisäämisen suoraan tuotantotietokantaan, mihin ei tässä palvelussa päästä käsiksi. Palvelussa halutaan kuitenkin muutama lisätoiminnallisuus:



    Lisää sovellukseen välimuistitoiminnallisuus. Osoitteisiin `/locations` ja `/locations/{id}` tehtyjen hakujen tulee toimia siten, että jos haettava sijainti ei ole välimuistissa, se haetaan tietokannasta ja tallennetaan välimuistiin. Jos sijainti taas on välimuistissa, tulee se palauttaa sieltä ilman tietokantahakua.



    Lisää tämän jälkeen sovellukseen toiminnallisuus, missä käytössä oleva välimuisti tyhjennetään kun käyttäjä lisää uuden sijainnin tai tekee GET-tyyppisen pyynnön osoitteeseen `/flushcaches`. Erityisesti jälkimmäinen on tärkeä asiakkaalle, sillä se lisää tietokantaan tietoa myös palvelinohjelmiston ulkopuolelta.


<% end %>



<text-box variant='hint' name='Välimuistit selainpuolella' } do %>


    Tiedostoja jaettaessa dataa ei kannata siirtää uudestaan jos tiedosto on jo käyttäjällä. Voimme määritellä HTTP-pyynnön vastauksen otsaketietoihin tietoa datan vanhentumisesta, jonka perusteella selain osaa päätellä milloin näytettävä tieto on vanhentunutta ja se pitäisi hakea uudestaan. Hieman uudempi tapa on <a href="http://en.wikipedia.org/wiki/HTTP_ETag" target="_blank">entiteettitagin</a> käyttö pyynnön vastauksessa. Kun resurssiin liittyvään vastaukseen lisätään ETag-otsake, lähettää selain tiedostoa seuraavalla kerralla haettaessa aiemmin annetun arvon osana `"If-None-Match"`-otsaketta. Käytännössä palvelimella voidaan tällöin tarkistaa onko tiedosto muuttunut -- jos ei, vastaukseksi riittää pelkkä statuskoodi 304 -- NOT MODIFIED.


<% end %>



##
  Palvelinmäärän kasvattaminen



  Skaalautumisesta puhuttaessa puhutaan käytännössä lähes aina horisontaalisesta skaalautumisesta, jossa käyttöön hankitaan esimerkiksi lisää palvelimia. Vertikaalinen skaalautumisen harkinta on mahdollista tietyissä tapauksissa, esimerkiksi tietokantapalvelimen ja -kyselyiden toimintaa suunniteltaessa, mutta yleisesti ottaen horisontaalinen skaalautuminen on kustannustehokkaampaa. Käytännöllisesti ajatellen kahden viikon ohjelmointityö kymmenen prosentin tehonparannukseen on tyypillisesti kalliimpaa kuin muutaman päivän konfiguraatiotyö ja uuden palvelimen hankkiminen. Käyttäjien määrän kasvaessa uusien palvelinten hankkiminen on joka tapauksessa vastassa.



  Pyyntöjen määrän kasvaessa yksinkertainen ratkaisu on palvelinmäärän eli käytössä olevan raudan kasvattaminen. Tällöin pyyntöjen jakaminen palvelinten kesken hoidetaan erillisellä kuormantasaajalla (<em><a href="http://en.wikipedia.org/wiki/Load_balancing_(computing)" target="_blank">load balancer</a></em>), joka ohjaa pyyntöjä palvelimille.



  Jos sovellukseen ei liity tilaa (esimerkiksi käyttäjän tunnistaminen tai ostoskori), kuormantasaaja voi ohjata pyyntöjä käytössä oleville palvelimille round-robin -tekniikalla. Jos sovellukseen liittyy tila, tulee tietyn asiakkaan tekemät pyynnöt ohjata aina samalle palvelimelle, sillä evästeet tallennetaan oletuksena palvelinkohtaisesti. Tämän voi toteuttaa esimerkiksi siten, että kuormantasaaja lisää pyyntöön evästeen, jonka avulla käyttäjä identifioidaan ja ohjataan oikealle palvelimelle. Tätä lähestymistapaa kutsutaan termillä <em>sticky session</em>.



  Pelkkä palvelinmäärän kasvattaminen ja kuormantasaus ei kuitenkaan aina riitä. Kuormantasaus helpottaa verkon kuormaa, mutta ei ota kantaa palvelinten kuormaan. Jos yksittäinen palvelin käsittelee pitkään kestävää laskentaintensiivistä kyselyä, voi kuormantasaaja ohjata tälle palvelimelle lisää kyselyjä "koska eihän se ole vähään aikaan saanut mitään töitä".  Käytännössä tällöin entisestään paljon laskentaa tekevä palvelimen saa lisää kuormaa. On kuitenkin mahdollista käyttää kuormantasaajaa, joka pitää lisäksi kirjaa palvelinten tilasta. Palvelimet voivat myös raportoida tilastaan -- Springillä tämä onnistuu esimerkiksi <a href="https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready" target="_blank" norel>Actuator</a>-komponentin avulla. Tässäkin on toki omat huonot puolensa, sillä palvelimen tila voi muuttua hyvinkin nopeasti.



  Parempi ratkaisu on palvelinmäärän kasvattaminen <em>ja</em> sovelluksen suunnittelu siten, että laskentaintensiiviset operaatiot käsitellään erillisillä palvelimilla. Tällöin käytetään käytännössä erillistä laskentaklusteria aikaa vievien laskentaoperaatioiden käsittelyyn, jolloin pyyntöjä kuuntelevan palvelimen kuorma pysyy alhaisena.



  Riippuen pyyntöjen määrästä, palvelinkonfiguraatio voidaan toteuttaa jopa siten, että staattiset tiedostot (esim. kuvat) löytyvät erillisiltä palvelimilta, GET-pyynnöt käsitellään erillisillä pyyntöjä vastaanottavilla palvelimilla, ja datan muokkaamista tai prosessointia vaativat kyselyt (esim POST) ohjataan asiakkaan pyyntöjä vastaanottavien palvelinten toimesta laskentaklusterille.



<text-box variant='hint' name='Rajoitettu määrä samanaikaisia pyyntöjä osoitetta kohden' } do %>


    Staattisten resurssien kuten kuvien ja tyylitiedostojen hajauttaminen eri palvelimille on oikeastaan fiksua. <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html" target="_blank">HTTP 1.1-spesifikaation</a> yhteyksiin liittyvässä osissa suositellaan tiettyyn osoitteeseen tehtävien samanaikaisten pyyntöjen määrän rajoittamista kahteen.



    <em>Clients that use persistent connections SHOULD limit the number of simultaneous connections that they maintain to a given server. A single-user client SHOULD NOT maintain more than 2 connections with any server or proxy. A proxy SHOULD use up to 2*N connections to another server or proxy, where N is the number of simultaneously active users. These guidelines are intended to improve HTTP response times and avoid congestion.</em>



    Käytännössä suurin osa selaimista tekee enemmän kuin 2 kyselyä kerrallaan samaan osoitteeseen. Jos web-sivusto sisältää paljon erilaisia staattisita resursseja, ja ne sijaitsevat kaikki samalla palvelimella, saadaan resursseja korkeintaan selaimeen rajoitettu määrä kerrallaan. Toisaalta, jos resurssit jaetaan useamman sijainnin kesken, ei tätä rajoitetta ole.



    Resurssien jakaminen useampaan sijantiin mahdollistaa myös maantieteellisen hajauttamisen, missä käyttäjä saa sivun sisällön lähellä olevilta palvelimilta, mikä nopeuttaa vasteaikaa. Sama resurssi voi olla myös useammalla palvelimella.



    Tutustu aiheeseen tarkemmin lukemalla Wikipedian artikkeli <a href="http://en.wikipedia.org/wiki/Content_delivery_network" target="_blank">Content delivery network</a>.


<% end %>



  Palvelinmäärän kasvattaminen onnistuu myös tietokantapuolella. Tällöin käyttöön tulevat tyypillisesti hajautetut tietokantapalvelut kuten <a href="http://cassandra.apache.org/" target="_blank">Apache Cassandra</a> ja <a href="http://geode.apache.org/" target="_blank">Apache Geode</a>. Riippumatta käyttöön valitusta teknologiasta, aiemmin käyttämämme Spring Data JPA:n ohjelmointimalli sopii myös näihin tietokantoihin: esimerkiksi Cassandran käyttöönottoon löytyy ohjeistusta osoitteesta <a href="http://projects.spring.io/spring-data-cassandra/" target="_blank">http://projects.spring.io/spring-data-cassandra/</a>.




<text-box variant='hint' name='Teknologiahype' } do %>


    Tietokantamoottoreiden ympärillä on viime vuosikymmenen lopusta lähtien ollut tietokantamoottoreihin liittyvää hype-tyyppistä keskustelua. Nyt kun tuosta on mennyt hetki, on hyvä tarkastella keskustelua ja siihen liittyviä jälkiviisauksia.



    Eräs merkittävistä NoSQL-buumin aloittajista oli Twitterin noin 2010 tekemä <a href="http://www.computerworld.com/article/2520084/database-administration/twitter-growth-prompts-switch-from-mysql-to--nosql--database.html" target="_blank">päätös siirtyä MySQL-relaatiotietokannan käytöstä NoSQL-tietokantaan</a>; taustasyynä muutokselle oli "relaatiotietokantojen hitaus". Keskustelua seurasi <a href="https://www.mysql.com/" target="_blank">MySQL</a>:n ja <a href="https://mariadb.org/" target="_blank">MariaDB</a>:n kehittäjän Monty Wideniuksen <a href="http://blog.jelastic.com/2013/01/21/are-nosql-and-big-data-just-hype/" target="_blank">pohdintaa</a> teemaan liittyen: <em>The main reason Twitter had problems with MySQL back then, was that they were using it incorrectly. The strange thing was that the solution they suggested for solving their problems could be done just as easily in MySQL as in Cassandra.</em>



    Käytännössä Widenius vihjasi, että Twitter vain käytti MySQL:ää huonosti. Nykyään Twitterkin on tosin rakentanut itselleen sopivampaa tietokannanhallintajärjestelmää, tästä lisää osoitteessa <a href="https://gigaom.com/2014/05/12/3-lessons-in-database-design-from-the-team-behind-twitters-manhattan/" target="_blank">https://gigaom.com/2014/05/12/3-lessons-in-database-design-from-the-team-behind-twitters-manhattan/</a>.


<% end %>




##
  Tiedostojen jakaminen ja tietokannat



  Kun sovelluksen kasvu saavuttaa pisteen, missä yksittäisestä tietokantapalvelimesta siirrytään useamman palvelimen käyttöön, on hyvä hetki miettiä sovelluksen tietokantarakennetta. Tietokantojen määrän kasvaessa numeeristen tunnusten (esim `Long`) käyttäminen tunnisteena on ongelmallista. Jos tietokantataulussa on numeerinen tunnus ja useampi sovellus luo uusia tietokantarivejä, tarvitaan erillinen palvelu tunnusten antamiselle -- tämän palvelun kaatuessa koko sovellus voi kaatua. Toisaalta, jos palvelua ei ole toteutettu hyvin, on tunnusten törmäykset mahdollisia, mikä johtaa helposti tiedon katoamiseen. Numeeristen avainten käyttö erityisesti osoitteiden yhteydessä tekee niistä myös helposti arvattavia, mikä voi myös luoda tietoturvariskejä yhdessä huonosti toteutetun pääsynvalvonnan kanssa.  Yhtenä vaihtoehtona numeerisille tunnuksille on ehdotettu <a href="http://docs.oracle.com/javase/7/docs/api/java/util/UUID.html" target="_blank">UUID</a>-pohjaisia merkkijonotunnuksia, jotka voidaan luoda ennen olion tallentamista tietokantaan.



  Spring Data JPAn tapauksessa tämä tarkoittaa sitä, että `AbstractPersistable`-luokan periminen ei onnistu kuten ennen. Voimme kuitenkin toteuttaa oman UUIDPersistable-luokan, joka luo tunnuksen automaattisesti.


```java
@MappedSuperclass
public abstract class UUIDPersistable implements Persistable&lt;String&gt; {

    @Id
    private String id;

    public UUIDPersistable() {
        this.id = UUID.randomUUID().toString();
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @JsonIgnore
    @Override
    public boolean isNew() {
        return false;
    }

    // muuta mahdollista
}```


  Yllä oleva toteutus luo uuden id-avaimen olion luontivaiheessa, jolloin se on käytössä jo ennen olion tallentamista tietokantaan. Rajapinta <a href="http://docs.spring.io/spring-data/data-commons/docs/current/api/org/springframework/data/domain/Persistable.html" target="_blank">Persistable</a> on rajapinta, jota Spring Data -projektit käyttävät olioiden tallennuksessa erilaisiin tietokantoihin.



  Nyt voimme luoda merkkijonotunnusta käyttävän entiteetin seuraavasti:


```java
@Entity
public class Person extends UUIDPersistable {

    private String name;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```




###
  Evästeet ja useampi palvelin



  Kun käyttäjä kirjautuu palvelinohjelmistoon, tieto käyttäjästä pidetään tyypillisesti yllä sessiossa. Sessiot toimivat evästeiden avulla, jotka palvelin asettaa pyynnön vastaukseen, ja selain lähettää aina palvelimelle. Sessiotiedot ovat oletuksena yksittäisellä palvelimella, mikä aiheuttaa ongelmia palvelinmäärän kasvaessa. Edellä erääksi ratkaisuksi mainittiin kuormantasaajien (load balancer) käyttö siten, että käyttäjät ohjataan aina samalle koneelle. Tämä ei kuitenkaan ole aina mahdollista -- kuormantasaajat eivät aina tue sticky session -tekniikkaa -- eikä kannattavaa -- kun palvelinmäärää säädellään dynaamisesti, uusi palvelin käynnistetään tyypillisesti vasta silloin, kun havaitaan ruuhkaa -- olemassaolevat käyttäjät ohjataan ruuhkaantuneelle palvelimelle uudesta palvelimesta riippumatta.



  Yksi vaihtoehto on tunnistautumisongelman siirtäminen tietokantaan -- skaalautumista helpottaa tietokannan hajauttaminen esimerkiksi käyttäjätunnusten perusteella. Sen sijaan, että käytetään palvelimen hallinnoimia sessioita, pidetään käyttäjätunnus ja kirjautumistieto salattuna evästeessä. Eväste lähetetään kaikissa tiettyyn osoitteeseen tehtävissä kutsuissa; palvelin voi tarvittaessa purkaa evästeessä olevan viestin ja hakea käyttäjään liittyvät tiedot tietokannasta.



##
  Asynkroniset metodikutsut ja rinnakkaisuus



  Jokaiselle palvelimelle tulevalle pyynnölle määrätään säie, joka on varattuna pyynnön käsittelyn loppuun asti. Jokaisen pyynnön käsittelyyn kuuluu ainakin seuraavat askeleet: (1) pyyntö lähetetään palvelimelle, (2) palvelin vastaanottaa pyynnön ja ohjaa pyynnön oikealle kontrollerille, (3) kontrolleri vastaanottaa pyynnön ja ohjaa pyynnön oikealle palvelulle tai palveluille, (4) palvelu vastaanottaa pyynnön, suorittaa pyyntöön liittyvät operaatiot muiden palveluiden kanssa, ja palauttaa lopulta vastauksen metodin suorituksen lopussa, (5) kontrolleri ohjaa pyynnön sopivalle näkymälle, ja (6) vastaus palautetaan käyttäjälle. Pyyntöä varten on palvelimella varattuna säie kohdissa 2-6. Jos jonkun kohdan suoritus kestää pitkään -- esimerkiksi palvelu tekee pyynnön toiselle palvelimelle, joka on hidas -- on säie odotustilassa.



  Palvelukutsun suorituksen odottaminen ei kuitenkaan aina ole tarpeen. Jos sovelluksemme suorittaa esimerkiksi raskaampaa laskentaa, tai tekee pitkiä tietokantaoperaatioita joiden tuloksia käyttäjän ei tarvitse nähdä heti, kannattaa pyyntö suorittaa asynkronisesti. Asynkronisella metodikutsulla tarkoitetaan sitä, että asynkronista metodia kutsuva metodi ei jää odottamaan metodin tuloksen valmistumista. Jos edellisissä askeleissa kohta 4 suoritetaan asynkronisesti, ei sen suoritusta tarvitse odottaa loppuun.



  Ohjelmistokehykset toteuttavat asynkroniset metodikutsut luomalla palvelukutsusta erillisen säikeen, jossa pyyntö käsitellään. Spring Bootin tapauksessa asynkroniset metodikutsut saa käyttöön lisäämällä sovelluksen konfiguraatioon (tapauksessamme usein `Application`-luokassa) rivi `@EnableAsync`. Kun konfiguraatio on paikallaan, voimme suorittaa metodeja asynkronisesti. Jotta metodisuoritus olisi asynkroninen, tulee metodin olla `void`-tyyppinen, sekä sillä tulee olla annotaatio `@Async`.



  Tutkitaan tapausta, jossa tallennetaan `Item`-tyyppisiä olioita. Item-olion sisäinen muoto ei ole niin tärkeä.


```java
    @RequestMapping(method = RequestMethod.POST)
    public String create(@ModelAttribute Item item) {
        itemService.create(item);
        return "redirect:/items";
    }```


  Oletetaan että `ItemService`-olion metodi `create` on void-tyyppinen, ja näyttää seuraavalta:


```java
    public void create(Item item) {
        // koodia..
    }```


  Metodin muuttaminen asynkroniseksi vaatii `@Async`-annotaation ItemService-luokkaan.


```java
    @Async
    public void create(Item item) {
        // koodia..
    }```


  Käytännössä asynkroniset metodikutsut toteutetaan asettamalla metodikutsu suoritusjonoon, josta se suoritetaan kun sovelluksella on siihen mahdollisuus.




<programming-exercise name='Calculations' } do %>


    Tehtäväpohjassa on sovellus, joka tekee "raskasta laskentaa". Tällä hetkellä käyttäjä joutuu odottamaan laskentapyynnön suoritusta pitkään, mutta olisi hienoa jos käyttäjälle kerrottaisiin laskennan tilasta jo laskentavaiheessa.



    Muokkaa sovellusta siten, että laskenta tallennetaan kertaalleen jo ennen laskentaa -- näin siihen saadaan viite; aseta oliolle myös status "PROCESSING". Muokkaa tämän jälkeen luokkaa `CalculationService` siten, että laskenta tapahtuu asynkronisesti.



    Huom! Älä poista `CalculationService`-luokasta koodia


  ```java
        try {
            Thread.sleep(2000);
        } catch (InterruptedException ex) {
            Logger.getLogger(CalculationService.class.getName()).log(Level.SEVERE, null, ex);
        }
  ```



    Kun sovelluksesi toimii oikein, laskennan lisäyksen pitäisi olla nopeaa ja käyttäjä näkee lisäyksen jälkeen laskentakohtaisen sivun, missä on laskentaan liittyvää tietoa. Kun sivu ladataan uudestaan noin 2 sekunnin kuluttua, on laskenta valmistunut.


<% end %>


###
  Rinnakkain suoritettavat metodikutsut



  Koostepalvelut, eli palvelut jotka keräävät tietoa useammasta palvelusta ja yhdistävät tietoja käyttäjälle, tyypillisesti haluavat näyttää käyttäjälle vastauksen.



  Näissä tilanne on usein se, että palveluita on useita, ja niiden peräkkäinen suorittaminen on tyypillisesti hidasta. Suoritusta voi nopeuttaa ottamalla käyttöön rinnakkaisen suorituksen, joka onnistuu esimerkiksi Javan <a href="http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/ExecutorService.html" target="_blank">ExecutorService</a>-luokan avulla. Voimme käytännössä lisätä tehtäviä niitä suorittavalle palvelulle, jolta saamme viitteen tulevaa vastausta varten.



  Spring tarjoaa myös tähän apuvälineitä. Kun lisäämme sovellukselle <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/core/task/AsyncTaskExecutor.html">AsyncTaskExecutor</a>-rajapinnan toteuttaman olion (esimerkiksi <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html" target="_blank">ThreadPoolTaskExecutor</a>), voimme injektoida sen sovelluksemme käyttöön tarvittaessa. Tietynlaisen olion sovellukseen tapahtuu luomalla `@Bean`-annotaatiolla merkitty olio konfiguraatiotiedostossa. Alla esimerkiksi luodaan edellämainitut oliot.



```java
// konfiguraatiotiedosto
    @Bean
    public AsyncTaskExecutor asyncTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(8);
        return executor;
    }
```


  Nyt voimme ottaa käyttöön sovelluksessa `AsyncTaskExecutor`-rajapinnan toteuttavan olion.


```java
    @Autowired
    private AsyncTaskExecutor taskExecutor;
<% end %>


  Käytännössä tehtävien lisääminen rinnakkaissuorittajalle tapahtuu esimerkiksi seuraavasti. Alla luodaan kolme <a href="http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Callable.html" target="_blank">Callable</a>-rajapinnan toteuttavaa oliota, annetaan ne `taskExecutor`-ilmentymälle, ja otetaan jokaisen kohdalla talteen <a href="http://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Future.html" target="_blank">Future</a>-viite, mihin suorituksen tulos asetetaan kun suoritus on loppunut. Future-oliosta saa tuloksen `get`-metodilla.


```java
    // käytössä myös ylläoleva taskExecutor
    List&lt;Future&lt;TuloksenTyyppi&gt;&gt; results = new ArrayList&lt;&gt;();

    results.add(taskExecutor.submit(new Callable&lt;TuloksenTyyppi&gt;() {
        @Override
        public TuloksenTyyppi call() {
            // laskentaa.. -- tulos voi olla käytännössä mitä tahansa
            return new TuloksenTyyppi();
        }
    }));

    for (Future&lt;TuloksenTyyppi&gt; result: results) {
        TuloksenTyyppi t = result.get();

        // tee jotain tällä..
    }
```



<programming-exercise name='Lowest Prices' } do %>


    Tehtäväpohjaan on lähdetty toteuttamaan sovellusta, joka etsii eri palveluiden rajapinnoista halutun esineen hintaa ja palauttaa halvimman. Palvelusta on toteutettu ensimmäinen versio, mutta se on liian hidas.



    Ennenkuin sovelluskehittäjät juoksevat hakemaan uutta rautaa, muokkaa palvelun `QuoteService`-toiminnallisuutta siten, että se suorittaa hintakyselyt rinnakkain nykyisen peräkkäissuorituksen sijaan.


<% end %>



<text-box variant='hint' name='Java 8 ja kokoelmien rinnakkainen läpikäynti' } do %>


    Java 8 tarjoaa kehittyneemmän välineistön kokoelmien läpikäyntiin. Tutustu näihin osoitteessa <a href="http://docs.oracle.com/javase/tutorial/collections/streams/parallelism.html" target="_blank">http://docs.oracle.com/javase/tutorial/collections/streams/parallelism.html</a>.


<% end %>


###
  Viestijonot




  Kun palvelinohjelmistoja skaalataan siten, että osa laskennasta siirretään erillisille palvelimille, on oleellista että palveluiden välillä kulkevat viestit (pyynnöt ja vastaukset) eivät katoa, ja että käyttäjän pyyntöjä vastaanottavan palvelimen ei tarvitse huolehtia toisille palvelimille lähetettyjen pyyntöjen perille menemisestä tai lähetettyjen viestien vastausten käsittelystä. Eniten käytetty lähestymistapa viestien säilymisen varmentamiseen on viestijonot (<em>messaging</em>, <em>message queues</em>), joiden tehtävänä on toimia viestien väliaikaisena säilytyspisteenä. Käytännössä viestijonot ovat erillisiä palveluita, joihin viestien tuottajat (<em>producer</em>) voivat lisätä viestejä, joita viestejä käyttävät palvelut kuluttavat (<em>consumer</em>).



  Viestijonoja käyttävät sovellukset kommunikoivat viestijonon välityksellä. Tuottaja lisää viestejä viestijonoon, josta käyttäjä niitä hakee. Kun viestin sisältämän datan käsittely on valmis, prosessoija lähettää viestin takaisin. Viestijonoissa on yleensä varmistustoiminnallisuus: jos viestille ei ole vastaanottajaa, jää viesti viestijonoon ja se tallennetaan esimerkiksi viestijonopalvelimen levykkeelle. Viestijonojen konkreettinen toiminnallisuus riippuu viestijonon toteuttajasta.



  Viestijonosovelluksia on useita, esimerkiksi <a href="http://activemq.apache.org/" target="_blank">ActiveMQ</a> ja <a href="http://www.rabbitmq.com/" target="_blank">RabbitMQ</a>. Viestijonoille on myös useita standardeja, joilla pyritään varmistamaan sovellusten yhteensopivuus. Esimerkiksi Javan melko pitkään käytössä ollut <a href="http://en.wikipedia.org/wiki/Java_Message_Service" target="_blank">JMS</a>-standardi määrittelee viestijonoille rajapinnan, jonka viestijonosovelluksen tarjoajat voivat toteuttaa. Nykyään myös <a href="http://www.amqp.org/" target="_blank">AMQP</a>-protokolla on kasvattanut suosiotaan. Myös Spring tarjoaa komponentteja viestijonojen käsittelyyn, tutustu lisää aiheeseen <a href="http://spring.io/guides/gs/messaging-jms/" target="_blank">täällä</a>.






##
  Palvelukeskeiset arkkitehtuurit




  Monoliittisten "minä sisällän kaiken mahdollisen"-sovellusten ylläpitokustannukset kasvavat niitä kehitettäessä, sillä uuden toiminnallisuuden lisääminen vaatii olemassaolevan sovelluksen muokkaamista sekä testaamista. Olemassaoleva sovellus voi olla kirjoitettu hyvin vähäisesssä käytössä olevalla kielellä (vrt. pankkijärjestelmät ja COBOL) ja esimerkiksi kehitystä tukevat automaattiset testit voivat puuttua siitä täysin. Samalla myös uusien työntekijöiden tuominen ohjelmistokehitystiimiin on vaikeaa, sillä sovellus voi hoitaa montaa vastuualuetta samaan aikaan.



  Yrityksen toiminta-alueiden laajentuessa sekä uusien sovellustarpeiden ilmentyessä aiemmin toteutettuihin toiminnallisuuksiin olisi hyvä päästä käsiksi, mutta siten, että toiminnallisuuden käyttäminen ei vaadi juurikaan olemassaolevan muokkausta. Koostamalla sovellus erillisistä palveluista saadaan luotua tilanne, missä palvelut ovat tarvittaessa myös uusien sovellusten käytössä. Palvelut tarjoavat rajapinnan (esim. REST) minkä kautta niitä voi käyttää. Samalla rajapinta kapseloi palvelun toiminnan, jolloin muiden palvelua käyttävien sovellusten ei tarvitse tietää sen toteutukseen liittyvistä yksityiskohdista. Oleellista on, että yksikään palvelu ei yritä tehdä kaikkea. Tämä johtaa myös siihen, että yksittäisen palvelun toteutuskieli tai muut teknologiset valinnat ei vaikuta muiden komponenttien toimintaan -- oleellista on vain se, että palvelu tarjoaa rajapinnan jota voi käyttää ja joka löydetään.



  Yrityksen kasvaessa sen sisäiset toiminnat ja rakennettavat ohjelmistot sisältävät helposti päällekkäisyyksiä. Tällöin tilanne on käytännössä se, että aikaa käytetään samankaltaisten toimintojen ylläpitoon useammassa sovelluksessa -- pyörä keksitään yhä uudestaan ja uudestaan uudestaan uusia sovelluksia kehitettäessä.




  SOA (<em><a href="http://en.wikipedia.org/wiki/Service-oriented_architecture" target="_blank">Service Oriented Architecture</a></em>), eli palvelukeskeinen arkkitehtuuri, on suunnittelutapa, jossa eri sovelluksen komponentit on suunniteltu toimimaan itsenäisinä avoimen rajapinnan tarjoavina palveluina. Pilkkomalla sovellukset erillisiin palveluihin luodaan tilanne, missä palveluita voidaan käyttää myös tulevaisuudessa kehitettävien sovellusten toimesta. Palveluita käyttävät esimerkiksi toiset palvelut tai selainohjelmistot. Selainohjelmistot voivat hakea palvelusta JSON-muotoista dataa Javascriptin avulla ilman tarvetta omalle palvelinkomponentille. SOA-arkkitehtuurin avulla voidaan helpottaa myös ikääntyvien sovellusten jatkokäyttöä: ikääntyvät sovellukset voidaan kapseloida rajapinnan taakse, jonka kautta sovelluksen käyttö onnistuu myös jatkossa.



<text-box variant='hint' name='Amazon ja palvelut' } do %>


    Amazon on hyvä esimerkki yrityksestä, joka on menestynyt osittain sen takia, että se on toteuttanut tarjoamansa toiminnallisuudet palveluina. Siirtymä ei kuitenkaan ollut yksinkertainen, allaoleva viesti on katkelma Amazonin toimitusjohtajan, Jeff Bezosin, noin vuonna 2002 kirjoittamasta viestistä yritykselle (<a href="https://plus.google.com/+RipRowan/posts/eVeouesvaVX" target="_blank">lähde</a>).


  <pre>
1) All teams will henceforth expose their data and functionality
   through service interfaces.

2) Teams must communicate with each other through these interfaces.

3) There will be no other form of interprocess communication allowed:
   no direct linking, no direct reads of another team's data store,
   no shared-memory model, no back-doors whatsoever. The only communication
   allowed is via service interface calls over the network.

4) It doesn't matter what technology they use. HTTP, Corba, Pubsub,
   custom protocols — doesn't matter.

5) All service interfaces, without exception, must be designed from the
   ground up to be externalizable. That is to say, the team must plan
   and design to be able to expose the interface to developers in the
   outside world. No exceptions.

6) Anyone who doesn't do this will be fired.
  </pre>


    Oikeastaan, hyvin suuri syy sille, että Amazon tarjoaa nykyään erilaisia pilvipalveluita (kts. <a href="http://aws.amazon.com/" target="_blank">Amazon Web Services</a>) liittyy siihen kokemukseen, mitä yrityksen työntekijät sekä yritys on kerännyt kun yrityksen sisäistä toimintaa kehitettiin kohti palveluja tarjoavia ohjelmistotiimejä.


<% end %>



<text-box variant='hint' name='Lisää palveluorientoituneista arkkitehtuureista' } do %>


    -
      Tutustu Microsoftin <a href="https://msdn.microsoft.com/en-us/library/aa480021.aspx" target="_blank">SOA-johdatukseen</a> ja katso Youtube-video <a href="https://www.youtube.com/watch?v=OY7QGDg93Ic" target="_blank">Decomposing Applications for Deployability and Scalability</a>.

    -
      Entä jos joku palveluorientoituneen arkkitehtuurin palvelu kaatuu? NetFlix on kehittänyt tätä varten mainion <a href="https://github.com/Netflix/Hystrix" target="_blank">Hystrix</a>-kirjaston, joka tarjoaa menetelmiä kaatuneiden (tai ei vastaavien) komponenttien käsittelemiseen. Springillä on tuki Hystrix-kirjaston käyttöön, kts. <a href="https://spring.io/guides/gs/circuit-breaker/" target="_blank">https://spring.io/guides/gs/circuit-breaker/</a>.

    -
      Miten palvelut löydetään? Palveluorientoituneiden arkkitehtuurien yleistyessä markkinoille on ilmestynyt ESB (<a href="http://en.wikipedia.org/wiki/Enterprise_service_bus" target="_blank">enterprise service bus</a>)-sovelluksia, joiden tehtävä on toimia viestinvälittäjänä palveluiden välillä. Viestinvälityspalveluiden käyttäminen johtaa siihen, että palvelut ovat paremmin eriytettynä toisistaan -- palvelua A käyttävä palvelu B tietää vain viestinvälittäjän sekä palvelun A tunnisteen. Palvelun A tunniste ja kuvaus voidaan saada viestinvälittäjältä, ja palvelu voi kuvata itsensä esimerkiksi RAML (<a href="http://raml.org/" target="_blank">RESTful API Modeling Language</a>)-kuvauksen tai <a href="https://swagger.io/" target="_blank">Swagger</a>in avulla (kts. myös <a href="https://dzone.com/articles/spring-boot-restful-api-documentation-with-swagger" target="_blank">Spring Boot</a>-spesifi opas. Hieman skeptisyyttä on hyvä kuitenkin olla ilmassa -- katso esitys <a href="http://www.infoq.com/presentations/soa-without-esb" target="_blank">Does My Bus Look Big in This?</a>.



<% end %>




#
  Reaktiivisten sovellusten ohjelmointi



  Tarkastellaan seuraavaksi lyhyesti reaktiivisten sovellusten ohjelmointia. Tutustumme ensin pikaisesti funktionaaliseen ohjelmointiin sekä reaktiiviseen ohjelmointiin, jonka jälkeen nämä yhdistetään. Lopuksi katsotaan erästä tapaa lisätä palvelimen ja selaimen välistä vuorovaikutusta.



##
  Funktionaalinen ohjelmointi



  Funktionaalisen ohjelmoinnin ydinajatuksena on ohjelmakoodin suorituksesta johtuvien sivuvaikutusten minimointi. Sivuvaikutuksilla tarkoitetaan ohjelman tai ympäristön tilaan vaikuttavia epätoivottuja muutoksia. Sivuvaikutuksia ovat esimerkiksi muuttujan arvon muuttuminen, tiedon tallentaminen tietokantaan tai esimerkiksi käyttöliittymän näkymän muuttaminen.



  Keskiössä ovat puhtaat ja epäpuhtaat funktiot. Puhtaat funktiot noudattavat seuraavia periaatteita: (1) funktio ei muuta ohjelman sisäistä tilaa ja sen ainoa tuotos on funktion palauttama arvo, (2) funktion palauttama arvo määräytyy funktiolle parametrina annettavien arvojen perusteella, eikä samat parametrien arvot voi johtaa eri palautettaviin arvoihin, ja (3) funktiolle parametrina annettavat arvot on määritelty ennen funktion arvon palauttamista.



  Epäpuhtaat funktiot taas voivat palauttaa arvoja, joihin vaikuttavat myös muutkin asiat kuin funktiolle annettavat parametrit, jonka lisäksi epäpuhtaat funktiot voivat muuttaa ohjelman tilaa. Tällaisia ovat esimerkiksi tietokantaa käyttävät funktiot, joiden toiminta vaikuttaa myös tietokannan sisältöön tai jotka hakevat tietokannasta tietoa.



  Funktionaaliset ohjelmointikielet tarjoavat välineitä ja käytänteitä jotka "pakottavat" ohjelmistokehittäjää ohjelmoimaan funktionaalisen ohjelmoinnin periaatteita noudattaen. Tällaisia kieliä ovat esimerkiksi <a href="https://en.wikipedia.org/wiki/Haskell_(programming_language)" target="_blank">Haskell</a>, joka on puhdas funktionaalinen ohjelmointikieli eli siinä ei ole mahdollista toteuttaa epäpuhtaita funktioita. Toinen esimerkki on <a href="https://en.wikipedia.org/wiki/Clojure" target="_blank">Clojure</a>, jossa on mahdollista toteuttaa myös epäpuhtaita funktiota -- Clojureen löytyy myös erillinen Helsingin yliopiston kurssimateriaali (<a href="http://mooc.fi/courses/2014/clojure/" target="_blank">Functional programming with Clojure</a>).



  Funktionaalisen ohjelmoinnin hyötyihin liittyy muunmuassa testattavuus. Alla on annettuna esimerkki metodista, joka palauttaa nykyisenä ajanhetkenä tietyllä kanavalla näkyvän ohjelman.


```java
public TvOhjelma annaTvOhjelma(Opas opas, Kanava kanava) {
    Aikataulu aikataulu = opas.annaAikataulu(kanava);
    return aikataulu.annaTvOhjelma(new Date());
}
<% end %>


  Ylläolevan metodin palauttamaan arvoon vaikuttaa aika, eli sen arvo ei määräydy vain annettujen parametrien perusteella. Metodin testaaminen on vaikeaa, sillä aika muuttuu jatkuvasti. Jos määrittelemme myös ajna metodin parametriksi, paranee testattavuus huomattavasti.


```java
public TvOhjelma annaTvOhjelma(Opas opas, Kanava kanava, Date aika) {
    Aikataulu aikataulu = opas.annaAikataulu(kanava);
    return aikataulu.annaTvOhjelma(aika);
}
```


  Funktionaalisessa ohjelmoinnissa käytetään alkioiden käsittelyyn työvälineitä kuten `map` ja `filter`, joista ensimmäistä käytetään arvon muuntamiseen ja jälkimmäistä arvojen rajaamiseen. Alla olevassa esimerkissä käydään läpi henkilölista ja valitaan sieltä vain Maija-nimiset henkilöt. Lopulta heiltä valitaan iät ja ne tulostetaan.


```java
List&lt;Henkilo&gt; henkilot = // .. henkilo-lista saatu muualta

henkilot.stream()
        .filter(h -&gt; h.getNimi().equals("Maija"))
        .map(h -> h.getIka())
        .forEach(System.out::println);
```


  Ylläolevassa esimerkissä henkilot-listan sisältö ei muutu ohjelmakoodin suorituksen aikana. Periaatteessa -- jos useampi sovellus haluaisi listaan liittyvät tiedot -- kutsun `System.out::println` voisi vaihtaa esimerkiksi tiedon lähettämiseen liittyvällä kutsulla.



##
  Reaktiivinen ohjelmointi



  Reaktiivisella ohjelmoinnilla tarkoitetaan ohjelmointiparadigmaa, missä ohjelman tila voidaan nähdä verkkona, missä muutokset muuttujiin vaikuttavat myös kaikkiin niistä riippuviin muuttujiin. Perinteisessä imperatiivisessa ohjelmoinnissa alla olevan ohjelman tulostus on 5.


```java
int a = 3;
int b = 2;
int c = a + b;
a = 7;

System.out.println(c);
```


  Reaktiivisessa ohjelmoinnissa asia ei kuitenkaan ole näin, vaan ohjelman tulostus olisi 9. Lauseke `int c = a + b;` määrittelee muuttujan `c` arvon riippuvaiseksi muuttujista a ja b, jolloin kaikki muutokset muuttujiin a tai b vaikuttavat myös muuttujan c arvoon.



  Reaktiivista ohjelmointia hyödynnetään esimerkiksi taulukkolaskentaohjelmistoissa, missä muutokset yhteen soluun voivat vaikuttaa myös muiden solujen sisältöihin, mitkä taas mahdollisesti päivittävät muita soluja jne. Yleisemmin ajatellen reaktiivinen ohjelmointiparadigma on kätevä tapahtumaohjatussa ohjelmoinnissa; käyttöliittymässä tehtyjen toimintojen aiheuttamat muutokset johtavat myös käyttöliittymässä näkyvän tiedon päivittymisen.



<text-box variant='hint' name='Reaktiivisen ohjelmoinnin kehitys' } do %>


    Tutustu osoitteessa <a href="http://soft.vub.ac.be/Publications/2012/vub-soft-tr-12-13.pdf" target="_blank">http://soft.vub.ac.be/Publications/2012/vub-soft-tr-12-13.pdf</a> olevaan Survey-artikkeliin, joka käsittelee reaktiivisen ohjelmoinnin kehitystä. Myös Andre Staltzin kirjoittama osoitteessa <a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754" target="_blank">https://gist.github.com/staltz/868e7e9bc2a7b8c1f754</a> löytyvä johdanto kannattaa lukea.


<% end %>



  Termi reaktiivinen ohjelmointi (reactive programming) on kuormittunut, ja sillä on myös toinen yleisesti käytössä oleva merkitys. Reaktiivisella ohjelmoinnilla tarkoitetaan myös reaktiivisten sovellusten kehittämistä.


<text-box variant='hint' name='Reactive Manifesto' } do %>


    Tutustu <a href="http://www.reactivemanifesto.org/" target="_blank">Reaktiivisen sovelluskehityksen manifestiin</a>, joka ohjeistaa ohjelmistokehittäjiä luomaan sovelluksia, jotka vastaavat pyyntöön nopeasti (responsive), kestävät virhetilanteita (resilient), mukautuvat erilaisiin kuormiin (elastic) ja välittävät viestejä eri järjestelmän osa-alueiden välillä (message driven):



    <em>Responsive: The system responds in a timely manner if at all possible. Responsiveness is the cornerstone of usability and utility, but more than that, responsiveness means that problems may be detected quickly and dealt with effectively. Responsive systems focus on providing rapid and consistent response times, establishing reliable upper bounds so they deliver a consistent quality of service. This consistent behaviour in turn simplifies error handling, builds end user confidence, and encourages further interaction.</em>



    <em>Resilient: The system stays responsive in the face of failure. This applies not only to highly-available, mission critical systems — any system that is not resilient will be unresponsive after a failure. Resilience is achieved by replication, containment, isolation and delegation. Failures are contained within each component, isolating components from each other and thereby ensuring that parts of the system can fail and recover without compromising the system as a whole. Recovery of each component is delegated to another (external) component and high-availability is ensured by replication where necessary. The client of a component is not burdened with handling its failures.</em>



    <em>Elastic: The system stays responsive under varying workload. Reactive Systems can react to changes in the input rate by increasing or decreasing the resources allocated to service these inputs. This implies designs that have no contention points or central bottlenecks, resulting in the ability to shard or replicate components and distribute inputs among them. Reactive Systems support predictive, as well as Reactive, scaling algorithms by providing relevant live performance measures. They achieve elasticity in a cost-effective way on commodity hardware and software platforms.</em>



    <em>Message Driven: Reactive Systems rely on asynchronous message-passing to establish a boundary between components that ensures loose coupling, isolation and location transparency. This boundary also provides the means to delegate failures as messages. Employing explicit message-passing enables load management, elasticity, and flow control by shaping and monitoring the message queues in the system and applying back-pressure when necessary. Location transparent messaging as a means of communication makes it possible for the management of failure to work with the same constructs and semantics across a cluster or within a single host. Non-blocking communication allows recipients to only consume resources while active, leading to less system overhead.</em>



    Lainattu: <a href="http://www.reactivemanifesto.org/" target="_blank">http://www.reactivemanifesto.org/</a>


<% end %>



##
  Funktionaalinen reaktiivinen ohjelmointi



  Funktionaalinen reaktiivinen ohjelmointi on funktionaalista ohjelmointia ja reaktiivista ohjelmointia yhdistävä ohjelmointiparadigma. Järjestelmiä on karkeasti jakaen kahta tyyppiä, joista toinen perustuu viestien lähettämiseen (viestejä välitetään verkon läpi kunnes tulos saavutettu) ja toinen viestien odottamiseen (odotetaan kunnes tulokselle on tarvetta, ja tuotetaan tulos).



  Materiaalissa aiemmin esiintyneessä verkkokauppojen hintavertailuohjelmassa (tehtävä LowestPrices) käytettiin esimerkiksi seuraavaa lähdekoodia kaikkien verkkokauppojen läpikäyntiin:




```java
// services on lista hintatietoja tarjoavia palveluita
// ja taskExecutor on Javan AsyncTaskExecutor-luokan ilmentymä
BaseService bestService = services.stream().parallel()
                .map(s -&gt; taskExecutor.submit(() -&gt; {
                            s.getLowestPrice(item);
                            return s;
                        })
                ).map(f -&gt; {
                    try {
                        return f.get();
                    } catch (Throwable t) {
                        // käsittele virhe
                        return null;
                    }
                })
                .min((s1, s2) -&gt; Double.compare(s1.getLowestPrice(item), s2.getLowestPrice(item)))
                .get();
```



  Esimerkissä etsitään edullisin vaihtoehto kaikista vaihtoehdoista, jolle tehdään lopuksi jotain. Esimerkissä on kuitenkin ongelma: metodin `get`-kutsuminen <a href="https://docs.oracle.com/javase/7/docs/api/java/util/concurrent/Future.html" target="_blank">Future</a>-rajapinnan toteuttavalle oliolle jää odottamaan tuloksen valmistumista. Samalla myös pyyntöä käsittelevä säie on odotustilassa.



  Ohjelman voisi rakentaa fiksummin. Entä jos sovellus lähettäisikin vastauksen selaimelle kun laskenta on valmis, mutta ei pakottaisi säiettä odottamaan vastausta? Eräs mahdollisuus on <a href="https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html" target="_blank">CompletableFuture</a>-luokan käyttö, jonka avulla työn alla oleville tehtäville voidaan kertoa <em>mitä pitää tehdä sitten kun laskenta on valmis</em>. Tutustu aiheeseen tarkemmin osoitteessa <a href="http://www.deadcoderising.com/java8-writing-asynchronous-code-with-completablefuture/" target="_blank">http://www.deadcoderising.com/java8-writing-asynchronous-code-with-completablefuture/</a>. Springin <a href="http://docs.spring.io/spring-integration/reference/html/messaging-endpoints-chapter.html#gw-completable-future" target="_blank">dokumentaatiossa</a> löytyy myös aiheeseen liittyvää sisältöä.




##
  Web Socketit



  <a href="http://en.wikipedia.org/wiki/WebSocket" target="_blank">WebSocketit</a> ovat tapa toteuttaa palvelimen ja selaimen välinen kommunikointi siten, että selain rekisteröityy palveluun, jonka jälkeen palvelin voi lähettää selaimelle dataa ilman uutta pyyntöä selaimelta. Rekisteröityminen tapahtuu sivulla olevan Javascriptin avulla, jonka jälkeen Javascriptiä käytetään myös palvelimelta tulevan tiedon käsittelyyn.



  Spring tarjoaa komponentit Websockettien käyttöön. Määritellään ensin riippuvuudet projekteihin `spring-boot-starter-websocket` ja `spring-messaging`, jonka jälkeen luodaan tarvittavat konfiguraatiotiedostot.


```xml
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-websocket&lt;/artifactId&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework&lt;/groupId&gt;
    &lt;artifactId&gt;spring-messaging&lt;/artifactId&gt;
&lt;/dependency&gt;```

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // osoite, johon selain ottaa yhteyttä rekisteröityäkseen
        registry.addEndpoint("/register").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // osoite, jonka alla websocket-kommunikaatio tapahtuu
        registry.setApplicationDestinationPrefixes("/ws");
        // osoite, jonka kautta viestit kuljetetaan
        registry.enableSimpleBroker("/channel");
    }
}```


  Ylläolevan konfiguraation oleellisimmat osat ovat annotaatio `@EnableWebSocketMessageBroker`, joka mahdollistaa websocketien käytön sekä luo viestinvälittäjän. Konfiguraation osa `registry.enableSimpleBroker("/channel");` luo polun, jota pitkin vastaukset lähetetään käyttäjälle ja `registry.setApplicationDestinationPrefixes("/ws");` kertoo että sovelluksen polkuun `/ws` päätyvät viestit ohjataan viestinvälittäjälle. Näiden lisäksi rivi `registry.addEndpoint("/register").withSockJS();` määrittelee <a href="http://en.wikipedia.org/wiki/Streaming_Text_Oriented_Messaging_Protocol" target="_blank">STOMP</a>-protokollalle osoitteen, mitä kautta palveluun voi rekisteröityä. Tässä lisäksi määritellään <a href="https://github.com/sockjs" target="_blank">SockJS</a> fallback-tuki, jota käytetään jos käyttäjän selain ei tue Websocketteja.



  Selainpuolella käyttäjä tarvitsee sekä SockJS- että StompJS-kirjastot. Hyödynnämme <a href="http://en.wikipedia.org/wiki/Content_delivery_network" target="_blank">CDN</a>-verkostoja, jotka tarjoavat staattista sisältöä sivuille ilman tarvetta niiden omalla palvelimella säilyttämiselle. Esimerkiksi <a href="http://cdnjs.com/" target="_blank">CDNJS</a>-palvelu ehdottaa edellämainituille kirjastoille olemassaolevia osoitteita -- kirjastot voi luononllisesti pitää myös osana omaa sovellusta.



  Kokonaisuudessaan selainpuolen toiminnallisuus on esimerkiksi seuraava -- alla body-elementin sisältö:


```xml
&lt;p&gt;&lt;input type="button" onclick="send();" value="Say Wut!"/&gt;&lt;/p&gt;

&lt;script src="//cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.1/sockjs.min.js"&gt;&lt;/script&gt;
&lt;script src="//cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"&gt;&lt;/script&gt;

&lt;script&gt;
// luodaan asiakasohjelmisto, joka rekisteröityy osoitteeseen "/register"
var client = Stomp.over(new SockJS('/register'));

// kun käyttäjä painaa sivulla olevaa nappia, lähetetään osoitteeseen
// "/ws/messages" viesti "hello world!"
function send() {
    client.send("/ws/messages", {}, JSON.stringify({'message': 'hello world!'}));
}

// otetaan yhteys sovellukseen ja kuunnellaan "channel"-nimistä kanavaa
// -- jos kanavalta tulee viesti, näytetään JavaScript-alert ikkuna
client.connect({}, function (frame) {
    client.subscribe('channel', function (response) {
        alert(response);
    });
});

// kun sivu suljetaan, yritetään sulkea yhteys palvelimelle
window.onbeforeunload = function () {
    client.disconnect();
}
&lt;/script&gt;```


  Palvelinpuolella ohjelmistomme toimii esimerkiksi seuraavasti. Kuunnellaan osoitteeseen `/ws/messages`-tulevia pyyntöjä -- allaoleva esimerkki yrittää muuntaa automaattisesti pyynnössä tulevan JSON-datan `Message`-olioksi. Toisin kuin aiemmin, käytämme nyt `@MessageMapping`-annotaatiota, joka on viestinvälityksen vastine `@RequestMapping`-annotaatiolle.


```java
@Controller
public class MessageController {

    // koska konfiguraatiossa määritelty "/ws"-juuripoluksi, vastaanottaa
    // tämä kontrollerimetodi osoitteeseen /ws/messages tulevat viestit
    @MessageMapping("/messages")
    public void handleMessage(Message message) throws Exception {
        // tee jotain
    }
}```


  Voimme lisäksi toteuttaa esimerkiksi palvelun, joka lähettää viestejä <em>kaikille</em> tiettyyn polkuun rekisteröityneille käyttäjille. Allaoleva palvelu lähettää viestin kerran kymmenessä sekunnissa.


```java
@Service
public class MessageService {

    @Autowired
    private SimpMessagingTemplate template;

    @Scheduled(fixedDelay = 10000)
    public void addMessage() {
        Message message = new Message();
        // aseta viestin sisältö
        this.template.convertAndSend("/vastauskanava", message);
    }
}
```


  Yllä käytetty <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/messaging/simp/SimpMessagingTemplate.html" target="_blank">SimpMessagingTemplate</a> on hieman kuin aiemmin käyttämämme RestTemplate, mutta eri käyttötarkoitukseen.





<programming-exercise name='Chat 2010' } do %>


    Tutustu osoitteessa <a href="http://spring.io/guides/gs/messaging-stomp-websocket/" target="_blank">http://spring.io/guides/gs/messaging-stomp-websocket/</a> olevaan oppaaseen.



    Tehtävässä on hahmoteltu chat-palvelua, jossa käyttäjä voi kirjautuessaan valita kanavan, mihin hän kirjoittaa viestejä. Tehtävään on hahmoteltu yksinkertainen kirjautuminen sekä käyttöliittymä, missä on toiminnallisuus yhteyden ottamiseen palvelimelle. Oletuskanavalla on myös jo yksi käyttäjä, joka lähettelee kanavalle viestejä.



    Tutustu sovelluksen toimintaan, ja lisää sovellukseen uusi viestejä lähettävä palvelu. Palvelun tulee lähettää viestejä ajoittain kanavalle.


<% end %>


<programming-exercise name='WebFlux Workshop' } do %>


    Osoitteessa <a href="https://bclozel.github.io/webflux-workshop/" target="_blank">https://bclozel.github.io/webflux-workshop/</a> on opas reaktiivisen web-sovelluksen kehittämiseen.



    Käy opas läpi ja toteuta se tehtäväpohjaan. Kun olet valmis, palauta tehtävä TMC:lle.



<% end %>



# jemma


##
  Tiedon tallentaminen
<% end %>


  Sovelluksemme -- vaikka huikeita ovatkin -- ovat melko alkeellisia, sillä sovelluksissa käsiteltävää tietoa ei tallenneta mihinkään. Esimerkiksi lomakkeen avulla sovellukselle lähetettävä data katoaa kun sovellus käynnistetään uudestaan. Tämä ei ole kivaa.



  Tietokannat ovat palvelinohjelmistosta erillisiä sovelluksia, joiden ensisijainen tehtävä on varmistaa, että käytettävä tieto ei katoa. Otetaan ensiaskeleet tietokannan käyttöön web-palvelinohjelmistoissa -- tutustumme tietokantoihin tarkemmin myöhemmin kurssilla. Käytämme tietokantatoiminnallisuuden toteuttamisessa <a href="http://projects.spring.io/spring-data-jpa/" target="_blank">Spring Data JPA</a>-komponenttia, johon löytyy myös aloituspaketti käyttämästämme Spring Bootista.


<aside class="info">

  <br/>

  <h1>Spring Data JPA:n käyttöönotto</h1>

  Saadaksemme Spring Data JPA:n käyttöömme, tulee meidän lisätä se `pom.xml`-tiedostoon. Spring Bootin kautta löytyy näppärä paketti `spring-boot-starter-data-jpa`, joka vähentää yksittäisten riippuvuuksien lisäämistä. Tämän lisäksi tarvitsemme testikäyttöön sopivan tietokannan -- valitaan <a href="http://www.h2database.com/" target="_blank">H2 Database</a>, jonka voi ladata muistiin sovelluksen käynnistyessä.

  Lisätään projektiin seuraavat riippuvuudet:

  ```xml
    &lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-data-jpa&lt;/artifactId&gt;
    &lt;/dependency&gt;
    &lt;dependency&gt;
    &lt;groupId&gt;com.h2database&lt;/groupId&gt;
    &lt;artifactId&gt;h2&lt;/artifactId&gt;
    &lt;/dependency&gt;
  ```


    Kun projektin riippuvuudet noudetaan Mavenin avulla, on tietokanta valmis testikäyttöön.


</aside>


<h3>Tietokantaan tallennettavat oliot eli entiteetit</h3>


  Käytämme ORM-kirjastoa (object relational mapping), jonka tehtävänä on muuntaa oliot tietokantaan tallennettavaan muotoon. Karkeasti ajatellen luokka vastaa tietokantataulua ja oliomuuttujat vastaavat tietokannan sarakkeita. Jokainen taulun rivi vastaa yhtä luokasta tehtyä oliota.



  Luokat, joista tehdyt oliot voidaan tallentaa tietokantaan, tulee annotoida `@Entity`-annotaatiolla. Tämän lisäksi luokille tulee määritellä tunnuskenttä, jonka avulla niihin liittyvät oliot voidaan yksilöidä. Voimme käyttää tunnuskentän luomiseen valmista `AbstractPersistable`-yliluokkaa, jota perittäessä kerromme uniikin tunnuksen tyypin. Esimerkiksi `Henkilo`-luokasta voidaan tehdä tietokantaan tallennettava seuraavilla muutoksilla.


```java
  package wad.domain;

  import javax.persistence.Entity;
  import org.springframework.data.jpa.domain.AbstractPersistable;

  @Entity
  public class Henkilo extends AbstractPersistable&lt;Long&gt; {

  private String nimi;

  public String getNimi() {
  return this.nimi;
  }

  public void setNimi(String nimi) {
  this.nimi = nimi;
  }
  }```


  Kun käytössämme on tietokantaan tallennettava luokka, voimme luoda tietokannan käsittelyyn käytettävän <em>rajapinnan</em>. Kutsutaan tätä rajapintaoliota nimellä `HenkiloRepository`.


```java
  // pakkaus

  import wad.domain.Henkilo;
  import org.springframework.data.jpa.repository.JpaRepository;

  public interface HenkiloRepository extends JpaRepository&lt;Henkilo, Long&gt; {

  }```


  Rajapinta perii Spring Data-projektin `JpaRepository`-rajapinnan; samalla kerromme, että tallennettava olio on tyyppiä `Henkilo` ja että tallennettavan olion tunnus on `Long`-tyyppiä. Tämä tyyppi on sama kuin aiemmin `AbstractPersistable`-luokan perinnässä parametriksi asetettu tyyppi. Spring osaa käynnistyessään etsiä mm. JpaRepository-rajapintaluokan periviä luokkia. Jos niitä löytyy, se luo niiden pohjalta tietokannan käsittelyyn sopivan olion sekä asettaa olion ohjelmoijan haluamiin muuttujiin.



  Nämä muuttujat tulee määritellä `@Autowired`-annotaatiolla -- jokaiselle muuttujalle tulee oma annotaatio -- palaamme myöhemmin kurssilla tarkemmin tähän ns. olioiden automaattiseen asettamiseen.



  Kun olemme luoneet rajapinnan `HenkiloRepository`, voimme lisätä sen käyttöömme esimerkiksi kontrolleriluokkaan. Tämä tapahtuu seuraavasti.


```java
  // ...

  @Controller
  public class HenkiloController {

  @Autowired
  private HenkiloRepository henkiloRepository;

  // ...
  }```


  Nyt tietokantaan pääsee käsiksi `HenkiloRepository`-olion kautta. Osoitteessa <a href="http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html" target="_blank">http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html</a> on JpaRepository-rajapinnan API-kuvaus, mistä löytyy rajapinnan tarjoamien metodien kuvauksia. Voimme esimerkiksi toteuttaa tietokannassa olevien olioiden listauksen sekä yksittäisen olion haun seuraavasti:


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
  public String get(Model model, @PathVariable Long id) {
  model.addAttribute("henkilo", henkiloRepository.findOne(id));
  return "henkilo"; // erillinen henkilo.html
  }
  }
```


  <div class="tehtava" id="t-hellodatabase">

    <header>
      <h1>
        <a data-toggle="collapse" class="collapsed" href="#t-hellodatabase">
          Hello Database
        </a>
      </h1>
    </header>

    <div id="t-hellodatabase" class="collapse">

      Tässä tehtävässä on valmiiksi toteutettuna tietokantatoiminnallisuus sekä esineiden noutaminen tietokannasta. Lisää sovellukseen toiminnallisuus, jonka avulla esineiden tallentaminen tietokantaan onnistuu valmiiksi määritellyllä lomakkeella.

      Alla esimerkki sovelluksesta kun tietokantaan on lisätty muutama rivi:

      <img class="browser-img" src="img/2016-mooc/ex15.png"/>

    </div>
  </div>
</div>


  <div class="tehtava" id="t-tododatabase">

    <header>
      <h1>
        <a data-toggle="collapse" class="collapsed" href="#t-tododatabase">
          Todo Database
        </a>
      </h1>
    </header>

    <div id="t-tododatabase" class="collapse">

      Luo tässä TodoApplication-tehtävässä nähty tehtävien hallintaan tarkoitettu toiminnallisuus mutta siten, että tehtävät tallennetaan tietokantaan. Tässä tehtävässä entiteettiluokan nimen tulee olla `Item` ja avaimen tyypin tulee olla `Long`: ```java
	@Entity
	public class Item extends AbstractPersistable&lt;Long&gt; {
	...```
      Noudata lisäksi HTML-sivujen rakennetta ja toiminnallisuutta.

    </div>
  </div>
</div>



#
  Ohjelma ja lähdekoodi


```java
  System.out.println("Hei maailma");
```

##
  Ohjelmarunko


```java
  public class Esimerkki {
  public static void main(String[] args) {

  // Tänne kirjoitetaan ohjelman käyttämät lauseet
  System.out.println("Tulostettava teksti");

  }
  }
```



<text-box variant='hint' name='Ohjelmoinnin aloittaminen' } do %>


    Ohjelmoinnin aloittamiseen tarvitset seuraavat asiat.


* Käyttäjätunnuksen kurssilla käytettyyn TMC-järjestelmään (käytä käyttäjätunnuksena opiskelijanumeroasi).
* Javan (Java JDK).
* NetBeans with TMC-ohjelmointiympäristön.




    Edellisten tekemiseen ja asentamiseen löytyy ohjeet kurssin Johdannosta.



    Seuraavalla videolla näytetään miten tehtävien tekeminen ja palauttaminen NetBeansilla ja TMC:llä tapahtuu. Video perustuu hieman aiempaan kurssiin, joten tehtävä ei ole täysin identtinen nykyisen kurssin ensimmäisen tehtävän kanssa.



    Toisin kuin videolla, tällä kurssilla palvelimen osoite on `https://tmc.mooc.fi/org/mooc/courses/436` ja kurssin nimi on `Web-palvelinohjelmointi Java 2019`.


  <iframe width="420" height="315" src="//www.youtube.com/embed/sQYq2LISMRU" frameborder="0" allowfullscreen=""></iframe>

<% end %>


<programming-exercise name='Ada Lovelace' } do %>



    Tehtäväpohjassa on seuraavanlainen ohjelmarunko:


  ```java
    public class Nimi {

    public static void main(String[] args) {
    // Kirjoita ohjelmasi tähän alle

    }
    }
  ```


    Rivi "// Kirjoita ohjelmasi tähän alle" on <em>kommenttirivi</em>, jota tietokone ei ota huomioon ohjelmaa suoritettaessa. Lisää kommenttirivin alle lause, joka tulostaa merkkijonon "Ada Lovelace" ja suorita ohjelma. Ohjelman tulostuksen tulee olla seuraavanlainen:


  <sample-output>
    Ada Lovelace
  <% end %>


    Kun olet tehnyt tehtävän ja huomaat, että ohjelma tulostaa halutun merkkijonon, palauta tehtävä TMC:lle. Tutustu tämän jälkeen halutessasi lisää <a href="https://en.wikipedia.org/wiki/Ada_Lovelace" target="_blank" rel="noopener">Ada Lovelaceen</a>, joka oli yksi ensimmäisistä ohjelmoijista.


<% end %>






TODO:

3 - ajan tallentaminen tietokantaan
3 - tulosten hakeminen ja ryhmittely
3 - omien kyselyiden kirjoittaminen
3 - binääritiedon tallentaminen tietokantaan
3 - flyway
3 - import data

3 - konffit
    logit
