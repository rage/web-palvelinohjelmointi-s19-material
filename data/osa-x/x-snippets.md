---
path: '/osa-x/x-johdanto'
title: 'Johdanto'
hidden: true
---

<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- osaamistavoitteet

</text-box>

tekstiä.

```java
koodia
```




## skaalautuvuus


Haasteena perinteisessä asiakas-palvelin mallissa on se, että palvelin sijaitsee yleensä tietyssä keskitetyssä sijainnissa. Keskitetyillä palveluilla on mahdollisuus ylikuormittua asiakasmäärän kasvaessa. Kapasiteettia rajoittavat muun muassa palvelimen fyysinen kapasiteetti (muisti, prosessorin teho, ..), palvelimeen yhteydessä olevan verkon laatu ja nopeus, sekä tarjotun palvelun tyyppi. Esimerkiksi pyynnöt, jotka johtavat tiedon tallentamiseen, vievät tyypillisesti enemmän resursseja kuin pyynnöt, jotka tarvitsevat vain staattista sisältöä.


----



<text-box variant='hint' name='Google Dev Tools'>

TODO: pakota chrome käyttöön

Google Chromen DevTools-apuvälineet löytää Tools-valikosta tai painamalla F12 (Linux). Apuvälineillä voi esimerkiksi tarkastella verkkoliikennettä ja lähetettyjä ja vastaanotettuja paketteja. Valitsemalla työvälineistä Network-välilehden, ja lataamalla sivun uudestaan, näet kaikki sivua varten ladattavat osat sekä kunkin osan lataamiseen kuluneen ajan.

Yksittäistä sivua avattaessa tehdään jokaista resurssia (kuva, tyylitiedosto, skripti) varten erillinen pyyntö. Esimerkiksi <a href="https://www.hs.fi" target="_blank">Helsingin sanomien</a> verkkosivua avattaessa tehdään hyvin monta pyyntöä.

<img src="/img/google-devtools-hs-fi.png" alt="Kuvakaappaus Google Dev Toolsista."/>

</text-box>


---

 Esimerkiksi <a href="https://jcp.org/aboutJava/communityprocess/mrel/jsr154/index2.html" target="_blank">Java Servlet API (versio 2.5)</a> sisältää seuraavan suosituksen GET-pyyntotapaan liittyen:



*The GET method should be safe, that is, without any side effects for which users are held responsible. For example, most form queries have no side effects. If a client request is intended to change stored data, the request should use some other HTTP method.*



Suomeksi yksinkertaistaen: GET-pyynnöt ovat tarkoitettu tiedon hakamiseen. Palvelinpuolen toiminnallisuutta suunniteltaessa tulee siis pyrkiä tilanteeseen, missä `GET`-tyyppisillä pyynnöillä ei muuteta palvelimella olevaa dataa.

---

Spring-sovelluksissa kontrollerimetodi kuuntelee GET-tyyppisiä pyyntöjä jos metodilla on annotaatio `@GetMapping`. Annotaatiolle määritellään parametrina kuunneltava polku.

---


Spring-sovelluksissa kontrollerimetodi kuuntelee POST-tyyppisiä pyyntöjä jos metodilla on annotaatio `@PostMapping`. Annotaatiolle määritellään parametrina kuunneltava polku.




<text-box variant='hint' name='Thymeleaf ja HTML' } do %>


    Käytämme kurssilla Thymeleaf-komponenttia dynaamisen sisällön lisäämiseen sivuille. Thymeleaf on erittäin tarkka HTML-dokumentin muodosta, ja pienikin poikkeama voi johtaa virhetilanteeseen. Kannattaakin aina edetä pienin askelein, ja aina muokata ja testata vain yhtä paikkaa kerrallaan. Tällöin virhetilanteessa tyypillisesti tietää mistä kohdasta kannattaa lähteä etsimään virhettä.


</text-box>

