---
id: TECH-010
title: Delete the old OneDrive folder
card: "#32"
depends_on: []
---

# TECH-010 Delete the old OneDrive folder: solution

How it is done. What is done and why (goal, scope, requirements) is in the card: `gh issue view 32`.

## Data

None. The local database in `~/Ai Projekt/gurrasflyg-data/` is outside both folders and is not touched.

## Interface

None. Visitors and the code see no change.

## Decisions

- **The old repo was at `…/OneDrive-AQCSwedenAB/AI projekt/gurrasflyg/gurrasflyg/`.** The folder the card names, `…/AI projekt/gurrasflyg/`, holds only that repo and a `.DS_Store`, so it is the one deleted. The rest of `AI projekt/` is not part of the project: at the user's request the course's starter `travel-workshop`, a Node folder and its archive were moved to the bin too (after checking that nothing used them), and the pipeline picture is kept.
- **"No work only in the old folder" was checked by content, not only with `diff -rq`.** The new folder has moved on since the move (TRIP-008 to TECH-011), so `diff -rq` lists many changed files. Instead, every file in the old folder (with the card's exclusions) was hashed with `git hash-object` and looked up in the new repo's object store. A file found there is in the new repo's history. The files not found were compared one by one: untracked files with `cmp`, and the tracked ones line by line with the version committed in TRIP-008.
- **Deleted by the user through OneDrive, not with `rm`.** The plan was to move the folder to the bin in Finder. That worked for the smaller items next to it, but not for the old repo: some of its files were only in the cloud (OneDrive had evicted them, the problem that made the project move), and Finder can't put those in the Mac's bin without downloading them. The user deletes the folder through OneDrive instead, so it lands in OneDrive's recycle bin and can be restored for a while.
