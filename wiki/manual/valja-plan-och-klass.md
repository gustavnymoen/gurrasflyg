---
type: Guide
title: Välja plan och klass
description: Så väljer du, ett flyg i taget, plan och hur många resenärer som sitter i varje klass, och ser vad resan kostar och hur lång tid den tar.
resource: app/flyg/plan/
feature: TRIP-011, TRIP-024, TRIP-026, TRIP-012, TRIP-039, TRIP-043
tags: [resenär, plan, klass, pris, flygtid, ankomst]
generated:
  by: claude
  at: 2026-11-06T16:00:00+01:00
---

# Välja plan och klass

När du valt flyg och tryckt **Fortsätt** under **Din resa** kommer du till sidan **Välj plan och klass**. Här väljer du vilket plan du vill flyga med och var resenärerna ska sitta, ett flyg i taget.

Överst ser du stegen i bokningen: **Flyg**, **Plan och klass**, **Resenärer** och **Betala**. Under dem står **Din resa**: flygen du valt, hur många ni är och, när du valt plan, planet, flygtiden och när du landar.

Överst står en kort förklaring: "Välj plan och fördela resenärerna på klasser. Hemresan kommer sedan." Varje flyg har ett eget kort, **Utresa** och, om du reser tur och retur, **Hemresa**. Du börjar med utresan; hemresan visas när du gjort klart utresan och tryckt **Fortsätt**.

Allt du väljer står i sidans adress. Du kan ladda om sidan utan att något försvinner: flyg som är klara visas hopfällda, och det första som inte är klart är öppet.

## Välj plan

Gurras Flyg har allt från luftskepp till stridsflygplan, och du väljer själv. Varje plan som har plats för er alla är en rad med:

- **planets namn** och hur många platser det har,
- **flygtiden** med just det planet, till exempel "9 h 20 min", och **när du landar**, i lokal tid där du landar. "+1" betyder att du landar dagen efter,
- **priset per person** i planets billigaste klass,
- **hur det står sig**: det billigaste planet är märkt **Billigast** och, när du bokar flyg, det snabbaste **Snabbast**. De andra visar hur mycket dyrare och långsammare de är, till exempel "+4 500 kr / person" och "+3 h 10 min". I charter flyger alla plan på samma tid, så där märks bara det billigaste planet.

Tryck **Välj** på raden för det plan du vill ha. Raden öppnas och visar planets klasser. Bara en rad är öppen i taget: trycker du **Välj** på ett annat plan fälls den första ihop. Du kan välja olika plan för utresan och hemresan. Andra resenärers bokningar spelar ingen roll: varje bokning får ett eget plan.

Har inget plan plats för så många resenärer står det till exempel "Inget plan har plats för 5 resenärer.". Gå då tillbaka med **Till flygen** och sök för färre resenärer.

## Välj klasser

I den öppna raden står planets klasser, billigast först, med priset per person, antal platser och hur mycket dyrare klassen är än den billigaste.

Från början har varje klass 0 resenärer. Tryck **+** vid en klass för att lägga till en resenär där, och **−** för att ta bort en. En klass kan inte ta fler resenärer än den har platser. När en knapp inte går att använda (alla har en klass, klassen är full eller har 0) blir den blek, men står kvar där du är om du använder tangentbordet.

Överst i raden står hur många resenärer som är placerade, till exempel "1 av 2 placerade". När alla har en klass blir det en bock.

**Bara ett plan kan ha resenärer.** Lägger du en resenär i en klass på ett annat plan flyttar alla resenärerna dit, och det första planet blir tomt. Att bara öppna en rad ändrar ingenting.

Priset räknas om direkt: **Totalt för utresan** (och hemresan) är varje klass pris gånger antalet resenärer i den hittills, och **Totalt för resan** längst ned är summan. Innan någon har en klass är det 0 kr.

Knappen **Fortsätt** i raden tänds när alla resenärer har en klass. Innan dess är den blek och bredvid står hur många som är kvar, till exempel "Placera ut 1 resenär till". När du trycker **Fortsätt** fälls flyget ihop till en sammanfattning med planet, hur många som sitter i varje klass och vad flyget kostar, och hemresan visas. På det sista flyget (hemresan, eller utresan om du reser enkel) tar **Fortsätt** dig direkt till resenärerna, se [Boka resan](boka-resan.md).

## Ändra ett val

- Klicka på ett **hopfällt flyg** för att öppna det igen och ändra planet eller klasserna. Det andra flyget påverkas inte: ändrar du utresan finns valen för hemresan kvar. Tryck sedan **Fortsätt** igen.
- Kommer du tillbaka hit från resenärerna är alla flyg hopfällda. Klicka på det sista flyget och tryck **Fortsätt** för att gå vidare igen.
- Klicka på **Flyg** bland stegen överst för att gå tillbaka till flygen. Ändrar du inget finns allt kvar när du går vidare igen. Väljer du **ett annat flyg** får du välja plan och klasser för det flyget igen.

## I charter

Samma steg finns när du bokar en charterresa, se [Boka en charterresa](boka-charter.md). Där är avgångens pris grunden och flygtiden och ankomsten är alltid resans egna, så planets tidsfaktor syns inte.

## Vanliga frågor

**Varför kostar samma flyg olika mycket med olika plan?** Varje plan och varje klass har sin egen prisfaktor. Priset är avgångens pris gånger planets och klassens faktorer.

**Varför står "från" i sökresultaten?** "Från"-priset är det billigaste du kan flyga flyget för: med det billigaste planet som har plats för er alla, i dess billigaste klass.

**Kan jag välja plats i planet?** Nej, du väljer klass, inte plats.

[Användarmanual](index.md)
