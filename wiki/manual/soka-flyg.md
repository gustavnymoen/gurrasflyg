---
type: Guide
title: Söka flyg
description: Så fyller du i sökformuläret på startsidan – flygplatser, datum, antal resenärer och returresa.
resource: app/components/SearchForm.tsx
feature: TRIP-001
tags: [resenär, sök, flygplats, datum, startsida]
timestamp: 2026-10-22
---

# Söka flyg

Sökformuläret finns överst på startsidan. Där anger du var du vill resa från och till, vilket datum, hur många ni är och om du vill ha en returresa.

> Själva sökningen och listan med flyg är inte byggda än. Formuläret kontrollerar redan det du fyller i.

Varje fält har sitt namn i liten text överst i rutan: **Från**, **Till**, **Datum** och **Resenärer**. Är fältet tomt står en ledtråd i det, till exempel "Varifrån?" eller "Välj datum". Fältet du skriver i får en vinröd kant.

## Välj flygplatser

1. Skriv några bokstäver i **Från**, till exempel "sto" eller "arn".
2. En lista med upp till fem flygplatser visas. Du kan söka på flygplatsens namn eller dess tre bokstäver långa kod (IATA-kod). Flygplatser vars namn börjar med det du skrivit visas först.
3. Klicka på flygplatsen, eller välj med piltangenterna och tryck **Enter**. **Esc** stänger listan.
4. Gör likadant i **Till**.

Står det "Inga flygplatser matchar" finns ingen flygplats med det namnet eller den koden. Prova en annan stavning eller en del av namnet.

Ändrar du texten efter att ha valt en flygplats måste du välja flygplatsen igen i listan.

## Välj datum

Klicka på **Datum** och välj en dag i kalendern. Du kan boka från och med i dag och upp till sex månader framåt.

## Antal resenärer

Använd **−** och **+**. Ni kan vara mellan 1 och 10 resenärer.

## Returresa

Kryssa i **Boka returresa** om du vill resa tillbaka.

## Felmeddelanden

Är något fel får fältet en röd kant, värdet blir rött och en kort förklaring visas i röd text under fältet.

| Meddelande | Vad det betyder | Gör så här |
|---|---|---|
| Ajja bajja, du måste flyga någonstans! | Från och Till är samma flygplats. | Välj en annan flygplats i ett av fälten. |
| Datumet har redan passerat. | Datumet är före i dag. | Välj i dag eller ett senare datum. |
| Du kan boka max 6 månader framåt. | Datumet är längre fram än sex månader. | Välj ett tidigare datum. |

## Vanliga frågor

**Vilka flygplatser kan jag välja?** Gurras Flygs 51 flygplatser: svenska och nordiska flygplatser, stora flygplatser i Europa och några långdistansmål som New York, Chicago, Miami, Los Angeles, Toronto, Dubai och Bangkok.

**Kan jag vara fler än 10 resenärer?** Nej, max 10 per bokning.

**Varför kan jag inte välja ett datum om ett år?** Vi säljer resor högst sex månader framåt.
