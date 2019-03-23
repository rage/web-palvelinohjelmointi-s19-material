---
path: '/osa-4/2-sovelluksen-rakenne'
title: 'Sovelluksen rakenne'
hidden: true
---


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

