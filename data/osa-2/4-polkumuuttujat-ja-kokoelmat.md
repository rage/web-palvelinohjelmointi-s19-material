---
path: '/osa-2/4-kokoelmien-kasittely-ja-polkumuuttujat'
title: 'Kokoelmien käsittely ja polkumuuttujat'
hidden: true
---


Polkuja käytetään erilaisten resurssien tunnistamiseen ja yksilöintiin. Usein kuitenkin vastaan tulee tilanne, missä luodut resurssit ovat uniikkeja, emmekä tiedä niiden tietoja ennen sovelluksen käynnistymistä. Jos haluaisimme näyttää tietyn resurssin tiedot, voisimme lisätä pyyntöön parametrin -- esim `esineet?tunnus=3`, minkä arvo olisi haetun resurssin tunnus.

Toinen vaihtoehto on ajatella polkua haettavan resurssin tunnistajana. Annotaatiolle `@GetMapping` määriteltävään polkuun voidaan määritellä polkumuuttuja aaltosulkujen avulla. Esimerkiksi polku `"/{arvo}"` ottaisi vastaan minkä tahansa juuripolun alle tulevan kyselyn ja tallentaisi arvon myöhempää käyttöä varten. Tällöin jos käyttäjä tekee pyynnön esimerkiksi osoitteeseen `http://localhost:8080/kirja`, tallentuu arvo "kirja" myöhempää käyttöä varten. Polkumuuttujiin pääsee käsiksi pyyntöä käsittelevälle metodille määriteltävän annotaation <a href="http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/PathVariable.html" target="_blank">@PathVariable</a> avulla.


Yksittäisen henkilön näyttäminen onnistuisi esimerkiksi seuravavasti:

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

    public ListaController() {
        this.henkilot = new ArrayList<>();
        this.henkilot.add(new Henkilo("James Gosling"));
        this.henkilot.add(new Henkilo("Martin Odersky"));
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("list", henkilot);
        return "index";
    }

    @GetMapping("/{id}")
    public String getOne(Model model, @PathVariable Integer id) {
        if(id < 0 || id >= this.henkilot.size()) {
            return home(model);
        }

        model.addAttribute("henkilo", henkilot.get(id));
        return "henkilo";
    }
}
```

<programming-exercise name='Hello Path Variables'>

Tehtäväpohjassa on sovellus, jossa käsitellään taas edellisestä tehtävästä tuttuja `Item`-tyyppisiä olioita. Tällä kertaa esineet kuitenkin kuvastavat hattuja. Kun sovelluksen juureen tehdään pyyntö, käyttäjälle näytetään oletushattu ("default"). Lisää sovellukseen toiminnallisuus, minkä avulla tiettyyn polkuun tehtävä kysely palauttaa sivun, jossa näkyy tietyn hatun tiedot -- huomaa, että voit asettaa polkumuuttujan tyypiksi myös Stringin.

Sovelluksen juuripolkuun tehtävä pyyntö näyttää seuraavanlaisen sivun:

<img class="browser-img" src="/img/2016-mooc/ex12-default.png"/>

Muihin osoitteisiin tehtävät pyynnöt taas palauttavat tehtäväpohjassa olevasta `items`-hajautustaulusta polkuun sopivan hatun. Esimerkiksi pyyntö polkuun `/ascot` näyttää seuraavanlaisen sivun:

<img class="browser-img" src="/img/2016-mooc/ex12-ascot.png"/>

</programming-exercise>


TODO: tehtäviä, missä tietokannasta tavaraa

TODO: tehtävä, missä post redirect get


<text-box variant='hint' name='FluentLenium'>

Seuraavat kaksi tehtävää käyttävät <a href="http://fluentlenium.org/" target="_blank" norel>FluentLenium</a>-nimistä kirjastoa testeihin. Klikkaa projektien kohdalla Dependencies -> Download declared dependencies, niin kirjastot latautuvat käyttöön.

</text-box>


<programming-exercise name='Hello Individual Pages'>

Edellisessä tehtävässä käytössämme oli vain yksi sivu. Olisi kuitenkin hienoa, jos jokaiselle hatulle olisi oma sivu -- ainakin sovelluksen käyttäjän näkökulmasta.

Tehtäväpohjassa on valmiina sovellus, joka listaa olemassaolevat hatut ja näyttää ne käyttäjälle. Jokaisen hatun yhteydessä on linkki, jota klikkaamalla pitäisi päästä hatun omalle sivulle.

Toteuta sekä html-sivu (`single.html`), että sopiva metodi, joka ohjaa pyynnön sivulle.

Pyyntö sovelluksen juureen luo seuraavanlaisen sivun.

<img class="browser-img" src="/img/2016-mooc/ex13-list.png"/>

Jos sivulta klikkaa hattua, pääsee tietyn hatun tiedot sisältävälle sivulle. Alla olevassa esimerkissä on klikattu taikurin hattuun liittyvää linkkiä.

<img class="browser-img" src="/img/2016-mooc/ex13-single.png"/>

</programming-exercise>


<programming-exercise name='Todo Application'>

Tässä tehtävässä tulee rakentaa tehtävien hallintaan tarkoitettu sovellus. Sovelluksen käyttämät sivut ovat valmiina näkyvissä, itse sovelluksen pääset toteuttamaan itse.

Sovelluksen tulee sisältää seuraavat toiminnallisuudet:

- Kaikkien tehtävien listaaminen. Kun käyttäjä tekee pyynnön sovelluksen juuripolkuun, tulee hänelle näyttää sivu, missä tehtävät on listattuna. Sivulla on myös lomake tehtävien lisäämiseen.

- Yksittäisen tehtävän lisääminen. Kun käyttäjä täyttää lomakkeen sivulla ja lähettää tiedot palvelimelle, tulee sovelluksen lisätä tehtävä näytettävään listaan.

- Yksittäisen tehtävän poistaminen. Kun käyttäjä painaa tehtävään liittyvää `Done!`-nappia, tulee tehtävä poistaa listalta. Toteuta tämä niin, että metodin tyyppi on `DELETE`:

```java
@DeleteMapping("/{item}")```
```
- Yksittäisen tehtävän näyttäminen. Kun käyttäjä klikkaa tehtävään liittyvää linkkiä, tulee käyttäjälle näyttää tehtäväsivu. Huom! Tehtävään liittyvien tarkistusten määrä tulee kasvaa aina yhdellä kun sivulla vieraillaan.

Alla kuva tehtävien listauksesta:

<img class="browser-img" src="/img/2016-mooc/ex14-list.png"/>

Kun tehtävää klikkaa, näytetään erillinen tehtäväsivu:

<img class="browser-img" src="/img/2016-mooc/ex14-item-1.png"/>

Kun sivu avataan toisen kerran, kasvaa tehtävien tarkistukseen liittyvä laskuri:

<img class="browser-img" src="/img/2016-mooc/ex14-item-2.png"/>

</programming-exercise>

