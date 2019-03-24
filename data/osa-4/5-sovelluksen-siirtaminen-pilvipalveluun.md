---
path: '/osa-4/5-sovelluksen-siirtaminen-pilvipalveluun'
title: 'Sovelluksen siirtäminen pilvipalveluun'
hidden: true
---


<text-box variant='learningObjectives' name='Oppimistavoitteet'>

- TODO

</text-box>


Tutustutaan seuraavaksi sovelluksen siirtämiseen <a href="https://www.heroku.com/" target="_blank">Heroku</a>-pilvipalveluun. Heroku on palvelu, joka tarjoaa rajoitetun (ja ilmaisen) sijoituspaikan vähän resursseja kuluttaville sovelluksille. Toisin kuin aiemmin toteuttamiemme sovellusten tietokanta, Herokun käyttämä tietokannanhallintajärjestelmä on erillinen sovelluksesta, jolloin tietokantaan tallennetut tiedot pysyvät tietokannassa vaikka sovellus sammuisi välillä.

TODO: tarkemmin, herokulla tietokanta erillisellä palvelimella -- heillä käytössä postgresql

Seuraa ensin osoitteessa <a href="https://devcenter.heroku.com/articles/deploying-spring-boot-apps-to-heroku" target="_blank">https://devcenter.heroku.com/articles/deploying-spring-boot-apps-to-heroku</a> olevaa opasta Spring Boot -sovelluksen käytöstä Herokussa ja luo ensimmäinen pilvessä sijaitseva Heroku-sovelluksesi.


Jotta saisimme oman tietokantaa käyttävän sovelluksen Herokuun, tarvitsemme ajurin Herokun käyttämään PostgreSQL-tietokannanhallintajärjestelmään. Tämän saa käyttöön lisäämällä projektin `pom.xml`-tiedostoon seuraavan riippuvuuden.


```xml
&lt;dependency&gt;
    &lt;groupId&gt;org.postgresql&lt;/groupId&gt;
    &lt;artifactId&gt;postgresql&lt;/artifactId&gt;
&lt;/dependency&gt;
```


Luodaan seuraavaksi konfiguraatiotiedosto, jolla määrittelemme sovelluksen käyttöön PostgreSQL-kielen sekä pyydämme tietokantakyselyitä näkyville. Seuraava sisältö tulee tiedostoon `src/main/resources/application-production.properties`. Alla määritellyt parametrit kuten `${JDBC_DATABASE_URL}` tulevat Herokulta automaattisesti sovelluksen käynnistyksen yhteydessä.


```
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.url=${JDBC_DATABASE_URL}
spring.datasource.jdbcUrl=${JDBC_DATABASE_URL}
spring.datasource.username=${JDBC_DATABASE_USERNAME}
spring.datasource.password=${JDBC_DATABASE_PASSWORD}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.generate-ddl=true
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
```


Luodaan tämän jälkeen profiili tuotantokäyttöä varten. Profiili noudattaa Herokun opasta osoitteessa <a href="https://devcenter.heroku.com/articles/connecting-to-relational-databases-on-heroku-with-java" target="_blank">https://devcenter.heroku.com/articles/connecting-to-relational-databases-on-heroku-with-java</a>, mutta on käytössä vain profiililla `production`. Tämän avulla sovellus muuntaa Herokun antaman tietokantaosoitteen sovelluksen käyttöön.


```java
// pakkaus

@Configuration
@Profile("production")
public class ProductionProfile {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }
}
```

Luodaan lopulta vielä erillinen `Procfile`-tiedosto, jonka perusteella Heroku osaa käynnistää sovelluksen. Procfile-tiedoston sisältö on seuraava:


```
web: java $JAVA_OPTS -Dspring.profiles.active=production -Dserver.port=$PORT -jar target/*.jar
```


Tämän jälkeen sovelluksen siirtäminen tuotantoon onnistuu alkuperäisiä Herokun ohjeita noudattamalla.


Heroku määrittelee sovellukselle käynnistysparametrit sekä portin, jonka lisäksi määrittelemme aktiiviseksi profiiliksi tuotantoprofiilin. Kun sovellus siirretään herokuun, se käyttää Herokun tietokantaa. Toisaalta, kun sovellusta kehitetään paikallisesti, käytössä on testitietokanta -- ihan näppärää.


Voit kokeilla ReloadHeroes-sovellusta osoitteessa <a href="https://still-beyond-90359.herokuapp.com/" target="_blank">https://still-beyond-90359.herokuapp.com/</a>.


<text-box variant='hint' name='PostgreSQL ja Heroku'>


Jos Herokun PostgreSQL ei lähde edellä kuvatulla esimerkillä käyntiin, tarkasta vielä, että sovellukseen on lisätty Herokussa tietokannanhallintajärjestelmä. Tämä löytyy Herokusta sovelluksen Resources-välilehdeltä kohdasta Add-ons.

</text-box>
