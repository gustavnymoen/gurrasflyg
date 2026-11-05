---
type: Guide
title: Boka en charterresa
description: Så söker du en charterresa från ett resmåls sida, väljer ut- och hemresa, plan och klass, fyller i resenärerna, väljer tillägg, betalar och får ditt bokningsnummer.
resource: app/charter/
feature: TRIP-014, TRIP-039
tags: [resenär, charter, bokning, plan, klass, tillägg, betalning, bokningsnummer]
generated:
  by: claude
  at: 2026-11-05T18:00:00+01:00
---

# Boka en charterresa

En charterresa är alltid tur och retur: du reser från **Stockholm Arlanda** eller **Köpenhamn Kastrup** till resmålets flygplats, och hem till samma flygplats. Du hittar resmålet under [Charter](charter-resmal.md) och börjar på resmålets sida.

## Söka resor

På resmålets sida, bredvid texten (under bilden på en mobil), finns formuläret **Sök resa**. Går det inga flyg till resmålet finns inget formulär.

1. Välj **Avresa från**: Stockholm Arlanda eller Köpenhamn Kastrup.
2. Välj **Utresa** och **Hemresa**. Tryck i fältet så öppnas en kalender, eller skriv datumet som 11/1. Bara dagar då en resa går går att välja; de andra är nedtonade. Du kan boka från idag och sex månader framåt, och hemresan får vara samma dag som utresan och högst två månader efter. Skriver du en dag utan resa står det "Det går ingen resa den dagen.". Byter du avresa försvinner datum som inte passar.
3. Välj hur många **Resenärer** (1 till 10) med **−** och **+**.
4. Tryck **Sök resor**. Saknas ett datum blir fältet rött med en text, och markören hamnar i det första.

Sökningen står i webbadressen, så du kan ladda om sidan eller skicka länken. Personuppgifter står aldrig där.

## Välja resor (steget Resa)

Först väljer du **utresa**. Varje resa visar när den går och landar (med **+1** om du landar nästa dag; tiden är lokal tid där du landar), flygbolag och flygnummer, restiden, om den är **Direkt** eller har byten ("1 byte i Frankfurt") och priset per person. Du kan sortera på **Avgångstid** eller **Pris**; är priset lika kommer den tidigaste först. Tryck **Välj** på resan du vill ha.

Då öppnas listan med **hemresor**. Där finns bara resor som går efter att din utresa har landat. Välj en hemresa på samma sätt.

Till höger (under listorna på en mobil) står **Din resa** med det du valt, antalet resenärer och **Totalt för resan**: priset för utresa plus hemresa gånger antalet resenärer, innan du valt plan och klass. Tryck **Fortsätt** när du har valt båda, så kommer du till steget Plan och klass.

Byter du utresa och hemresan inte längre passar tas den bort, och du väljer en ny. Byter du en resa försvinner också plan och klasser du valt för just den resan. Allt du valt står i webbadressen och finns kvar om du laddar om sidan eller går tillbaka från ett senare steg. Finns ingen resa den dagen står det "Inga resor den här dagen." med en länk tillbaka till sökningen.

## Välja plan och klass

Steget **Plan och klass** är samma som när du bokar flyg, se [Välja plan och klass](valja-plan-och-klass.md): du väljer ett plan för utresan och ett för hemresan, och hur många resenärer som sitter i varje klass. Alla plan går på alla resor, så det är bara antalet platser som avgör vilka som visas. Skillnaden mot flygbokningen är att **flygtiden och ankomsten alltid är resans egna**, vilket plan du än väljer.

Priset per person är resans pris gånger planets och klassens prisfaktor. Överst står **Din resa** med planet och antalet i varje klass, och längst ned **Totalt för resan**. Har inget plan plats för så många resenärer står det "Inget plan har plats för N resenärer."; tryck då **Ändra antal resenärer** och sök för färre. Tryck **Klar** på varje resa och sedan **Fortsätt**.

Kommer du till Resenärer eller Betala utan plan och klasser, till exempel med en gammal länk, hamnar du här. Resorna finns kvar, men planen väljer du själv.

## Resenärer

Steget **Resenärer** har ett kort för varje resenär, **Passagerare 1**, **Passagerare 2** och så vidare, där du fyller i förnamn, efternamn och ålder (1 till 120). Sedan fyller du i **Kontaktperson** (förnamn, efternamn, e-post, telefon och adress) och svarar på **Tre viktiga frågor** genom att kryssa i alla tre. Reglerna och texterna är samma som när du bokar flyg, se [Boka resan](boka-resan.md). Det finns ingen Dåliga nerver i charter.

Under varje resenär står, för utresan och hemresan, **klassen** resenären sitter i, till exempel "Klass: Business, 4 560 kr". Den går inte att ändra här: resenärerna får klasser i ordning från det du valde i steget Plan och klass, den dyraste klassen först. Vill du ändra klasserna trycker du **Ändra plan och klasser**. Under klassen kan du välja de **tillägg** som finns i just den klassen, med **−** och **+** (högst 10 av varje). Öl går bara att köpa för den som är 18 år; blir åldern lägre tas ölen bort och det står en text om det.

Ändrar du klasserna i steget Plan och klass och går tillbaka hit står det vilka tillägg som togs bort ("Dessa tillägg togs bort eftersom klasserna ändrats: …"). Namn, åldrar, kontaktuppgifter och tilläggen för hela resan finns kvar.

Det du fyller i sparas bara i den här fliken och försvinner när du stänger den. Ändrar du antal resenärer läggs resenärer till eller tas bort, och resten finns kvar.

### Tillägg för hela resan

Under **Tillägg för hela resan** kryssar du i det du vill ha. Priset är per person och gäller alla resenärer, och du kan välja vilka du vill tillsammans:

- **Den ultimata upplevelsen**, 1 000 kr per person: vår guide förbereder något extraordinärt till din resa.
- **Bear Grylls Experience**, 2 000 kr per person: utan guide, du blir lämnad i vildmarken på väg till destinationen och får själv hitta dit, på egen risk.
- **Dryckespaket XXXL**, 4 000 kr per person: dryck så det räcker hela resan. Går inte att välja när någon resenär är under 18 år; då står det vid rutan. Har du valt det och ändrar sedan en ålder till under 18 tas det bort, och det står en text om det.

Varje tillägg du valt står i **Din resa** med sin summa, och totalen räknas om direkt. Tilläggen i klasserna kommer utöver de här och räknas med i totalen.

Tryck **Till betalning** när allt är ifyllt. Saknas något blir fältet rött med en text om vad du ska göra, och markören hamnar i det första.

## Betala

Välj **Cash till piloten** eller **Vi hämtar pengarna hos dig** (ingen riktig betalning görs) och tryck **Betala**. Under **Att betala** ser du hur summan delas upp: bränsle, mutor, diverse ospecificerade avgifter, försäkring och skatt (0 %). Luftrummet stänger vi bara för våra egna plan, så i charter går de pengarna till mutorna i stället. Har du inte valt betalsätt står det "Välj hur du vill betala.". Vill du ändra något trycker du **Tillbaka till resenärerna** eller på ett steg överst. Har något i resan ändrats sedan du valde den, till exempel att en resa inte längre går eller att planet inte längre finns, står det "Något i resan har ändrats sedan du valde den. Gå tillbaka till Resa och välj igen." och ingenting sparas. Trycker du **Betala** mer än 10 gånger på 15 minuter står det "För många försök. Försök igen om N minuter.". Vänta så många minuter som det står och försök igen.

## Bokningen är klar

Du ser **Tack för din bokning!**, ditt **bokningsnummer** (CH- och sex tecken, till exempel CH-K7M2QX) och en sammanfattning: resorna med tider, planet och hur många som sitter i varje klass på varje resa, resenärerna med klass och tillägg, tilläggen för hela resan, kontaktpersonen, betalsättet och totalen. Sammanfattningen visas bara direkt efter bokningen, i samma flik. Spara bokningsnumret: bokningen går inte att öppna igen på sajten.

## Avbryta

På alla sidor efter sökningen finns **Avbryt**. Den frågar "Är du säker?"; **Ja, avbryt** kastar bort det du valt och fyllt i och tar dig till Charter, **Nej, fortsätt** låter allt vara kvar. Se också [Flyg eller charter](flyg-eller-charter.md).

[Användarmanual](index.md)
