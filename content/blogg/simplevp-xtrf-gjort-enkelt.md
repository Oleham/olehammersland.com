+++
title = "SimpleVP – XTRF gjort enkelt!"
date = "2021-02-03T15:19:39+01:00"

#
# description is optional
#
description = "Python-prosjekt for å automatisere og forenkle filhåndtering i XTRF."

tags = ["automatisering","oversettelse","python","xtrf","effektivisering"]
+++

![Bilde av simpleVP](/images/blogg/bloggpost_simplevp/intro.gif)

Helt siden Norge gikk i lockdown, har jeg jobbet med et jobb/hobbyprosjekt som jeg nå begynner å bli veldig fornøyd med. Det er prosjekt som effektiviserer og automatiserer arbeidsflyten min knyttet til XTRFs Vendor Portal.

Jeg har lært mer om:

* Hvordan bruke HTTP, \~Verdensvevens\~ grunnmur.
* Hvordan lage en database og hvordan bruke SQL-spørringer.
* Et enkelt (og riktignok ikke særlig pent) brukergrensesnitt
* Masse Python
* Sortering av kode, bruk av Git etc.

Og det har ikke minst gjort meg til en mye mer effektiv oversetter!

Dette programmet er skrevet i Python og [ligger på min Github](https://github.com/Oleham/simplevp). Det er nyttig for oversettere som bruker XTRF Vendor Portal til å laste ned flere oppdrag hver dag, men som synes det blir litt vel tungvint.

Prosjektet startet slik jeg har blitt fortalt at alle gode programmeringsprosjekter startet – med et virkelig problem.

## Bakgrunn

Da jeg startet som fastansatt oversetter i 2018, ble jeg raskt konfrontert med [XTRF](https://xtrf.eu). 
XTRF er et såkalt TMS – Translation Management System – altså en avart av et CMS som er rettet mot språkbransjen. 

Det polske selskapet har som mål å strømlinjeforme arbeidet i språkbransjen. Taglinen deres er «Translation Made Simple». Systemet består av én kundeportal hvor kunder kan be om tilbud, én portal hvor leverandører kan finne prosjekter, og én Home-portal for alt det administrative i bakgrunnen. 
Oversettere som meg vil altså bli sendt til deres leverandørportal, eller Vendor Portal.

![Skjermdump av XTRFs Vendor Portal](/images/blogg/bloggpost_simplevp/vendorportal.jpg)  
*Skjermdump av Vendor Portal*

Dette skriver XTRF selv om leverandørportalen sin:
> XTRF’s Vendor Portal is your vendors’ one-stop-shop.
It’s where they accept jobs, access and upload files,
create invoices, and update their availability.

Som oversetter bruker man altså XTRF til å si ja til oppdrag, og til å laste ned ev. filer. Man har også tilgang til en oversikt over fullførte oppdrag som kan brukes som fakturagrunnlag. Ganske nyttig!

Mitt problem var bare det at jobben min involverte veldig, veldig mange *mindre* oppdrag. 
Bak mange av dem lå det en automatisert arbeidsflyt som forhåndsoversatte det meste, og som så spyttet de siste resterende setningene mot meg. En arbeidsdag kunne dermed involvere 30–40 oppdrag på kun 1–4 setninger. For alle disse oppdragene måtte jeg manuelt laste ned filene fra Vendor Portal.

Tillat meg, kjære leser, å ta deg med på denne uendelige lidelsen, trinn for trinn. 

Først måtte jeg velge et oppdrag fra listen, trykke last ned…

![Last ned](/images/blogg/bloggpost_simplevp/xtrf_vendorportal_dl_button.JPG)

…velge lokal mappe. Pakke ut. Oversette! Eksportere. Trykke last opp…

![Last opp](/images/blogg/bloggpost_simplevp/xtrf_vendorportal_ul_button.jpg)

Velge fra lokal mappe, lokalisere filen…

…trykke avslutt.

![Avslutt](/images/blogg/bloggpost_simplevp/xtrf_finish_button.jpg)

…bekrefte avslutt.

![Bekrefte avslutt](/images/blogg/bloggpost_simplevp/xtrf_finish_button2.jpg)

…og det 40 ganger, dag inn, dag ut.

Sammenlagt ender man opp med å bruke veldig mye tid på å klikke på grafiske elementer. Selv om jeg etterhvert er i stand til å gjøre det med bind for øynene, i fritt fall, med armene bundet på ryggen, vil jeg jo aller helst kunne konsentrere meg om oversettelsen! 

Den ideelle situasjonen ville være at alle disse oppdragene bare er en lang, uavbrutt rekke med tekst.
Jeg vil ha så få muligheter til å falle ut av flytsonen som mulig.

## simpleVP

En dag, mens jeg satt i en transe og klikket på grønne knapper, drømte jeg opp «simpleVP». En leverandørportal av folket – for folket. A powerful tool enabling freedom to enjoy what really matters to you. We take care of the rest. Eller noe annet sånn bullshit.

Den første iterasjonen av simpleVP var et Python-skript som fjernstyrte en nettleser. Det var ganske ålreit, fordi det i det minste tok seg av all klikkingen. Jeg kunne stikke bort på kjøkkenet og hente meg en kaffe, og i mellomtiden navigerte simpleVP versjon 1 seg gjennom leverandørportalen, lastet opp filen, avsluttet oppdraget og startet neste oppdrag. [Til dette brukte jeg det som heter Selenium.](https://www.selenium.dev/).

Men til tross for nytelsen det er å kunne se på at musepekeren flytter seg magisk over skjermen – om jeg virkelig ville spare inn verdifull tid, måtte programmet jobbe enda litt raskere enn det.

Etter mye prøving og feiling fant jeg, med god hjelp, til slutt noe som fungerte enda bedre: simpleVP versjon 2!

![simpleVP versjon 2](/images/blogg/bloggpost_simplevp/simplevp_list_view.jpg)  
*Listevisningen til simpleVP.*

Programmet fungerer nå som en veldig forenklet utgave av Vendor Portal. Man velger dato i kalenderen til høyre, og har så valget om å vise alle oppdrag med nedlastbare filer, eller vise absolutt alle oppdrag med frist på valgt dato.

Når man trykker på oppdater-symbolet (♻️), vil simpleVP legge til nye oppdrag i listen eller endre status på oppdrag – litt som i nettleseren.

Det som gjør simpleVP spesielt nyttig, er at man kan velge flere oppdrag med sjekkboksene ute til venstre. Når man trykker på download, vil **alle** filene lastes ned til mappen som er definert, uten noe om og med. Mappen vil kun inneholde filene som ble lastet ned sist.

Nå trenger jeg ikke lenger forlate oversettelsesprogrammet mitt, men kan jobbe meg gjennom fil for fil, uten avbrytelser. Jeg bruker en hurtigtast for å pakke ut neste prosjekt i nedlastningsmappen, og det går lynraskt.

På samme måte kan jeg slenge alle ferdige prosjekter inn i en mappe, uten å memorere filnavn eller tenke noe videre over det. Når filen skal lastes opp, finner simpleVP selv frem til riktig fil, laster den opp og avslutter oppdraget.

![simpleVP versjon 2](/images/blogg/bloggpost_simplevp/simplevp_list_status.JPG)  
*Slik ser det ut på en typisk arbeidsdag.*

Programmet, eller databasen, holder selv styr på hvilke oppdrag som er lastet ned, lastet opp, eller som har blitt avsluttet (OK). Grunnen til at det er to separate statuser for opplastet og OK, er at det ikke fungerer feilfritt hver gang på grunn av en intern feil i XTRF-systemet. I slike tilfeller er det lettest å bruke nettleseren til forsøke å stenge oppdraget, siden det trengs flere tilløp.

## Arktitekturen bak

![Databasen](/images/blogg/bloggpost_simplevp/sVP_explanation.png)  
*En --elegant-- fremstilling av arkitekturen bak.*

simpleVP benytter seg av det man kaller et API -- *application programming interface*. Når jeg bruker XTRF sin opprinnelige Vendor Portal, blir det sendt en forespørsel til XTRF sin server, som svarer med en strukturert oversikt over alle tilgjengelige oppdrag i JSON-format.

For å lage simpleVP har jeg ganske enkelt undersøkt hvilke forespørsler som sendes i nettleseren min når jeg besøker vendor portal. Så har jeg skrevet et python-program som sender akkurat de samme forespørslene som nettleseren min gjør.
Om jeg bare formulerer forespørselen riktig, bryr ikke serveren til XTRF seg om det er en nettleser eller et python-skript som står bak: den bare svarer med ønsket informasjon.

Hele cluet er altså å lage et program som emulerer nettsiden til XTRF. Kommunikasjonen foregår etter HTTP -- *Hyper Text Transfer Protocol*. 

Informasjonen som returneres, lagres så i min lokale database. Det er oppdragsnummer, frist, størrelsen på oppdraget, prosjektlederen osv. 

Det siste leddet i programmet er selve det grafiske brukergrensesnittet, altså «vinduet». Det er et eget program som tegner opp et vindu ved hjelp av Python sitt tkinter-bibliotek. Programmet sender en forespørsel til min lokale database, for eksempel «vis alle oppdrag som har frist mandag 12.01.2021». Databasen svarer, og informasjonen sorteres til en rekke setninger som listes opp ved siden av en rekke sjekkbokser. Brukeren kan nå interagere med disse sjekkboksene, og programmet vil knytte det til riktig underliggende oppdrags-ID.

Dermed kan brukeren selv styre opplastning og nedlastning av individuelle oppdrag.

## Veien videre

simpleVP er et lite hjertebarn som jeg bruker hver dag, og jeg vet at flere tidligere kolleger i GLOBALscandinavia også bruker det. Jeg fortsetter inntil videre å utvikle det på samme måte som jeg har gjort hele tiden: jeg fikser småfeil her og der når jeg kommer over dem og legger til forbedringer når jeg føler for det. Det er ikke et disiplinert prosjekt, men det har vært veldig lærerikt.

Akkurat nå er det så klart veldig tilpasset oppdrag fra et visst oversettelsesbyrå og en viss type oppdrag, men jeg ser for meg at jeg etterhvert vil bruke det for andre oversettelsesbyråer som bruker XTRF-systemet.

Jeg vil også lage et nytt prosjekt opp mot XTRF Vendor Portal som skal la meg generere egne fakturaer automatisk. Det vil fungere på omtrent samme måte, men produktet vil da bli en spesifikasjonsliste på en faktura, og ikke en liste med sjekkbokser på et grafisk brukergrensesnitt.

[Last ned simpleVP 2.0 her!](https://github.com/Oleham/simplevp) Alltid gøy med kommentarer, tips og råd! :)
