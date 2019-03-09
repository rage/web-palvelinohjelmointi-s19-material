---
path: '/osa-2/4-polkumuuttujat'
title: 'Polkumuuttujat'
hidden: true
---


Polkuja käytetään resurssien tunnistamiseen ja yksilöintiin. Usein vastaan tulee tilanne, missä luodut resurssit ovat uniikkeja, emmekä tiedä niiden tietoja ennen sovelluksen käynnistymistä -- emme voi siis määritellä eksaktia polkua, joka tunnistaisi vielä tuntemattoman resurssin.

Yksi vaihtoehto tällaisen tilanteen ratkaisemiseksi on kontrolleriluokassa olevan metodin määrittely siten, että metodi käsittelee aina tiettyyn polkuun tulevat pyynnöt, ja pyynnön mukana tulevalla parametrilla tunnistetaan resurssit. Esimerkiksi pyyntö polkuun `/henkilot?id=3` näyttäisi tietokannasta sen henkilön tiedot, jonka `id`-sarakkeen arvo on `3`.

Toinen vaihtoehto on ajatella polkua haettavan resurssin tunnistajana. Annotaatiolle `@GetMapping` määriteltävään polkuun voidaan määritellä polkumuuttuja aaltosulkujen avulla. Esimerkiksi polku `"/{arvo}"` ottaisi vastaan minkä tahansa juuripolun alle tulevan kyselyn ja tallentaisi arvon myöhempää käyttöä varten. Tällöin jos käyttäjä tekee pyynnön esimerkiksi osoitteeseen `http://localhost:8080/kirja`, tallentuu arvo "kirja" myöhempää käyttöä varten. Polkumuuttujiin pääsee käsiksi pyyntöä käsittelevälle metodille määriteltävän annotaation <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/PathVariable.html" target="_blank">@PathVariable</a> avulla.

Jatketaan aiemman henkilöesimerkin kanssa. Nyt yksittäisen henkilön hakeminen onnistuisi esimerkiksi seuraavalla tavalla.

```java
@Controller
public class HenkiloController {

    @Autowired
    private HenkiloRepository henkiloRepository;

    @GetMapping("/")
    public String list(Model model) {
        model.addAttribute("list", henkiloRepository.findAll());
        return "henkilot"; // tässä oletetaan erillinen tiedosto henkilot.html
    }

    @PostMapping("/")
    public String create(@RequestParam String nimi) {
        henkiloRepository.save(new Henkilo(nimi));
        return "redirect:/";
    }

    @GetMapping("/{id}")
    public String getOne(Model model, @PathVariable Long id) {
        model.addAttribute("henkilo", henkiloRepository.getOne(id));
        return "henkilo";
    }
}
```

Yllä olevassa esimerkissä metodi `getOne` käsittelee pyyntöjä ennalta määrittelemättömään osoitteeseen `/{id}`. Tässä `{id}` tarkoittaa käytännössä sitä, että Spring ottaa polusta osan talteen ja asettaa sen pyynnön käsittelevän metodin `id`-nimiseen muuttujaan, jolle on määritelty `@PathVariable`-annotaatio.

TODO: polkumuuttujaan linkkaaminen html-tiedostosta

TODO: polkumuuttujan arvo -- esimerkiksi tietokantataulun id:stä


<programming-exercise name='Hello Path Variables'>

Tehtäväpohjassa on sovellus, jossa käsitellään `Item`-tyyppisiä olioita. Kun sovelluksen juureen tehdään pyyntö, käyttäjälle näytetään oletushattu ("default"). Tehtäväpohjaan on määritelty hajautustaulu, joka sisältää erilaisia hattuja.

Lisää sovellukseen toiminnallisuus, jonka avulla käyttäjä voi hakea hajautustaulusta hattuja. Esimerkiksi, mikäli käyttäjä tekee pyynnön polkuun `/ascot`, tulee hänelle näyttää hatun `Ascot cap` tiedot. Vastaavasti, jos käyttäjä tekee pyynnön polkuun `/bicorne`, tulee käyttäjälle näyttää hatun `Bicorne` tiedot.

Luo siis uusi pyyntöjä käsittelevä metodi, joka käsittelee ennalta määräämättömän muotoisiin polkuihin tehtyjä pyyntöjä, ja palauttaa pyynnön polun perusteella käyttäjälle hatun tiedot. Käytä tässä polkumuuttujan tyyppinä merkkijonoa.

Sovelluksen juuripolkuun tehtävä pyyntö näyttää seuraavanlaisen sivun:

<img src="../img/exercises/hellopathvariables-default.png"/>

Muihin osoitteisiin tehtävät pyynnöt taas palauttavat tehtäväpohjassa olevasta `items`-hajautustaulusta polkuun sopivan hatun. Esimerkiksi pyyntö polkuun `/ascot` näyttää seuraavanlaisen sivun:

<img src="../img/exercises/hellopathvariables-ascot.png"/>

</programming-exercise>


<programming-exercise name='Hello Individual Pages'>

Edellisessä tehtävässä käytössämme oli vain yksi sivu. Olisi kuitenkin hienoa, jos jokaiselle hatulle olisi oma sivu -- ainakin sovelluksen käyttäjän näkökulmasta. Tehtäväpohjassa on valmiina sovellus, joka listaa olemassaolevat hatut ja näyttää ne käyttäjälle. Jokaisen hatun yhteydessä on linkki, jota klikkaamalla pitäisi päästä hatun omalle sivulle.

Toteuta tehtäväpohjaan uusi yhden hatun tiedot näyttävä html-sivu (`single.html`) ja metodi, joka ohjaa pyynnön sivulle. Kuten edellisessä tehtävässä, metodin tulee kuunnella ennalta määräämättömän muotoisuu polkuihin tehtyjä pyyntöjä, ja palauttaa pyynnön polun perusteella käyttäjälle hattu. Huom! Toisin kuin edellisessä tehtävässä, tässä tehtävässä hatun tunnistamiseen käytettävä merkkijono luodaan hatun luomisen yhteydessä.

Pyyntö sovelluksen juureen luo seuraavanlaisen sivun.

<img src="../img/exercises/helloindividualpages-list.png"/>

Jos sivulta klikkaa hattua, pääsee tietyn hatun tiedot sisältävälle sivulle. Alla olevassa esimerkissä on klikattu taikurin hattuun liittyvää linkkiä.

<img src="../img/exercises/helloindividualpages-single.png"/>

</programming-exercise>


<programming-exercise name='Todo Application (2 osaa)'>

TODO: avaa tarkemmin

TOOD: sano tietokannan käytöstä

Tässä tehtävässä tulee rakentaa tehtävien hallintaan tarkoitettu sovellus. Sovelluksen käyttämät html-sivut ovat valmiina, itse sovelluksen pääset toteuttamaan itse.

Sovellukseen tulee lisätä seuraavat toiminnallisuudet:

- Kaikkien tehtävien listaaminen. Kun käyttäjä tekee pyynnön sovelluksen juuripolkuun, tulee hänelle näyttää sivu, missä tehtävät on listattuna. Sivulla on myös lomake tehtävien lisäämiseen.

- Yksittäisen tehtävän lisääminen. Kun käyttäjä täyttää lomakkeen sivulla ja lähettää tiedot palvelimelle, tulee sovelluksen lisätä tehtävä näytettävään listaan.

- Yksittäisen tehtävän näyttäminen. Kun käyttäjä klikkaa tehtävään liittyvää linkkiä, tulee käyttäjälle näyttää tehtäväsivu. Huom! Tehtävään liittyvien tarkistusten määrä tulee kasvaa aina yhdellä kun sivulla vieraillaan.

Alla kuva tehtävien listauksesta:

<img src="../img/exercises/todoapplication-list.png"/>

Kun tehtävää klikkaa, näytetään erillinen tehtäväsivu:

<img src="../img/exercises/todoapplication-item-1.png"/>

Kun sivu avataan toisen kerran, kasvaa tehtävien tarkistukseen liittyvä laskuri:

<img src="../img/exercises/todoapplication-item-2.png"/>

Tehtävä on kahden yksittäisen tehtäväpisteen arvoinen.

</programming-exercise>

