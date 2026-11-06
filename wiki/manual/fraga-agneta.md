---
type: Guide
title: Fråga Agneta
description: Så ställer du frågor om våra charterresmål och om hur du bokar till Agneta i chatten (en panel vid sidan av sidan, eller en ruta på mobilen), och hur du låter henne hjälpa dig att hitta och boka en charterresa med knappen Hjälp mig.
resource: app/components/Chat.tsx
feature: TRIP-017, TRIP-032, TRIP-033, TRIP-030
tags: [resenär, charter, chatt, agneta]
generated:
  by: claude
  at: 2026-11-06T12:00:00+01:00
---

# Fråga Agneta

Agneta Spydenius jobbar hos oss som kundtjänstmedarbetare (det står under hennes namn i chatten, med en grön prick och ordet "Live") och svarar på frågor om våra **charterresmål** och om **hur du bokar en charterresa**. Hon är sur och torr i tonen och klagar lite, men hon hjälper dig alltid. Hon kan inget annat: frågar du om vanliga flyg, väder, annat resande eller något helt annat säger hon nej och pekar dig till rätt ställe (flyg finns under fliken Flyg på startsidan).

## Öppna chatten

Knappen **Fråga Agneta**, med hennes bild, finns nere till höger på startsidan och på alla sidor under **Charter**. Tryck på den (eller tryck Enter när den har fokus).

- **På en bred skärm** öppnas chatten som en panel längs högerkanten. Sidan trycks ihop vid sidan av den, så du kan fortsätta bläddra medan du chattar.
- **På en smal skärm**, till exempel mobilen, öppnas chatten som en ruta som fyller skärmen.

Första gången du öppnar chatten i en flik står det "Kopplar in Agneta …" i några sekunder. Sedan hälsar Agneta med "Vad vill du?!", och markören står i fältet **Din fråga**.

## Ställa en fråga

1. Skriv din fråga, högst 500 tecken. Närmar du dig gränsen står det hur många tecken som är kvar.
2. Tryck **Skicka** eller Enter. Din fråga syns som en pratbubbla till höger, och medan Agneta tänker står det "Agneta tänker …".
3. Agnetas svar kommer som en bubbla till vänster. Svaren är korta. Frågar du om flera resmål får du en lista med en punkt per resmål: namnet är en länk till resmålets sida, med en kort sammanfattning, och under den en rad med flygplats och pris "från" per person. Resmål hon nämner är alltid länkar, också på startsidan. Hon svarar på det språk du frågar på, och minns de senaste frågorna, så du kan fråga vidare ("och hur tar jag mig dit?").

Vad du kan fråga: vad ett resmål är, hur du tar dig dit, vad du kan se, vad det kostar, vilka dagar resorna går och hur resmålen skiljer sig. Vet hon inte svaret säger hon det. Frågar du bara bokar hon inte åt dig utan visar hur du bokar på resmålets sida, se [Boka en charterresa](boka-charter.md). Vill du att hon hjälper dig gör du så här:

**Skriv inga personuppgifter.** Frågorna skickas till Anthropic, som driver språkmodellen, och sparas inte hos oss.

## Låt Agneta hjälpa dig

Ber du henne göra något och inte bara svara ("kan du boka åt mig?", "hjälp mig hitta en resa") svarar hon som vanligt, och under svaret kommer knappen **Hjälp mig**. Tryck på den (eller tryck Enter när den har fokus). Då står det **Agneta hjälper dig** överst i chatten, och markören står i fältet. Tryck **Sluta** när du vill att hon bara ska svara igen. Läget finns kvar tills du stänger och rensar chatten.

I det här läget kan hon:

- **Visa sidor åt dig.** Säger du "visa gruvor i Europa" öppnar hon listan med de filtren. Säger du resmål, datum och hur många ni är (till exempel "vi är tre, till Teufelsberg mellan dessa datum") och det finns resor både ut och hem, tar hon dig direkt till sidan **Plan och klass** med en utresa och en hemresa vald, och berättar vilka hon valde och varför. Du kan byta resor på sidan. Frågar hon efter flygplats (Arlanda eller Köpenhamn) svarar du en gång.
- **Berätta om resorna.** Hon får samma resor och priser som resultatsidan visar, och nämner inga andra. Går ingen resa de dagarna säger hon det och föreslår andra datum.
- **Hjälpa dig välja plan och klass.** På sidan Plan och klass går hon igenom vilka plan som har plats för er och vad en plats i varje klass kostar, och tycker något om dem. Vill du ha hennes förslag säger du det, och hon fyller i plan och antal per klass för båda resorna. Går det inte (planet är för litet eller antalen stämmer inte) säger hon vad som var fel och föreslår något annat. Hon nämner ingen flygtid för planen: en charterresa går när tidtabellen säger. Hon tar dig vidare till **Resenärer** först när plan och klasser är valda för båda resorna. Klassen går inte att byta på Resenärer: vill du ha en annan klass där skickar hon dig tillbaka till planen.
- **Välja tillägg och betalsätt.** Hon frågar en gång om du ser något tillägg i klasserna du valt (till exempel måltid) och sätter det åt alla resenärer på båda resorna; vill du ha olika ändrar du på sidan. Öl väljer du alltid själv. Hon frågar också en gång om du ser något av charterns extra tillägg och hur du vill betala, och fyller i dem på sidan. Dryckespaketet väljs aldrig när någon resenär är under 18.

Du styr själv hela tiden. Klickar du på sidan medan hon svarar, eller ändrar datum, filter, resa, tillägg eller betalsätt, utgår hon från det du gjorde, och ändrar sig inget över ditt huvud: har du hunnit ändra något innan hennes svar kommer säger hon det och frågar hur du vill ha det.

**Du fyller i uppgifterna själv.** Namn, åldrar, kontaktuppgifter och de tre frågorna skriver du på sidan Resenärer, aldrig i chatten, och inget av det skickas till Agneta. Hon vet bara om formuläret är rätt ifyllt eller inte.

### Boka med knappen

När formuläret är rätt ifyllt, resorna är valda och ett betalsätt är valt, sammanfattar Agneta resan (resmål, datum, resor, resenärer, tillägg och totalpris), och under sammanfattningen kommer knappen **Boka och betala**. Bokningen görs först när du trycker på den, på samma sätt och med samma kontroller som med **Betala** på betalningssidan (ingen riktig betalning görs). Går det bra kommer du till sammanfattningen av bokningen, och Agneta säger bokningsnumret. Går det inte står orsaken under knappen. Trycker du två gånger blir det en bokning.

## Minimera och stänga

- **Minimera chatten** (eller Escape) döljer chatten och lämnar bara knappen. Samtalet finns kvar: öppnar du chatten igen, eller går till en annan sida, är samtalet där och Agneta hälsar inte på nytt.
- **Stäng chatten** frågar först "Är du säker?". Svarar du **Ja, stäng och rensa** försvinner samtalet, och nästa gång du öppnar chatten är det en ny chatt där Agneta kopplas in och hälsar igen. Svarar du **Nej, behåll** fortsätter du som förut.

Samtalet sparas i din webbläsare tills du stänger fliken, och inget av det skickas till oss. En ny flik börjar med en tom chatt. Är chatten öppen när du går till en annan sida med chatten är den öppen där också.

## När något går fel

- **Agneta säger att det krånglar:** försök igen om en stund. Din fråga finns kvar i samtalet.
- **Knappen Boka och betala kommer inte:** formuläret på Resenärer är inte rätt ifyllt, ett betalsätt saknas eller en resa är inte vald. Rätta det på sidan och be Agneta sammanfatta igen.
- **Hon säger att du har frågat nog:** du kan ställa högst 10 frågor på 5 minuter. Vänta så länge som det står.

[Användarmanual](index.md)
