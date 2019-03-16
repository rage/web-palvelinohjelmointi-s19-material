---
path: '/osa-3/1-useampi-tietokantataulu'
title: 'Useampi tietokantataulu ja taulujen väliset viitteet'
hidden: true
---

Otimme edellisessä osassa ensiaskeleet tietokantojen käyttöön. Sovelluksemme ovat tähän mennessä luoneet ja käyttäneet yhtä tietokantataulua -- yhden tietokantataulun käyttö vaatii tietokantataulua kuvaavan entiteetin luomisen ja tietokantataulua käsittelevän rajapinnan luomisen.

Edellisessä osassa käsittelimme mm. henkilöä.

```java
// pakkaus ja importit

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
}
```

Yllä oleva määrittely luo tietokantataulun, johon on määritelty sekä pääavain `id` että sarake `nimi`. Sarakkeiden tyypit riippuvat hieman käytetystä tietokannanhallintajärjestelmästä. Käyttämässämme H2-tietokannanhallintajärjestelmässä sarakkeen `id` tyypiksi määritellään oletuksena `BIGINT` ja sarakkeen `nimi` tyypiksi määritellään oletuksena `VARCHAR` -- näiden tarkemmat tiedot löytyy mm. H2-tietokannanhallintajärjestelmän konsolista kun entiteetin sisältävä sovellus on käynnissä.

<img src="../img/h2-konsoli-henkilo.png" alt="Kuva H2-tietokannahallintajärjestelmän konsolista. Kuvassa tietokantataulun Henkilo sisältö.">

Tietokantakaaviona tietokantamme on hyvin suoraviivainen.

<img src="../img/tietokantataulu-henkilo.png" alt="Table Henkilo {  id BIGINT(19)  nimi VARCHAR(255) }">

Tietokannan käsittelyyn käytettävä rajapinta on myös simppeli. Olemme käyttäneet Springin tarjoamaa `JpaRepository`-rajapintaa toteutuksen pohjana, jolloin yksinkertaiset tietokantaoperaatiot ovat olleet valmiina käytössämme.

```java
// pakkaus

import domain.Henkilo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HenkiloRepository extends JpaRepository<Henkilo, Long> {

}
```

Aloitamme nyt useamman tietokantataulun sisältävän sovelluksen toteutuksen ja tarkastelun. Sovelluksen teemana on pankkijärjestelmä.

Sovelluksessamme on henkilöitä, tilejä, pankkeja sekä pankkien konttoreita. Jokaisella henkilöllä on yksi tai useampi tili, ja jokaisella tilillä voi olla yksi tai useampi omistaja. Tili liittyy aina tiettyyn pankkiin ja pankissa voi olla useampia tilejä. Pankilla on konttoreita, ja jokainen konttori liittyy tiettyyn pankkiin.

Pankkijärjestelmämme käsitteet ja niiden yhteydet ovat luokkakaaviossa seuraavat.


<img src="../img/luokkakaavio-pankkijarjestelma.png" alt="[Henkilo|-nimi:String], [Konttori|-osoite:String], [Tili|-saldo:BigDecimal], [Pankki|-nimi:String], [Konttori]*-1[Pankki], [Pankki]1-*[Tili], [Tili]*-*[Henkilo]">

Käytämme tilin saldon näyttämiseen Javan <a href="https://docs.oracle.com/javase/8/docs/api/java/math/BigDecimal.html" target="_blank">BigDecimal</a>-luokkaa.

<br/>

Luokkina käsitteet näyttävät seuraavilta.

```java
public class Konttori {

    private String osoite;
    private Pankki pankki;

}
```
```java
public class Pankki {

    private String nimi;
    private List<Konttori> konttorit = new ArrayList<>();
    private List<Tili> tilit = new ArrayList<>();

}
```
```java
public class Tili {

    private BigDecimal saldo = new BigDecimal(0);
    private Pankki pankki;
    private List<Henkilo> omistajat = new ArrayList<>();

}
```
```java
public class Henkilo {

    private String nimi;
    private List<Tili> tilit = new ArrayList<>();

}
```

Listat on luokissa alustettu ArrayList-tyyppisiksi. Listojen alustaminen tehdään suoraviivaisuuden takia -- emme listoja käytettäessä nyt törmää (niin helposti) `NullPointerException`-vitteeseen. Vastaavasti tilin saldo-muuttujalla on oletusalkuarvona 0.

## Luokista tietokantatauluiksi

Aloitetaan luokkien määrittely tietokantatauluiksi. Muistamme edellisestä osasta, että jokainen tietokantatauluksi muunnettava luokka tulee määritellä `@Entity`-annotaation avulla. Perimme jokaisella luokalla myös luokan `AbstractPersistable`, jolloin annamme vastuun luokasta luotavan tietokantataulun pääavaimen määrittelystä käyttämällemme sovelluskehykselle.

Alla jokaiselle luokalle on em. muunnosten lisäksi määritelty Lombokin vaatimat annotaatiot.


```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Konttori extends AbstractPersistable<Long> {

    private String osoite;
    private Pankki pankki;

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Pankki extends AbstractPersistable<Long> {

    private String nimi;
    private List<Konttori> konttorit = new ArrayList<>();
    private List<Tili> tilit = new ArrayList<>();

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Tili extends AbstractPersistable<Long> {

    private BigDecimal saldo = new BigDecimal(0);
    private Pankki pankki;
    private List<Henkilo> omistajat = new ArrayList<>();

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
    private List<Tili> tilit = new ArrayList<>();

}
```

Tällä hetkellä sovelluksemme ei vielä toimisi, sillä se ei tiedä miten yhteydet tietokantataulujen välillä tulee toteuttaa.


## Yhteydet ja oasllistumisrajoitteet tietokantataulujen välillä

Osallistumisrajoitteet -- yksi moneen (one to many), moni yhteen (many to one), moni moneen (many to many) lisätään annotaatioiden avulla.

Totesimme aiemmin, että jokaisella henkilöllä on yksi tai useampi tili, ja jokaisella tilillä voi olla yksi tai useampi omistaja. Tili liittyy aina tiettyyn pankkiin ja pankissa voi olla useampia tilejä. Pankilla on konttoreita, ja jokainen konttori liittyy tiettyyn pankkiin. Tämä tarkoittaa seuraavaa:

- Henkilöllä ja tilillä on monesta moneen -yhteys.
- Tilillä ja pankilla on monesta yhteen -yhteys. Käänteisesti pankilla ja tilillä on yhdestä moneen -yhteys.
- Pankilla ja konttorilla on yhdestä moneen -yhteys. Käänteisesti konttorilla ja pankilla on monesta yhteen -yhteys.

Näitä yhteyksiä kuvataan annotaatioilla `@ManyToMany`, `@ManyToOne` ja `@OneToMany`.

Lisätään annotaatiot luokkiimme.


```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Konttori extends AbstractPersistable<Long> {

    private String osoite;
    @ManyToOne
    private Pankki pankki;

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Pankki extends AbstractPersistable<Long> {

    private String nimi;
    @OneToMany
    private List<Konttori> konttorit = new ArrayList<>();
    @OneToMany
    private List<Tili> tilit = new ArrayList<>();

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Tili extends AbstractPersistable<Long> {

    private BigDecimal saldo = new BigDecimal(0);
    @ManyToOne
    private Pankki pankki;
    @ManyToMany
    private List<Henkilo> omistajat = new ArrayList<>();

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
    @ManyToMany
    private List<Tili> tilit = new ArrayList<>();

}
```

Yllä olevassa esimerkissä luokat eivät vielä kerro sovelluskehykselle _mihin_ liitos tulee tehdä. Sovelluskehys ei esimerkiksi tiedä, että henkilön tilit kytkeytyvät tilin omistajiin.

Loppusilaus tietokantatauluihimme on `mappedBy`-määreen lisääminen annotaatioihin. Määreellä kerrotaan mihin toisen luokan muuttujaan arvot kytketään ja kuka yhteyden omistaa -- yhteyden omistaa aina `mappedBy`-määreen määrittelemä muuttuja.

Alla olevassa esimerkissä luokan Henkilo muuttuja tilit kytketään luokan Tili muuttujaan omistajat. Vastaavasti luokan Pankki muuttuja konttorit kytketään luokan Konttori muuttujaan pankki, ja luokan pankki muuttuja tilit kytketään luokan Tili muuttujaan pankki. Määre `mappedBy` tulee asettaa vain jompaan kumpaan yhteyden päätyyn, ei kumpaankin.

Lopulta luokkamme näyttävät seuraavilta.


```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Konttori extends AbstractPersistable<Long> {

    private String osoite;
    @ManyToOne
    private Pankki pankki;

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Pankki extends AbstractPersistable<Long> {

    private String nimi;
    @OneToMany(mappedBy = "pankki")
    private List<Konttori> konttorit = new ArrayList<>();
    @OneToMany(mappedBy = "pankki")
    private List<Tili> tilit = new ArrayList<>();

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Tili extends AbstractPersistable<Long> {

    private BigDecimal saldo = new BigDecimal(0);
    @ManyToOne
    private Pankki pankki;
    @ManyToMany(mappedBy = "tilit")
    private List<Henkilo> omistajat = new ArrayList<>();

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
    @ManyToMany
    private List<Tili> tilit = new ArrayList<>();

}
```


<text-box variant='hint' name='@OneToMany ja @ManyToMany -annotaatiot'>


Kun kirjoitat NetBeansissa viitteen entiteettiluokasta toiseen, ohjelmointiympäristö tarjoaa mahdollisuuden viittauksen tyypin automaattiseen luomiseen. Viittauksen tyypin voi luoda klikkaamalla viitteen määrittelevän rivin vasemmalla puolella olevaa keltaista palloa klikkaamalla.

Alla olevassa kuvassa on klikattu rivin `private List<Konttori> konttorit;` vasemmalla olevaa keltaista palloa. Tämä avaa valikon, josta yhteyden tyypin voi valita automaattisesti.

<img src="../img/yhteystyyppien-automaattinen-maarittely.png" alt="Kuva NetBeansista missä viitteen vasemmalla puolella olevaa keltaista palloa on klikattu.">

Tutustu tähän toiminnallisuuteen, sillä se helpottaa työtäsi jatkossa merkittävästi.

</text-box>

Kun yllä luotu sovellus käynnistetään, ohjelma luo automaattisesti tietokantataulut. H2-tietokannanhallintajärjestelmän konsolissa tietokantataulun näyttävät seuraavilta.

<img src="../img/pankkijarjestelma-h2-konsolissa.png" alt="Pankkijärjestelmän tietokantataulut H2-konsolissa.">

Tietokantakaaviona tietokantamme on seuraavanlainen.

<img src="../img/pankkijarjestelma-tietokantakaavio.png" alt="Edellä luodun pankkijärjestelmän tietokantakaavio.">

Kuten huomaamme, tietokannassa on vielä muutamia hassuuksia. Automaattisesti luotu liitostaulu `Henkilo_Tilit` ja sen sarakkeet eivät ole ideaaleimmalla tavalla nimetyt. Mikäli haluaisimme muuttaa näiden nimiä, muutokset tehtäisiin annotaatioilla <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/JoinColumn.html" target="_blank">@JoinColumn</a> ja <a href="https://docs.oracle.com/javaee/7/api/javax/persistence/JoinTable.html" target="_blank">@JoinTable</a>.

<br/>

<programming-exercise name='Simple Banking'>


Sovelluksessa on toteutettuna entiteetit tilien ja asiakkaiden hallintaan, mutta niiden väliltä puuttuu kytkös. Muokkaa sovellusta siten, että asiakkaalla voi olla monta tiliä, mutta jokaiseen tiliin liittyy tasan yksi asiakas.

Tilin lisäämisen tulee kytkeä tili myös asiakkaaseen. Alla olevassa esimerkissä tietokannassa on kaksi asiakasta ja kolme tiliä.

<img class="browser-img" src="/img/2016-mooc/ex24.png"/>

Kun olet valmis, lähetä sovellus TMC:lle tarkistettavaksi.


</programming-exercise>




<programming-exercise name='helppo'>

- luo tietokantataulut annetun tietokantakaavion perusteella

</programming-exercise>


## Tietokantataulujen käsittely ohjelmallisesti

Useamman tietokantataulun käsittely ei juurikaan poikkea yhden tietokantataulun käsittelystä. Luomme jokaiselle entiteetille taulun käsittelyyn tarkoitetun rajapinnan ja hyödynnämme näitä rajapintoja osana sovellustamme.

Alla on kuvattuna konttorille, pankille, tilille ja henkilölle luodut `JpaRepository`-rajapinnan perivät tietokannan käsittelyyn tarkoitetut rajapinnat.

```java
public interface KonttoriRepository extends JpaRepository<Konttori, Long> {

}
```
```java
public interface PankkiRepository extends JpaRepository<Pankki, Long> {

}
```
```java
public interface TiliRepository extends JpaRepository<Tili, Long> {

}
```
```java
public interface HenkiloRepository extends JpaRepository<Henkilo, Long> {

}
```

Tietokantataulun rivejä kuvaavien olioiden väliset viitteet luodaan ohjelmallisesti.

### Yhdestä moneen -yhteyden lisääminen ohjelmallisesti

Tarkastellaan ensin yhdestä moneen -yhteyden lisäämistä ohjelmallisesti. Yhdestä moneen -yhteydet lisätään tyypillisesti siten, että viite määritellään "moneen"-päätyyn eli esimerkiksi konttorin päätyyn kun pankille lisätään konttoria.

Kun uutta konttoria luodaan, konttorille annetaan parametrina tieto pankista, johon konttori liittyy. Kun konttori tallennetaan, parametrina saadun pankin pääavain tallennetaan konttorin pankkiin viittaavaksi viiteeksi.

Oletetaan, taulussa `Pankki` on rivi, jonka pääavaimen arvo on `1`. Uuden `Konttori`-olion ja `Konttori`-taulun rivin luominen tapahtuu seuraavasti.

```java
@Autowired
private PankkiRepository pankkiRepository;
@Autowired
private KonttoriRepository konttoriRepository;

@GetMapping("/esimerkki")
public String lisaaKonttori() {
    Pankki p = pankkiRepository.getOne(1L);
    Konttori k = new Konttori("Kujapolkutie 7", p);
    konttoriRepositoty.save(k);
}

```

Yllä haemme ensin pankki-olion, jonka asetamme sitten konttorin pankiksi. Kun yllä kuvattua metodia kutsutaan, tietokannan `Konttori`-tauluun lisätään rivi, joka sisältää yllä kuvatun konttoriolion tiedot.

<img src="../img/pankkijarjestelma-konttori-lisatty.png" alt="Tietokantatauluun Konttori on lisätty rivi. Konttorin nimi on 'Kujapolkutie 7' ja pankki_id-viiteavaimen arvoksi on määritelty 1.">


Laajemmassa kontekstissa pankkien ja konttorien lisäys kannattaa toteuttaa siten, että pankkeihin liittyviä pyyntöjä käsittelevä luokka `PankkiController`tarjoaa pääsyn pankin tietoihin sekä mahdollisuuden konttorien lisäämiseen. Alla kuvattu luokka `PankkiController` käsittelee polkuun `/pankit` tulevia pyyntöjä seuraavasti:

- GET-tyyppinen pyyntö polkuun `/pankit` listaa kaikki tietokannassa olevat pankit.
- POST-tyyppinen pyyntö polkuun `/pankit` lisää pankin tietokantaan.
- GET-tyyppinen pyyntö polkuun `/pankit/{id}` hakee ja näyttää tietyn pankin tiedot.
- POST-tyyppinen pyyntö polkuun `/pankit/{id}/konttorit` luo polkuparametrin avulla määritellylle pankille uuden konttorin.

```java

@Controller
public class PankkiController {

    @Autowired
    private PankkiRepository pankkiRepository;
    @Autowired
    private KonttoriRepository konttoriRepository;

    @GetMapping("/pankit")
    public String list(Model model) {
        model.addAttribute("pankit", pankkiRepository.findAll());
        return "pankit";
    }

    @PostMapping("/pankit")
    public String create(@RequestParam String nimi) {
        pankkiRepository.save(new Pankki(nimi, new ArrayList<>(), new ArrayList<>()));
        return "redirect:/pankit";
    }

    @GetMapping("/pankit/{id}")
    public String getOne(Model model, @PathVariable Long id) {
        model.addAttribute("pankki", pankkiRepository.getOne(id));
        return "pankki";
    }

    @PostMapping("/pankit/{id}/konttorit")
    public String addKonttori(@PathVariable Long id, @RequestParam String osoite) {
        Pankki p = pankkiRepository.getOne(id);
        Konttori k = new Konttori(osoite, p);
        konttoriRepository.save(k);
        return "redirect:/pankit/" + id;
    }
}
```

Tarkastellaan seuraavaksi toiminnallisuuden toteuttamiseen tarvittavia HTML-sivuja.  Sivuilla on käytetty Thymeleafin syntaksia polkumuuttujien lisäämiseen osaksi osoitteita. Tästä tarkemmin mm. <a href="https://www.thymeleaf.org/doc/articles/standardurlsyntax.html" target="_blank">Thymeleafin dokumentaatiossa</a>.

<br/>

Sivu `pankit.html` sisältäisi toiminnallisuuden pankkien listaamiseen sekä lomakkeen uuden pankin lisäämiseen.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head>
        <title>Pankit</title>
    </head>

    <body>
        <h1>Pankit</h1>

        <ul>
            <li th:each="pankki: ${pankit}">
                <a th:href="@{/pankit/{id}(id=${pankki.id})}">
                    <span th:text="${pankki.nimi}">pankin nimi</span>
                </a>
            </li>
        </ul>

        <h2>Luo uusi</h2>

        <form th:action="@{/pankit}" method="POST">
            <input type="text" name="nimi"/>
            <input type="submit" value="Lisää!"/>
        </form>
    </body>
</html>
```

Vastaavasti sivu `pankki.html` sisältäisi toiminnallisuuden pankin tietojen näyttämiseen sekä lomakkeen uuden konttorin luomiseen.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head>
        <title th:text="${pankki.nimi}">Pankin nimi</title>
    </head>

    <body>
        <h1 th:text="${pankki.nimi}">Pankin nimi</h1>

        Pankin konttorit:
        <ul>
            <li th:each="konttori: ${pankki.konttorit}">
                <span th:text="${konttori.osoite}">Konttorin osoite</span>
            </li>
        </ul>

        <h2>Luo uusi konttori</h2>

        <form th:action="@{/pankit/{id}/konttorit(id=${pankki.id})}" method="POST">
            <input type="text" name="osoite"/>
            <input type="submit" value="Lisää!"/>
        </form>
    </body>
</html>
```

Yllä olevalla yksittäisen pankin näyttämistä kuvaavalla sivulla näemme hyvin mielenkiintoisen tapahtuman. Sivulla listataan pankkeihin liittyvät konttorit, mutta konttoreita ei ole haettu tietokannasta -- ainakaan eksplisiittisesti.

Kun Thymeleaf kohtaa komennon `<li th:each="konttori: ${pankki.konttorit}">`, se kutsuu "pankki"-avaimella `Model`-olioon lisätyn `Pankki`-olion metodia `getKonttorit()`. Tämä johtaa siihen, että tietokannasta haetaan pankkiin liittyvät konttorit, jotka käydään sivulla yksitellen läpi. Tiedot haetaan tietokannasta siis vasta kun niitä tarvitaan -- palaamme tämän toiminnan tietokantojen perusteistakin tuttuihin hyötyihin ja haittoihin myöhemmin.


TOOD: tehtävä

### Monesta moneen -yhteyden lisääminen ohjelmallisesti


Monesta moneen -yhteyden lisääminen tietokantaan onnistuu lähes yhtä suoraviivaisesti. Tarkastellaan henkilöiden ja tilien suhdetta -- yhdellä henkilöllä voi olla monta tiliä, ja tilillä voi olla monta omistajaa. Tietokantataulut määriteltiin seuraavalla tavalla.

```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Tili extends AbstractPersistable<Long> {

    private BigDecimal saldo = new BigDecimal(0);
    @ManyToOne
    private Pankki pankki;
    @ManyToMany(mappedBy = "tilit")
    private List<Henkilo> omistajat = new ArrayList<>();

}
```
```java
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Henkilo extends AbstractPersistable<Long> {

    private String nimi;
    @ManyToMany
    private List<Tili> tilit = new ArrayList<>();

}
```

Yllä tilin ja henkilön välillä on monesta moneen -suhde. `Tili`-luokassa määritelty `mappedBy`-muuttuja kertoo, että suhteen omistaa luokan `Henkilo` `tilit`-muuttuja. Omistajuus on monesta moneen -yhteyksissä tärkeä käsite -- tietokantaan tallennetaan yhteyden omistavan muuttujan sisältö.

Oletetaan, että haluamme lisätä tilille uuden henkilön. Tilin id on `3` ja henkilön id on `7`. Alla on ensimmäinen yritys.

```java
@Autowired
private HenkiloRepository henkiloRepository;

@Autowired
private TiliRepository tiliRepository;

@GetMapping("/lisaaomistaja")
public String lisaaOmistaja() {
    Tili t = tiliRepository.getOne(3L);
    Henkilo h = henkiloRepository.getOne(7L);

    t.getOmistajat().add(h);
    tiliRepository.save(t);
}
```

Metodi `lisaaOmistaja` hakee tilin ja henkilön, lisää henkilön tilin omistajiin, ja tallentaa tilin.

Tämä muutos ei kuitenkaan vaikuta millään tavalla tietokantaan, sillä tili ei omista monesta moneen -yhteyttä. `Tili`-luokassa kuvatun `mappedBy`-määreen mukaan yhteyden omistaa `Henkilo`-luokan `tilit`-muuttuja.

Toteutetaan metodi uudestaan.

```java
@Autowired
private HenkiloRepository henkiloRepository;

@Autowired
private TiliRepository tiliRepository;

@GetMapping("/lisaaomistaja")
public String lisaaOmistaja() {
    Tili t = tiliRepository.getOne(3L);
    Henkilo h = henkiloRepository.getOne(7L);

    h.getTilit().add(t);
    henkiloRepository.save(h);
}
```

Nyt lisäys tapahtuu oikeaan muuttujaan ja yhteys tilin ja henkilön välille lisätään liitostauluun tallennuksen yhteydessä.


Tarkastellaan tilien lisäämistä hieman laajemmassa kontekstissa. Luomme luokan `TiliController`, jota voidaan käyttää tilien lisäämiseen ja listaamiseen sekä tilien omistajien lisäämiseen. Alla kuvattu luokka `TiliController` käsittelee polkuun `/tilit` tulevia pyyntöjä seuraavasti:

- GET-tyyppinen pyyntö osoitteeseen `/tilit` listaa kaikki tilit sekä tarjoaa mahdollisuuden tilin lisäämiseen. Tilin lisäämisessä tarjotaan mahdollisuus pankin valintaan.
- POST-tyyppinen pyyntö osoitteeseen `/tilit` lisää tilin. Pyyntö sisältää pankin tunnuksen pyyntöparametrina.
- GET-tyyppinen pyyntö osoitteeseen `/tilit/{id}` näyttää tietyn tilin tiedot. Tilin tiedot näyttävä sivu mahdollistaa myös omistajien lisäämisen tilille.
- POST-tyyppinen pyyntö osoitteeseen `/tilit/{tiliId}/omistajat/{henkiloId}` lisää polkumuuttujassa annetulle tilille toisessa polkumuuttujassa lisätyn omistajan.

*Huom! Tässä oiotaan hieman -- todellisuudessa tilien hallinta tehtäisiin todennäköisemmin pankkiin liittyvän polun alta, esim. `/pankit/{pankkiId}/tilit`*

```java
@Controller
public class TiliController {

    @Autowired
    private TiliRepository tiliRepository;

    @Autowired
    private HenkiloRepository henkiloRepository;

    @Autowired
    private PankkiRepository pankkiRepository;

    @GetMapping("/tilit")
    public String list(Model model) {
        model.addAttribute("tilit", tiliRepository.findAll());
        model.addAttribute("pankit", pankkiRepository.findAll());
        return "tilit";
    }

    @PostMapping("/tilit")
    public String create(@RequestParam Long pankkiId) {
        Pankki p = pankkiRepository.getOne(pankkiId);
        Tili t = new Tili(new BigDecimal(0), p, new ArrayList<>());
        tiliRepository.save(t);
        return "redirect:/tilit";
    }

    @GetMapping("/tilit/{id}")
    public String getOne(Model model, @PathVariable Long id) {
        Tili tili = tiliRepository.getOne(id);
        List<Henkilo> henkilot = henkiloRepository.findAll();
        henkilot.removeAll(tili.getOmistajat());

        model.addAttribute("tili", tili);
        model.addAttribute("henkilot", henkilot);

        return "tili";
    }

    @PostMapping("/tilit/{tiliId}/omistajat/{henkiloId}")
    public String addOmistaja(@PathVariable Long tiliId, @PathVariable Long henkiloId) {
        Tili tili = tiliRepository.getOne(tiliId);
        Henkilo henkilo = henkiloRepository.getOne(henkiloId);

        henkilo.getTilit().add(tili);
        henkiloRepository.save(henkilo);

        return "redirect:/tilit/" + tiliId;
    }
}
```

Tarkastellaan seuraavaksi toiminnallisuuden toteuttamiseen tarvittavia HTML-sivuja.

Sivu `tilit.html` sisältäisi toiminnallisuuden tilien listaamiseen sekä uuden tilin lisäämiseen.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head>
        <title>Tilit</title>
    </head>

    <body>
        <h1>Tilit</h1>

        <ul>
            <li th:each="tili: ${tilit}">
                <a th:href="@{/tilit/{id}(id=${tili.id})}">
                    <span th:text="${tili.id + ' ' + tili.saldo}">tilin id ja saldo</span>
                </a>
            </li>
        </ul>

        <h2>Luo uusi</h2>

        <form th:action="@{/tilit}" method="POST">
            <select name="pankkiId">
                <option th:each="pankki : ${pankit}"
                        th:text="${pankki.nimi}"
                        th:value="${pankki.id}">
                    Pankin nimi
                </option>
            </select>
            <input type="submit" value="Lisää!"/>
        </form>
    </body>
</html>
```

Vastaavasti sivu `tili.html` sisältäisi toiminnallisuuden tilin tietojen näyttämiseen sekä mahdollisuuden uuden omistajan lisäämiseen.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head>
        <title th:text="${tili.id}">Tilin id</title>
    </head>

    <body>
        <h1 th:text="${'Tili ' + tili.id}">Tilin tunnus</h1>

        <p>
            Saldo: <span th:text="${tili.saldo}">0</span>.
        </p>
        <p>
            Pankki: <span th:text="${tili.pankki.nimi}">Pankin nimi</span>.
        </p>

        <p>
            Tilin omistajat
        </p>
        <ul>
            <li th:each="henkilo: ${tili.omistajat}">
                <span th:text="${henkilo.nimi}">Omistajan nimi</span>
            </li>
        </ul>

        <h2>Lisää uusi omistaja</h2>
        <ul>
            <li th:each="henkilo: ${henkilot}">
                <form th:action="@{/tilit/{id}/omistajat/{omistajaId}(id=${tili.id},omistajaId=${henkilo.id})}" method="POST">
                    <input type="submit" th:value="${'Lisää omistajaksi ' + henkilo.nimi}"/>
                </form>
            </li>
        </ul>

    </body>
</html>
```

TODO: quiznator -- kerro yllä kuvattujen sivujen sisältö omin sanoin.

TOOD: tehtävä