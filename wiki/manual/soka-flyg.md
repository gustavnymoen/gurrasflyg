---
type: Guide
title: Söka flyg
description: Så fyller du i sökformuläret på startsidan – flygplatser, utresa och hemresa, antal resenärer – och söker.
resource: app/components/SearchForm.tsx
feature: TRIP-001, TRIP-009, TRIP-010
tags: [resenär, sök, flygplats, datum, kalender, startsida]
generated:
  by: claude
  at: 2026-10-26T11:10:10+01:00
---

# Söka flyg

Sökformuläret finns på startsidan, under rubriken "Vi ordnar det ingen annan kan". Där anger du var du vill resa från och till, när du reser dit och hem, och hur många ni är, och trycker **Sök**.

Överst på varje sida står **Gurras Flyg** med ett plan i en ring. Klicka på det för att komma tillbaka till startsidan. Har du börjat boka frågar sidan först om du vill avbryta, se [Flyg eller charter](flyg-eller-charter.md).

På mobilen ligger fälten under varandra i full bredd: **Från**, **Till**, **Utresa** och **Hemresa** bredvid varandra, **Resenärer**, och sist knappen **Sök**.

Varje fält har sitt namn i liten text överst i rutan: **Från**, **Till**, **Utresa**, **Hemresa** och **Resenärer**. Är fältet tomt står en ledtråd i det, till exempel "Varifrån?" eller "dd/mm". Fältet du skriver i får en vinröd kant.

## Välj flygplatser

1. Skriv några bokstäver i **Från**, till exempel "sto" eller "arn".
2. En lista med upp till fem flygplatser visas. Du kan söka på flygplatsens namn eller dess tre bokstäver långa kod (IATA-kod). Flygplatser vars namn börjar med det du skrivit visas först.
3. Klicka på flygplatsen, eller välj med piltangenterna och tryck **Enter** eller **Tab**. Den markerade flygplatsen väljs, och med **Tab** går du samtidigt vidare till nästa fält. Är det bara en träff är den redan markerad, så det räcker att trycka **Tab**. **Esc** stänger listan.
4. Gör likadant i **Till**.

Står det "Inga flygplatser matchar" finns ingen flygplats med det namnet eller den koden. Prova en annan stavning eller en del av namnet.

Ändrar du texten efter att ha valt en flygplats måste du välja flygplatsen igen i listan.

## Välj datum i kalendern

1. Klicka på **Utresa**. En kalender öppnas under fälten. Överst står vad du väljer, till exempel "Välj utresa".
2. Klicka på dagen du vill resa. Utresan visas i fältet, till exempel "13/11", och kalendern går vidare till **Hemresa**.
3. Klicka på dagen du vill resa hem. Kalendern stängs.

Du kan boka från och med i dag och upp till sex månader framåt. Dagar som inte går att välja är bleka. Dagens datum har en guldfärgad ring.

Hemresan kan vara samma dag som utresan (en dagstur) eller senare, högst två månader efter utresan. Dagarna mellan utresa och hemresa är markerade.

Längst ned i kalendern står det du valt, med veckodag och antal nätter, till exempel "Utresa fre 13 nov · Hemresa fre 20 nov · 7 nätter".

Vill du ändra ett datum klickar du på fältet igen och väljer en ny dag. Byter du utresa så att hemresan inte längre passar tas hemresan bort, och du väljer en ny.

Med pilarna **‹** och **›** byter du månad. Kalendern stängs när du trycker **Esc** eller klickar utanför den. Det du valt finns kvar.

## Enkel resa

Ska du bara resa dit slår du av **Tur och retur** i kalendern. Då försvinner **Hemresa**, kalendern visar en månad i taget utan sammanfattning längst ned, och den stängs när du valt datum. Slår du på det igen är **Hemresa** tom.

## Skriva datumet

Du kan också skriva datumet direkt i **Utresa** eller **Hemresa**, och trycka **Enter** eller gå vidare till nästa fält:

| Du skriver | Det betyder |
|---|---|
| 13/11 | 13 november, nästa gång det infaller |
| 13/11 2026 eller 13/11/2026 | 13 november 2026 |
| 2026-11-13 | 13 november 2026 |

## Med tangentbordet

I ett datumfält tar **pil ned** dig in i kalendern. Där flyttar piltangenterna en dag eller en vecka, **Page Up** och **Page Down** en månad, och **Home** och **End** till veckans början och slut. **Enter** väljer dagen och **Esc** stänger kalendern. **Tab** går mellan månadsknapparna, **Tur och retur** och dagarna.

## Antal resenärer

Använd **−** och **+**. Ni kan vara mellan 1 och 10 resenärer.

## Söka

Tryck på **Sök** när allt är ifyllt. Du kommer till sidan med flygen för din sökning, se [Välja flyg](valja-flyg.md).

**Från**, **Till** och **Utresa** måste vara ifyllda, och **Hemresa** när **Tur och retur** är på. Saknas något blir fältet rött med ett meddelande under, och ingen sökning görs.

## Felmeddelanden

Är något fel blir texten i fältet röd och en kort förklaring visas i röd text under fältet eller datumfälten.

| Meddelande | Vad det betyder | Gör så här |
|---|---|---|
| Välj var du vill flyga från. | Från är tomt när du tryckte Sök. | Välj en flygplats i Från. |
| Välj vart du vill flyga. | Till är tomt när du tryckte Sök. | Välj en flygplats i Till. |
| Välj datum för utresan. | Utresa är tomt när du tryckte Sök. | Välj eller skriv ett datum. |
| Välj datum för hemresan. | Hemresa är tomt, och Tur och retur är på. | Välj ett datum, eller slå av Tur och retur. |
| Ajja bajja, du måste flyga någonstans! | Från och Till är samma flygplats. | Välj en annan flygplats i ett av fälten. |
| Skriv datumet som 13/11 eller 2026-11-13. | Det du skrev är inte ett datum, eller dagen finns inte (till exempel 31/2). | Skriv dag och månad, eller hela datumet. |
| Datumet har redan passerat. | Datumet är före i dag. | Välj i dag eller ett senare datum. |
| Du kan boka max 6 månader framåt. | Datumet är längre fram än sex månader. | Välj ett tidigare datum. |
| Hemresan kan inte vara före utresan. | Hemresan är före utresan. | Välj samma dag som utresan eller senare. |
| Hemresan kan vara max 2 månader efter utresan. | Resan är längre än två månader. | Välj en tidigare hemresa. |

## Vanliga frågor

**Vilka flygplatser kan jag välja?** Gurras Flygs 51 flygplatser: svenska och nordiska flygplatser, stora flygplatser i Europa och några långdistansmål som New York, Chicago, Miami, Los Angeles, Toronto, Dubai och Bangkok.

**Kan jag vara fler än 10 resenärer?** Nej, max 10 per bokning.

**Varför kan jag inte välja ett datum om ett år?** Vi säljer resor högst sex månader framåt.

**Kan jag åka hem samma dag?** Ja. Välj samma dag som hemresa, så står det "Dagstur" längst ned i kalendern.

**Jag skrev 5/1 – vilket år blir det?** Nästa 5 januari från i dag. Vill du ha ett annat år skriver du det, till exempel "5/1 2027".
