---
type: Guide
title: Tilldela plan till rutter
description: Så ger du alla flygbolagets rutter ett plan med knappen Tilldela plan.
resource: app/admin/AssignAircraftButton.tsx
feature: TRIP-005
tags: [admin, rutter, plan, tilldela]
timestamp: 2026-10-20
---

# Tilldela plan till rutter

Gurras Flyg har 200 rutter mellan 51 flygplatser, i båda riktningarna, med 2–3 avgångar om dagen. Varje rutt flygs med ett plan.

Uppe till höger på adminsidan finns knappen **Tilldela plan**. Under den står hur många rutter som har ett plan, till exempel "120 av 200 rutter har plan".

## Tilldela

Klicka på **Tilldela plan**. Varje rutt får ett slumpvis valt plan bland dem som finns. Tidigare tilldelningar ersätts. I tabellen **Plan** visar kolumnen **Rutter** hur många rutter varje plan fick.

Lägg till alla plan först, och tilldela sedan. Ett nytt plan får inga rutter förrän du klickar på **Tilldela plan** igen.

## Vanliga frågor

**Det står "Det finns inga plan att tilldela. Lägg till ett plan först."** Det finns inga plan. Lägg till ett under [Plan](admin-plan.md).

**Vad händer med rutterna om jag tar bort ett plan?** De blir utan plan. Klicka på **Tilldela plan** igen.

**Kan jag välja plan för en enskild rutt?** Nej, inte än.
