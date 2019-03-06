---
path: '/osa-2/1-nakymat-ja-data'
title: 'Näkymät ja data'
hidden: true
---

# TODO: heti alkuun lombok?


Sovelluksemme ovat vastaanottaneet tiettyyn polkuun tulevan pyynnön ja palauttaneet käyttäjälle merkkijonomuodossa olevaa tietoa. Palvelin voi myös luoda käyttäjälle näkymän, jonka selain lopulta näyttää käyttäjälle.

Näkymät luodaan tyypillisesti apukirjastojen avulla siten, että ohjelmoija luo HTML-näkymät ja upottaa HTML-koodiin kirjastospesifejä komentoja. Nämä komennot mahdollistavat mm. tiedon lisäämisen sivuille.

Tällä kurssilla käyttämämme apuväline näkymän luomiseen on <a href="http://www.thymeleaf.org/" target="_blank">Thymeleaf</a>, joka tarjoaa välineitä datan lisäämiseen HTML-sivuille. Käytännössä näkymiä luodessa luodaan ensin HTML-sivu, jonka jälkeen sivulle lisätään komentoja Thymeleafin käsiteltäväksi.

Thymeleaf-sivut ("templatet") sijaitsevat projektin kansiossa `src/main/resources/templates` tai sen alla olevissa kansioissa. NetBeansissa kansio löytyy kun klikataan "Other Sources"-kansiota.


<text-box variant='hint' name='Thymeleafin käyttöönotto'>

Thymeleafin käyttöönotto vaatii `pom.xml`-tiedostossa olevien riippuvuuksien muokkaamista. Web-sovellusten perustoiminnallisuus saatiin käyttöön lisäämällä `org.springframework.boot`-ryhmän komponentti `spring-boot-starter-web` pom.xml-tiedoston dependencies-osioon. Kun vaihdamme riippuvuuden muotoon `spring-boot-starter-thymeleaf`, pääsemme käyttämään Thymeleafia.


```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
</dependencies>
```

Jos edellämainittu riippuvuus ei ole aiemmin ladattuna koneelle, tulee se myös hakea. Tämä onnistuu joko kirjoittamalla komentorivillä projektin juuressa komento `mvn dependency:resolve` tai valitsemalle NetBeansissa projektiin liittyvä kansio <em>Dependencies</em> oikealla hiirennapilla ja painamalla <em>Download Declared Dependencies</em>.

Aiemmat Thymeleafin versiot ovat lisäksi vaatineet, että jokaisen HTML-sivun `html`-elementin määrittelyssä tulee olla seuraavat määrittelyt.


```xml
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
```
</text-box>


Alla olevassa esimerkissä luodaan juuripolkua `/` kuunteleva sovellus. Kun sovellukseen tehdään pyyntö, palautetaan HTML-sivu, jonka Thymeleaf käsittelee. Spring päättelee käsiteltävän ja palautettavan sivun merkkijonon perusteella. Alla metodi palauttaa merkkijonon `"index"`, jolloin Spring etsii kansiosta `src/main/resources/templates/` sivua `index.html`. Kun sivu löytyy, se annetaan Thymeleafin käsiteltäväksi, jonka jälkeen sivu palautetaan käyttäjälle.

```java
package thymeleaf;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ThymeleafController {

    @GetMapping("/")
    public String home() {
        return "index";
    }
}
```

Pyyntöjä käsittelevällä metodilla ei ole annotaatiota `@ResponseBody`. Emme siis tässä halua, että metodin palauttama arvo näytetään suoraan käyttäjälle, vaan haluamme, että käyttäjälle näytetään merkkijonon osoittama näkymä. Näkymä luodaan Thymeleafin avulla.


<programming-exercise name='Hello Thymeleaf'>

Toteuta tässä tehtävässä pakkauksessa `wad.hellothymeleaf` sijaitsevaan `HelloThymeleafController`-luokkaan seuraava toiminnallisuus:

- Pyyntö juuripolkuun `/` palauttaa käyttäjälle Thymeleafin avulla kansiossa `src/main/resources/templates/` olevan `index.html`-tiedoston.
- Pyyntö polkuun `/video` palauttaa käyttäjälle Thymeleafin avulla kansiossa `src/main/resources/templates/` olevan `video.html`-tiedoston.

Alla on esimerkki ohjelman toiminnasta, kun selaimella on tehty pyyntö sovelluksen juuripolkuun.

<img class="browser-img" src="/img/2016-mooc/ex5.png"/>

</programming-exercise>


<text-box variant='hint' name='HTML'>

Jos mietit mistä ihmeestä tuossa HTML-lyhenteessä on kyse tai haluat verestää HTML-osaamistasi, nyt on hyvä hetki käydä lukemassa osoitteessa <a href="http://www.w3schools.com/html/default.asp" target="_blank">http://www.w3schools.com/html/default.asp</a> oleva HTML-opas.

</text-box>


## Tiedon lisääminen näkymään Model-luokan avulla

Palvelinohjelmistossa luodun tai haetun datan lisääminen näkymään tapahtuu <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/ui/Model.html" target="_blank">Model</a>-olion avulla.

Kun lisäämme Model-olion pyyntöjä käsittelevän metodin parametriksi, lisää Spring-sovelluskehys sen automaattisesti käyttöömme.


```java
package thymeleafdata;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

public class ThymeleafJaDataController {

    @GetMapping("/")
    public String home(Model model) {
        return "index";
    }
}
```

Model on Spring-sovelluskehyksen käyttämä hajautustaulun toimintaa jäljittelevä olio. Alla olevassa esimerkissä määrittelemme pyyntöjä käsittelevälle metodille Model-olion, jonka jälkeen lisäämme lokeroon nimeltä `teksti` arvon `"Hei mualima!"`.


```java
package thymeleafdata;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ThymeleafJaDataController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("teksti", "Hei mualima!");
        return "index";
    }
}
```

Kun käyttäjä tekee pyynnön, joka ohjautuu ylläolevaan metodiin, ohjautuu pyyntö `return`-komennon jälkeen Thymeleafille, joka saa käyttöönsä Model-olion ja siihen lisätyt arvot sekä tiedon näytettävästä sivusta.

Oletetaan, että käytössämme olevan `index.html`-sivun lähdekoodi on seuraavanlainen:

```xml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
    <head>
        <title>Otsikko</title>
    </head>

    <body>
        <h1>Hei maailma!</h1>

        <h2 th:text="${teksti}">testi</h2>
    </body>
</html>
```

Kun Thymeleaf käsittelee HTML-sivun, se etsii sieltä elementtejä, joilla on `th:`-alkuisia attribuutteja. Ylläolevasta sivusta Thymeleaf löytää `h2`-elementin, jolla on attribuutti `th:text` -- `<h2 th:text="${teksti}">testi</h2>`. Attribuutti `th:text` kertoo Thymeleafille, että elementin tekstiarvo (tässä "testi") tulee korvata attribuutin arvon ilmaisemalla muuttujalla. Attribuutin `th:text` arvona on `${teksti}`, jolloin Thymeleaf etsii `model`-oliosta arvoa avaimella `"teksti"`.

Käytännössä Thymeleaf etsii -- koska sivulla olevasta elementistä löytyy attribuutti `th:text="${teksti}"` -- Model-oliosta lokeron nimeltä `teksti` ja asettaa siinä olevan arvon elementin tekstiarvoksi. Tässä tapauksessa teksti `testi` korvataan Model-olion lokerosta teksti löytyvällä arvolla, eli aiemman esimerkkimme tekstillä `Hei mualima!`.


<programming-exercise name='Hello Model'>

Tehtäväpohjan mukana tulevaan HTML-tiedostoon on toteutettu tarina, joka tarvitsee otsikon ja päähenkilön. Toteuta pakkauksessa `wad.hellomodel` sijaitsevaan `HelloModelController`-luokkaan toiminnallisuus, joka käsittelee juuripolkuun tulevia pyyntöjä ja käyttää pyynnössä tulevia parametreja tarinan täydentämiseen. Voit olettaa, että pyynnön mukana tulevien parametrien nimet ovat `title` ja `person`.

Lisää pyynnön mukana tulevien parametrien arvot Thymeleafille annettavaan HashMappiin. Otsikon avaimen tulee olla `"title"` ja henkilön avaimen tulee olla `"person"`. Palautettava sivu on `index.html`.

Alla on esimerkki ohjelman toiminnasta, kun juuripolkuun tehdyssä pyynnössä on annettuna otsikoksi `Mökkielämää` ja henkilöksi `Leena`.

<img class="browser-img" src="/img/2016-mooc/ex6.png"/>

Palauta tehtävä TMC:lle kun olet valmis.

</programming-exercise>


## Kokoelmien näyttäminen Thymeleaf-sivulla

Thymeleafille annettavalle Model-oliolle voi asettaa tekstin sijaan arvokokoelmia. Alla luomme "pääohjelmassa" listan, joka asetetaan Thymeleafin käsiteltäväksi menevään Model-olioon jokaisen juuripolkuun tehtävän pyynnön yhteydessä. Jos juuripolkuun lähetetään parametri nimeltä `"content"`, lisätään se myös listaan.


```java
package thymeleafdata;

import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ListaController {
    private List<String> lista;

    public ListaController() {
        this.lista = new ArrayList<>();
        this.lista.add("Hello world!");
    }

    @GetMapping(value = "/")
    public String home(Model model) {
        model.addAttribute("list", lista);
        return "index";
    }

    @PostMapping(value = "/")
    public String post(Model model, String content) {
        this.lista.add(content);
        return "redirect:/";
    }
}
```

Listan läpikäynti Thymeleafissa tapahtuu attribuutin `th:each` avulla. Sen määrittely saa muuttujan nimen, johon kokoelmasta otettava alkio kullakin iteraatiolla tallennetaan, sekä läpikäytävän kokoelman. Perussyntaksiltaan `th:each` on seuraavanlainen.


```xml
<p th:each="alkio : ${lista}">
    <span th:text="${alkio}">hello world!</span>
</p>
```

Yllä käytämme attribuuttia nimeltä `lista` ja luomme jokaiselle sen sisältämälle alkiolle p-elementin, jonka sisällä on span-elementti, jonka tekstinä on alkion arvo. Attribuutin `th:each` voi asettaa käytännössä mille tahansa toistettavalle elementille. Esimerkiksi HTML-listan voisi tehdä seuraavalla tavalla.


```xml
<ul>
    <li th:each="alkio : ${lista}">
        <span th:text="${alkio}">hello world!</span>
    </li>
</ul>
```

<em>Huom! Eräs klassinen virhe on määritellä iteroitava joukko merkkijonona `th:each="alkio : lista"`. Tämä ei luonnollisesti toimi.</em>


<programming-exercise name='Hello List'>

Tehtäväpohjassa on palvelinpuolen toiminnallisuus, jossa käsitellään juuripolkuun tuleva pyyntö, sekä lisätään lista Thymeleafille sivun käsittelyyn. Tehtäväpohjaan liittyvä HTML-sivu ei kuitenkaan sisällä juurikaan toiminnallisuutta.

Lisää HTML-sivulle (1) listalla olevien arvojen tulostaminen `th:each`-komennon avulla ja (2) lomake, jonka avulla palvelimelle voidaan lähettää uusia arvoja.

</programming-exercise>


## Olioiden käsittely

Modeliin voi lisätä kokoelmien lisäksi myös muunlaisia olioita. Oletetaan, että käytössämme on henkilöä kuvaava luokka.

```java
public class Henkilo {
    private String nimi;

    public Henkilo(String nimi) {
        this.nimi = nimi;
    }

    public String getNimi() {
        return this.nimi;
    }

    public void setNimi(String nimi) {
        this.nimi = nimi;
    }
}
```

Henkilo-olion lisääminen on suoraviivaista:


```java
@GetMapping("/")
public String home(Model model) {
    model.addAttribute("henkilo", new Henkilo("Le Pigeon"));
    return "index";
}
```

Kun sivua luodaan, henkilöön päästään käsiksi modeliin asetetun avaimen perusteella. Edellä luotu "Le Pigeon"-henkilö on tallessa avaimella "henkilo". Kuten aiemminkin, avaimella pääsee olioon käsiksi.


```xml
<h2 th:text="${henkilo}">Henkilön nimi</h2>
```

Ylläolevaa henkilön tulostusta kokeillessamme saamme näkyville (esim.) merkkijonon `Henkilo@29453f44` -- ei ihan mitä toivoimme. Käytännössä Thymeleaf kutsuu edellisessä tapauksessa olioon liittyvää `toString`-metodia, jota emme ole määritelleet.

 Pääsemme oliomuuttujiin käsiksi olemassaolevien `get<em>Muuttuja</em>`-metodien kautta. Jos haluamme tulostaa Henkilo-olioon liittyvän nimen, kutsumme metodia `getNimi`. Thymeleafin käyttämässä notaatiossa kutsu muuntuu muotoon `henkilo.nimi`. Saamme siis halutun tulostuksen seuraavalla tavalla:


```xml
<h2 th:text="${henkilo.nimi}">Henkilön nimi</h2>
```


## Olioita listalla

Listan läpikäynti Thymeleafissa tapahtuu attribuutin `th:each` avulla. Sen määrittely saa muuttujan nimen, johon kokoelmasta otettava alkio kullakin iteraatiolla tallennetaan, sekä läpikäytävän kokoelman. Perussyntaksiltaan `th:each` on jo tullut aiemmin tutuksi.

```xml
<p th:each="alkio : ${lista}">
    <span th:text="${alkio}">hello world!</span>
</p>
```

Iteroitavan joukon alkioiden ominaisuuksiin pääsee käsiksi aivan samalla tavalla kuin muiden olioiden ominaisuuksiin. Tutkitaan seuraavaa esimerkkiä, jossa listaan lisätään kaksi henkilöä, lista lisätään pyyntöön ja lopulta luodaan näkymä Thymeleafin avulla.


```java
package henkilot;

import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HenkiloController {
    private List<Henkilo> henkilot;

    public HenkiloController() {
        this.henkilot = new ArrayList<>();
        this.henkilot.add(new Henkilo("James Gosling"));
        this.henkilot.add(new Henkilo("Martin Odersky"));
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("list", henkilot);
        return "index";
    }
}
```

```xml
<p>Ja huomenna puheet pitävät:</p>
<ol>
    <li th:each="henkilo : ${list}">
        <span th:text="${henkilo.nimi}">Esimerkkihenkilö</span>
    </li>
</ol>
```

Käyttäjälle lähetettävä sivu näyttää palvelimella tapahtuneen prosessoinnin jälkeen seuraavalta.

```xml
<p>Ja huomenna puheet pitävät:</p>
<ol>
    <li><span>James Gosling</span></li>
    <li><span>Martin Odersky</span></li>
</ol>
```


<programming-exercise name='Hello Objects'>

Tehtäväpohjassa on sovellus, jossa käsitellään `Item`-tyyppisiä olioita. Tehtävänäsi on lisätä sovellukseen lisätoiminnallisuutta:

- Kun käyttäjä avaa selaimella sovelluksen juuripolun, tulee hänen lomakkeen lisäksi nähdä lista esineistä. Jokaisesta esineestä tulee tulla ilmi sen nimi (name) ja tyyppi (type).
- Kun käyttäjä lähettää lomakkeella uuden esineen palvelimelle, tulee palvelimen säilöä esine listalle seuraavaa näyttämistä varten. Huomaa, että lomake lähettää tiedot POST-pyynnöllä sovelluksen juureen. Kun esine on säilötty, uudelleenohjaa käyttäjän pyyntö siten, että käyttäjän selain tekee GET-tyyppisen pyynnön sovelluksen juuripolkuun.

Alla olevassa esimerkissä sovellukseen on lisätty olemassaolevan taikurin hatun lisäksi <a href="https://en.wikipedia.org/wiki/Party_hat" target="_blank">Party hat</a>, eli bilehattu.

<img class="browser-img" src="/img/2016-mooc/ex11.png"/>

</programming-exercise>


