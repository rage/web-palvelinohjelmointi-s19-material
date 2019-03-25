---
path: '/osa-4/4-sovellusten-testaaminen'
title: 'Sovellusten testaaminen'
hidden: true
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- TODO

</text-box>


Sovellusten testaaminen helpottaa sekä kehitystyötä että tulevaa ylläpitotyötä. Testaaminen voidaan karkeasti jakaa kolmeen osaan: yksikkötestaukseen, integraatiotestaukseen ja järjestelmätestaukseen. Tämän lisäksi on mm. myös käytettävyys- ja tietoturvatestaus, joita emme tässä käsittele tarkemmin.

Yksikkötestauksessa tarkastellaan sovellukseen kuuluvia yksittäisiä komponentteja ja varmistetaan että niiden tarjoamat rajapinnat toimivat tarkoitetulla tavalla. Integraatiotestauksessa pyritään varmistamaan, että komponentit toimivat yhdessä kuten niiden pitäisi. Järjestelmätestauksessa varmistetaan, että järjestelmä toimii vaatimusten mukaan järjestelmän käyttäjille tarjotun rajapinnan (esim. selain) kautta.

Kaikkien kolmen testaustyypin automaatioon löytyy Springistä välineitä. Tarkastellaan näitä seuraavaksi.


### Yksikkötestaus


Yksikkötestauksella tarkoitetaan lähdekoodiin kuuluvien yksittäisten osien testausta. Termi yksikkö viittaa ohjelman pienimpiin mahdollisiin testattaviin toiminnallisuuksiin, kuten olion tarjoamiin metodeihin. Seuratessamme <a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank">single responsibility principleä</a>, jokaisella oliolla ja metodilla on yksi selkeä vastuu, jota voi myös testata. Testaus tapahtuu yleensä testausohjelmistokehyksen avulla, jolloin luodut testit voidaan suorittaa automaattisesti. Yleisin Javalla käytettävä testauskehys on JUnit, johon on jo tutustuttu pikaisesti kursseilla ohjelmoinnin perusteet (TKT10002) ja ohjelmoinnin jatkokurssi (TKT10003).

Uusia testiluokkia voi luoda NetBeansissa valitsemalla New -> Other -> JUnit -> JUnit Test. Tämän jälkeen NetBeans kysyy testiluokalle nimeä ja pakkausta. Huomaa että lähdekoodit ja testikoodit päätyvät erillisiin kansioihin -- juurin näin sen pitääkin olla. Kun testiluokka on luotu, on projektin rakenne kutakuinkin seuraavanlainen.


```
.
|-- pom.xml
`-- src
  |-- main
  |   |-- java
  |   |   `-- ... oman projektin koodit
  |   |-- resources
  |       `-- ... resurssit, mm. konfiguraatio ja thymeleafin templatet
  |
  `-- test
      `-- java
          `-- ... testikoodit!
```


Kurssin tehtäväpohjissa JUnit-testikirjasto on valmiina mukana. Yksikkötestauksesta JUnit-kirjaston avulla löytyy ohjeistusta aiemmin käydyiltä ohjelmointikursseilta TKT10002 ja TKT10003 sekä kursseilta Ohjelmistotekniikan menetelmät (TKT-20002) ja Ohjelmistotuotanto (TKT-20006).


### Integraatiotestaus

Spring tarjoaa `spring-boot-starter-test`-kirjaston, jonka avulla JUnit-kirjasto saa `@Autowired`-annotaatiot toimimaan. Tämän avulla voimme injektoida testimetodille esimerkiksi repository-rajapinnan toteuttavan olion sekä testata sen tarjoamien metodien toimintaa. Testattava palvelu voi hyödyntää muita komponentteja, jolloin testauksen kohteena on kokonaisuuden toiminta yhdessä.

Käytetyn riippuvuuden versio liittyy Spring Boot -projektin versioon, eikä sitä tarvitse määritellä tarkemmin.


```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
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


#### Testiprofiili

Edellisessä esimerkissä on toinenkin ongelma. Kun testissä luodaan uudet tilit ja siirretään rahaa niiden välillä, muutokset tapahtuvat oletuksena käytössä olevaan tietokantaan. Tähän asti käytössä on ollut H2-tietokannanhallintajärjestelmän tiedostoon kirjoittava versio. Tämä tarkoittaa sitä, että myös yllä toteutetuissa testeissä on käytössä sama tietokannanhallintajärjestelmä ja testeissä tehtävät muutokset kirjoitetaan tiedostoon, josta ne ovat myös testien ajamisen jälkeen. Tämä ei ole toivottu tilanne.

Luodaan uusi konfiguraatiotiedosto nimeltä `application-test.properties`. Konfiguraatiotiedoston pääte `-test` kertoo Springille, että kyseinen konfiguraatiotiedosto tulee ladata käyttöön mikäli käytössä on profiili `test`.

Määritellään konfiguraatio siten, että tietokantana on muistiin ladattava tietokanta. Tämä onnistuu seuraavasti:

```
spring.datasource.url=jdbc:h2:mem:db;DB_CLOSE_DELAY=-1
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```

Kun lisäämme testit sisältävään lähdekoodiin annotaation `@ActiveProfiles("test")`, käytetään testeissä `test`-profiiliin liittyvää konfiguraatiota.

```java
// importit

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {

  @Autowired
  private BankingService bankingService;

  // jne...
```

Nyt testien käytössä on tietokanta, joka luodaan aina testien käynnistyksen yhteydessä ja poistetaan testien suorituksen jälkeen.


### Järjestelmätestaus


Järjestelmätestauksessa pyritään varmistamaan, että järjestelmä toimii toivotulla tavalla. Järjestelmää testataan saman rajapinnan kautta, kuin mitä sen loppukäyttäjät käyttävät. Järjestelmätestaukseen on monenlaisia työkaluja, joista käsittelemme tässä kahta. Tutustumme ensin integraatiotestauksessa järjestelmätason testaustoiminnallisuuteen, jonka jälkeen tutustumme harjoitustehtävän `FluentLenium`-kirjastoon.


#### MockMvc

Voimme tuoda halutessamme testien käyttöön koko web-sovelluksen kontekstin. Tämä onnistuu <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/web/servlet/MockMvc.html" target="_blank">MockMvc</a>-olion avulla -- MockMvc-olio mahdollistaa pyyntöjen tekemisen sovelluksen tarjoamiin osoitteisiin, pyyntöjen tulosten tarkastelun, sekä pyyntöjen vastauksena tulleen datan tarkastelun. MockMvc-olion käyttö vaatii testeihin ylimääräisen annotaation `@AutoConfigureMockMvc`.


Alla oleva esimerkki käynnistää sovelluksen ja tekee kaksi GET-pyyntöä osoitteeseen `/messages`. Ensimmäinen pyyntö liittyy testiin, missä varmistetaan että vastaus sisältää statuskoodin `200` eli "OK". Toinen pyyntö liittyy testiin, joka tarkistaa tarkistaa että vastauksessa on merkkijono "Awesome".


```java
// muut importit

// mm. mockMvc:n get- ja post-metodit
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class MessagesTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void statusOk() throws Exception {
      mockMvc.perform(get("/messages"))
              .andExpect(status().isOk());
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

Alla ensimmäinen testimetodi varmistaa, että pyynnön käsittelevä kontrolleri lisää model-olioon attribuutin, jonka nimi on "messages". Toisessa haetaan attribuuttiin "messages" liittyvä tietosisältö -- tässä oletetaan, että se sisältää listan `Message`-tyyppisiä olioita.


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

      List<Message> messages = (List) res.getModelAndView().getModel().get("messages");

      // tarkista kokoelma
  }
```


MockMvc:n avulla voi testata käytännössä suurinta osaa palvelinsovellusten toiminnallisuudesta, mutta samalla se tarjoaa pääsyn samaan rajapintaan kuin mitä selain käsitteelee.


<programming-exercise name='Airports and Airplanes Test' tmcname='osa04-Osa04_03.AirportsAndAirplanesTest'>

Muistamme edellisestä osiosta tehtävän, missä tehtiin sovellus lentokoneiden ja lentokenttien hallintaan. Tässä tehtävässä harjoitellaan hieman sekä integraatio- että järjestelmätestausta. Tehtävässä ei ole automaattisia testejä, joilla testattaisiin kirjoittamiasi testejä. Aina kun lisäät yksittäisen testin, voit ajaa testit klikkaamalla projektia oikealla hiirennapilla ja valitsemalla "Test".

Joudut todennäköisesti turvautumaan internetiin tehtävää ratkaistessasi. Pidä kirjaa sivuista, joilta hait apua tehtävän ratkaisemiseen -- tämän sivun lopussa kysytään testaustehtävien ratkaisemiseen käyttämiäsi lähteitä.

Palauttaessasi tehtävän olet tarkistanut, että kirjoittamasi testit toimivat kuten tehtävänannossa on kuvattu.


<h2>AirportServiceTest</h2>


Sovelluksessa on luokka `AirportService`, mikä sijaitsee pakkauksessa `airports`. Sille ei kuitenkaan ole yhtäkään testiä :(

Lisää testikansion (`Test Packages`) pakkaukseen `airports` luokka `AirportServiceTest`.

Lisää luokalle `AirportServiceTest` tarvittavat annotaatiot ja injektoi sinne oliomuuttujiksi `AirportService` ja `AirportRepository` -oliot. Toteuta luokkaan `AirportServiceTest` testimetodit, joiden avulla testataan, että luokan `AirportService` metodit toimivat oikein. Haluat varmistaa että:

- Kun uusi lentokenttä luodaan `AirportService`-luokan metodilla `create`, lentokenttä tallentuu tietokantaan ja tietokannasta löytyy annetuilla lentokenttä annetuilla parametreilla. Tee tälle tarkastukselle oma testimetodi.
- Kun lentokentät haetaan luokan `AirportService` metodilla `list`, metodi palauttaa kaikki tietokannassa olevat lentokentät. Tee tälle tarkastukselle oma testimetodi. Testimetodin alussa kannattaa lisätä tietokantaan muutamia lentokenttiä, jolloin tietokanta ei ole varmasti tyhjä.
- Kun luokan `AirportService` metodilla `create` luodaan jo tietokannassa oleva lentokenttä, ei tietokantaan tule uutta samannimistä lentokenttää. Tee tälle tarkastukselle oma testimetodi. Kun ajat testit, huomaat, että tätä tarkastusta ei ole toteutettu luokan `AirportService` metodiin `create`. Lisää tarkastus myös `create`-metodiin.


<h2>AircraftControllerTest</h2>

Lisää testikansion (`Test Packages`) pakkaukseen `airports` luokka `AircraftControllerTest`. Lisää luokkaan tarvittavat määrittelyt, jotta voit käyttää `MockMvc`-komponenttia testeissä.

Tee seuraavat testit:

- Kun osoitteeseen `/aircrafts` tehdään GET-pyyntö, vastauksen status on 200 (ok) ja vastauksen model-oliossa on parametrit `aircrafts` ja `airports`.
- Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "HA-LOL", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen erillinen kysely tietokantaan esim. `AircraftRepository`:n avulla, ja varmista, että tietokannasta löytyy lentokone, jonka nimi on `HA-LOL`.
- Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "XP-55", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen GET-pyyntö osoitteeseen `/aircrafts`, ja tarkista että pyynnön vastauksena saatavan `model`-olion sisältämässä `"aircrafts"`-listassa on juuri luotu lentokone.

</programming-exercise>



#### FluentLenium


MockMvc:n lisäksi järjestelmätestaukseen käytetään melko paljon käyttöliittymän testaamiseen tarkoitettua <a href="http://www.seleniumhq.org/" target="_blank">Selenium</a>ia ja siihen liittyviä lisäosia kuten <a href="https://fluentlenium.com/" target="_blank">FluentLenium</a>ia. Nämä kirjastot ovat web-selaimen toimintojen automatisointiin tarkoitettuja välineitä, jotka antavat sovelluskehittäjälle mahdollisuuden käydä läpi sovelluksen käyttöliittymää ohjelmallisesti. Kirjastot poikkeavat edellä nähdystä `MockMvc`-oliosta siten, että ne mahdollistavat myös testien ajamisen selaimessa --

<br/>


Lisätään FluentLenium-kirjaston vaatimat riippuvuudet, oletetaan että testit kirjoitetaan JUnit-testikirjaston avulla (FluentLenium tarjoaa myös muita vaihtoehtoja).

```xml
<dependency>
    <groupId>org.fluentlenium</groupId>
    <artifactId>fluentlenium-junit</artifactId>
    <version>3.7.1</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.fluentlenium</groupId>
    <artifactId>fluentlenium-assertj</artifactId>
    <version>3.7.1</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>htmlunit-driver</artifactId>
</dependency>
```

Oletetaan, että käytössämme on sovellus, joka tarjoaa ilmoittautumismahdollisuuden. Testaamme toiminnallisuutta "Käyttäjä voi ilmoittautua oppitunnille". Järjestelmä tarjoaa sivun, jonka ensimmäinen linkki vie ilmoittautumissivulle. Ilmoittautumissivulla tulee olla tietty otsikko -- varmistamme, että olemme oikealla sivulla. Tämän lisäksi ilmoittautumissivulla on lomakekenttä, jonka attribuutin `id` arvo on `name`. Täytetään kenttään arvo "Bob" ja lähetetään lomake. Tämän jälkeen sivulla tulee olla teksti "Ilmoittautuminen onnistui!".

```java
// importit

@ActiveProfiles("test")
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

Yllä annotaatio `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)` käynnistää palvelimen integraatiotestausta varten satunnaisessa portissa. Sovelluksen portti saadaan muuttujaan `port` annotaation `@LocalServerPort` avulla.

Yllä menemme ensin paikalliseen osoitteeseen `http://localhost:*portti*`, missä portin numero on satunnaisesti valittu -- surffaamme siis haluttuun osoitteeseen. Haemme tämän jälkeen ensimmäisen linkin, eli `a`-elementin sivulta, ja klikkaamme sitä. Tämän jälkeen tarkistamme, että sivun otsake on `Ilmoittautuminen`. Tätä seuraa kentän, jonka id-attribuutin arvo on "name" täyttäminen merkkijonolla "Bob"  -- tietyn kentän hakeminen onnistuu `find`-metodilla, jolle annetaan parametrina kentän tiedot: jos kentällä on attribuutti `id`, voidaan se tunnistaa testeissä merkkijonolla `#idattribuutinarvo` eli risuaidalla '#', jota seuraa kentän attribuutin `id` arvo.

Lopulta lomake lähetetään. Kun lomake on lähetetty, haetaan sivun lähdekoodista tekstiä "Ilmoittautuminen onnistui!". Jos tekstiä ei löydy, testi epäonnistuu.

FluentLenium-kirjastoon liittyvää dokumentaatiota löytyy osoitteesta <a href="http://www.fluentlenium.org/" target="_blank">http://www.fluentlenium.org/</a>, jonka lisäksi googlesta löytyy apua seuraavaan tehtävään.


<programming-exercise name='Movie Database Redux'>

Tehtäväpohjassa on sovellus elokuvien ja näyttelijöiden hallintaan. Tässä tehtävässä harjoitellaan hieman järjestelmätestausta FluentLeniumin avulla. Kuten edellisessä tehtävässä, tässäkään tehtävässä ei ole automaattisia testejä vaan tehtävänäsi on toteuttaa ne.

Joudut todennäköisesti turvautumaan internetiin tehtävää ratkaistessasi. Pidä kirjaa sivuista, joilta hait apua tehtävän ratkaisemiseen -- tämän sivun lopussa kysytään testaustehtävien ratkaisemiseen käyttämiäsi lähteitä.

<h2>Näyttelijän lisääminen ja poistaminen</h2>


Luo testikansioon `movies` testiluokka `ActorTest`, johon asetat Fluentlenium-testaamiseen tarvittavat komponentit.


Toteuta luokkaan testi, jossa tehdään seuraavat askeleet:


1. Mennään näyttelijäsivulle
2. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
3. Etsitään kenttä, jonka id on "name" ja asetetaan kenttään teksti "Uuno Turhapuro".
4. Lähetetään lomake.
5. Tarkistetaan että sivulla on teksti "Uuno Turhapuro"
6. Klikataan "Uuno Turhapuro"on liittyvää poista-nappia
7. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"



<h2>Elokuvan lisääminen ja näyttelijän lisääminen elokuvaan</h2>


Luo testikansioon `movies` testiluokka `MovieTest`, johon asetat Selenium-testaamiseen tarvittavat komponentit.

Toteuta luokkaan testi, jossa tehdään seuraavat askeleet:


1. Mennään elokuvasivulle
2. Tarkistetaan ettei sivulla ole tekstiä "Uuno Epsanjassa"
3. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
4. Etsitään kenttä, jonka id on "name" ja lisätään siihen arvo "Uuno Epsanjassa"
5. Etsitään kenttä, jonka id on "lengthInMinutes" ja lisätään siihen arvo "92"
6. Lähetetään lomake
7. Tarkistetaan että sivulla on teksti "Uuno Epsanjassa"
8. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
9. Mennään näyttelijäsivulle
10. Tarkistetaan ettei sivulla ole tekstiä "Uuno Turhapuro"
11. Etsitään kenttä, jonka id on "name" ja asetetaan kenttään teksti "Uuno Turhapuro"
12. Lähetetään lomake
13. Tarkistetaan että sivulla on teksti "Uuno Turhapuro"
14. Etsitään linkki, jossa on teksti "Uuno Turhapuro" ja klikataan sitä
15. Etsitään nappi, jonka id on "add-to-movie" ja klikataan sitä.
16. Mennään elokuvasivulle
17. Tarkistetaan että sivulla on teksti "Uuno Epsanjassa"
18. Tarkistetaan että sivulla on teksti "Uuno Turhapuro"


</programming-exercise>


<quiznator id='5c98ee47ddb6b814af32ab0d'></quiznator>
