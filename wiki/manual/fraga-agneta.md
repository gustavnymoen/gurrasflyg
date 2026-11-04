---
type: Guide
title: Fråga Agneta
description: Så ställer du frågor om våra charterresmål och om hur du bokar till Agneta i chatten (en panel vid sidan av sidan, eller en ruta på mobilen) på startsidan och charter-sidorna.
resource: app/components/Chat.tsx
feature: TRIP-017, TRIP-032, TRIP-033
tags: [resenär, charter, chatt, agneta]
generated:
  by: claude
  at: 2026-11-04T22:00:00+01:00
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

Vad du kan fråga: vad ett resmål är, hur du tar dig dit, vad du kan se, vad det kostar, vilka dagar resorna går och hur resmålen skiljer sig. Vet hon inte svaret säger hon det. Hon bokar inte åt dig utan visar hur du bokar på resmålets sida, se [Boka en charterresa](boka-charter.md).

**Skriv inga personuppgifter.** Frågorna skickas till Anthropic, som driver språkmodellen, och sparas inte hos oss.

## Minimera och stänga

- **Minimera chatten** (eller Escape) döljer chatten och lämnar bara knappen. Samtalet finns kvar: öppnar du chatten igen, eller går till en annan sida, är samtalet där och Agneta hälsar inte på nytt.
- **Stäng chatten** frågar först "Är du säker?". Svarar du **Ja, stäng och rensa** försvinner samtalet, och nästa gång du öppnar chatten är det en ny chatt där Agneta kopplas in och hälsar igen. Svarar du **Nej, behåll** fortsätter du som förut.

Samtalet sparas i din webbläsare tills du stänger fliken, och inget av det skickas till oss. En ny flik börjar med en tom chatt. Är chatten öppen när du går till en annan sida med chatten är den öppen där också.

## När något går fel

- **Agneta säger att det krånglar:** försök igen om en stund. Din fråga finns kvar i samtalet.
- **Hon säger att du har frågat nog:** du kan ställa högst 10 frågor på 5 minuter. Vänta så länge som det står.

[Användarmanual](index.md)
