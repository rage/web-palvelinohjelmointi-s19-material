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


Yksikkötestauksella tarkoitetaan lähdekoodiin kuuluvien yksittäisten osien testausta. Termi yksikkö viittaa ohjelman pienimpiin mahdollisiin testattaviin toiminnallisuuksiin, kuten olion tarjoamiin metodeihin. Seuratessamme <a href="https://en.wikipedia.org/wiki/Single_responsibility_principle" target="_blank">single responsibility principle</a>ä, jokaisella oliolla ja metodilla on yksi selkeä vastuu, jota voi myös testata. Testaus tapahtuu yleensä testausohjelmistokehyksen avulla, jolloin luodut testit voidaan suorittaa automaattisesti. Yleisin Javalla käytettävä testauskehys on JUnit, jonka saa käyttöön lisäämällä siihen liittyvän riippuvuuden `pom.xml`-tiedostoon.

<br/>


```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
</dependency>
```


Yksittäisen riippuvuuden määre `scope` kertoo milloin riippuvuutta tarvitaan. Määrittelemällä `scope`-elementin arvoksi `test` on riippuvuudet käytössä vain testejä ajettaessa. Uusia testiluokkia voi luoda NetBeansissa valitsemalla New -> Other -> JUnit -> JUnit Test. Tämän jälkeen NetBeans kysyy testiluokalle nimeä ja pakkausta. Huomaa että lähdekoodit ja testikoodit päätyvät erillisiin kansioihin -- juurin näin sen pitääkin olla. Kun testiluokka on luotu, on projektin rakenne kutakuinkin seuraavanlainen.


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


Tehtäväpohjissa JUnit-testikirjasto on valmiina mukana. Yksikkötestauksesta JUnit-kirjaston avulla löytyy ohjeistusta aiemmin käydyiltä ohjelmointikursseilta sekä kursseilta Ohjelmistotekniikan menetelmät (TKT-20002) ja Ohjelmistotuotanto (TKT-20006).


### Integraatiotestaus

Spring tarjoaa `spring-test`-kirjaston, jonka avulla JUnit-kirjasto saa `@Autowired`-annotaatiot toimimaan. Tämän kautta pääsemme tilanteeseen, missä voimme injektoida testimetodille esimerkiksi repository-rajapinnan toteuttavan olion sekä testata sen tarjoamien metodien toimintaa. Testattava palvelu voi hyödyntää muita komponentteja, jolloin testauksen kohteena on kokonaisuuden toiminta yhdessä.


Spring test-komponentista on olemassa Spring Boot -projekti, jonka voimme ottaa käyttöömme lisäämällä seuraavan riippuvuuden pom.xml-tiedostoon. Käytetyn riippuvuuden versio liittyy Spring Boot -projektin versioon, eikä sitä tarvitse määritellä tarkemmin.


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

Edellisessä esimerkissä on myös toinenkin ongelma. Kun testissä luodaan uudet tilit ja siirretään rahaa niiden välillä, muutokset tapahtuvat oletuksena käytössä olevaan tietokantaan. Tähän asti käytössämme olevissa sovelluksissa käytössä on ollut H2-tietokannanhallintajärjestelmän tiedostoon kirjoittava versio. Tämä tarkoittaa sitä, että myös yllä toteutetuissa testeissä on käytössä sama tietokannanhallintajärjestelmä. Tämä ei ole toivottu tilanne.

Luodaan uusi konfiguraatiotiedosto nimeltä `application-test.properties`. Konfiguraatiotiedoston pääte `-test` kertoo Springille, että kyseinen konfiguraatiotiedosto tulee ladata käyttöön mikäli käytössä on profiili `test`.

Määritellään konfiguraatio siten, että tietokantana on muistiin ladattava tietokanta. Tämä onnistuu seuraavasti:

```
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


Järjestelmätestauksessa pyritään varmistamaan, että järjestelmä toimii toivotulla tavalla. Järjestelmää testataan saman rajapinnan kautta, kuin mitä sen loppukäyttäjät käyttävät. Järjestelmätestaukseen on monenlaisia työkaluja, joista käsittelemme tässä kahta. Tutustumme ensin integraatiotestauksessa käytetyn `spring-test`-komponenttiin järjestelmätason testaustoiminnallisuuteen, jonka jälkeen tutustumme harjoitustehtävän kautta `Selenium` ja `FluentLenium` -kirjastoihin.


#### MockMvc

Springin tarjoama `spring-test` tarjoaa tuen järjestelmätestaamiseen. Annotaatiolla `@SpringBootTest` testeillä on käytössä myös web-sovelluksen konteksti, jonka avulla voidaan luoda <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/test/web/servlet/MockMvc.html" target="_blank">MockMvc</a>-olio. MockMvc-oliolla pystymme tekemään pyyntöjä sovelluksen tarjoamiin osoitteisiin, tarkistelemaan pyyntöjen onnistumista, sekä tarkastelemaan vastauksena saatua dataa.


TODO: määrittele siten, että mockmvc automaattisesti käytössä

Alla oleva esimerkki käynnistää sovelluksen ja tekee kolme GET-pyyntöä osoitteeseen `/messages`. Ensimmäinen pyyntö liittyy testiin, missä varmistetaan että vastaus on sisältää statuskoodin `200` eli "OK", toinen pyyntö liittyy testiin joka varmistaa että vastauksen tyyppi on JSON-muotoista dataa, ja kolmas pyyntö tarkistaa että vastauksessa on merkkijono "Awesome". Alun `setUp`-metodi luo `MockMvc`-olion injektoidun palveinkontekstin perusteella.


```java
// muut importit

// mm. mockMvc:n get- ja post-metodit
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
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

      Collection<Message> messages = (Collection) res.getModelAndView().getModel().get("messages");

      // tarkista kokoelma
  }
```


MockMvc:n avulla voi testata käytännössä suurinta osaa palvelinsovellusten toiminnallisuudesta, mutta samalla se tarjoaa pääsyn samaan rajapintaan kuin mitä selain käsitteelee.




<programming-exercise name='Airports and Airplanes Redux'>

Muistamme edellisestä osiosta tehtävän, missä tehtiin sovellus lentokoneiden ja lentokenttien hallintaan. Tässä tehtävässä harjoitellaan hieman sekä integraatio- että järjestelmätestausta.

Huom! Tässä tehtävässä ei ole automaattisia testejä, joilla testattaisiin kirjoittamiasi testejä. Palauttaessasi tehtävän olet tarkistanut, että kirjoittamasi testit toimivat kuten tehtävänannossa on kuvattu.


<h2>AirportServiceTest</h2>


Sovelluksessa on luokka `AirportService`, mikä sijaitsee pakkauksessa `wad.service`. Sille ei kuitenkaan ole yhtäkään testiä :(

Lisää testikansioon (`Test Packages`) pakkaus `wad.service`, ja luo sinne luokka `AirportServiceTest`.

Lisää luokalle tarvittavat annotaatiot sekä oliomuuttujat, ja toteuta luokalle testimetodit, joiden avulla testataan että haluttu lentokone todellakin lisätään lentokentälle. Haluat ainakin tietää että:

- Kun lentokone on lisätty lentokentälle, tietokannasta samalla tunnuksella haettavalla lentokoneella on asetettu lentokenttä, ja se on juuri se lentokenttä mihin kone on lisätty.
- Kun lentokone on lisätty lentokentälle, lentokentältä löytyy myös kyseinen kone.
- Kun lentokone on lisätty yhdelle lentokentälle, se ei ole muilla lentokentillä.
- Lentokoneen lisääminen samalle lentokentälle useasti ei johda siihen, että lentokenttä sisältää saman koneen monta kertaa.

Aina kun lisäät yksittäisen testin, voit ajaa testit klikkaamalla projektia oikealla hiirennapilla ja valitsemalla "Test".


<h2>AircraftControllerTest</h2>


Luo testikansioon pakkaus `wad.controller` ja lisää sinne luokka `AircraftControllerTest`. Lisää luokkaan tarvittavat määrittelyt, jotta voit käyttää `MockMvc`-komponenttia testeissä.

Tee seuraavat testit:

- Kun osoitteeseen `/aircrafts` tehdään GET-pyyntö, vastauksen status on 200 (ok) ja vastauksen model-oliossa on parametrit `aircrafts` ja `airports`.
- Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "HA-LOL", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen erillinen kysely tietokantaan esim. `AircraftRepository`:n avulla, ja varmista, että tietokannasta löytyy lentokone, jonka nimi on `HA-LOL`.
- Kun osoitteeseen `/aircrafts` tehdään POST-pyyntö, jonka parametriksi annetaan `name`-kenttä, jonka arvona on "XP-55", pyynnön vastaukseksi tulee uudelleenohjaus. Tee tämän jälkeen GET-pyyntö osoitteeseen `/aircrafts`, ja tarkista että pyynnön vastauksena saatavan `model`-olion sisältämässä `"aircrafts"`-listassa on juuri luotu lentokone.


Tässäkin tehtävässä, aina kun lisäät yksittäisen testin, voit ajaa testit klikkaamalla projektia oikealla hiirennapilla ja valitsemalla "Test".

</programming-exercise>



### FluentLenium


MockMvc:n lisäksi järjestelmätestaukseen käytetään melko paljon käyttöliittymän testaamiseen tarkoitettua <a href="http://www.seleniumhq.org/" target="_blank">Selenium</a>ia ja siihen liittyviä lisäosia kuten <a href="https://github.com/FluentLenium/FluentLenium" target="_blank">FluentLenium</a>. Käytännössä edellämainitut ovat web-selaimen toimintojen automatisointiin tarkoitettuja välineitä, jotka antavat sovelluskehittäjälle mahdollisuuden käydä läpi sovelluksen käyttöliittymää ohjelmallisesti.


Lisätään FluentLenium-kirjaston vaatimat riippuvuudet, oletetaan että testit kirjoitetaan JUnit-testikirjaston avulla (FluentLenium tarjoaa myös muita vaihtoehtoja).

```xml
<dependency>
  <groupId>org.fluentlenium</groupId>
  <artifactId>fluentlenium-core</artifactId>
  <version>3.4.1</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.fluentlenium</groupId>
  <artifactId>fluentlenium-junit</artifactId>
  <version>3.4.1</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.fluentlenium</groupId>
  <artifactId>fluentlenium-assertj</artifactId>
  <version>3.4.1</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.seleniumhq.selenium</groupId>
  <artifactId>htmlunit-driver</artifactId>
</dependency>
```


Ajatellaan loppukäyttäjän haluamaa toiminnallisuutta "Käyttäjä voi ilmoittautua oppitunnille". Järjestelmä tarjoaa sivun, jonka ensimmäinen linkki vie ilmoittautumissivulle. Ilmoittautumissivulla tulee olla tietty otsikko -- varmistamme, että olemme oikealla sivulla. Tämän lisäksi ilmoittautumissivulla on lomakekenttä, jonka attribuutin `id` arvo on `name`. Jos kentällä on attribuutti `id`, voidaan se valita kirjoittamalla `#kentannimi`. Täytetään kenttään arvo "Bob" ja lähetetään lomake. Tämän jälkeen sivulla tulee olla teksti "Ilmoittautuminen onnistui!".


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

Yllä annotaatio `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)` käynnistää palvelimen integraatiotestausta satunnaisessa portissa, joka saadaan muuttujaan `port` annotaation `@LocalServerPort` avulla.


Yllä menemme ensin paikalliseen osoitteeseen `http://localhost:*portti*`, missä portin numero on satunnaisesti valittu -- surffaamme siis haluttuun osoitteeseen. Haemme tämän jälkeen ensimmäisen linkin, eli `a`-elementin sivulta, ja klikkaamme sitä. Tämän jälkeen tarkistamme, että sivun otsake on `Ilmoittautuminen`. Tätä seuraa kentän, jonka id on "name" täyttäminen "Bob"-merkkijonolla, jonka jälkeen lomake lähetetään. Kun lomake on lähetetty, haetaan sivun lähdekoodista tekstiä "Ilmoittautuminen onnistui!". Jos tekstiä ei löydy, testi epäonnistuu.


FluentLenium-kirjastoon liittyvää dokumentaatiota löytyy osoitteesta <a href="http://www.fluentlenium.org/" target="_blank">http://www.fluentlenium.org/</a>, jonka lisäksi googlesta löytyy apua seuraavaan tehtävään.


<programming-exercise name='Movie Database Redux'>

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


</programming-exercise>
