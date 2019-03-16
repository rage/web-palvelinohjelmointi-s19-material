---
path: '/osa-3/6-yhteenveto'
title: 'Yhteenveto'
hidden: true
---



<programming-exercise name='Movie database (4 osaa)'>

TODO: elokuvaa lisättäessä lisätään myös kuva?

Tämä on avoin tehtävä jossa saat itse suunnitella huomattavan osan ohjelman sisäisestä rakenteesta. Ainoat määritellyt asiat ohjelmassa ovat käyttöliittymä ja domain-oliot, jotka tulevat tehtäväpohjan mukana. Tehtäväpohjassa on myös valmis konfiguraatio.

Tehtävästä on mahdollista saada yhteensä 4 pistettä.

Huom! Kannattanee aloittaa näyttelijän lisäämisestä ja poistamisesta. Hyödynnä valmiiksi tarjottuja käyttöliittymätiedostoja kontrollerien ym. toteuttamisessa.

<strong><em>pisteytys</em></strong>


- + 1p: Näyttelijän lisääminen ja poistaminen onnistuu. Käyttöliittymän olettamat osoitteet ja niiden parametrit:<br/>
    - `GET /actors` - näyttelijöiden listaus, ei parametreja pyynnössä. Lisää pyyntöön attribuutin `actors`, joka sisältää kaikki näyttelijät ja luo sivun `/src/main/resources/templates/actors.html` pohjalta näkymän.
    - `POST /actors` - parametri `name`, jossa on lisättävän näyttelijän nimi. Lisäyksen tulee lopulta ohjata pyyntö osoitteeseen `/actors`.
    - `DELETE /actors/{actorId}` - polun parametri `actorId`, joka sisältää poistettavan näyttelijän tunnuksen. Poiston tulee lopulta ohjata pyyntö osoitteeseen `/actors`. Käytä kontrollerimetodin toteutuksessa annotaatiota `@DeleteMapping`.
- + 1p: Elokuvan lisääminen ja poistaminen onnistuu. Käyttöliittymän olettamat osoitteet ja niiden parametrit:<br/>
    - `GET /movies` - elokuvien listaus, ei parametreja pyynnössä. Lisää pyyntöön attribuutin `movies`, joka sisältää kaikki elokuvat ja luo sivun `/src/main/resources/templates/movies.html` pohjalta näkymän.
    - `POST /movies` - elokuvan lisäys, parametrit `name`, joka sisältää lisättävän elokuvan nimen, ja `lengthInMinutes`, joka sisältää elokuvan pituuden minuuteissa. Lisäyksen tulee lopulta ohjata pyyntö osoitteeseen `/movies`.
    - `DELETE /movies/{movieId}` - polun parametri `movieId`, joka sisältää poistettavan elokuvan tietokantatunnuksen. Poiston tulee lopulta ohjata pyyntö osoitteeseen `/movies`.
- + 2p: Näyttelijän voi lisätä elokuvaan (kun näyttelijä tai elokuva poistetaan, tulee myös poistaa viitteet näyttelijästä elokuvaan ja elokuvasta näyttelijään). Käyttöliittymän olettamat osoitteet ja niiden parametrit:<br/>
    - `GET /actors/{actorId}` - polun parametri `actorId`, joka sisältää näytettävän näyttelijän tietokantatunnuksen. Asettaa pyyntöön sekä attribuutin `actor` jossa näyttelijä-olio että attribuutin `movies`, jossa kaikki elokuvat, sekä luo sivun `/src/main/resources/templates/actor.html` pohjalta näkymän.
    - `POST /actors/{actorId}/movies` - polun parametri `actorId`, joka sisältää kytkettävän näyttelijän tietokantatunnuksen, ja parametri `movieId`, joka sisältää kytkettävän elokuvan tietokantatunnuksen. Lisäämisen tulee lopulta ohjata pyyntö osoitteeseen `/actors`.

</programming-exercise>
