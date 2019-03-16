---
path: '/osa-3/4-tiedon-jarjestaminen-ja-rajaaminen'
title: 'Tiedon järjestäminen ja rajaaminen'
hidden: true
---

Tietokantakyselyn tulokset halutaan usein tietynlaisessa järjestyksessä tai niin, että kysely palauttaa vain rajatun joukon kaikista tuloksista. Jos järjestäminen tai rajaus toteutetaan web-sovelluksessa (eli ei tietokannassa), sovelluksessa tehdään juuri se työ, mihin tietokannat on tarkoitettu. Lisäksi, jos tietokannan tieto noudetaan sovellukseen järjestämistä tai rajausta varten, käytetään tiedon kopiointiin paikasta toiseen turhaan aikaa ja resursseja.

TODO: jaa järjestämimiseen ja rajaamiseen erikseen

Spring Data JPAn rajapinta <a href="http://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaRepository.html" target="_blank">JpaRepository</a> mahdollistaa muutaman lisäparametrin käyttämisen osassa pyyntöjä. Voimme esimerkiksi käyttää parametria <a href="http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/PageRequest.html" target="_blank">PageRequest</a>, joka tarjoaa apuvälineet sivuttamiseen sekä pyynnön hakutulosten rajoittamiseen. Alla olevalla `PageRequest`-oliolla ilmoitamme haluavamme ensimmäiset 10 hakutulosta attribuutin `nimi` mukaan käänteisessä järjestyksessä.

<br/>


```java
Pageable pageable = PageRequest.of(0, 10, Sort.by("nimi").descending());
```

`Pageable`-olion voi antaa parametrina suurelle osalle tietokantarajapinnan valmiista metodeista. Esimerkiksi listattavien pankkien rajaus `findAll`-metodin kautta näyttäisi seuraavalta.

```java

@Controller
public class PankkiController {

    @Autowired
    private PankkiRepository pankkiRepository;

    // ...

    @GetMapping("/pankit")
    public String list(Model model) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("nimi").descending());

        model.addAttribute("pankit", pankkiRepository.findAll(pageable));
        return "pankit";
    }
    // ...

}
```

TODO: tehtävä

## Kyselyn tulosten rajaaminen

Oletetaan, että edellä käytössämme on seuraavanlainen PersonRepository-toteutus.

Kyselyiden rajoittaminen on suoraviivaista. Jos tuloksia halutaan hakea tietyllä attribuutin arvolla, rajapinnalle voidaan lisätä muotoa `findBy<em>Attribuutti(Tyyppi arvo)</em>`. Esimerkiksi päivämäärän perusteella tapahtuva haku onnistuu seuraavasti.


```java
  import java.time.LocalDate;
  import java.util.List;
  import org.springframework.data.jpa.repository.JpaRepository;

  public interface PersonRepository extends JpaRepository&lt;Person, Long&gt; {

      List&lt;Person&gt; findByBirthday(LocalDate birthday);
  }
```


Tarkemmin kyselyiden luomisesta löytyy osoitteessa <a href="https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods" target="_blank" norel>https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods</a> olevan dokumentaation kohdasta <em>Query creation</em>. Edellistä esimerkkiä voidaan laajentaa siten, että rajapinnalla on myös metodi nimen ja syntymäpäivän mukaan etsimiselle.


```java
  import java.time.LocalDate;
  import java.util.List;
  import org.springframework.data.jpa.repository.JpaRepository;

  public interface PersonRepository extends JpaRepository&lt;Person, Long&gt; {

      List&lt;Person&gt; findByBirthday(LocalDate birthday);
      List&lt;Person&gt; findByNameAndBirthday(String name, LocalDate birthday);
  }
```


  Myös edellä kuvatuille metodeille voidaan määritellä parametriksi Pageable-olio. Jos oletamme, että käyttäjä antaa pageablen aina metodille `findByBirthday`, voidaan sen määrittely muuttaa seuraavaksi.


```java
  import java.time.LocalDate;
  import java.util.List;
  import org.springframework.data.domain.Pageable;
  import org.springframework.data.jpa.repository.JpaRepository;

  public interface PersonRepository extends JpaRepository&lt;Person, Long&gt; {
      List&lt;Person&gt; findByBirthday(LocalDate birthday, Pageable pageable);
      List&lt;Person&gt; findByNameAndBirthday(String name, LocalDate birthday);
  }
```



<programming-exercise name='Last Messages' } do %>


    Tehtävässä on käytössä viestien lähetykseen käytettävä sovellus. Muokkaa sovellusta siten, että sovelluksessa näkyy aina vain uusimmat 5 viestiä. Käytä tässä hyödyksi yllä nähtyä Pageable-oliota.



    Sovelluksessa ei ole testejä. Palauta se kun se toimii toivotulla tavalla.


<% end %>


<programming-exercise name='Exams and Questions' } do %>


    Tehtävänäsi on täydentää kokeiden ja koekysymysten hallintaan tarkoitettua sovellusta. Sovellukseen on toteutettu valmiiksi rungot kokeiden ja koekysymysten lisäämiseen tarvittaviin kontrollereihin, jonka lisäksi sovelluksessa on osittain valmiina tarvitut `Exam` ja `Question` -entiteetit.



    Lisää sovellukseen tarvittavat Repository-rajapinnat ja täydennä Exam- ja Question-entiteettejä niin, että yhteen kokeeseen monta kysymystä ja yksi kysymys voi liittyä useampaan kokeeseen. Toteuta myös kontrollereille tarvittavat metodit ja toiminnallisuudet -- saat näitä selville HTML-sivuja tarkastelemalla.



    Muokkaa sovellusta lopulta niin, että osoitteessa "/exams" näytettävät kokeet järjestetään koepäivämäärän mukaan.



    Huomaa, että testit eivät käsittele päivämääriä. Kokeile sovelluksen toimintaa -- myös tässäkin tehtävässä -- myös manuaalisesti.


<% end %>

