---
path: '/osa-4/3-konfiguraatioprofiilit'
title: 'Konfiguraatioprofiilit'
hidden: true
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- TODO

</text-box>


Ohjelmistotuotannossa jokaisella ohjelmistokehittäjällä on oma ympäristö, missä sovellusta voi kehittää ja testata. Sovelluksen lähdekoodi sijaitsee versionhallintapalvelussa, ja sovelluksen toiminta ei ole riippuvainen työympäristöstä -- sovelluksen siirtämisen koneelta toiselle ei lähtökohtaisesti pitäisi vaatia muutoksia ohjelman lähdekoodiin. Samanlaista joustavuutta odotetaan myös silloin kun sovelluksesta julkaistaan uusi versio käyttäjille.


Sovelluksen julkaisun eli esimerkiksi tuotantopalvelimelle siirtämisen ei tule vaatia muutoksia sovelluksen lähdekoodiin. Kun sovellus on julkisessa käytössä, sillä on tyypillisesti ainakin usein eri tietokantaosoite kuin sovelluskehitysvaiheessa, mahdollisesti eri tietokannanhallintajärjestelmä, sekä todennäköisiä erilaisia salasanoihin ja ohjelman tuottamiin tulostuksiin (logeihin) liittyviä asetuksia.


Tarvitsemme siis tavan olennaisten asetusten määrittelyyn ympäristökohtaisesti.


Spring-projekteissa konfiguraatiotiedostot sijaitsevat tyypillisesti kansiossa `src/main/resources/`. Spring etsii kansiosta tiedostoa nimeltä `application.properties`, johon ohjelmistokehittäjä voi määritellä sovelluksen käynnistyksen yhteydessä käytettäviä asetuksia. Asetustiedosto voi sisältää esimerkiksi tietokantaan liittyviä asetuksia:


<pre>
spring.datasource.driverClassName=tietokanta-ajuri
spring.datasource.url=jdbc-osoite
spring.jpa.show-sql=true
</pre>


Ensimmäiset kaksi kertovat tietokannanhallintajärjestelmän käyttämän ajurin sekä osoitteen, kolmas pyytää sovellusta kirjoittamaan tietokantakyselyt lokiin.



Lista tyypillisistä asetuksista löytyy osoitteesta <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html" target="_blank">https://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html</a>.

<br/>


Käytettävän profiilin ja konfiguraatiotiedoston vaihtaminen toteutetaan tyypillisesti ympäristömuuttujan avulla. Ympäristömuuttuja (`SPRING_PROFILES_ACTIVE`) kertoo käytettävän profiilin. Ympäristömuuttujan voi antaa myös sovellukselle parametrina sovellusta käynnistettäessä (`java ... -Dspring.profiles.active=arvo ...`).


Jos käytössä on aktiivista profiilia kuvaava ympäristömuuttuja, etsii Spring oletuskonfiguraatiotiedoston (`application.properties`) lisäksi myös <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-profile-specific-properties" target="_blank">aktiiviseen profiiliin liittyvää konfiguraatiotiedostoa</a>. Jos aktiivisena profiilina on `production`, etsitään myös konfiguraatiotiedostoa `application-production.properties`. Konfiguraatioprofiili voisi esimerkiksi sisältää tietoa käytettävästä tietokanta-ajurista sekä tietokannan osoitteesta.

<br/>

TODO: esimerkki beaneista ja niiden latauksesta, myös selitys siitä että Spring osaa etsiä rajapinnan toteutuksia profiiliin liittyen

TODO: tehtävä, missä tuotannossa "noppa" ja testauksessa "noppa" joka palauttaa aina arvon 4
