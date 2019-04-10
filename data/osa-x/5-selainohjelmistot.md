---
path: '/osa-x/5-selainohjelmistot'
title: 'Javascriptillä toteutetut selainohjelmistot'
hidden: true
---



#
  Selainohjelmistot



  Tutustutaan seuraavaksi selainpuolen toiminnallisuuden peruspalasiin.





TODO: jos haluaa, että selaimet pääsevät käsiksi dataan, tarvitaan cors..


##
CORS: Rajoitettu pääsy resursseihin



Palvelinohjelmiston tarjoamiin tietoihin kuten kuviin ja videoihin pääsee käsiksi lähes mistä tahansa palvelusta. Palvelinohjelmiston toiminnallisuus voi rakentua toisen palvelun päälle. On myös mahdollista toteuttaa sovelluksia siten, että ne koostuvat pääosin selainpuolen kirjastoista, jotka hakevat tietoa palvelimilta.



Selainpuolella Javascriptin avulla tehdyt pyynnöt ovat oletuksena rajoitettuja. Jos palvelimelle ei määritellä erillistä <a href="https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-cors" target="_blank">CORS</a>-tukea, eivät sovelluksen osoitteen ulkopuolelta tehdyt Javascript pyynnöt onnistu. Käytännössä siis, jos käyttäjä on sivulla `hs.fi`, selaimessa toimiva Javascript-ohjelmisto voi tehdä pyyntöjä vain osoitteeseen `hs.fi`.



Palvelinohjelmistot määrittelevät voiko niihin tehdä pyyntöjä myös palvelimen osoitteen ulkopuolelta ("Cross-Origin Resource Sharing"-tuki). Yksinkertaisimmillaan CORS-tuen saa lisättyä palvelinohjelmistoon lisäämällä kontrollerimetodille annotaatio `@CrossOrigin`. Annotaatiolle määritellään osoitteet, joissa sijaitsevista osoitteista pyyntöjä saa tehdä.


```java
  @CrossOrigin(origins = "/**")
  @GetMapping("/books")
  @ResponseBody
  public List<Book> getBooks() {
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



