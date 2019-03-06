---
path: '/osa-2/2-tiedon-lahettaminen-palvelimelle'
title: 'Tiedon lähettäminen palvelimelle'
hidden: true
---

HTML-sivuille voi määritellä lomakkeita (<a href="http://www.w3schools.com/html/html_forms.asp" target="_blank">form</a>), joiden avulla käyttäjä voi lähettää tietoa palvelimelle. Lomakkeen määrittely tapahtuu `form`-elementin avulla, jolle kerrotaan polku, mihin lomake lähetetään (action), sekä pyynnön tyyppi (method). Pidämme pyynnön tyypin toistaiseksi POST-tyyppisenä.

Lomakkeeseen voidaan määritellä mm. tekstikenttiä (`<input type="text"...`) sekä painike, jolla lomake lähetetään (`<input type="submit"...`). Alla tekstikentän `name`-attribuutin arvoksi on asetettu `nimi`. Tämä tarkoittaa sitä, että kun lomakkeen tiedot lähetetään palvelimelle, tulee pyynnössä `nimi`-niminen parametri, jonka arvona on tekstikenttään kirjoitettu teksti.

```xml
<form th:action="@{/}" method="POST">
    <input type="text" name="nimi"/>
    <input type="submit"/>
</form>
```

TODO: ekassa versiossa ilman th:actionia, sit th:actionin kanssa

TODO: kerro miksi @{/} -- sovellus voi sijaita jossain muussakin osoitteessa kuin juuriosoitteessa.


Lomakkeen avulla lähetetty tieto -- jos lähetysmetodiksi on asetettu "POST" -- vastaanotetaan annotaation `@PostMapping` avulla. Annotaatio on kuin `@GetMapping`, mutta annotaatiolla merkitään, että polku kuuntelee POST-tyyppisiä pyyntöjä.


<text-box variant='hint' name='HTML-lomakkeen lähetys ja th:action'>

Polku, johon lomakkeen tiedot lähetetään määritellään form-elementin action-attribuutin avulla. Haluamme vaikuttaa polkuun hieman ja määrittelemme sen thymeleafin kautta `th:action` attribuutilla. Polku on lisäksi `@{<em>polku</em>}` `@`-merkin sekä aaltosulkujen sisällä -- `@{<em>polku</em>}`.

Tämän avulla varaudumme tilanteeseen, missä palvelimella voi sijaita useampia sovelluksia. Ohjelmoimamme sovellus voi sijaita esimerkiksi polussa `http://osoite.com/sovellus1/`, ja Thymeleaf päättelee automaattisesti lomakkeen poluksi osoitteen `http://osoite.com/sovellus1/polku`.

</text-box>

TODO: post-pyynnön kuuntelu kontrollerissa

TODO: tässä eka tehtävä, missä pitää tehdä lomake


<programming-exercise name='Hello Form'>

Tehtäväpohjassa on toiminnallisuus, jonka avulla sivulla voi näyttää tietoa, ja jonka avulla sivulta lähetetty tieto voidaan myös käsitellä. Tiedon lähettämiseen tarvitaan sivulle kuitenkin lomake.

Toteuta tehtäväpohjan kansiossa `src/main/resources/templates` olevaan `index.html`-tiedostoon lomake. Lomakkeessa tulee olla tekstikenttä, jonka nimen tulee olla `content`. Tämän lisäksi, lomakkeessa tulee olla myös nappi, jolla lomakkeen voi lähettää. Lomakkeen tiedot tulee lähettää juuriosoitteeseen POST-tyyppisellä pyynnöllä.

Kun sovellus toimii oikein, voit vaihtaa sivulla näkyvää otsikkoa lomakkeen avulla.

</programming-exercise>


## Post/Redirect/Get -suunnittelumalli

Kun palvelimelle lähetetään tietoa `POST`-tyyppisessä pyynnössä, pyynnön parametrit kulkevat pyynnön rungossa.

TODO: http-pyynnön esimerkki

Oikeastaan kaikki pyynnöt, joissa lähetetään tietoa palvelimelle, ovat ongelmallisia jos pyynnön vastauksena palautetaan näytettävä sivu. Tällöin käyttäjä voi sivun uudelleenlatauksen (esim. painamalla F5) yhteydessä lähettää aiemmin lähettämänsä datan vahingossa uudelleen.

Lomakkeen dataa vastaanottava toiminnallisuus tulee toteuttaa siten, että lähetetyn tiedon käsittelyn jälkeen käyttäjälle palautetaan vastauksena uudelleenohjauspyyntö. Tämän jälkeen käyttäjän selain tekee uuden pyynnön uudelleenohjauspyynnön mukana annettuun osoitteeseen. Tätä toteutustapaa kutsutaan <a href="http://en.wikipedia.org/wiki/Post/Redirect/Get" target="_blank">Post/Redirect/Get</a>-suunnittelumalliksi ja sillä mm. estetään lomakkeiden uudelleenlähetys, jonka lisäksi vähennetään toiminnallisuuden toisteisuutta.



## POST-pyynnön kuuntelu ja uudelleenohjaus


Alla on toteutettu POST-tyyppistä pyyntöä kuunteleva polku sekä siihen liittyvä toiminnallisuus. POST-tyyppinen pyyntö määritellään annotaation `@PostMapping` avulla. Palauttamalla pyyntöä käsittelevästä metodista merkkijono `redirect:/` kerrotaan, että pyynnölle tulee lähettää vastauksena uudelleenohjauspyyntö polkuun `"/"`. Kun selain vastaanottaa uudelleenohjauspyynnön, tekee se GET-tyyppisen pyynnön uudelleenohjauspyynnössä annettuun osoitteeseen.


```java
package uudelleenohjaus;

import java.util.List;
import java.util.ArrayList;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RedirectOnPostController {

    private String message;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", message);
        return "index";
    }

    @PostMapping("/")
    public String post(@RequestParam String content) {
        this.message = content;
        return "redirect:/";
    }
}
```


<programming-exercise name='Hello POST/Redirect/GET'>

Tehtäväpohjassa on sekä muistilappujen listaamistoiminnallisuus, että lomake, jonka avulla voidaan lähettää POST-tyyppisiä pyyntöjä palvelimelle. Toteuta sovellukseen toiminnallisuus, missä palvelin kuuntelee POST-tyyppisiä pyyntöjä, lisää pyynnön yhteydessä tulevan tiedon sovelluksessa olevaan listaan ja uudelleenohjaa käyttäjän tekemään GET-tyyppisen pyynnön juuriosoitteeseen.

Tehtävässä ei ole testejä. Palauta tehtävä kun ohjelma toimii halutulla tavalla.

</programming-exercise>



TODO:

useampi tehtävä, missä lähetetään tietoa palvelimelle
