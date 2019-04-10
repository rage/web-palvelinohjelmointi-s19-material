---
path: '/osa-x/4-muutama-sana-tietoturvasta'
title: 'Muutama sana tietoturvasta'
hidden: true
---

Tutustutaan lyhyesti web-sovellusten tietoturvaan liittyviin teemoihin. Aloita katsomalla Juhani Erosen ARTTech-seminaari aiheesta <a href="https://www.youtube.com/watch?v=-51nIz8pz08" target="_blank">Your privacy is protected by .. what exactly?</a>. Aiheeseen syvennytään tarkemmin tietoturvakursseilla.


TODO:

- csrf ja thymeleaf-lomakkeiden token
- injektiot th:text ja th:utext
- sql-injektiot
- vulnerability list
- github ja vulnerability checkit

##
  Suojattu verkkoyhteys



  Kommunikointi selaimen ja palvelimen välillä halutaan salata käytännössä aina. HTTPS on käytännössä HTTP-pyyntöjen tekemistä SSL (tai TLS)-salauksella höystettynä. HTTPS mahdollistaa sekä käytetyn palvelun verifioinnin sertifikaattien avulla että lähetetyn ja vastaanotetun tiedon salauksen.



  HTTPS-pyynnöissä asiakas ja palvelin sopivat käytettävästä salausmekanismista ennen varsinaista kommunikaatiota. Käytännössä selain ottaa ensiksi yhteyden palvelimen HTTPS-pyyntöjä kuuntelevaan porttiin (yleensä 443), lähettäen palvelimelle listan selaimella käytössä olevista salausmekanismeista. Palvelin valitsee näistä parhaiten sille sopivan (käytännössä vahvimman) salausmekanismin, ja lähettää takaisin salaustunnisteen (palvelimen nimi, sertifikaatti, julkinen salausavain). Selain ottaa mahdollisesti yhteyttä sertifikaatin tarjoajaan -- joka on kolmas osapuoli -- ja tarkistaa onko sertifikaatti kunnossa.



  Selain lähettää tämän jälkeen palvelimelle salauksessa käytettävän satunnaisluvun palvelimen lähettämällä salausavaimella salattuna. Palvelin purkaa viestin ja saa haltuunsa selaimen haluaman satunnaisluvun. Viesti voidaan nyt lähettää salattuna satunnaislukua ja julkista salausavainta käyttäen.



  Käytännössä kaikki web-palvelimet tarjoavat HTTPS-toiminnallisuuden valmiina, joskin se täytyy ottaa palvelimilla käyttöön. Esimerkiksi Herokussa HTTPS on oletuksena käytössä sovelluksissa -- aiemmin mahdollisesti tekemääsi sovellukseen pääsee käsiksi siis myös osoitteen `https://sovelluksen-nimi.herokuapp.com` kautta. Tämä ei kuitenkaan estä käyttäjiä tekemästä pyyntöjä sovellukselle ilman HTTPS-yhteyttä -- jos haluat, että käyttäjien tulee tehdä kaikki pyynnöt HTTPS-yhteyden yli, lisää tuotantokonfiguraatioon seuraava rivi.


<pre>
security.require-ssl=true
</pre>



<text-box variant='hint' name='Muutama sana turvallisesta verkkoyhteydestä' } do %>


    Jos yhteys selaimen ja sovelluksen välissä on kunnossa, on tilanne melko hyvä. Tässä välissä on hyvä kuitenkin mainita myös avointen verkkoyhteyksien käytöstä.



    Jos selaimen käyttäjä käyttää sovellusta avoimen (salasanattoman) langattoman verkkoyhteyden kautta, voi lähetettyjä viestejä kuunnella (ja muokata) käytännössä kuka tahansa. Avoimissa verkoissa käyttöjärjestelmä kirjautuu siihen verkkoon, jonka signaali on vahvin. Jos ilkeämielinen henkilö rakentaa samannimisen verkon ja saa verkkoyhteyden signaalin vahvemmaksi kuin olemassaolevassa verkossa, ottaa käyttäjän käyttöjärjestelmä automaattisesti yhteyden ilkeämielisen henkilön verkkoon. Tällöin ilkeämielinen henkilö voi myös kuunnella verkkoliikennettä halutessaan.



    Tähän liittyvä hieman humoristinen esitys <a href="https://www.youtube.com/watch?v=rJ5jILY1vlw" target="_blank">DEF CON</a>-konferenssissa.


<% end %>



##
  Tyypillisimpiä tietoturvauhkia



OWASP (<em>Open Web Application Security Project</em>) on verkkosovellusten tietoturvaan keskittynyt kansainvälinen järjestö, jonka tavoitteena on tiedottaa tietoturvariskeistä ja sitä kautta edesauttaa turvallisten web-sovellusten kehitystä. OWASP-yhteisö pitää myös yllä listaa merkittävimmistä web-tietoturvariskeistä. Vuoden 2013 lista on seuraava:

TODO: päivitä

1. Injection -- sovellukseen jääneet aukot, jotka mahdollistavat esimerkiksi SQL-injektioiden tekemisen.<br/>
2. Broken Authentication and Session Management -- autentikaatio esimerkiksi siten, että evästeisiin on helppo päästä käsiksi tai siten, että tieto autentikaatiosta kulkee osoitteessa.<br/>
3. Cross-Site Scripting (XSS) -- Mahdollisuus syöttää sivulle Javascript-koodia esimerkiksi tekstikentän kautta. Tämä mahdollistaa mm. toisella koneella  olevan Javascript-koodin suorittamisen, tai lomaketietojen lähettämisen kolmannen osapuolen palveluun. <br/>
4. Insecure Direct Object References -- mahdollisuus päästä käsiksi esimerkiksi palvelimella sijaitseviin tiedostoihin muokkaamalla polkua tai lähettämällä palvelimelle sopivaa dataa. Yksinkertaisin kokeilu lienee `../`-merkkijonon kokeilemista sovelluksen polussa.<br/>
5. Security Misconfiguration -- huonosti tehdyt tietoturvakonfiguraatiot.<br/>
6. Sensitive Data Exposure -- yhteyksien tulee olla suojattu.<br/>
7. Missing Function Level Access Control -- autorisaatiota ei tapahdu metoditasolla.<br/>
8. Cross-Site Request Forgery (CSRF) -- sovelluksessa XSS-aukko, joka mahdollistaa epätoivotun pyynnön lähettämisen toiselle palvelimelle. Lomakkeisiin voidaan myös määritellä <a href="http://docs.spring.io/spring-security/site/docs/current/reference/html/csrf.html" target="_blank">erillinen otsaketieto</a>, joka on uniikki ja luodaan sivun latauksen yhteydessä.<br/>
9. Using Components with Known Vulnerabilities -- sovelluksessa käytetään osia, joissa on tunnettuja tietoturvariskejä. <br/>
10. Unvalidated Redirects and Forwards -- älä käytä parametreja uudelleenohjauksissa. Riskinä on väärien parametrien syöttäminen ja sitä kautta epätoivottuun tietoon pääseminen.<br/>



  Tutustu listaan tarkemmin osoitteessa <a href="https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project">https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project</a>. He tarjoavat dokumentaatiossaan kuvaukset riskeistä, sekä esimerkkejä hyökkäyksistä; <a href="https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet" target="_blank">Tässä</a> esimerkki XSS-filtterien kiertämisestä.



<text-box variant='hint' name='Palvelinten fyysinen tietoturva' } do %>


    Tietoturvaan keskityttäessä on hyvä muistaa myös fyysinen tietoturva. Jos palvelinsaliin pääsee helposti, voi kuka tahansa kävellä sinne ja ottaa palvelimen kainaloonsa. Tällöin sovellukseen toteutetun tietoturvan hyöty on melko pieni.


<% end %>

